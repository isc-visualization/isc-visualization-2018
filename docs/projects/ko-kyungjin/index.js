var w = 800;
var margin = {top:20, right:20, bottom:20, left:20}
var innerW = w - margin.left - margin.right;
var brush = d3.brush();
var scales = d3.local();

var xAxis = d3.axisBottom().ticks(6);
var yAxis = d3.axisLeft().ticks(6);

var region_GGI = d3.scaleBand().range([0, innerW]).padding(.2)
var region_GPI = d3.scaleBand().range([0, innerW]).padding(.2)


var c = d3.scaleOrdinal().range(d3.schemeCategory10);

var svg = d3.select('body').append('svg')
      .attr('width', w)
      .attr('height', w)
    .append('g')
      .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

var svg0w = 500;
var svg1w = 500 - margin.top - margin.bottom;

var svg0 = d3.select('body').append('svg')
.attr('width', svg1w)
.attr('height',svg1w)

var svg1 = svg0.append('g')
    .attr('transform', 'translate(' + [margin.left, margin.right] + ')');

d3.csv('./integrated dataset.csv', row).then(bar_chart);

function bar_chart(data){
    
    var forDrawGGI = d3.scaleLinear()
    .domain(d3.extent(data, function(d){return d.GGI}))
    .range([svg1w, 0]);

    var forDrawGPI = d3.scaleLinear()
        .domain(d3.extent(data, function(d){return d.GPI}))
        .range([0, svg1w]);

    var bar = d3.scaleBand()
        .domain(['A', 'B', 'C', 'D'])
        .range([0, svg1w]);

    var bar_width = bar.bandwidth()/2;

    svg1.append('rect')
        .attr('class', 'A')
        .attr('x', bar('A'))
        .attr('width', bar_width)
        .style('fill', 'blue');

    svg1.append('text')
        .attr('class', 'aa')
        .attr('x', bar('A')+7);

    svg1.append('rect')
        .attr('x', bar('B'))
        .attr('y', forDrawGGI(0.695))
        .attr('width', bar_width)
        .attr('height', svg1w - forDrawGGI(0.695))
        .style('fill', 'blue');

    svg1.append('text')
        .attr('x', bar('B')+7)
        .attr('y', forDrawGGI(0.695))
        .text('0.695')

    svg1.append('rect')
        .attr('class', 'C')
        .attr('x', bar('C'))
        .attr('width', bar_width)
        .style('fill', 'green');

    svg1.append('text')
        .attr('x', bar('C')+7)
        .attr('class', 'cc');

    svg1.append('rect')
        .attr('x', bar('D'))
        .attr('y', forDrawGPI(2.018))
        .attr('width', bar_width)
        .attr('height', svg1w - forDrawGPI(2.018))
        .style('fill', 'green');

    svg1.append('text')
        .attr('x', bar('D')+7)
        .attr('y', forDrawGPI(2.018))
        .text('2.018')

}


    
d3.csv('./integrated dataset.csv', row).then(callback);

function row(d){
    for(var k in d){
        if(d.hasOwnProperty(k) && k !== 'Country' && k!=='Region') d[k] = +d[k];
    }
    return d;
}

function callback(data){
    var headers = data.columns.slice(2);
    var headers_GGI = data.columns.slice(2, 7)
    var headers_GPI = data.columns.slice(7)
    headers_GGI = headers_GGI.map(function(h){
        var domain = d3.extent(data, function(d){return d[h];});
        return {name:h, domain:domain}
    });

    headers_GPI = headers_GPI.map(function(h){
        var domain = d3.extent(data, function(d){return d[h];});
        return {name:h, domain:domain}
    });

    region_GGI.domain(headers_GGI.map(function(d){return d.name;}));
    region_GPI.domain(headers_GPI.map(function(d){return d.name;}))
    c.domain(d3.set(data, function(d){return d.Region;}).values());

    function cross(headers_GGI, headers_GPI){
        var result = [];
        headers_GGI.forEach(function(a){
            headers_GPI.forEach(function(b){
                result.push({x:a, y:b});
            });
        });
        return result;
    }


    var cell = svg.selectAll('.cell')
        .data(cross(headers_GGI, headers_GPI))
    .enter().append('g')
        .attr('class', 'cell')
        .attr('transform', function(d){
            return 'translate(' + [region_GGI(d.x.name), innerW - region_GPI(d.y.name) - region_GPI.bandwidth()] + ')'
        })
        .each(function(d){
            var x = d3.scaleLinear().domain(d.x.domain).range([0, region_GGI.bandwidth()]);
            var y = d3.scaleLinear().domain(d.y.domain).range([region_GPI.bandwidth(), 0]);
            scales.set(this, {x:x, y:y});
        })

    cell.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + [0, region_GGI.bandwidth()] + ')')
        .each(function(d){
            var x = scales.get(this).x;
            d3.select(this).call(xAxis.scale(x));
        })

    cell.append('g')
        .attr('class', 'y axis')
        .each(function(d){
            var y = scales.get(this).y;
            d3.select(this).call(yAxis.scale(y));
        })

    cell.each(function(d){
        d3.select(this).selectAll('.point')
          .data(data)
        .enter().append('circle')
          .attr('class', 'point')
          .attr('cx', function(p){return region_GGI.bandwidth() - scales.get(this).x(p[d.x.name]);})
          .attr('cy', function(p){return scales.get(this).y(p[d.y.name]);})
          .attr('r', 2)
          .style('fill', function(p){return c(p.Region);});
    })


    var points = cell.selectAll('.point');
    points.on('mouseenter', function(d){
        points.classed('hover', true);
        var hover = points.filter(function(p){return d.Country==p.Country})
            .classed('hover', false)
            .attr('r', 3);
        cell.each(function(d){
            var tooltip = d3.select(this).selectAll('.tooltip').data(hover.data());
            tooltip.enter().append('text')
                .attr('class', 'tooltip')
                .merge(tooltip)
                .attr('x', function(p){return region_GGI.bandwidth() - scales.get(this).x(p[d.x.name]);})
                .attr('dx', '.35em')
                .attr('y', function(p){return scales.get(this).y(p[d.y.name])})
                .style('fill', function(p){return c(p.Region)})
                .style('visibility', 'visible')
                .text(function(p){return p.Country})
        })
    }).on('mouseleave', function(d){
        points.classed('hover', false)
        var hover = points.filter(function(p){return d.Country==p.Country})
            .classed('hover', false)
            .attr('r', 2);
        cell.selectAll('.tooltip').style('visibility', 'hidden');
    })
}


var tabulate = function (data) {
    var columns = ['Country','Region','GGI','GPI'];
    var table = d3.select('body').append('table')
        var thead = table.append('thead')
        var tbody = table.append('tbody').attr('id', 'myTable');

        thead.append('tr')
        .selectAll('th')
            .data(columns)
            .enter()
        .append('th')
            .text(function (d) { return d })

        var rows = tbody.selectAll('tr')
            .data(data)
            .enter()
        .append('tr')

        var cells = rows.selectAll('td')
            .data(function(row) {
                return columns.map(function (column) {
                    return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value })

        console.log(data);

        var forBarGGI = d3.scaleOrdinal()
            .domain(data.map(function(d){return d.Country;}))
            .range(data.map(function(d){return d.GGI;}))

        var forBarGPI = d3.scaleOrdinal()
            .domain(data.map(function(d){return d.Country;}))
            .range(data.map(function(d){return d.GPI;}))

        var forDrawGGI = d3.scaleLinear()
            .domain(d3.extent(data, function(d){return d.GGI}))
            .range([svg1w, 0]);

        var forDrawGPI = d3.scaleLinear()
            .domain(d3.extent(data, function(d){return d.GPI}))
            .range([0, svg1w]);
    

        cells.on('click', function(d){
            var select = cells.filter(function(p){return d.value == p.value}).filter(function(p){return p.column == "Country"})

           

            svg1.select('.A')
                .transition()
                .attr('y', forDrawGGI(forBarGGI(select.text())))
                .attr('height', svg1w-forDrawGGI(forBarGGI(select.text())))

            svg1.select('.aa')
                .transition()
                .text(forBarGGI(select.text()))
                .attr('y', forDrawGGI(forBarGGI(select.text())));

            svg1.select('.C')
                .transition()
                .attr('y', forDrawGPI(forBarGPI(select.text())))
                .attr('height', svg1w-forDrawGPI(forBarGPI(select.text())))

            svg1.select('.cc')
                .transition()
                .text(forBarGPI(select.text()))
                .attr('y', forDrawGPI(forBarGPI(select.text())));
        })



    return table;
}
    
$(document).ready(function(){
    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

d3.csv('./integrated dataset.csv').then(tabulate);


