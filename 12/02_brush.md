브러쉬 brush
===

(참고)
http://devdocs.io/d3~5/d3-brush

목표
---
- d3-brush 모듈을 활용하여 산점도 행렬에 브러쉬 적용


브러쉬 brush
---
- *포인팅 제스쳐Pointing Gesture* : (클릭click, 드래그drag, 터치touch)를 활용하여 일-이차원 영역을 선택하는 인터액션
- 특정 아이템을 선택하거나, 줌인, 크로스필터링 등을 사용하는데 유용
- d3-brush는 SVG 상의 마우스, 터치 이벤트를 활용하여 구현됨
- 브러쉬 이벤트 발생시에 이벤트 리스너에서 아래의 `d3.event` 속성을 확인 가능

```
 - target:  the associated brush behavior. 현재 브러쉬 자체
 - type: the string “start”, “brush” or “end”; see brush.on. 현재 이벤트 타입
 - selection: the current brush selection. 현재 브러싱된 영역
 - sourceEvent: the underlying input event, such as mousemove or touchmove. 실제 이벤트
```

- *활용 방법* : 일반적인 사용 패턴은 `brush.on`을 통해 `start, brush, end` 이벤트 발생시 이벤트 리스너를 등록하고, `d3.event.selection`을 통해 현재 선택 영역을 확인



산점도 행렬 브러쉬 적용
---

### 브러쉬 정의
- d3.brush 생성기 정의

```javascript
var brush = d3.brush();
```

### 브러쉬 설정
 - 산점도 영역 크기 만큼 브러시 영역의 크기를 설정 : `[[x1, y1], [x2,y2]]`
  
```javascript
brush = brush.extent([[0, 0], [region.bandwidth(), region.bandwidth()]]);
```

- 브러쉬 이벤트 리스너 등록
 - d3-drag와 유사
```javascript
brush = brush.extent([[0, 0], [region.bandwidth(), region.bandwidth()]])
  .on('start', brushStarted)
  .on('brush', brushed)
  .on('end', brushEnded);
```

- brushStarted: 브러싱 동작이 개시되면 현재 선택된 요소가 지난 요소와 같은지 확인 후, 다른 경우 초기화

```javascript
var brushCell;
function brushStarted(d) {
  if(brushCell !== this) { // 드래그한 셀이 바뀌면 기존 브러쉬 영역을 지움
    d3.select(brushCell).call(brush.move, null); //brush.move(selection, null) 하면 영역이 지워짐
    brushCell = this;
  }
}
```

- brushed: 브러싱 동작 도중 `d3.event.selection`을 확인하고 영역 내의 요소 외에는 `.hidden` 클래스를 적용
  - `d3.event.selection` 값은 해당 영역의 `[[x0, y0], [x1,y1]]`을 가리킴
  - `scale.invert`를 이용해서 `range -> domain` 값을 찾는다. http://devdocs.io/d3~4/d3-scale#continuous_invert

```javascript
function brushed(d) {
  if(d3.event.selection === null) return; //선택된 것이 없으면 아무것도 하지 않음
  var xName = d.x.name, yName = d.y.name; 
  var scale = scales.get(this); //현재 영역의 스케일을 local에서 찾아낸다
  var domain = d3.event.selection.map(function(d) { //[[x0, y0], [x1,y1]]
    return [scale.x.invert(d[0]), scale.y.invert(d[1])]; //거꾸로 range에서 domain을 찾음
  });
  svg.selectAll('.point').classed('hidden', function(d,i) {
    return d[xName] < domain[0][0] || d[xName] > domain[1][0] || d[yName] > domain[0][1] || d[yName] < domain[1][1]; //영역 밖을 감춘다.
  })
}
```

- 브러싱이 끝났을 때 혹시 선택 영역이 없으면 모든 `.hidden` 클래스를 제거

```javascript
function brushEnded(d) {
  if(d3.event.selection === null) { // 현재 선택 영역이 없다면 === 클릭만 한 경우
    svg.selectAll('.point').classed('hidden', false);
  }
}
```

- point의 css 속성 설정

```css
.point {
  fill-opacity : .7;
}
.point.hidden {
  fill : #ddd !important;
}
```


### 브러쉬 SVG 삽입
 - 개별 산점도 영역에 각각 `g`를 추가한 후, `brush` 설정을 `call`하면 자동으로 셀마다 브러시가 추가됨.

```javascript
cell.append('g')
  .attr('class', 'brush')
  .call(brush);
```
