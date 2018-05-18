축 axes
===

![axis](https://raw.githubusercontent.com/d3/d3-axis/master/img/custom.png)

- 축axis은 특정한 scale을 시각적 형태로 변환한 결과
- [d3-axis](https://github.com/d3/d3-axis) 모듈을 활용하여 자동화 한다
 - d3의 경우 자동으로 tick을 그려주는 기능이 강력

여백 미리 설정하기
---

- 여백 지정하고, 스케일 수정

```javascript
var margin = {top: 20, right: 20, bottom:20, left:20};
var innerW = w - margin.left - margin.right,
 innerH = h - margin.top - margin.bottom;

var xRange = [0, innerW];
var yRange = [innerH, 0];
```

- svg에 g부터 삽입하고 기타 요소 추가 하기

```javascript
var svg = d3.select('#vertical')
  .append('svg')
    .attr('width', w)
    .attr('height', h)
  .append('g') //실제 차트가 그려질 공간은 별도로 설정
    .attr('transform', 'translate(' +[margin.left, margin.top]+ ')'); // svg > g의 사이즈는 innerW X innerH라고 가정

...

rect.attr('height', function(d){return innerH - xy.get(this)[1]}); //막대의 높이 계산은 h대신 innerH 사용
```


x축 설정하기
---
- d3.axisBottom을 활용
- x 좌표 설정에 사용된 axis를 전달

```javascript
var xAxis = d3.axisBottom(x); //x축을 그릴 아래방향 axis에 x 스케일을 전달한다. 결과값인 xAxis는 g를 받아 축을 그려주는 함수(axis generator)가 된다.
```

- svg에 x축 공간 추가 하기
```javascript
svg.append('g') //g를 먼저 추가하고
  .attr('class', 'x axis')
  .call(xAxis); //xAxis를 실행
```

 - [selection.call](https://github.com/d3/d3-selection#selection_call) : 현재 selection을 인자로 받는 함수를 실행시킨다. 

```javascript
function callFunc(selection, arg1) {
  // do something with selection and arg1
  /*
  ...
  */
  return selection;
}
callFunc(sel, a1);

//위의 callFunc 와 같다.
sel.call(callFunc, a1);
```


- 축 이동시키기

```javascript
svg.append('g') //g를 먼저 추가하고
  .attr('class', 'x axis')
  .call(xAxis); //xAxis를 실행
  .attr('transform', 'translate('+ [0, innerH]+ ')') // 축이 아래로 이동하도록 translate한다.
```

- 스타일링

```javascript
xAxis.tickSize(0) //xAxis의 tickSize를 없애고
  .tickPadding(6); //간격을 6px로 설정
```
```css
.axis path.domain {
  stroke : none;
}
```

Y축 추가하기
---

- x축과 동일한 패턴
```javascript
var yAxis = d3.axisLeft(y) // 왼쪽에 tick이 그려지는 axis
  .tickSizeOuter(0)
  .tickSizeInner(-innerW); // 그리드를 그려주기 위해 반대방향으로 tick 그려줌 

svg.append('g')
  .attr('class', 'y axis')
  .call(yAxis);
```

- tick 개수를 조정

```javascript
yAxis.ticks(5);
```

- 혹은, [nth-child](http://devdocs.io/css/:nth-child) 사용한 스타일링

```css
.y.axis .tick:nth-child(2n+1) line {
  opacity : .25;
}
.y.axis .tick:nth-child(2n+1) text {
  visibility: hidden;
}
```