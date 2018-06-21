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
     order: '6대',
     volume: 50.43,
     showText: 50.43,
     category: 1
    },
    {
     order: '7대',
     volume: 70,
     showText: '?',
     category: 2
    }]     

var xDomain = dataset2.map(function(d){
    return d.order
});

var x1 = d3.scaleBand()
          .domain(xDomain)
          .rangeRound(xRange)
          .padding(0.4);

var yDomain = [0, 100]
var y = d3.scaleLinear()
          .domain(yDomain)
          .range(yRange);

//축 그리기
var xAxis = d3.axisBottom(x1)
              .tickSize(5)
              .tickPadding(10);
var yAxis = d3.axisLeft(y)
              .ticks(3)
              .tickSizeOuter(0)
              .tickSizeInner(-innerW);

var xy = d3.local();

function updateBarPos1(selection) {
    selection.each(function(d) {
      xy.set(this, [x1(d.order), y(d.volume)]);
    })
    return selection;
  }
  function translateBar1(selection) {
    selection.attr('transform', function(d){
      return 'translate('+ xy.get(this) + ')'
    });
    return selection;
  }
  function updateRect1(selection) {
    selection
      .attr('height', function(d){return innerH - xy.get(this)[1]});
    return selection;
  }
  function updateText1(selection){
    selection
    .text(function(d){return d.showText});
    return selection;
  }


var svg3 = d3.select('#example2').append('svg')
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

svg3.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + [0, innerH]+ ')')
    .call(xAxis);


// svg3.append('g')
//     .attr('class', 'y axis')
//     .call(yAxis);
var color = d3.scaleOrdinal()
  .domain(xDomain).range(["#2385c6", "#a5a8aa"]);

var bar = svg3.selectAll('.bar1')
    .data(dataset2)
    .enter().append('g') 
    .attr('class', 'bar1')
    .call(updateBarPos1)
    .call(translateBar1)
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
        d.volume = 35.5
        d.showText = '35.5'
        return d;
    }).call(updateBarPos1)
    .transition(t)
    .call(translateBar1)
    .attr('fill', 'red');

    b.select('rect')
    .transition(t)
    .call(updateRect1)

    b.select('text')
    .transition(t)
    .call(updateText1)
}
});


var rect = bar.append('rect') 
.attr('width', x1.bandwidth())
// .attr('height', function(d){return innerH - y(d.volume)})
.call(updateRect1);

var text = bar.append('text')
    .attr('dx', x1.bandwidth()*0.5)
    .attr('dy', function(d) {return '2em';})
    .attr('text-anchor', 'middle')
    .style('fill', 'white')
    .text(function(d){return d.showText});
