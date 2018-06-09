히스토그램 Histogram
===

- [d3.histogram](http://devdocs.io/d3~5/d3-array#_histogram)

Histograms bin many discrete samples into a smaller number of consecutive, non-overlapping intervals. They are often used to visualize the distribution of numerical data.

[![](https://user-images.githubusercontent.com/253408/41151874-009344da-6b4d-11e8-9177-bdd24e9a8235.png)](https://en.wikipedia.org/wiki/Histogram)


무작위로 데이터셋 만들기
---

```javascript
function randGen(length, width) {
  width = width || 100;
  var ranGen = d3.randomNormal();
  var results = [];
  for (var i = 0 ; i < length; i++) {
    results.push(ranGen() * width);
  }
  return results;
}
```
- [d3.randomNormal](http://devdocs.io/d3~5/d3-random#randomNormal): [정규분포](https://en.wikipedia.org/wiki/Normal_distribution)에 가까운 분포를 보이도록 무작위로 값을 뱉어냄 
  - 첫번째 값은 중심의 평균 위치, 두번째 값은 표준분포 값을 전달
    - 표준분포 값이 작을수록 평균 중심으로 모임

```javascript
console.log(randGen(1000, 1));
```


스케일 설정
---

```javascript 
var data = randGen(10000, 50);
console.log(data);
var w = 640, h = 480;
var margin = {top:10, right:40, bottom: 20, left: 40};
var innerW = w - margin.right - margin.left,
  innerH = h - margin.top - margin.bottom;
var x = d3.scaleLinear()
  .domain(d3.extent(data)).nice()
  .range([0, innerW]);
```
- 빈(bins) 계산하기 : [d3.histogram](http://devdocs.io/d3~5/d3-array#histogram)
 - 결과는 bin 별로 데이터가 모임
 - .value() 로 값을 설정해야하지만 현재는 숫자만 담겨 있으므로 생략
 - `x.ticks()` 를 통해 동일한 간격의 범위를 정하고 이것을 `histogram.thresholds`에 전달

```javascript
console.log(x.ticks(40));
var bins = d3.histogram()
  .domain(x.domain())
  .thresholds(x.ticks(40));
bins = bins(data);
console.log(bins);
```
    
- bin별로 개수를 살펴서 y축의 범위를 계산  
```javascript
var y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)]).nice()
      .range([innerH, 0]);
```

- 축 설정
```
var xAxis = d3.axisBottom(x).tickSizeOuter(0);
var yAxis = d3.axisLeft(y);
```


렌더링
---

```javascript
var svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', h)
  .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

  svg
  .selectAll(".bar")
  .data(bins)
  .enter().append("rect")
  .attr('class', 'bar')
  .attr("x", function(d) {return x(d.x0) + 1})
  .attr("width", function(d) {return Math.max(0, x(d.x1) - x(d.x0) - 1)})
  .attr("y", function(d) { return y(d.length)})
  .attr("height", function(d) { return y(0) - y(d.length)});

  svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + innerH + ')')
  .call(xAxis);

  svg.append('g')
  .attr('class', 'y axis')
  .call(yAxis);
```

(참고) 박스플롯
 - ![box-plot](https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Boxplot_vs_PDF.svg/440px-Boxplot_vs_PDF.svg.png)

- [Quantile](https://en.wikipedia.org/wiki/Quartile) 을 통해 값의 밀도를 4개의 단위로 자름   - d3.quantile을 통해 계산 http://devdocs.io/d3~5/d3-array#quantile
 - Q1(0.25), Q3(0.75) 구간을 박스로 그리고 둘 사이의 거리를 IQR로 지정하고 1.5배 하여 범위를 그림
   - 해당 범위 밖은 outlier로 쳐서 별도 표시