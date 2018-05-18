힘-방향 배치 Force-Directed Placement 2
===

(참조) https://bl.ocks.org/mbostock/4062045

목표
---
-  d3-drag 사용에 대한 간단한 이해


드래깅 설정
---
https://github.com/d3/d3-drag

- d3-drag를 통해 마우스나 터치 드래깅 동작을 설정 가능
 - 드래그 시작, 중간, 종료 이벤트 발생시에 각각 콜백함수를 추가


```javascript
var drag = d3.drag() 
  .on('start', dragStrated)
  .on('drag', dragged)
  .on('end', dragEnded);

node.call(drag);
```

힘-방향 다이어그램에 드래깅 추가
---

- drag 시에는 드래그된 노드의 데이터가 전달됨
 - `fx,fy`에 포인터 위치를 전달하면 강제로 노드의 위치가 변경됨
 - drag가 시작될 때 `alphaTarget`을 0보다 크게 설정하면 `alpha`가 `alphaMin` 보다 작아질 수 없어서 계속 운동함

```
  fx - the node’s fixed x-position
  fy - the node’s fixed y-position
```

```javascript
function dragStrated(d) {
  if(!d3.event.active) simulation.alphaTarget(0.3).restart(); // 운동이 정지하지 않음 
  d.fx = d.x; //d.fx 값을 d.x 값으로 강제 이동
  d.fy = d.y;
}
function dragged(d) {
  d.fx = d3.event.x; // 마우스 포인터 위치로 fx를 이동
  d.fy = d3.event.y;
}
function dragEnded(d) {
  if(!d3.event.active) simulation.alphaTarget(0); //드래그 끝나면 target을 다시 0으로 설정 
  d.fx = null; // fx를 없앰
  d.fy = null;
  svg.selectAll('.linked').classed('linked', false);
}

```

간단한 하이라이트 추가
---
- `dragStarted` 에 선택한 노드의 링크와 연결된 노드들을 변화 시킴

```javascript
var linked = [];
svg.select('.links').selectAll('line').filter(function(l) { 
  if (l.source === d) { // source가 현재 데이터와 같다면
    if(linked.indexOf(l.target)<0) linked.push(l.target); //linked에 target이 없다면 해당 target을 추가
    return true; // 해당 링크는 필터를 통과
  } else if( l.target === d) { // target이 현재 데이터와 같다면
    if(linked.indexOf(l.source)<0) linked.push(l.source); //linked에 source가 없다면 해당 source를 추가 
    return true;
  }
  return false;
}).classed('linked', true);  

svg.select('.nodes').selectAll('circle').filter(function(n) {
  return linked.indexOf(n) >= 0; // linked에 있는 노드라면
}).classed('linked', true); 

```

- `dragEnded`에서 설정을 제거

```javascript
svg.selectAll('.linked').classed('linked', false);
```

```css
.links line {
  stroke: #aaa;
}
.links line.linked {
  stroke-width : 2px;
}


.nodes circle {
  pointer-events: all;
  stroke: #eee;
  stroke-width: 2px;
}

.nodes circle.linked {
  stroke: blue;
}
```
