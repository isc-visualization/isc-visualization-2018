중첩 영역 챠트 Stacked Area Chart
===

(참고) https://bl.ocks.org/mbostock/3885211


목표
---
- 영역 챠트를 그려본다
- 중첩 영역 챠트를 그려본다


영역 챠트 Area Chart
---
- 선 챠트와 사실상 동일하며, multi-series인 경우 겹치기 때문에 좋지는 못함
- 주로 중첩 챠트를 그리게 될 경우 사용
- d3.line과 마찬가지로 [d3.area](https://github.com/d3/d3-shape#areas)를 통해 `<path>` 생성기를 호출


- 앞선 예제의 `line`과 마찬가지로 `area` 생성자를 정의
 - `y0, y1`을 설정해줘야함

```javascript
var line = d3.line()
  .x(function(d){return x(new Date(d.key));})
  .y(function(d){return y(d.value);});
var area = d3.area()
  .x(function(d){return x(new Date(d.key));})
  .y1(function(d){return y(d.value);})
  .y0(function(d){return y(y.domain()[0])}); //바닥부터 시작하도록
```

- path를 추가

```javascript
var series = svg.selectAll('.series')
  .data(entries, function(d){return d.key})
    .enter().append('g')
  .attr('class', 'series')
  .style('fill', function(d){return c(d.key)})
  .style('stroke', function(d){return c(d.key)});
series.append('path')
  .datum(function(d){return d.values})
  .style('stroke', 'none')
  .style('fill-opacity', 0.25)
  .attr('d', area);
series.append('path')
  .datum(function(d){return d.values})
  .style('fill', 'none')
  .attr('d', line);
```


중첩 Stack
---
- 특정 키Key를 기준으로 Series 형태의 데이터를 쌓아올린다.
- 키별로 합산된 전체 값Value과 범주Category별 값을 동시에 비교할 수 있지만 정확한 비교는 어려움.
  - 최하단 레이어만 기준선에 정렬algined 되어 있고 나머지는 기준선이 변동되기 때문
- 중첩의 순서를 신중히 결정해야하며, [스트림그래프(streamgraph)](http://leebyron.com/streamgraph/)를 활용할 수 있다.

#### [d3.stack](https://github.com/d3/d3-shape#stack)
- 입력 자료의 형태가 wide 형태
 - stack.keys에 카테고리를 나눌 키 값을 입력
 - 결과는 2중 배열이며 내부 개별 series 별로 series.key, series.index가 저장
 - 포인트별 개별 데이터는 point.data로 접근할 수 있다.


(예시) d3.stack 사용 예시
```javascript
var data = [
  {month: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, dates: 400},
  {month: new Date(2015, 1, 1), apples: 1600, bananas: 1440, cherries: 960, dates: 400},
  {month: new Date(2015, 2, 1), apples:  640, bananas:  960, cherries: 640, dates: 400},
  {month: new Date(2015, 3, 1), apples:  320, bananas:  480, cherries: 640, dates: 400}
];
var stack = d3.stack()
    .keys(["apples", "bananas", "cherries", "dates"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

var series = stack(data);
[
  [[   0, 3840], [   0, 1600], [   0,  640], [   0,  320]], // apples
  [[3840, 5760], [1600, 3040], [ 640, 1600], [ 320,  800]], // bananas
  [[5760, 6720], [3040, 4000], [1600, 2240], [ 800, 1440]], // cherries
  [[6720, 7120], [4000, 4400], [2240, 2640], [1440, 1840]], // dates
]
```


- 일단 기본적인 wide형태의 데이터를 사용하기 위해 집산 없이 원데이터를 사용

```javascript
var xDomain = d3.extent(data, function(d){return d.date;}); //원본 데이터에서 domain 추출
var x = d3.scaleTime().domain(xDomain)
  .range([0, innerW]);
```

- stack 생성기를 정의하고 데이터를 입력하여 형태 변환

```javascript
var stack = d3.stack()
  .keys(valueDomain) //[A,B,C]
var entries = stack(data);
```

- y scale을 재정의

```javascript
var yMax = d3.max(entries[valueDomain.length-1], function(d){return d[1]}); //마지막 stack의 최대값 추출
var y = d3.scaleLinear().domain([0, yMax])
  .range([innerH, 0]);
```

- path 생성기를 정의

``` javascript
var line = d3.line()
  .x(function(d){return x(d.data.date);})
  .y(function(d){return y(d[1]);});
var area = d3.area()
  .x(function(d, i) { return x(d.data.date); })
  .y0(function(d) { return y(d[0]); })
  .y1(function(d) { return y(d[1]); });
```

- 생성기를 아래와 같이 전달

```javascript
var series = svg.selectAll('.series')
  .data(entries)
    .enter().append('g')
  .attr('class', 'series')

series.append('path')
  .style('fill', function(d){return c(d.key)})
  .style('stroke', 'none')
  .style('fill-opacity', 0.5)
  .attr('d', area);
series.append('path')
  .style('stroke', function(d){return c(d.key)})
  .style('fill', 'none')
  .attr('d', line);
```

(실습) 
- normalized stacked area chart 그려보고 축 추가하기 
