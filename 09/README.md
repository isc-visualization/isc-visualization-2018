09주차
===

1. [날짜-시간 다루기](./01_date.md)
2. [시계열 라인 챠트](./02_time-series.md)
3. [중첩 영역 챠트](./03_stack.md)


## 과제 10 중첩 영역 챠트 Stacked Area Chart

<img width="570" src="https://cloud.githubusercontent.com/assets/253408/20214250/55cbc812-a850-11e6-9ec3-47aa6ed430f2.png">

1. [중첩 영역 챠트](./03_stack.md) 실습 자료를 바탕으로 과제를 수행합니다.
2. 실습처럼 일자를 단위로 데이터 포인트를 표현하지 않고 [시계열 라인 챠트](./02_time-series.md) 실습 내용처럼 주 단위(주별 일요일 기준)로 자료를 집산aggregate하여 표현합니다. 집산은 평균mean을 사용합니다.


### 추가 과제

![nov-11-2016 21-48-16](https://cloud.githubusercontent.com/assets/253408/20215592/9d0e4364-a858-11e6-867a-60c4ddfece7e.gif)

- 위처럼 챠트 영역 내에서 마우스 커서를 이동할 때, 커서의 위치가 `주 단위 틱tick 위치`와 같을 때(주별 일요일 날짜 위치로 이동했을 때) 해당 주의 날짜와 시리즈series별 해당 일자 데이터포인트의 누적 값을 표시해줍니다.
- 힌트: `mousemove`시에 커서 위치와 날짜는 아래와 같이 찾을 수 있습니다.

```javascript
svg.on('mousemove', function() {
  var posX= d3.mouse(this)[0]; //d3.mouse 사용
  var date = x.invert(posX); //scaleTime.invert 사용
});
```


- 제출마감 : `2018-05-11 (금) 18:00`
- 제출방법
 - [제출 폴더](https://www.dropbox.com/request/Kpo0n3Eb3qzcbNybz5cH)
 - 제출명 : 파일명 `이름-학번.zip` (예: honggildong-2013.zip)
 - 제출물 :
   - 결과물은 `index.html, index.js` 에 모두 작성합니다. (별도의 스크립트를 작성후 연결해도 좋습니다.)
   - 결과물 파일(`index.html`, `sample.line2.json`, `index.js`)은 모두 `honggildong-2013` 폴더에 넣은 후 압축하여 업로드 합니다.
   - d3 이외의 외부 라이브러리의 사용은 금합니다.
