Javascript
===

스크립트 삽입
---
```html
<script>
...
</script>
```

Hoisting
---
- javascript는 같은 scope 안에서 변수를 나중에 선언declaration 해도 된다. => 끌어올림 Hoisting 되었다.

```javascript
console.log(x);
x = 5; //할당 assignment
console.log(x);
var x; //선언 declaration
```

- declaration은 hoisting 되지만, 초기화initializations는 그렇지 않다.

```javascript
var x = 5; // 초기화 Initialize x
console.log(x,y);
var y = 7; // 초기화 Initialize y
```

https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
- 코드의 실행 전, 컴파일 단계에서 scope 안에 있는 `function, var`가 미리 메모리에 선언
- `function`의 경우 정의까지 됨
- 실제 hoisting은 부수작용일뿐

```javascript
catName("Chloe");

function catName(name) {
  console.log("My cat's name is " + name);
}
```

```javascript
console.log(typeof fun);
var fun = 3;
console.log(typeof fun);
function fun(){}
console.log(typeof fun);
```


Function-level Scoping
---
- C나 Java와 같은 block scope({} 밖에서는 안을 알 수 없음)대신 function-level scope을 사용
- function을 기준으로 scope이 결정됨
- 참고: 현재 ES6에서는 `let, const`를 통해 블록 단위로 범위를 결정

```javascript
var foo = function() {
  var a = 3, b = 5;
  var bar = function() {
    var b = 7, c = 11;
    a += b+ c;
  }
  bar();
  console.log(a, b, c);
}
foo();
```

```javascript
function foo() {
  var x = 4;
  if(x == 4) {
    var y = 15;
    for (var i = 0; i <= x; i++)
    {
      var j = i;
    }
  }

  console.log(y, i, j);

}
foo();
```


Closure
---
- [클로저](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Closures)는 독립적인 (자유) 변수를 가리키는 함수이다. 또는, 클로저 안에 정의된 함수는 만들어진 환경을 '기억한다'.
- 함수가 메모리 상에 남아있는 한 환경도 계속 기억

```javascript
function init() {
  var name = "홍길동"; // init에 있는 지역 변수 name
  function displayName() { // 내부 함수, 즉 클로저인 displayName()
    console.log(name); // 부모 함수에 정의된 변수를 사용한다
  }
  displayName();
}
init();
```

```javascript
function makeFunc() {
  var name = "홍길동";
  function displayName() {
    console.log(name);
  }
  return displayName;
}

var myFunc = makeFunc();
myFunc();
```

```javascript
var person = function(name) {
  return {
    showName: function() {
      return name;
    }
  }
}
var gilDong = person('홍길동');
console.log(gilDong.showName());
```

```javascript
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);

console.log(add5(2));  // 7
console.log(add10(2)); // 12
```

*[클로져 응용 퀴즈](./00_quiz.md)*


Function context
---
- `this` 키워드는 함수가 실행 될 때의 `function context`를 가리킨다.

- 전역 환경에서 실행될 때 : this는 window나 undefined
```javascript
function foo() {
  return this;
}
console.log(window === foo());
'use strict';
function foo2() {
  return this;
}
console.log(undefined === foo2());
```

- 객체 속성method으로 실행될 때: this는 해당 객체 
```javascript
var a = {
  foo: function() {
    return this;
  }
}

console.log (a === a.foo());
```


- 생성자constructor 에서 사용될 때 : this는 해당 인스턴스
```javascript
function Ninja() {
  this.foo = function () {
    return this;
  };
}
var ninja1 = new Ninja();
console.log(ninja1 === ninja1.foo());
```


- `apply,call` 통해 사용될 때 : this는 첫번째 인자

```javascript
function foo() {
  return this.name;
}
console.log(foo());
var a= {
  name: 'foo'
}
console.log(foo.apply(a));
```

콜백Callback
---
- 자바스크립트의 함수는 [Higher-order function](https://en.wikipedia.org/wiki/Higher-order_function) ([생활코드: 값으로서의 함수와 콜백](https://opentutorials.org/course/743/6508))
  - 한개 이상의 함수를 함수의 인자로 사용 가능하다.
  - 함수가 함수를 반환 가능하다.
- 함수형 언어 [Functional Languages](https://en.wikipedia.org/wiki/Functional_programming)

- 콜백함수 Callback function가 빈번히 사용된다.
  - 함수를 인자로 받아
  - 특정 조건에 해당 함수를 실행시킨다.

```javascript
setTimeout(function() {
  alert('콜백 함수가 실행되었습니다.')
}, 1000)

[1,2,3].map(callback);

function callback(d) {
  return d * d;
}


function foo(list, callback) {
  var i, el;
  var result = [];
  for (i = 0; i < list.length; i++) {
    el = list[i];
    result.push(callback(el));
  }
  return result;
}

foo([1,2,3], callback);
```


DOM Interface
---
- 자바스크립트를 통해 HTML 상의 요소에 직접 접근할 수 있다. 
- [DOM 소개](https://developer.mozilla.org/ko/docs/Gecko_DOM_Reference/%EC%86%8C%EA%B0%9C)
- [DOM과 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events)
```html
<div class="block">블록1</div>
<div class="block">블록2</div>
<p class="block" id="special">블록3</p>
```

```javascript
document.getElementsByTagName('div');
document.getElementsByClassName('block');
var special = document.getElementById('special');
special.addEventListener('click', function() { //클릭 콜백함수를 불러온다.
  alert(this.innerHTML);
})

var span = document.createElement('span');
span.textContent = '추가';
special.appendChild(span);
```