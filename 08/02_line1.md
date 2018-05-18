라인 챠트 1 Line chart
---

목표
---
- SVG의 <path>에 대한 기본적인 이해
- d3의 d3-shape 생성기를 사용하여 라인 챠트를 그리기


SVG path
---
(참고) https://developer.mozilla.org/en/docs/Web/SVG/Tutorial/Paths

- Paths create complex shapes by combining multiple straight lines or curved lines. Complex shapes composed only of straight lines can be created as polylines.

- 문법은 (Postscript)(https://en.wikipedia.org/wiki/PostScript) 와 유사

- 라인 그리기

```html
<svg>
  <path d="M10 10 h 80 v 80 h -80 Z" fill="transparent" stroke="black"/>
</svg>
```
- M : Move To 점을 이동하기

```
M x y
```

- L : Line To 연결하기 

```
L x y
```

- H : Horizontal Line 가로선 x로 이동
- V : Vertical Line 세로선 y로 이동

```
H x (or h dx)
V y (or v dy)
```

- Z : Close Path 폐곡선


- d3로 path 만들어보기 
 - `d`에 값을 던진다.
```javascript
svg.append('path')
  .attr('d', 'M10 10 h 80 v 80 h -80 Z')
  .style('fill', 'transparent')
  .style('stroke', 'black');
```

[d3.Line](https://github.com/d3/d3-shape#lines)
---

- 실제로는 d3-shape 의 기능을 이용하여 `d`를 생성할 수 있다.


- 예시 데이터 
```javascript
var dataset = [
  {"x": 1,  "y": 28}, {"x": 2,  "y": 55},
  {"x": 3,  "y": 43}, {"x": 4,  "y": 91},
  {"x": 5,  "y": 81}, {"x": 6,  "y": 53},
  {"x": 7,  "y": 19}, {"x": 8,  "y": 87},
  {"x": 9,  "y": 52}, {"x": 10, "y": 48},
  {"x": 11, "y": 24}, {"x": 12, "y": 49},
  {"x": 13, "y": 87}, {"x": 14, "y": 66},
  {"x": 15, "y": 17}, {"x": 16, "y": 27},
  {"x": 17, "y": 68}, {"x": 18, "y": 16},
  {"x": 19, "y": 49}, {"x": 20, "y": 15}
];
```


- 스케일 세팅 하기
  - x축은 [d3.scalePoint](https://github.com/d3/d3-scale#scalePoint) 사용
```javascript
var w = 400, h = 300;
var margin = {top:10, right:10, bottom: 20, left: 20};
var innerW = w - margin.right - margin.left,
  innerH = h - margin.top - margin.bottom;

var svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', h)
  .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

var x = d3.scalePoint() // x가 scaplePoint 
  .domain(dataset.map(function(d){return d.x})) 
  .range([0, innerW]);
var y = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d){return d.y})])
  .range([innerH, 0]);

```

- d3.line을 생성기를 통해 `d`를 받아 line path를 생성하는 함수를 정의한다.

```javascript
var line = d3.line(); //라인 생성기를 만든다.
```
- `line.x`와 `line.y`를 통해 각각 x, y 값에 접근

```javascript
line.x(function(d){return x(d.x)})
  .y(function(d){return y(d.y)});

svg.append('path')
  .datum(dataset) //전체 배열이 연결 -> d3.line을 배열의 데이터를 한꺼번에 받아 d에 들어갈 스트링을 생성, 따라서 배열이 한개의 데이터 단위가 되어야함.
  // 위는 svg.selectAll('path').data([dataset]).enter().append('path') 와 동일 
  .attr('class', 'line')
  .style('fill', 'none')
  .style('stroke', 'steelblue')
  .attr('d', function(d) {
    console.log(d);
    console.log(line(d));
    return line(d);
  })//.attr('d', line);
```


