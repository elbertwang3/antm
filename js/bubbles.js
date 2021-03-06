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
      .attr("class", function(d) { return d.children ? "parentnode" : "leafnode"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

      
  /*node.filter(function(d){ return d.parent; })
  	.on("mouseover", function(d) {
            bubbletip.html(d.data.name)
             .style("left", (d3.event.pageX) + "px")    
                   .style("top", (d3.event.pageY - 28) + "px")
                 .style("opacity", "1");
          })
      .on("mouseout", function(d) {		
            bubbletip.transition()		
                .duration(500)		
                .style("opacity", "0");	
        });*/


  node.filter(function(d){ return d.parent; }).append("circle")
      .attr("r", function(d) { return d.r; })

  d3.selectAll(".leafnode")
   .on("mouseover", function(d) {
        bubbletip.html(d.data.name)
         .style("left", (d3.event.pageX) + "px")    
               .style("top", (d3.event.pageY - 28) + "px");
        bubbletip.transition()   
            .duration(200)     
             .style("opacity", "1")
  })
  .on("mouseout", function(d) {   
        bubbletip.transition()    
            .duration(200)    
            .style("opacity", "0"); 
  });

  /*node.filter(function(d) { return !d.children; }).append("text")
      .attr("dy", "0.3em")
      .text(function(d) { return d.data.name.substring(0, d.r/2.3); });*/
});

var bchart = $("#bubbles"),
    baspect = bchart.width() / bchart.height(),
    bcontainer = bchart.parent();
$(window).on("resize", function() {
    var targetWidth = bcontainer.width();
    bchart.attr("width", targetWidth);
    bchart.attr("height", Math.round(targetWidth / baspect));
}).trigger("resize");





