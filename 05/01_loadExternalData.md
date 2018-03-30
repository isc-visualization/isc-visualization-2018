외부 데이터 연결
====
- [d3-fetch](https://github.com/d3/d3-fetch) 모듈을 활용 (*참고* v5 기준, v4는[d3-request](http://devdocs.io/d3~4/d3-request) 모듈을 활용)
- [Fetch](https://fetch.spec.whatwg.org/)에 기반
- v5부터는 ES6의 [Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise) 활용

- 정해진 파일 양식을 가져오는 것 이외에도 커스텀 리퀘스트를 만들 수 있다.


로컬서버 세팅
---

```
$ python -m SimpleHTTPServer 8888
$ python3 -m http.server 8888
```


TEXT
---

```javascript
d3.text("sample.txt").then(function(text) { //ES
  console.log(text); //텍스트 내용 출력
}).catch(function(error) {
  console.log(error);
});
```

DSV
---
- Delimiter Separated Values
- 보통 CSV(Comma)나 TSV(Tab)를 사용한다. (클라이언트에선 `.xls, .xlsx`는 불러올 수 없음)
  - 실제론 그냥 텍스트 파일일뿐
- 한글 인코딩을 자동으로 확인 못하기 때문에 맥/윈도우 운영체제에 따라 엑셀로 dsv 포맷 저장/불러오기 할때 문제가 생기는 경우 많음, 
  - 일단 UTF-8으로 통일
  - (참고): https://www.libreoffice.org/ 리브레 오피스에서 불러오면 인코딩 자유롭게 설정 가능

```javascript
d3.csv("sample.csv").then(function(data) {
  console.log(data);
});
```

- csv는 모든 형태를 스트링으로 인식하므로, 타입을 직접 지정해줘야함.
- 행 변환 함수(row conversion function)를 전달하여 결과를 미리 변형하는 것이 좋음

```javascript
function row(d) { //row conversion function
  return {
    orderDate : d3.timeParse('%m/%d/%Y')(d['Order Date']), //날짜 형식으로 바꾸기
    orderId : +d["Order ID"], //숫자 형식으로 바꾸기
    sales : d['Sales']
  }  
}

function callback(data) {
  console.log(data);
}

var url = "sample.csv";
d3.csv(url, row).then(callback);
```

- [참고](http://devdocs.io/d3~4/d3-time-format#timeParse) `d3.timeParse` : 스트링 형태의 시간을 Date 오브젝트로 변환하는 함수를 내놓음
```javascript
var parser = d3.timeParse('%m/%d/%Y')
console.log(parser('10/13/2010'));
```


- 데이터 불러와서 찍어보기
```javascript
function callback(data) {
  d3.select('body').selectAll('p')
    .data(data)
    .enter().append('p')
    .text(function(d){return d.orderId + ' | ' + d.orderDate + ' | ' + d.sales})
}
```



JSON
---
- [JSON](http://json.org/)(JavaScript Object Notation) 형식의 파일
- 웹상에서 데이터 전송을 위해 정해진 포맷으로 자바스크립트 오브젝트의 포맷과 동일하다,
- 일반적인 표형식과 달리 위계 구조의 자료를 표기하기 편리하다.
- DSV와 달리 데이터의 타입이 유지된다.

```json
{"menu": {
  "id": "file",
  "value": "File",
  "popup": {
    "menuitem": [
      {"value": "New", "onclick": "CreateNewDoc()"},
      {"value": "Open", "onclick": "OpenDoc()"},
      {"value": "Close", "onclick": "CloseDoc()"}
    ]
  }
}}
```

```javascript
d3.json('sample.json').then(function(data) {
  console.log(data);
  console.log(data.menu.popup.menuitem);
});
```