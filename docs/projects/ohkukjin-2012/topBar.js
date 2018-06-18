    var w = 1000;
    var h = 400;
    var margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    };
    var innerW = w - margin.left - margin.right,
        innerH = h - margin.top - margin.bottom;
    var xRange = [0, innerW];
    var yRange = [innerH, 0];
    var dataset1 = [{
         order: '2대',
         volume: 7
        },
        {
         order: '3대',
         volume: 5
        },
        {
         order: '4대',
         volume: 6
        },
        {
         order: '5대',
         volume: 10
        },
        {
         order: '6대',
         volume: 6
        },
        {
         order: '7대',
         volume: 10
        }]     

    var xDomain = dataset1.map(function(d){
        return d.order
    });
    var x = d3.scaleBand()
              .domain(xDomain)
              .rangeRound(xRange)
              .padding(0.3);
    
    var yDomain = [0, 11]
    var y = d3.scaleLinear()
              .domain(yDomain)
              .range(yRange);

    //축 그리기
    var xAxis = d3.axisBottom(x)
                  .tickSize(5)
                  .tickPadding(10);
    var yAxis = d3.axisLeft(y)
                  .ticks(2)
                  .tickSizeOuter(0)
                  .tickSizeInner(-innerW);
                  
    
    var svg1 = d3.select('#topBar').append('svg')
               .attr('width', w)
               .attr('height', h)
               .append('g')
               .attr(
                   'transform',
                   'translate(' + [margin.left, margin.top] + ')'
               );
            
    svg1.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + [0, innerH]+ ')')
        .call(xAxis);

    svg1.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    var bar = svg1.selectAll('.bar')
        .data(dataset1)
        .enter().append('g') //rect 대신에 g를 추가하자
        .attr('class', 'bar');
 

    bar.attr('transform', function(d){
        return 'translate('+ [x(d.order), y(d.volume)] + ')' //g 위치가 미리 이동
    });
    console.log(x.bandwidth());
    var rect = bar.append('rect') 
        .attr('width', x.bandwidth())
        .attr('height', function(d){return innerH - y(d.volume)})

    var text = bar.append('text')
        .attr('dx', x.bandwidth()*0.5)
        .attr('dy', function(d) {return '2em';})
        .attr('text-anchor', 'middle')
        .style('fill', 'white')
        .text(function(d){return d.volume});