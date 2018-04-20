범례와 툴팁
---

목표
---
 - 범례의 개념과 구현
 - 라인 챠트에 적당한 툴팁을 구현해보자


범례 legend
---

- 축과 마찬가지로 스케일을 시각화
 - 축의 range가 위치 채널을 가리킬 때 사용된다면, 범례는 색상 채널을 가리킬 때 사용


- 앞선 예에서 `c` 스케일을 시각화하면 해당 챠트의 범례를 만들 수 있다

```javascript
var c = d3.scaleOrdinal()
  .domain(nest.map(function(d){return d.key}))
  .range(d3.schemeCategory10);
```

- 오른쪽에 공간을 만들기위해 `margin.right` 값을 늘린다.

```javascript
var margin = {top:10, right:40, bottom: 40, left: 20};
```

- legend를 위한 공간에 g를 추가하고 데이터를 바인딩한다.

```javascript
var chipHeight = 12; //레전드 안에 색상칩 크기
var chipPadding = 2; //색상칩 간격
var legendHeight = 16;
var legendPadding = 4;
var legend = svg.append('g')
 .attr('legend-g')
 .selectAll('.legend')
 .data(c.domain()) // 개별 색상이 legend 가 된다.
   .enter().append('g')
   .attr('class', 'legend')
   .attr('transform', function(d,i){
     return 'translate(' + [innerW + legendHeight, legendHeight + i *(legendHeight + legendPadding)]+ ')'
   }) //scaleBand를 활용해도 좋다
```

- 색상 칩을 추가한다.

```javascript
legend.append('rect')
 .attr('y', chipPadding)
 .attr('width', chipHeight).attr('height', chipHeight)
 .style('fill', function(d){return c(d)});
```

- 레이블을 추가한다.

```javascript
legend.append('text')
 .attr('x', chipPadding+ chipHeight)
 .attr('y', chipPadding)
 .attr('dy', '.71em')
 .style('font-size', legendHeight+ 'px')
 .text(function(d){return d})
```

툴팁 Tooltip
---
- 툴팁은 특정 데이터 포인트Data Point의 정보를 텍스트 레이블로 표시
 - 대부분의 특정 인터액션이 발생하는 경우에 보이게 하는 경우가 많음

- 마우스 커서가 특정 데이터 포인트 위에 위치hover 했을 때 동일한 X축 값을 갖는 데이터 포인트들을 모두 표시해주자.

- 먼저 포인트가 잘 보이도록 데이터 포인트에 원을 추가해주자

```javascript
var point = series.selectAll('circle') 
  .data(function(d){return d.values}, function(d){return d.x}) //values 마다 point를 추가
  .enter().append('circle')
  .style('cursor', 'pointer')
  .attr('cx', function(d){return x(d.x)})
  .attr('cy', function(d){return y(d.y)})
  .attr('r', 4);
```

- 마우스 커서가 올라왔을 때 상태를 변환하고 나가면 상태를 해지

```css
.hover {
  fill-opacity: .4;
}
```

```javascript
point.on('mouseenter', function(d) {
  var hover = point.filter(function(p) {return d.x === p.x}) // 같은 x를 가진 다른 시리즈들을 필터링
    .classed('hover', true);
}).on('mouseleave', function() {
  var hover = point.filter(function() {
    return d3.select(this).classed('hover')
  }).classed('hover', false);
})
```

- 툴팁은 텍스트로 표시

```javascript
point.on('mouseenter', function(d) {
  var hover = point.filter(function(p) {return d.x === p.x})
    .classed('hover', true);
  /// 툴팁 추가하기
  var tooltip = svg.selectAll('.tooltip')
    .data(hover.data())
  tooltip.enter().append('text')
      .attr('class', 'tooltip')
      .merge(tooltip)
      .attr('x', function(d){return x(d.x)})
      .attr('dx', '.35em')
      .attr('y', function(d){return y(d.y)})
      .style('fill', function(d){return c(d.c)})
      .style('visibility', 'visible')
      .text(function(d){return d.y})
  ///
}).on('mouseleave', function() {
  var hover = point.filter(function() {
    return d3.select(this).classed('hover')
  }).classed('hover', false);
  ///
  svg.selectAll('.tooltip')
    .style('visibility', 'hidden');
  ///
})
```
