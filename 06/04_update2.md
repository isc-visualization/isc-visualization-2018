업데이트 Update 2
===

막대에 이벤트 연결
---

```javascript
bar.on('click', function(d){
  console.log(d);
})
```

- `event.stopPropagation` 통해서 svg로 이벤트가 전달되는 것(bubbling)을 막는다.

```javascript
bar.on('click', function(d) {
  d3.event.stopPropagation();
});
```

- bar.on 내부에서 `d3.select(this)`를 통해 현재 이벤트가 발생한 셀렉션을 조작 가능

```javascript
bar.on('click', function(d) {
  d3.event.stopPropagation();
  var b = d3.select(this);
});

```

이벤트 발생한 막대의 데이터만 수정
---

- [selection.datum](https://github.com/d3/d3-selection#selection_datum)으로 수정 (each로 수정해도됨)
  - enter, exit에 영향을 주지 않음
```
Gets or sets the bound data for each selected element. Unlike selection.data, this method does not compute a join and does not affect indexes or the enter and exit selections.
```

```javascript
bar.on('click', function(d) {
  d3.event.stopPropagation();
  var b = d3.select(this);
  b.datum(function(d) { //b의 데이터를 재설정
    d.sales = Math.round(rand());
    return d;
  }).each(function(d) { //위치 값 재설정
    xy.set(this, [x(d.product), y(d.sales)]);
  })
});
```

- 트랜지션 설정

```javascript
var t = d3.transition()
 .duration(800)
 .ease(d3.easeElastic);

bar.transition(t)
   .attr('transform', function(d){
     return 'translate('+ xy.get(this) + ')'
   });

bar.select('rect')
  .transition(t)
  .attr('height', function(d){return innerH - xy.get(this)[1]});
```

중복되는 동작은 함수로 만들기
---
- `selection.call`을 이용해서 중복되는 동작은 함수로 만든다.

```javascript
function updateBar(selection) {
  selection.each(function(d) {
    xy.set(this, [x(d.product), y(d.sales)]);
  })
  return selection;
}
function translateBar(selection) {
  selection.attr('transform', function(d){
    return 'translate('+ xy.get(this) + ')'
  });
  return selection;
}
function updateRect(selection) {
  selection
    .attr('height', function(d){return innerH - xy.get(this)[1]});
  return selection;
}
```

*(실습) selection.call 적절한 곳에 추가해보기*
