평행좌표 Parallel Coordinates
===

(참고)
https://bl.ocks.org/jasondavies/1341281

목표
---
- 평행좌표를 간단히 구현
- 브러쉬 기능을 적용


기본 설정
---

- x축은 상단에 위치하여 축 이름을 표시
- y축을 위한 스케일은 개별 축에 따라 접근할 수 있도록 오브젝트로 설정
- 선 생성자를 미리 세팅
- brush는 y축 방향으로만 조절 가능하므로 `d3.brushY` 사용

```javascript
var w = 800, h = 600;
var margin = {top:20, right:20, bottom: 20, left: 20};
var innerW = w - margin.right - margin.left,
  innerH = h - margin.top - margin.bottom;
var brush = d3.brushY(); //브러시 변수 추가

var xAxis = d3.axisBottom().tickSize(0).tickPadding(-12); 
var yAxis = d3.axisLeft();

var x = d3.scalePoint().range([0, innerW]).padding(0.04); 
var y = {}; //y 스케일이 여러개이므로 오브젝트로 나중에 추가

var c = d3.scaleOrdinal().range(d3.schemeCategory10);
var line  = d3.line()
  .x(function(d){return d.x}) //값을 스케일로 미리 변환해서 넣어둘 예정 따라서 line 생성기에서 스케일을 사용할 필요 없음
  .y(function(d){return d.y;});
var svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', h)
  .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');
```

- x축은 레이블만 남도록 세팅

```css
.x.axis .domain{
  stroke : none;
}
```

스케일 설정
---
- 헤더 요소 뽑기

```javascript
var headers = data.columns.slice(0,4);
headers = headers.map(function(h) {
  var domain = d3.extent(data, function(d){return d[h];});
  return {name:h, domain:domain};
});

```

- 축마다 서로 다른 스케일을 갖도록 설정

```javascript
headers.forEach(function(h) {
  y[h.name] = d3.scaleLinear().domain(h.domain).range([innerH, 0]); 
});

x.domain(headers.map(function(d){return d.name;}));
c.domain(d3.set(data, function(d){return d.species;}).values());
```

선 그리기
---

- 개별 아이템을 선 생성자에 전달할 수 있도록 구조를 바꿈
 - 개별 선마다 축 순서대로 좌표를 미리 계산해서 하나의 배열에 넣어둠 `[{x:x0, y:y0}, {x:x1, y:x2} ...]`

```javascript
function series(d) { //개별 아이템마다 배열로 아이템을 변환
  return x.domain().map(function(h) { //축 순서대로 데이터에 접근
    return {x:x(h), y:y[h](d[h])};
  });
}
```

- 데이터를 추가하고 `path`추가 할때 위에서 만든 `series` 함수를 이용해 데이터 형태를 변환

```javascript
svg.selectAll('.series')
  .data(data)
    .enter().append('g')
  .attr('class', 'series')
  .style('stroke', function(d){return c(d.species)}) 
    .selectAll('path')
  .data(function(d){return [series(d)]}) //데이터를 series로 변환한 다음 배열에 다시 넣어서 통째로 path에 전달
    .enter().append('path')
    .attr('d', line);
```

```css
.series path {
  fill : none;
}
```

축 그리기
---

- Y축은 `headers`를 전달하여 개별적으로 추가

```javascript
svg.selectAll('.y.axis')
    .data(headers, function(d){return d.name;})
  .enter().append('g')
    .attr('class', 'y axis')
    .attr('transform', function(d) {return 'translate(' + [x(d.name), 0] + ')';}) //축을 x 스케일을 이용해 이동
    .each(function(d) {
      yAxis.scale(y[d.name]); // 축마다 스케일을 가져와서 
      d3.select(this).call(yAxis); //축을 그려줌
    })
```

- X축은 그대로 추가

```javascript
xAxis.scale(x);
svg.append('g')
  .attr('class', 'x axis')
  .call(xAxis);
```


브러쉬 추가
---
- 개별 축 영역에 브러쉬를 설정

- 브러쉬 영역을 설정하고 이벤트 리스너 등록
  - 이번 경우에는 start는 없어도 됨 
```javascript
brush = brush.extent([[-12, 0], [12, innerH]]) //[[x1,y1], [x2,y2]] 직사각형 형태로 영역을 설정
  .on('brush', brushed) 
  .on('end', brushEnded);
  
svg.selectAll('.y.axis') //축을 모두 선택한 후 각각 g를 추가하고 brush를 추가
  .append('g')
  .attr('class', 'brush')
  .call(brush); 
```

- 브러쉬가 진행되면 축마다 선택된 영역을 저장하고, 선택되지 않은 아이템을 `.hidden`설정
  - `d3.brushY` 사용시에 `d3.event.selection`은 `[y0, y1]`
- 브러쉬가 끝날 때 아무 영역이 선택되지 않았다면 해당 축의 범위는 제거

```javascript
var conditions = {}; // 축마다 현재 선택된 영역을 저장
function brushed(d) {
  conditions[d.name] = d3.event.selection.map(y[d.name].invert); //현재 축 이름과 영역을 변환하여 저장, 
  hide(); //영역 바깥의 선들은 감춰둠
}
function brushEnded(d) {
  if(d3.event.selection === null) { //클릭만 했을 때
    delete conditions[d.name]; //해당 영역의 조건을 지움
    hide();
  }
}
function hide() {
  svg.selectAll('.series').classed('hidden', function(d) {
    var result = false;
    for(var k in conditions) { //세가지 조건 하나라도 밖에 있다면 감춰둠
      var domain = conditions[k];
      result = result || (d[k] < domain[1]  || d[k] > domain[0])
      if(result) return result;
    }
    return result;
  });
}
```

```css
.series.hidden path {
  stroke : #ddd !important;
}
```
