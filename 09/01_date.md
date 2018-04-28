날짜-시간 다루기
===

목표
---
- 자바스크립트의 날짜 객체를 다루기
- D3의 time과 time-format 모듈을 활용하여 날짜를 계산하거나 출력하기


자바스크립트 날짜 객체 Javascript Date Object
---
(참고) https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date

- 자바스크립트의 날짜 객체는 단일한 순간(타임스탬프timestamp)을 가리킴


#### 날짜 객체 만들기
 - 현재 날짜-시간이나 특정, milliseconds, 텍스트, 연도-월-날짜-시간 값 전달 등의 방법
```javascript
new Date();
new Date(value); //1 January 1970 00:00:00 UTC 이후 milliseconds https://en.wikipedia.org/wiki/Unix_time
new Date(dateString); //RFC 2822 : D, d M Y H:i:s O   | ISO 8601 : YYYY-MM-DDTHH:mm:ss.sssZ
new Date(year, month[, date[, hours[, minutes[, seconds[, milliseconds]]]]]); //month가 0–11까지것에 주의!
```

-ISO 8601
 - 날짜-시간을 표기하는 다양한 포맷이 있는데 그중 가장 표준이되는 형태 
 - `YYYY-MM-DDTHH:mm:ss.sssZ`

```
YYYY = four-digit year
MM   = two-digit month (01=January, etc.)
DD   = two-digit day of month (01 through 31)
hh   = two digits of hour (00 through 23) (am/pm NOT allowed)
mm   = two digits of minute (00 through 59)
ss   = two digits of second (00 through 59)
s    = one or more digits representing a decimal fraction of a second
TZD  = time zone designator (Z or +hh:mm or -hh:mm)
```


```javascript
var today = new Date();
var birthday = new Date('December 17, 1995 03:24:00');
var birthday = new Date('1995-12-17T03:24:00');
var birthday = new Date(1995, 11, 17);
var birthday = new Date(1995, 11, 17, 3, 24, 0);
```


### 경과시간 계산하기
- 경과 시간 elapsed time 계산 : 두 Date 객체를 빼면 된다.
 - 결과는 milliseconds 단위


```javascript
var start = Date.now(); //지금 날짜-시간

window.setTimeout(function() { ///1000 milliseconds 후에 해당 함수를 실행한다.
  var end = Date.now(); 
  var elapsed = end - start;
  console.log(elapsed); //흐른 시간 
}, 1000)
```

#### 경과날짜 세기
```javascript
var start = new Date(2016, 01, 01),
    end = Date.now();
(end - start) / 864e5; //1000 milliseconds * 60 seconds * 60 minues * 24 hours 
```

d3-time : 계산하기
---
(참고) https://github.com/d3/d3-time

### d3.interval
 - 시간의 경우 타임스탬프를 특정 시간 단위 변화시키는 것이 중요
 - 이를 도와주기 위해 다양한 시간 단위를 자동으로 계산할 수 있는 단위 제공
 - `d3.timeXxxx` 형태 

### interval.count 기간 계산

- 특정 일로부터 날짜 계산해보기
```javascript
d3.timeDay.count(start, end); //  start, end는 Date Object
```

### interval.round 특정 timestamp 단위 바꾸기

- 날짜 오브젝트에서 월 단위에 맞춰 일괄적으로 변환하기 
```javascript
d3.timeMonth(Date.now()); //기본은 내림 floor
d3.timeMonth.floor(Date.now());
d3.timeMonth.round(Date.now());
d3.timeMonth.ceil(Date.now());
```

### interval.offset 특정 단위 이후 및 이전 시간 계산 

- 특정 요일 만큼 이동하기
```javascript
d3.timeWeek.offset(Date.now(), 4);
```

#### interval.range 기간내 특정 단위별로 날짜 구하기

- 2일 간격으로 날짜 구하기
```javascript
d3.timeDay.range(new Date(2016, 10, 1), new Date(2016, 10, 7), 2);
```

```javascript
var now = new Date();
d3.timeWeek.range(d3.timeMonth.floor(now), d3.timeMonth.ceil(now));
```

### interval.every 상위 기간의 시작으로부터 일정한 간격으로 날짜 구하기
 - `d3.timeMinute.every(15) 는 정각에서 15분 단위로 계산` :00, :15, :30, :45, etc. 
```javascript
d3.timeDay.every(2).range(new Date(2016, 0, 1), new Date(2016, 0, 7));
d3.timeDay.every(2).range(new Date(2016, 0, 2), new Date(2016, 0, 8)); // d3.timeDay의 상위 단위는 Month 이므로, 1일부터 시작하여 2일씩 간격이동
```

d3-time-format : 출력하기 
---
- 특정한 형식의 string으로 date 객체를 변환하거나 역으로 파싱parse 하여 출력하기
(참고) https://github.com/d3/d3-time-format#locale_format

#### timeFormat: 특정 날짜 객체의 출력 포맷 정할 때
```javascript
var formatTime = d3.timeFormat("%B %d, %Y"); // timeFormat 출력을 위한 generator 생성
formatTime(new Date); // "June 30, 2015"
```

### timeParse: 특정 출력 포맷을 날짜 객체로 변환할 때 
```javascript
var parseTime = d3.timeParse("%Y-%m-%d");
parseTime('2016-11-07');
```



(참고) 별도의 [locale](https://ko.wikipedia.org/wiki/%EB%A1%9C%EC%BC%80%EC%9D%BC)을 설정할 수 있음 d3.timeFormatLocale(definition)
- https://github.com/d3/d3-time-format/blob/master/locale/ko-KR.json
- 날짜를 koKR 형식으로 출력하고 싶을 때 

```javascript
var koKR = {
  "dateTime": "%Y/%m/%d %a %X",
  "date": "%Y/%m/%d",
  "time": "%H:%M:%S",
  "periods": ["오전", "오후"],
  "days": ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
  "shortDays": ["일", "월", "화", "수", "목", "금", "토"],
  "months": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  "shortMonths": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
};
var locale = d3.timeFormatLocale(koKR);
locale.format("%Y년 %B %d일, %A")(new Date);
locale.parse("%Y년 %B %d일, %A")("2016년 11월 12일, 토요일")
```

(참고) d3-format https://github.com/d3/d3-format
- 시간 이외 숫자 포매팅
