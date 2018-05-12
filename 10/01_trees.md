트리 구조 Trees
===
(참고) Visual Analysis and Design, Ch.9 Arrange Networks and Trees

목표
---
- 트리 구조에 대한 간략한 이해
- 트리 구조를 표현하는 시각화 기법
- 트리맵에 대한 이해



트리 구조 Trees
---
- 순환 회로가 없고, 서로 다른 두 노드를 잇는 길이 하나뿐인 그래프

![Tree Structure](https://courses.cs.vt.edu/csonline/DataStructures/Lessons/Trees/tree_diagram.gif)
- Root-Leaf Node(뿔리-말단 노드) Parent-Child Node(부모-자식 노드), Subtree(부트리), Arc or Edge(에지, 간선)

네트워크와 트리의 시각적 표현방식
---

![](https://cloud.githubusercontent.com/assets/253408/20302571/270b19b0-ab6b-11e6-8d63-92f9551b4d62.png)

노드-링크 다이어그램 Node-Link Diagrams
---
- 가장 표준적인 표현 방식
- 노드는 점point marks으로 링크는 선line mark로 표현
- 겹침overlap이 없도록 표현하는 알고리즘이 중요

![nodelink](https://cloud.githubusercontent.com/assets/253408/20302762/efd61e1c-ab6b-11e6-980d-6904568c5c39.png)
![nodelink2](https://cloud.githubusercontent.com/assets/253408/20303088/2656885e-ab6d-11e6-9f07-fb6c7e3da908.png)

## 덴드로그램Dendrogram
- [덴드로그램](https://en.wikipedia.org/wiki/Dendrogram)은 리프노드를 동일한 레벨로 그림

![Dendrogram](https://www.mathworks.com/help/examples/stats/win64/SpecifyNumberofNodesinDendrogramPlotExample_02.png)

![Dendrogram](http://www.instituteofcaninebiology.org/uploads/1/9/6/9/19691109/2336926.png)


트리맵 Treemap
----

![Treemap](https://raw.githubusercontent.com/d3/d3-hierarchy/master/img/treemap.png)


- 연결connection 보다는 격납containment 방식을 사용하여 위계 구조를 표현
   - a tree in a space-constrained layout by using nested rectangles.
- 기존 노드-링크Node-Link 방식의 위계구조 시각표현 방식이 가지는 공간 문제를 해결
- 여러 키Key를 통해 단계별로 네스팅하고, 특정 값Value나 개수Count를 집산하여 리프 노드의 면적을 계산

- [Treemap Tiling](http://devdocs.io/d3~5/d3-hierarchy#treemapBinary): 면적과 위치를 결정(Tiling)하는 알고리즘에 따라 형태가 변형 (순서, 종횡비, 예측 안정성 등이 변화). 디폴트는  `d3.treemapSquarify`


(참고) 단순히 면적을 높이나 너비를 번갈아 나누는 경우 Partition
![Partition](https://raw.githubusercontent.com/d3/d3-hierarchy/master/img/partition.png)



(참고) 트리를 시각화하는 다양한 방식들
![trees](https://cloud.githubusercontent.com/assets/253408/20303262/fe0622d2-ab6d-11e6-8c4c-c59a2dfd770c.png)


(참고)
- http://www.cs.umd.edu/hcil/treemap-history/
- https://en.wikipedia.org/wiki/Treemapping
- http://devdocs.io/d3~4/d3-hierarchy#treemap
