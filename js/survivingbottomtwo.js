d3.csv('data/numbottwoappearances.csv', function(data) {
  //console.log(data);
  data = data.map(function(d) { return {cycle: d.cycle, contestant: d.contestant, number: +d.number}})
  console.log(data);
  var freq = [0,0,0,0,0,0];
  for (var i = 0; i < data.length; i++) {
    var num = data[i].number;
      freq[num]++;
        
    }
  var sumall = freq.reduce(add,0);
var currentPerspective = 'universe'
var radius = 5;
var eventsData = [
        { x: 0, y: 0.1, width: 1, height: 0.05, name: 'zero' },
        { x: freq.slice(0,1).reduce(add,0)/sumall, y: 0.25, width: 1-(freq.slice(0,1).reduce(add,0)/sumall), height: 0.05, name: 'one' },
        { x: freq.slice(0,2).reduce(add,0)/sumall, y: 0.4, width: 1-(freq.slice(0,2).reduce(add,0)/sumall), height: 0.05, name: 'two' },
        { x: freq.slice(0,3).reduce(add,0)/sumall, y: 0.55, width: 1-(freq.slice(0,3).reduce(add,0)/sumall), height: 0.05, name: 'three' },
        { x: freq.slice(0,4).reduce(add,0)/sumall, y: 0.7, width: 1-(freq.slice(0,4).reduce(add,0)/sumall), height: 0.05, name: 'four' },
        { x: freq.slice(0,5).reduce(add,0)/sumall, y: 0.85, width: 1-(freq.slice(0,5).reduce(add,0)/sumall), height: 0.05, name: 'five' }
    ];
var mapper = {0: "P(A)", 1: "P(B)", 2: "P(C)"};

//Create SVG
var svgBallCP = d3v3.select('#svgBallCP').append('svg');
var svgProbCP = d3v3.select('#svgProbCP').append('svg');

//Create Clip Path
var clipCP = svgBallCP.append("clipPath").attr("id", "viewCP").append("rect");

//Create Container
var containerBallCP = svgBallCP.append('g').attr("clip-path", "url(#viewCP)");
var containerProbCP = svgProbCP.append('g');
  
//Create Scales
var xScaleCP = d3v3.scale.linear().domain([0, 1]);
var xWidthCP = d3v3.scale.linear().domain([0, 1]);
var yScaleCP = d3v3.scale.linear().domain([0, 1]);

var xScaleProbCP = d3v3.scale.ordinal().domain([0,1,2,3,4,5]);
var yScaleProbCP = d3v3.scale.linear().domain([0, 1]);


//Drag Functions
var dragRect = d3v3.behavior.drag()
         .origin(function() { return {x: d3v3.select(this).attr("x"),y:0};})
         .on('dragstart', function(){d3v3.select(this.parentNode).moveToFront();}) 
         .on('drag', function(d,i) {
            var x = Math.max(0,Math.min(xScaleCP.invert(d3v3.event.x),(1-eventsData[i].width)));
            eventsData[i].x = x;
            changePerspective(currentPerspective);
            updateRects(0);
          })
var dragLeft = d3v3.behavior.drag()
         .on('dragstart', function(){d3v3.select(this).moveToFront();})
         .on('drag', function(d,i) {
            var x = Math.max(0,Math.min(xScaleCP.invert(d3v3.event.x),(eventsData[i].x+eventsData[i].width),1));
            var change = eventsData[i].x - x;
            eventsData[i].x = x;
            eventsData[i].width = Math.max(0,eventsData[i].width + change);
            changePerspective(currentPerspective);
            updateRects(0);
         })
var dragRight = d3v3.behavior.drag()
         .on('dragstart', function(){d3v3.select(this).moveToFront();})
         .on('drag', function(d,i) {
            var w = Math.max(0,Math.min(xScaleCP.invert(d3v3.event.x)-eventsData[i].x,(1-eventsData[i].x)));
            eventsData[i].width = w;
            changePerspective(currentPerspective);
            updateRects(0);
         })

//Tool tip for Prob
var tipCP = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d,i) { 
                var prob = calcOverlap(i,currentPerspective)/(xWidthCP.domain()[1]);
                return Math.round(prob * 100) / 100;});
var tipBall = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d,i) { 
                console.log(d);
                return "Cycle " + d["cycle"] + ": " + d["contestant"];})

//Ball SVG elements
var events = containerBallCP.selectAll('g.event').data(eventsData).enter().append('g').attr('class', 'event');

var rects = events.append('rect').attr('class', function(d){ return (d.name + ' shelf') }).call(dragRect);

var leftBorders = events.append('line').attr('class', function(d){ return (d.name + ' border') }).call(dragLeft);

var rightBorders = events.append('line').attr('class', function(d){ return (d.name + ' border') }).call(dragRight);

var texts = events.append('text').text(function(d){ 
  if (d.name != "four" && d.name != "five" && d.name != "three") {
    return "At least " + d.name + " appearance(s) in the bottom two";
  } else {
      return d.name;
    }}).attr('class', function(d){ return d.name + ' label'});

var circles = containerBallCP.append("g").attr("class", "ball")

//Prob SVG elements
var probEvents = containerProbCP.selectAll('g.event').data(eventsData).enter().append('g').attr('class', 'event');

var probRects = probEvents.append('rect').attr('class', function(d){ return (d.name + ' probability') }).on("mouseover", function(d,i) { tipCP.show(d,i,this);}).on("mouseout", function() { tipCP.hide();});;

var probAxis = containerProbCP.append("g").attr("class", "x axis");

var xAxis = d3v3.svg.axis().scale(xScaleProbCP).orient("bottom").tickFormat(function (d) { return mapper[d]});



//Updates positions of rectangles and lines
function updateRects(dur) {
  rects.transition().duration(dur)
    .attr('x', function(d){ return xScaleCP(d.x) })
    .attr('y', function(d){ return yScaleCP(d.y) })
    .attr('width', function(d){ return xWidthCP(d.width) })
    .attr('height', function(d){ return yScaleCP(d.height) });

  leftBorders.transition().duration(dur)
    .attr('x1', function(d){ return xScaleCP(d.x) })
    .attr('y1', function(d){ return yScaleCP(d.y) })
    .attr('x2', function(d){ return xScaleCP(d.x) })
    .attr('y2', function(d){ return yScaleCP(d.y+d.height) });

  rightBorders.transition().duration(dur)
    .attr('x1', function(d){ return xScaleCP(d.x+d.width) })
    .attr('y1', function(d){ return yScaleCP(d.y) })
    .attr('x2', function(d){ return xScaleCP(d.x+d.width) })
    .attr('y2', function(d){ return yScaleCP(d.y+d.height) });

  texts.transition().duration(dur)
    .attr('x', function(d){ return xScaleCP(d.x + d.width/2) })
    .attr('y', function(d){ return yScaleCP(d.y + d.height + 0.05) });

  circles.selectAll('g').each(function(){
    d3v3.select(this).transition().duration(dur)
      .attr('transform', function(d){return 'translate(' + xScaleCP(d.p) + ',0)'});
  })

  probRects.transition().duration(dur)
    .attr('x', function(d,i){ return xScaleProbCP(i); })
    .attr('y', function(d,i){ return yScaleProbCP(calcOverlap(i,currentPerspective)/xWidthCP.domain()[1]); })
    .attr('width', function(d,i){ return xScaleProbCP.rangeBand(); })
    .attr('height', function(d,i){ return yScaleProbCP(1-calcOverlap(i,currentPerspective)/xWidthCP.domain()[1]); });

  //calcIndependence();
}
function calcP(data) {
  numappearances = data["number"]

  var min = freq.slice(0,numappearances).reduce(add,0)/sumall
  var max = freq.slice(0,numappearances+1).reduce(add,0)/sumall
 return Math.random() * (max - min) + min;
}
//Drops ball randomly from 0 to 1
function addBall(data, data2, ic){
  //console.log(data);
  var dur = 2500;
  //var p = Math.random();
  var p = calcP(data2[ic]);
  var pos = [{t: 0}, {t: 1}];
  var a, b, c, dd, e, f, events = [];
  var bisector = d3v3.bisector(function(d){ return d.t }).right

  if(data[0].x <= p && p <= data[0].x + data[0].width) a = data[0]
  if(data[1].x <= p && p <= data[1].x + data[1].width) b = data[1]
  if(data[2].x <= p && p <= data[2].x + data[2].width) c = data[2]
  if(data[3].x <= p && p <= data[3].x + data[3].width) dd = data[3]
  if(data[4].x <= p && p <= data[4].x + data[4].width) e = data[4]
  if(data[5].x <= p && p <= data[5].x + data[5].width) f = data[5]
  if(a) pos.splice(bisector(pos) - 1, 0, { t: a.y, event: a.name})
  if(b) pos.splice(bisector(pos) - 1, 0, { t: b.y, event: b.name})
  if(c) pos.splice(bisector(pos) - 1, 0, { t: c.y, event: c.name})
  if(dd) pos.splice(bisector(pos) - 1, 0, { t: dd.y, event: dd.name})
  if(e) pos.splice(bisector(pos) - 1, 0, { t: e.y, event: e.name})
  if(f) pos.splice(bisector(pos) - 1, 0, { t: f.y, event: f.name})
  if(a) events.push(a)
  if(b) events.push(b)
  if(c) events.push(c)
  if(dd) events.push(dd)
  if(e) events.push(e)
  if(f) events.push(f)
  //console.log(events);
  var g = circles.append('g').datum({p: p, events: events, cycle: data2[ic]["cycle"], contestant: data2[ic]["contestant"], number: data2[ic]["number"] })
      .attr('transform', function(d){return 'translate(' + xScaleCP(d.p) + ',0)'})
  var circle = g.append('circle')
                .attr('r', radius)
                .attr('cy', function(){ return yScaleCP(0) })
                .on("mouseover", function(d,i) { tipBall.show(d,i,this);}).on("mouseout", function() { tipBall.hide();});;

  pos.forEach(function(d, i){
    if(i === 0) return
    var dt = pos[i].t - pos[i - 1].t
    circle = circle
      .transition()
      .duration(dur * dt)
      .ease('bounce')
      .attr('cy', function(){ return yScaleCP(d.t) -10})
      .each('end', function(){ if(d.event) d3v3.select(this).classed(d.event, true) })
  })
 
}

//Start and Stop ball sampling
var interval;
function start() {
  var ic = 0
  interval = setInterval(function() { 
    addBall(eventsData, data, ic);
    if (++ic === data.length) {
       window.clearInterval(interval);
      }
  }, 100);
}
function stop() {
  clearInterval(interval);
  d3v3.select(".ball").selectAll("circle").remove();
  
}

//Handles start and stop buttons
$('.ballBtns').on('click', function(){
  var button = d3v3.select(this).attr('id');
  if(button=='start') start();
  if(button=='stop')  stop();
  $('#start').toggle();
  $('#stop').toggle(); 
})

//Handle Perspective Buttons
$('.perspective').on('click', function(){
  $('#'+currentPerspective).toggleClass('active');
  $(this).toggleClass('active');
  changePerspective(d3v3.select(this).attr('id'));
  updateRects(1000);
})

//Changes Perspective
function changePerspective(p){
  if(p=='a' && eventsData[0].width) {
    xScaleCP.domain([eventsData[0].x,(eventsData[0].x+eventsData[0].width)]);
    xWidthCP.domain([0,eventsData[0].width]);
    currentPerspective = 'a';
    mapper = {0: "P(A|A)", 1: "P(B|A)", 2: "P(C|A)"};
  } else if(p=='b' && eventsData[1].width) {
    xScaleCP.domain([eventsData[1].x,(eventsData[1].x+eventsData[1].width)]);
    xWidthCP.domain([0,eventsData[1].width]);
    currentPerspective = 'b';
    mapper = {0: "P(A|B)", 1: "P(B|B)", 2: "P(C|B)"};
  } else if(p=='c' && eventsData[2].width) {
    xScaleCP.domain([eventsData[2].x,(eventsData[2].x+eventsData[2].width)]);
    xWidthCP.domain([0,eventsData[2].width]);
    currentPerspective = 'c';
    mapper = {0: "P(A|C)", 1: "P(B|C)", 2: "P(C|C)"};
  } else if (p=='universe') {
    xScaleCP.domain([0,1]);
    xWidthCP.domain([0,1]);
    currentPerspective = 'universe';
    mapper = {0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5"};
  }
  probAxis.call(xAxis);
}


//Calculates overlap of rectangles
function calcOverlap(index, perspective){
  var a1,a2;
  if(perspective=='a') { 
    a1 = eventsData[0].x; 
    a2 = a1 + eventsData[0].width;
  } else if(perspective=='b') { 
    a1 = eventsData[1].x; 
    a2 = a1 + eventsData[1].width;
  } else if(perspective=='c') { 
    a1 = eventsData[2].x; 
    a2 = a1 + eventsData[2].width;
  } else if (perspective=='universe') {
    a1 = 0; 
    a2 = 1;
  }
  
  var b1 = eventsData[index].x;
  var b2 = b1 + eventsData[index].width;

  var overlap = 0
  // if b1 is between [a1, a2]
  if(a1 <= b1 && b1 <= a2){
    // b is entirely inside of a
    if(b2 <= a2){
      overlap = b2 - b1
    }else {
      overlap = a2 - b1
    }
  }
  // if b2 is between [a1, a2]
  else if(a1 <= b2 && b2 <= a2){
    if(b1 <= a1){
      overlap = b2 - a1
    }else{
      overlap = b2 - b1
    }
  }
  // if b1 is left of a1 and b2 is right of a2
  else if(b1 <= a1 && a2 <= b2) {
    overlap = a2 - a1
  }
  return overlap
}

//Check if event pairs are Independent
// function calcIndependence(){
//   if(round(calcOverlap(0,'b')/eventsData[1].width,2) == round(eventsData[0].width,2)) {
//     $('#AB').html('independent');
//   } else {
//     $('#AB').html('dependent');
//   }
//   if(round(calcOverlap(1,'c')/eventsData[2].width,2) == round(eventsData[1].width,2)) {
//     $('#BC').html('independent');
//   } else {
//     $('#BC').html('dependent');
//   }
//   if(round(calcOverlap(2,'a')/eventsData[0].width,2) == round(eventsData[2].width,2)) {
//     $('#CA').html('independent');
//   } else {
//     $('#CA').html('dependent');
//   }
// }

//Draws SVG and elements according to width
function drawCP() {
  var w = d3v3.select('#svgBallCP').node().clientWidth;
  var wProb = d3v3.select('#svgProbCP').node().clientWidth;
  var h = 500;
  var hProb = 200;
  var padding = 20;

  //Update svg size
  svgBallCP.attr("width", w).attr("height", h).call(tipBall);
  svgProbCP.attr("width", wProb).attr("height", hProb).call(tipCP);

  //Update Clip Path
  clipCP.attr("x", 0).attr("y", 0).attr("width", w-2*padding).attr("height", h-2*padding);

  //Update Container
  containerBallCP.attr("transform", "translate(" + padding + "," + padding + ")");
  containerProbCP.attr("transform", "translate(" + padding + "," + padding + ")");

  //Update Scale Range
  xScaleCP.range([0, (w - 2*padding)]);
  xWidthCP.range([0, (w - 2*padding)]);
  yScaleCP.range([0, (h-2*padding)]);

  xScaleProbCP.rangeRoundBands([0, wProb - 2*padding], .5);
  yScaleProbCP.range([hProb-2*padding, 0]);

  //Update Axis
  probAxis.attr("transform", "translate(" + 0 + "," + (hProb-2*padding+1) + ")").call(xAxis);

  //Update Rectangles
  changePerspective(currentPerspective);
  updateRects(0)
}
function add(a, b) {
    return a + b;
}

drawCP();
start();
});