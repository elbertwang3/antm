function processData(data) {
    var newDataSet = [];
    for(var i = 0; i<data.length; i++) {
        var obj = data[i];
      	newDataSet.push({cycle: obj.cycle, contestant: obj.contestant, place: obj.place});
    }
    return {children: newDataSet};
}

diameter = 250
parentsvg = d3.select("#earlybottomtwograph")
console.log(parentsvg._groups[0][0].clientWidth/2);


var bottomtwotip = d3.select("body")
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
	console.log(grouped_data);

	//tall rectangles
	magentascale = d3.scaleLinear()
					.domain(d3.extent(grouped_data, function(d) { return d.key; }))
					.range(['#B33097', '#EAD9D7'])

	tallrectgelement = parentsvg
					.append('g')
					.attr('width', diameter)
					.attr('height', diameter + 100)
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
      	console.log(offset) 
      	return "translate(" + offset + ",0)"; });

   
	bar.append("rect")
	    .attr("width", function(d) { console.log(barwidthscale(d.value)); return barwidthscale(d.value) - 1; })
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
            bottomtwotip.html(d.data.contestant + " from Cycle " + d.data.cycle)
            .style("left", (d3.event.pageX) + "px")    
            .style("top", (d3.event.pageY) + "px")
            
          })
	vis.enter()
		.filter(function(d){ return !d.parent; })
		.append('circle')
		.attr("r", function(d) { return d.r; })
    	.attr("transform", function(d) { console.log(d.children[0].r); return "translate(" + (d.x+(d.children[0].r)) + "," + (d.y+(d.children[0].r)) + ")"; })
		.style("stroke", "black")
		.style("fill", "white");

	//trapezoids

	bottomscale = d3.scaleLinear()
		.domain(d3.extent(grouped_data, function(d) { return d.value;}))
		.range([0,100])

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
    	if (i == 0) {
    		topleftcorner = {x: 70, y: 150};
    		bottomleftcorner = {x: 0, y: 300};
    	}
    	else {
    		topleftcorner = {x: 70 + barwidthscale(grouped_data[i].value), y: 150};
    		toprightcorner = {x: 70 + barwidthscale(grouped_data[i+1].value, y: 150};
    		bottomrightcorner = {0 + bottomscale}
    	}
    	toprightcorner = topleftcorner.x + barwidthscale(grouped_data[i+1].value)
    	obj = []
    	obj.push({x: 0, y: 300})
    	obj.push({x: 70, y: 150})
    	points.push
    }
    var points = [{
        x: 0, y: 300
      },{
        x: 200, y: 200
      },{
        x: 101, y: 150
      },{
        x: 70, y: 150
      }];
      
    trapezoidgelement.append('path')
      .attr("d", polygonline(points) + 'Z')
      .style("fill", function(d) { return magentascale(d.key)});
  
        


	


});