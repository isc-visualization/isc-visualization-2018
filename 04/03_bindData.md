D3 데이터 연결 기초
===
`Interactive Data Visualization For the Web. Chapter 5`

셀렉션 기초
---

```html
<div class="container">
</div>

```

```javascript
d3.select("div.container").append("p").text("새 문단 추가");
```

- 체이닝 기법 Chaining Methods
 - jQuery등에서 흔히 사용
 - 연쇄적으로 return 되는 값을 활용

```javascript
d3.select("div.container")
  .append("p")
  .text("새 문단 추가");
```

```javascript
var container = d3.select("div.container");
var p = body.append("p");
p.text("새 문단 추가");
```

- 요소별 보기

 - d3 : d3 라이브러리의 d3 오브젝트를 가져옴

 - `.select("body")` :
   - d3의 [select()](https://github.com/d3/d3-selection#selection) 명령은 CSS 셀렉터와 마찬가지의 방식으로 DOM 요소를 가져올 수 있음
   - 현재는 *첫번째 body 태그* 를 가져옴
   - 여러개의 태그를 동시에 선택하고 싶을 때는 [selectAll()](https://github.com/d3/d3-selection#selectAll)을 사용
 - `.append('p')` :
   - [append()](https://github.com/d3/d3-selection#selection_append)는 새로운 DOM 요소를 현재 셀렉션 *끝에* 삽입
   - 현재는 body 안에 빈 p를 삽입
 - `text("새 문단 추가 ")` :
   - [text()](https://github.com/d3/d3-selection#selection_text)는 태그 내부에 텍스트 삽입 `<tag>text</tag>`
   - 현재는 p 태그 사이에 인자로 넘겨진 텍스트를 삽입 `<p>새 문단 추가</p>`




데이터 연결
---
```javascript
var dataset = [ 5, 10, 15, 20, 25 ];
```

1. 연결될 셀렉션들을 selectAll로 지정
```javascript
d3.select("div.container").selectAll("p")
```
  - 현재는 비어있기 때문에 empty selection => 앞으로 `p`를 추가할 예정

2. [data()](https://github.com/d3/d3-selection#selection_data) 로 데이터셋 불러오기
```javascript
d3.select("div.container").selectAll("p")
  .data(dataset)
```
 - data()는 data array의 요소들을 현재 셀렉션의 그룹들과 연결join 시키고 the update selection을 반환
 - 반환된 update selection에서 enter와 exit selection 정의 가능
 - 실제로는 엘리먼트 노드의 `__data__` 속성에 저장
 - 5개의 데이터가 각각 불러옴

3. enter()로 데이터의 개수에 부족한 셀렉션들만 선택
```javascript
d3.select("body").selectAll("p")
  .data(dataset)
  .enter()
```
 - [enter()](https://github.com/d3/d3-selection#selection_enter)는 현재 들어온 데이터와 비어있는 셀렉션을 보고 이들을 연결할 수 있는 placeholder nodes를 반환 (the enter selection)
 - 개념적으로 enter()의 셀렉션은 부모 셀렉션을 가리킴

4. append('p')는 비어있는 셀렉션에 p 태그를 삽입
```javascript
d3.select("body").selectAll("p")
  .data(dataset)
  .enter().append("p")
    .text("새 문단")
```
 - enter()에 의해 반환 받은 empty placeholder nodes에 p태그 DOM을 삽입

- 개발자 도구에서 `console.log(d3.selectAll("p"))`로 노드 확인해보기


데이터 활용
---
- 위 예제에서 [text()](https://github.com/d3/d3-selection#selection_text)의 경우 넘겨진 데이터를 anonymous function을 콜백함수로 전달하여 직접 받아올 수 있음

> if the value is a function, then the function is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element.

```javascript
 function(d,i,nodes) { // 개별 셀렉션에 돌아가며 실행됨
   //d는 현재 넘겨진 데이터
   //i는 현재 셀렉션의 전체 셀렉션 중 순서
   //nodes는 전체 셀렉션 그룹
   //d,i,nodes는 컨벤션 일뿐 이름은 아무렇게나 지어도 상관없음(순서롤 보고 해당 인자를 넘김)
 }
```

```javascript
.text(function(d) {
    return d;
});
```
```javascript
.text(function(d) {
    return "현재 값은 " + d + " 입니다.";
});
```
```javascript
.text(function(d,i) {
    return (i+1) + "번째 값은 " + d + " 입니다.";
});
```

- 현재 셀렉션에 style()이나 attr() 적용 가능

```javascript
.style("color", "red")

.style("color", function(d) {
    if (d > 15) {   //Threshold of 15
        return "red";
    } else {
        return "black";
    }
});
```


```javascript
.red {
  color : red;
}

.attr("class", "red")

.attr("class", function(d,i) {
  if(i % 2 === 0) return 'red';
})

.classed("red", true)

.classed("red", function(d,i) {
  return i % 2 === 0;
})
```

** 참고 ** 
``` html
<!DOCTYPE html>
<html>
    <head>
        <title>Page Title</title>
        <meta charset="UTF-8">
        <style>
        .red {
          color: red;
        }
        .green {
          color: green;
        }
        </style>
        <script type="text/javascript" src="https://d3js.org/d3.v5.min.js"></script>
    </head>
    <body>
      <div id="chart">
        <p></p>
      </div>
      <script>
      var dataset = [ 5, 10, 15, 20, 25 ];
      var updateSelection  = d3.select("#chart").selectAll("p")
        .data(dataset);

      var enterSelection = updateSelection.enter();
      enterSelection.append('p')
        .text(function(d,i) {
          return (i+1) +'번째 - 값: ' + d + ' - ' + '엔터 셀렉션';
        })
        .classed('red', true);

      updateSelection.text(function(d,i) {
        return (i+1) +'번째 - 값 ' + d + ' - ' + '업데이트 셀렉션';
      }).classed('green', true);
      </script>
    </body>

</html>

```