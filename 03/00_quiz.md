Closure Quiz
---

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Page Title</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <div class="button">button1</div>
        <div class="button">button2</div>
        <div class="button">button3</div>
    </body>
</html>

```

```javascript
var add_handlers = function(nodes) {
  var i = 0;
  for(i=0; i < nodes.length ; i++) {
    nodes[i].onclick = function(e) {
      window.alert(i);
    }
  }
};

add_handlers(document.getElementsByClassName("button"));
```
