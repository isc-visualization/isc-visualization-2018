네트워크 Network
===
(참고) Visual Analysis and Design, Ch.9 Arrange Networks and Trees

목표
---
- 네트워크 구조에 대한 이해
- 네트워크 구조의 시각화 기법



네트워크 Network
---
- 노드node와 링크link(혹은 Edge)로 이루어진 자료 구조
- 그래프Graph로도 부름

### 방향Directed vs. 무방향Undirected

![directed](http://webmathematics.net/images/three-node%20networks.jpg)


### 표현형Representations
 - 목록List이나 행렬Matrix를 이용해서 표현

![repr](http://cis-linux1.temple.edu/~pwang/9615-AA/Lecture/09-01.jpg)


힘-방향 배치 Force-Directed Placement
----
- 노드-링크 표현형을 그대로 표현하며, 요소의 위치를 물리적인 힘을 시뮬레이션하여 결정
- 노드는 서로 밀어내고, 링크는 당긴다.
- 위치가 속성attribute를 나타내는 채널channel로 사용되지 않음
  - 노드와 링크가 겹치지 않도록 시뮬레이션 한 결과 부수 효과로 위치가 결정

![screen shot 2016-11-25 at 9 02 07 pm](https://cloud.githubusercontent.com/assets/253408/20624820/7e3614b2-b352-11e6-850b-a7bfcb759956.png)

- 레이아웃이 종종 비결정적nondeterministic으로 변화하기도 함
- 확장성scalability에 한계가 있음 : 노드가 많으면 뒤엉켜서 보기 힘듦 (hairball), 새로 노드가 추가되거나 삭제되면 모양이 크게 변화


매트릭스 Matrix View
---

- 인접 매트릭스 adjacency matrix를 그대로 표현
- 가중 네트워크 weighted matrix 표현 가능
- 무방향undirected인 경우 대칭이고, 대각선 아래나 위로 절반만 보여줘도 됨
![screen shot 2016-11-25 at 9 06 31 pm](https://cloud.githubusercontent.com/assets/253408/20624913/1097eb96-b353-11e6-939d-33ff17e22479.png)


연결형 표현과 매트릭스 표현 비교 Connection versus Matrix
---
- 노드-링크 레이아웃의 경우 직관적이고 작은 네트워크에 효과적
  - 링크 밀도link density(노드 대비 링크의 수, 1인 경우 노드마다 링크가 1개)가 3-4이면 효과적
- 매트릭스의 경우 크고 밀도가 높은 네트워크에서 지각적인 확장성이 좋음
  - 또한 예측, 안정성, 재정렬이 쉬움

![screen shot 2016-11-25 at 9 19 37 pm](https://cloud.githubusercontent.com/assets/253408/20625162/e5fe572e-b354-11e6-9afc-dc87065ff1f5.png)

- 매트릭스의 단점은 낮은 직관성
  - 서로 연결이 되어있는 파벌clique(모두가 서로 연결)는 대각선을 기준으로 정사각형 블록으로 표현됨
  - 클러스터cluster는 완전히 상호 연결되지는 않지만 유사한 구조를 보임
  - 이분 클리크biclique 특정 부분 집합끼리 서로 링크가 연결된 구조
  - 복잡한 연결 경로를 탐색하기 어려움 
