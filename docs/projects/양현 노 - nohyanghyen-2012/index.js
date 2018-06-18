//chart1-1. 역대 지방선거의 후보자 중 여성 비율

d3.json('election.json').then(function (data) {
  var w = 250, h = 150;
  var margin = {top:10, right:10, bottom: 20, left: 30};
  var innerW = w - margin.right - margin.left,
    innerH = h - margin.top - margin.bottom;

  var svg = d3.select('.chart1-1').append('svg')
      .attr('width', w * 3)
      .attr('height', h * 3 + 50)
    .append('g')
    svg.append('clipPath')
      .attr('id', 'bar-clip')
      .append('rect')
      .attr('x', -margin.left)
      .attr('y', -margin.top)
      .attr('width', w + margin.left)
      .attr('height', h + margin.top);


  var entries = d3.nest()
    .key(function(d){return d.division})
    .key(function(d){return d.period})
    .sortKeys(d3.ascending) //x의 오름차순으로 정리한다.
    .rollup(function (values) {
      return (d3.sum(values, function (d) {return d.cw})/d3.sum(values, function (d) {return d.ca})) * 100;
    })
    .entries(data);

  console.log(entries);

  var x = d3.scalePoint() // x가 scaplePoint
    .domain(data.map(function(d){return d.period}))
    .range([0, innerW]);
  var y = d3.scaleLinear()
    .domain([0, 40])
    .range([innerH, 0])
    .clamp(true);
  var c = d3.scaleOrdinal()
    .domain(entries.map(function (d) {
      return d.key
    }))
    .range(d3.schemeCategory10);

  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickPadding(8);

  var yAxis = d3.axisLeft(y) // 왼쪽에 tick이 그려지는 axis
    .tickSize(0)
    .ticks(5)
    .tickSizeInner(-innerW); // 그리드를 그려주기 위해 반대방향으로 tick 그려줌

  var line = d3.line(); //라인 생성기를 만든다.

  line.x(function(d){return x(d.key)})
    .y(function(d){return y(d.value)});

  var region = svg.selectAll('.region')
    .data(entries, function (d) {return d.key})
    .enter().append('g')
    .attr('class', 'region')
    .attr('fill', 'rgba(255,255,255,0)')
    .attr('stroke', function (d) {return c(d.key)})
    .attr('clip-path', 'url(#bar-clip)')
    .attr('transform', function (d, i) {
      if (i < 3) {
        return 'translate(' + [margin.left + w * i, margin.top] + ')';
      } else if (i < 6) {
        return 'translate(' + [margin.left + w * (i-3), margin.top + h + 20] + ')';
      } else {
        return 'translate(' + [margin.left + w * (i-6), margin.top + (h*2) + 40] + ')';
      }

    })
    .append('g'); //clip-path 이동을 막기위해 추가

  region.append('text')
    .attr('class', 'chart-title')
    .attr('x', w/2-12)
    .attr('height', 20)
    .attr('y', 5)
    .attr('fill', function (d) {return c(d.key)})
    .attr('text-anchor', 'middle')
    .text(function (d) {return d.key});

    console.log(function(d){d.key});

  region.append('g')
    .attr('class', 'y axis')
    .call(yAxis)

  region.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + [0, innerH] + ')')
    .call(xAxis);

  region.append('path')
    .datum(function (d) {
      return d.values
    })
    .attr('class', 'series')
    .attr('d', line)

  var point = region.selectAll('.point')
    .data(function (d) {
      return d.values
    })
    .enter().append('circle')
    .attr('class', 'point')
    .attr('fill', 'white')
    .attr('cx', function (d) {
      return x(d.key);
    })
    .attr('cy', function (d) {
      return y(d.value);
    })
    .attr('r', 3);
})

//chart1-2. 역대 지방선거 당선인 중 여성 비율.

d3.json('election.json').then(function (data) {
  var w = 250, h = 150;
  var margin = {top:10, right:10, bottom: 20, left: 30};
  var innerW = w - margin.right - margin.left,
    innerH = h - margin.top - margin.bottom;

  var svg = d3.select('.chart1-2').append('svg')
      .attr('width', w * 3)
      .attr('height', h * 3 + 50)
    .append('g')
    svg.append('clipPath')
      .attr('id', 'bar-clip')
      .append('rect')
      .attr('x', -margin.left)
      .attr('y', -margin.top)
      .attr('width', w + margin.left)
      .attr('height', h + margin.top);


  var entries = d3.nest()
    .key(function(d){return d.division})
    .key(function(d){return d.period})
    .sortKeys(d3.ascending) //x의 오름차순으로 정리한다.
    .rollup(function (values) {
      return (d3.sum(values, function (d) {return d.ew})/d3.sum(values, function (d) {return d.ea})) * 100;
    })
    .entries(data);

  console.log(entries);

  var x = d3.scalePoint() // x가 scaplePoint
    .domain(data.map(function(d){return d.period}))
    .range([0, innerW]);
  var y = d3.scaleLinear()
    .domain([0, 40])
    .range([innerH, 0])
    .clamp(true);
  var c = d3.scaleOrdinal()
    .domain(entries.map(function (d) {
      return d.key
    }))
    .range(d3.schemeCategory10);

  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickPadding(8);

  var yAxis = d3.axisLeft(y) // 왼쪽에 tick이 그려지는 axis
    .tickSize(0)
    .ticks(5)
    .tickSizeInner(-innerW); // 그리드를 그려주기 위해 반대방향으로 tick 그려줌

  var line = d3.line(); //라인 생성기를 만든다.

  line.x(function(d){return x(d.key)})
    .y(function(d){return y(d.value)});

  var region = svg.selectAll('.region')
    .data(entries, function (d) {return d.key})
    .enter().append('g')
    .attr('class', 'region')
    .attr('fill', 'rgba(255,255,255,0)')
    .attr('stroke', function (d) {return c(d.key)})
    .attr('clip-path', 'url(#bar-clip)')
    .attr('transform', function (d, i) {
      if (i < 3) {
        return 'translate(' + [margin.left + w * i, margin.top] + ')';
      } else if (i < 6) {
        return 'translate(' + [margin.left + w * (i-3), margin.top + h + 20] + ')';
      } else {
        return 'translate(' + [margin.left + w * (i-6), margin.top + (h*2) + 40] + ')';
      }
    })
    .append('g'); //clip-path 이동을 막기위해 추가

  region.append('text')
    .attr('class', 'chart-title')
    .attr('x', w/2-12)
    .attr('height', 20)
    .attr('y', 5)
    .attr('fill', function (d) {return c(d.key)})
    .attr('text-anchor', 'middle')
    .text(function (d) {return d.key});

    console.log(function(d){d.key});

  region.append('g')
    .attr('class', 'y axis')
    .call(yAxis)

  region.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + [0, innerH] + ')')
    .call(xAxis);

  region.append('path')
    .datum(function (d) {
      return d.values
    })
    .attr('class', 'series')
    .attr('d', line)

  var point = region.selectAll('.point')
    .data(function (d) {
      return d.values
    })
    .enter().append('circle')
    .attr('class', 'point')
    .attr('fill', 'white')
    .attr('cx', function (d) {
      return x(d.key);
    })
    .attr('cy', function (d) {
      return y(d.value);
    })
    .attr('r', 3);
})

//chart2-1
d3.json('election.json').then(function (data) {
  var w = 250, h = 150;
  var margin = {top:10, right:10, bottom: 20, left: 30};
  var innerW = w - margin.right - margin.left,
    innerH = h - margin.top - margin.bottom;

  var svg = d3.select('.chart2-1').append('svg')
      .attr('width', w * 3)
      .attr('height', h * 2 + 30)
    .append('g')
    svg.append('clipPath')
      .attr('id', 'bar-clip')
      .append('rect')
      .attr('x', -margin.left)
      .attr('y', -margin.top)
      .attr('width', w + margin.left)
      .attr('height', h + margin.top);

  var entries = d3.nest()
    .key(function(d){return d.category})
    .key(function(d){return d.period})
    .sortKeys(d3.ascending) //x의 오름차순으로 정리한다.
    .rollup(function (values) {
      return (d3.sum(values, function (d) {return d.cw})/d3.sum(values, function (d) {return d.ca})) * 100;
    })
    .entries(data);

  console.log(entries);

  var x = d3.scalePoint() // x가 scaplePoint
    .domain(data.map(function(d){return d.period}))
    .range([0, innerW]);
  var y = d3.scaleLinear()
    .domain([0, 80])
    .range([innerH, 0])
    .clamp(true);
  var c = d3.scaleOrdinal()
    .domain(entries.map(function (d) {
      return d.key
    }))
    .range(d3.schemeCategory10);

  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickPadding(8);

  var yAxis = d3.axisLeft(y) // 왼쪽에 tick이 그려지는 axis
    .tickSize(0)
    .ticks(5)
    .tickSizeInner(-innerW); // 그리드를 그려주기 위해 반대방향으로 tick 그려줌

  var line = d3.line(); //라인 생성기를 만든다.

  line.x(function(d){return x(d.key)})
    .y(function(d){return y(d.value)});

  var region = svg.selectAll('.region')
    .data(function (d) {
      return entries
    }, function (d) {
      return d.key
    })
    .enter()
    .append('g')
    .attr('class', 'region')
    .attr('fill', 'rgba(255,255,255,0)')
    .attr('stroke', function (d) {return c(d.key)})
    .attr('clip-path', 'url(#bar-clip)')
    .attr('transform', function (d, i) {
      if (i < 3) {
        return 'translate(' + [margin.left + w * i, margin.top] + ')';
      } else
        return 'translate(' + [margin.left + w * (i-3), margin.top + h + 20] + ')';
      })
    .append('g'); //clip-path 이동을 막기위해 추가

  region.append('text')
    .attr('class', 'chart-title')
    .attr('x', w/2-12)
    .attr('height', 30)
    .attr('y', 5)
    .attr('fill', function (d) {return c(d.key)})
    .attr('text-anchor', 'middle')
    .text(function (d) {return d.key});

  region.append('g')
    .attr('class', 'y axis')
    .call(yAxis)

  region.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + [0, innerH] + ')')
    .call(xAxis);

    console.log(function(d){d.category});

  region.append('path')
    .datum(function (d) {
      return d.values
    })
    .attr('class', 'series')
    .attr('d', line)

  var point = region.selectAll('.point')
    .data(function (d) {
      return d.values
    })
    .enter().append('circle')
    .attr('class', 'point')
    .attr('fill', 'white')
    .attr('cx', function (d) {
      return x(d.key);
    })
    .attr('cy', function (d) {
      return y(d.value);
    })
    .attr('r', 3);
})


//chart2-2
d3.json('election.json').then(function (data) {
  var w = 250, h = 150;
  var margin = {top:10, right:10, bottom: 20, left: 30};
  var innerW = w - margin.right - margin.left,
    innerH = h - margin.top - margin.bottom;

  var svg = d3.select('.chart2-2').append('svg')
      .attr('width', w * 3)
      .attr('height', h * 2 + 50)
    .append('g')
    svg.append('clipPath')
      .attr('id', 'bar-clip')
      .append('rect')
      .attr('x', -margin.left)
      .attr('y', -margin.top)
      .attr('width', w + margin.left)
      .attr('height', h + margin.top);

  var entries = d3.nest()
    .key(function(d){return d.category})
    .key(function(d){return d.period})
    .sortKeys(d3.ascending) //x의 오름차순으로 정리한다.
    .rollup(function (values) {
      return (d3.sum(values, function (d) {return d.ew})/d3.sum(values, function (d) {return d.ea})) * 100;
    })
    .entries(data);

  console.log(entries);

  var x = d3.scalePoint() // x가 scaplePoint
    .domain(data.map(function(d){return d.period}))
    .range([0, innerW]);
  var y = d3.scaleLinear()
    .domain([0, 80])
    .range([innerH, 0])
    .clamp(true);
  var c = d3.scaleOrdinal()
    .domain(entries.map(function (d) {
      return d.key
    }))
    .range(d3.schemeCategory10);

  var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickPadding(8);

  var yAxis = d3.axisLeft(y) // 왼쪽에 tick이 그려지는 axis
    .tickSize(0)
    .ticks(5)
    .tickSizeInner(-innerW); // 그리드를 그려주기 위해 반대방향으로 tick 그려줌

  var line = d3.line(); //라인 생성기를 만든다.

  line.x(function(d){return x(d.key)})
    .y(function(d){return y(d.value)});

  var region = svg.selectAll('.region')
    .data(function (d) {
      return entries
    }, function (d) {
      return d.key
    })
    .enter()
    .append('g')
    .attr('class', 'region')
    .attr('fill', 'rgba(255,255,255,0)')
    .attr('stroke', function (d) {return c(d.key)})
    .attr('clip-path', 'url(#bar-clip)')
    .attr('transform', function (d, i) {
      if (i < 3) {
        return 'translate(' + [margin.left + w * i, margin.top] + ')';
      } else
        return 'translate(' + [margin.left + w * (i-3), margin.top + h + 20] + ')';
      })
    .append('g'); //clip-path 이동을 막기위해 추가

  region.append('text')
    .attr('class', 'chart-title')
    .attr('x', w/2-12)
    .attr('height', 30)
    .attr('y', 5)
    .attr('fill', function (d) {return c(d.key)})
    .attr('text-anchor', 'middle')
    .text(function (d) {return d.key});

  region.append('g')
    .attr('class', 'y axis')
    .call(yAxis)

  region.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + [0, innerH] + ')')
    .call(xAxis);

    console.log(function(d){d.category});

  region.append('path')
    .datum(function (d) {
      return d.values
    })
    .attr('class', 'series')
    .attr('d', line)

  var point = region.selectAll('.point')
    .data(function (d) {
      return d.values
    })
    .enter().append('circle')
    .attr('class', 'point')
    .attr('fill', 'white')
    .attr('cx', function (d) {
      return x(d.key);
    })
    .attr('cy', function (d) {
      return y(d.value);
    })
    .attr('r', 3);
})
