트리맵2 Treemap2
===

목표
---
- 재귀를 통해 treemap을 구현


위계 구조를 반영하여 그리기
---
- 앞에서 말단노드 만을 그린 것과는 달리 중첩 구조 그대로를 살려서 그려보자 
- 재귀적으로 자식 노드를 그리는 함수를 정의

```javascript

function node(selection, d) { // 데이터 d는 현재 레벨에 해당하는 노드들이 배열 형태로 들어온다.
  var el = selection.selectAll('.node') 
    .data(d, function(d){return d.data.name;});  // 현재 레벨에서 추가가능한 데이터를 추가한다. 
  el.enter().append('g') 
    .attr('class', 'node')
    .each(function(d) { // 자식 노드들을 가지고 있는 경우 동일하게 node 함수를 실행하도록 한다. 
      if(d.children) { //자식 노드가 있을 경우 재귀적으로 추가
        console.log('parent node:' + d.data.name);
        d3.select(this)
          .call(node, d.children); 
      } else {
        // 재귀 함수가 종료
        console.log('leaf node:' + d.data.name);
      }
    })
  return selection;
}
```

- svg 부터 node를 채우기 시작
```javascript
svg.call(node, [hierarchy]); // hierarchy 오브젝트를 배열로 만들어서 전달하는 것에 주의
```


부모노드와 자식노드 구분하기
---

- 부모노드와 자식노드 별로 추가 요소를 구분

```javascript
el.each(function(d) {
  if(d.children) {
    d3.select(this).call(parent) // parent 함수를 call
      .call(node, d.children);
  } else {
    d3.select(this).call(leaf); //leaf 함수를 call
  }
})
```

```javascript
function parent(selection) {
  selection.classed('parent', true);
  selection.append('rect')
    .attr('width', function(d){return d.x1-d.x0;})
    .attr('height', function(d){return paddingTop;})
    .attr('x', function(d){return d.x0;})
    .attr('y', function(d){return d.y0;})
    .style('fill', '#eee')
    .style('stroke', '#ddd')
    .style('cursor', 'pointer');
  selection.append('text') // 이름 적어주기
    .text(function(d){return d.data.name})
    .attr('dy', function(d){return '1em'})
    .attr('x', function(d){return d.x0;})
    .attr('y', function(d){return d.y0;})
    .style('font-size', '12px')
    .style('font-family', 'sans-serif')
    .style('pointer-events', 'none');
  return selection;
}
```

```javascript
function leaf(selection) {
  selection.classed('leaf', true)
    .append('rect')
    .attr('x', function(d){return d.x0})
    .attr('y', function(d){return d.y0})
    .attr('width', function(d){return d.x1-d.x0})
    .attr('height', function(d){return d.y1-d.y0})
    .style('fill', function(d){return color(findParent(d, 1).data.name)})
    .style('fill-opacity', function(d){return opacity(d.value)});
  return selection;
}
```

트리 그리기
---

```javascript
var paddingTop = 16;
var treemap = d3.treemap()
  .size([innerW, innerH])
  .paddingTop(paddingTop);

hierarchy = treemap(hierarchy);

svg.call(node, [hierarchy]); // hierarchy 오브젝트를 배열로 만들어서 전달하는 것에 주의
```

자식-리프노드를 선택하기 
---
- `parent` 함수에 간단한 이벤트를 추가

```javascript
function parent(selection) {

  //맨밑에 추가

  selection.select('rect').on('mouseenter', function(d) {
    d3.event.stopPropagation(); //부모로 이벤트 전달 막음
    d3.select(this.parentNode).selectAll('.leaf > rect')
      .style('fill', 'lemonchiffon');
  }).on('mouseleave', function(d) {
    d3.event.stopPropagation();
    d3.select(this.parentNode).selectAll('.leaf > rect')
      .style('fill', function(d){return color(findParent(d, 1).data.name)});
  })
}
```
