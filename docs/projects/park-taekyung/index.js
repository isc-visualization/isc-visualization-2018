/* #1. Horizontal Histogram, 2016 Only
    Genger Wage Gap, OECD Nations
        1. click --> sort
*/
d3.csv("GWG2016.csv", function(error, data) {
    if (error) throw error;
    console.log(data);

    // dimensions and margins
    var margin = {top: 70, right: 30, bottom: 30, left: 90 },
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // set the ranges
    var y = d3.scaleBand()
                .range([height, 0])
                .padding(0.2);

    var x = d3.scaleLinear()
                .range([0, width]);

    //var svg = d3.select("body").append("svg")
    var svg = d3.select("#bar_chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate("+ margin.left + "," + margin.top +")");

    // format data
    data.forEach(function(d){
        d.gwg = +d.gwg;
    });

    // sort data 
    // // ** 이거 on-click event로 할 수 있으면 좋겠당. 
    data.sort(function(a,b) {return a.gwg - b.gwg;});


    // scale domain
    x.domain([0, d3.max(data, function(d) {return d.gwg;})]);
    y.domain(data.map(function(d) {return d.country;}));

    // append rectangles for the bar chart
    svg.selectAll(".bar")
            .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("width", function(d) { return x(d.gwg);}) // 이게 메인.
            .attr("y", function(d) { return y(d.country);})
            .attr("height", y.bandwidth())
            // .attr("fill", function(d){return "rgb(0,0 "+(d.gwg*10)+")"});
    
    // // transition
    // var transit = d3.select("svg").selectAll("rect")
    //         .data(data.GWG)
    //         .transition()
    //         .duration(1000)
    //         .attr("width", function(d){return x(d.GWG);});
    
    // add x Axis
    svg.append("g")
        .attr("transform", "translate(0,"+height+")")
        .call(d3.axisBottom(x));

    // add y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // chart title 
    let title = svg.append("g")
                .attr("class", "title");
    title.append("text")
            .attr("x", (width/2))
            .attr("y", 0 - (margin.top/2))
            .attr("text-anchor", "middle")
            .style("font", "20px sans-serif")
            .text("Gender Wage Gap of OECD Nations, Recent");
});

// /* # 2.MultiSeries Line Graph
//     남녀고용률 변화. 
// */
// d3.csv("GWG_All.csv", function(error, data) {
//     if(error) throw error;
//     console.log(data);

//     // margins
//     var margin = {top:20, right:80, bottom:30, left:50},
//         width = 960 - margin.left - margin.right,
//         height = 600 - margin.top - margin.bottom;

//     var svg = d3.select("#multi_series_line")
//                 .append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom)
//             .append("g")
//                 .attr("transform", "translate("+ margin.left+","+margin.top+")");

//     // format data
//     var x = d3.scaleOrdinal().range([])           
// })

/* 2. 여러개 산포도 그려보고 경향상 파악하기 
    1. 코홀트별 취업률 변화 (연령) 
    2. 
*/
d3.csv("GENDER_EMP.csv", function(error, data){
    if (error) throw error;
    console.log(data);

    // svg
    var svg = d3.select("#multi_series_line")
});
