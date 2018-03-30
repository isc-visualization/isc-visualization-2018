DIV로 바챠트 그리기
===

목표
---
- d3와 HTML을 이용하여 바챠트를 그려본다
- 수직/수평 방향을 각각 그려본다


HTML 세팅
---

```html
<div id="chart">
  <div id="horizontal"></div>
  <div id="vertical"></div>
</div>
```

CSS 세팅
----

 - 공유되는 설정과 아닌 것을 구분한다.

```css
.bar { /* 개별 막대 */
  background-color: steelblue;
}
#horizontal .bar { /*수평*/
  margin-bottom : 8px;
  text-align: right;
}
#vertical .bar { /*수직*/
  margin-right : 8px;
  display : inline-block;
  position : relative;
}
```

수평 방향 그리기 (Horizontal Bar Chart)
---

 - `width`를 값에 따라 조절

```javascript
var data = [200, 300, 400, 500, 100];
d3.select('#horizontal').selectAll('.bar')
  .data(data)
.enter().append('div')
  .attr('class', 'bar') //.classed("bar", true)
  .style('width', function(d){return d + 'px';})
  .text(function(d){return d;})

```

수평 방향 그리기 (Vertical Bar Chart | Column Chart)
---

 - 수평방향으로 이동 : css에서 `display:inline-block`을 사용
 - 막대의 길이 : `height`를 변경한다.
 - 아래에서 위로 올라오기 
   - `position:relative` : 원래 위치에서 상대적으로 이동
   - 좌표계의 Y축이 반대방향 이므로 `top`을 통해 전체 높이에서 빼주도록 한다.

```javascript
var bar = d3.select('#vertical').selectAll('.bar')
  .data(data)
.enter().append('div')
  .attr('class', 'bar')
  .style('top', function(d){return (500 - d) + 'px'})
  .style('height', function(d){return d + 'px';})
  .text(function(d){return d;});
```

- 높이 자동으로 찾기: data에서 가장 큰 요소를 찾기
```javascript
var height = d3.max(data);
bar.style('top', function(d){return (height - d) + 'px'})
```


- 데이터 랜덤으로 불러오기
```javascript
var randGenerator = d3.randomUniform(100, 500);
var data = d3.range(50).map(function() {return Math.floor(randGenerator())});
```
