var w = 750, h = 510;
var smallW = 200, smallH = 270 ;
var margin = {top:80, right:200, bottom: 20, left: 200};
var smallMargin = {top : 50, right : 20, bottom : 30, left : 20}
var innerW = w - margin.right - margin.left,
  innerH = h - margin.top - margin.bottom;
var smallInnerW = smallW - smallMargin.right - smallMargin.left,
  smallInnerH = smallH - smallMargin.top - smallMargin.bottom ;
var smallTopMargin = 20 ;
  
var t = d3.transition().duration(500).ease(d3.easeQuad);

//dataset
var partyTree ;
var elected ;
var candidates ;

var country_data ;
var region_data ;

//x,y scale 및 축 설정
var xDomain ;
var xRange = [0,innerW] ;
var xRangeSmall = [10,smallInnerW+10] ;

var yDomain = [1,2,3,4,5,6];
var yRange = [0,innerH];
var yRangeSmall = [20,smallInnerH+20] ;

var xScale = d3.scaleLinear()
  .range(xRange) ;

var xScale_region = d3.scaleLinear()
  .domain([0,100]).range(xRangeSmall) ;
  
var yScale = d3.scalePoint()
  .domain(yDomain).range(yRange) ;
  
var yScale_region = d3.scalePoint()
.domain(yDomain).range(yRangeSmall) ;

var yearScale = d3.scaleOrdinal()
.domain([1,2,3,4,5,6]).range([1995,1998,2002,2006,2010,2014]);

var xAxis = d3.axisBottom(xScale).ticks(0) ;
var xAxis_region = d3.axisBottom(xScale_region).ticks(0) ;
var yAxis = d3.axisLeft(yScale) ;
var yAxis_region = d3.axisLeft(yScale_region) ;

//node의 반지름
var r = 12 ;
var smallR = 5 ;

//현재 화면 확인
var showElected = false;
var selected = false ;
var selected_region = false ;
var regionIndex = 0;

var showingStrong_country = false ;
var nodeSelected_country ;

var showingStrong_region = false ;
var nodeSelected_region = false ;

var viewByOrder_country = false;
var viewByOrder_region = false;

var tmpIdx ;//////
var tmpR ;///////

function row(d)
{
  return {"NO" : +d.대, "party" : d.정당명, "region" : d.선거구명, "name" : d.성명, "get" : +d.득표율};
}

var svg = d3.select('body').select("#chart1").append('svg')
    .attr("id", "chart_country")
    .attr('width', w)
    .attr('height', h) ;

svg.append("rect")
    .attr("id", "canvas1")
    .attr("width", w)
    .attr("height", h)
    .style("fill","white");

svg.append('g')
    .attr("id", "graph1")
    .attr("class", "graph")
    .attr('transform', 'translate('+ [margin.left, margin.top] + ')');

var tooltip_country = svg.append("g")
    .classed("tooltip", true)
    .classed("invisible", true)

tooltip_country.append("rect")
  .attr("width", "150px")  
  .attr("height", "60px")
  .style("opacity", "0.7") ;

tooltip_country.append("text")
  .attr("id","name")
  .attr("dx","8")
  .attr("dy","11")
  .style("fill","white")
  .style("font-family","Shin Gothic")
  .style("alignment-baseline","hanging")
  .style("font-size","18px") ;

tooltip_country.append("text")
  .attr("id","data")
  .attr("dx","142")
  .attr("dy","47")
  .style("fill","white")
  .style("font-family","Shin Gothic")
  .style("alignment-baseline","baseline")
  .style("text-anchor","end")
  .style("font-size","11px") ;

tooltip_country.append("line")
  .style("stroke","white")
  .attr("x1","8")
  .attr("y1","32")
  .attr("x2","142")
  .attr("y2","32")


var svg2 = d3.select('body').select("#chart2").append('svg')
  .style('width', (smallW + smallMargin.left)*6 + smallMargin.left * 20)
  .attr('height', (smallH + smallMargin.bottom/2)*3 + smallMargin.bottom/2 + smallTopMargin) ;

svg2.append("rect")
  .attr("class", "canvas2")
  .attr("width", (smallW + smallMargin.left)*6 + smallMargin.left * 20)
  .attr("height", (smallH + smallMargin.bottom/2)*3 + smallMargin.bottom)
  .style("fill","white") ;
    
  
var tooltip_region = svg2.append("g")
.classed("tooltip", true)
.classed("invisible", true)

tooltip_region.append("rect")
.attr("width", "160px")  
.attr("height", "60px")
.style("opacity", "0.7") ;

tooltip_region.append("text")
.attr("id","name")
.attr("dx","8")
.attr("dy","12")
.style("fill","white")
.style("font-family","Shin Gothic")
.style("alignment-baseline","hanging")
.style("font-size","15px") ;

tooltip_region.append("text")
.attr("id","data")
.attr("dx","152")
.attr("dy","47")
.style("fill","white")
.style("font-family","Shin Gothic")
.style("alignment-baseline","baseline")
.style("text-anchor","end")
.style("font-size","11px") ;

tooltip_region.append("line")
.style("stroke","white")
.attr("x1","8")
.attr("y1","32")
.attr("x2","152")
.attr("y2","32")

//def for linear grad
var def = svg.append("defs") ;

//call three data
d3.json('./data_partyTree.json').then(callback_0);

function callback_0(data0) {
  partyTree = data0 ;
  d3.csv("./data_elected.csv",row).then(callback_1) ;
}

function callback_1(data1) {
  elected = data1 ;
  d3.csv("./data_candidates.csv",row).then(callback_2) ;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////real part
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////real part
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////real part

function callback_2(data2) {
  candidates = data2 ;

  ////////////////////////////////////////////////////////whole country first////////////////////////////////////////////////////////
  //combine data
  country_data = partyTree.map(function(d){
    return {
      "NO" : d.NO,
      "party" : d.party.map(function(p){
        p.NO = d.NO ;
        p.electedCount = elected.filter(function(_e){return _e.NO == d.NO}).filter(function(_e){return _e.party == p.name}).length;
        p.candidatesCount = candidates.filter(function(_e){return _e.NO == d.NO}).filter(function(_e){return _e.party == p.name}).length;
        p.parents = [] ;
        p.children = [] ;
        p.strongChild ;
        p.strongParent ;
        return p ;
      }).sort(function(a,b){return a.electedCount - b.electedCount})
    }
  })

  //draw and initialize setting
  drawNodes() ;
  view_candidates() ;

  //set event listner
  d3.select("#graph1").selectAll("circle").on("mouseenter",nodeMouseEnter) ;
  d3.select("#graph1").selectAll("circle").on("mousemove",function(d){
    if(!d3.select(this.parentNode).classed("hidden"))
    {
      var mouse = d3.mouse(svg.node()) ;
      tooltip_country.classed("invisible",false) ;
      tooltip_country.select("#name").text(d.name) ;
      tooltip_country.select("#data").text("후보: " + d.candidatesCount + "명 당선: " + d.electedCount + "명") ;

      tooltip_country.attr("transform", "translate(" + [mouse[0]+5,mouse[1]-65] + ")") ;
    }
  })
  d3.select("#graph1").selectAll("circle").on("mouseleave",function(d){
    if(!selected)
    {
      d3.select("#countryDescription").text("전체 정당을 보고 있습니다.") ;
      d3.selectAll(".hidden").classed("hidden", false);
    }
    svg.select(".tooltip").classed("invisible",true);
  }) ;
  d3.select("#canvas1").on("click",disableSelection)
  d3.select("#graph1").selectAll("circle").on("click",enableSelection) ;
  
  d3.select("#countryShowStrong").on("click",function(){
    showingStrong_country = true ;
    d3.select("#countryShowStrong").classed("clicked",true) ;
    d3.select("#countryShowAll").classed("clicked",false) ;
    if(selected)
    {
      d3.select(nodeSelected_country).call(showStrong_country) ;
    }
  }) ;
  
  d3.select("#countryShowAll").on("click",function(){
    showingStrong_country = false ;
    d3.select("#countryShowStrong").classed("clicked",false) ;
    d3.select("#countryShowAll").classed("clicked",true) ;
    if(selected)
    {
      d3.select(nodeSelected_country).call(showWeak_country) ;
    }
  }) ;
  
  //toggle button
  d3.select("#showCand").on("click",function(d){
    if(showElected)
    {
      view_candidates() ;
      showElected = false ;
      d3.select("#showCand").classed("clicked",true) ;
      d3.select("#showEle").classed("clicked",false) ;
    }
  })
  d3.select("#showEle").on("click",function(d){
    if(!showElected) 
    {
      d3.select("#showCand").classed("clicked",false) ;
      d3.select("#showEle").classed("clicked",true) ;
      view_elected() ;
      showElected = true ;
    }
  })
  d3.select("#showByNumber_country").on("click",function(d){
    if(viewByOrder_country)
    {
      d3.select("#showByNumber_country").classed("clicked",true) ;
      d3.select("#showByOrder_country").classed("clicked",false) ;
      viewByOrder_country = false ;
      if(!showElected) view_candidates() ;
      else view_elected() ;
    }
  })
  d3.select("#showByOrder_country").on("click",function(d){
    if(!viewByOrder_country)
    {
      d3.select("#showByNumber_country").classed("clicked",false) ;
      d3.select("#showByOrder_country").classed("clicked",true) ;
      viewByOrder_country = true ;
      if(!showElected) view_candidates() ;
      else view_elected() ;
    }
  })

  ////////////////////////////////////////////////whole country section end//////////////////////////////////////////////

  ////////////////////////////////////////////////region section start//////////////////////////////////////////////
  var regionArray = candidates.map(function(_d){return _d.region}).filter(function(_d,_i,_a){return _a.indexOf(_d) == _i}) ;
  var candidates_reg = candidates.map(function(_d){
    return {
      "NO" : _d.NO,
      "region" : _d.region,
      "name" : _d.name,
      "party" : _d.party,
      "get" : _d.get,
      "parents" : [],
      "children" : []
    }
  })

  region_data = regionArray.map(function(_d){
    var reg = _d ;
    var elections = [,,,,,] ;
    var parties = [,,,,,] ;
    for(var i = 1 ; i <= 6 ; i++) 
    {
      elections[i-1] = {
      "NO" : i, 
      "party" : candidates_reg.filter(function(_c){return _c.region == _d}).filter(function(_p){return _p.NO == i})};
      parties[i-1] = candidates_reg.filter(function(_c){return _c.region == _d}).filter(function(_p){return _p.NO == i})
        .map((_p) => _p.party)
    }
    return {"reg" : reg, "elections" : elections, "parties" : parties} ;
  });

  var regionGroup = svg2.selectAll(".regionChart").data(region_data).enter()
    .append("g")
    .attr("class", "regionChart")
    .attr("transform", function(d,i){
      var _x = i % 6;
      var _y = Math.floor(i / 6) ;
      return "translate(" + [_x * (smallW + smallMargin.right) + smallMargin.right * 5,_y * (smallH + smallMargin.bottom/2) + smallTopMargin] + ")" ;
    })

  regionGroup.append("rect")
    .attr("fill", "#DDDDDD")
    .attr("width", smallW)
    .attr("height", smallH) ;

  regionGroup.append("text")
    .style("fill", "white")
    .style("font-family", "Dream Gothic")
    .attr("dx", 10)
    .attr("dy", 10)
    .attr("alignment-baseline","hanging")
    .text((d) => d.reg)
  
  var regionCharts = regionGroup.append("g")
    .attr("transform", "translate(" + [smallMargin.left-10,smallMargin.top-20] + ")") ;

  regionCharts.append("rect")
    .attr("class", "canvas2")
    .attr("fill", "white")
    .attr("width", smallInnerW + 20)
    .attr("height", smallInnerH + 40);

  regionCharts.each(function(d){regionGraphSet(d3.select(this))}) ;

  svg2.node().appendChild(tooltip_region.node());

  //set event listner
  regionCharts.selectAll("circle").on("mouseenter",nodeMouseEnter_region) ;
  regionCharts.selectAll("circle").on("mousemove",function(d){
    if(!d3.select(this.parentNode).classed("hidden"))
    {
      var mouse = d3.mouse(svg2.node()) ;
      tooltip_region.classed("invisible",false) ;
      tooltip_region.select("#name").text(d.party + " " + d.name) ;
      tooltip_region.select("#data").text("득표율: " + d.get + "%") ;

      tooltip_region.attr("transform", "translate(" + [mouse[0]+5,mouse[1]-65] + ")") ;
    }
  })
  regionCharts.selectAll("circle").on("mouseleave",function(d){
    if(!selected_region)
    {
      d3.select("#regionDescription").text("전체 정당을 보고 있습니다.") ;
      regionCharts.selectAll(".hidden").classed("hidden", false);
    }
    svg2.select(".tooltip").classed("invisible",true) ;
  }) ;
  regionCharts.selectAll("circle").on("click",enableSelection_region) ;

  d3.selectAll(".canvas2").on("click",disableSelection_region)
  //toggle button
  d3.select("#regionShowStrong").on("click",function(){
    showingStrong_region = true ;
    d3.select("#regionShowStrong").classed("clicked",true) ;
    d3.select("#regionShowAll").classed("clicked",false) ;
    if(selected_region)
    {
      var d = d3.select(nodeSelected_region).datum();
      d3.selectAll(".regionChart").selectAll(".node").classed("hidden", true) ;
      d3.selectAll(".regionChart").selectAll(".link").classed("hidden", true) ;
      d3.selectAll(".regionChart").selectAll(".node").filter(function(_d){return _d.NO == d.NO && _d.party == d.party})
        .each(function(){showStrong_region(d3.select(this))}) ;
    }
  }) ;
  
  d3.select("#regionShowAll").on("click",function(){
    showingStrong_region = false ;
    d3.select("#regionShowStrong").classed("clicked",false) ;
    d3.select("#regionShowAll").classed("clicked",true) ;
    if(selected_region)
    {
      var d = d3.select(nodeSelected_region).datum();
      d3.selectAll(".regionChart").selectAll(".node").classed("hidden", true) ;
      d3.selectAll(".regionChart").selectAll(".link").classed("hidden", true) ;
      d3.selectAll(".regionChart").selectAll(".node").filter(function(_d){return _d.NO == d.NO && _d.party == d.party})
        .each(function(){showWeak_region(d3.select(this))}) ;
    }
  }) ;

  
  d3.select("#showByNumber_region").on("click",function(d){
    if(viewByOrder_region)
    {
      d3.select("#showByNumber_region").classed("clicked",true) ;
      d3.select("#showByOrder_region").classed("clicked",false) ;
      viewByOrder_region = false ;
      view_byNumber_region() ;
    }
  })
  d3.select("#showByOrder_region").on("click",function(d){
    if(!viewByOrder_region)
    {
      d3.select("#showByNumber_region").classed("clicked",false) ;
      d3.select("#showByOrder_region").classed("clicked",true) ;
      viewByOrder_region = true ;
      view_byOrder_region() ;
    }
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////real part
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////real part
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////real part

////////////////////////////////////////////////draw nodes helper//////////////////////////////////////////////
function drawNodes()
{
  //draw x axis first
  for(var i = 1 ; i <= 6 ; i++)
  {
    d3.select("#graph1").append("g").attr("class", "x-Axis")
      .attr("transform", "translate(" + [0, yScale(i)] + ")")
      .call(xAxis) ;
  }
  
  //connect the data
  d3.select("#graph1").selectAll(".section").data(country_data).enter().append("g").attr("class", "section")
    .attr("transform", function(d){return "translate(" + [0,yScale(d.NO)] + ")"}) ;
  
  var node = d3.select("#graph1").selectAll(".section").selectAll(".node").data(function(d){return d.party}).enter()
    .append("g").attr("class", "node")

  var tg = d3.select("#graph1").selectAll(".section").append("g");
  
  tg.append("text")
    .attr("dx", -70)
    .attr("dy", 8)
    .style("fill", "#DDDDDD")
    .style("font-size", 32)
    .style("font-family", "Dream Gothic")
    .text((d)=>d.NO + "대") ;

  tg.append("text")
    .attr("dx", 370)
    .attr("dy", 8)
    .style("fill", "#DDDDDD")
    .style("font-size", 18)
    .style("font-family", "Dream Gothic")
    .text((d)=>yearScale(d.NO)) ;


  //draw line
  d3.select("#graph1").selectAll(".node").each(drawLine) ;

  node.append("circle")
    .attr("r", r)
    .style("fill", function(d){return d.color})//"white")
    .style("stroke", "white")//function(d){return d.color}) 
    .style("stroke-width", 0.5) ;

  var sectionArray = d3.select("#graph1").selectAll(".section")._groups[0] ;
  for(var i = 5 ; i >= 0 ; i--)
  {
    d3.select(sectionArray[i]).raise() ;
  }
}
////////////////////////////////////////////////line draw helper//////////////////////////////////////////////
function drawLine(n)
{
  var curDatum = d3.select(this).datum() ;
  curDatum.strongLink = curDatum.parentStrong.map(function(d){return [curDatum.name,d]}) ;
  curDatum.weakLink = curDatum.parentWeak.map(function(d){return [curDatum.name,d]})
  if(n.NO != 1)
  {

    d3.select(this).selectAll(".link .strong").data(function(d){return d.strongLink}).enter().append("line")
      .attr("class", "link strong")
      .style("stroke-width",4)
      .attr("x1", 1)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", -yScale.step()) ;

    d3.select(this).selectAll(".link .weak").data(function(d){return d.weakLink}).enter().append("line")
      .attr("class", "link weak")
      .style("stroke-width",1)
      .attr("x1", 1)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", -yScale.step()) ;

    d3.select(this).selectAll(".link")
      .style("stroke", function(d){
        var pNode = this.parentNode ;
        var targetParty = country_data.find(function(_d){return _d.NO == d3.select(pNode).datum().NO-1})
          .party.find(function(_d){return _d.name == d[1]}) ;
        var parentArr = d3.select("#graph1").selectAll(".node").filter(function(_d){return _d == targetParty})._groups[0] ;
        d3.select(pNode).datum().parents = d3.select(pNode).datum().parents.concat(parentArr) ;
        d3.select(parentArr[0]).datum().children = d3.select(parentArr[0]).datum().children.concat([pNode]) ;
        
        if(d3.select(pNode).datum().parentStrong.indexOf(d3.select(parentArr[0]).datum().name) >= 0)
        {
          d3.select(pNode).datum().strongParent = parentArr[0] ;
          d3.select(parentArr[0]).datum().strongChild = pNode ;
        }
        var thisGrad = def.append("linearGradient")
          .attr("id", function(_d){return "grad" + d + d3.select(pNode).datum().NO})
          .attr("x1","0%")
          .attr("y1", "0%")
          .attr("x2","0%")
          .attr("y2", "100%") ;
        thisGrad.append("stop")
          .attr("stop-color", targetParty.color)
          .attr("offset", "0%"); ;
        thisGrad.append("stop")
          .attr("stop-color", d3.select(pNode).datum().color) 
          .attr("offset", "100%");
        return "url(#grad" + d + d3.select(pNode).datum().NO + ")"
      }) ;
  }
}

////////////////////////////////////////////////draw nodes helper - region//////////////////////////////////////////////
function regionGraphSet(selection)
{
  //draw x axis first
  for(var i = 1 ; i <= 6 ; i++)
  {
    selection.append("g").attr("class", "x-Axis")
      .attr("transform", "translate(" + [0, yScale_region(i)] + ")")
      .call(xAxis_region) ;
  }
  drawNodes_region(selection) ;
  var sectionArray = selection.selectAll(".section")._groups[0] ;
  for(var i = 5 ; i >= 0 ; i--)
  {
    d3.select(sectionArray[i]).raise() ;
  }
  view_byNumber_region()
}

function drawNodes_region(region)
{  
  var regionData = region.datum() ;
  //connect the data
  region.selectAll(".section").data(regionData.elections)
    .enter().append("g")
      .attr("class", "section")
      .attr("transform", function(d){return "translate(" + [0,yScale_region(d.NO)] + ")"}) ;
  
  var node = region.selectAll(".section").selectAll(".node")
    .data(function(d){return d.party},function(d){return d ? (d.party != "무소속" ? d.party : d.name) : this.id;})

  var enterNode = node.enter()
      .append("g").attr("class", "node")

  enterNode.append("circle")
    .attr("r", smallR)
    .style("stroke", "white")
    .style("fill", function(d){ 
      var p = partyTree.find((_d) => _d.NO == d.NO).party.find((_d) => _d.name == d.party);
      return p ? p.color : "#000000";})
    .style("stroke-width", 0.2)

  region.selectAll(".node").each(drawLine2) ;

  region.selectAll("circle").raise() ;
}
////////////////////////////////////////////////line draw helper2- region//////////////////////////////////////////////
function drawLine2(n)
{
  if(n.NO != 1)
  {

    //check if link available
    var curDatum = d3.select(this).datum() ;
    var curNO = curDatum.NO ;
    var curRegion = curDatum.region ;

    var p = partyTree.find((d) => d.NO == curNO).party.find((d) => d.name == curDatum.party);
    
    var validStrongParent = p.parentStrong.filter((d) => 
      region_data.find((_d)=>_d.reg == curRegion).parties[curNO - 2].indexOf(d) >= 0) ;
    var validWeakParent = p.parentWeak.filter((d) => 
      region_data.find((_d)=>_d.reg == curRegion).parties[curNO - 2].indexOf(d) >= 0) ;
    
    curDatum.strongLink = validStrongParent.map(function(d){return {party : [curDatum.party,d], NO : [curNO, curNO - 1]}}) ;
    curDatum.weakLink = validWeakParent.map(function(d){return {party : [curDatum.party,d], NO : [curNO, curNO - 1]}})

    if(validStrongParent.length > 0)
    {
      d3.select(this).selectAll(".link .strong").data(function(d){return d.strongLink}).enter().append("line")
        .attr("class", "link strong")
        .style("stroke-width",2)
        .style("stroke", function(d){
          var pNode = this.parentNode ;
          var par = d3.select(pNode.parentNode.parentNode).selectAll(".section").filter((_s) => _s.NO == d.NO[1])
            .selectAll(".node").filter((_n) => _n.party == d.party[1]).node() ;
          d3.select(pNode).datum().parents = d3.select(pNode).datum().parents.concat([par]) ;
          d3.select(par).datum().children = d3.select(par).datum().children.concat([pNode]) ;
          d3.select(pNode).datum().strongParent = par ;
          d3.select(par).datum().strongChild = pNode ;
          return "url(#grad" + d.party + curNO + ")"
        })
        .attr("y1", 0)
        .attr("y2", -yScale_region.step()) 
        .attr("x1", 0.5) 
        .attr("x2", 0) ;
    }
    
    if(validWeakParent.length > 0)
    {
      d3.select(this).selectAll(".link .weak").data(function(d){return d.weakLink}).enter().append("line")
        .attr("class", "link weak")
        .style("stroke-width",0.8)
        .style("stroke", function(d){
          var pNode = this.parentNode ;
          var par = d3.select(pNode.parentNode.parentNode).selectAll(".section").filter((_s) => _s.NO == d.NO[1])
            .selectAll(".node").filter((_n) => _n.party == d.party[1]).node() ;
          d3.select(pNode).datum().parents = d3.select(pNode).datum().parents.concat([par]) ;
          d3.select(par).datum().children = d3.select(par).datum().children.concat([pNode]) ;
          return "url(#grad" + d.party + curNO + ")"
        })
        .attr("y1", 0)
        .attr("y2", -yScale_region.step()) 
        .attr("x1", 0.5) 
        .attr("x2", 0) ;
    }
  }
}
////////////////////////////////////////////////for change view//////////////////////////////////////////////
function view_candidates(){
  var domainMax = !viewByOrder_country ? 
    getMaxOfArray(country_data.map(function(d){return d3.max(d.party,function(p){return p.candidatesCount})})) : 
    getMaxOfArray(country_data.map(function(d){return d.party.length})) - 1;
  d3.select("#graph1").selectAll(".section")
    .each(function(d){setNodesOrder(this,"candidates")});

  var translateDone = false; 

  //set x domain(candidates)
  xScale.domain([0,domainMax]);

  //set x position
  if(!viewByOrder_country)
  {
    d3.select("#graph1").selectAll(".node")
      .transition(t)
      .attr("transform", function(d){
        translateDone = true ;
        return "translate(" + [xScale(d.candidatesCount),0] + ")"
      }) ;
    //handle duplicate values
    d3.select("#graph1").selectAll(".section").each(function(s)
    {
      for(var i = 0; i <= domainMax ; i++)
      {
        var arr = d3.select(this).selectAll(".node").filter(function(d){return d.candidatesCount == i})._groups[0];
        arr.forEach(function(a,i)
        {
          d3.select(a).select("circle").transition(t) 
            .attr("r", r - r/5*i) ;
        })
      }
    })
    //set line connection
    d3.select("#graph1").selectAll(".link")
      .transition(t)
      .attr("x2", function(d){
        var pNode = this.parentNode ;
        var targetNode = d3.select("#graph1").selectAll(".section")
          .filter(function(_d){return _d.NO == d3.select(pNode).datum().NO - 1})
          .selectAll(".node").filter(function(_d){return _d.name == d[1]}).node() ;
        if(targetNode) return xScale(d3.select(targetNode).datum().candidatesCount - d3.select(pNode).datum().candidatesCount);
        else return 0;
      });
  }
  else
  {
    d3.select("#graph1").selectAll(".section").each(function(d){
      d3.select(this).selectAll(".node")
        .transition(t)
        .attr("transform", function(d,i){
          var num = this.parentNode.childNodes.length - 1 ;
          translateDone = true ;
          d3.select(this).datum().order = i ;
          return "translate(" + [xScale(i + domainMax - num + 1),0] + ")"
        }) ;
    });
    //set line connection
      d3.select("#graph1").selectAll(".link")
        .transition(t)
        .attr("x2", function(d){
          var pNode = this.parentNode ;
          var targetNode = d3.select("#graph1").selectAll(".section")
            .filter(function(_d){return _d.NO == d3.select(pNode).datum().NO - 1})
            .selectAll(".node").filter(function(_d){return _d.name == d[1]}).node() ;
          var numP = pNode.parentNode.childNodes.length  - 1;
          var numT = targetNode.parentNode.childNodes.length  - 1;
          if(targetNode) return xScale(d3.select(targetNode).datum().order + (domainMax - numT + 1)
             - (d3.select(pNode).datum().order + (domainMax - numP + 1))) - 1;
          else return 0;
        });

    d3.select("#graph1").selectAll("circle")
      .transition(t) 
      .attr("r", r) ;
  }
  
}

function view_elected(){

  var domainMax = !viewByOrder_country ? 
    getMaxOfArray(country_data.map(function(d){return d3.max(d.party,function(p){return p.electedCount})})) : 
    getMaxOfArray(country_data.map(function(d){return d.party.length})) - 1;
  d3.select("#graph1").selectAll(".section")
    .each(function(d){setNodesOrder(this,"elected")});

  var translateDone = false; 

  //set x domain(elected)
  xScale.domain([0,domainMax]);

  //set x position
  if(!viewByOrder_country)
  {
    d3.select("#graph1").selectAll(".node")
      .transition(t)
      .attr("transform", function(d){
        translateDone = true ;
        return "translate(" + [xScale(d.electedCount),0] + ")"
      }) ;
    //handle duplicate values
    d3.select("#graph1").selectAll(".section").each(function(s)
    {
      for(var i = 0; i <= domainMax ; i++)
      {
        var arr = d3.select(this).selectAll(".node").filter(function(d){return d.electedCount == i})._groups[0];
        arr.forEach(function(a,i)
        {
          d3.select(a).select("circle").transition(t) 
            .attr("r", r - r/5*i) ;
        })
      }
    })
    //set line connection
    d3.select("#graph1").selectAll(".link")
      .transition(t)
      .attr("x2", function(d){
        var pNode = this.parentNode ;
        var targetNode = d3.select("#graph1").selectAll(".section")
          .filter(function(_d){return _d.NO == d3.select(pNode).datum().NO - 1})
          .selectAll(".node").filter(function(_d){return _d.name == d[1]}).node() ;
        if(targetNode) return xScale(d3.select(targetNode).datum().electedCount - d3.select(pNode).datum().electedCount);
        else return 0;
      });
  }
  else
  {
    d3.select("#graph1").selectAll(".section").each(function(d){
      d3.select(this).selectAll(".node")
        .transition(t)
        .attr("transform", function(d,i){
          var num = this.parentNode.childNodes.length - 1 ;
          translateDone = true ;
          d3.select(this).datum().order = i ;
          return "translate(" + [xScale(i + domainMax - num + 1),0] + ")"
        }) ;
    });
    //set line connection
      d3.select("#graph1").selectAll(".link")
        .transition(t)
        .attr("x2", function(d){
          var pNode = this.parentNode ;
          var targetNode = d3.select("#graph1").selectAll(".section")
            .filter(function(_d){return _d.NO == d3.select(pNode).datum().NO - 1})
            .selectAll(".node").filter(function(_d){return _d.name == d[1]}).node() ;
            var numP = pNode.parentNode.childNodes.length - 1 ;
            var numT = targetNode.parentNode.childNodes.length - 1 ;
            if(targetNode) return xScale(d3.select(targetNode).datum().order + (domainMax - numT + 1)
               - (d3.select(pNode).datum().order + (domainMax - numP + 1))) - 1;
          else return 0;
        });
        
    d3.select("#graph1").selectAll("circle")
    .transition(t) 
    .attr("r", r) ;
  }
  
}

function view_byOrder_region(){
  var domainMax = getMaxOfArray(country_data.map(function(d){return d.party.length})) - 1;
  d3.selectAll(".regionChart").selectAll(".section")
    .each(function(d){setNodesOrder(this,"get")});

  //set x domain(candidates)
  xScale_region.domain([0,domainMax]);

  d3.selectAll(".regionChart").selectAll(".section").each(function(d){
    d3.select(this).selectAll(".node")
      .transition(t)
      .attr("transform", function(d,i){
        var num = this.parentNode.childNodes.length;
        translateDone = true ;
        d3.select(this).datum().order = i ;
        return "translate(" + [xScale_region(i + domainMax - num + 1),0] + ")"
      }) ;
  });
  //set line connection
    d3.selectAll(".regionChart").selectAll(".link")
      .transition(t)
      .attr("x2", function(d){
        var pNode = this.parentNode ;
        var pNodeDatum = d3.select(pNode).datum() ;
        var targetNode = d3.select(pNode.parentNode.parentNode).selectAll(".section")
          .filter(function(_d){return _d.NO == pNodeDatum.NO - 1})
          .selectAll(".node").filter(function(_d){return _d.party == d.party[1]}).node() ;
        var numP = pNode.parentNode.childNodes.length;
        var numT = targetNode.parentNode.childNodes.length;
        if(targetNode) 
        return xScale_region(d3.select(targetNode).datum().order + (domainMax - numT) - pNodeDatum.order - (domainMax - numP) - 0.5);
        else return 0;
      });
}

function view_byNumber_region(){
  d3.selectAll(".regionChart").selectAll(".section")
    .each(function(d){setNodesOrder(this,"get")});

  //set x domain(candidates)
  xScale_region.domain([0,100]);

  d3.selectAll(".regionChart").selectAll(".section").each(function(d){
    d3.select(this).selectAll(".node")
      .transition(t)
      .attr("transform", function(d,i){
        return "translate(" + [xScale_region(d.get),0] + ")"
      }) ;
  });
  //set line connection
    d3.selectAll(".regionChart").selectAll(".link")
      .transition(t)
      .attr("x2", function(d){
        var pNode = this.parentNode ;
        var targetNode = d3.select(pNode.parentNode.parentNode).selectAll(".section")
          .filter(function(_d){return _d.NO == d3.select(pNode).datum().NO - 1})
          .selectAll(".node").filter(function(_d){return _d.party == d.party[1]}).node() ;
        if(targetNode) return xScale_region(d3.select(targetNode).datum().get - d3.select(pNode).datum().get) - 10;
        else return 0;
      });
}
////////////////////////////////////////////////for change view//////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////Event Callback functions//////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function nodeMouseEnter(d)
{
  if(!selected)
  {
    nodeSelected_country = this.parentNode ;
    d3.select("#countryDescription").text(d.NO + "대, " + d.name + " 계통의 정당을 보고 있습니다.") ;
    if(!showingStrong_country) d3.select(this.parentNode).call(showWeak_country) ;
    else d3.select(this.parentNode).call(showStrong_country) ;
  }
}

function nodeMouseEnter_region(d)
{
  if(!selected_region)
  {
    nodeSelected_region = this.parentNode ;

    d3.selectAll(".regionChart").selectAll(".node").classed("hidden", true) ;
    d3.selectAll(".regionChart").selectAll(".link").classed("hidden", true) ;

    d3.select("#regionDescription").text(d.NO + "대, " + d.party + " 계통의 정당을 보고 있습니다.") ;
    if(!showingStrong_region) {
      d3.selectAll(".regionChart").selectAll(".node").filter(function(_d){return _d.NO == d.NO && _d.party == d.party})
        .each(function(){showWeak_region(d3.select(this))}) ;
    }
    else
    {
      if(d.party != "무소속")
      d3.selectAll(".regionChart").selectAll(".node").filter(function(_d){return _d.NO == d.NO && _d.party == d.party})
        .each(function(){showStrong_region(d3.select(this))}) ;
      else showStrong_region(d3.select(this.parentNode)) ;
    }
    d3.selectAll(".regionChart").selectAll(".node:not(.hidden)").raise() ;
  }
}

function showStrong_country(selection)
{
  var node = selection.node() ;
  d3.select("#graph1").selectAll(".node").classed("hidden", true) ;
  d3.select("#graph1").selectAll(".link").classed("hidden", true) ;
  d3.select(node).classed("hidden",false) ;
  if(selection.datum().name != "무소속")
  {
    selectStrongParentNode(node) ;
    selectStrongChildNode(node) ;
  }
}

function showStrong_region(selection)
{
  var node = selection.node() ;
  d3.select(node).classed("hidden",false) ;
  if(selection.datum().party != "무소속")
  {
    selectStrongParentNode_region(node) ;
    selectStrongChildNode_region(node) ;
  }
}

function showWeak_country(selection)
{
  var node = selection.node()
  d3.select("#graph1").selectAll(".node").classed("hidden", true) ;
  d3.select("#graph1").selectAll(".link").classed("hidden", true) ;
  d3.select(node).classed("hidden",false) ;
  if(selection.datum().name != "무소속")
  {
    selectParentNodes(node) ;
    selectChildrenNodes(node) ;
  }
  else
  {
    d3.select("#graph1").selectAll(".node").filter(function(_d){return _d.name == "무소속"}).classed("hidden", false) ;
  }
}

function showWeak_region(selection)
{
  var node = selection.node();
  d3.select(node).classed("hidden",false) ;
  if(selection.datum().party != "무소속")
  {
    selectParentNodes_region(node) ;
    selectChildrenNodes_region(node) ;
  }
  else
  {
    d3.selectAll(".regionChart").selectAll(".node").filter(function(_d){return _d.party == "무소속"}).classed("hidden", false) ;
  }
}
//node mouse enter helper
function selectParentNodes(node)
{
  if(d3.select(node).datum().parents.length > 0)
  {
    d3.select(node).datum().parents.forEach(function(p){
      d3.select(p).classed("hidden",false) ;
      d3.select(p).classed("completelyHidden",false) ;
      d3.select(node).selectAll(".link")
        .filter(function(d){return d[1] == d3.select(p).datum().name})
        .classed("hidden", false) 
        .classed("completelyHidden",false) ;
      selectParentNodes(p) ;
    }) ;
  }
}

function selectParentNodes_region(node)
{
  if(d3.select(node).datum().parents.length > 0)
  {
    d3.select(node).datum().parents.forEach(function(p){
      d3.select(p).classed("hidden",false).raise() ;
      d3.select(p).classed("completelyHidden",false) ;
      d3.select(node).selectAll(".link")
        .filter(function(d){return d.party[1] == d3.select(p).datum().party})
        .classed("hidden", false) 
        .classed("completelyHidden",false) ;
      selectParentNodes_region(p) ;
    }) ;
  }
}

function selectStrongParentNode(node)
{
  var str = d3.select(node).datum().strongParent ;
  if(str)
  {
    d3.select(str).classed("hidden",false) ;
    d3.select(node).selectAll(".link")
      .filter(function(d){return d[1] == d3.select(str).datum().name})
      .classed("hidden", false) ;
    selectStrongParentNode(str) ;
  }
}

function selectStrongParentNode_region(node)
{
  var str = d3.select(node).datum().strongParent ;
  if(str)
  {
    d3.select(str).classed("hidden",false).raise() ;
    d3.select(node).selectAll(".link")
      .filter(function(d){return d.party[1] == d3.select(str).datum().party})
      .classed("hidden", false) ;
    selectStrongParentNode_region(str) ;
  }
}

function selectChildrenNodes(node)
{
  if(d3.select(node).datum().children.length > 0)
  {
    d3.select(node).datum().children.forEach(function(p){
      d3.select(p).classed("hidden",false) ;
      d3.select(p).classed("completelyHidden",false) ;
      d3.select(p).selectAll(".link")
        .filter(function(d){return d[1] == d3.select(node).datum().name})
        .classed("hidden", false) 
        .classed("completelyHidden",false) ;
      selectChildrenNodes(p) ;
    }) ;
  }
}

function selectChildrenNodes_region(node)
{
  if(d3.select(node).datum().children.length > 0)
  {
    d3.select(node).datum().children.forEach(function(p){
      d3.select(p).classed("hidden",false).raise() ;
      d3.select(p).classed("completelyHidden",false) ;
      d3.select(p).selectAll(".link")
        .filter(function(d){return d.party[1] == d3.select(node).datum().party})
        .classed("hidden", false) 
        .classed("completelyHidden",false) ;
      selectChildrenNodes_region(p) ;
    }) ;
  }
}

function selectStrongChildNode(node)
{
  var str = d3.select(node).datum().strongChild ;
  if(str)
  {
    d3.select(str).classed("hidden",false) ;
    d3.select(str).selectAll(".link")
    .filter(function(d){return d[1] == d3.select(node).datum().name})
      .classed("hidden", false) ;
    selectStrongChildNode(str) ;
  }
}

function selectStrongChildNode_region(node)
{
  var str = d3.select(node).datum().strongChild ;
  if(str)
  {
    d3.select(str).classed("hidden",false).raise() ;
    d3.select(str).selectAll(".link")
    .filter(function(d){return d.party[1] == d3.select(node).datum().party})
      .classed("hidden", false) ;
    selectStrongChildNode_region(str) ;
  }
}

function enableSelection(node)
{
  if(!selected)
  {
    nodeSelected_country = this.parentNode ;
    d3.select("#countryDescription").text(node.NO + "대, " + node.name + " 계통의 정당을 보고 있습니다.") ;
    d3.select("#graph1").selectAll(".hidden").classed("completelyHidden", true) ;
    selected = true ;
  }
}

function disableSelection(node)
{
  d3.select("#countryDescription").text("전체 정당을 보고 있습니다.") ;
  d3.select("#graph1").selectAll(".completelyHidden").classed("completelyHidden", false) ;
  d3.select("#graph1").selectAll(".hidden").classed("hidden", false) ;
  selected = false ;
}

function enableSelection_region(node)
{
  if(!selected_region)
  {
    nodeSelected_region = this.parentNode ;
    d3.select("#regionDescription").text(node.NO + "대, " + node.party + " 계통의 정당을 보고 있습니다.") ;
    d3.selectAll(".regionChart").selectAll(".hidden").classed("completelyHidden", true) ;
    selected_region = true ;
  }
}

function disableSelection_region(node)
{
  d3.select("#regionDescription").text("전체 정당을 보고 있습니다.") ;
  d3.selectAll(".regionChart").selectAll(".completelyHidden").classed("completelyHidden", false) ;
  d3.selectAll(".regionChart").selectAll(".hidden").classed("hidden", false) ;
  selected_region = false ;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////Event Callback functions//////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//max helper
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

//help setting order of nodes under each selection(callback function)
function setNodesOrder(section, criteria){
  var childNodes = Array.from(d3.select(section).selectAll(".node")._groups[0]) ;
  var compareFunction;

  if(criteria == "candidates")
  {
    compareFunction = function(a,b){
      var res = d3.select(a).datum().candidatesCount - d3.select(b).datum().candidatesCount ;
      if(res > 0) return 1;
      else if(res < 0) return -1 ;
      else if(viewByOrder_country) return d3.select(a).datum().electedCount - d3.select(b).datum().electedCount;
      else return d3.select(b).datum().electedCount - d3.select(a).datum().electedCount ;
    }
  } else if(criteria == "elected")
  {
    compareFunction = function(a,b){
      var res = d3.select(a).datum().electedCount - d3.select(b).datum().electedCount ;
      if(res > 0) return 1;
      else if(res < 0) return -1 ;
      else if(viewByOrder_country) return d3.select(a).datum().candidatesCount - d3.select(b).datum().candidatesCount ;
      else return d3.select(b).datum().candidatesCount - d3.select(a).datum().candidatesCount ;
    }
  } else if(criteria == "get")
  {
    compareFunction = function(a,b){return d3.select(a).datum().get - d3.select(b).datum().get} ;
  }

  childNodes.sort(compareFunction) ;
  for(var i = 0 ; i < childNodes.length ; i++) section.appendChild(childNodes[i]);
}
