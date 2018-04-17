업데이트 4
===

목표
---
- 트랜지션transiton을 활용하여 자연스럽게 업데이트 해보자

자연스러운 트랜지션 만들기
---
- 새로 추가되어 .enter 되는 요소는 우측에서 왼쪽으로 진행, 처음에는 투명하도록 세팅

```javascript
var barEnter = bar.enter().append('g')
  .attr('class', 'bar')
  .call(updateBarPos)
  .attr('transform', function(d) {
    return 'translate('+ [x.range()[1], xy.get(this)[1]] + ')'; //range바깥에서 시작된다
  })
  .style('opacity', 0);
```

- .update 상태에 .enter된 막대가 추가되었으므로(merge 통해서), 막대 전체가 translate 되므로 추가된 막대도 함께 이동
```javascript
bar.update(updateBarPos)
  .transition(t) 
  .style('opacity', 1)
  .call(translateBar);
```
- .enter의 rect는 형태가 고정된채 이동하도록 변경
```javascript
barEnter.append('rect')
  .attr('width', x.bandwidth())
  .call(updateRectHeight);
```


** (실습) 삭제되는 막대는 .update에서 제외된 .exit 상태이므로 동시에 사라지지 않음. 자연스럽게 왼쪽으로 사라지게 해보자 ( 힌트 : `transition.remove`를 트랜지션 마지막에 쓰면 트랜지션이 종료된 후 알아서 삭제한다.) **


클리핑Clipping 적용하기
---
- [클리핑](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Clipping_and_masking)은 요소의 일부만이 보이도록 통제하고 싶을때 사용하는 기법 (http://devdocs.io/svg/element/clippath)

- SVG의 `clip-path`를 활용한다.

```javascript
svg.append('clipPath')
    .attr('id', 'bar-clip')
  .append('rect')
    .attr('width', innerW)
    .attr('height', innerH)

```

- bar에 클리핑을 적용하면 작동 안함.
```javascript
barEnter.attr('clip-path', 'url(#bar-clip)'); //작동 안함. 대상에 transform 이 적용된 경우 clip-path도 transform이 동시에 적용, bar가 translate 되었으므로, clip-path도 상대적으로 이동

```

- axis 등을 다 그리고 `g`를 하나더 추가한 후 영역 전체에 `clip-path`를 적용
```javascript
svg = svg.append('g') //새로운 g를 맨위에 추가 
  .attr('clip-path', 'url(#bar-clip)');
```
