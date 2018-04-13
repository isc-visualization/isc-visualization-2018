중첩 셀렉션 1 Nested Selection
===


(참고) https://bost.ocks.org/mike/nest/

Nested Selection
----

```html
<table>
  <thead>
    <tr>
      <td>A</td><td>B</td><td>C</td><td>D</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td><td>1</td><td>2</td><td>3</td>
    </tr>
    <tr>
      <td>4</td><td>5</td><td>6</td><td>7</td>
    </tr>
    <tr>
      <td>8</td><td>9</td><td>10</td><td>11</td>
    </tr>
    <tr>
      <td>12</td><td>13</td><td>14</td><td>15</td>
    </tr>
  </tbody>
</table>
```
- `tbody` 속의 `td`를 선택하려면?

```javascript
var td = d3.select("tbody").selectAll("td");
```

거꾸로 tbody 채워보기
---

- html 복사

```html
<table>
  <thead>
    <tr>
      <td>A</td>
      <td>B</td>
      <td>C</td>
      <td>D</td>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>
```

- 이중 배열의 데이터셋 준비
  - 배열의 요소가 배열 
```javascript
var matrix = [
  [ 0,  1,  2,  3], //tr : matrix[0]
  [ 4,  5,  6,  7], //tr : matrix[1]
  [ 8,  9, 10, 11], //tr : matrix[2]
  [12, 13, 14, 15], //tr : matrix[3]
];

console.log(matrix[1]);
console.log(matrix[1][3]);
```

- 데이터셋을 연결 하고 `tr`을 추가
  - matrix 내부의 개별 배열이 `tr`과 연결 된다

```javascript
var tr = d3.select('tbody').selectAll('tr')
  .data(matrix)
  .enter().append('tr');
```

<img width="441" alt="screen shot 2016-10-19 at 8 23 31 pm" src="https://cloud.githubusercontent.com/assets/253408/19517102/2cf27030-963a-11e6-845d-afcf553babbf.png">


- `tr` 밑에 각각 `td`를 추가
 - 부모 노드로부터 자동으로 전달 받는다.

```javascript
var td = tr.selectAll('td')
  .data(function(d){return d;}) // 이때 d는 matrix 내부의 개별 배열 [0,1,2,3]
  .enter().append('td')
    .text(function(d){return d;});
```

<img width="432" alt="screen shot 2016-10-19 at 8 23 36 pm" src="https://cloud.githubusercontent.com/assets/253408/19517105/2e9daed6-963a-11e6-9b8d-9f8e8d19f44b.png">
