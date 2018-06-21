d3.csv("GWG2016.csv", function(error, data) {
    if (error) throw error;
    console.log(data);
    //var parseDate = d3.time.format("%Y").parse;

    /* #1. Horizontal Histogram, 2016 Only
    */
    var margin = {top: 20, right: 30, bottom: 30, left: 90 },
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // set ranges
    var y = d3.scaleBand()
                .range([height, 0])
                .padding(0.2);

    var x = d3.scaleLinear()
                .range([0, width]);

    var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate("+ margin.left + "," + margin.top +")");
    
    // format data
    data.forEach(function(d) {
        // d.Country;
        // d.Time;
        //if (d.Time === 2016) {d.GWG = +d.GWG;} 
        d.GWG = +d.GWG;
    });

    // sort data 
    // ** 이거 on-click event로 할 수 있으면 좋겠당. 
    data.sort(function(a,b) {return a.GWG - b.GWG;});

    // scale the range of the data in the domain
    x.domain([0, d3.max(data, function(d) {return d.GWG;})]);
    y.domain(data.map(function(d) {return d.Country;}));

    // append rectangles for the bar chart
    svg.selectAll(".bar_vertical")
            .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("width", function(d) { return x(d.GWG);})
            .attr("y", function(d) { return y(d.Country);})
            .attr("height", y.bandwidth());

    // add x Axis
    svg.append("g")
        .attr("transform", "translate(0,"+height+")")
        .call(d3.axisBottom(x));

    // add y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // add text
    bar.append()
});