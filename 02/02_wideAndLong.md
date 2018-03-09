표 다루기 1 : 재형성 Reshape
====

목표
---
 - 표를 만들거나 정리할 때 적합한 형식을 이해하자
 - 대표적인 형식은 wide, long 형태를 이해하자


### Long
   - 개별 열이 속성attribute을 가리킨다.

| 상점 | 연도 | 매출 |
|------|------|------|
| 가   | 2014 | 100  |
| 가   | 2015 | 150  |
| 가   | 2016 | 120  |
| 나   | 2014 | 80   |
| 나   | 2015 | 180  |
| 나   | 2015 | 220  |

 `해당 표의 키key는 무엇일까?`

### Wide :
  - 헤더에 특정 속성 값을 전개하고 값을 표시
  - 테이블에서 보여주고 싶은 정보를 강조, 무엇이 키가 되는지 자료 자체가 말해줌


| 상점 | 2014 | 2015 | 2016 |
|------|------|------|------|
| 가   | 100  | 150  | 120  |
| 나   | 80   | 180  | 220  |

`해당 표의 키key는 무엇일까?`

### Long -> Wide 변형
  - 보통 pivot table 기능을 활용 [실습]
  - 다중 키를 명시적으로 표현할 때 쓰이며 3개 이상의 속성을 이용할 때는 셀 병합을 이용하게 됨
  - 속성 이름을 알 수 없고 다른 필드들이 유실

###  Wide -> Long 변형
  - 복원이 어려움
    - 속성의 이름을 알 수 없음(메타 정보가 필요)
  - 엑셀이나 구글시트에서는 [스크립트](https://docs.google.com/spreadsheets/d/12TBoX2UI_Yu2MA2ZN3p9f-cZsySE4et1slwpgjZbSzw/edit)나 [플러그인](http://kb.tableau.com/articles/knowledgebase/addin-reshaping-data-excel?lang=ko-kr#2010?lang=ko-kr) 등을 설치
  - R이나 Python Pandas의 melt
  - (참고)[Preparing Excel Files for Analysis](http://kb.tableau.com/articles/knowledgebase/preparing-excel-files-analysis?lang=ko-kr)

  - 많은 통계형 자료가 wide형태로 되어 있으므로 분석을 위해서는 long형태로 변환 해야함
   - 예) [통계청 국가통계포털](http://kosis.kr/)
  - 

`늘 Long 형태를 기준으로 하자.`
