function processDataFCO(data) {
    var newDataSet = [];
    for(var i = 0; i<data.length; i++) {
        var obj = data[i];
      	newDataSet.push({cycle: obj.cycle, contestant: obj.contestant, FCO: obj.FCO, place: obj.place});
    }
    return {children: newDataSet};
}

diameter = 250
parentsvg2 = d3.select("#mostFCOgraph")


var mostFCOtip = d3.select("#mostFCO").append("div")  
        .attr("class", "FCOtooltip");

d3.csv("data/mostFCOplace.csv", function(error, data) {
	grouped_data = d3.nest()
		.key(function(d) { return d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
	}).entries(data);
	grouped_data = grouped_data.map(function(d) { return {key: +d.key, value: +d.value} })
	grouped_data = grouped_data.sort(function(x, y){
  		 return d3.ascending(x.key, y.key);
	})


	//rects
	orangescale = d3.scaleLinear()
					.domain(d3.extent(grouped_data, function(d) { return d.key; }))
					.range(['#C45E2E', '#FBFBBF'])

	tallrectgelementfco = parentsvg2
					.append('g')
					.attr('width', diameter)
					.attr('height', 105)
					.attr("transform", "translate(267,150)");

	barWidth = 35
	barHeight = 150
	barwidthscalefco = d3.scaleLinear()
    	.domain([0, d3.max(grouped_data, function(d) { return d.value;})])
    	.range([0, 103])

	var barfco = tallrectgelementfco.selectAll("g")
      .data(grouped_data)
    .enter().append("g")
      .attr("transform", function(d, i) {
      	var offset = d3.sum(grouped_data.slice(0,i), function(d) { return barwidthscalefco(d.value); })
      	return "translate(" + offset + ",0)"; });

   
	barfco.append("rect")
	    .attr("width", function(d) { return barwidthscalefco(d.value) - 1; })
	    .attr("height", barHeight)
	    .style("fill", function(d) { return orangescale(d.key); });

	//bubbles
	circlegelement2 = parentsvg2
					.append('g')
					.attr('width', diameter)
					.attr('height', diameter)
					.attr("transform", "translate(250,0)");

	var mostFCOpack = d3.pack()
        .size([diameter, diameter]);

	var mostFCOroot = d3.hierarchy(processDataFCO(data))
      .sum(function(d) { return 1; })

	var vis2 = circlegelement2.selectAll("circle")
	    .data(mostFCOpack(mostFCOroot).descendants())

	vis2.enter()
		.filter(function(d){ return !d.parent; })
		.append('circle')
		.attr("r", function(d) { return d.r; })
    	.attr("transform", function(d) { return "translate(" + (d.x+(d.children[0].r)) + "," + (d.y+(d.children[0].r)) + ")"; })
		.style("stroke", "black")
		.style("fill", "white");
	vis2.enter()
		.filter(function(d){ return d.parent; })
		.append('image')
		.attr("xlink:href", function(d){
			return 'images/num1final.png';})
		.attr("width", function(d) { return 2*d.r; })
    	.attr("height", function(d) { return 2*d.r; })
	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	    .on("mouseover", function(d) {
            mostFCOtip.html(d.data.contestant + " from Cycle " + d.data.cycle)
            .style("left", (d3.event.pageX) + "px")    
            .style("top", (d3.event.pageY - 28) + "px");
            mostFCOtip.transition()		
                .duration(200)		
                .style("opacity", 1);		
            
          }).on("mouseout", function(d) {		
            mostFCOtip.transition()		
                .duration(200)		
                .style("opacity", "0");	
           });
          

	//trapezoids
	bottomscalefco = d3.scaleLinear()
		.domain([0, d3.max(grouped_data, function(d) { return d.value;})])
		.range([0,275])

	trapezoidgelementfco = parentsvg2
					.append('g')
					.attr('width', diameter*2)
					.attr('height', diameter + 100)
					.attr("transform", "translate(197,150)");
	 var polygonlinefco = d3.line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      });

    points = []
    for (var i = 0; i < grouped_data.length; i++) {
    	obj = []
		topleftcorner = {x: 70 + d3.sum(grouped_data.slice(0,i), function(d) { return barwidthscalefco(d.value);}), y: 151};
		toprightcorner = {x: 70 + d3.sum(grouped_data.slice(0,i+1), function(d) { return barwidthscalefco(d.value);}) - 1, y: 151};
		bottomleftcorner = {x: -125 + d3.sum(grouped_data.slice(0,i), function(d) { return bottomscalefco(d.value);}), y: 300};
		bottomrightcorner = {x: -125 + d3.sum(grouped_data.slice(0,i+1), function(d) { return bottomscalefco(d.value);}) -10, y: 300};
		obj.push(bottomleftcorner);
		obj.push(bottomrightcorner);
		obj.push(toprightcorner);
		obj.push(topleftcorner);
		points.push(obj);
    }

    //bottom rectangles
 
      
    for (var i = 0; i < grouped_data.length; i++) {
	    trapezoidgelementfco.append('path')
	      .attr("d", polygonlinefco(points[i]) + 'Z')
	      .style("fill", function(d) { return orangescale(grouped_data[i].key)});
	}

	bottomrectanglesfco = parentsvg2
		.append('g')
		.attr('width', diameter*2)
		.attr('height', diameter + 100)
		.attr("transform", "translate(72,400)");

	var bottomrectsfco = bottomrectanglesfco.selectAll("g")
      .data(grouped_data)
    .enter().append("g")
      .attr("transform", function(d, i) {
      	var offset = d3.sum(grouped_data.slice(0,i), function(d) { return bottomscalefco(d.value); })
      	return "translate(" + offset + ",50)"; });

   
	bottomrectsfco.append("rect")
	    .attr("width", function(d) { return bottomscalefco(d.value) - 10; })
	    .attr("height", 40)
	    .style("fill", function(d) { return orangescale(d.key); })
	    .style("stroke", "black");

	bottomrectsfco.append("text")
      .attr("x", function(d) { return bottomscalefco(d.value)/2 - 10; })
      .attr("y", 20)
      .attr("dy", ".35em")
      .text(function(d) { return d.value; });

    bottomrectsfco.append("text")
      .attr("x", function(d) { return bottomscalefco(d.value)/2 - 15; })
      .attr("y", -10)
      .attr("dy", ".35em")
      .text(function(d) { 
      	if (d.key == 2) {
      		return "2nd";
      	}
      	else if (d.key == 3) {
      		return "3rd";

      	}
      	else if (d.key == 1) {
      		return "1st";
      	}
      	else {
      		return d.key + "th"; }});

	
});