SVG Group 사용하기
===
https://css-tricks.com/transforms-on-svg-elements/


* [지난 자료](../05/lecture/bar-svg.html) 가져오기


Group으로 먼저 묶기
---

- 다른 요소 이전에 g를 연결
- g : 독자적인 좌표계를 가짐 http://devdocs.io/svg/element/g

```javascript
var bar = svg.selectAll('.bar')
  .data(dataset)
  .enter().append('g') //rect 대신에 g를 추가하자
    .attr('class', 'bar');
```


translate 적용
---
- Transform : SVG의 이동,회전,확대-축소 (참고) http://devdocs.io/svg/attribute/transform https://css-tricks.com/transforms-on-svg-elements/
- translate : 평행 이동, 좌표계가 이동했다고 간주 `translate[x,y]`

```javascript
bar.attr('transform', function(d){
  //return 'translate(' + x + ', ' + y + ')'
  return 'translate('+ [x(d.product), y(d.sales)] + ')' //g 위치가 미리 이동
})
```



요소 각각 추가하기
---
- 하위 요소들은 상위 요소(g)에 상대적으로 위치
- 하위요소는 기본 `[0,0]` 위치하므로 별도 이동 필요 없음


```javascript
//g 안에 rect와 text를 함께 집어넣자
var rect = bar.append('rect') //bar에 rect를 추가
    //x,y 설정 불필요
    .attr('width', x.bandwidth())
    .attr('height', function(d){return h - y(d.sales)})
    .style('fill', function(d){return 'rgb(0, 0, ' + color(d.sales) +')'});

var text = bar.append('text') //bar에 text를 추가 
    //x,y 설정 불필요
    .attr('dx', x.bandwidth()*0.5)
    .attr('dy', function(d) {return '1em';})
    .attr('text-anchor', 'middle')
    .style('fill', 'white')
    .text(function(d){return d.product});

```


재사용 데이터는 미리 저장
---

```javascript
bar.each(function(d) {
  d.x = x(d.product);
  d.y = y(d.sales);
  })
  .attr('transform', function(d){
    return 'translate('+ [d.x, d.y] + ')'
  })

rect.attr('height', function(d){return h - d.y}); //d.y를 미리 저장해둔 다음 재사용용
```


[d3-local](https://github.com/d3/d3-selection#local-variables)
---

 - local state를 데이터와 독립적으로 저장해야하는 경우에 사용 : 현재 elemet의 정보를 별도로 저장하고 싶을 때,
 - local.set(this, value) : 현재 this(현재 셀렉션의 DOM)에 value를 저장
    * 참고: [Function Context](../03/01_javascript.md)
 - local.get(this) : 현재 this에 저장된 value를 가지고 옴(this node에서 찾지 못하면 ancestor 살펴봄)
 
 ```javascript
 var xy = d3.local();
 bar.each(function(d) {
   //이때 this는 각각의 g
   xy.set(this, [x(d.product), y(d.sales)]); //x,y위치를 bar별로 d3.local에 저장
 })
 .attr('transform', function(d){
   var pos = xy.get(this); // 저장된 x,y 위치값을 가져옴
   return 'translate('+ pos + ')' 
 })

 rect.attr('height', function(d){return h - xy.get(this)[1];}); //this node에서 찾지 못하면 ancestor 살펴봄. 따라서 bar에 저장된 local 값을 찾아옴
 ```
