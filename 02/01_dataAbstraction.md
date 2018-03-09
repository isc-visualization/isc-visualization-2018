데이터 추상화 Data Abstraction
=====
`Visualization Analysis and Design Chapter 2 'What: Data Abstraction'`

목표
---

-   데이터의 구문론Syntatic-의미론적Semantic 구조 이해
-   데이터 셋Dataset
-   데이터와 속성Attribute의 유형Type


준비할 것
---
-   [샘플 테이블 데이터셋](https://docs.google.com/spreadsheets/d/1pscuX2_wKafNT-NbJJ9nR_go4ugaZb0O8g0C0FsbPOs/edit?usp=sharing) 복사


 ![Dataset](https://cloud.githubusercontent.com/assets/253408/18230527/11fc54b4-72d9-11e6-9f4b-42b706a9e696.png)

의미Semantics와 형태Types
---
-   의미Semantics : 데이터가 가진 실제 의미
-   형태Type : 데이터가 가진 구조적 혹은, 수학적 해석
  - 데이터셋Dataset은 어떤 type들로 이루어져있는가?
  - 속성Attribute들은 어떤 수학적 연산이 가능한가?
-   메타데이터Metadata : 의미와 형태의 관계를 정확히 해석하기 위한 데이터(데이터의 데이터)

데이터?
---


데이터 형태 Data Types
---
 `Items | Attributes | Links | Positions | Grids`

 - 아이템Item : 개별 항목 (표의 가로-행, 네트워크의 노드)
 - 속성Attribute : 측정 값, 변수Variable, 차원Dimension (표의 세로-열)
 - 관계Link : item간의 관계 (네트워크의 링크)
 - 그리드Grid : 연속 데이터를 샘플링하여 셀들 사이의 기하학-위상학적 관계를 파악
 - 위치Position : 공간 정보


 데이터셋의 유형 Dataset Types
 ---
 - 데이터셋Dataset: 정보의 집합

`Tables | Networks & Trees | Fields | Geometry`
![dataset types](https://cloud.githubusercontent.com/assets/253408/18231032/28d4b320-72e8-11e6-8599-21f3c354c1fd.png)
![dataset types2](https://cloud.githubusercontent.com/assets/253408/18231033/2a2cf020-72e8-11e6-9f11-9c5f51b9480f.png)

### 표 Tables
 - 행row과 열column으로 이루어짐
  - 행: 아이템 item (also known as "entities," "instances," "exemplars," "elements", "records" or "dependent variables")
  - 열: 속성 attribute (also known as "properties", "predicates," "features," "dimensions," "characteristics", "fields", "headers" or "independent variables")
 - 셀cell : 행과 열의 조합을 통해 특정 값value를 갖게됨
 - [Attribute-value system](https://en.wikipedia.org/wiki/Attribute-value_system)

### 네트워크와 트리 Networks & Trees
 - 네트워크Network : 결절node(vertex)들의 관계link(edge)
 - 그래프graphs로도 불리움
 - 결절과 관계와 관련된 속성Attribute 값을 갖을 수 있음
 - 추상적인 개념의 네트워크 데이터 구조와 네트워크의 시각적인 표현을 구분할 필요 있음
 - 트리 Tree : 위계구조를 가진 네트워크
   - 순환cycle이 없음(자식은 하나의 부모 만을 가짐)

 ![Node and Link](https://upload.wikimedia.org/wikipedia/commons/2/29/Semantic_Network_7_Nodes_6_Links.jpg)

 ![Tree](https://www.tutorialspoint.com/data_structures_algorithms/images/binary_tree.jpg)

### 필드 Fields
 - 연속된 범위 안의 값들을 분절하여 셀Cell로 나눔
 - 자연의 물리적 공간이나 수학의 함수들을 표현
 - 샘플링 Sampling이 필요
 - 그리드Grid 형태로 범위를 샘플링하고 개별 셀마다 속성을 가짐

### 기하 Geometry
 - 아이템의 형태공간 위치Spatial Position로 표현한 정보
 - 속성이 반드시 필요하지 않음

속성의 유형 Attribute Types
---
![속성 유형](https://cloud.githubusercontent.com/assets/253408/18246520/1272c7f6-73a7-11e6-9c8c-339d0b9c5d51.png)

- 속성의 유형은 크게 `범주적Categorical` 이거나 `Ordered순서적` 이다.
- 속성의 유형은 조작적으로 결정될 수 있다.

### 범주적 Categorical
 - 일반적인 이름들, 구분만 가능
 - 순서가 없지만 종종 위계적인 구조를 가지기도함
 - 명목nominal 척도scale

### 순서적 Ordered
 - 순서적Ordered : `서열적Ordinal` 하거나 `정량적Quantitative`
 - 서열적Ordinal : 등수, 치수 등 산술 연산 불가능
   - 범주와 구분이 어려운 경우 많음
     - 이름을 `ㄱㄴㄷ`순으로 정렬 한다면?
     - 관습적으로 순서를 갖는 경우 `빨주노초파남보`
   - 실제 d3에서는 둘을 구분하지 않고 `ordinal`형태로 사용
 - 정량적Quantitative : 크기, 양과 같이 산술 연산 가능
  - 통계에서는 등간Interval, 비율Ratio척도로 세분화
  - 일반적인 숫자, 시간
  - 서열과 구분이 어려운 경우 많음



- (참고) 구글 시트의 숫자 포맷
![구글시트숫자포맷](https://cloud.githubusercontent.com/assets/253408/18231321/0f4ccbe0-72f2-11e6-9dbe-90ac16ac6b4a.png)


의미 Semantics
---
- 데이터 속성attribute들의 유형type을 파악하는 것만으로는 정보의 의미semantics을 파악할 수는 없음
- 키key와 값value를 결정하고 이들의 관계를 결정

### 키와 값
- 키key : independent attribute, dimension
  - 독자적unique 해야한다. (primary key)
  - 특정한 값value을 찾는데 사용되는 지표index  
  - categorical, ordinal 가능, Quantitative는 부적합
  - 자료에 명시적인 키가 없을 수도 있음
  - 여러 필드field를 조합하여 키를 만들기도 한다(multidimensional)
  - 키가 없는 시각화도 있다(예Scatterplot)

- 값value : dependent attribute, measure
 - 중복되어도 상관없다.
 - 키에 따라 aggregation 되기도 한다.

??[샘플 테이블 데이터셋](https://docs.google.com/spreadsheets/d/1pscuX2_wKafNT-NbJJ9nR_go4ugaZb0O8g0C0FsbPOs/edit?usp=sharing) 의 키와 값은?

??첫째주 [실습](../01/01_수업소개.md)에서 만들었던 챠트의 키와 값은?

??[Visual Vocabulary](https://github.com/ft-interactive/chart-doctor/blob/master/visual-vocabulary/Visual-vocabulary.pdf)에서 키와 값 살피기
