function processData(data) {
    var newDataSet = [];
    for(var i = 0; i<data.length; i++) {
        var obj = data[i];
      	newDataSet.push({cycle: obj.cycle, contestant: obj.contestant, place: obj.place});
    }
    return {children: newDataSet};
}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

diameter = 250
parentsvg = d3.select("#earlybottomtwograph")


var bottomtwotip = d3.select("#earlybottomtwo")
		.append("div")
        .attr("class", "bubbletooltip")
        .style("opacity", 1);

d3.csv("data/firstbottomtwo.csv", function(error, data) {
	grouped_data = d3.nest()
		.key(function(d) { return +d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
	}).entries(data);
	
	grouped_data = grouped_data.map(function(d) { return {key: +d.key, value: +d.value} })
	grouped_data = grouped_data.sort(function(x, y){
  		 return d3.ascending(x.key, y.key);
	})

	//tall rectangles
	magentascale = d3.scaleLinear()
					.domain(d3.extent(grouped_data, function(d) { return d.key; }))
					.range(['#B33097', '#EAD9D7'])

	tallrectgelement = parentsvg
					.append('g')
					.attr('width', diameter)
					.attr('height', 100)
					.attr("transform", "translate(270,150)");

	barWidth = 35
	barHeight = 150
	barwidthscale = d3.scaleLinear()
    	.domain([0, d3.max(grouped_data, function(d) { return d.value;})])
    	.range([0, 54])

	var bar = tallrectgelement.selectAll("g")
      .data(grouped_data)
    .enter().append("g")
      .attr("transform", function(d, i) {
      	var offset = d3.sum(grouped_data.slice(0,i), function(d) { return barwidthscale(d.value); })
      	return "translate(" + offset + ",0)"; });

   
	bar.append("rect")
	    .attr("width", function(d) { return barwidthscale(d.value) - 1; })
	    .attr("height", barHeight)
	    .style("fill", function(d) { return magentascale(d.key); });

	//bubble chart

	circlegelement = parentsvg
					.append('g')
					.attr('width', diameter)
					.attr('height', diameter)
					.attr("transform", "translate(250,0)");

	var bottomtwopack = d3.pack()
        .size([diameter, diameter]);

	var bottomtworoot = d3.hierarchy(processData(data))
      .sum(function(d) { return 1; })

	var visbubbles = circlegelement.selectAll("g")
	    .data(bottomtwopack(bottomtworoot).descendants())

	
	
	
	visbubbles.enter()
		.filter(function(d){ return !d.parent; })
		.append('circle')
		.attr("r", function(d) { return d.r; })
    	.attr("transform", function(d) { return "translate(" + (d.x+(d.children[0].r)) + "," + (d.y+(d.children[0].r)) + ")"; })
		.style("stroke", "black")
		.style("fill", "white");
	visbubbles.enter()
		.filter(function(d){ return d.parent; })
		.append('image')
		.attr("xlink:href", function(d){
			return 'images/onephotocircle.png';})
		.attr("width", function(d) { return 2*d.r; })
    	.attr("height", function(d) { return 2*d.r; })
	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	    .on("mouseover", function(d) {
	    	console.log(d.data);
            bottomtwotip.html(d.data.contestant + " from Cycle " + d.data.cycle + " : " + ordinal_suffix_of(d.data.place))
            .style("left", (d3.event.pageX) + "px")    
            .style("top", (d3.event.pageY) + "px")
            bottomtwotip.transition()		
                .duration(200)		
                .style("opacity", 1);		
            
          }).on("mouseout", function(d) {		
            bottomtwotip.transition()		
                .duration(200)		
                .style("opacity", "0");	
        });

	//trapezoids

	bottomscale = d3.scaleLinear()
		.domain([0, d3.max(grouped_data, function(d) { return d.value;})])
		.range([0,150])

	trapezoidgelement = parentsvg
					.append('g')
					.attr('width', diameter*2)
					.attr('height', diameter + 100)
					.attr("transform", "translate(200,150)");
	 var polygonline = d3.line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      });

    points = []
    for (var i = 0; i < grouped_data.length; i++) {
    	obj = []
		topleftcorner = {x: 70 + d3.sum(grouped_data.slice(0,i), function(d) { return barwidthscale(d.value);}), y: 151};
		toprightcorner = {x: 70 + d3.sum(grouped_data.slice(0,i+1), function(d) { return barwidthscale(d.value);}) - 1, y: 151};
		bottomleftcorner = {x: -125 + d3.sum(grouped_data.slice(0,i), function(d) { return bottomscale(d.value);}), y: 300};
		bottomrightcorner = {x: -125 + d3.sum(grouped_data.slice(0,i+1), function(d) { return bottomscale(d.value);}) -10, y: 300};
		obj.push(bottomleftcorner);
		obj.push(bottomrightcorner);
		obj.push(toprightcorner);
		obj.push(topleftcorner);
		points.push(obj);
    }

    //bottom rectangles
 
      
    for (var i = 0; i < grouped_data.length; i++) {
	    trapezoidgelement.append('path')
	      .attr("d", polygonline(points[i]) + 'Z')
	      .style("fill", function(d) { return magentascale(grouped_data[i].key)});
	}
	  

	//bottom rectangles
	bottomrectangles = parentsvg
		.append('g')
		.attr('width', diameter*2)
		.attr('height', diameter + 100)
		.attr("transform", "translate(75,400)");

	var bottomrects = bottomrectangles.selectAll("g")
      .data(grouped_data)
    .enter().append("g")
      .attr("transform", function(d, i) {
      	var offset = d3.sum(grouped_data.slice(0,i), function(d) { return bottomscale(d.value); })
      	return "translate(" + offset + ",50)"; });

   
	bottomrects.append("rect")
	    .attr("width", function(d) { return bottomscale(d.value) - 10; })
	    .attr("height", 40)
	    .style("fill", function(d) { return magentascale(d.key); })
	    .style("stroke", "black");

	bottomrects.append("text")
      .attr("x", function(d) { return bottomscale(d.value)/2 - 10; })
      .attr("y", 20)
      .attr("dy", ".35em")
      .text(function(d) { return d.value; });

    bottomrects.append("text")
      .attr("x", function(d) { return bottomscale(d.value)/2 - 15; })
      .attr("y", -10)
      .attr("dy", ".35em")
      .text(function(d) { 
      	if (d.key == 2) {
      		return "2nd";
      	}
      	else {
      		return d.key + "th"; }});

	        


	


});