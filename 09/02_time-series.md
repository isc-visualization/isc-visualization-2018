시계열 라인 챠트 그리기
===

(참고)
https://newsjelly.github.io/jelly-chart/demo/time-line

목표
---
- d3.scaleTime 을 사용해서 날짜 속성의 데이터를 매핑해본다
- wide 형태의 데이터셋을 활용해보자

d3.scaleTime
---
http://devdocs.io/d3~4/d3-scale#scaleTime
- scaleLinear와 동일하나 domain에 Date object가 사용

- (예시) d3.scaleTime 사용 예
```javascript
var x = d3.scaleTime()
    .domain([new Date(2000, 0, 1), new Date(2000, 0, 2)])
    .range([0, 960]);

x(new Date(2000, 0, 1,  5)); // 200
x(new Date(2000, 0, 1, 16)); // 640
```

시계열 라인 챠트 그리기
---
- [샘플 파일](sample/sample.time.csv)에 접근
- [d3.csv](https://github.com/d3/d3-fetch#csv) 활용
```javascript
d3.csv('sample.time.csv', row)
  .then(callback)
```

- 개별 행의 속성attribute를 알맞은 타입type으로 변환하는 행 변환 함수를 설정
```javascript
var parse = d3.timeParse('%Y-%m-%d');

function row(d) {
  d.date = parse(d.date); //-> 날짜 오브젝트로 변환
  d.A = +d.A; // -> 숫자 형태로 변환
  d.B = +d.B;
  d.C = +d.C;
  return d;
}
```

- data 입력시 사용되는 callback 함수 설정
```javascript
function callback(data) {
  var w = 400, h = 300;
  var margin = {top:10, right:40, bottom: 20, left: 20};
  var innerW = w - margin.right - margin.left,
    innerH = h - margin.top - margin.bottom;

  var svg = d3.select('body').append('svg')
      .attr('width', w)
      .attr('height', h)
    .append('g')
      .attr('transform', 'translate('+ [margin.left, margin.top] + ')');
}
```

- 스케일 설정
```javascript
var xDomain = d3.extent(data, function(d){return d.date}); // 날짜 범위
var x = d3.scaleTime().domain(xDomain) // 날짜를 x축에 매핑할 스케일 설정
  .range([0, innerW]);

console.log(data.columns); //csv의 경우 열 정보를 별도로 확인할 수 있음

var valueFieldNames = data.columns.slice(1); //http://devdocs.io/javascript/global_objects/array/slice 참조, 값을 알려주는 필드들 A,B,C
var yDomain = d3.extent( // yDomain의 범위가 ABC 마다 서로 다르기 때문에 이를 따로 구해 합쳐준다.
  d3.merge( // 여러 배열을 하나로 뭉치기 https://github.com/d3/d3-array#merge
    valueFieldNames.map(function(k){
      return d3.extent(data, function(d){return d[k];
    })
  })));
var y = d3.scaleLinear().domain(yDomain)
  .range([innerH, 0]);
var c = d3.scaleOrdinal().domain(valueFieldNames)
  .range(d3.schemeCategory10);

```

#### wide 형태 변형
 - 평소와 달리 wide 형태 데이터이므로 nesting이 불가능
 - 마치 nested 된 것처럼 구조를 바꾼다.

```javascript
var entries = valueFieldNames.map(function(k) { //A,B,C를 돌면서 하나식 row를 만들어준다
  var values = data.map(function(d){
    return {date:d.date, value:d[k], key:k}
  });
  return {key:k, values:values}
})
```

### 개별 series를 그려주기

- line 설정하고 추가해주기
```javascript
var line = d3.line()
  .x(function(d){return x(d.date);})
  .y(function(d){return y(d.value);});
var series = svg.selectAll('.series')
  .data(entries, function(d){return d.key})
    .enter().append('g')
  .attr('class', 'series')
  .style('fill', 'none')
  .style('stroke', function(d){return c(d.key)})

series.append('path')
  .datum(function(d){return d.values})
  .attr('d', line)
```


일단위 -> 주단위로 집산aggregate 하기
---

- d3-time의 interval을 활용해서 단위를 바꾼다.

```javascript
var entries = valueFieldNames.map(function(k) { 
  var values = data.map(function(d){ //날짜를 주단위로 바꿔주기
    var date = d3.timeWeek.floor(d.date); //날짜가 해당하는 주의 일요일로 변환됨
    return {date:date, value:d[k]}
  });
  values = d3.nest().key(function(d){return d.date})
    .rollup(function(leaves){return d3.mean(leaves, function(d){return d.value;})})
    .entries(values);
  return {key:k, values:values}
})
```
- 혹은 위의 일단위 entries의 values를 다시 계산해도 좋다.

- 스케일을 다시 생성하고, 라인 생성기를 일부 변환한다.

```javascript
var xDomain = d3.extent(entries[0].values, function(d){return new Date(d.key)});
var x = d3.scaleTime().domain(xDomain)
  .range([0, innerW]);

var line = d3.line()
  .x(function(d){return x(new Date(d.key));}) //nesting을 해서 property가 key로 변환되고 type도 string이 되어버림
  .y(function(d){return y(d.value);});
```

** (실습) 월단위로 계산하고 축 추가해보기 **
