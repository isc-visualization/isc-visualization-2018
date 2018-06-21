var w = 500;
var h = 300;
var margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 40
};
var innerW = w - margin.left - margin.right,
    innerH = h - margin.top - margin.bottom;
var xRange = [0, innerW];
var yRange = [innerH, 0];
var dataset2 = [{
     order: '4대',
     volume: 76.80,
     showText: 76.80,
     category: 1
    },
    {
     order: '5대',
     volume: 75.36,
     showText: 75.36,
     category: 1
    },
    {
     order: '6대',
     volume: 50,
     showText: '?',
     category: 2
    }]     

var xDomain = dataset2.map(function(d){
    return d.order
});

var x3 = d3.scaleBand()
          .domain(xDomain)
          .rangeRound(xRange)
          .padding(0.4);

var yDomain = [0, 100]
var y = d3.scaleLinear()
          .domain(yDomain)
          .range(yRange);

//축 그리기
var xAxis = d3.axisBottom(x3)
              .tickSize(5)
              .tickPadding(10);
var yAxis = d3.axisLeft(y)
              .ticks(3)
              .tickSizeOuter(0)
              .tickSizeInner(-innerW);

var xy = d3.local();

function updateBarPos3(selection) {
    selection.each(function(d) {
      xy.set(this, [x3(d.order), y(d.volume)]);
    })
    return selection;
  }
  function translateBar3(selection) {
    selection.attr('transform', function(d){
      return 'translate('+ xy.get(this) + ')'
    });
    return selection;
  }
  function updateRect3(selection) {
    selection
      .attr('height', function(d){return innerH - xy.get(this)[1]});
    return selection;
  }
  function updateText3(selection){
    selection
    .text(function(d){return d.showText});
    return selection;
  }


var svg5 = d3.select('#example4').append('svg')
           .attr('width', w)
           .attr('height', h)
           .append('g')
           .attr(
               'transform',
               'translate(' + [margin.left, margin.top] + ')'
           );

// svg3.append('clipPath')
//     .attr('id', 'bar-clip')
//     .append('rect')
//     .attr('width', innerW*0.5)
//     .attr('height', innerH)
//     .attr(
//         'transform',
//         'translate(' + [innerW*0.5, margin.top] + ')'
//     );

// svg3 = svg3.append('g')
// .attr('clip-path', 'url(#bar-clip)');

svg5.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + [0, innerH]+ ')')
    .call(xAxis);


// svg3.append('g')
//     .attr('class', 'y axis')
//     .call(yAxis);
var color = d3.scaleOrdinal()
  .domain(xDomain).range(["#2385c6", "#2385c6", "#a5a8aa"]);

var bar = svg5.selectAll('.bar2')
    .data(dataset2)
    .enter().append('g') 
    .attr('class', 'bar2')
    .call(updateBarPos3)
    .call(translateBar3)
    .attr('fill', function(d){return color(d.order)});

// bar.attr('transform', function(d){
//     return 'translate('+ [x(d.order), y(d.volume)] + ')'
// });

bar.on('click', function(d) {
    if(d.category === 2){
    d3.event.stopPropagation();
    var t = d3.transition()
            .duration(3000)
            .ease(d3.easeElastic);
    var b = d3.select(this);
    b.datum(function(d) { //b의 데이터를 재설정
        d.volume = 77.73
        d.showText = '77.3'
        return d;
    }).call(updateBarPos3)
    .transition(t)
    .call(translateBar3)
    .attr('fill', '#2385c6');

    b.select('rect')
    .transition(t)
    .call(updateRect3)

    b.select('text')
    .transition(t)
    .call(updateText3)
}
});


var rect = bar.append('rect') 
.attr('width', x3.bandwidth())
// .attr('height', function(d){return innerH - y(d.volume)})
.call(updateRect2);

var text = bar.append('text')
    .attr('dx', x3.bandwidth()*0.5)
    .attr('dy', function(d) {return '2em';})
    .attr('text-anchor', 'middle')
    .style('fill', 'white')
    .text(function(d){return d.showText});
