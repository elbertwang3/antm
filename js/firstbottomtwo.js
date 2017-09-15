function processData(data) {


    var newDataSet = [];


    for(var i = 0; i<data.length; i++) {
        var obj = data[i];
      	newDataSet.push({cycle: obj.cycle, contestant: obj.contestant, place: obj.place});
    }
    return {children: newDataSet};
}

diameter = 250
circlegelement = d3.select("#earlybottomtwograph")
					.append('g')
					.attr('width', diameter)
					.attr('height', diameter)

var bottomtwotip = d3.select("#circleggraph").append("div")  
        .attr("class", "tooltip");

d3.csv("data/firstbottomtwo.csv", function(error, data) {
	grouped_data = d3.nest()
		.key(function(d) { return d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
	}).entries(data);
	
	console.log(data);
	console.log(grouped_data);

	var bottomtwopack = d3.pack()
        .size([diameter, diameter]);

	var bottomtworoot = d3.hierarchy(processData(data))
      .sum(function(d) { return 1; })

	var vis = circlegelement.selectAll("g")
	    .data(bottomtwopack(bottomtworoot).descendants())


	vis.enter()
		.filter(function(d){ return d.parent; })
		.append('image')
		.attr("xlink:href", function(d){
			return 'images/onephotocircle.png';})
		.attr("width", function(d) { return 2*d.r; })
    	.attr("height", function(d) { return 2*d.r; })
	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	    .on("mouseover", function(d) {
            bottomtwotip.html(d.data.contestant)
             .style("left", (d3.event.pageX) + "px")    
                   .style("top", (d3.event.pageY - 28) + "px")
                   .style("opacity", "1");
          })
	vis.enter()
		.filter(function(d){ return !d.parent; })
		.append('circle')
		.attr("width", function(d) { return 2*d.r; })
    	.attr("height", function(d) { return 2*d.r; })
    	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.style("stroke", "black")
		.style("fill", "black");
});