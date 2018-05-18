d3.nest 활용하기
===

(참고)
- http://devdocs.io/d3~4/d3-collection#nest
- http://bl.ocks.org/phoebebright/raw/3176159/

목표
---
- 표 형태의 데이터셋을 중첩된nested 형태로 변환
- d3.nest 함수에 대한 이해와 활용
- aggregate에 대한 이해와 활용
- 자바스크립트에서 배열 정렬하기



중첩구조 만들기 Nesting(groupby)
---
 - 테이블에서 위계가 있는 트리 구조로 바꾸기 `Table -> Hierarchical tree structure`

 
 ```javascript
 var yields = [ //오브젝트가 들어있는 일반적인 배열 구조의 자료
  {yield: 27.00, variety: "Manchuria", year: 1931, site: "University Farm"},
  {yield: 48.87, variety: "Manchuria", year: 1931, site: "Waseca"},
  {yield: 27.43, variety: "Manchuria", year: 1931, site: "Morris"},
  ...
];

var entries = d3.nest() //d3의 .nest 기능
    .key(function(d) { return d.year; }) //year로 먼저 묶고
    .key(function(d) { return d.variety; }) //variety로 묶음
    .entries(yields);



[{key: "1931", values: [ //결과 
   {key: "Manchuria", values: [
     {yield: 27.00, variety: "Manchuria", year: 1931, site: "University Farm"},
     {yield: 48.87, variety: "Manchuria", year: 1931, site: "Waseca"},
     {yield: 27.43, variety: "Manchuria", year: 1931, site: "Morris"}, ...]},
   {key: "Glabron", values: [
     {yield: 43.07, variety: "Glabron", year: 1931, site: "University Farm"},
     {yield: 55.20, variety: "Glabron", year: 1931, site: "Waseca"}, ...]}, ...]},
 {key: "1932", values: ...}]

 ```


1-level
---
- [샘플 파일](./sample/sample.nest.json)
- `nest.key` 통해 그룹-키group-key를 설정하고 `nest.entries`에 데이터셋을 전달하여 실행
- 결과는 `key`와 `values`로 나뉘어 저장


```javascript
d3.json('sample/sample.nest.json').then(function(data) {
 var entries = d3.nest()
  .key(function(d){return d.category})
  .entries(data);
 console.log(entries);
});
```

2-level
---
- `.key`를 중첩하여 사용
```javascript
var entries = d3.nest()
 .key(function(d){return d.category})
 .key(function(d){return d.sub_category})
 .entries(data);
```


Rollup
---
- 다양한 집산Aggregation을 위해 `nest.rollup`을 통해 leaf-node들의 값을 변형할 수 있다.
- 이때 값은 `values`가 아닌 `value`로 저장된다.

- 그룹별 아이템 빈도 세기

```javascript
var entries = d3.nest()
 .key(function(d){return d.category})
 .key(function(d){return d.sub_category})
 .rollup(function(values){return values.length}) //rollup 기능을 사용, values 배열을 가지고 특정 값을 뱉어낸다.
 .entries(dataset);

```

- 오브젝트를 반환하는 것도 가능
 - [d3.sum](https://github.com/d3/d3-array#sum) 통해서 array의 값을 합산 
```javascript
var entries = d3.nest()
 .key(function(d){return d.category})
 .key(function(d){return d.sub_category})
 .rollup(function(values){
   return {
     count:values.length,
     sum:d3.sum(values, function(d){return d.value}
   )};
 })
 .entries(dataset);
```

정렬 Sorting
---
- nested 된 자료를 정렬하기 위해 먼저 자바스크립트에서 정렬 방법을 알아본다. 
- Javascript의 Comparator 생성방법 http://devdocs.io/javascript/global_objects/array/sort
 - 정렬 원리 : 콜백 함수로 두 값을 비교해서 내놓는 값에 따라 순서가 결정
   - `a,b` 둘을 비교할 때 a가 앞에 오고 싶다면 음수, 반대의 경우는 양수를 반환한다.

```javascript
function compare(a, b) {
  if (a is less than b by some ordering criterion) {
    return -1;
  }
  if (a is greater than b by the ordering criterion) {
    return 1;
  }
  // a must be equal to b
  return 0;
}
```

```javascript
function compareNumbers(a,b) { //오름차순으로 정렬
  return a-b; //b-a는 내림차순 정렬
}
```

- 문자를 비교할 때는 [string.localeCompare](http://devdocs.io/javascript/global_objects/string/localecompare)를 사용 
```javascript
function compareStrings(a,b) { //오름차순으로 정렬
  return a.localeCompare(b); // a가 b보다 작으면 -1, 같으면 0, 크면 1 b-a는 내림차순 정렬
}
```

- Array.sort : 배열의 내장 정렬 기능 

```javascript

var numbers = [3,1,2,0,4];
numbers.sort(function (a, b) {
  return a - b // 3-1 = 2 => 3이 뒤로 감
});

var items = ['réservé', 'premier', 'cliché', 'communiqué', 'café', 'adieu'];
items.sort(function (a, b) {
  return a.localeCompare(b); //스트링을 비교해서 a가 b보다 작으면 - 같으면 0 크면 +
});

 var numbers = [3,1,2,0,4,2,3,1,4]; //
 var targets = [1,3,2,4,0];
 numbers.sort(function(a,b) {
   return targets.indexOf(a) - targets.indexOf(b);
 });
 console.log(numbers);
});
```

- nest.sortKeys : key의 순서를 정렬
  - [d3.ascending, d3.descending](https://github.com/d3/d3-array#ascending)을 활용하면 편리
```javascript
nest
  .key(function(d){return d.category})
  .sortKeys(function (a,b) { return a.localeCompare(b);})
  .key(function(d){return d.sub_category})
  .sortKeys(d3.descending)
```

- nest.sortValues : values의 순서를 정렬

```javascript
var entries = d3.nest()
 .key(function(d){return d.category}).sortKeys(function (a,b) { return a.localeCompare(b);})
 .key(function(d){return d.sub_category}).sortKeys(d3.descending)
 .sortValues(function(a,b) {return a.position - b.position}) //position의 오름차순으로 정렬
 .entries(dataset);
```


nest.map
---
- 출력형식을 배열 `[{key:..., values:...}, ...]` 가 아닌 오브젝트 형태`{key1:values1, key2:values2}` 변환

- `nest.entries` 대신에 `nest.object`을 사용
- `nest.entries` 대신에 `nest.map`을 사용
  - `d3.map` 형태로 출력된다. (http://devdocs.io/d3~4/d3-collection#map)
  - `map.get`, `map.set`을 통해 접근

```javascript
var entries = d3.nest()
 .key(function(d){return d.category}).sortKeys(function (a,b) { return a.localeCompare(b);})
 .key(function(d){return d.sub_category}).sortKeys(d3.descending)
 .sortValues(function(a,b) {return a.position - b.position}) //position의 오름차순으로 정렬
 .map(dataset);
```
