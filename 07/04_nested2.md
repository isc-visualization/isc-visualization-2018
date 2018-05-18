중첩 셀렉션 2
===

([샘플](https://raw.githubusercontent.com/isc-visualization/isc-visualization-2018/master/07/sample/nested.sample.json)) JSON 형태로 nested 된 데이터
 - `category` 값을 기준으로 묶여있음
 - `key`는 `category`의 값, `values`는 개별 `item`

목표
---
- [Grouped Bar Chart](https://newsjelly.github.io/jelly-chart/demo/grouped-bar)를 그려보자
  - 이번에는 horizontal bar chart를 그려본다.
  - 첫번째 key는 `category`, 다음 key는 `position` => 각각 y 좌표를 channel로 갖는다. `position`은 `category`에 의해 나눠진 구획 안에서의 좌표를 가리킨다.
  - value는 value => 막대의 길이를 channel로 갖는다.



SVG 세팅
---

```javascript
d3.json('nested.sample.json').then(function(data) {
  var w = 400, h = 300;
  var margin = {top:10, right:10, bottom: 20, left: 20};
  var innerW = w - margin.right - margin.left,
    innerH = h - margin.top - margin.bottom;

  var svg = d3.select('body').append('svg')
      .attr('width', w)
      .attr('height', h)
    .append('g')
      .attr('transform', 'translate('+ [margin.left, margin.top] + ')');
})
```

스케일 설정
---

- category와 position의 domain은 ordinal이며 모두 `d3.scaleBand`를 사용
- value의 domain은 quantitative이며 linear scale 사용


- category의 스케일 설정하기
```javascript
var categoryDomain = data.map(function(d){return d.key});
var categoryRange = [0, innerH]; 
var category = d3.scaleBand()
  .domain(categoryDomain).range(categoryRange);
```

- position의 스케일 설정하기
```javascript
var positionDomain = [];
data.forEach(function(d) {
  d.values.forEach(function(v) { //values 값이 모두 일정하다는 보장이 없으므로 모든 values를 조사해봄
    if(positionDomain.indexOf(v.position) < 0) positionDomain.push(v.position);
  })
});
var positionRange = [0, category.bandwidth()];
var position = d3.scaleBand()
  .domain(positionDomain).range(positionRange);
```

- value의 스케일 설정하기
```javascript
var valueDomain = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
data.forEach(function(d) {
  d.values.forEach(function(v) {
    var value = v.value; 
    //최대.최소 직접 구하기
    if(value < valueDomain[0]) valueDomain[0] = value;
    else if (value > valueDomain[1]) valueDomain[1] = value;
  })
});
valueDomain[0] = 0;
var valueRange = [0, innerW];
var value = d3.scaleLinear()
  .domain(valueDomain).range(valueRange);
```

key별로 구획 나누기
----

- `g`를 key별로 추가하여 구획`region`을 나눈다.
  - `region` 혹은 `view`, `glyph` 라고도 한다.

```javascript
var region = svg.selectAll('.region')
  .data(data, function(d){return d.key})
  .enter().append('g')
    .attr('class', 'region')
    .attr('transform', function(d){return 'translate(' + [0, category(d.key)] + ')';})
```


구획별로 막대 추가
---
- 2번째 key는 position 값을 활용

```javascript
var bar = region.selectAll('.bar')
  .data(function(d){return d.values}, function(d){return d.position})
    .enter().append('rect')
  .attr('class', 'bar')
  .attr('y', function(d){return position(d.position);})
  .attr('width', function(d){return value(d.value)})
  .attr('height', position.bandwidth());
```

색상 추가
---
- d3가 제공하는 [컬러 스키마color scheme](https://github.com/d3/d3-scale-chromatic#schemeCategory10)를 활용
- `d3.scaleOrdinal`을 사용

```javascript
var color = d3.scaleOrdinal()
  .domain(positionDomain).range(d3.schemeCategory10);

bar.attr('fill', function(d){return color(d.position)})
```

**(실습) 구역 사이의 padding을 넣어보고, 축을 추가해본다.**
