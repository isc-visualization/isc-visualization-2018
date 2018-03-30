var dataset = [ 5, 10, 15, 20, 25 ];
/*
var container = document.getElementsByClassName('container')[0];
for (var i = 0; i < dataset.length; i++) {
  var p = container.appendChild('p');
  p.textContent = datset[i];
}
*/

d3.select("div.container").selectAll("p")
  .data(dataset)
  .enter().append('p')
  .classed('red', function(d,i) {
    return i % 2 === 0;
  })
  /*
  .attr('class', function(d,i) {
    if(i % 2 === 0) return 'red';
  })
  */
  /*
  .style('color', function(d) {
    if (d > 15) {   //Threshold of 15
        return "red";
    } else {
        return "black";
    }
  })
  */
  .text(function(a, index) {
    return (index +1) + '번째 값: ' + a;
  })

