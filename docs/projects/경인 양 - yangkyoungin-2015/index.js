var w = 700, h = 300;
  var margin = {top:10, right:40, bottom: 20, left: 20};
  var innerW = w - margin.right - margin.left,
    innerH = h - margin.top - margin.bottom;
  var brush = d3.brush();
  var scales = d3.local();
  var yscale = d3.local();
  var brushCell;

  var chipRadius = 5;
  var legendHeight = 20;
  var legendPadding = 4;
  


d3.csv('2017data.csv',row).then(callback);

function row(d){
    d.GLOBAL_INDEX = +d.GLOBAL_INDEX;
    d.ECONOMIC = +d.ECONOMIC;
    d.EDUCATIONAL = +d.EDUCATIONAL;
    d.HEALTH = +d.HEALTH;
    d.POLITIC = +d.POLITIC;
    d.Rank = +d.Rank;
    return d;
}

function callback(data){
    
    var x = d3.scaleLinear().domain([0,1])
        .range([0,innerW])
    var y = d3.scaleLinear().domain([0,1])
        .range([innerH,0])

    var xAxis = d3.axisBottom(x)
        .tickSize(0);
    var yAxis = d3.axisLeft(y)
        .tickSize(0);
    var E_mean = d3.mean(data, function(d){return d.ECONOMIC} )
    var P_mean= d3.mean(data, function(d){return d.POLITIC})
    
    var svg1 = d3.select('#histogram').append('svg')
        .attr('width', w)
        .attr('height', h*4)
        .append('g')
        .attr('transform', 'translate('+ [margin.left, margin.top] + ')');
    var headers = data.columns.slice(2,6);
    var position = d3.scaleBand().domain(headers).range([0,h*4])
    
    headers = headers.map(function(h){
        var value = data.map(function(d){
            return  d[h]
        })
        return {key: h, values: value};
    });
    console.log(headers)
    
    var bins = d3.histogram()
        .domain([0,1])
        .thresholds(x.ticks(30))

    var region = svg1.selectAll('.region')
        .data(headers, function(d){return d.key})
        .enter().append('g')
            .attr('class', 'region')
            .attr('transform', function(d){return 'translate(' + [margin.left, margin.top + position(d.key)] + ')';});
  /*  var bins = d3.histogram()
                .domain([0,1])
                .thresholds(x.ticks(30))
        bins = bins(headers[1].values)
        console.log(bins)
    var y = d3.scaleLinear().domain([0, d3.max(bins, d => d.length)])
        .range([innerH,0])
        yscale.set(this, y)*/
       region
        .each(function(d){
            var bins = d3.histogram()
                .domain([0,1])
                .thresholds(x.ticks(30))
            bins = bins(d.values)

            var y = d3.scaleLinear().domain([0, d3.max(bins, d => d.length)])
             .range([innerH,0])
            yscale.set(this, y)
        })
        
    region.each(function(d){
        d3.select(this).selectAll('.bar')
            .data(bins)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', function(d){ return x(d.x0)+1})
            .attr('y', function(d){ return yscale.get(this)(d.length)})
            .attr('width', function(d){ return Math.max(0, x(d.x1)-x(d.x0)-1)})
            .attr('height', function(d){           
                return yscale.get(this)(0)- yscale.get(this)(d.length)})
    })
    /*
    region.selectAll('.bar')
        .data(bins)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d){ return x(d.x0)+1})
        .attr('y', function(d){ 
            var y = yscale.get(this);
            return y(d.length)})
        .attr('width', function(d){ return Math.max(0, x(d.x1)-x(d.x0)-1)})
        .attr('height', function(d){ 
            var y = yscale.get(this);
            return y(0)- y(d.length)}) */
    region.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate('+ [0, innerH]+ ')')
        .call(xAxis)
    region.append('g')
        .attr('class', 'y axis')
        .each(function(){
            var y = yscale.get(this);
            d3.select(this).call(yAxis.scale(y))
        })



//////////////////////////////////////////////////////        
/////////////////////첫번째 끝/////////////////////////

///////////////////여기서부터 두번째///////////////////
/////////////////////////////////////////////////////



    brush = brush.extent([[0,0], [innerW, innerH]])
        .on('start', brushStarted)
        .on('brush', brushed)
        .on('end', brushEnded)
     
    var svg2 = d3.select('#scatter').append('svg')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', 'translate('+ [margin.left, margin.top] + ')');
    
    svg2.selectAll('.point')
        .data(data)
        .enter().append('circle')
        .attr('cx', function(d){return x(d.ECONOMIC)})
        .attr('cy', function(d){return y(d.POLITIC)})
        .attr('r', 3)
        .attr('class', function(d){
            if(d.OECD === 'Y'){
                return 'oecd'
            }
        })
        .each(function(d){
            var values = { country: d.Country, region: d.Region, form: d.Constitutional_form,
                head: d.Head_of_State}
            scales.set(this, {x:x(d.ECONOMIC), y:y(d.POLITIC), values: values})
        })
    svg2.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate('+ [0, innerH]+ ')')
        .call(xAxis);
    svg2.append('g')
        .attr('class', 'y axis')
        .call(yAxis.scale(y));
    svg2.append('line')
        .attr('x1', x(E_mean))
        .attr('y1', 0)
        .attr('x2', x(E_mean))
        .attr('y2', innerH)
        .style('stroke', 'red');
    svg2.append('line')
        .attr('x1', 0)
        .attr('y1', y(P_mean))
        .attr('x2', innerW)
        .attr('y2', y(P_mean))
        .style('stroke', 'red')
    svg2.append('g')
        .attr('class', 'brush')
        .call(brush);
    
     var c =   d3.scaleOrdinal()
        .domain(['OECD', 'not'])
        .range(['gold', 'steelblue']);
     var legend = svg2.append('g')
        .attr('class', 'legend-g')
        .attr('transform', 'translate(' + [innerW - 30, legendHeight]  +  ')')
        .selectAll('.legend')
        .data(c.domain())
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function(d,i){
            return 'translate(' + [-innerW*0.9, i *(legendHeight + legendPadding)]+ ')'
        })
        legend.append('circle')
        .attr('r', chipRadius)
        .style('fill', function(d){return c(d)});
    legend.append('text')
        .attr('x', chipRadius*2)
        .attr('y', chipRadius)
        .style('font-size', '15px')
        .text(function(d){return d})        




function brushStarted(d){
    if(brushCell !== this){
        d3.select(brushCell).call(brush.move, null)
        brushCell = this;
    }
}
function brushed(d){         
    if(d3.event.selection === null) return;
    else{
    var epoint = d.x, ppoint = d.y;
    var scale = scales.get(this)
    var domain = d3.event.selection.map(function(d){
        return [scale.x(d[0]), scale.y(d[1])];
    });
    svg.selectAll('.point').classed('selected', function(d,i){
        return d[xName] < domain[0][0] || d[xName] > domain[1][0] || d[yName] > domain[0][1] || d[yName] < domain[1][1]
        console.log(d.x)
    })
    } 

}
function brushEnded(d){
    if(d3.event.selection === null){
        svg2.selectAll('.point').classed('hidden', false)
    }
}        



}