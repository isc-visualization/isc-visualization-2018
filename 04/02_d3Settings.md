D3 세팅하기
===

[D3 홈페이지](https://d3js.org/)


D3란?
---
- *Data-Driven Documents*
- 데이터에 의해 문서(DOM 기반의 HTML, SVG 등)를 조작하기 위한 자바스크립트 라이브러리
  - 데이터를 편집 -> 문서에 결합 -> 시각화 요소를 생성
  - 직접 특정 챠트나 도형 등을 생성하는 기능은 없음
  - 저수준 라이브러리
- 철저히 웹 표준 기술들에 기반
- 인터액션, 애니메이션 지원
- 현재 버젼 5.0

다운로드
---

- HEAD에 직접 삽입
`<script src="https://d3js.org/d3.v5.min.js"></script>
`


- [다운로드](https://github.com/d3/d3/releases/download/v5.0.0/d3.zip) 후 삽입
- 폴더 구조
```
d3.v3.js
d3.v3.min.js (optional:출시할 때 사용하는 간소화 버젼)
index.js
index.html
```

- 템플릿
```HTML
<!DOCTYPE html>
<html lang="kr">
<head>
        <meta charset="utf-8">
        <title>D3 페이지 템플릿</title>
        <script type="text/javascript" src="d3.v3.js"></script>
    </head>
    <body>
        <script src="index.js"></script>
    </body>
</html>
```

로컬 테스트 서버 세팅
---
- File 프로토콜로 실행 시킬 경우, 외부 파일의 접근을 막는 브라우져들이 있음 : HTTP 프로토콜로 실행 시키기 위해 테스트 서버를 실행
- 맥에 경우 이미 설치 되어 있음. 윈도우는 [다운로드](https://www.python.org/downloads/) 후 [설치](https://tutorial.djangogirls.org/ko/python_installation/)
- 맥은 터미널, 윈도우는 명령 프롬프트 실행

```shell
cd project-folder
python -m SimpleHTTPServer 8888
python3 -m http.server 8888
```

- 브라우져 주소창에 `http://localhost:8888`
- 종료 시킬때는 `ctrl+c`
