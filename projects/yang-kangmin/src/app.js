import * as d3 from 'd3'

const tooltip = d3.select('body').append('div').attr('class', 'tip');

const z = d3.scaleOrdinal()
  .domain([ '자유', '무소속자유', '민주', '무소속민주', '진보', '무소속'])
  .range(['#c00000', '#f4b183', '#0070c0', '#8faadc', '#ffff00', '#ffffff']);

d3.csv('data/sample.csv', (d) => {
  d.round = +d.round;
  d.voterate = (+d.voterate) * 0.01;
  return d;
}, (error, data) => {
  if (error) throw error;
  drawBar('.gb', data, '경북')
  drawBar('.gn', data, '경남')
  drawBar('.jb', data, '전북')
  drawBar('.jn', data, '전남')
  drawGroupBar('.chart__groupbar', data)
});

function drawBar (selector, data, district) {
  const svg = d3.select(selector);
  const margin = {top: 40, right: 20, bottom: 50, left: 60};
  const width = parseInt(svg.style('width')) - margin.left - margin.right;
  const height = parseInt(svg.style('height')) - margin.top - margin.bottom;
  const x = d3.scaleBand().rangeRound([0, width]).padding(0.3);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  data = data.filter(d => d.district === district && d.election === '당선')

  x.domain(data.map(d => d.round));
  y.domain([0, 1]);

  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .append('text')
    .attr('class', 'axis__text')
    .attr('x', width)
    .attr('y', 25)
    .attr('dy', '0.71em')
    .text('회차');

  g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y).ticks(5, '%'))
    .append('text')
    .attr('class', 'axis__text')
    .attr('x', -20)
    .attr('y', -30)
    .attr('dy', '0.71em')
    .text(`${district} 득표율`);

  g.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.round))
    .attr('y', d => y(d.voterate))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.voterate))
    .attr('fill', d => z(d.series))
    .on('mousemove', function(d){
      tooltip
        .style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY + 20 + 'px')
        .style('display', 'inline-block')
        .html('<strong>' + d.name + '</strong>' + '<br>' + d.party + '<br>' + (d.voterate * 100).toFixed(2) + '%');
    })
    .on('mouseout', function(d){ tooltip.style('display', 'none');});
}

function drawGroupBar (selector, raw) {
  const svg = d3.select(selector);
  const margin = {top: 40, right: 20, bottom: 30, left: 60};
  const width = parseInt(svg.style('width')) - margin.left - margin.right;
  const height = parseInt(svg.style('height')) - margin.top - margin.bottom;
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  let roundIdx = 0

  const x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

  const y = d3.scaleLinear()
    .rangeRound([height, 0]);

  const data = d3.nest()
    .key(d => d.round)
    .key(d => d.district)
    .key(d => d.series)
    .entries(raw)

  const seriesKeys = uniq(raw.map(d => d.series))
  const district = uniq(raw.map(d => d.district))

  x0.domain(district);
  y.domain([0, 1]);

  const barGroup = g.append('g')

  barGroup
    .selectAll('g')
    .data(data[0].values)
    .enter().append('g')
    .attr('transform', d => `translate(${x0(d.key)},0)`)
    .selectAll('rect')
    .data(d => {
      return d.values.map(v => {
        v.sum = d3.sum(v.values.map(v2 => v2.voterate))
        v.seriesKeys = d.values.map(d1 => d1.key)
        return v
      })
    })
    .enter().append('rect')
    .attr('class', 'groupbar')
    .attr('x', (d, i) => 35 * i)
    .attr('y', d => y(d.sum))
    .attr('width', 30)
    .attr('height', d => height - y(d.sum))
    .attr('transform', d => `translate(${(x0.bandwidth() - (d.seriesKeys.length * 35 - 15)) * 0.5},0)`)
    .attr('fill', d => z(d.key))
    .on('mousemove', function(d){
      tooltip
        .style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY + 20 + 'px')
        .style('display', 'inline-block')
        .html(tmpl(d.values));
    })
    .on('mouseout', function(d){ tooltip.style('display', 'none');});

  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x0));

  g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y).ticks(10, '%'))
    .append('text')
    .attr('class', 'axis__text')
    .attr('x', -20)
    .attr('y', -30)
    .attr('dy', '0.71em')
    .text('득표율');

  const legend = g.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 13)
    .attr('text-anchor', 'end')
    .selectAll('g')
    .data(['자유', '무소속자유', '민주', '무소속민주', '진보', '무소속'])
    .enter().append('g')
    .attr('transform', (d, i) => `translate(0,${i * 23})`);

  legend.append('rect')
    .attr('class', 'groupbar')
    .attr('x', width - 19)
    .attr('width', 19)
    .attr('height', 19)
    .attr('fill', z);

  legend.append('text')
    .attr('x', width - 24)
    .attr('y', 9.5)
    .attr('dy', '0.32em')
    .text(d => d);

  d3.select('.chart__btn_left').on('click', () => {
    roundIdx = getOffsetRound(-1)
    updateData(data[roundIdx].values)
  })

  d3.select('.chart__btn_right').on('click', () => {
    roundIdx = getOffsetRound(1)
    updateData(data[roundIdx].values)
  })

  function updateData (data) {
    const DURATION = 800

    d3.select('.chart__round-text').text(`${roundIdx + 1}회`)

    const bars = barGroup
      .selectAll('g')
      .data(data)
      .selectAll('rect')
      .data(d => {
        return d.values.map(v => {
          v.sum = d3.sum(v.values.map(v2 => v2.voterate))
          v.seriesKeys = d.values.map(d1 => d1.key)
          return v
        })
      })

    bars
      .transition().duration(DURATION)
      .attr('x', (d, i) => 35 * i)
      .attr('y', d => y(d.sum))
      .attr('width', 30)
      .attr('height', d => height - y(d.sum))
      .attr('transform', d => `translate(${(x0.bandwidth() - (d.seriesKeys.length * 35 - 15)) * 0.5},0)`)
      .attr('fill', d => z(d.key))

    const enterBars = bars
      .enter().append('rect')
      .attr('height', 0)
      .attr('class', 'groupbar')
      .attr('x', (d, i) => 35 * i)
      .attr('y', d => y(0))
      .attr('width', 30)
      .attr('transform', d => `translate(${(x0.bandwidth() - (d.seriesKeys.length * 35 - 15)) * 0.5},0)`)
      .attr('fill', d => z(d.key))
      .on('mousemove', function(d){
        tooltip
          .style('left', d3.event.pageX - 50 + 'px')
          .style('top', d3.event.pageY + 20 + 'px')
          .style('display', 'inline-block')
          .html(tmpl(d.values));
      })
      .on('mouseout', function(d){ tooltip.style('display', 'none');});

    enterBars
      .transition().duration(DURATION)
      .attr('y', d => y(d.sum))
      .attr('height', d => height - y(d.sum))

    bars
      .exit()
      .transition().duration(DURATION)
      .attr('height', 0)
      .attr('y', d => y(0))
      .remove()
  }

  function getOffsetRound (offset) {
    let i = roundIdx + offset

    if (i > data.length - 1) {
      return data.length - 1
    } else if (i < 0) {
      return 0
    } else {
      return i
    }
  }
}

function uniq (arr) {
  return arr.filter((item, pos, arr) => arr.indexOf(item) == pos)
}

function tmpl (arr) {
  let tmpl = ''

  arr.forEach(d => {
    tmpl += `<div class="tip__block">
      <strong>${d.name}</strong><br>
      ${d.party}<br>
      ${(d.voterate * 100).toFixed(2)}%
      </div>`
  })

  return tmpl
}
