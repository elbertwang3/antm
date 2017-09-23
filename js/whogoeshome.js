var wghsvg = d3v3.select('#whogoeshomesvg')
var wghwidth = 960,
    wghheight = 500;
wghsvg.append("text")
		  .attr('x', 50)
		  .attr('y', 0)
		    .attr('dy', 20)
		  .text("The contestant with the better callout average was eliminated.")
		   .call(wrap, 250)
		   .style("opacity", 0)
		   .transition()
		   .duration(3000)
		    .style("opacity", 1)

		wghsvg.append("text")
		  .attr('x', 380)
		  .attr('y', 0)
		  .attr('dy', 20)
		  .text("Both contestants had equal an call-out average at elimination.")
		  .call(wrap, 250)
		   .style("opacity", 0)
		   .transition()
		   .duration(3000)
		    .style("opacity", 1);
		wghsvg.append("text")
		  .attr('x', 670)
		  .attr('y', 0)
		    .attr('dy', 20)
		  .text("The contestant with the worse callout average was eliminated.")
		   .call(wrap, 250)
		    .style("opacity", 0)
		   .transition()
		   .duration(3000)
		    .style("opacity", 1);
/*wghsvg.append("text")
	.attr("class", "toplabel")
	.attr("x", 480)
	.attr("y", 20)
	.text("hello");*/

var wghtip = wghsvg.append("text")  
				.attr("x", wghwidth/2)    
                  .attr("y", 20)
                 .attr("text-anchor", "middle")

var wghtip2 = wghsvg.append("text")  
				.attr("x", wghwidth/2)    
                  .attr("y", 40)
                 .attr("text-anchor", "middle")

function wrap(text, width) {
	  text.each(function() {
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 1.1, // ems
	        x = text.attr("x")
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
	    while (word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	      }
	    }
	  })};
d3.csv('data/whogoeshome.csv', function(error,d) {

	var data = d.map(function(x) {  
		//return {x.eliminated, +x.eliminatedavg, x.bottomtwo, +x.bottomtwoavg};
		return {eliminated: x.eliminated, eliminatedavg: +x.eliminatedavg, bottomtwo: x.bottomtwo, bottomtwoavg: +x.bottomtwoavg};
	})
	//console.log(data);
	var elimlesscount = 0;
	var elimmorecount = 0;
	var equalcount = 0;
	/*var wghnodes = d3.range(d.length).map((j) => {
			//console.log(data[j]);
			var i;

			if (data[j].eliminatedavg < data[j].bottomtwoavg) {
				i = 0;
				elimlesscount += 1;
				
			}
			else if (data[j].eliminatedavg == data[j].bottomtwoavg) {
				i = 2;
				equalcount += 1;

			}
			else {
				i = 1;
				elimmorecount += 1;
			}
   
	        //var radius = radiusScale((data[j].eliminatedavg + data[j].bottomtwoavg)/2);
	        radius = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * wghmaxRadius;
	        //console.log("radius:" + radius);
	        var wghd = {cluster: i, r: radius, eliminated: data[j].eliminated, bottomtwo: data[j].bottomtwo};
	    if (!clusters[i] || (radius > clusters[i].r)) clusters[i] = wghd;
	    return wghd;
	});
	*/

	

	var fill = d3v3.scale.category10();

	var nodes = [],
	    foci = [{x: 240, y: 250}, {x: 520, y: 250}, {x: 720, y: 250}];

	


	

	var force = d3v3.layout.force()
	    .nodes(nodes)
	    .links([])
	    .gravity(0)
	    .size([wghwidth, wghheight])
	    .on("tick", tick);

	var node = wghsvg.selectAll("circle");

	function tick(e) {
	  var k = .1 * e.alpha;

	  // Push nodes toward their designated focus.
	  nodes.forEach(function(o, i) {
	    o.y += (foci[o.id].y - o.y) * k;
	    o.x += (foci[o.id].x - o.x) * k;
	  });

	  node
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	}

	var ic = 0
	var intervalID = setInterval(function(){
		var id = determineId(ic)
	
		//console.log(id);
		nodeobj = {id: id, eliminated: data[ic].eliminated, eliminatedavg: +data[ic].eliminatedavg, bottomtwo: data[ic].bottomtwo, bottomtwoavg: +data[ic].bottomtwoavg};
	  nodes.push(nodeobj);
	  force.start();

	  node = node.data(nodes);

	  node.enter().append("circle")
	      .attr("class", "node")
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; })
	      .attr("r", 6)
	      .style("fill", function(d) { return fill(d.id); })
	      .style("stroke", function(d) { return d3v3.rgb(fill(d.id)).darker(2); })
	      .call(force.drag)
	      .on("mouseover", function(d) {
	      	console.log(d);
            wghtip.html("Who was eliminated: " + d.eliminated + " - " + Math.round(d.eliminatedavg * 100) / 100)
          
            wghtip.transition()   
                .duration(300)     
                 .style("opacity", "1")
            wghtip2.html("Who was saved: " + d.bottomtwo + " - " + Math.round(d.bottomtwoavg * 100) / 100)
          
            wghtip2.transition()   
                .duration(300)     
                 .style("opacity", "1")

      })
      .on("mouseout", function(d) {   
            wghtip.transition()    
                .duration(500)    
                .style("opacity", "0"); 
                wghtip2.transition()    
                .duration(500)    
                .style("opacity", "0"); 
      });



      /*d3.select(".toplabel")
      .transition()
       .style("opacity", 0)
		.text("");*/
			          
		/*d3.select(".toplabel")
          .style("opacity", 0)
          .text(data[ic].eliminated)
        .transition()
       
          .style("opacity", 1)*/
        
    
	       

	  if (++ic === data.length) {
	  	console.log(ic);
       window.clearInterval(intervalID);
       
   }
	}, 500);

	


	
	function determineId(intervalcounter) {
		if (data[intervalcounter].eliminatedavg < data[intervalcounter].bottomtwoavg) {		
			elimlesscount += 1;
			return 0;
		}
		else if (data[intervalcounter].eliminatedavg == data[intervalcounter].bottomtwoavg) {
			equalcount += 1;
			return 1;
		}
		else {
			elimmorecount += 1;
			return 2;
		}
	}
});



