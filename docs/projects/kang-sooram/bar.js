var data = [
    {
      "Index": "Total",
      "values": [
        {"value": 0.65, "country": "Korea, Rep."},
        {"value": 0.878, "country": "Iceland"},
        {"value": 0.516, "country": "Yemen"},
        {"value": 0.697, "country": "Avg"}
      ]
    },
    {
      "Index": "Economic participation and opportunity",
      "values": [
        {"value": 0.533, "country": "Korea, Rep."},
        {"value": 0.798, "country": "Iceland"},
        {"value": 0.345, "country": "Yemen"},
        {"value": 0.653, "country": "Avg"}
      ]
    },
    {
      "Index": "Educational attainment",
      "values": [
        {"value": 0.96, "country": "Korea, Rep."},
        {"value": 0.995, "country": "Iceland"},
        {"value": 0.737, "country": "Yemen"},
        {"value": 0.959, "country": "Avg"}
      ]
    },
    {
      "Index": "Health and survival",
      "values": [
        {"value": 0.973, "country": "Korea, Rep."},
        {"value": 0.969, "country": "Iceland"},
        {"value": 0.968, "country": "Yemen"},
        {"value": 0.973, "country": "Avg"}
      ]
    },
    {
      "Index": "Political empowerment",
      "values": [
        {"value": 0.134, "country": "Korea, Rep."},
        {"value": 0.75, "country": "Iceland"},
        {"value": 0.014, "country": "Yemen"},
        {"value": 0.203, "country": "Avg"}
      ]
    }
]

var categoriesNames = ['Total', 'Economic participation and opportunity', 'Educational attainment', 'Health and survival', 'Political empowerment'];
var korea = [];
data.forEach(function(d) {
    korea.push(d.values.filter(function(v) {
        return v.country == 'Korea, Rep.'
    })[0].value);
})
console.log(korea);
draw(korea);

d3.select('#koreaName').on('click', function() {
    d3.select('#koreaIndex').select('svg').remove();
    draw(korea);
})

function draw(singleData) {
    //Basic setting
    var w = 600, h = 250;
    var margin = {top:20, right:120, bottom: 50, left: 30};
    var innerW = w - margin.right - margin.left,
        innerH = h - margin.top - margin.bottom;

    var divTooltip = d3.select("#koreaIndex").append("div").attr("class", "toolTip");
    var t = d3.transition()
                .duration(800)
                .ease(d3.easeElastic);
    var svg = d3.select('#koreaIndex').append('svg')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

    //Set x and y scales
    var x = d3.scaleBand() 
        .domain(categoriesNames) 
        .range([0, innerW]);
    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([innerH, 0]);
    x.padding(0.2);

    //Draw bars
    svg.selectAll('.full')
        .data(singleData).enter()
        .append('rect')
        .attr('class', 'full')
        .attr('x', function(d, i) {
            return x(categoriesNames[i])+x.bandwidth()/2-10; 
        })
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', innerH)
        .attr('opacity', 0.1);

    var bar = svg.selectAll('rect.barKor')
        .data(singleData)
        .enter().append('rect')
        .attr('class', 'barKor')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', innerH);
    bar.attr('x', function(d, i) {
            return x(categoriesNames[i])+x.bandwidth()/2-10; 
        })
        .attr('y', function(d) {
            return y(d);
        })
        .attr('height', function(d){return innerH - y(d);})
        .attr('fill', 'steelblue')
        .attr('opacity', 0.5);
    
    svg.selectAll('.label').data(singleData).enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', function(d, i) {
            return x(categoriesNames[i])+x.bandwidth()/2-15; 
        })
        .attr('y', function(d) {
            return y(d)-3;
        })
        .text(function(d) {console.log('hello' + d); return d});

    //Draw axis
    var xAxis = d3.axisBottom(x) 
        .tickSize(0) 
        .tickPadding(6); 
    var yAxis = d3.axisLeft(y)  
        .ticks(5)
        .tickSizeOuter(0)
    svg.append('g') 
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + [0, innerH] + ')') 
        .call(xAxis)
        .selectAll("text")
        .call(wrap, x.bandwidth());
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    bar.on("mousemove", function(d){
            // divTooltip.style("left", d3.event.pageX+10+"px");
            // divTooltip.style("top", d3.event.pageY-25+"px");
            // divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY
            var elements = document.querySelectorAll(':hover');
            l = elements.length
            l = l-1
            elementData = elements[l].__data__;
            var activeBar = window.activeBar = elements[l];
            // divTooltip.html(d);
            d3.select(activeBar).style('opacity', 1);
        });
    bar.on("mouseout", function(d){
            // divTooltip.style("display", "none");
            d3.select(window.activeBar).style('opacity',0.5);
            window.activeBar = {};
        });


    d3.select('#avg').on('click', function(d) {
        drawGroup(data);
    });

//////////////////////////////////////////////////////////////////////////////////
function drawGroup(data) {
    var countryNames = data[0].values.map(function(d)  { return d.country; });
    
    //Set scales
    var x0 = d3.scaleBand()
        .domain(categoriesNames)
        .range([0, innerW])
        .paddingInner(0.2);
    
    var x1 = d3.scaleBand()
        .domain(countryNames)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.1);
    
    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([innerH, 0]);
    
    var c = d3.scaleOrdinal()
        .domain(countryNames)
        .range(d3.schemeCategory10);
    
    svg.select('.x.axis').remove();
    svg.append('g') 
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + [0, innerH] + ')') 
        .call(xAxis)
    .selectAll("text")
        .call(wrap, x0.bandwidth());
    
    var region = svg.selectAll('.region')
        .data(data, function(d){return d.Index})
        .enter().append('g')
            .attr('class', 'region')
            .attr('transform', function(d){return 'translate(' + [x0(d.Index), 0] + ')';})
    
    svg.selectAll('.barKor')
        .transition(t)
        .attr('transform', function(d){return 'translate(' + [-15, 0] + ')';})
        .remove();
    svg.selectAll('.full')
        .transition(t)
        .attr('transform', function(d){return 'translate(' + [-15, 0] + ')';})
        .remove();
    svg.selectAll('.label')
        .transition(t)
        .attr('transform', function(d){return 'translate(' + [-15, 0] + ')';})
        .remove();
        
    //Draw bars
    var bar = region.selectAll('.bar')
        .data(function(d){return d.values}, function(d){return d.country})
            .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d){return x1(d.country);})
        .attr('y', function(d) {return y(d.value)})
        .attr('height', function(d){return innerH - y(d.value)})
        .attr('width', x1.bandwidth())
        .attr('fill', function(d){return c(d.country)})
        .attr('opacity', 0.5);
    
    bar.on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY
            var elements = document.querySelectorAll(':hover');
            l = elements.length
            l = l-1
            elementData = elements[l].__data__;
            var activeBar = window.activeBar = elements[l];
            divTooltip.html((d.country)+"<br>"+d.value);
            d3.select(activeBar).style('opacity', 1);
        });
    bar.on("mouseout", function(d){
            divTooltip.style("display", "none");
            d3.select(window.activeBar).style('opacity',0.5);
            window.activeBar = {};
        });
    
    //Legend
    svg.selectAll('.legend-g').remove();
    var chipHeight = 12; 
    var chipPadding = 2; 
    var legendHeight = 16;
    var legendPadding = 4;
    var legend = svg.append('g')
        .attr('class', 'legend-g')
        .attr('transform', 'translate(' + [innerW + 50, legendHeight]  +  ')')
        .selectAll('.legend')
        .data(c.domain()) 
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function(d,i){
            return 'translate(' + [0, i *(legendHeight + legendPadding)]+ ')'
        });
    
    legend.append('rect')
        .attr('y', chipPadding)
        .attr('width', chipHeight).attr('height', chipHeight)
        .style('fill', function(d){return c(d)})
        .style('opacity', 0.5);
    
    legend.append('text')
        .attr('x', chipPadding + chipHeight)
        .attr('y', chipPadding)
        .attr('dy', '.71em')
        .style('font-size', 10+ 'px')
        .text(function(d){return d});
}

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
        }
    });
}
}