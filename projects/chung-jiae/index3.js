d3.select('#final_project3').append('p').text('마지막으로 연령별 성별 고용 격차(employment Gender Gap, scale 0-100)이다. 연령대는 15-24, 25-54, 55-64, 65세 이상으로 나누었으며, 각 국가별 고용격차를 확인할 수 있다. 100에 가까울 수록 평등에 가까운 것이다.')


d3.json('Difference_chart_converted.json').then(function(data) {
  /* data정리 */
  var nest = d3.nest()
    .key(function(d) {return d.country})
    .key(function(d) {return d.Age})
    .sortKeys(function(a,b) {
      return parseInt(a) - parseInt(b);
    })
    .rollup(function(values) {
      return d3.mean(values, function(d) {return d.Value})
    })
    .entries(data)
  console.log(nest)

  /* search box */
  var searchName = d3.select('#final_project3').append('form').append('input')
                            .attr('type','text').attr('id','inputSearch')
                            .attr('placeholder','search country');
  document.getElementById('inputSearch').onkeyup = function findGraph(event) {
    var input = document.getElementById('inputSearch')
    filter = input.value.toUpperCase();
    //var searchCountry = d3.selectAll('.region').filter(function(p){return p.key === input})
    nest.forEach(function(e) {
      if(filter === e.key) {
        console.log('hello')
        console.log(e)
        var datasearched = [e];
        var show = d3.selectAll('.region').filter(function(d){return d.key === filter})
      }
    })
    
  }  

  /* 기본 setting */
  var w = 100*5, h = 100*25;
  var margin = {top:10, right:10, bottom:10, left:10}

  var innerW = w - margin.right - margin.left,
      innerH = h - margin.top - margin.bottom;

  var cursor = 0; //이건 왜?
  var offset = 10, max = 4;

  var svg = d3.select('#final_project3').append('svg')
    .attr('width', w+30)
    .attr('height', h+110+110+150)
    .append('g')
  
  

  /* scale 설정 */
  var x = d3.scalePoint().domain(d3.range(cursor + 1, max + 1)).range([0, w/5-10])
  var y = d3.scaleLinear().domain([0,100]).range([innerH/25-10,0])
  //color
    var regionDomain = ["MIDDLE EAST AND NORTH AFRICA", "WESTERN EUROPE", "EAST ASIA AND THE PACIFIC", "NORTH AMERICA", "EASTERN EUROPE AND CENTRAL ASIA", "LATIN AMERICA AND THE CARIBBEAN", "SUB-SAHARAN AFRICA", "SOUTH ASIA"]
    var colorRange = []
    var color = d3.scaleOrdinal().domain(regionDomain).range([d3.rgb("#f6bc41"),d3.rgb("#babc31"),d3.rgb("#559f3e"),d3.rgb("#188659"),d3.rgb("#1e93a8"),d3.rgb("#25659d"),d3.rgb("#483ca3"),d3.rgb("#7b3ca3")]);

  var xAxis = d3.axisBottom(x)
    .tickSize(0).tickPadding(4);
  var line = d3.line()
    .x(function(d){return x(parseInt(d.key))})
    .y(function(d){return y(d.value)});

  
  
  var region = svg.selectAll('.region')
    .data(function (d) {return nest}, function (d) {return d.key})
    .enter().append('g')
    .attr('class', 'region') //color 추가하기
    .attr('transform', function (d, i) {
      if(i < 5) {return 'translate(' + [margin.left + w/5 * i, margin.top] + ')';}
      if(i < 10) {return 'translate(' + [margin.left + w/5 * (i-5), margin.top + h/25*1 + 10] + ')';}
      if(i < 15) {return 'translate(' + [margin.left + w/5 * (i-10), margin.top + h/25*2 + 20] + ')';}
      if(i < 20) {return 'translate(' + [margin.left + w/5 * (i-15), margin.top + h/25*3 + 30] + ')';}
      if(i < 25) {return 'translate(' + [margin.left + w/5 * (i-20), margin.top + h/25*4 + 40] + ')';}
      if(i < 30) {return 'translate(' + [margin.left + w/5 * (i-25), margin.top + h/25*5 + 50] + ')';}
      if(i < 35) {return 'translate(' + [margin.left + w/5 * (i-30), margin.top + h/25*6 + 60] + ')';}
      if(i < 40) {return 'translate(' + [margin.left + w/5 * (i-35), margin.top + h/25*7 + 70] + ')';}
      if(i < 45) {return 'translate(' + [margin.left + w/5 * (i-40), margin.top + h/25*8 + 80] + ')';}
      if(i < 50) {return 'translate(' + [margin.left + w/5 * (i-45), margin.top + h/25*9 + 90] + ')';}
      if(i < 55) {return 'translate(' + [margin.left + w/5 * (i-50), margin.top + h/25*10 + 100] + ')';}
      if(i < 60) {return 'translate(' + [margin.left + w/5 * (i-55), margin.top + h/25*11 + 110] + ')';}
      if(i < 65) {return 'translate(' + [margin.left + w/5 * (i-60), margin.top + h/25*12 + 120] + ')';}
      if(i < 70) {return 'translate(' + [margin.left + w/5 * (i-65), margin.top + h/25*13 + 130] + ')';}
      if(i < 75) {return 'translate(' + [margin.left + w/5 * (i-70), margin.top + h/25*14 + 140] + ')';}
      if(i < 80) {return 'translate(' + [margin.left + w/5 * (i-75), margin.top + h/25*15 + 150] + ')';}
      if(i < 85) {return 'translate(' + [margin.left + w/5 * (i-80), margin.top + h/25*16 + 160] + ')';}
      if(i < 90) {return 'translate(' + [margin.left + w/5 * (i-85), margin.top + h/25*17 + 170] + ')';}
      if(i < 95) {return 'translate(' + [margin.left + w/5 * (i-90), margin.top + h/25*18 + 180] + ')';}
      if(i < 100) {return 'translate(' + [margin.left + w/5 * (i-95), margin.top + h/25*19 + 190] + ')';}
      if(i < 105) {return 'translate(' + [margin.left + w/5 * (i-100), margin.top + h/25*20 + 200] + ')';}
      if(i < 110) {return 'translate(' + [margin.left + w/5 * (i-105), margin.top + h/25*21 + 210] + ')';}
      if(i < 115) {return 'translate(' + [margin.left + w/5 * (i-110), margin.top + h/25*22 + 220] + ')';}
      if(i < 120) {return 'translate(' + [margin.left + w/5 * (i-115), margin.top + h/25*23 + 230] + ')';}
      if(i < 125) {return 'translate(' + [margin.left + w/5 * (i-120), margin.top + h/25*24 + 240] + ')';}
    })
  
  region.append('rect')
    .data(data)
    .attr('class', 'rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', w/5-10)
    .attr('height', innerH/25-10)
    .style('fill', function(d){return color(d.Region)})
    .attr('opacity', 0.15)

  region.append('path')
    .datum(function(d) {return d.values})
    .attr('class', 'series')
    .attr('d', line)
    .attr('stroke', 'black')
    
    .attr('opacity', 1)




  
  region.append('text')
    .attr('class', 'countryName')
    .data(function (d) {return nest}, function (d) {return d.key})
    .attr('x', 5)
    .attr('y', innerH/25-15-5)
    .attr('dy', '.9em')
    .style('font-size', 10 + 'px')
    .text(function(d){return d.key})
    .attr('opacity', 1)


  region.append('g')
    .attr('class', 'x axisGroup')
    .attr('transform', 'translate(' + [0, innerH/25-10] + ')')
    .call(xAxis)
    .attr('opacity', 1)

  /* point */
  var point = region.selectAll('.point')
    .data(function(d){return d.values})
    .enter().append('circle')
    .attr('class', 'point')
    .attr('cx', function(d){return x(parseInt(d.key))})
    .attr('cy', function(d){return y(d.value)})
    .attr('r', 1.5)
  var number = region.selectAll('.number')
    .data(function(d){return d.values})
  number.enter().append('text')
    .attr('class', 'number')
    .attr('x', function(d){return x(parseInt(d.key))})
    .attr('y', function(d){return y(d.value)})
    .attr('dx', '.25em')
    .attr('dy', '-.35em')
    .text(function (d) {return d.value});

  /* medium */
  
  

});
