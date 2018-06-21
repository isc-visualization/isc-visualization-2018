d3.csv("gii_ggi_2015.csv", row).then(callback);
var w = 800;
var h = 800;
var marginLeft = 30;
var marginRight = 30;
var marginTop = 30;
var marginBottom = 30;
var innerW = w - marginLeft - marginRight;
var innerH = h - marginTop - marginBottom;
var innerWSub = innerW / 2 - marginLeft - marginRight;
var innerHSub = innerH / 2 - marginTop - marginBottom;
var rankWidth = 180;
var rankHeight = 70;
var rankMargin = 10;
var rankTextSize = 20;
function callback(data) {

    // console.log(data);

    var xDomain = d3.extent(data, function (d) { return d.ggi });
    var yDomain = d3.extent(data, function (d) { return d.gii });
    var x = d3.scaleLinear()
        .domain(xDomain)
        .range([0, innerW]);
    var y = d3.scaleLinear()
        .domain(yDomain)
        .range([0, innerH]);

    var svg = d3.select('#chart').append('svg')
        .attr('width', w)
        .attr('height', h + 200);


    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
    svg.append('g')
        .attr('class', 'xAxis')
        .call(xAxis)
        .attr('transform', 'translate(' + [marginLeft, innerH + marginBottom] + ')');
    svg.append('g')
        .attr('class', 'yAxis')
        .call(yAxis)
        .attr('transform', 'translate(' + [marginBottom, marginBottom] + ')');

    xValues = data.map(function (d) { return x(d.ggi) });
    yValues = data.map(function (d) { return y(d.gii) });
    var lg = calcLinear(xValues, yValues);


    svg.append("line")
        .attr("class", "regression")
        .attr("x1", lg.ptA.x + marginLeft)
        .attr("y1", lg.ptA.y + marginBottom)
        .attr("x2", lg.ptB.x + marginLeft)
        .attr("y2", lg.ptB.y + marginBottom);


    //titles
    var title = svg.append('g')
        .attr('transform', 'translate(30, 80)')
    // title.append('rect')
    //     .attr('width', '330px')
    //     .attr('height', '50px')
    //     .attr('stroke', 'black')
    //     .attr('stroke-width', '1px')
    //     .attr('fill', 'white')
    title.append('text')
        .text('GGI-GII Scatterplot')
        .attr('transform', 'translate(15, 77)')
        .style('font-size', '35px');

    //circle group
    var circleGroup = svg.selectAll('.g').data(data).enter().append('g')
        // .attr('class', function(d){return 'circleGroup, ggirank' + d.ggi_rank})
        .attr('class', 'cirgleGroup')
        // .attr('id', function (d) { return d.ggi_rank })
        .attr('transform', function (d) { return 'translate(' + [x(d.ggi) + marginLeft + 6, y(d.gii) + marginTop - 6] + ')' });

    //draw circles
    var circle = circleGroup.append('circle')
        .attr('class', 'circle')
        // .attr('class', function (d) { return 'circle ggirank' + d.ggi_rank })
        .attr('r', '6px')
    //draw choiced nodes
    circleGroup.append('circle')
        .attr('class', function (d) { return 'circleChoiced ggirank' + d.ggi_rank })
        .attr('r', '50px')
        .attr('fill', 'none')
        .attr('stroke-width', '2px')
        .attr('stroke', 'red');

    //about regression distance
    var regDistance = d3.local();
    var regDistY = d3.local();
    var regDistArr = [];
    circleGroup.each(function (d) {
        regDistance.set(this, - y(d.gii) + lg.mb.m * x(d.ggi) + lg.mb.b);
        regDistArr.push(Math.abs(regDistance.get(this)));
    })
    // console.log(regDistArr);
    //drawing regression distance line
    circleGroup.append('line')
        .attr('class', 'regressionDistance')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', function (d) { return regDistance.get(this) })
        .attr('stroke-width', '1px')
        .attr('stroke', 'black');
    //about regression distance color;
    // console.log(d3.extent(regDistArr));
    var regDomain = [0, d3.max(regDistArr)];
    var regColorArr = ['rgb(215,25,28)', 'rgb(253,144,47)', 'rgb(255,255,191)', 'rgb(166,217,106)', 'rgb(26,150,65)'];
    var regColor = d3.scaleLinear()
        .domain(regDomain)
        .range([5, 0]);

    console.log(regColorArr);

    console.log(regDomain);
    circle.attr('fill', function (d) {
        // console.log(regColor(Math.abs(regDistance.get(this))));
        if (regColor(Math.abs(regDistance.get(this))) < 1) {
            return regColorArr[0]
        } else if (regColor(Math.abs(regDistance.get(this))) < 2) {
            return regColorArr[1]
        } else if (regColor(Math.abs(regDistance.get(this))) < 3) {
            return regColorArr[2]
        } else if (regColor(Math.abs(regDistance.get(this))) < 4) {
            return regColorArr[3]
        } else {
            return regColorArr[4]
        }
    });
    //drawing ranks information
    var ranks = svg.selectAll('.ranks').data(data).enter().append('g')
        .attr('class', 'ranks')
        .attr('id', function (d) { return 'rank' + d.ggi_rank })
        .style('fill', 'green')
        .attr('transform', function (d) { return 'translate(' + [x(d.ggi) + marginLeft + 6, y(d.gii) + marginTop - 6] + ')' });

    ranks.append('rect')
        .attr('width', rankWidth)
        .attr('height', rankHeight)
        .attr('transform', function (d) { return rankMove(0, x(d.ggi), y(d.gii)) })
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', '1px');

    ranks.append('text')
        .attr('class', 'rank-text')
        .text(function (d) { return "　Nation : " + d.country })
        .attr('transform', function (d) { return rankMove(1, x(d.ggi), y(d.gii)) })

    ranks.append('text')
        .attr('class', 'rank-text')
        .text(function (d) { return "　GGI Rank : " + d.ggi_rank })
        .attr('transform', function (d) { return rankMove(2, x(d.ggi), y(d.gii)) })

    ranks.append('text')
        .attr('class', 'rank-text')
        .text(function (d) { return "　GII Rank : " + d.gii_rank })
        .attr('transform', function (d) { return rankMove(3, x(d.ggi), y(d.gii)) })

    function rankMove(n, x, y) {
        // console.log(x, y);
        if (x < rankWidth - rankMargin) {
            return 'translate(' + [rankMargin, -rankMargin - rankHeight + rankTextSize * n] + ')'
        } else if (y < rankHeight) {
            return 'translate(' + [-rankWidth, rankMargin + rankTextSize * n] + ')'
        }
        else {
            return 'translate(' + [-rankWidth, -rankMargin - rankHeight + rankTextSize * n] + ')'
        }
    }
    svg.append('text')
        .text('GGI')
        .attr('transform', 'translate(735, 800)')
        .attr('font-size', '20px')
    svg.append('text')
        .text('GII')
        .attr('transform', 'translate(0, 54)')
        .attr('font-size', '20px')
    svg.append('text')
        .text('*GGI는 높을수록, GII는 낮을수록 성평등도가 높다.')
        .attr('transform', 'translate(780, 820)')
        .attr('font-size', '15px')
        .attr('text-anchor', 'end')
    // draw subs
    drawSubs(data, 'Economy', '#chart2');
    drawSubs(data, 'Education', '#chart3');
    drawSubs(data, 'Health', '#chart2');
    drawSubs(data, 'Political', '#chart3');

    d3.select('.Economy').append('text')
        .text('*일부 국가는 GII의 Economy Data가 없음')
        .attr('transform', 'translate(350, 375)')
        .attr('font-size', '10px')
        .attr('text-anchor', 'end')
    d3.select('.Education').append('text')
        .text('*일부 국가는 GII의 Education Data가 없음')
        .attr('transform', 'translate(350, 375)')
        .attr('font-size', '10px')
        .attr('text-anchor', 'end')
    //mouseon function
    circle.on('mouseenter', function (d) {
        console.log('mouseon');
        var rankid = '#rank' + d.ggi_rank;
        var ggirank = '.ggirank' + d.ggi_rank;
        d3.selectAll(ggirank)
            .attr('class', function (d) { return 'circleChoiced-mouseover ggirank' + d.ggi_rank })
            .transition()
            .attr('r', '10px')
            .attr('duration', 1000);
        svg.select(rankid)
            .attr('class', 'ranks-mouseover')

        console.log(regDistance.get(this));
        //draw again mouseovered nodes
        d3.select('#EconomyUse')
            .attr('xlink:href', function () { return '#Economy' + d.ggi_rank })
        d3.select('#EducationUse')
            .attr('xlink:href', function () { return '#Education' + d.ggi_rank })
        d3.select('#HealthUse')
            .attr('xlink:href', function () { return '#Health' + d.ggi_rank })
        d3.select('#PoliticalUse')
            .attr('xlink:href', function () { return '#Political' + d.ggi_rank })
    })
    circle.on('mouseleave', function (d) {
        var ggirank = '.ggirank' + d.ggi_rank;

        d3.selectAll(ggirank)
            .attr('class', function (d) { return 'circleChoiced ggirank' + d.ggi_rank })
            .attr('r', '50px')

        svg.selectAll('.ranks-mouseover')
            .attr('class', 'ranks');
    })

}
function drawSubs(data, name, id) {
    var xDomainSub;
    var yDomainSub;
    if (name == 'Economy') {
        xDomainSub = d3.extent(data, function (d) { return d.ggi_economy });
        yDomainSub = d3.extent(data, function (d) { return d.gii_economy });
    } else if (name == 'Health') {
        xDomainSub = d3.extent(data, function (d) { return d.ggi_health });
        yDomainSub = d3.extent(data, function (d) { return d.gii_health });
    } else if (name == 'Education') {
        xDomainSub = d3.extent(data, function (d) { return d.ggi_education });
        yDomainSub = d3.extent(data, function (d) { return d.gii_education });
    } else if (name == 'Political') {
        xDomainSub = d3.extent(data, function (d) { return d.ggi_political });
        yDomainSub = d3.extent(data, function (d) { return d.gii_political });
    }


    var xSub = d3.scaleLinear()
        .domain(xDomainSub)
        .range([0, innerWSub]);
    var ySub = d3.scaleLinear()
        .domain(yDomainSub)
        .range([innerHSub, 0]);
    var svgSub = d3.select(id).append('svg')
        .attr('width', w / 2)
        .attr('height', h / 2)
        .attr('class', name);
    if (name == 'Economy') {
        var xValuesSub = data.map(function (d) { return xSub(d.ggi_economy) });
        var yValuesSub = data.map(function (d) { return ySub(d.gii_economy) });
    } else if (name == 'Health') {
        var xValuesSub = data.map(function (d) { return xSub(d.ggi_health) });
        var yValuesSub = data.map(function (d) { return ySub(d.gii_health) });
    } else if (name == 'Education') {
        var xValuesSub = data.map(function (d) { return xSub(d.ggi_education) });
        var yValuesSub = data.map(function (d) { return ySub(d.gii_education) });
    } else if (name == 'Political') {
        var xValuesSub = data.map(function (d) { return xSub(d.ggi_political) });
        var yValuesSub = data.map(function (d) { return ySub(d.gii_political) });
    }

    var xAxis = d3.axisBottom(xSub);
    var yAxis = d3.axisLeft(ySub);
    svgSub.append('g')
        .attr('class', 'xAxis')
        .call(xAxis)
        .attr('transform', 'translate(' + [marginLeft, innerHSub + marginBottom] + ')');
    svgSub.append('g')
        .attr('class', 'yAxis')
        .call(yAxis)
        .attr('transform', 'translate(' + [marginBottom, marginBottom] + ')');

    var lgSub = calcLinear(xValuesSub, yValuesSub);

    svgSub.append("line")
        .attr("class", "regression")
        .attr("x1", lgSub.ptA.x + marginLeft)
        .attr("y1", lgSub.ptA.y + marginBottom)
        .attr("x2", lgSub.ptB.x + marginLeft)
        .attr("y2", lgSub.ptB.y + marginBottom);

    var circleGroupSub = svgSub.selectAll('.g').data(data).enter().append('g')
        .attr('class', 'circleGroupSub')
        .attr('id', function (d) { return name + d.ggi_rank })
        .attr('transform', function (d) {
            if (name == 'Economy') {
                return 'translate(' + [xSub(d.ggi_economy) + marginTop + 6, ySub(d.gii_economy) + marginTop - 6] + ')'
            } else if (name == 'Health') {
                return 'translate(' + [xSub(d.ggi_health) + marginTop + 6, ySub(d.gii_health) + marginTop - 6] + ')'
            } else if (name == 'Education') {
                return 'translate(' + [xSub(d.ggi_education) + marginTop + 6, ySub(d.gii_education) + marginTop - 6] + ')'
            } else if (name == 'Political') {
                return 'translate(' + [xSub(d.ggi_political) + marginTop + 6, ySub(d.gii_political) + marginTop - 6] + ')'
            }
        });

    var circleSub = circleGroupSub.append('circle')
        .attr('class', 'circleSub')
        .attr('r', '4px')

    circleGroupSub.append('circle')
        .attr('class', function (d) { return 'circleChoiced ggirank' + d.ggi_rank })
        .attr('r', '50px')
        .attr('fill', 'none')
        .attr('stroke-width', '3px')
        .attr('stroke', 'rgb(215,25,28)');
    var use = svgSub.append('use')
        .attr('id', function () {
            return name + 'Use'
        })

    var title = svgSub.append('g')
        .attr('transform', 'translate(25, 10)')
    title.append('text')
        .text(name)
        .attr('transform', 'translate(15, 37)')
        .style('font-size', '18px');

    //mouseon function
    circleSub.on('mouseenter', function (d) {
        console.log('mouseon');
        var rankid = '#rank' + d.ggi_rank;
        var ggirank = '.ggirank' + d.ggi_rank;
        d3.selectAll(ggirank)
            .attr('class', function (d) { return 'circleChoiced-mouseover ggirank' + d.ggi_rank })
            .transition()
            .attr('r', '10px')
            .attr('duration', 1000);
        d3.select(rankid)
            .attr('class', 'ranks-mouseover')

        // console.log(regDistance.get(this));
        // //draw again mouseovered nodes
        // d3.select('#EconomyUse')
        //     .attr('xlink:href', function () { return '#Economy' + d.ggi_rank })
        // d3.select('#EducationUse')
        //     .attr('xlink:href', function () { return '#Education' + d.ggi_rank })
        // d3.select('#HealthUse')
        //     .attr('xlink:href', function () { return '#Health' + d.ggi_rank })
        // d3.select('#PoliticalUse')
        //     .attr('xlink:href', function () { return '#Political' + d.ggi_rank })
    })
    circleSub.on('mouseleave', function (d) {
        var ggirank = '.ggirank' + d.ggi_rank;

        d3.selectAll(ggirank)
            .attr('class', function (d) { return 'circleChoiced ggirank' + d.ggi_rank })
            .attr('r', '50px')

        d3.selectAll('.ranks-mouseover')
            .attr('class', 'ranks');
    })
}

function row(d) {
    return {
        country: d.Country,
        gii: +d['gii'],
        ggi: +d['ggi'],
        gii_rank: +d['gii-rank'],
        ggi_rank: +d['ggi-rank'],
        gii_economy: +d['gii-economy'],
        gii_education: +d['gii-education'],
        gii_health: +d['gii-health'],
        gii_political: +d['gii-political'],
        ggi_economy: +d['ggi-economy'],
        ggi_education: +d['ggi-education'],
        ggi_health: +d['ggi-health'],
        ggi_political: +d['ggi-political']

    }
}

function calcLinear(_xValues, _yValues) {

    var n = _xValues.length;
    var minX = d3.min(_xValues);
    var minY = d3.min(_yValues);
    var maxX = d3.max(_xValues);
    var maxY = d3.max(_yValues);
    // console.log(d3.max(_yValues));
    console.log(maxX);
    // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
    // Let b equal the sum of all x-values times the sum of all y-values
    // Let c equal n times the sum of all squared x-values
    // Let d equal the squared sum of all x-values
    var sum = 0;
    var xSum = 0;
    var ySum = 0;
    var sumSq = 0;
    var x = 0;
    var y = 0;
    var zeroControll = 0;
    for (var i = 0; i < n; i++) {
        if (_yValues[i] != 310) {
            x = _xValues[i];
            y = _yValues[i];
            xSum += x;
            ySum += y;
            sumSq += x * x;
            sum += x * y;
        } else {
            zeroControll++;
            console.log('0 controlled');
        }

    }
    n -= zeroControll;
    var a = sum * n;
    var b = xSum * ySum;
    var c = sumSq * n;
    var d = xSum * xSum;

    // slope = m = (a - b) / (c - d)
    var m = (a - b) / (c - d);

    // Let e equal the sum of all y-values
    var e = ySum;

    // Let f equal the slope times the sum of all x-values
    var f = m * xSum;

    // y-intercept = b = (e - f) / n
    var b = (e - f) / n;

    // console.log(minX);
    // console.log(m * minX + b);
    // console.log((minY - b) / m);
    // console.log(minY);
    // console.log(m);
    if ((minY - b) / m > maxX) {
        minY = maxX * m + b;
    }
    if (m * minX + b > maxY) {
        minX = (maxY - b) / m;
    }
    // var x1 = minX;
    // var y1 = m*minX+b;
    // var x2 = (minY-b)/m
    // var y2 = minY;
    // if(y1 > 316){
    //     y1 = 310;
    //     x1 = (y1 -b)/m;
    // }
    return {
        ptA: {
            x: minX,
            y: m * minX + b
        },
        ptB: {
            y: minY,
            x: (minY - b) / m
        },
        mb: {
            m: m,
            b: b
        }
        // ptA: {
        //     x: x1,
        //     y: x2
        // },
        // ptB: {
        //     y: y2,
        //     x: x2
        // },
        // mb: {
        //     m: m,
        //     b: b
        // }

    }

}