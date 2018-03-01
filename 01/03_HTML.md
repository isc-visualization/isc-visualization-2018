HTML
===


편집기 다운로드
---
- 비주얼스튜디오 코드 https://code.visualstudio.com/

웹WEB 이란 ?
---
- 상호 연결된 문서들
- **웹 서버**와 **웹 클라이언트** 간의 대화([위키](https://en.wikipedia.org/wiki/Client%E2%80%93server_model))
	- 웹 클라이언트(브라우져) google.com 문서(리소스)를 요청(request) => 웹 서버 200 OK(response)
		- 예) 404 에러 : 해당 주소에 페이지가 없음

- URI (Uniform Resource Identifier)
 - URL (Uniform Resource Locator) / URN (Uniform Resource Name)
 - 모든 개별 웹 페이지는 서로 다른 URL을 갖음(이론상)
 - 4가지 부분으로 구성
   - 통신 프로토콜 communication protocol : HTTP, HTTPS
	 - 도메인명 : example.com
	 - 포트 번호 : 80 Hypertext Transfer Protocol (HTTP) used in the World Wide Web
	 - 패스, 파라미터 : /path/?query=abcd
	 - 예 ) https://www.google.co.kr/#newwindow=1&safe=off&q=url


HTML
---
### HTML 이란
-  *H* yper *T*ext *M* arkup *L* anguage
- 마크업 언어 O / 프로그래밍 언어 X => 내용과 구조를 동시에 표현
- HTML 태그tag로 HTML 문서를 표현

### Hello World!
1. 폴더를 하나 만든다.
2. [index.html](./resource/index.html) 파일을 만든다.
3. 편집기에 아래와 같이 붙여넣기나 위에 경로에서 다운로드 받는다.
4. 브라우져에 드래그 하거나 실행

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Page Title</title>
		<meta charset="UTF-8">
	</head>
	<body>
		<h1>My First Heading</h1>
		<p>My first paragraph. Hello World!</p>
	</body>
</html>
```

- 일부 태그를 제외하고는 열고 닫는다. 열고 닫을 수 있는 태그는 사이에 다른 태그나 텍스트를 삽입 가능하다.
- 위계 구조를 만들 수 있다.
- 서로 다른 태그는 서로 다른 콘텐트를 가진다.

간단한 태그 살펴보기
---

- HTML `html` : 문서의 시작과 끝 알린다.
- 헤드 `head` : 문서와 관련된 메타데이터
- 제목 `title` : 문서의 제목, 브라우져 상단에 표시
- 본문 `body` : 헤드 이외의 모든 부분
- 헤딩 `h1–h6` : 헤를 단계별로 설정
```
<h1>This is heading 1</h1>
<h2>This is heading 2</h2>
<h3>This is heading 3</h3>
```
<h1>This is heading 1</h1>
<h2>This is heading 2</h2>
<h3>This is heading 3</h3>

- 문장 `p` : 문장 쓰기
```
<p>This is a paragraph.</p>
<p>This is another paragraph.</p>
```
<p>This is a paragraph.</p>
<p>This is another paragraph.</p>

- 링크 `a` : 하이퍼 링크!
```html
수업페이지 <a href="https://github.com/isc-visualization/isc-visualization-2018">바로가기</a>
```
수업페이지 <a href="https://github.com/isc-visualization/isc-visualization-2018">바로가기 </a>
```html
02_시각화맛보기 <a href="README.md">바로가기</a>
```
02_시각화맛보기 <a href="README.md">바로가기</a>

- 이미지 `img` : 이미지 삽입
```html
<img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150" alt="placeholder 350X150">
```

<img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150" alt="placeholder 350X150">


```html
<img src="resource/placeholder.png" alt="placeholder">
```
<img src="resource/placeholder.png" alt="placeholder">

 ** 참고 : http://www.w3schools.com/html/default.asp **
