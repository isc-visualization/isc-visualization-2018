매트릭스 Matrix
===

목표
---
- 네트워크 구조를 매트릭스 형태에 간단히 표현


[실습 파일](./sample/miserables.json)
---
 - `nodes`와 `links`로 구분
 - `nodes`에는 개별 인물의 `id`와 `group`속성이 있음
 - `links`에는 `id` 값을 가리키는 `source`와 `target` 값이 있고 관계의 정도를 나타내는 `value` 값이 있음

네트워크 구조 데이터 불러오기
---

```javascript
var w = 600; //너비와 높이가 동일 
var margin = {top:20, right:20, bottom: 20, left: 20};
var innerW = w - margin.right - margin.left;

var svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', w)
  .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

d3.json('miserables.json').then(callback);
function callback(data) {
  console.log(data);
}
```


스케일
---
- x축 y축 방향으로 각각 노드를 위치 시켜 준다.
- 색상은 group, 위치는 id를 통해 결정

```javascript
var cDomain = d3.set(data.nodes.map(function(d){return d.group;}))//d3.set을 통해 중복이 되지 않도록 d.group 모음
cDomain = cDomain.values()
cDomain.sort(d3.ascending); //번호 순서대로 정렬
var c = d3.scaleOrdinal()
    .domain(cDomain)
    .range(d3.schemeCategory10);
var x = d3.scaleBand()
  .domain(data.nodes.map(function(d){return d.id;}))
  .range([0, innerW]); // 너비만큼 range를 결정
```

노드 그리기
---

- 노드별로 각각 나열한다. 

```javascript
var xNode = svg.selectAll('.x.node')
    .data(data.nodes)
  .enter().append('rect')
    .attr('class', 'x node')
    .attr('x', function(d){return x(d.id);})
    .attr('y', function(d){return -x.bandwidth()*2;}) // 위로 2칸 이동
    .attr('width', x.bandwidth())
    .attr('height', x.bandwidth())
    .style('fill', function(d){return c(d.group);});

var yNode = svg.selectAll('.y.node')
    .data(data.nodes)
  .enter().append('rect')
    .attr('class', 'y node')
    .attr('x', -x.bandwidth()*2) //왼쪽으로 2칸 이동
    .attr('y', function(d){return x(d.id);})
    .attr('width', x.bandwidth())
    .attr('height', x.bandwidth())
    .style('fill', function(d){return c(d.group);});
```

링크
---

- 링크가 존재하는 경우에만 사각형을 그려준다

```javascript
var xLink = svg.selectAll('.x.link')
    .data(data.links)
  .enter().append('rect')
    .attr('class', 'x link')
    .attr('x', function(d){return x(d.source);})
    .attr('y', function(d){return x(d.target);})
    .attr('width', x.bandwidth())
    .attr('height', x.bandwidth());

var yLink = svg.selectAll('.y.link')
    .data(data.links)
  .enter().append('rect')
    .attr('class', 'y link')
    .attr('x', function(d){return x(d.target);})
    .attr('y', function(d){return x(d.source);})
    .attr('width', x.bandwidth())
    .attr('height', x.bandwidth());
```


(실습) 노드 부분에 실제 `id`값을 텍스트로 적어준다. 링크 값 위에 마우스를 올렸을 때 해당하는 노드가 하이라이트 되도록 기능을 추가한다.
