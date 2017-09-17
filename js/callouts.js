var margin = {top: 10, right: 10, bottom: 30, left: 50},
 	padding = {top: 40, right: 20, bottom: 40, left: 30},
 	outerWidth = 350,
    outerHeight = 300,
    innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom,
    width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom;


			
  
/*var svg = d3.select(#
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");*/

//for (i = 1; i < 24; i++) { //cycle

queue = d3.queue()
var tip = d3.select("#calloutgraph").append("div")	
	    	.attr("class", "tooltip");
for (var i = 1; i < 24; i++) { //cycle
	url = 'data/calloutavgs' + i + '.csv'
    queue.defer(d3.csv, url);

}
queue.await(ready);	
function ready(error, d1, d2, data3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20, d21, d22, d23) {
	
	
	cyclearrays = [d1, d2, data3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20, d21, d22, d23];
	//console.log(cyclearrays[0]);
	//console.log(cyclearrays[1]);
	svgs = []
	gs = []
	for (var i = 1; i < 24; i++) {
		//console.log("cycle : " + i);
		var x = d3.scaleLinear().range([0, width]);
		var y = d3.scaleLinear().range([height, 0]);
		//console.log(data);
		//console.log(cyclearrays[i-1])
		lines = []
		for (var n = 0; n < cyclearrays[i-1].length; n++) {
			//console.log("getting here");
			lines[n] = d3.line()
			.x(function(d) {  return x(d.week);})
			.y(function(d) {  return y(d.value);});
		}
		//console.log(lines);
				
				
		svgs[i] = d3.select("#calloutgraph").append("svg")
			.attr("class", 'calloutgraphs')
		    .attr("width", outerWidth)
		    .attr("height", outerHeight)
		    .attr("padding", 30);

		gs[i] = svgs[i].append("g")
		 	.attr("width", 250)
		    .attr("height", innerHeight)
		    .attr("transform"	,
		          "translate(" + 50 + "," + 50 + ")");
		
		svgs[i].append("g")
			.attr("transform", "translate(" + ((outerWidth/2) - 15) + ", 30)")
			.append('text')
			.style("font-weight", "bold")
			.text("Cycle " + i);
		svgs[i].append("text")
	        .attr("transform", "translate(" + (outerWidth / 2) + " ," + (outerHeight - 30) + ")")
	        .style("text-anchor", "middle")
	        .text("Week");
        svgs[i].append("text")
	        .attr("transform", "rotate(-90)")
	        .attr("y", 0 + (margin.left/2)-10)
	        .attr("x",0 - (outerHeight / 2)+5)
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .text("Callout ");
		numweeks = d3.max(cyclearrays[i-1], function(d, i) {
			count = 0;
			//console.log(d);
			for (var key in d) {
				if (d.hasOwnProperty(key)) {
					if (d[key] != 0) {
						count++;
					}
				}
			}
			return count;
		}) - 2;
		//console.log("numweeks: " + numweeks);
		domain = []
		for (var k = 1; k <= numweeks; k++) {
			domain.push("Week " + k);
		}
		x.domain([1, numweeks]);
		
		y.domain(d3.extent(cyclearrays[i-1], function(d, i) { 
			//console.log(d["Week 1"]);
			return +d["Week 1"];}).reverse());

		//console.log(cyclearrays[i-1][l]);
		for (var l = 0; l < cyclearrays[i-1].length; l++) { //go through all girls
			//console.log(cyclearrays[i-1][l]);
			data = []
			for (var q = 0; q < numweeks; q++) { //go through all weeks
				
				if (cyclearrays[i-1][l]["Week " + String(q+1)] != 0) {
					weekobj = {};
					weekobj["week"] = q+1;
					weekobj["value"] = +cyclearrays[i-1][l]["Week " + String(q+1)];

				}
				
				weekobj['name'] = cyclearrays[i-1][l]['contestant']
				data.push(weekobj);
			}
			
	
			//console.log(lines[l].x());
			//console.log(data);
			gs[i].append("path")
		      .data([data])
		      .attr("d", lines[l])
		      .attr("class", "line")
		      .on("mouseover", function(data) {
     				tip.html(data[0]['name'])
     				 .style("left", (d3.event.pageX) + "px")		
                	 .style("top", (d3.event.pageY - 28) + "px")
                	 .style("opacity", "0.8")	
		      })
		      .on("mouseout", function(d) {		
            	tip.transition()		
                .duration(500)		
                .style("opacity", "0");	
        });
		    
		    //console.log("appended path");
		}

		

		gs[i].append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));
	    gs[i].append("g")
      		.call(d3.axisLeft(y));
	}

}