var states = d3.select("#states"),
    width = +states.attr("width"),
    height = +states.attr("height");

var unemployment = d3.map();

var path = d3.geoPath();

var x = d3.scaleLinear()
    .domain([0, 50])
    .rangeRound([600, 860]);

var color = d3.scaleLinear()
    .domain([0, 50])
    .range(["white", "#08306b"]);
var g2 = states.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

g2.selectAll("rect")
  .data(d3.range(0, 50, 5))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d); })
    .attr("width", function(d) { return 26; })
    .attr("fill", function(d) { return color(d); });

g2.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Number of contestants");

g2.call(d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function(x, i) { return i ? x : x; })
    .tickValues(d3.range(0, 55, 5)))
  .select(".domain")
    .remove();

var names = {};
d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    //.defer(d3.csv, "data/states.csv", function(d) { unemployment.set(d.state, +d.count); })
    .defer(d3.csv, "data/states.csv")
    .defer(d3.tsv, "data/us-state-names.tsv", function(d, i) {   
      names[d.id] = d.name;
    })
    .await(ready);

function ready(error, us, d) {

  if (error) throw error;
  //console.log(us)
  //console.log(names);
  //console.log(d3.extent(d, function(d) { return +d.count}));

  for (i = 0; i < d.length; i++) {
    unemployment.set(d[i].state, +d[i].count);
  }
  //console.log(unemployment);
  //color.domain(d3.extent(d, function(d) { return +d.count}));

  state = states.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("d", path)
    .attr("fill", function(d) { 
        //console.log(names[+d.id]);
        //console.log(unemployment.get(names[+d.id]));
        //console.log(color(unemployment.get(names[+d.id])));
        return color(unemployment.get(names[+d.id]));
      })
      .attr("d", path)


  /*svg.append("path")
      .attr("class", "states")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));*/
  /*svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);*/
}
