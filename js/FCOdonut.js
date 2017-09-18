function cast(d) {
  d.num = +d.num || 0;
  d.place = +d.place || 0;
  return d;
}

var donutwidth = 900,
donutheight = 450,
donutradius = Math.min(donutwidth, donutheight) / 2;

var donutsvg = d3.select('#FCOdonutgraph')
	.append('g')
    .attr('transform', 'translate(' + donutwidth / 2 + ',' + donutheight / 2 + ')');

donutsvg.append("g")
	.attr("class", "slices");
donutsvg.append("g")
	.attr("class", "labelName");
donutsvg.append("g")
	.attr("class", "labelValue");
donutsvg.append("g")
	.attr("class", "lines");



var pie = d3.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
});

var arc = d3.arc()
	.outerRadius(donutradius * 0.8)
	.innerRadius(donutradius * 0.4);


var legendRectSize = (donutradius * 0.05);
var legendSpacing = donutradius * 0.02;

var donutTip = d3.select("#FCOdonut")
	.append("div")
	.attr("class", "toolTip");

var donutColorScale = d3.scaleLinear()
	.domain([1,16])
	.range(["#08306b", "white"]);



d3.csv("data/allFCOs.csv", cast, function(error, data) {
	numfirstcallouts = []
	sumnumfirstcallouts = []
	for (var i = 0; i < 7; i++) {
		numfirstcallouts.push([])
		//sumnumfirstcallouts.push([])
	}

	for (var i = 0; i < data.length; i++) {
		numfirstcallouts[data[i].num].push(data[i]);
	}
	console.log(numfirstcallouts);
	for (var i = 0; i < numfirstcallouts.length; i++) {
		sumnumfirstcallouts.push(d3.nest()
		.key(function(d) { return +d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
		}).entries(numfirstcallouts[i]));
		sumnumfirstcallouts[i] = sumnumfirstcallouts[i].map(function(d) { return {key: +d.key, value: +d.value} })
		//sumnumfirstcallouts[i]= sumnumfirstcallouts[i].map(function(d) { return {key: +d.key, value: +d.value/d3.sum(sumnumfirstcallouts[i], function(d) { return d.value; })} })
		sumnumfirstcallouts[i] = sumnumfirstcallouts[i].sort(function(x, y){
	  		return d3.ascending(x.key, y.key);
		})
		keysonly = sumnumfirstcallouts[i].map(function(d) { return +d.key});
		for (var j = 1; j < 17; j++) {
			if (keysonly.indexOf(j) == -1) {
				sumnumfirstcallouts[i].splice(j-1, 0, {key: j, value: 0})
			}
		}
	}
	//console.log(sumnumfirstcallouts)
	var slice = d3.select(".slices").selectAll("path.slice")
	        .data(pie(sumnumfirstcallouts[0]));//, function(d){ return d.data.key });
	    slice.enter()
	        .append("path")
	        .style("fill", function(d) { return donutColorScale(d.data.key); })
	        .attr("class", "slice")
	        .attr('d',arc)
	d3.selectAll('path.slice').call(donuttoolTip);

	
	
	d3.selectAll("input")
		.on("change", selectDataset);
	
	function selectDataset() {
		var value = +this.value;
		change(sumnumfirstcallouts[value])
	}
	
	change(sumnumfirstcallouts[0]);
	function change(newdata) {
		console.log(newdata);
	   	var updateSlice = d3.select('.slices').selectAll('path.slice');
	     var data0 = slice.data(), // store the current data before updating to the new
         	data1 = pie(newdata);
          updateslice = updateSlice.data(data1, key);

        updateSlice.enter().append('path.slice')
            .each(function(d, i) { this._current = findNeighborArc(i, data0, data1, key) || d; })
            .attr('fill', function(d) { return donutColorScale(d.data.key); })
            .attr('d', arc);
	   	
	   	updateSlice.exit()
            .transition()
            .duration(400)
            .attrTween("d", arcTween)
            .remove();

       	updateSlice.transition().duration(400)
            .attrTween('d', arcTween);


   
	};
	function donuttoolTip(selection) {
		selection.on('mouseover', function (d) {
			
			console.log(d);
            donutsvg.append('text')
                .attr('class', 'toolCircle')
                .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                .html(function() {
                	console.log(d.data);
                	if (d.data.key == 1) {
                		return d.data.key + "st place"
                	}
                	else if (d.data.key == 2) {
                		return d.data.key + "nd place";
                	}
                	else if (d.data.key == 3) {
                		return d.data.key + "rd place";
                	}
                	else {
                		return d.data.key + "th place";
                	}
                }) // add text to the circle.
                .style('font-size', '.0.45em')
                .style('text-anchor', 'middle'); // centres text in tooltip
            donutsvg.append('text')
                .attr('class', 'toolCircle')
                .attr('dy', 10) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                .html(function() {
                	
                		return d.data.value + " contestant(s)";
                	
                	
                }) // add text to the circle.
                .style('font-size', '.0.45em')
                .style('text-anchor', 'middle'); // centres text in tooltip

          

        });

        // remove the tooltip when mouse leaves the slice/label
        selection.on('mouseout', function () {
            d3.selectAll('.toolCircle').remove();
        });

	}
	function key(d) {
        return d.data.key;
    }
    function findNeighborArc(i, data0, data1, key) {
        var d;
        return (d = findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
            : (d = findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
                : null;
    }
    function arcTween(d) {
        var i = d3.interpolate(this._current, d);
        this._current = i(0);
        return function(t) { return arc(i(t)); };
    }
   

});