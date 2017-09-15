function processData(data) {
    var newDataSet = [];
    for(var i = 0; i<data.length; i++) {
        var obj = data[i];
      	newDataSet.push({cycle: obj.cycle, contestant: obj.contestant, FCO: obj.FCO, place: obj.place});
    }
    return {children: newDataSet};
}

diameter = 250
parentsvg2 = d3.select("#mostFCOgraph")
console.log(parentsvg._groups[0][0].clientWidth/2);
circlegelement2 = parentsvg2
					.append('g')
					.attr('width', diameter)
					.attr('height', diameter)
					.attr("transform", "translate(250,0)");

var mostFCOtip = d3.select("#circleggraph").append("div")  
        .attr("class", "tooltip");

d3.csv("data/mostFCOplace.csv", function(error, data) {
	grouped_data = d3.nest()
		.key(function(d) { return d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
	}).entries(data);
	
	console.log(data);
	console.log(grouped_data);

	var mostFCOpack = d3.pack()
        .size([diameter, diameter]);

	var mostFCOroot = d3.hierarchy(processData(data))
      .sum(function(d) { return 1; })

	var vis2 = circlegelement2.selectAll("circle")
	    .data(mostFCOpack(mostFCOroot).descendants())

	vis2.enter()
		.filter(function(d){ return !d.parent; })
		.append('circle')
		.attr("r", function(d) { return d.r; })
    	.attr("transform", function(d) { console.log(d.children[0].r); return "translate(" + (d.x+(d.children[0].r)) + "," + (d.y+(d.children[0].r)) + ")"; })
		.style("stroke", "black")
		.style("fill", "white");
	vis2.enter()
		.filter(function(d){ return d.parent; })
		.append('image')
		.attr("xlink:href", function(d){
			return 'images/circlenum1.gif';})
		.attr("width", function(d) { return 2*d.r; })
    	.attr("height", function(d) { return 2*d.r; })
	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	    .on("mouseover", function(d) {
	    	console.log("getting moused over");
            bottomtwotip.html(d.data.contestant)
            .style("left", (d3.event.pageX) + "px")    
            .style("top", (d3.event.pageY - 28) + "px")
            .style("opacity", "1");
          })
	
});