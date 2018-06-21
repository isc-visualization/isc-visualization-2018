// 데이터 정렬

// 바차트 만들기

//평균 구하는 함수
d3.json('FinalDataH.json').then(function(data){
    console.log("HEllo!");
    var w = 1200;
    var h = 400;
    var margin = {top: 30, right: 30, bottom:20, left:150};
    var svg = d3.select("div.container").append("svg")
                        .attr("width", w)
                        .attr("height", h)
                        .append('g')
                        .attr('transform', 'translate(' +[margin.left,margin.top]+')')
   
    var innerW = w - margin.right - margin.left;
    var innerH = h - margin.top - margin.bottom;
    console.log(11111);
    // console.log(data);   
    var entries = d3.nest()
                    .key(function(d){return d.country})
                    .key(function(d){return d.Year})
                    .entries(data);

    console.log(entries);
    //data for first image
    var oecdAverage = d3.nest()
                 .key( function(d){return d.Remarks})
                //  .key(function(d){return d.country})
                //  .key(function(d){return d.value.Year})
                //  .rollup(function(values){console.log(values); return values})
                //  .rollup(function(values){console.log(values); return values})
                 .rollup(function(value){return d3.sum(value, function(d){return d.Global_Index})/value.length})
                 .entries(data);
                 
    // var oecd = OECD1[1].values
    oecdAverage = oecdAverage[1]
    
    var EastAsia = d3.nest()
                    .key(function(d){return d.Region})
                    // .key(function(d){return d.country})
                    // .key(function(d){return d.value.Year})
                    .rollup(function(value){return d3.sum(value, function(d){return d.Global_Index})/value.length})
                    .entries(data);
    // console.log(EastAsia)
    var worldAverage = d3.nest()
                        .key(function(d){return d.Year})
                        .rollup(function(value){return d3.sum(value, function(d){return d.Global_Index})/value.length})
                        .entries(data);
    // console.log(worldAverage);


    //create range by GDP
    var gdpRange = d3.extent(data, function(d){return parseFloat(d.GDP)});
    // console.log(gdpRange);
    // console.log(oecdAverage);
    // global index and sub indexes
    
    var Indexes = d3.nest()
                    .key(function(d){return d.hasGdp})
                    .key(function(d){return d.country})
                    .rollup(function(value){
                        
                        return {
                            globalIndex: d3.sum(value, function(d){return d.Global_Index})/value.length,
                            ECONOMIC_PARTICIPATION_AND_OPPORTUNITY: d3.sum(value, function(d){return d.ECONOMIC_PARTICIPATION_AND_OPPORTUNITY})/value.length,
                            HEALTH_AND_SURVIVAL: d3.sum(value, function(d){return d.HEALTH_AND_SURVIVAL})/value.length,
                            EDUCATIONAL_ATTAINMENT: d3.sum(value, function(d){return d.EDUCATIONAL_ATTAINMENT})/value.length,
                            POLITICAL_EMPOWERMENT: d3.sum(value, function(d){return d.POLITICAL_EMPOWERMENT})/value.length,
                            GDP: d3.mean(value, function(d){return parseFloat(d.GDP)}),
                            DemocraticIndex: d3.mean(value, function(d){return d.Democratic_Index}),
                            Region: value[0].Region
                        }
                    })
                    .entries(data);
    
    console.log(Indexes);
    // domain
    var xDomain = d3.extent(Indexes[0].values, function(d){return d.value.GDP})
    xDomain = [xDomain[1], xDomain[0]];
    var yDomain = d3.extent(Indexes[0].values, function(d){return d.value.globalIndex} );
    var cDomain = d3.map(Indexes[0].values, function(d){return d.value.Region;});
    // range
    console.log(cDomain);
    var xRange = [0, innerW/2-10];
    var yRange = [innerH, 0];
    
    // scale
    var x = d3.scaleLinear().domain(xDomain).range(xRange);
    var y = d3.scaleLinear().domain(yDomain).range(yRange);
    var c = d3.scaleOrdinal(d3.schemePaired).domain(cDomain);
    
    //axes
    var xAxis = d3.axisBottom(x)
                .tickSize(0);

    var yAxis = d3.axisLeft(y)
                .tickSizeOuter(0)
                .tickSizeInner(innerW-500);
    svg.append('g')
        .attr('class', 'xAxis')
        .call(xAxis)
        .attr('transform', 'translate(' +[10, innerH]+ ')');
    svg.append('g')
       .attr('class', 'yAxis')
       .call(yAxis)
       .attr('transform', 'translate('+[innerW/2, 0]+ ')');
    //    .attr()




    // console.log(cDomain);
    // var c = d3.scaleOrdinal().domain
    // circle.
    var scatter = svg.selectAll(".circle")
                    .data(Indexes[0].values)
                    .enter().append('g')
                    .attr('class', 'circle');
                    
    scatter.attr('transform', function(d){
                 return 'translate(' +[x(d.value.GDP)+4, y(d.value.globalIndex)-6]+ ')';
            })
    scatter.append('circle')
           .attr('class', 'circle')
           .attr('r', 6)
           .attr('fill', function(d){return c(d.value.Region)});
   
    // legend
    var chipHeight = 12; //레전드 안에 색상칩 크기
    var chipPadding = 2; //색상칩 간격
    var legendHeight = 16;
    var legendPadding = 4;
    var legend = svg.append('g')
                    .attr('transform', 'translate(' + [-margin.left, legendHeight]  +  ')')
                    .selectAll('.legend')
                    .data(c.domain())
                    // .data(cDomain)
                    .enter().append('g')
                    .attr('class', 'legend')
                    .attr('transform', function(d,i){
                        return 'translate(' + [0, i *(legendHeight + legendPadding)]+ ')'
                      }) ;
    
    legend.append('rect')
          
          .attr('y', chipPadding)
          .attr('width', chipHeight)
          .attr('height', chipHeight)
          .attr('fill', function(d){return c(d)});
    legend.append('text')
    .attr('x', chipPadding+ chipHeight)
    .attr('y', chipPadding)
    .attr('dy', '1em')
    .style('font-size', 7 + 'px')
    .text(function(d){return d});

    scatter.on('mouseenter', function(d){
            console.log(d);
            // 나머지 것들은 다 투명하게
            // scatter.attr('opacity', '0.1');
            var hover = scatter.filter(function(p){return d.key===p.key})
                            .classed('hover', true)
            
            console.log(hover.data());
            var tooltip = svg.selectAll('.tooltip')
                            .data(hover.data());
            var tooltipDI = svg.selectAll('.tooltipDI')
                            .data(hover.data());
                            
                            // console.log('hell');
            tooltip.enter().append('g')
                .append('text')
                .attr('class', 'tooltip')
                .merge(tooltip)
                
                .attr('x', function(d){console.log('hell'); return x(d.value.GDP)})
                .attr('y', function(d){return y(d.value.globalIndex)})
                .attr('dx', '1em')
                .attr('dy', '-.35em')
                // .style('fill', function(d, i){return c(positionDomain[i])})
                // .attr('fill', 'red')
                .style('visibility', 'visible')
                .text(function(d){console.log('hell'); return d.key});     
            tooltipDI.enter().append('g')
                .append('text')
                .attr('class', 'tooltipDI')
                .merge(tooltipDI)
                
                .attr('x', function(d){console.log('tooltipDI working!'); return dX(d.value.DemocraticIndex) + 12})
                .attr('y', function(d){return dY(d.value.globalIndex) - 4})
                .attr('dx', '0.6em')
                .attr('dy', '-.45em')
                // .style('fill', function(d, i){return c(positionDomain[i])})
                // .attr('fill', 'red')
                .style('visibility', 'visible')
                .text(function(d){console.log('hell'); return d.key});         
            // tooltip.enter().append('g')
            //        .append('rect')
            //        .attr('class', 'tooltip')
            //        .merge(tooltip)
            //        .attr('x', function(d){console.log('hell'); return x(d.value.GDP)})
            //        .attr('y', function(d){return y(d.value.globalIndex)})
            //        .attr('width', '30')
            //        .attr('height', '30')
            //        .style('visibility', 'visible')
            //        .style('stroke', 'black');    
                   // clippath를 넣어서 tooltip 완성해보기
    })
    .on('mouseleave', function(d) {
        var hover = scatter.filter(function(){
            return d3.select(this).classed('hover')
            
        }).classed('hover', 'false');
        svg.selectAll('.tooltip')
          .style('visibility', 'hidden');
        svg.selectAll('.tooltipDI')
          .style('visibility', 'hidden'); 
      })
      
      // make Democratic Index including data
    var diIndexes = d3.nest()
    .key(function(d){return d.hasDeIndex})
    .key(function(d){return d.country})
    .rollup(function(value){
        
        return {
            globalIndex: d3.sum(value, function(d){return d.Global_Index})/value.length,
            ECONOMIC_PARTICIPATION_AND_OPPORTUNITY: d3.sum(value, function(d){return d.ECONOMIC_PARTICIPATION_AND_OPPORTUNITY})/value.length,
            HEALTH_AND_SURVIVAL: d3.sum(value, function(d){return d.HEALTH_AND_SURVIVAL})/value.length,
            EDUCATIONAL_ATTAINMENT: d3.sum(value, function(d){return d.EDUCATIONAL_ATTAINMENT})/value.length,
            POLITICAL_EMPOWERMENT: d3.sum(value, function(d){return d.POLITICAL_EMPOWERMENT})/value.length,
            GDP: d3.mean(value, function(d){return parseFloat(d.GDP)}),
            DemocraticIndex: d3.mean(value, function(d){return d.Democratic_Index}),
            Region: value[0].Region
        }
    })
    .entries(data);
     // make democratic index domain and range
     console.log(diIndexes);
     var dxDomain = d3.extent(diIndexes[0].values, function(d){return d.value.DemocraticIndex})
     console.log(diIndexes[0].values);
     var dyDomain = yDomain;
     var dxRange = [innerW/2, innerW];
     var dyRange = yRange;
     
     // create scatter plot
     var dX = d3.scaleLinear().domain(dxDomain).range(dxRange);
     var dY = d3.scaleLinear().domain(dyDomain).range(dyRange);
     var dxAxis = d3.axisBottom(dX)
                .tickSize(0);

     var dyAxis = d3.axisLeft(dY)
                .tickSizeInner(0)
                .tickSizeOuter(innerW);
    var diScatter = svg.selectAll(".diCircle")
                        .data(diIndexes[0].values)
                        .enter().append('g')
                        .attr('class', 'circle');
    diScatter.attr('transform', function(d){
                            // console.log('translate(' +[dX(d.value.DemocraticIndex), y(d.value.globalIndex)]+ ')');

                            return 'translate(' +[dX(d.value.DemocraticIndex) + 12, y(d.value.globalIndex) - 6]+ ')';
                       })

    diScatter.append('circle')
            .attr('class', 'diCircle')
            .attr('r', 6)
            .attr('fill', function(d){return c(d.value.Region)});
    
    // axis for democratic index
    var dxAxis = d3.axisBottom(dX)
                .tickSize(0);
    var dyAxis = d3.axisRight(y)
                .tickSizeInner(innerW-100)
                .tickSizeOuter(0);                   
    // var dyAxis = d3.axisLeft(y)
    //             // .tickSizeOuter(0)
    //             // .tickSizeInner(innerW-500)
    //             .tickSizeInner(innerW);
    svg.append('g')
            .attr('class', 'dxAxis')
            .call(dxAxis)
            .attr('transform', 'translate(' +[0, innerH]+ ')');
    svg.append('g')
            .attr('class', 'dyAxis')
            .call(dyAxis)
            .attr('transform', 'translate(' +[innerW/2, 0]+ ')');
   
    // brush
    var conditions = [];
    var saveCountry = new Set();
    // brush for xAxis
    var brush1 = d3.brushX();

    // brush1.extent([[0, -10], [innerW/2, 10]])
    brush1.extent([[0, -10], [innerW, 10]])
          .on('brush', brushed)
          .on('end', brushEnded)
    svg.selectAll('.xAxis') //축을 모두 선택한 후 각각 g를 추가하고 brush를 추가
        .append('g')
        .attr('class', 'brush')
        .call(brush1); 
    svg.selectAll('.dxAxis') //축을 모두 선택한 후 각각 g를 추가하고 brush를 추가
        .append('g')
        .attr('class', 'brush')
        .call(brush1); 


    //brush for dxAxis
    // var brush2 = d3.brushX();
    // brush2.extent([[innerW/2, -10], [innerW, 10]])
    //       .on('brush', brushed)
    //       .on('end', brushEnded)
    // svg.selectAll('.dxAxis')
    //    .append('g')
    //    .attr('class', 'brush')
    //    .call(brush2);


function brushed(d) {
    // var domain = d3.event.selection.map(function(d) { //[[x0, y0], [x1,y1]]
    //     return [x.invert(d[0]), y.invert(d[1])]; //거꾸로 range에서 domain을 찾음
    //   });
    // console.log(domain);
    // conditions[d.value.country] = d3.event.selection.map(x[d.value.country].invert); //현재 축 이름과 영역을 변환하여 저장, 
    conditions = d3.event.selection;
    console.log(conditions);
    hide(); //영역 바깥의 선들은 감춰둠
    // console.log(saveCountry);
    search();
  }
function brushEnded(d) {
    if(d3.event.selection === null) { //클릭만 했을 때
      conditions = [0, innerW/2]; //해당 영역의 조건을 지움
      
      hide();
      
      saveCountry = new Set();
    }
  }
  function hide() {
    // console.log(d);
    saveCountry = new Set();
    svg.selectAll('.circle').classed('hidden', function(d) {
        // console.log(d);
        var result = false;
        
        var domain = conditions;
        // console.log(domain);
        if(domain[1] <= innerW/2  ){
            result = result || (x(d.value.GDP) > domain[1] || x(d.value.GDP) < domain[0])
        } else {
            result = result || (x(d.value.DemocraticIndex) > domain[1] || x(d.value.DemocraticIndex) < domain[0])
        }

        // if(result) return result;
        if(result === false){
            saveCountry.add(d.key);
        }
        return result;
    });
  }

  function search(){
      svg.selectAll('.diCircle').classed('hidden', function(d){
          var result = true;
          console.log(d + result);
          if (saveCountry.has(d.key)){
              result = false;
          }
          return result;
      })
  }
  function leastSquare(target, xField='x', yField='y') {
    const length = target.length;
    const lengthRev = 1.0 / length;
    const xBar = sum(target, d => d[xField]) * lengthRev;
    const yBar = sum(target, d => d[yField]) * lengthRev;
    const ssXX = sum(target.map(d => Math.pow(d[xField] - xBar, 2)));
    const ssYY = sum(target.map(d => Math.pow(d[yField] - yBar, 2)));
    const ssXY = sum(target.map(d => (d[xField] - xBar) * (d[yField]- yBar)))
    const slope = ssXY /ssXX;
    const intercept = yBar - (xBar * slope);
    const rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
    return {slope, intercept, rSquare};
  }



})
