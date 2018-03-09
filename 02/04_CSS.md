CSS
===
박스 모델 Box Model
----
![boxmodel](https://cloud.githubusercontent.com/assets/253408/18385546/432eee7e-76cc-11e6-882b-0fee9fa5cf0d.png)

- 브라우져가 실제 렌더링을 할 때 모든 태그는 박스로 취급됨
- 요소가 차지하는 실제 넓이는 content의 width+padding+border+margin 이 됨
- 개발자 도구에서 inspect 기능을 통해 박스 모델을 직접 확인할 수 있음
 - `블록Block 요소(div, p ...)`와 `인라인inline 요소(em, a, span,strong)`를 비교 가능
- 추후에 layout을 배울때 다시보자

CSS
---
`CSS is a language that describes the style of an HTML document.`

- HTML은 구조와 내용만을 다루고 스타일은 별도로 처리
-  **C** ascading  **S** tyle  **S** heets
- 지난주 
예시 (해당 [템플릿](./resource/index.html)을 참조하자)

```css
body {
    background-color: lightblue;
}

h1 {
    color: white;
    text-align: center;
}

p,li {
    font-family: verdana;
    font-size: 20px;
}
```

CSS 문법syntax
---

```css
selector {
  property1: value;
  property2: value;
}
```
![css syntax](http://www.w3schools.com/css/selector.gif)


- 콤마(,)로 셀렉터를 다중 선택 가능
```css
selectorA,
selectorB,
selectorC {
   property1: value;
   property2: value;
}
```

```css
p,li {
    font-family: verdana;
    font-size: 20px;
}
```

CSS 삽입하기
---
1. Inline style
2. Internal style sheet
3. External style sheet

- 동일한 셀렉터에 동일한 스타일 속성property의 값value가 겹칠 경우 1,2,3의 순서로 우선순위가 결정(cascade)

### Inline style
- 태그에 속성attribute로 추가
- 해당 태그에만 적용
- 1순위

```html
<h1 style="color:blue;margin-left:30px;font-style:italic">This is a heading.</h1>
```
<h1 style="color:blue;margin-left:30px;">This is a heading.</h1>

### Internal style sheet
- head태그 사이에 style태그를 삽입하고 여러 스타일을 적음
- 셀렉터를 통해 해당되는 태그들은 모두 해당 스타일을 따르게됨
- 2순위

```html
<head>
<style>
body {
    background-color: linen;
}

h1 {
    color: red;
    margin-left: 40px;
}
</style>
</head>
<body>
  <h1>This is a heading.</h1>
</body>
```

### External style sheet
- 별도의 파일을 만들어서 .css 확장자로 저장
- 해당 파일을 HTML 문서에서 불러온다.
- 3순위

```css
body {
    background-color: lightblue;
}

h1 {
    color: green;
    margin-left: 20px;
    font-size : 48px;
}
```

```html
<head>
<link rel="stylesheet" type="text/css" href="mystyle.css">
</head>
```



CSS 셀렉터selector
---
### Type selectors
- 태그 이름을 직접 쓴다.
```css
p {
    text-align: center;
    color: red;
}
```

### ID Selectors
```css
#para1 {
    text-align: center;
    color: red;
}
```

### Class Selectors
```css
.center {
    text-align: center;
    color: red;
}

p.center {
  text-align: center;
  color: red;
}

p.large {
  font-size : 48px;
}

.center.large {
  font-style : italic;
  font-size : 28px;
}

```

```html
<p class="center">This paragraph will be red and center-aligned.</p>
<p class="large">This paragraph will be large.</p>
<p class="center large">This paragraph refers to two classes.</p>
```

### Descendant selectors
- `paranet childeren` 형태로 parent 밑의 모든 children을 선택
```css
div {
  background-color: #ddd;
}
p {
  color : red;
}
div p {
  margin-left : 24px;
}

div p.large {
  font-size: 48px;
}

```

```html
<p>This paragraph will be red.</p>
<div>
 <p>This paragraph will be red and indented.</p>
 <p class="large">This paragraph will be red, indented and large.</p>
</div>
```

### Universal Selector
- 모든 요소를 선택 
* {
  padding: 5px;
  border: 1px solid black;
  background: rgba(255,0,0,0.25)
}
(참고)
[W3Schools - css selectors](http://www.w3schools.com/cssref/css_selectors.asp)
[Mozilla - Selectors](https://developer.mozilla.org/en/docs/Web/Guide/CSS/Getting_started/Selectors)
