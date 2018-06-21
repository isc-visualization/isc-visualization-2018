$('.tochoice').on('click', function(){
    $(".prologue").fadeOut("slow", function(){
        console.log('prologue faded out')
        $(".choice").fadeIn("slow");
        render();
    })
})

function render(){
d3.json('./data.json').then(function(data) {
    //constant
    var t = d3.transition().duration(1000);
    var r = 5;

    // 전체 svg 영역
    var w = 500, h = 500;
    var svg = d3.select('div.graph').append('svg')
        .attr('width', w).attr('height', h)
    
    // ggi - tfr plot 영역
    var pltM =  {top: 10, right:10, bottom:20, left:20}
    var pltW = w - pltM.left - pltM.right
        , pltH = h - pltM.top - pltM.bottom;
    var pltXrange = [0, pltW], pltYrange = [pltH, 0]
    var plt = svg.append('g').attr('class', 'plt')
        .attr('transform', function(d){return 'translate(' + [pltM.left, pltM.top] + ')';})

    // gdp histogram 영역
    var ctrM = {top: 110, bottom:150}
    var ctrH = pltH - ctrM.top - ctrM.bottom

    // gdp domain and X scale
    gdpdata = data.map(function(d){return d.gdp})
    gdpDomain = d3.extent(gdpdata)
    var gdpX = d3.scaleLog()        // log scale instead of linear scale
        .domain(gdpDomain).nice().range(pltXrange);
    var gdpXaxis = d3.axisBottom(gdpX).tickSizeOuter(0);
    
    // gdp color scale
    var binDivide = [d3.min(gdpdata), 50000, 400000, d3.max(gdpdata)]
    var color = d3.scaleLog()
        .domain(binDivide)
        .range(['#a6bddb','#67a9cf','#1c9099','#016c59'])
    
    // bin group 설정하기 - 총 네 개의 영역을 quartile을 기준으로 구분
    var binGroupData = [[binDivide[0],binDivide[1]],[binDivide[1],binDivide[2]],[binDivide[2],binDivide[3]]]
    var bingroup = plt.selectAll('.bingroup')
        .data(binGroupData)
        .enter().append('rect')
        .attr('class', 'bingroup')
        .attr('x', function(d){return gdpX(d[0])})
        .attr('width', function(d){
            return gdpX(d[1])-gdpX(d[0])
        })
        .attr('y', ctrM.top)
        .attr('height', ctrH + r)
        .attr('fill', function(d){return color(d[1])})
        .attr('opacity', 0)

    // gdp histogram 빈 계산하기
    var bins = d3.histogram()
        .domain(gdpX.domain()).thresholds(gdpX.ticks(40));
    var bindata = bins(gdpdata);

    // circle이 들어갈 bin 영역 그리기
    var bin = plt.selectAll(".bin")
        .data(bindata)
        .enter().append("g")
        .attr('class', 'bin')
        .attr('transform', function(d){return 'translate(' + [gdpX(d.x0) + 1, ctrM.top + ctrH ] + ')'})
    
    // 각 bin에 연결될 data와 scale을 로컬 변수로 설정하기
    var binElement = d3.local();
    var binScale = d3.local();
    var binX0X1 = d3.local();
    bin.each(function(d){
        var element = data.filter(function(c){return (c.gdp >= d.x0)&&(c.gdp < d.x1)})
            .sort(d3.ascending, function(d){return d.gdp})
        binElement.set(this, element);
        
        var scale = {};
        d.sort(d3.ascending).forEach(function(d, i){
            scale[d] = -(i*r*2);
        })
        binScale.set(this, scale);

        var xs = [d.x0, d.x1];
        binX0X1.set(this, xs);
    })

    // render circles in each bin
    var point = bin.selectAll(".point")
        .data(function(d){return binElement.get(this)})
        .enter().append('circle')
        .classed('point', true)
        .transition(t)
        .attr('fill', function(d){return color(d.gdp)})
        .attr('cx', 0)
        .attr('cy', function(d){return binScale.get(this)[d.gdp]})
        .attr('r', r)
    
    // bingroup hover
    bingroup.on("mouseenter", function(d){
        d3.select(this).attr('opacity', 1)
        d3.selectAll('.point').filter(function(p){return (p.gdp >= d[0])&&(p.gdp < d[1])})
            .attr('opacity', '1')
            .attr('fill', 'white')
    }).on("mouseleave", function(){
        d3.select(this).attr('opacity', 0)
        d3.selectAll('.point')
            .attr('opacity', '0.7')
            .attr('fill', function(d){return color(d.gdp)})
    })
    
    // ggi & tfr scale
    var ggiDomain = [0.45 , 1]
    var ggiX = d3.scaleLinear().domain(ggiDomain).range(pltXrange)
    var tfrDomain = [0, Math.ceil(d3.max(data, function(d){return d.tfr}))]
    var tfrY = d3.scaleLinear().domain(tfrDomain).range(pltYrange)
    
    // ggi & tfr axis
    var ggiAxis = d3.axisBottom(ggiX).ticks(5).tickSize(3)
    ggiAxisG = plt.append('g').attr('class', 'plt axis')
        .attr('transform', 'translate('+ [0, pltH]+ ')').call(ggiAxis)
        .attr('opacity', '0')
    ggiAxisG.select('.domain').remove()
    var tfrAxis = d3.axisRight(tfrY).ticks(5).tickSize(pltW)
    var tfrAxisG = plt.append('g').attr('class', 'plt axis').call(tfrAxis)
        .attr('opacity', '0')
    tfrAxisG.select(".domain").remove();
    tfrAxisG.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
    tfrAxisG.selectAll(".tick text").attr("x", 4).attr("dy", -4);

    /////////////// bingroup clicked: to each bin group branch /////////////////
    bingroup.on("click", function(d){
        var binID
        if(d[0] == d3.min(gdpdata)){
            binID = 'group0'
        }
        else{
            binID = 'group'+ d[0]
        }
        console.log(binID);
        $('.choice').fadeOut("slow", function(){
            $('#'+binID).fadeIn("slow");
        })


        var t = d3.transition().duration(1000);

        // mouse leave action
        d3.select(this).attr('opacity', '0')
        d3.selectAll('.point')
            .attr('opacity', '0.7')
            .attr('fill', function(d){return color(d.gdp)})

        // remove unselected points and bingroup
        d3.selectAll('.point')
            .filter(function(p){return (p.gdp < d[0])||(p.gdp >= d[1])}).remove();
        d3.selectAll('.bingroup').remove()

        // update selected points
        d3.selectAll('.point')
            .filter(function(p){return (p.gdp >= d[0])&&(p.gdp < d[1])})
            .transition(t)
            .attr('cx', function(d){return ggiX(d.ggi) - gdpX(binX0X1.get(this)[0]) - 1})
            .attr('cy', function(d){ return tfrY(d.tfr) - binScale.get(this)[d.gdp] - (ctrM.top + ctrH) })
        
        // show axis
        d3.selectAll('.axis')
            .transition(t)
            .attr('opacity', '1')
    })

    
})  
}
