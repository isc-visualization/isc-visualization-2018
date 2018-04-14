업데이트 3
===

목표
---
- 기존 바챠트를 데이터 개수는 유지되지만, 새로운 데이터가 추가되고 맨 앞 데이터는 삭제되도록 변형
- .update, .exit 셀렉션을 구분해보자

[기존 코드](../06/lecture/bar-group.html)

중복되는 동작은 함수로 만들기
---
- `selection.call`을 이용해서 중복되는 동작은 함수로 만든다.

```javascript
function updateBarPos(selection) {
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
function updateRectHeight(selection) {
  selection
    .attr('height', function(d){return innerH - xy.get(this)[1]});
  return selection;
}
```

*(실습) `selection.call`로 적절한 곳에 추가해보기*


SVG 클릭시 데이터가 추가-삭제 되도록 변경
---

- SVG를 클릭할 때마다 product 의 값이 알파벳 순서대로 증가하도록, 데이터를 추가하고 맨 앞의 데이터는 삭제
- A부터 Z까지 추가 되도록 ascii 코드 사용 http://www.asciitable.com/
- [Array.shift](http://devdocs.io/javascript/global_objects/array/shift) 사용해서 맨 앞의 데이터는 제거 

```javascript
//svg.on('click') 부분에 추가
var randDataset = (function() {
 var asciiRange = [65, 90], //A(65)부터 Z(90)
 var curAscii = 65 + dataset.length;
 return function() { // 클로져를 활용하기 위해 함수를 반환
   var newVal = {product: String.fromCharCode(curAscii), sales : Math.round(rand())};
   dataset.push(newVal); //새로운 데이터 추가
   dataset.shift(); // 맨 앞의 데이터는 제거
   curAscii +=1;
   if (curAscii>asciiRange[1]) curAscii = asciiRange[0]; // Z까지 가고나면 다시 돌아오기 
 }
}());
```

스케일 재설정
---
- 클릭 했을 때, 기존의 x 도메인과, 스케일을 갱신합니다.

```javascript
//svg.on('click') 부분에 추가
xDomain = dataset.map(function(d){return d.product;});
x.domain(xDomain);
```

- 텍스트도 갱신한다.
 - bar의 text의 `.call`에서 부를 함수를 만들어준다.
```javascript
function updateText(selection) {
  selection.text(function(d){return d.product});
  return selection;
}
```

- 데이터 재연결하고 텍스트도 업데이트
```javascript
bar.data(dataset); //데이터를 . 재연결
bar.select('text')
  .transition(t)
  .call(updateText);
```

축 재설정
---
- 축 영역을 선택하여 다시 축을 그린다.
- scale의 도메인이 변경되었기 때문에 자동으로 축이 변경된다.
```javascript
svg.select('.x.axis')
  .transition(t) // 트랜지션을 적용하면 내부적으로 트랜지션 처리
    .call(xAxis); // scaled
```

셀렉션selection에 키Key 설정하여 연결하기
---
- `selection.data([data[, key]])`에서 데이터가 binding에 사용되는 key를 key 함수를 통해 설정가능하다. 
  - 기본적으로는 array의 index를 가지고 key를 바인딩한다`join-by-index`.  
  - 데이터마다 고유한 key를 설정해주면 새로 추가, 삭제된 데이터를 기존 셀렉션과 비교하여 바인딩할 수 있다.

- (참고) http://devdocs.io/d3~4/d3-selection#selection_data

- 데이터를 바인딩하면서 새롭게 키를 설정한다. 이때 bar 변수의 값은 데이터가 새로 바인딩 된 새로운 셀렉션으로 갱신해야한다.
 -  예를 들어 맨 앞 막대 키는 A, 그 다음엔 BCDE로 결정됨. F가 추가되면 기존의 A키로 연결된 바는 셀렉션에서 제외된 .exit 상태가 된다.
```javascript
bar = bar.data(dataset, function(d){return d.product}) // 반드시 bar를 새로 반환받아야함 => 새로 추가-삭제된 데이터를 반영한 셀렉션으로
  .call(updateBarPos); // 위치 업데이트
```


삭제하기 exit and remove
---
- `selection.exit`를 하면 새로 연결된 데이터와 key가 연결되지 않는 셀렉션들만을 선택한다. `selection.remove` 통해 요소를 삭제 가능

```javascript
bar.exit().remove(); //새로 추가된 데이터에 맞는 키가 없는 selection은 .exit 셀렉션이 된다. .remove를 하면 해당 요소가 삭제됨.
```


새로운 요소 추가 enter

- 새로운 key를 갖는 데이터를 위해 요소를 생성한다. 이때 아직 요소를 갖지 않는 셀렉션은 `selection.enter`로 연결된다.

```javascript
var barEnter = bar.enter().append('g') // 새로 추가된 셀렉션만 따로 저장
  .attr('class', 'bar');
```

- 새로 추가된 셀렉션에 rect와 text를 추가한다.

```javascript
barEnter.append('rect')
  .attr('width', x.bandwidth());

barEnter.append('text')
  .attr('dx', x.bandwidth()*0.5)
  .attr('dy', function(d) {return '1em';})
  .attr('text-anchor', 'middle')
  .style('fill', 'white')
  .text(function(d){return d.product});
```

갱신 update
---
- 앞서 선택된 셀렉션과 새로 추가된 enter셀렉션을 merge를 통해 합친 후 업데이트 하고 이를 다시 bar에 저장 => .update 셀렉션

```javascript
bar = barEnter.merge(bar) //새로 추가된 barEnter를 기존 bar와 병합한다.

bar.call(updateBarPos) //모든 bar의 위치를 업데이트
  .transition(t)
  .call(translateBar);
```

- 트랜지션되는 요소들도 업데이트 한다.

```javascript
bar.select('rect')
  .transition(t)
  .call(updateRectHeight);
```
