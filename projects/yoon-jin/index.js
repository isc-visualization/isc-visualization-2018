selCountry = "Korea, Rep." // default
selYear = 2017;
index_list = ["glo", "eco", "edu", "hea", "pol"]
c = d3.scaleOrdinal().domain(index_list).range(d3.schemeCategory10); // color code
long_data = [];
d3.csv("country_linegraph2.csv", row).then(callback);

function row(d) {
    d.country = d.country;
    d.year = +d.year;
    d.glo = +d.glo;
    d.eco = +d.eco;
    d.edu = +d.edu;
    d.hea = +d.hea;
    d.pol = +d.pol;
    return d;
}

var t = d3.transition()
 .duration(800)
 .ease(d3.easeElastic);

function callback(wide_data){
    var w = 450, h = 200;
    var margin = { top: 10, right: 50, bottom: 20, left:30 };
    var innerW = w - margin.right - margin.left,
        innerH = h - margin.top - margin.bottom;
    
    // Convert data (Wide to Long)
    // var long_data = [];
    wide_data.forEach( function(row) {
      Object.keys(row).forEach( function(colname) {
        if(colname == "country" || colname == "year" || colname == "reg") {
          return
        }
        long_data.push({"country": row["country"], "year": row["year"], "index": colname, "value": row[colname]});
      });
    });

    // Nest data
    var nested = d3.nest()
        .key(function(d){ return d.country; }).sortKeys(d3.ascending)
        .key(function(d){ return d.index; })//.sortKeys(d3.ascending)
        .sortValues(function(a,b) {return a.year - b.year;}) 
        .entries(long_data);


    // Legends
    var index_list = d3.values(nested).map(function(d){ return d.values.map(function(v) { return v.key; }); })[0];

    var c = d3.scaleOrdinal().domain(index_list).range(d3.schemeCategory10); // color code
    var legends = d3.select('#line-chart').append('div')
    .attr('class', 'legends')
    for (var i = 0; i < index_list.length; i++) {
        legends.append('button')
            .style('width', '50px')
            .style('height', '30px')
            .style('margin', '5px')
            .style('border', 'none')
            // .attr('id', index_list[i])
            .style('background-color', function(d){return c(index_list[i])})
            .text(index_list[i].toUpperCase())
            .style('color', 'white');
    }
    

    // Filter data of a specific country
    // var selCountry = "Korea, Rep." // default
    // var selYear = 2017;
    
    var data = nested.filter(function(d) { return d.key === selCountry})
    data = data[0].values;
    // var years = d3.values(data).map(function(d) { return d.values.map(function(v) { return v.year; }); })[0];
    draw(data);    

    // Dropdown
    var country_list = nested.map(function(d){ return d.key})
    var select_c = d3.select('#select_country').append('select')
        .attr('id', 'country_list');
        for (var i = 0; i < country_list.length; i++) {
            var option = select_c.append('option')
            .attr('value', country_list[i])
            .attr('label', country_list[i]);
            if (country_list[i] == selCountry) {
                option.attr('selected', 'selected');
            }
        }
    var year_list = d3.range(2006, 2018)
    var select_y = d3.select('#select_year').append('select')
    .attr('id', 'year_list');
    for (var i = 0; i < year_list.length; i++) {
        var option = select_y.append('option')
        .attr('value', year_list[i])
        .attr('label', year_list[i]);
        if (year_list[i] == selYear) {
            option.attr('selected', 'selected');
        }
    }
        
    // if changed
    document.getElementById("country_list").addEventListener('change', function() {
        selCountry = this.options[this.selectedIndex].value;
        data = nested.filter(function(d) { return d.key === selCountry})
        data = data[0].values;
        d3.select('svg').remove()
        draw(data);
    })
    document.getElementById("year_list").addEventListener('change', function() {
        selYear = this.options[this.selectedIndex].value;
        selYear = +selYear
    })


    function draw(data) {
        var svg = d3.select('#line-chart').append('svg')
            .attr('width', w)
            .attr('height', h)
            .append('g')
            .attr('transform', 'translate('+[margin.left, margin.top] + ')');

        var years = d3.values(data).map(function(d) { return d.values.map(function(v) { return v.year; }); })[0];
        var x = d3.scalePoint().domain(years).range([0, innerW]);
        var y = d3.scaleLinear().domain([0, 1]).range([innerH, 0]);

        var xAxis = d3.axisBottom(x).tickSize(5);
        var yAxis = d3.axisLeft(y).tickSize(3).ticks(5);

        var line = d3.line()
            .x(function(d){return x(d.year);}) 
            .y(function(d){return y(d.value);});
        
        var series = svg.selectAll('.series')
            .data(data, function(d){return d.values.key})
            .enter().append('g')
            .style('stroke', function(d){return c(d.key)})
            .style('fill', function(d){return c(d.key)}) 
            .attr('class', 'series')
        series.append('path')
            .datum(function(d){return d.values}) 
            .style('fill', 'none')
            .style('stroke-width', '1.5px')
            .attr('d', line) ;
        svg.append('g')
            .attr('class', 'x axis')
            .call(xAxis)
            .attr('transform', 'translate(' + [0, innerH]+ ')');
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .attr('transform', 'translate(' + [0, 0]+ ')');
 
        // point
        var point = series.selectAll('.tooltip-per-x')
            .data(function(d){ return d.values })
            .enter()
            .append('g')
            .attr('class', 'tooltip-per-x');
        point.append('circle')
            .style('cursor', 'pointer')
            .attr('cx', function(d){ return x(d.year)})
            .attr('cy', function(d){ return y(d.value)})
            .attr('r', 1.5)
    
        // mouseenter point
        point.on('mouseenter', function(d) {
            var tooltip = series.selectAll('.tooltip')
                .data(function(p) {
                    return p.values.filter(function(v) {
                        return v.year === d.year;
                    })
                })
            tooltip.enter().append('text')
                .attr('class', 'tooltip')
                .merge(tooltip)
                .attr('x', function(d) { return x(d.year); })
                .attr('y', function(d) { return y(d.value); })
                .attr('dx', '.35em')
                .attr('dy', '-.35em')
                .style('visibility', 'visible')
                .style('font-size', '0.7em')
                .style('stroke', 'none') 
                .text(function(d) {
                    return d.value
                })
        }).on('mouseleave', function(d) {
            var tooltip = series.selectAll('.tooltip')
                .style('visibility', 'hidden')
        // }).on('click', function(d){
        //     selYear = d.year;
        //     console.log(selYear)
        //     return document.querySelector('#year_list [value="' + selYear + '"]').selected = true;
        //     // select_y[selYear].attr('selected', 'selected')
        });
        

    }

}







// BEESWARM CHART

d3.csv("country_linegraph2.csv", row).then(callback2);
var formatNumber = d3.format(",");

function callback2(data){
    var w = 200, h = 500;
    var margin = { top: 30, right: 30, bottom: 10, left:30 };
    var padding = [0, 40, 34, 40];
    var innerW = w - margin.right - margin.left,
        innerH = h - margin.top - margin.bottom;



    var yScale = d3.scaleLinear([0, 1]).range([innerH, margin.top]);
    var colorScale = d3.scaleLinear([0, 1]).range([0.2,1]);

    var yAxis = d3.axisLeft(yScale)
    // .ticks(10, ".0s")
    .tickSize(3);

    var tt = d3.select("#beeswarm").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);



    var svg0 = d3.select("#beeswarm")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    svg0.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + [margin.left, 0] + ")")
        .call(yAxis);


    var svg1 = d3.select("#beeswarm")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    svg1.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + [margin.left, 0] + ")")
        .call(yAxis);

    
    var svg2 = d3.select("#beeswarm")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    svg2.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + [margin.left, 0] + ")")
        .call(yAxis);
        

    var svg3 = d3.select("#beeswarm")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    svg3.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + [margin.left, 0] + ")")
        .call(yAxis);


    var svg4 = d3.select("#beeswarm")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    svg4.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + [margin.left, 0] + ")")
        .call(yAxis);





    new_data = data.filter(function(d) { return d.year === selYear})
    redraw0(new_data);
    redraw1(new_data);
    redraw2(new_data);
    redraw3(new_data);
    redraw4(new_data);

    document.getElementById("year_list").addEventListener('change', function() {
        new_data = data.filter(function(d) { return d.year === selYear})
        redraw0(new_data);
        redraw1(new_data);
        redraw2(new_data);
        redraw3(new_data);
        redraw4(new_data);
    })

    function redraw0(data){
        console.log(data)
        var simulation = d3.forceSimulation(data)
                .force("y", d3.forceY(function(d) { return yScale(d.glo) }).strength(2))
                .force("x", d3.forceX((innerW)-padding[2]/2))
                .force("collide", d3.forceCollide(5))
                .stop();
    
            for (var a = 0; a < data.length; ++a) simulation.tick();
    
                var countriesCircles = svg0.selectAll(".countries")
                    .data(data, function(d) { return d.country})
    
                countriesCircles.exit()
                    .transition()
                    .remove();
    
                countriesCircles.enter()
                    .append("circle")
                    .attr("class", "countries")
                    .attr("cx", w / 2)
                    .attr("cy", h/2)
                    .attr("r", 3)
                    .attr("fill", function(d){ return c("glo")})
                    .attr('opacity', function(d){ return colorScale(d.glo)})
                    .merge(countriesCircles)
                    .transition()
                    .duration(720)
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
                    .style('cursor', 'pointer');
    
    
                d3.selectAll(".countries").on("mousemove", function(d) {
                    tt.html("Country: " + d.country + "<br>"
                    + "Year: " + d.year + "<br>" + "Index: " + d.glo)
                        .style('top', d3.event.pageY - 12 + 'px')
                        .style('left', d3.event.pageX + 25 + 'px')
                        .style("opacity", 0.9)
                }).on("mouseout", function(d) {
                    tt.style("opacity", 0);
                });
        //end of redraw
        }
    
    function redraw1(data){
    var simulation = d3.forceSimulation(data)
            .force("y", d3.forceY(function(d) { return yScale(d.eco) }).strength(2))
            .force("x", d3.forceX((innerW)-padding[2]/2))
            .force("collide", d3.forceCollide(4))
            .stop();

        for (var a = 0; a < data.length; ++a) simulation.tick();

            var countriesCircles = svg1.selectAll(".countries")
                .data(data, function(d) { return d.country})

            countriesCircles.exit()
                .transition()
                .remove();

            countriesCircles.enter()
                .append("circle")
                .attr("class", "countries")
                .attr("cx", w / 2)
                .attr("cy", h/2)
                .attr("r", 3)
                .attr("fill", function(d){ return c("eco")})
                .attr('opacity', function(d){ return colorScale(d.eco)})
                .merge(countriesCircles)
                .transition()
                .duration(720)
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .style('cursor', 'pointer');


            d3.selectAll(".countries").on("mousemove", function(d) {
                tt.html("Country: " + d.country + "<br>"
                + "Year: " + d.year + "<br>" + "Index: " + d.eco)
                    .style('top', d3.event.pageY - 12 + 'px')
                    .style('left', d3.event.pageX + 25 + 'px')
                    .style("opacity", 0.9)
            }).on("mouseout", function(d) {
                tt.style("opacity", 0);
            });
    //end of redraw
    }

    function redraw2(data){
        var simulation = d3.forceSimulation(data)
                .force("y", d3.forceY(function(d) { return yScale(d.edu) }).strength(2))
                .force("x", d3.forceX((innerW)-padding[2]/2))
                .force("collide", d3.forceCollide(4))
                .stop();
    
            for (var a = 0; a < data.length; ++a) simulation.tick();
    
                var countriesCircles = svg2.selectAll(".countries")
                    .data(data, function(d) { return d.country})
    
                countriesCircles.exit()
                    .transition()
                    .remove();
    
                countriesCircles.enter()
                    .append("circle")
                    .attr("class", "countries")
                    .attr("cx", w / 2)
                    .attr("cy", h/2)
                    .attr("r", 3)
                    .attr("fill", function(d){ return c("edu")})
                    .attr('opacity', function(d){ return colorScale(d.edu)})
                    .merge(countriesCircles)
                    .transition()
                    .duration(720)
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
                    .style('cursor', 'pointer');
    
    
                d3.selectAll(".countries").on("mousemove", function(d) {
                    tt.html("Country: " + d.country + "<br>"
                    + "Year: " + d.year + "<br>" + "Index: " + d.edu)
                        .style('top', d3.event.pageY - 12 + 'px')
                        .style('left', d3.event.pageX + 25 + 'px')
                        .style("opacity", 0.9)
                }).on("mouseout", function(d) {
                    tt.style("opacity", 0);
                });
        //end of redraw
        }

    function redraw3(data){
        var simulation = d3.forceSimulation(data)
                .force("y", d3.forceY(function(d) { return yScale(d.hea) }).strength(2))
                .force("x", d3.forceX((innerW)-padding[2]/2))
                .force("collide", d3.forceCollide(4))
                .stop();
    
            for (var a = 0; a < data.length; ++a) simulation.tick();
    
                var countriesCircles = svg4.selectAll(".countries")
                    .data(data, function(d) { return d.country})
    
                countriesCircles.exit()
                    .transition()
                    .remove();
    
                countriesCircles.enter()
                    .append("circle")
                    .attr("class", "countries")
                    .attr("cx", w / 2)
                    .attr("cy", h/2)
                    .attr("r", 3)
                    .attr("fill", function(d){ return c("hea")})
                    .attr('opacity', function(d){ return colorScale(d.hea)})
                    .merge(countriesCircles)
                    .transition()
                    .duration(720)
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
                    .style('cursor', 'pointer');
    
    
                d3.selectAll(".countries").on("mousemove", function(d) {
                    tt.html("Country: " + d.country + "<br>"
                    + "Year: " + d.year + "<br>" + "Index: " + d.hea)
                        .style('top', d3.event.pageY - 12 + 'px')
                        .style('left', d3.event.pageX + 25 + 'px')
                        .style("opacity", 0.9)
                }).on("mouseout", function(d) {
                    tt.style("opacity", 0);
                });
        //end of redraw
        }

    function redraw4(data){
        var simulation = d3.forceSimulation(data)
                .force("y", d3.forceY(function(d) { return yScale(d.pol) }).strength(2))
                .force("x", d3.forceX((innerW)-padding[2]/2))
                .force("collide", d3.forceCollide(4))
                .stop();
    
            for (var a = 0; a < data.length; ++a) simulation.tick();
    
                var countriesCircles = svg3.selectAll(".countries")
                    .data(data, function(d) { return d.country})
    
                countriesCircles.exit()
                    .transition()
                    .remove();
    
                countriesCircles.enter()
                    .append("circle")
                    .attr("class", "countries")
                    .attr("cx", w / 2)
                    .attr("cy", h/2)
                    .attr("r", 3)
                    .attr("fill", function(d){ return c("pol")})
                    .attr('opacity', function(d){ return colorScale(d.pol)})
                    .merge(countriesCircles)
                    .transition()
                    .duration(720)
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
                    .style('cursor', 'pointer');
    
    
                d3.selectAll(".countries").on("mousemove", function(d) {
                    tt.html("Country: " + d.country + "<br>"
                    + "Year: " + d.year + "<br>" + "Index: " + d.pol)
                        .style('top', d3.event.pageY - 12 + 'px')
                        .style('left', d3.event.pageX + 25 + 'px')
                        .style("opacity", 0.9)
                }).on("mouseout", function(d) {
                    tt.style("opacity", 0);
                });
        //end of redraw
        }

}
