6주차
===

1. [SVG Group 활용하기](./01_svg-group.md)
2. [축 그리기](./02_axes.md)
3. [업데이트 1](./03_update.md)
4. [업데이트 2](./04_update2.md)

## 과제06 버블 플롯 업데이트
<img width="432"  src="https://cloud.githubusercontent.com/assets/253408/19390689/21047126-9264-11e6-8f73-d9df73bcf400.gif">

1. 너비와 높이가 `400X400px`인 SVG에 [샘플 JSON 파일](https://raw.githubusercontent.com/isc-visualization/isc-visualization-2018/master/05/sample/assignment.json)을 이용하여,
과제05의 추가 과제 형태와 같은 스캐터플롯을 그립니다.
2. 그림과 같이 X/Y축을 그립니다. X축의 범위는 `[0,300]`, y축의 범위는 `[0, 1.0]`로 고정합니다. (축 안에 그려지는 틱tick의 개수와 형태는 예제와 동일해야합니다)
3. 특정 버블 영역을 클릭`click`하면 위와 같이 해당 버블의 `sales, margin, price` 값이 무작위로 업데이트 되도록 합니다. (무작위 값은 현재 축 범위 내에서 생성합니다)
4. 업데이트 된 값에 따라 적정한 위치와 크기로 버블을 변형합니다. 변형 시에는 트랜지션을 사용하여 자연스럽게 이동하도록 합니다.(duration 등의 값은 자유롭게 설정하세요)


#### 추가 과제
`추가 과제의 경우, 기본 과제 밑에 추가하세요. 반드시 수행할 필요는 없습니다.`

<img width="432"  src="https://cloud.githubusercontent.com/assets/253408/19390733/53a2acd8-9264-11e6-9e46-7067a4a46e1e.gif">

- 추가 과제는, 특정 버블에 마우스 커서를 올렸을 때 `mouseenter`, 해당 버블과 다른 카테고리`category`값을 가지는 버블들은 투명도`opacity`가 `.4`가 되도록 설정합니다. 커서가 올라간 버블에는 동시에 두께가 `3px`이고 색상이 `#777`인 `stroke`를 그립니다. 커서가 영역 밖으로 나가면 `mouseleave` 처음 화면으로 돌아와야 합니다.


- 제출마감 : `2018-04-13 (금) 18:00`
- 제출방법
  - [제출 폴더](https://www.dropbox.com/request/zqWWTXkmjPOzQquf1rpr)
  - 제출명 : 파일명 `이름-학번.zip` (예: honggildong-2013.zip)
- 제출물 :
   - 결과물은 `index.html`와 `index.js`에 모두 작성합니다.
   - 결과물 파일(`index.html`, `index.js`, `assignment.json`)은 모두 `honggildong-2013` 폴더에 넣은 후 압축하여 업로드 합니다.
   - d3 이외의 외부 라이브러리의 사용은 금합니다.
