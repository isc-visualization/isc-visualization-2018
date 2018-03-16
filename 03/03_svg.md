SVG
===

**Scalable Vector Graphics**
- vector-based graphics in [XML](http://www.w3schools.com/xml/) format
- HTML 태그를 작성하듯 작성한다

```xml
<element></element>
<element/>
```

- 반드시 *svg* 태그 안에 모든 요소들을 작성

```xml
<svg width="500" height="200">
</svg>
```

Simple Shapes
---
### SVG 좌표계 coordinates system
![svg coords](http://www.vanseodesign.com/blog/wp-content/uploads/2015/03/wpid-svg-coordinate-system.png)


### 직사각형 Rect
```xml
<rect x="0" y="0" width="500" height="100" />
```

### 원 Circle
```xml
<circle cx="250" cy="100" r="25" />
<circle cx="250" cy="100" rx="50" ry="100"/>
```

### 선 Line
```xml
<line x1="0" y1="0" x2="500" y2="100" stroke="red" />
```

### 텍스트 Text
```xml
<text x="250" y="100">SVG Text</text>
<text x="250" y="100" font-size="24" fill="steelblue">SVG Text</text>
<text x="250" y="100" font-size="24" fill="orange" text-anchor="middle" dy=".35em">SVG Text</text>
```
http://www.w3schools.com/cssref/css_units.asp


스타일링 Styling
---
- 기본은 검정색 fill 과 stroke 미적용
```xml
<circle cx="250" cy="100" r="25" fill="yellow" stroke="orange" stroke-width="4" opacity=".45"/>
```

- css 적용이 가능

```css
circle {
  fill: yellow;
  stroke: orange;
  stroke-width: 4;
  opacity: .45;
}
```

```css
circle {
  fill: rgba(0, 255, 255, .45);
  stroke: rgb(255, 255, 0, .8);
  stroke-width: 4;
}
```

```css
circle {
  fill: blue;
  fill-opacity: .45;
}
```

그룹화 Grouping
---
- g 태그를 통해 다른 SVG 요소들을 그루핑 할 수 있다.
- g에 적용된 transformation이나 styling은 자식 요소들에게 전달된다.
```xml
<g stroke="green" fill="white" stroke-width="5">
    <circle cx="25" cy="25" r="15"/>
    <circle cx="40" cy="25" r="15"/>
    <circle cx="55" cy="25" r="15"/>
    <circle cx="70" cy="25" r="15"/>
  </g>
```



---
* 참고
http://www.w3schools.com/graphics/svg_intro.asp
https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial
