3주차
===

1. [Javascript](./01_javascript.md)
2. [CSS 2](./02_CSS2.md)
3. [SVG](./03_svg.md)


## 과제03 SVG를 만들고 Javascript로 스타일 및 속성 통제 해보기
![assignment](https://cloud.githubusercontent.com/assets/253408/18709725/77b8574c-803c-11e6-946f-cd0b29a5eb1c.gif)

1. `240px X 160px` 크기의 SVG를 만듭니다.
2. 가로,세로의 길이가 `80px`인 정사각형을 `(20,10)`에서 시작해서 `가로 40px, 세로 20px` 간격으로 4개 그립니다.
3. 왼쪽 사각형부터 색상fill을 각각 `blue, green, yellow, red` 순서로 설정합니다.
4. 사각형 기본 투명도opacity를 `0.2`로 설정하고 제일 왼쪽 사각형만 불투명하게 설정합니다.
5. SVG 영역을 클릭(.onclick)할 때마다 불투명 사각형 다음 사각형의 투명도가 불투명해지고 기존 사각형의 투명도가 `0.2`로 감소합니다. 
6. 마지막(4번째)사각형이 불투명할 때 SVG 영역을 클릭하면 첫번째 사각형이 다시 불투명해집니다.

(팁: DOM 선택)
- `document.getElementById, document.getElementsByTagName, document.getElementsByClassName, EventTarget.addEventListener` 등을 활용. [DOM 소개](https://developer.mozilla.org/ko/docs/Gecko_DOM_Reference/%EC%86%8C%EA%B0%9C)

(팁: DOM class 설정)

- [element.className을 바꾸기, 단 svg의 요소는 classname.baseVal에 추가](https://developer.mozilla.org/en-US/docs/Web/API/element/className)
- [element.setAttribute("class", [name])를 활용](https://developer.mozilla.org/en-US/docs/Web/API/element/setAttribute)
- [element.classList의 .add, .remove 등을 활용](https://developer.mozilla.org/en-US/docs/Web/API/element/classList)

7. (추가점수) 불투명한 사각형이 최상단에 위치하도록 합니다.


- 제출마감 : `2018-03-23 18:00`
- 제출방법
  - [제출 폴더](https://www.dropbox.com/request/lsHWPpJ47HSF1NoKT3pm)
  - 제출명 : `이름-학번.zip` (예: honggildong-2013.zip, 이름은 영어로 써주세요)
  - 제출물 :
    - 결과물은 index.html 하나에 모두 작성합니다.
    - 외부 라이브러리의 사용은 금합니다.
