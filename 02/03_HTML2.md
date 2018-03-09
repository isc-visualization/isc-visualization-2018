HTML 2
===

```html
<!DOCTYPE html>
<html lang="kr">
	<head>
		<title>Page Title</title>
		<meta charset="UTF-8">
	</head>
	<body>
		<h1>My First Heading</h1>
		<p>My first paragraph. Hello World!</p>
    <a href="https://github.com/itct-visualization/itct-visualization-2016">Link</a>
    <img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150" alt="placeholder 350X150">
	</body>
</html>
```

Tags
---

### List
```html
<ul>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>
<ol>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ol>
```
<ul>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>
<ol>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ol>

### Span
```html
<p>My mother has <span style="color:blue">blue</span> eyes.</p>
```
<p>My mother has <span style="color:blue">blue</span> eyes.</p>

### division
```html
<div style="color:#0000FF">
  <h3>This is a heading</h3>
  <p>This is a paragraph.</p>
</div>
```
<div style="color:#0000FF">
  <h3>This is a heading</h3>
  <p>This is a paragraph.</p>
</div>

### Emphasis
```html
<p>
  <em>I am emphasized</em><br>
  <strong>I am strongphasized</strong>
</p>
```
<p>
  <em>I am emphasized</em><br>
  <strong>I am strongphasized</strong>
</p>

#### [* 태그 목록](http://www.w3schools.com/tags/default.asp)

Attributes
---
```html
<tagname property="value"></tagname>
```

```html
<a href="http://itct.snu.ac.kr">ITCT</a>
```

### Classes and IDs
- class : 반복해서 사용할 때 (.className)
- ID : 고유명, 페이지에서 한 번만 사용 (#IDName)
- 둘 모두 숫자로 시작하면 안됨 `id="1" (X) id="item1" (O)`
- CSS, form, Javascript 등에서 사용

```html
<p class="paragraph" id="intro">intro </p>
<p class="paragraph" id="content">content</p>
```

Comments 주석
---

- 코드에 대한 설명이 필요할 때 사용
- 실제 문서가 브라우저 상에 표출될 때에는 보이지 않음
```html
<!-- Your comment here -->
```

DOM
---

- HTML 문서의 위계적 구조 `Document Object Model`
![DOM](http://www.w3schools.com/js/pic_htmltree.gif)
- The DOM is a fully object-oriented representation of the web page => **Javascript**
* 참고 [Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)

Developer Tools 개발자 도구
---

`Ctrl+Shift+I (or Cmd+Opt+I on Mac)`
 - Elements 에서 DOM 확인해보기
