d3.select('#final_project2').append('p').text('인적 자본 지수의 subindex(Deployment, Development, Knowhow)와 성 격차 지수(Economic, Educational, Health, Political) 간의 상관관계이다. 표의 국가를 클릭하면 개별 국가의 수치를 볼 수 있으며, legend를 클릭하면 지역별로 데이터를 볼 수 있다. 자세히 살펴보면, 국가별 Deployment와 Economic Index의 양상이 비슷하게 나타나는데, 이는 인적자본에서 인력이 적정지점에 배치되고 있지 않기 때문이며, 그로 인해 성별 경제적 격차 또한 Deployment와 비슷한 추이를 보이기 때문이다. 실제로 Deployment의 subindex에는 gender gap employment/participation 지수가 있다.')
d3.select('#final_project2').append('p').text('성별 정치적 영향력 격차 지수(Political Empowerment index)는 공통적으로 낮은 수치를 기록했다.')


d3.csv('WEF_global_final_11.csv', row)
  .then(callback)

function row(d) {
  for(var k in d) {
    if(d.hasOwnProperty(k) && k !== 'Region' && k !== 'country') d[k] = +d[k];
  }
  return d;
}

/* secondGraph - parallel Coordinates */
var wSecond = 850, hSecond = 400;
var margin = {top:20, right:200, bottom: 20, left: 20};

var innerWSecond = wSecond - margin.right - margin.left,
  innerHSecond = hSecond - margin.top - margin.bottom;
var svg = d3.select('#final_project2').append('svg')
  .attr('class', 'svg')
  .attr('width', wSecond)
  .attr('height', hSecond)
.append('g')
  .attr('transform', 'translate('+ [margin.left, margin.top] + ')');



/* brush */
var brush = d3.brushY();
brush = brush.extent([[-12, 0], [12, innerHSecond]])
  .on('brush', brushed)
  .on('end', brushEnded);

var conditions = {};
function brushed(d) {
  conditions[d.name] = d3.event.selection.map(ySecond[d.name].invert); //현재 축 이름과 영역을 변환하여 저장, 
  hide(); //영역 바깥의 선들은 감춰둠
}
function brushEnded(d) {
  if(d3.event.selection === null) {
    delete conditions[d.name];
    hide();
  }
}
function hide() {
  svg.selectAll('.series').classed('hidden', function(d) {
    var result = false;
    for(var k in conditions) {
      var domain = conditions[k];
      result = result || (d[k] < domain[1] || d[k] > domain[0])
      console.log(domain)
      console.log(result)
      if(result) return result;
    }
    if(!result) this.parentNode.appendChild(this); //뒤로 보내기 툴팁 할 때 는 고민 해보기
    return result;
  });
}

var xAxisSecond = d3.axisBottom().tickSize(0).tickPadding(-8);
var yAxisSecond = d3.axisLeft();

var xSecond = d3.scalePoint().range([0, innerWSecond]).padding(0.04);
var ySecond = {} // yscale

function callback(data){
//color
var regionDomain = []
data.forEach(function(d) {
  if(regionDomain.indexOf(d.Region) < 0) regionDomain.push(d.Region);
})
var colorRange = []
var color = d3.scaleOrdinal().domain(regionDomain).range([d3.rgb("#f6bc41"),d3.rgb("#babc31"),d3.rgb("#559f3e"),d3.rgb("#188659"),d3.rgb("#1e93a8"),d3.rgb("#25659d"),d3.rgb("#483ca3"),d3.rgb("#7b3ca3")]);


var lineSecond = d3.line()
  .x(function(d){return d.x})
  .y(function(d){return d.y})

var headersSecond = data.columns.slice(6,13);
headersSecond = headersSecond.map(function(h) {
  var domain = d3.extent(data, function(d){return d[h];});
  return {name:h, domain:domain};
})
headersSecond.forEach(function(h){
  ySecond[h.name] = d3.scaleLinear().domain(h.domain).range([innerHSecond, 0]);
});
xSecond.domain(headersSecond.map(function(d){return d.name;}));

function seriesSecond(d) {
  return xSecond.domain().map(function(h) {
    return {x:xSecond(h), y:ySecond[h](d[h])}
  });
}


svg.selectAll('.series')
  .data(data)
  .enter().append('g')
  .attr('class', 'series')
  .style('stroke', function(d){return color(d.Region)})
  .selectAll('path')
  .data(function(d){return [seriesSecond(d)]})
  .enter().append('path')
  .attr('d', lineSecond)
  .style('stroke-width', 0.7+'px')
var yAxis = svg.selectAll('.y.axisSecond')
  .data(headersSecond, function(d){return d.name})
  .enter().append('g')
  .attr('class', 'y axisSecond')
  .attr('transform', function(d) {return 'translate(' + [xSecond(d.name), 0] + ')';}) //축을 x 스케일을 이용해 이동
  .each(function(d){
    yAxisSecond.scale(ySecond[d.name]);
    d3.select(this).call(yAxisSecond);
  })
xAxisSecond.scale(xSecond);
svg.append('g')
  .attr('class', 'x axisSecond')
  .call(xAxisSecond)
svg.selectAll('.y.axisSecond')
    .append('g')
    .attr('class', 'brush')
    .call(brush);

  /* legend */
  var chipHeight = 12;
  var chipPadding = 2;
  var legendHeight = 16;
  var legendPadding = 4;
  var legend = svg.append('g')
    .attr('class', 'legend-g')
    .attr('transform', 'translate('+ [innerWSecond + legendHeight, legendHeight] + ')')
    .selectAll('.legend')
    .data(color.domain())
    .enter().append('g')
    .attr('transform', function(d,i){
    return 'translate(' + [0, i *(legendHeight + legendPadding)]+ ')'
    })
  legend.append('rect')
    .attr('y', chipPadding)
    .attr('width', chipHeight).attr('height', chipHeight)
    .style('fill', function(d){return color(d)})
  legend.append('text')
    .attr('x', chipPadding + chipHeight)
    .attr('y', chipPadding)
    .attr('dy', '.9em')
    .style('font-size', legendHeight-7 + 'px')
    .text(function(d){return d})


  /*legend interaction*/
  var filterValues = regionDomain;
  legend.selectAll('rect').on('click', function(e) {
    var hide = false;
    var newFilters = [];
    filterValues.forEach(function(f) {
      if (f === e) {
        hide = true;
      } else {
        newFilters.push(f);
      }
    });
    if(hide) {
      d3.select(this).style('opacity', 0.1);
      filterValues = newFilters;
      console.log(filterValues)
      d3.selectAll('circle')
        .filter(function(j) {return filterValues.indexOf(j.Region) < 0})
        .attr('opacity', 0)
      d3.selectAll('.series')
        .filter(function(j){return filterValues.indexOf(j.Region) < 0})
        .attr('opacity', 0)
    } else {
      newFilters.push(e);
      d3.select(this).style('opacity', 1);
      filterValues = newFilters;
      console.log(filterValues)
      d3.selectAll('circle')
      .filter(function(j) {return filterValues.indexOf(j.Region) >= 0})
      .attr('opacity', 1)
      d3.selectAll('.series')
        .filter(function(j){return filterValues.indexOf(j.Region) >= 0})
        .attr('opacity', 1)
    }
  })
  /*table*/
  function renderTable(data, columns) {
  var table = d3.select('#final_project2').append('div').attr('id', 'table-wrapper')
    .append('div').attr('id', 'table-scroll')
    .append('table')
      .style('border', '2px black solid')
      .style('border-collapse', 'collapse')
      .attr('id', 'myTable')
  var thead = table.append('thead')
  var tbody = table.append('tbody');
  //append header row
  thead.append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
    .text(function(column) {
      if(column === 'DEPLOYMENT') return 'Deployment';
      else return column;
    })
    .style('font-size', 10 + 'px')
    .style('font-weight', 400)

  //create a row for each object
  var rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')
    .attr('class', 'tr')
    .attr('id', function(d){return d.country});
  var cells = rows.selectAll('td')
    .data(function(row) {
      return columns.map(function(column) {
        return {column:column, value:row[column]};
      });
    })
    .enter()
    .append('td')
    .text(function(d){return d.value;})
    .style('font-size', 8 + 'px');

    //table click interaction
    var clickBase = []
    data.forEach(function(d) {
      clickBase.push(d.country)
    })    
    tbody.selectAll('.tr').on('click', function(d) {
      var clickFilters = [];
      hideClick = false;
      clickBase.forEach(function(f) {
        if(f===d.country) {
          hideClick = true;
        } else {
          clickFilters.push(f)
        }
      });
      if(hideClick) {
        //table font change
        d3.select(this).classed('clickTable', true)
        clickBase = clickFilters;
        console.log(clickBase)
        d3.selectAll('.series')
          .filter(function(j){return clickBase.indexOf(j.country) < 0})
          .attr('opacity', 1)
        d3.selectAll('.series')
          .filter(function(j){return clickBase.indexOf(j.country) >= 0})
          .attr('opacity', 0)
      } else {
        clickFilters.push(d.country);
        clickBase = clickFilters;
        console.log(clickBase)
        d3.select(this).classed('clickTable', false)
        d3.selectAll('.series')
          .filter(function(j){return clickBase.indexOf(j.country) >= 0})
          .attr('opacity', 0)
        d3.selectAll('.series')
          .filter(function(j){return clickBase.indexOf(j.country) < 0})
          .attr('opacity', 1)
          .style('stroke-width', 2+'px')
        }    
    })
    return table;
  }
  var columnSecond = []
  columnSecond.push(data.columns.slice(0,1))
  columnSecond.push(data.columns.slice(6,7))
  columnSecond.push(data.columns.slice(7,8))
  columnSecond.push(data.columns.slice(8,9))
  columnSecond.push(data.columns.slice(9,10))
  columnSecond.push(data.columns.slice(10,11))
  columnSecond.push(data.columns.slice(11,12))
  columnSecond.push(data.columns.slice(12,13))
  renderTable(data, columnSecond);
}


