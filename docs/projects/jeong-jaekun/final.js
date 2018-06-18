d3.json('final.3.json').then(function (data) {
    var nest = d3.nest()
        .key(function (d) { return d.regi })
        .entries(data);
    console.log(nest);
    //  console.log(datap);
    var w = 180;
    var h = 150;
    var mar = { top: 20, right: 20, bottom: 20, left: 20 };
    var innerW = w - mar.left - mar.right,
        innerH = h - mar.top - mar.bottom;
    var xRange = [0, innerW];
    var yRange = [innerH, 0];
    var x = d3.scalePoint().domain(d3.range(40, 75)).range(xRange)
    var y = d3.scalePoint().domain(d3.range(30, 100)).range(yRange)
    var c = d3.scaleOrdinal().domain(nest.map(function (d) { return d.key }))
        .range(d3.schemeCategory10);
    var xAxis = d3.axisBottom(x).tickSize(2).tickPadding(4)
        .tickValues([40, 45, 50, 55, 60, 65, 70]);
    var yAxis = d3.axisRight(y).ticks(6).tickSize(2)
        .tickValues([30, 40, 50, 60, 70, 80, 90, 100]);
    //var xtick = [40,45,50,55,60,65,70,75]

    console.log(data)

    var svg = d3.select('#scatter').append('svg')
        .attr('width', w * 6).attr('height', h + 20).append('g')
        .attr('transform', 'translate(' + [5, 5] + ')');

    var region = svg.selectAll('.region')
        .data(nest, function (d) { return d.key })
        .enter().append('g').attr('class', 'region')
        .attr('fill', function (d) { return c(d.key) })
        //   .attr('stroke', function (d) { return c(d.key) })    
        //.attr('clip-path', 'url(#bar-clip)')
        .attr('transform', function (d, i) {
            return 'translate(' + [mar.left + (w + 5) * i, mar.top] + ')';
        })
    //.append('g'); //clip-path 이동을 막기위해 추가 
    region.append('text')
        .attr('class', 'text')
        .attr('font-size', 12)
        .attr('transform', 'translate(' + [45, -10] + ')')
        .text(function (d) { return (d.key) })

    region.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + [0, innerH] + ')')
        .call(xAxis);
    region.append('g')
        .attr('class', 'y axis').call(yAxis)
        .attr('transform', 'translate(' + [innerW, 0] + ')')
        .call(yAxis);

    var point = region.selectAll('.point')
        .data(function (d) { return d.values })
        //.data(function(d) {return nest}, function(d) {return d.values})
        .enter().append('circle')
        .attr('class', 'point')
        .attr('cx', function (d) { return x((d.age)); })
        .attr('cy', function (d) { return y((d.score)); })
        .attr('r', 3);
    })
d3.json('final.3.json').then(function (data) {
    var nest = d3.nest()
        .key(function (d) { return d.regi})
        .key(function (d) {return d.age})
        .sortKeys(function (a, b) {
            return parseInt(a) - parseInt(b);
        }) //x의 오름차순으로 정리한다.
        .rollup(function (values) {
            return d3.mean(values, function (d) {
                return d.score;
            })
        })

        .entries(data);
    console.log(nest);
  //  console.log(datap);
    var w = 700;
    var h = 150;
    var mar = { top: 20, right: 20, bottom: 20, left: 20 };
    var innerW = w - mar.left - mar.right,
        innerH = h - mar.top - mar.bottom;
    var xRange = [0, innerW];
    var yRange = [innerH, 0];


    var x = d3.scalePoint().domain(d3.range(42,73)).range(xRange)
    var y = d3.scalePoint().domain(d3.range(30,80)).range(yRange)
    var c = d3.scaleOrdinal().domain(nest.map(function (d) { return d.key }))
        .range(d3.schemeCategory10);
    var xAxis = d3.axisBottom(x).tickSize(2).tickPadding(4)
    .tickValues([45,50,55,60,65,70]);
    var yAxis = d3.axisRight(y).ticks(6).tickSize(2)
    .tickValues([30,40,50,60,70,80]);
    //var xtick = [40,45,50,55,60,65,70,75]
  
    console.log(data)
  
    var svg = d3.select('#scatter').append('svg')
        .attr('width', w+120).attr('height', h*5+100).append('g') 
        .attr('transform', 'translate(' + [105, 5] + ')');
    svg.append('clipPath')
        .attr('id', 'bar-clip')
        .append('rect')
        .attr('x', -mar.left)
        .attr('y', -mar.top)
        .attr('width', innerW + mar.left+100)
        .attr('height', h + mar.top);
    var line = d3.line()
        .x(function (d) {return x(parseInt(d.key));})
        .y(function (d) {return y(parseInt(d.value));})
    
        var region = svg.selectAll('.region')
        .data(function (d) {return nest}, function (d) {return d.key})
        .enter().append('g').attr('class', 'region')
        .attr('fill', function (d) { return c(d.key) })
        .style('stroke', function (d) { return c(d.key) })
        //   .attr('stroke', function (d) { return c(d.key) })    
        .attr('clip-path', 'url(#bar-clip)')
        .attr('transform', function (d, i) {
            return 'translate(' + [mar.left, mar.top+ (h+10)*i] + ')';})
        .append('g')
    region.append('text')
        .attr('class', 'text')
        .attr('font-size',12)
        .attr('transform','translate('+[45,-10]+')')
        .text(function (d) {return (d.key)})
    var a =["m1=52.43 se=6.37",   //서울경기
            "m2=53.30 se=10.78",  //강원제주
            "m3=64.55 se=10.24",
            "m4=56.44 se=12.70",  //대전충청
            "m5=62.08 se=12.37" //경상
            ]  //전라
        region.append('text')
        .data(a)
        .attr('class', 'text')
        .attr('font-size', 12)
        .style('stroke','black')
        .attr('transform', 'translate(' + [300, -10] + ')')
        .text(function (d) {return d})

        region.append('g')
        .attr('class', 'x axis')
        .style('stroke','black')
        .attr('transform', 'translate(' + [0, innerH] + ')')
        .call(xAxis);
    region.append('g')
        .attr('class', 'y axis').call(yAxis)
        .style('stroke', 'black')
        .attr('transform', 'translate(' + [innerW, 0] + ')')
        .call(yAxis);
    region.append('path')
        .datum(function (d) {return d.values})
        .attr('class', 'series')
        .style('fill','none')
        .attr('d', line)
    
    var point = region.selectAll('.point')
        .data(function(d) {return d.values})
        //.data(function(d) {return nest}, function(d) {return d.values})
        .enter().append('circle')
        .attr('class', 'point')
        .attr('cx', function (d) {return x((parseInt(d.key)));})
        .attr('cy', function (d) {return y((parseInt(d.value)));})
        .attr('r', 3);
    point.on('mouseenter', function (d) {
        var temp=0;
        var tooltip = region.selectAll('.tooltip')
            .data(function (p) {
                return p.values.filter(function (v) {
                    temp = v.key 
                    return d.key < temp+50 && d.key > temp-2; 
                })
            })
        console.log(temp)
            tooltip.enter().append('text')
            .attr('class', 'tooltip')
            .merge(tooltip)
            .attr('x', function (d) {return x(parseInt(d.key));})
            .attr('y', function (d) {return y(parseInt(d.value));})
            .attr('dx', '.35em')
            .attr('dy', '-.35em')
            .style('visibility', 'visible')
            .text(function (d) {return parseInt(d.value)})    
        })
        .on('mouseleave', function (d) {
        var tooltip = region.selectAll('.tooltip')
            .style('visibility', 'hidden')    
        });

  

      
})

