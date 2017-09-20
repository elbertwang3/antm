var wghmargin = {top: 100, right: 100, bottom: 100, left: 100};

var wghwidth = 960,
    wghheight = 500,
    wghpadding = 1.5, // separation between same-color circles
    wghclusterPadding = 50, // separation between different-color circles
    wghmaxRadius = 12;
    
var m = 3, // number of distinct clusters
    z = d3.scaleOrdinal(d3.schemeCategory20),
    clusters = new Array(m);

var radiusScale = d3.scaleLinear()
					.domain([3,13])
					.range([10,2])
var wghsvg = d3.select('#whogoeshomesvg')
    .append('g').attr('transform', 'translate(' + wghwidth / 2 + ',' + wghheight / 2 + ')');

d3.csv('data/whogoeshome.csv', function(error,d) {

	var data = d.map(function(x) {  
		//return {x.eliminated, +x.eliminatedavg, x.bottomtwo, +x.bottomtwoavg};
		return {eliminated: x.eliminated, eliminatedavg: +x.eliminatedavg, bottomtwo: x.bottomtwo, bottomtwoavg: +x.bottomtwoavg};
	})
	console.log(data);
	var elimlesscount = 0;
	var elimmorecount = 0;
	var equalcount = 0;
	var wghnodes = d3.range(d.length).map((j) => {
			//console.log(data[j]);
			var i;

			if (data[j].eliminatedavg < data[j].bottomtwoavg) {
				i = 0;
				elimlesscount += 1;
				console.log(data[j])
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
	        radius = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * wghmaxRadius,
	        console.log("radius:" + radius);
	        var d = {cluster: i, r: radius, eliminated: data[j].eliminated, bottomtwo: data[j].bottomtwo};
	    if (!clusters[i] || (radius > clusters[i].r)) clusters[i] = d;
	    return d;
	});
	console.log(elimlesscount);
	console.log(elimmorecount);
	console.log(equalcount);

	var wghcircles = wghsvg.append('g')
	      .datum(wghnodes)
	    .selectAll('.circle')
	      .data(d => d)
	    .enter().append('circle')
	      .attr('r', (d) => d.r)
	      .attr('fill', (d) => z(d.cluster))
	      .attr('stroke', 'black')
	      .attr('stroke-width', 1)
	      .call(d3.drag()
	        .on("start", dragstarted)
	        .on("drag", dragged)
	        .on("end", dragended));    

	var simulation = d3.forceSimulation(wghnodes)
	    .velocityDecay(0.2)
	    .force("x", d3.forceX().strength(.0005))
	    .force("y", d3.forceY().strength(.0005))
	    .force("collide", collide)
	    .force("cluster", clustering)
	    .on("tick", ticked);
	function ticked() {
	    wghcircles
	        .attr('cx', (d) => d.x)
	        .attr('cy', (d) => d.y);
	}   

	// These are implementations of the custom forces.
	function clustering(alpha) {
	    wghnodes.forEach(function(d) {
	      var cluster = clusters[d.cluster];
	      if (cluster === d) return;
	      var x = d.x - cluster.x,
	          y = d.y - cluster.y,
	          l = Math.sqrt(x * x + y * y),
	          r = d.r + cluster.r;
	      if (l !== r) {
	        l = (l - r) / l * alpha;
	        d.x -= x *= l;
	        d.y -= y *= l;
	        cluster.x += x;
	        cluster.y += y;
	      }  
	    });
	}

	function collide(alpha) {
	  var quadtree = d3.quadtree()
	      .x((d) => d.x)
	      .y((d) => d.y)
	      .addAll(wghnodes);

	  wghnodes.forEach(function(d) {
	    var r = d.r + wghmaxRadius + Math.max(wghpadding, wghclusterPadding),
	        nx1 = d.x - r,
	        nx2 = d.x + r,
	        ny1 = d.y - r,
	        ny2 = d.y + r;
	    quadtree.visit(function(quad, x1, y1, x2, y2) {

	      if (quad.data && (quad.data !== d)) {
	        var x = d.x - quad.data.x,
	            y = d.y - quad.data.y,
	            l = Math.sqrt(x * x + y * y),
	            r = d.r + quad.data.r + (d.cluster === quad.data.cluster ? wghpadding : wghclusterPadding);
	        if (l < r) {
	          l = (l - r) / l * alpha;
	          d.x -= x *= l;
	          d.y -= y *= l;
	          quad.data.x += x;
	          quad.data.y += y;
	        }
	      }
	      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
	    });
	  });
	}

	function dragstarted(d) {
	    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	    d.fx = d.x;
	    d.fy = d.y;
	}

	function dragged(d) {
	    d.fx = d3.event.x;
	    d.fy = d3.event.y;
	}

	function dragended(d) {
	    if (!d3.event.active) simulation.alphaTarget(0);
	    d.fx = null;
	    d.fy = null;
	} 
});


