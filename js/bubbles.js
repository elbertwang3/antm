var bubbles = d3.select("#bubbles"),
    diameter = +bubbles.attr("width"),
    g1 = bubbles.append("g").attr("transform", "translate(2,2)"),
    format = d3.format(",d");

var pack = d3.pack()
    .size([diameter - 100, diameter - 100]);

bubbles.append("text")
  .attr('x', 95)
  .attr('y', 40)
  .text("Eliminated at panel")

bubbles.append("text")
  .attr('x', 255)
  .attr('y', 85)
  .text("Disqualified")

bubbles.append("text")
  .attr('x', 335)
  .attr('y', 125)
  .text("Eliminated outside panel")

bubbles.append("text")
  .attr('x', 400)
  .attr('y', 250)
  .text("Won")

bubbles.append("text")
  .attr('x', 350)
  .attr('y', 300)
  .text("Quit")

var bubbletip = d3.select("#bubblesgraph").append("div")  
        .attr("class", "tooltip");


d3.json("data/bubbles.json", function(error, root) {
  if (error) throw error;

  root = d3.hierarchy(root)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

  var node = g1.selectAll(".node")
    .data(pack(root).descendants())
    .enter().append("g")
      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on("mouseover", function(d) {
            bubbletip.html(d.data.name)
             .style("left", (d3.event.pageX) + "px")    
                   .style("top", (d3.event.pageY - 28) + "px")
                   .style("opacity", "1");
          })



  node.filter(function(d){ return d.parent; }).append("circle")
      .attr("r", function(d) { return d.r; });

  /*node.filter(function(d) { return !d.children; }).append("text")
      .attr("dy", "0.3em")
      .text(function(d) { return d.data.name.substring(0, d.r/2.3); });*/
});





