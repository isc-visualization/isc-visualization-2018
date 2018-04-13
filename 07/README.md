7주차
===


1. [업데이트 3](./01_update3.md)
2. [업데이트 4](./02_update4.md)
3. [중첩 셀렉션 1](./03_nested.md)
4. [중첩 셀렉션 2](./04_nested2.md)


## 과제07 스몰 멀티플즈 Small multiples

<img style="-webkit-user-select: none" src="https://cloud.githubusercontent.com/assets/253408/19599077/919ed672-97d9-11e6-9a8d-f478d49c7ebe.gif">

1. [샘플 JSON 파일](https://raw.githubusercontent.com/isc-visualization/isc-visualization-2018/master/07/sample/nested.sample2.json)을 이용하여, 너비와 높이가 각각 `160X80px`인 스캐터플롯을 그립니다.(내부 여백은 임의로 적당히 설정하세요)
2. 데이터는 `position` 속성 값을 `key`로 분류 되어있습니다. 그룹별로 스캐터플롯을 그리고 차례로 배열합니다.
3. 개별 스캐터 플롯의 가로축 위치는 `category` 순서대로, 세로축 위치는 `value` 값을 이용하여 결정합니다. 세로축의 범위`domain`는 개별 그룹의 `values`에 속하는 `value`값들의 최대-최소 범위로 설정합니다.
4. 개별 스캐터 플롯의 원은 반지름은 `5px`, 선 두께는 `2px`로 통일하고, 선 색상은 `key`값에 따라 구분합니다.(색상은 임의로 정하셔도 됩니다)
5. 개별 스캐터 플롯별로 가로-세로축을 모두 그려넣습니다.(축의 스타일 역시 임의로 결정합니다)
6. 개별 스캐터 플롯을 클릭 할때마다 그룹별로 새로운 아이템을 추가합니다. 새로운 아이템의 `category` 값은 현재 그룹의 마지막 카테고리 값의 다음 값(알파벳 순서)으로 정합니다. `value`는 `[0,1]` 범위의 임의의 값으로 추가합니다. 마지막 `category`값이 `Z`인 경우 다음 값은 `A`부터 다시 시작합니다.
7. 그룹별로 새 아이템을 추가한 후, 가장 처음 아이템은 삭제 합니다. 새로 개정된 데이터를 개별 스캐터플롯에 입력한 후 갱신 합니다. 이때 가로-세로 축도 함께 갱신 합니다.
8. 트랜지션`transition` 적용은 필수가 아닙니다.


`본 과제는 별도의 추가 과제가 없습니다.`

- 제출마감 : `2018-04-20 (금) 18:00`
- 제출방법
  - [제출 폴더](https://www.dropbox.com/request/fupvjqASKKFmX9PNU8No)
  - 제출명 : 파일명 `이름-학번.zip` (예: honggildong-2013.zip)
 - 제출물 :
   - 결과물은 `index.html, index.js`에 작성합니다.
   - 결과물 파일(`index.html`, `index.js`, `nested.sample2.json`)은 모두 `honggildong-2013` 폴더에 넣은 후 압축하여 업로드 합니다.
   - d3 이외의 외부 라이브러리의 사용은 금합니다.
