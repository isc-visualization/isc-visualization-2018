var w = 1000;
var h = 500;
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
var dataset2 = [{
        order: '서울',
        volume: 3,
        rate: 100,
        showText: 3,
        category: 1
    },
    {
        order: '경기',
        volume: 2,
        rate: 50,
        showText: 2,
        category: 1
    },
    {
        order: '인천',
        volume: 4,
        rate: 25,
        showText: 4,
        category: 1
    },
    {
        order: '광주',
        volume: 2,
        rate: 50,
        showText: 2,
        category: 1
    },
    {
        order: '부산',
        volume: 4,
        rate: 75,
        showText: 4,
        category: 1
    },
    {
        order: '대구',
        volume: 2,
        rate: 100,
        showText: 2,
        category: 1
    },
    {
        order: '대전',
        volume: 4,
        rate: 25,
        showText: 4,
        category: 1
    },
    {
        order: '울산',
        volume: 4,
        rate: 75,
        showText: 4,
        category: 1
    },
    {
        order: '세종',
        volume: 1,
        rate: 100,
        showText: 1,
        category: 1
    },
    {
        order: '제주',
        volume: 2,
        rate: 50,
        showText: 2,
        category: 1
    },
    {
        order: '강원',
        volume: 1,
        rate: 100,
        showText: 1,
        category: 1
    },
    {
        order: '충북',
        volume: 5,
        rate: 60,
        showText: 5,
        category: 1
    },
    {
        order: '충남',
        volume: 2,
        rate: 100,
        showText: 2,
        category: 1
    },
    {
        order: '전북',
        volume: 2,
        rate: 100,
        showText: 2,
        category: 1
    },
    {
        order: '전남',
        volume: 2,
        rate: 100,
        showText: 2,
        category: 1
    },
    {
        order: '경북',
        volume: 4,
        rate: 100,
        showText: 4,
        category: 1
    },
    {
        order: '경남',
        volume: 3,
        rate: 0,
        showText: '?',
        category: 2
    }]     

    var colorDomain = dataset2.map(function(d){
        return d.category
    });

    var xDomain = dataset2.map(function(d){
        return d.order
    });
    
    var bottomX = d3.scaleBand()
              .domain(xDomain)
              .rangeRound(xRange)
              .padding(0.4);
    
    var yLeftDomain = [0, 6]
    var yLeft = d3.scaleLinear()
              .domain(yLeftDomain)
              .range(yRange);

    var yRightDomain = [0, 100]
    var yRight = d3.scaleLinear()
    .domain(yRightDomain)
    .range(yRange);
    
    //축 그리기
    var xAxis = d3.axisBottom(bottomX)
                  .tickSize(5)
                  .tickPadding(10);
    var yLeftAxis = d3.axisLeft(yLeft)
                  .ticks(3)
                  .tickSizeOuter(0)
                  .tickSizeInner(-innerW);
    var yRightAxis = d3.axisRight(yRight)
                .ticks(3)
                .tickSizeOuter(0)
                .tickSizeInner(0);

    var xy = d3.local();
    
    function updateBarPosBottom(selection) {
        selection.each(function(d) {
          xy.set(this, [bottomX(d.order), yLeft(d.volume)]);
        })
        return selection;
      }
      function translateBarBottom(selection) {
        selection.attr('transform', function(d){
          return 'translate('+ xy.get(this) + ')'
        });
        return selection;
      }
      function updateRectBottom(selection) {
        selection
          .attr('height', function(d){return innerH - xy.get(this)[1]});
        return selection;
      }
      function updateTextBottom(selection){
        selection
        .text(function(d){return d.showText});
        return selection;
      }
    
    
    var svg6 = d3.select('#bottomBar').append('svg')
               .attr('width', w)
               .attr('height', h)
               .append('g')
               .attr(
                   'transform',
                   'translate(' + [margin.left, margin.top] + ')'
               );
    
    
    svg6.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + [0, innerH]+ ')')
        .call(xAxis);

    svg6.append('g')
        .attr('class', 'y left axis')
        .call(yLeftAxis)

        svg6.append('g')
        .attr('class', 'y right axis')
        .attr('transform', 'translate(' + [innerW, 0]+ ')')
        .call(yRightAxis)
    
        

   

    var color = d3.scaleOrdinal()
      .domain(colorDomain).range(["#1a9b81", "#a5a8aa"]);
    
    var bar = svg6.selectAll('.bar2')
        .data(dataset2)
        .enter().append('g') 
        .attr('class', 'bar2')
        .call(updateBarPosBottom)
        .call(translateBarBottom)
        .attr('fill', function(d){return color(d.category)});
    

    bar.on('click', function(d) {
        if(d.category === 2){
        d3.event.stopPropagation();
        var t = d3.transition()
                .duration(3000)
                .ease(d3.easeElastic);
        var b = d3.select(this);
        b.datum(function(d) { //b의 데이터를 재설정
            d.volume = 0
            d.showText = '0'
            return d;
        }).call(updateBarPosBottom)
        .transition(t)
        .call(translateBarBottom)
        .attr('fill', '#2385c6');
    
        b.select('rect')
        .transition(t)
        .call(updateRectBottom)
    
        b.select('text')
        .transition(t)
        .call(updateTextBottom)

    }
    });
    
    
    var rect = bar.append('rect') 
    .attr('width', bottomX.bandwidth())
    .call(updateRectBottom);
    
    var text = bar.append('text')
        .attr('dx', bottomX.bandwidth()*0.5)
        .attr('dy', function(d) {return '2em';})
        .attr('text-anchor', 'middle')
        .style('fill', 'white')
        .text(function(d){return d.showText});

        var line = d3.line()
        .x(function(d) { return bottomX(d.order); })
        .y(function(d) { return yRight(d.rate); });
        
        svg6.append('path')
        .datum(dataset2)
        .attr('class', 'line')
        .style('fill', 'none')
        .style('stroke', '#c11b34')
        .attr("stroke-width", 3)
        .attr('transform', 'translate(' + [bottomX.bandwidth()*0.5, 0]+ ')')
        .attr('d', function(d) {
          return line(d);
        })

       
        var point = svg6.selectAll('circle') 
        .data(dataset2, function(d){return d.order})
        .enter().append('circle')
        .style('cursor', 'pointer')
        .attr('cx', function(d){return bottomX(d.order)})
        .attr('cy', function(d){return yRight(d.rate)})
        .attr('transform', 'translate(' + [bottomX.bandwidth()*0.5, 0]+ ')')
        .attr('r', 4);

        point.on('mouseenter', function(d) {
            var hover = point.filter(function(p) {return d.order === p.order}).classed('hover', true);
            var tooltip = svg6.selectAll('.tooltip')
            .data(hover.data())
         tooltip.enter().append('text')
            .attr('class', 'tooltip')
            .merge(tooltip)
            .attr('x', function(d){return bottomX(d.order)})
            .attr('dx', '.35em')
            .attr('y', function(d){return yRight(d.rate)})
            .style('fill', '#c11b34')
            .style('visibility', 'visible')
            .style('font-size', '20px')
            .attr('dx', x.bandwidth()*0.5)
            .attr('dy', function(d) {return '1em';})
            .attr('text-anchor', 'middle')
            .text(function(d){return d.rate})
            
          }).on('mouseleave', function() {
            var hover = point.filter(function() {
              return d3.select(this).classed('hover')
            }).classed('hover', false);
            svg6.selectAll('.tooltip')
            .style('visibility', 'hidden');
          })