/***svg variables*********************************/

var w = 1280, h = 800;
var margin = {top:170, right:0, bottom: 100, left: 100};
var innerW = w - margin.right - margin.left,
innerH = h - margin.top - margin.bottom;

var brush = d3.brushY(); //브러시 변수 추가

var svg = d3.select("div.plot1").append('svg')
  .attr('width', w)
  .attr('height', h)
  .append('g')
  .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

var title1 = svg.append('g')
    .attr("transform", "translate(" + margin.left + "," + 0 + ")");


var title2 = svg.append('g')
    .attr("transform", "translate(" + innerW*0.47  + "," + 0 + ")");
    

var g = svg.append('g')
    .attr("transform", "translate(" + 6.7*innerW/9 + "," + innerH*1.1/4 + ")");

var gFilter= svg.append('g')
    .attr("transform", "translate(" + 0 + innerW*0.05 +","+ innerH*1.05 + ")");

var gTooltip = svg.append('g')
    .attr("transform", "translate(" + 0 + innerW/2 +","+ -10 + ")");
    
var scene1 = d3.select('#scene1')

var scene2 = d3.select('#scene2')

/***filter variables*********************************/

var cnt = 0;
var filtered = [];
var WEcnt = 0;
var NAcnt = 0;
var MENAcnt = 0;
var LACcnt = 0;
var EECAcnt = 0;
var EAPcnt = 0;
var oecd1 = 0;
var oecd2 = 0;
var oecd3 = 0;
var oecd4 = 0;

/***chart1 variables*********************************/

var xAxis = d3.axisBottom().tickSize(0).tickPadding(-30); 
var yAxis = d3.axisLeft().tickSize(0);

var x = d3.scalePoint().range([70, 3.5*innerW/7]).padding(0.04); 
var y = {}; //y 스케일이 여러개이므로 오브젝트로 나중에 추가

var line  = d3.line()
  .curve(d3.curveCardinal.tension(0.55))
  .x(function(d){return d.x}) //값을 스케일로 미리 변환해서 넣어둘 예정 따라서 line 생성기에서 스케일을 사용할 필요 없음
  .y(function(d){return d.y;})

/***chart2 variables*********************************/

var innerRadius = 50,
    outerRadius = 150;

var fullCircle = 2 * Math.PI;

var theta = d3.scaleLinear()
      .range([0, fullCircle]);
  
var r = d3.scaleRadial()
        .range([innerRadius, outerRadius]);
    
var radialLine = d3.lineRadial()
  .curve(d3.curveCardinal.tension(0))
  .angle(function(d) { return theta(d.axis); })
  .radius(function(d) { return r(d.value); });

/***nation & color variables*********************************/

var nationAxis = d3.axisLeft().tickSize(0);

var nation = d3.scalePoint().range([innerH, 0]).padding(0.04);

var c = d3.scaleOrdinal().range(d3.schemeRdBu[10]);


/***data function*********************************/

d3.csv('./final.csv', row).then(callback);

function row(d) { //행 처리
	for(var k in d) {
		if(d.hasOwnProperty(k) && k !== 'Region' && k!== 'Nation' && k!== 'nationKey') d[k] = + d[k];
	}
	return d;
}

function series(d) { //개별 아이템마다 배열로 아이템을 변환
  return x.domain().map(function(h) { //축 순서대로 데이터에 접근
    return {x:x(h), y:y[h](d[h])};
  });
}

/***callback function1*********************************/

function callback(data) {

/***title ***/
  
  title1.append('text')
  .attr('text-anchor', 'middle')
  .attr('x', '220px')
  .attr('y','-60px')
  .attr('fill', '#555')
  .attr('font-style', 'Italic')
  .attr('font-size', '14px')
  .text('<예상 기대 월소득과 상세 지표들 과의 관계>');


  title1.append('text')
  .attr('text-anchor', 'middle')
  .attr('x', '780px')
  .attr('y','-60px')
  .attr('fill', '#555')
  .attr('font-style', 'Italic')
  .attr('font-size', '14px')
  .text('<졸업 학위 남녀 비율>');

  scene1.
  style('display','none');

  scene2.
  style('display','none');



/*data*/

  var regionCode = d3.nest()
    .key(function(d) { 
      return d.Region; 
    }).key(function(d) {
      return d.Nation;
    }).key(function(d) {
      return d.nationKey;
    }).key(function(d) {
      return d.color;
    }).
    entries(data);


/***chart1 data*********************************/

	var headers = data.columns.slice(1,6);
	headers = headers.map(function(h) {
		var min = d3.min(data, function(d){return d[h];});
    var max = d3.max(data, function(d){return d[h];});
		return {name:h, domain:[min -0.03, max + 0.03]};
	});

  headers.forEach(function(h) {
      y[h.name] = d3.scaleLinear().domain(h.domain).range([innerH, 0]); 
  });

	x.domain(headers.map(function(d){return d.name;}));
  c.domain(d3.set(data, function(d){return d.Region;}).values());
  nation.domain(d3.set(data, function(d){return d.Nation;}).values());

/***chart1 plot*********************************/

	var parcoods = svg.selectAll('.series')
	 .data(data)
	 .enter().append('g')
	 .attr('class', 'series')

  parcoods.style('stroke', function(d) {
    return color(d.color);
    })
	  .selectAll('path')
  	.data(function(d){
      //console.log(d);
      return [series(d)];}) //데이터를 series로 변환한 다음 배열에 다시 넣어서 통째로 path에 전달
    .enter().append('path')
  	.attr('d', function(d) {
      return line(d);
    })
    .attr('stroke-width', 1.7)
    

/***chart1 axis*********************************/

  svg.selectAll('.y.axis')
  	.data(headers, function(d){
      return d.name;})
  	.enter().append('g')
  	.attr('class', 'y axis')
    .attr('translate', '10px')
  	.attr('transform', function(d) {return 'translate(' + [x(d.name), 0] + ')';}) //축을 x 스케일을 이용해 이동
  	.each(function(d) {
    	yAxis.scale(y[d.name]); // 축마다 스케일을 가져와서 
    	d3.select(this).call(yAxis); //축을 그려줌
  	})
    .attr('opacity', 0.5);

	xAxis.scale(x);
  
  nationAxis.scale(nation);

  svg.append('g')
    .attr('class', 'x axis')
    .call(xAxis)
  
/***nation axis*********************************/

  svg.append('g')
    .attr('class', 'nation axis')
    .attr('transform', 'translate('+ [20, -5] + ')')
    .call(nationAxis);

/***chart2 data*********************************/
  
  var AxesData = data.map(function(d) {
    return {
     'axes' : [
        {axis : 0, value: d.agri},
        {axis : 1, value: d.art},
        {axis : 2, value: d.edu},
        {axis : 3, value: d.eng},
        {axis : 4, value: d.health},
        {axis : 5, value: d.it},
        {axis : 6, value: d.law},
        {axis : 7, value: d.math},
        {axis : 8, value: d.service},
        {axis : 9, value: d.sosci},
        {axis : 10, value: d.agri}
      ]}      
  });

  var axisName = {value : ['정보통신기술', '경영/행정/법', '자연과학/수리통계', '서비스', '사회과학/언론', '농/수산업', '예술/인류학', '교육', '공학/건설', '건강/복지' ]};

  function radialAxis(d) {
    var axis=[];
    for(var i = 0; i <36; i++) {
      axis[i] = Object.values(d[i]);
    }
    return axis;
  }
  
  var realAxis = radialAxis(AxesData);

  //console.log(data);
  console.log(axisName.value);//.axes["0"].axis);

  theta.domain([0,10]);
  r.domain([10,90]);
      
/***chart2 plot*********************************/

  g.selectAll(".series2")
    .data(AxesData)
    .enter().append('g')
    .attr('class', 'series2')
    .append('path')
    .attr('class', 'path2')
    .attr('d',function(d) {
      return radialLine(d.axes);
    })
    .attr('stroke-width', 1.3)
    .data(data)
    .style('stroke' , function(d) {
      return color(d.color);
    })

/***chart2 Axis*********************************/

  var yAxis2 = g.selectAll('.y.axis')

  var yTick = yAxis2
  .data(r.ticks(10))
  .enter().append("g")
  .attr("text-anchor", "middle")
  .attr('class', 'y axis');

  yTick.append("circle")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("opacity", 0.2)
      .attr("r", r);

  yAxis2.append("circle")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("opacity", 0.2)
      .attr("r", function() { return r(r.domain()[0])});

  yTick.append("text")
      .attr("y", function(d) { return -r(d); })
      .attr("dy", "0.35em")
      .attr("font-size", '9.5px')
      .attr("opacity",0.5)
      .attr('font-style', 'italic')
      .text(function(d) { return d+"명"; });


  var xAxis2 = g.selectAll('.theta.axis')

  var xTick = xAxis2
    .data(theta.ticks(10))
    .enter().append("g")
      .attr("text-anchor", "middle")
      .attr('class', 'theta axis')
      .attr("transform", function(d) {
        return "rotate(" + ((theta(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
      });

  xTick.append("line")
    .attr("x2", 100)
    .attr("stroke", "#111")
    .attr('opacity', 0.2);

  xTick
    .append("text")
    .attr("transform", function(d) { 
    var angle = theta(d);
    return ((angle < Math.PI / 2) || (angle > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,220)" : "rotate(-90)translate(0, -220)"; })
    .text(function(d) { 
      return axisName.value[d]
    })
    .style("font-size", 10)
    .attr("opacity", 0.6)
  
  var title = g.append("g")
      .attr("class", "title")
      .append("text")
      .attr("dy", "-0.2em")
      .attr("text-anchor", "middle")
      .attr('font-size', '12px')
      .text("대학 졸업 학위")
  
  var subtitle = g.append("text")
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .attr('font-size', '11px')
      .attr("opacity", 0.6)
      .text("(여/남 비율)");     

/***chart1,2 연결*********************************/

  var path1 = svg.selectAll('g .series path');
  var path2 = svg.selectAll('g .series2 path');
  var tick = svg.selectAll(".nation.axis .tick text");


  path1.data(data)
  .attr('class', function(d){
    return d.Region;
  })
  .attr('id', function(d){
    return d.nationKey;
  })

  path2.data(data)
  .attr('class', function(d){
    return d.Region ;
  })
  .attr('id', function(d){
    return d.nationKey;
  }); 

  tick.data(data)
  .attr('class', function(d){
    return d.Region;
  })
  .attr('id', function(d){
    return d.nationKey;
  })
  .attr('fill', function(d){
    return color(d.color);
  })
  .attr('opacity', 1);


/***tooltip append********/

  gTooltip
    .attr('class', 'tooltip')
    .selectAll('.tick')
    .data(data)
    .enter().append('g')
    .attr('class', 'tick')
    .append('text')
    .attr('x',function(d) {
      return 0;
    })
    .attr('y', function(d) {
      if(d.Nation == 'Latvia' || d.Nation == 'Canada'|| d.Nation == 'Hungary' 
        ||d.Nation == 'Estonia' || d.Nation == 'Slovak Republic' 
        || d.Nation == 'Ireland' || d.Nation == 'Iceland' ) {
        return series(d)[4].y + 6;
      } else if (d.Nation == 'Belgium' || d.Nation == 'Spain'|| d.Nation == 'Italy' ) {
        return series(d)[4].y - 6;
      } else if (d.Nation == 'Australia' || d.Nation == 'Czech Republic'
        || d.Nation == 'Chile' ) {
        return series(d)[4].y + 12;
      }  else if (d.Nation == 'Japan' ) {
        return series(d)[4].y - 12;
      }
        else {
        return series(d)[4].y ;
      }
    })
    .attr('dy','1em')
    .attr('font-size', '9px')
    .attr('font-style', 'italic')
    .attr('fill',function(d){
      return color(d.color);
    })
    .text(function(d) {
      if(d.Nation != 'Average') return d.Nation;
     })
    .attr('opacity', 0.7)
   
  
    var tooltip = svg.selectAll('.tooltip .tick text');

    tooltip.attr('class', function(d){
      return d.Region;
    })
    .attr('id', function(d){
      return d.nationKey;
    });

    svg.selectAll('g.tooltip .tick') 
      .on("click", function(d){
      console.log(d);
      filter(d.Nation, path1, path2, tick, tooltip);
    })
     .on('mouseover', function(d){
      d3.select(this)
        .attr('opacity', 0.2);
      info(d);
    })
    .on('mouseout', function() {
      d3.select(this)
      .attr('opacity', 0.7);
      svg.selectAll('.sceneText tspan')
      .attr('display', 'none');
      svg.selectAll('.ranking tspan')
      .attr('display', 'none');
      svg.selectAll('.name tspan')
      .attr('display', 'none');
    });

    function info(d) {
      titleTooltip
      .append('svg:text')
      .attr('class','sceneText')
      .attr('display', 'visible')
      .attr('x', 0)
      .attr('y', 0)
      .append('svg:tspan')
      .attr('x', innerW*0.2+20)
      .attr('y', innerH*0.93)
      .text('- 현재 월소득'+ ' : ' + d["현재 월소득"] + '만원 / 남성 100만원' )
      .append('svg:tspan')
      .attr('x', innerW*0.2+20)
      .attr('y', innerH*0.97)
      .text('- 노동 참여'+ ' : ' + d["노동 참여"] + '명 / 남성 100명' )
      .append('svg:tspan')
      .attr('x', innerW*0.2+20)
      .attr('y', innerH*1.01)
      .text('- 무임금 노동'+ ' : ' + d["무임금 노동"] + '분 / 남성 100분' )
      .append('svg:tspan')
      .attr('x', innerW*0.2+20)
      .attr('y', innerH*1.05)
      .text('- 임금 노동'+ ' : ' + d["노동 참여"] + '분 / 남성 100분' )
      .append('svg:tspan')
      .attr('x', innerW*0.2+20)
      .attr('y', innerH*1.09)
      .text('- 예상 기대 월소득'+ ' : ' + d["예상 기대 월소득"] + '만원 / 남성 100만원' );

      titleTooltip
      .append('svg:text')
      .attr('class','ranking')
      .attr('display', 'visible')
      .attr('x', 0)
      .attr('y', 0)
      .append('svg:tspan')
      .attr('x', innerW*0.2+20)
      .attr('y', innerH*0.86)
      .text( '('+d.ranking+'위 / OECD 36개국)')
      .attr('fill', color(d.color));

      titleTooltip
      .append('svg:text')
      .attr('class','name')
      .attr('display', 'visible')
      .attr('x', 0)
      .attr('y', 0)
      .append('svg:tspan')
      .attr('x', innerW*0.2+20)
      .attr('y', innerH*0.82)
      .text(d.Nation)
      .attr('fill', color(d.color));
    }


/***filter append****************************************/
  
   gFilter.append('rect')
    .attr("x",'-95px')             
    .attr("y",'9px') 
    .attr('rx',10)
    .attr('ry',10)
    .attr('width',60)
    .attr('height',20)
    .attr('stroke','#ddd')
    .attr('fill', '#ddd');

  gFilter
  .attr('class', 'filter')
  .append("text")
    .attr("x",'-87px')             
    .attr("y",'23px') 
  .attr("class", "overall")
  .on("click", function(){
    filter('Overall', path1, path2, tick, tooltip)
    svg.selectAll('.filter text')
    .attr('fill', '#000')
    NAcnt = 0;
    WEcnt = 0;
    EECAcnt = 0;
    NAcnt = 0;
    LACcnt = 0;
    EAPcnt = 0;
    filtered = [];
  })
  .text("Overall")
  .on("mouseover", function() {
    d3.select(this).attr('opacity', 0.5)
  })
  .on("mouseout", function() {
    d3.select(this).attr('opacity', 1)
  });

   gFilter.append('rect')
    .attr("x",'350px')             
    .attr("y",'22px') 
    .attr('rx',10)
    .attr('ry',10)
    .attr('width',100)
    .attr('height',20)
    .attr('stroke','#ddd')
    .attr('fill', '#ddd');

  gFilter.append("text")
    .attr("x",'358px')             
    .attr("y",'35px') 
    .attr("class", "NA")
    .text("North America")
    .attr('font-size', '12px')
    .on("click", function() {
      filter('NA', path1, path2, tick, tooltip);
      if (NAcnt == 0) {
        NAcnt = NAcnt +1;
        d3.select(this).attr('fill', '#ff0d00');
    } else {
        NAcnt = NAcnt -1;
        d3.select(this).attr('fill', '#000');
      }
    })
    .on("mouseover", function() {
      d3.select(this).attr('opacity', 0.5);
    })
    .on("mouseout", function() {
      d3.select(this).attr('opacity', 1.0);
    });


   gFilter.append('rect')
    .attr("x",'0px')             
    .attr("y",'-5px') 
    .attr('rx',10)
    .attr('ry',10)
    .attr('width',110)
    .attr('height',20)
    .attr('stroke','#ddd')
    .attr('fill', '#ddd');

  gFilter.append("text")
    .attr("x",'8px')             
    .attr("y",'8px') 
    .attr("class", "WE")
    .text("Western Europe")
    .attr('font-size', '12px')
    .on("click", function() {
      filter('WE', path1, path2, tick, tooltip);
      if (WEcnt == 0) {
        WEcnt = WEcnt +1;
        d3.select(this).attr('fill', '#ff0d00');
    } else {
        WEcnt = WEcnt -1;
        d3.select(this).attr('fill', '#000');
      }
    })
    .on("mouseover", function() {
      d3.select(this).attr('opacity', 0.5);
    })
    .on("mouseout", function() {
      d3.select(this).attr('opacity', 1.0);
    });

   gFilter.append('rect')
    .attr("x",'174px')             
    .attr("y",'-5px') 
    .attr('rx',10)
    .attr('ry',10)
    .attr('width',168)
    .attr('height',20)
    .attr('stroke','#ddd')
    .attr('fill', '#ddd');


   gFilter.append("text")
    .attr("x",'182px')             
    .attr("y",'8px')   
    .attr("class", "MENA")
    .text("Middle East & North Africa")
    .attr('font-size', '12px')
    .on("click", function() {
      filter('MENA', path1, path2, tick, tooltip);
      if (MENAcnt == 0) {
        MENAcnt = MENAcnt +1;
        d3.select(this).attr('fill', '#ff0d00');
    } else {
        MENAcnt = MENAcnt -1;
        d3.select(this).attr('fill', '#000');
      }
    })
    .on("mouseover", function() {
      d3.select(this).attr('opacity', 0.5);
    })
    .on("mouseout", function() {
      d3.select(this).attr('opacity', 1.0);
    });

   gFilter.append('rect')
    .attr("x",'0px')             
    .attr("y",'22px') 
    .attr('rx',10)
    .attr('ry',10)
    .attr('width',166)
    .attr('height',20)
    .attr('stroke','#ddd')
    .attr('fill', '#ddd');

  gFilter.append("text")
     .attr("x",'8px')             
    .attr("y",'35px')  
    .attr("class", "EECA")
    .text("East Europe & Central Asia")
    .attr('font-size', '12px')
    .on("click", function() {
      filter('EECA', path1, path2, tick, tooltip);
      if (EECAcnt == 0) {
        EECAcnt = EECAcnt +1;
        d3.select(this).attr('fill', '#ff0d00');
    } else {
        EECAcnt = EECAcnt -1;
        d3.select(this).attr('fill', '#000');
      }
    })
    .on("mouseover", function() {
      d3.select(this).attr('opacity', 0.5);
    })
    .on("mouseout", function() {
      d3.select(this).attr('opacity', 1.0);
    });


   gFilter.append('rect')
    .attr("x",'174px')             
    .attr("y",'22px') 
    .attr('rx',10)
    .attr('ry',10)
    .attr('width',110)
    .attr('height',20)
    .attr('stroke','#ddd')
    .attr('fill', '#ddd');

   gFilter.append("text")
    .attr("x",'182px')             
    .attr("y",'35px') 
    .attr("class", "EAP")
    .text("East Asia Pacific")
    .attr('font-size', '12px')
    .on("click", function() {
      filter('EAP', path1, path2, tick, tooltip);
      if (EAPcnt == 0) {
        EAPcnt = EAPcnt +1;
        d3.select(this).attr('fill', '#ff0d00');
    } else {
        EAPcnt = EAPcnt -1;
        d3.select(this).attr('fill', '#000');
      }
    })
    .on("mouseover", function() {
      d3.select(this).attr('opacity', 0.5);
    })
    .on("mouseout", function() {
      d3.select(this).attr('opacity', 1.0);
    });

   gFilter.append('rect')
    .attr("x",'350px')             
    .attr("y",'-5px') 
    .attr('rx',10)
    .attr('ry',10)
    .attr('width',200)
    .attr('height',20)
    .attr('stroke','#ddd')
    .attr('fill', '#ddd');

   gFilter.append("text")
    .attr("x",'357px')             
    .attr("y",'8px') 
    .attr("class", "LAC")
    .text("Latin America and the Caribbean")
    .attr('font-size', '12px')
    .on("click", function() {
      filter('LAC', path1, path2, tick, tooltip);
      if (LACcnt == 0) {
        LACcnt = LACcnt +1;
        d3.select(this).attr('fill', '#ff0d00');
    } else {
        LACcnt = LACcnt -1;
        d3.select(this).attr('fill', '#000');
      }
    })
    .on("mouseover", function() {
      d3.select(this).attr('opacity', 0.5);
    })
    .on("mouseout", function() {
      d3.select(this).attr('opacity', 1.0);
    });


/***Click Function*********************************/

  svg.selectAll(".nation.axis .tick")
    .on("mouseover", function() {
    d3.select(this).attr('opacity', 0.3)
    })
    .on("mouseout", function() {
      d3.select(this).attr('opacity', 1);
      svg.selectAll('.sceneText text')
      .attr('opacity', 1);
    })
    .on("click", function(d) {
      filter(d, path1, path2, tick, tooltip);
    });

/****Chart1 Tooltip*******************************/

var titleTooltip = svg.append('g')
    .attr('class','titleTooltip')
    .attr("transform", "translate(" + 0 + innerW*1.55/4 +","+ -60 + ")");

var titleRect = titleTooltip
    .append('rect')
    .attr('y', '-15px')
    .attr('width', '280px')
    .attr('height', '400px')
    .attr('rx', 30)
    .attr('ry', 30)
    .attr('fill', '#222')
    .attr('opacity', 0.8)
    .attr('display','none');


var titleText = titleTooltip
  .append('svg:text')
  .attr('class','titleText')
  .attr('display', 'none')
  .attr('x', 0)
  .attr('y', 0)
  .append('svg:tspan')
  .attr('x', 10)
  .attr('dy', '1.3em')
  .text('*모든 값은 해당 지표의 남성 대비 여성의 비율을 의미.')
  .append('svg:tspan')
  .attr('x', 10)
  .attr('dy', '1.3em')
  .text('*예상 기대 월소득의 평균을 기준으로 색 범위 나누었음.')
  
  .append('svg:tspan')
  .attr('x', 10)
  .attr('dy', '2em')
  .text('1. 현재 월소득 : ')
  .append('svg:tspan')
  .attr('x', 22)
  .attr('dy', '1.3em')
  .text('같은 직종의 남성이 100만원을 번다고 했을 때,')
  .append('svg:tspan')
  .attr('x', 22)
  .attr('dy', '1.3em')
  .text('여성이 버는 돈의 액수')
 
  .append('svg:tspan')
  .attr('x', 10)
  .attr('dy', '2em')
  .text('2. 노동 참여 : ')
  .append('svg:tspan')
  .attr('x', 22)
  .attr('dy', '1.3em')
  .text('노동 시장에 남성이 100명이 있다고 할 때,')
  .append('svg:tspan')
  .attr('x', 22)
  .attr('dy', '1.3em')
  .text('얼마나 많은 여성이 있는지')

  .append('svg:tspan')
  .attr('x', 10)
  .attr('dy', '2em')
  .text('3. 무임금 노동 : ')
  .append('svg:tspan')
  .attr('x', 22)
  .attr('dy', '1.3em')
  .text('남성의 무임금 노동 시간이 100분이라고 할 때,')
  .append('svg:tspan')
  .attr('x', 22)
  .attr('dy', '1.3em')
  .text('여성의 무임금 노동 시간')

  .append('svg:tspan')
  .attr('x', 10)
  .attr('dy', '2em')
  .text('4. 임금 노동 : ')
  .append('svg:tspan')
  .attr('x', 22)
  .attr('dy', '1.3em')
  .text('남성의 임금 노동 시간이 100분이라고 할 때,')
  .append('svg:tspan')
  .attr('x', 22)
  .attr('dy', '1.3em')
  .text('여성의 임금 노동 시간')

  .append('svg:tspan')
  .attr('x', 22)
  .attr('dy', '1.3em')
  .text('* 참고 *')
  .append('svg:tspan')
  .attr('x', 24)
  .attr('dy', '1.3em')
  .text('남성, 여성의 일일 합산 노동 시간은 거의 동일하다. ')
  .append('svg:tspan')
  .attr('x', 24)
  .attr('dy', '1.3em')
  .text('예를 들어, 남녀가 하루에 500분을 일 한다고 했을 때, ')
  .append('svg:tspan')
  .attr('x', 24)
  .attr('dy', '1.3em')
  .text('여성: 무임금 노동 300분/임금 노동 200분')
  .append('svg:tspan')
  .attr('x', 24)
  .attr('dy', '1.3em')
  .text('남성: 무임금 노동 100분/임금 노동 400분')
  .append('svg:tspan')
  .attr('x', 24)
  .attr('dy', '1.3em')
  .text('--> 무임금 노동 지수 300, 임금 노동 지수 50')

  .append('svg:tspan')
  .attr('x', 10)
  .attr('dy', '2em')
  .text('5. 예상 기대 월소득 : ')
  .append('svg:tspan')
  .attr('x', 22)
  .attr('dy', '1.3em')
  .text('남성의 예상 기대 월소득이 100만원이라고 할 때,')
  .append('svg:tspan')
  .attr('x', 22)
  .attr('dy', '1.3em')
  .text('여성의 예상 기대 월소득');


title1.append('circle')
  .attr("cx", '355px')
  .attr('cy', '-65px')
  .attr('r', '8px')
  .attr('stroke', '#ccc')
  .attr('fill' ,'#aaa')
  .on('mouseover', function(d) {
    var info = d3.select(this);
    info.attr('fill', '#000');  
    titleRect.attr('display','visible');

    var tip = svg.selectAll('.titleText');
    tip.attr('display','visible');
  })
  .on('mouseout', function(d) {
    var info = d3.select(this);
    info.attr('fill', '#aaa');
    titleRect.attr('display','none');

    var tip = svg.selectAll('.titleText');
    tip.attr('display','none');
  });

title1.append('text')
  .attr('text-anchor', 'middle')
  .attr('x', '354px')
  .attr('y','-61px')
  .attr('fill', '#ddd')
  .attr('font-style', 'Italic')
  .attr('font-size', '12px')
  .text('!');

/****Chart2 Tooltip***********************************************************/

var titleRect2 = titleTooltip
    .append('rect')
    .attr('x', '500px')
    .attr('y', '-15px')
    .attr('width', '190px')
    .attr('height', '170px')
    .attr('rx', 30)
    .attr('ry', 30)
    .attr('fill', '#222')
    .attr('opacity', 0.8)
    .attr('display','none');

var titleText2 = titleTooltip
  .append('svg:text')
  .attr('class','titleText2')
  .attr('display', 'none')
  .attr('x', 0)
  .attr('y', 0)
  .append('svg:tspan')
  .attr('x', 510)
  .attr('dy', '1.3em')
  .text('* 모든 값은 해당 분야에서의')
  .append('svg:tspan')
  .append('svg:tspan')
  .attr('x', 550)
  .attr('dy', '1.3em')
  .text('전체 대비 여성 비율을 의미.')
  .append('svg:tspan')
  .attr('x', 510)
  .attr('dy', '2em')
  .text('10개의 학위 분야에 대하여,')
  .append('svg:tspan')
  .attr('x', 510)
  .attr('dy', '1.3em')
  .text('각 분야마다 100명의 졸업생이 있을 때, ')
  .append('svg:tspan')
  .attr('x', 510)
  .attr('dy', '1.3em')
  .text('해당 분야 여성 졸업생의 수.')
  .append('svg:tspan')
  .attr('x', 510)
  .attr('dy', '2em')
  .text('예를 들어, 공학/건설 지표가 10이면')
  .append('svg:tspan')
  .append('svg:tspan')
  .attr('x', 510)
  .attr('dy', '1.3em')
  .text('해당 분야 졸업생이 평균적으로')
  .append('svg:tspan')
  .attr('x', 510)
  .attr('dy', '1.3em')
  .text(' 남성 90명, 여성 10명이 있다는 의미')
  .append('svg:tspan');

 
title2.append('circle')
  .attr("cx", '400px')
  .attr('cy', '-65px')
  .attr('r', '8px')
  .attr('stroke', '#ccc')
  .attr('fill' ,'#aaa')
  .on('mouseover', function(d) {
    var info = d3.select(this);
    info.attr('fill', '#000');  
    titleRect2.attr('display','visible');

    var tip = svg.selectAll('.titleText2');
    tip.attr('display','visible');
  })
  .on('mouseout', function(d) {
    var info = d3.select(this);
    info.attr('fill', '#aaa');
    titleRect2.attr('display','none');

    var tip = svg.selectAll('.titleText2');
    tip.attr('display','none');
  });

title2.append('text')
  .attr('text-anchor', 'middle')
  .attr('x', '399px')
  .attr('y','-61px')
  .attr('fill', '#ddd')
  .attr('font-style', 'Italic')
  .attr('font-size', '12px')
  .text('!');

/***Scene 내용*********************************/

var scene = titleTooltip
    .append('rect')
    .attr('x', innerW*0.2)
    .attr('y', innerH*0.75)
    .attr('width', '370px')
    .attr('height', '200px')
    .attr('rx', 30)
    .attr('ry', 30)
    .attr('fill', '#eee')
    .attr('opacity', 0.8)
    .attr('display','visible');

/***Call Brush*********************************/

  brush = brush.extent([[-12, 0], [12, innerH]]) //[[x1,y1], [x2,y2]] 직사각형 형태로 영역을 설정
    .on('brush', brushed) 
    .on('end', brushEnded);

  svg.selectAll('.y.axis') //축을 모두 선택한 후 각각 g를 추가하고 brush를 추가
   .append('g')
   .attr('class', 'brush')
   .call(brush);

 }
/***filter function********************************/

function filter(name, a, b, c, d) { 
  var flag = true;

  if (filtered.length != 0) {
    for (j=0; j<filtered.length; j++) {
      if(filtered[j].name == name) {
        a._groups[0][filtered[j].k].attributes[1].value = 0.05;
        b._groups[0][filtered[j].k].attributes[2].value = 0.0;
        c._groups[0][filtered[j].k].attributes[5].value = 0.1;
        d._groups[0][filtered[j].k].attributes[6].value = 0.1;
        delete filtered[j];

        filtered[j] = filtered[j+1]

        flag = false;
        cnt = cnt +1;
      }
    }
    filtered.length = filtered.length - cnt;
    cnt = 0;
  }


  if (name != 'Overall' && flag) { 
    for (var k =0; k<36; k++) {    
      if(a._groups[0][k].classList.value == name || a._groups[0][k].__data__.Nation == name) {
        a._groups[0][k].attributes[1].value = 1.71;
        b._groups[0][k].attributes[2].value = 1.3;
        c._groups[0][k].attributes[5].value = 1;  
        d._groups[0][k].attributes[6].value = 0.7;

        filtered.push({name, k});
    } else {
      if(a._groups[0][k].attributes[1].value != 1.71) {
          a._groups[0][k].attributes[1].value = 0.05;
          b._groups[0][k].attributes[2].value = 0.0;
          c._groups[0][k].attributes[5].value = 0.1;
          d._groups[0][k].attributes[6].value = 0.1;
        } 
      }
    }
  } 
  
  if(name == 'Overall' || filtered.length == 0) {
    for (var k =0; k<36; k++) {
      a._groups[0][k].attributes[1].value = 1.7;
      b._groups[0][k].attributes[2].value = 1.3;
      c._groups[0][k].attributes[5].value = 1.0;
      d._groups[0][k].attributes[6].value = 0.7;
      cnt = 0;
    }
  }
}

/***Color*********************************/

function color(d){
    if(d > 0.5) {
      var upperC = 1/(2*(d)) + 0.2;
      //console.log(upperC)
      return d3.interpolateRdYlGn(upperC);

    } else {
      var lowerC = (-1)*(d)+0.5 -0.2;
      //console.log(lowerC)
      return d3.interpolateRdYlGn(lowerC);
    }
   /*return d3.interpolateRdYlGn(d);
   var colorCode = d3.scaleLinear().domain([0, 0.5, 1]).range(['#e7172c','#076e4e','#00abff']);
   return colorCode(d);8\*/
}
    
/***Brush*********************************/

var conditions = {}; // 축마다 현재 선택된 영역을 저장
var pathName = [];

var preset1= {'예상 기대 월소득' : [80.03, 62.36]};

function brushed(d) {
  var tmp = [];

  conditions[d.name] = d3.event.selection.map(y[d.name].invert);
  brushing(conditions);

  var brushName = svg.selectAll('g .tooltip');

  var hiddenseries = svg.selectAll('g .series.hidden')._groups[0];
  for(var i=0; i<hiddenseries.length; i++) {
    tmp[i] = hiddenseries[i].childNodes[0].attributes[3].value;
  }

  pathName = tmp

  svg.selectAll('.nation.axis text')
  .attr('opacity', '0.2');

  svg.selectAll('.filter text')
  .attr('opacity', '0.2');

   svg.selectAll('.tick text')
  .attr('opacity', '0.2');
}

function brushEnded(d) {
  var tmp=[];
  if(d3.event.selection == null) { //클릭만 했을 때
    delete conditions[d.name]; //해당 영역의 조건을 지움
    brushing(conditions);
    svg.selectAll('.nation.axis text')
    .attr('opacity', '1.0');

    svg.selectAll('.filter text')
    .attr('opacity', '1.0');

    svg.selectAll('.tick text')
    .attr('opacity', '1.0');

    var hiddenseries = svg.selectAll('g .series.hidden')._groups[0];
    for(var i=0; i<hiddenseries.length; i++) {
    tmp[i] = hiddenseries[i].childNodes[0].attributes[3].value;
    }
    pathName = tmp
    brushing(conditions);
	}
}

function brushing(dataset) {
  var hiddenpath = [];
  var radarpath = [];
  svg.selectAll('.series2').classed('hidden',false);
	svg.selectAll('.series').classed('hidden', function(d) {
		var result = false;
    for(var k in dataset) { //세가지 조건 하나라도 밖에 있다면 감춰둠
    	var domain = dataset[k];
    	result = result || (d[k] < domain[1]  || d[k] > domain[0])
    	if(result) return result;
      if(!result) {
      }
 	  }
    return result;
	});
  if(pathName.length > 0) {
    for(var i = 0; i<pathName.length; i++) {
      hiddenpath[i] = svg.selectAll('#'+pathName[i]);
      radarpath[i] = hiddenpath[i]._groups["0"]["0"].parentNode;
      radarpath[i].attributes["0"].nodeValue = "series2 hidden";
    }
  } else {
    svg.selectAll('.series2').classed('hidden',false);
  }
}



