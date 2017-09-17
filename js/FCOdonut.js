function cast(d) {
  d.num = +d.num || 0;
  d.place = +d.place || 0;
  return d;
}

var donutsvg = d3.select('#FCOdonutgraph')
	.append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

donutsvg.append("g")
	.attr("class", "slices");
donutsvg.append("g")
	.attr("class", "labelName");
donutsvg.append("g")
	.attr("class", "labelValue");
donutsvg.append("g")
	.attr("class", "lines");

var donutwidth = 960,
donutheight = 450,
donutradius = Math.min(width, height) / 2;

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


d3.selectAll("input")
	.on("change", selectDataset);
	
function selectDataset() {
	var value = this.value;
	switch(value) {
		case "zero":
			change(sumnofirstcallouts);
			break;
		case "one":
			change(sumonefirstcallouts)
			break;
		case "two":
			change(sumtwofirstcallouts)
			break;
		case "three":
			change(sumthreefirstcallouts)
			break;
		case "four":
			change(sumfourfirstcallouts)
			break;
		case "five":
			change(sumfivefirstcallouts)
			break;
		case "six":
			change(sumsixfirstcallouts)
			break;
		default:
			console.log("should not get here");
			break;
	}
}
d3.csv("data/allFCOs.csv", cast, function(error, data) {
	//console.log(data);
	nofirstcallouts = []
	onefirstcallouts = []
	twofirstcallouts = []
	threefirstcallouts = []
	fourfirstcallouts = []
	fivefirstcallouts = []
	sixfirstcallouts = []

	for (var i = 0; i < data.length; i++) {
		switch(data[i].num) {
			case 0:
				nofirstcallouts.push(data[i]);
				break;
			case 1:
				onefirstcallouts.push(data[i]);
				break;
			case 2:
				twofirstcallouts.push(data[i]);
				break;
			case 3:
				threefirstcallouts.push(data[i]);
				break;
			case 4:
				fourfirstcallouts.push(data[i]);
				break;
			case 5:
				fivefirstcallouts.push(data[i]);
				break;
			case 6:
				sixfirstcallouts.push(data[i]);
				break;
			default:
				console.log("should not get here");
				break;
		}
	}

	/*console.log(nofirstcallouts);
	console.log(onefirstcallouts);
	console.log(twofirstcallouts);
	console.log(threefirstcallouts);
	console.log(fourfirstcallouts);
	console.log(fivefirstcallouts);
	console.log(sixfirstcallouts);*/

	sumnofirstcallouts = d3.nest()
		.key(function(d) { return +d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
	}).entries(nofirstcallouts);
	
	sumnofirstcallouts = sumnofirstcallouts.map(function(d) { return {key: +d.key, value: +d.value} })
	sumnofirstcallouts = sumnofirstcallouts.map(function(d) { return {key: +d.key, value: +d.value/d3.sum(sumnofirstcallouts, function(d) { return d.value; })} })
	sumnofirstcallouts = sumnofirstcallouts.sort(function(x, y){
  		 return d3.ascending(x.key, y.key);
	})
	keysonly = sumnofirstcallouts.map(function(d) { return +d.key});
	for (var i = 1; i < 17; i++) {
		if (keysonly.indexOf(i) == -1) {
			sumnofirstcallouts.splice(i-1, 0, {key: i, value: 0})
		}
	}
	console.log(sumnofirstcallouts);

	sumonefirstcallouts = d3.nest()
		.key(function(d) { return +d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
	}).entries(onefirstcallouts);
	sumonefirstcallouts = sumonefirstcallouts.map(function(d) { return {key: +d.key, value: +d.value} })
	sumonefirstcallouts = sumonefirstcallouts.map(function(d) { return {key: +d.key, value: +d.value/d3.sum(sumonefirstcallouts, function(d) { return d.value; })}})
	sumonefirstcallouts = sumonefirstcallouts.sort(function(x, y){
  		 return d3.ascending(x.key, y.key);
	})
	keysonly = sumonefirstcallouts.map(function(d) { return +d.key});
	console.log(keysonly);
	for (var i = 1; i < 17; i++) {
		if (keysonly.indexOf(i) == -1) {
			sumonefirstcallouts.splice(i-1, 0, {key: i, value: 0})
		}
	}
	console.log(sumonefirstcallouts);

	sumtwofirstcallouts = d3.nest()
		.key(function(d) { return +d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
	}).entries(twofirstcallouts);
	sumtwofirstcallouts = sumtwofirstcallouts.map(function(d) { return {key: +d.key, value: +d.value} })
	sumtwofirstcallouts = sumtwofirstcallouts.map(function(d) { return {key: +d.key, value: +d.value/d3.sum(sumtwofirstcallouts, function(d) { return d.value;})}})
	sumtwofirstcallouts = sumtwofirstcallouts.sort(function(x, y){
  		 return d3.ascending(x.key, y.key);
	})
	keysonly = sumtwofirstcallouts.map(function(d) { return +d.key});
	console.log(keysonly);
	for (var i = 1; i < 17; i++) {
		if (keysonly.indexOf(i) == -1) {
			sumtwofirstcallouts.splice(i-1, 0, {key: i, value: 0})
		}
	}
	console.log(sumtwofirstcallouts);

	sumthreefirstcallouts = d3.nest()
		.key(function(d) { return +d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
	}).entries(threefirstcallouts);
	sumthreefirstcallouts = sumthreefirstcallouts.map(function(d) { return {key: +d.key, value: +d.value} })
	sumthreefirstcallouts = sumthreefirstcallouts.map(function(d) { return {key: +d.key, value: +d.value/d3.sum(sumthreefirstcallouts, function(d) { return d.value;})}})
	sumthreefirstcallouts = sumthreefirstcallouts.sort(function(x, y){
  		 return d3.ascending(x.key, y.key);
	})
	keysonly = sumthreefirstcallouts.map(function(d) { return +d.key});
	console.log(keysonly);
	for (var i = 1; i < 17; i++) {
		if (keysonly.indexOf(i) == -1) {
			sumthreefirstcallouts.splice(i-1, 0, {key: i, value: 0})
		}
	}
	console.log(sumthreefirstcallouts);

	sumfourfirstcallouts = d3.nest()
		.key(function(d) { return +d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
	}).entries(fourfirstcallouts);
	sumfourfirstcallouts = sumfourfirstcallouts.map(function(d) { return {key: +d.key, value: +d.value} })
	sumfourfirstcallouts = sumfourfirstcallouts.map(function(d) { return {key: +d.key, value: +d.value/d3.sum(sumfourfirstcallouts, function(d) { return d.value;})}})
	sumfourfirstcallouts = sumfourfirstcallouts.sort(function(x, y){
  		 return d3.ascending(x.key, y.key);
	})
	keysonly = sumfourfirstcallouts.map(function(d) { return +d.key});
	console.log(keysonly);
	for (var i = 1; i < 17; i++) {
		if (keysonly.indexOf(i) == -1) {
			sumfourfirstcallouts.splice(i-1, 0, {key: i, value: 0})
		}
	}
	console.log(sumfourfirstcallouts);

	sumfivefirstcallouts = d3.nest()
		.key(function(d) { return +d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
	}).entries(fivefirstcallouts);
	sumfivefirstcallouts = sumfivefirstcallouts.map(function(d) { return {key: +d.key, value: +d.value} })
	sumfivefirstcallouts = sumfivefirstcallouts.map(function(d) { return {key: +d.key, value: +d.value/d3.sum(sumfivefirstcallouts, function(d) { return d.value;})}})
	sumfivefirstcallouts = sumfivefirstcallouts.sort(function(x, y){
  		 return d3.ascending(x.key, y.key);
	})
	keysonly = sumfivefirstcallouts.map(function(d) { return +d.key});
	console.log(keysonly);
	for (var i = 1; i < 17; i++) {
		if (keysonly.indexOf(i) == -1) {
			sumfivefirstcallouts.splice(i-1, 0, {key: i, value: 0})
		}
	}
	console.log(sumfivefirstcallouts);

	sumsixfirstcallouts = d3.nest()
		.key(function(d) { return +d.place;})
		.rollup(function(d) { 
			return d3.sum(d, function(g) {return 1; });
	}).entries(sixfirstcallouts);
	sumsixfirstcallouts = sumsixfirstcallouts.map(function(d) { return {key: +d.key, value: +d.value} })
	sumsixfirstcallouts = sumsixfirstcallouts.map(function(d) { return {key: +d.key, value: +d.value/d3.sum(sumsixfirstcallouts, function(d) { return d.value;})}})
	sumsixfirstcallouts = sumsixfirstcallouts.sort(function(x, y){
  		 return d3.ascending(x.key, y.key);
	})
	keysonly = sumsixfirstcallouts.map(function(d) { return +d.key});
	console.log(keysonly);
	for (var i = 1; i < 17; i++) {
		if (keysonly.indexOf(i) == -1) {
			sumsixfirstcallouts.splice(i-1, 0, {key: i, value: 0})
		}
	}
	console.log(sumsixfirstcallouts);

	/*console.log(sumnofirstcallouts);
	console.log(sumonefirstcallouts);
	console.log(sumtwofirstcallouts);
	console.log(sumthreefirstcallouts);
	console.log(sumfourfirstcallouts);
	console.log(sumfivefirstcallouts);
	console.log(sumsixfirstcallouts);*/
	
	d3.selectAll("input")
		.on("change", selectDataset);
	
	function selectDataset() {
		var value = this.value;
		switch(value) {
			case "zero":
				change(sumnofirstcallouts);
				break;
			case "one":
				change(sumonefirstcallouts)
				break;
			case "two":
				change(sumtwofirstcallouts)
				break;
			case "three":
				change(sumthreefirstcallouts)
				break;
			case "four":
				change(sumfourfirstcallouts)
				break;
			case "five":
				change(sumfivefirstcallouts)
				break;
			case "six":
				change(sumsixfirstcallouts)
				break;
			default:
				console.log("should not get here");
				break;
		}
	}
	
	change(sumnofirstcallouts);
	function change(data) {
		/* ------- PIE SLICES -------*/
		var slice = donutsvg.select(".slices").datum(data).selectAll("path.slice")
	        .data(pie);//, function(d){ return d.data.key });

	    donutColorScale.domain(d3.extent(data, function(d) { return d.key; }))
	    slice.enter()
	        .insert("path")
	        .style("fill", function(d) { return donutColorScale(d.data.key); })
	        .attr("class", "slice")
	        .attr('d',arc);


	    /*slice
	        .transition().duration(1000)
	        .attrTween("d", function(d) {
	        	console.log("getting here");
	            this._current = this._current || d;
	            console.log(this._current);
	            var interpolate = d3.interpolate(this._current, d);
	            this._current = interpolate(0);
	            return function(t) {
	                return arc(interpolate(t));
	            };
	        })*/
	    /*slice
	        .on("mouseover", function(d){
	            donutTip.style("left", d3.event.pageX+10+"px");
	            donutTip.style("top", d3.event.pageY-25+"px");
	            donutTip.style("display", "inline-block");
	            donutTip.html((d.data.label)+"<br>"+(d.data.value)+"%");
	        });
	    slice
	        .on("mouseout", function(d){
	            div.style("display", "none");
	        });*/

	    slice.exit()
	        .remove();

    /*var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -3 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });

    /* ------- TEXT LABELS -------*/

    /*var text = donutsvg.select(".labelName").selectAll("text")
        .data(pie(data), function(d){ return d.data.label });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return (d.data.label+": "+d.value+"%");
        });

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text
        .transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = donutradius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
        .text(function(d) {
            return (d.data.label+": "+d.value+"%");
        });


    text.exit()
        .remove();*/

    /* ------- SLICE TO TEXT POLYLINES -------*/

    /*var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), function(d){ return d.data.label });

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = donutradius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();*/
	};

	
});