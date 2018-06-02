색상 매핑 Map Color
===

(참고)
Visual Analysis and Design, Ch.10 Map Color and Other Channels

목표
---
- 기본적인 색 이론을 이해하자
- 데이터 시각화에서 색상에 관련된 중요한 이슈들을 확인하자


<img width="302" alt="screen shot 2016-12-07 at 7 34 23 pm" src="https://cloud.githubusercontent.com/assets/253408/20964279/3b665bb8-bcb4-11e6-8d19-0eb907d6522c.png">

색 이론
---
- 색은 세가지 독립된 채널 *밝기Luminance, 색조Hue, 채도Saturation* 으로 구성

### 색각 Color Vision
- 간상체rods와 추상체cones로 구성되며 일반적인 빛은 추상체를 통해 감지
- 추상체는 3가지로 구분되며 서로 다른 파장의 빛에 반응
  - 적–녹, 청–황, 흑–백
  - 이중 흑–백에 해당하는 밝기를 감지하는 채널이 가장 민감함
  - 이러한 채널을 통해 색을 시각적으로 인코딩할 때 발생하는 이슈를 크게 두 가지, `밝기`와 `색도chromaticity`의 문제로 나눌 수 있음

### 색공간 Color Spaces
(참고) https://en.wikipedia.org/wiki/Color_space
https://en.wikipedia.org/wiki/List_of_color_spaces_and_their_uses

![](http://www.wed-pix.com/wp-content/uploads/2015/11/colorspace.jpg)
- 색 공간(色空間, color space)은 색 표시계(color system)를 3차원으로 표현한 공간 개념
  - 색 표시계(color system)란 CIERGB, CIEXYZ, CIELAB, CIELUV 등의 색 체계
- 인간의 지각 가능한 색 공간은 3가지 축을 통해 정의됨. 다양한 수학적 모델을 통해 색공간이 정의.
- RGB보다는 HSL이 인간 친화적


### RGB
![RGB](https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/RGB_Cube_Show_lowgamma_cutout_b.png/300px-RGB_Cube_Show_lowgamma_cutout_b.png)
 -  빨강Red, 초록Green, 파랑Blue 세 종류의 광원을 축으로 하여 공간을 형성하며, 색을 섞을수록 밝아짐.

### HSL : Hue Saturation Lightness
![HSL](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Hsl-hsv_models.svg/400px-Hsl-hsv_models.svg.png)
 - 색조Hue, 채도Saturation, 밝기Lightness를 기준으로 색상을 구성
   - H : 색상환에서 가장 파장이 긴 빨강을 0°로 하였을 때 상대적인 배치 각도
   - S : 색상의 가장 진한 상태를 100%로 하였을 때 진함의 정도, 0%는 같은 명도의 무채색을
   - V : 흰색, 빨간색 등을 100%, 검은색을 0%로 한 밝기의 정도

 - 색공간은 우리가 지각하는 색상을 완벽하게 반영하지는 못함. 의사지각적pseudoperceptual

   <img width="643" alt="screen shot 2016-12-07 at 8 07 03 pm" src="https://cloud.githubusercontent.com/assets/253408/20965385/c0d1335a-bcb8-11e6-9ec6-ef51cad242cc.png">
   - 위의HSL 6개 원색의 HSL의 L 값은 동일하지만 실제 기계로 측정한 밝기 값은 L값과 차이를 보임. 또한 사람이 느끼는 것처럼 발밝기가, 선형적으로 일정하게 변화하도록 계산을 하면 측정 값과도 차이를 보임.

- 사람이 지각하는 빛의 정도는 파장에 따라 달라짐 Spectral sensitivity
  - 녹–황색 사이 더욱 민감히 반응
<img width="631" alt="screen shot 2016-12-07 at 8 10 17 pm" src="https://cloud.githubusercontent.com/assets/253408/20965492/355116dc-bcb9-11e6-8b30-efff9dddc12a.png">


 #### L*a*b* : 지각적으로 균등한 공간을 제안한 모델
   - 밝기 채널 `L*` 과 색상 `a*, b*` 축으로 구성
      -  L* = 0일 때 검정, * = 100 이면 흰색
      -  a*이 음수이면 초록에 치우친 색깔이며, 양수이면 빨강/보라 계열
      -  b*이 음수이면 파랑이고 b*이 양수이면 노랑.

   - CIE XYZ 색 공간을 `비선형` 변환하여 만들어진 색 공간
   - RGB나 CMYK가 표현할 수 있는 모든 색역을 포함하며, 인간이 지각할 수 없는 색깔도 포함
   - 축은 개별적으로 지각적으로 선형이도록 구성되어 있음(개별 축은 수치적으로 비선형)
   - 정확히 두 색상을 보간interpolation할 때 유용

![lab_color_space](https://user-images.githubusercontent.com/253408/26925815-2fd0c844-4c86-11e7-8788-6037868d039e.png)


밝기, 채도, 색조
---
- 밝기와 채도는 크기를 나타내는 채널로, 색조는 구분을 위한 채널로 주로 사용됨

<img width="613" alt="screen shot 2016-12-07 at 8 35 12 pm" src="https://cloud.githubusercontent.com/assets/253408/20966245/b39b4ae6-bcbc-11e6-8b04-5c56fe9b13ae.png">


### 밝기
-  밝기는 순서를 나타내는데 가장 유리
    - 단 비연속적으로 배치될 경우 명도대비 때문에 대조효과가 생겨 부정확함
   - 배경이 균일하지 않을 경우 5개 이하의 단계만을 사용하는 것이 좋음
- 밝기는 또한 대조에 유리

### 채도
- 채도 역시 순서를 나타내는데 유용하지만 역시 비연속적 영역에서는 부정확함
- 또한 크기 채널에 간섭을 받기 쉬움.
  - 작은 영역의 채도는 상대적으로 지각하기 어려움

- 크기가 작은 영역은 보다 밝고 높은 채도를 사용하는 것이 구분을 용이하게 함

### 색조
- 색조 자체는 순서를 나타내는 효과가 없음
- 역시 작은 영역에 사용되면 구분이 어려움

투명도 Transparency
---
- 투명도는 다른 색상 채널과의 상호작용이 크기 때문에 독립적으로 사용되기 어려움
- 투명도는 주로 레이어를 겹쳐 사용할때, 전경과 후경을 구분하기 위해 사용


색상지도 Colormaps
---
- 색상지도란 색상과 데이터 값 사이의 인코딩 과정
- 범주형categorical, 순서형ordered로 구분되며 순서형은 다시 순차형sequential과 확산형diverging으로 구분
- 또한 연속 범위continuous range를 갖거나 분절segmented 되어 있음

<img width="614" alt="screen shot 2016-12-07 at 8 56 27 pm" src="https://cloud.githubusercontent.com/assets/253408/20966842/a5d53464-bcbf-11e6-8ede-e92d53b0ba81.png">


범주형 Categorical Colormaps
---
- 분절된 형태의 색상을 사용
  - 세가지 색상 채널을 통합해서 활용
  - 기본적으로 채도가 높고, 쉽게 명명 가능한 색상을 사용하는게 유리
- 명도 대비를 방지하기 위해 유사한 밝기의 색상을 사용하는 것이 좋고 배경과의 대비 고려
- 작은 영역에는 채도가 높은 색상을 사용하는것이 구분이 쉽지만, 반대의 경우 채도를 낮추는게 유리

<img width="817" alt="screen shot 2016-12-07 at 9 03 01 pm" src="https://cloud.githubusercontent.com/assets/253408/20967022/911c0aec-bcc0-11e6-93a3-3663b0b7261f.png">

- 많은 색을 불연속적인 공간에 사용하면 정상적인 구분이 불가

<img width="605" alt="screen shot 2016-12-07 at 9 04 42 pm" src="https://cloud.githubusercontent.com/assets/253408/20967101/f8a5ae34-bcc0-11e6-853f-489eecf36862.png">


순서형 Ordered Colormaps
---
- 순차적sequential : 최대 최소 범위를 가짐
- 확산형diverging : 양 끝에 두가지 색조를 두고 중앙에 중립적인 색상(회색, 검정, 높은 밝기의 색)을 배치

- 연속형continuous 색상지도에서는 고유한 색조의 수를 결정하는 것이 중요
  - 강조하고 싶은 구조의 단계에 따라 조절

<img width="837" alt="screen shot 2016-12-07 at 9 16 06 pm" src="https://cloud.githubusercontent.com/assets/253408/20967357/6785dff8-bcc2-11e6-996f-5c16cfa2bff2.png">

### 무지개형 색상지도 Rainbow Colormaps
- 무지개형 색상은 중앙 부근의 단계를 강조할 수 있고, 작은 단위별로 대조가 쉬움
- 하지만 문제가 많음
  - 색조hue가 순서를 나타내는데 사용
  - 실제 단계가 지각적으로 선형적이지 않음.
  - 색조 채널은 정밀한 지각이 불가능(밝기가 더욱 효과적)

<img width="817" alt="screen shot 2016-12-07 at 9 19 33 pm" src="https://cloud.githubusercontent.com/assets/253408/20967454/f070e8bc-bcc2-11e6-93d3-f4f181ab406d.png">



### 단조 증가 밝기 색상지도 monotonically increasing luminance colormaps
 - 다양한 색조를 밝기의 변화에 따라 배치
 - 색조는 범주적인 속성을 구분 하기위해 단계적으로 선택 가능
 - 지각적으로 선형인 무지개형 색상지도도 가능하지만, 채도가 높은 색상을 사용하지 못해 장점이 없어짐
 <img width="642" alt="screen shot 2016-12-07 at 9 25 09 pm" src="https://cloud.githubusercontent.com/assets/253408/20967600/a9718024-bcc3-11e6-8002-7f2ab3b43a30.png">
