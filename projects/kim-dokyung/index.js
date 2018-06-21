var w = 800, h = 800;
var margin = {top:10, right:10, bottom: 10, left: 10};
var innerW = w - margin.right - margin.left,
    innerH = h - margin.top - margin.bottom;

var r = 8;
var c = function(d) {
    if (d.sex === '남') { 
        return '#355c7d';
    } else {
        return '#f67280';
    }};

var svg = d3.select('body').append('svg')
    .attr('class', 'chart')
    .attr('width', w)
    .attr('height', h)
    .append('g')
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')')

var simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(.5))
    .force('center', d3.forceCenter(innerW / 2, innerH / 2))
    .force('collision', d3.forceCollide(r + 1))

d3.csv('data.csv').then(callback);

function callback(data) {
    var node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('r', r)
        .style('fill', c)

    simulation.nodes(data)

    simulation.on('tick', function() {
        node.attr('cx', function(d) {
            return d.x
        })
        .attr('cy', function(d) {
            return d.y
          })
    })
    console.log(data)
}