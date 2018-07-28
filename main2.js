

var inlineData = {"name":"trending_date","index":["Autos & Vehicles","Comedy","Education","Entertainment","Film & Animation","Gaming","Howto & Style","Movies","Music","News & Politics","People & Blogs","Pets & Animals","Science & Technology","Shows","Sports","Travel & Events"],"data":[353,3773,991,13451,2060,1344,2007,6,3731,4159,4105,369,1155,124,2787,392]}; 


function cleanDFJSON(youtubeData) {
    var finalArray = [];
    for (var i=0; i<youtubeData["index"].length; i++) {
         let tempObj = {};
         tempObj['Category'] = youtubeData["index"][i];
         tempObj['Frequency']  = youtubeData["data"][i];
     finalArray.push(tempObj);
    }
    return finalArray;
}

var svg = d3.select("#horizontal-bar-chart").append("svg")
        .attr("width", 1000)
        .attr("height", 400);
    //margin = {top: 20, right: 20, bottom: 30, left: 80},
    //width = +svg.attr("width") - margin.left - margin.right,
    //height = +svg.attr("height") - margin.top - margin.bottom;
  
//var tooltip = d3.select("body").append("div").attr("class", "toolTip");
//var width = 1000; 
//var height = 300; 
//var margin = {top: 20, right: 20, bottom: 30, left: 80};
//var x = d3.scaleLinear().range([0, width]);
//var y = d3.scaleBand().range([height, 0]);

var tooltip = d3.select("body").append("div").attr("class", "toolTip");
var width = 1000; 
var height = 300; 
var margin = {top: 20, right: 20, bottom: 30, left: 80};
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]);
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("class","bar-chart-wrapper");

function showGraphTwo(jsonURI) { 
    d3.json(jsonURI, (data) => {
        var data = cleanDFJSON(data);
      	data.sort(function(a, b) { return a.value - b.value; });
        var div = d3.select("body").append("div").attr("id","tool-tip-country").style("position","absolute");
        
        x.domain([0, d3.max(data, function(d) { return d.Frequency; })]);
        y.domain(data.map(function(d) { return d.Category; })).padding(0.1);
        
        var newData = [],
        maxViews = 0;
        data.forEach((d)=> {
                data.push(d);
                maxViews = Math.max(d.Frequency, maxViews);
        });
        
        if (svgScatter.selectAll("*")._groups[0].length != 0) {
            g.selectAll("*:not(.bar)").remove();
            redrawGraph(data);
            updateXAxisGraph(maxViews);
        } else {
            g.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .on("mouseover", (d) => {
                
                 div.transition()
                    .duration(200)
                    .style("opacity", 0.9);

                div.html(d.Category +": " + d.Frequency + " <br/>" )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")                    
                    .style("background-color", "#E5F9FF")
                    .style("font-family", 'Roboto')
                    .style("border-radius", "2px");
                    //.style("padding", "6px");
                
            }).on("mouseout", (d) => {
                div.transition()
                .duration(500)
                .style("opacity", 0);
            })
        .transition()
            .duration(1000)
            .attr("y", function(d) { return y(d.Category); })
            .attr("width", function(d) { return x(d.Frequency); });    
        }
        

        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]));

        g.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y));

        // text label for the title
        svg.append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                 (margin.top - 10) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Number of Trending Videos vs Categories");

        // text label for the x axis
        svg.append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                 (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Number of Trending Videos");

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Categories");  

});
    function redrawGraph(data) {
        
        svg.selectAll(".bar")
            .data(data)
            .attr("class", "bar")
            .attr("x", 0)
            .attr("height", y.bandwidth())
        .transition()
            .duration(1000)
            .attr("y", function(d) { return y(d.Category); })
            .attr("width", function(d) { return x(d.Frequency); });
        
    }
}


function showGraphCategoriesAndCreators(jsonURI) {
    
/*var width = 1000; 
var height = 300; 
var margin = {top: 20, right: 20, bottom: 30, left: 80};
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]);*/
    
    var svg = d3.select("#stacked-chart").append("svg")
        .attr("width", 1000)
        .attr("height", 400);

    var div = d3.select("#tool-tip-scatter");
    
    function sumChannelMapper(categories, dataArr) {
        let channelMapObj = {};
        for (let i=0; i < categories.length; i++) {
            channelMapObj[categories[i]] = 0;
        }

        for (let i=0; i < dataArr.length; i++) {
            let currObj = dataArr[i];

            console.log(currObj.category);
            for (let key in currObj) {
                channelMapObj[key] += currObj[key];
            }
        }

        let countMap = {}
        for (let key in channelMapObj) {
            countMap[channelMapObj[key]] = key;
        }
        return countMap;
    }

    d3.json(jsonURI, (data) => {
        var results = cleanDFCategoryJSON(data);
        var data = results[0];
        var catKeys = results[1];
        var stack = d3.stack().keys(catKeys);
        var layers= stack(data);
        var color = d3.scaleOrdinal(d3.schemeCategory20);
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        console.log(['categories', data]);
        var countMap = sumChannelMapper(catKeys, data);
        var layer = g.selectAll(".layer")
			.data(layers)
			.enter().append("g")
			.attr("class", "layer")
			.style("fill", function(d, i) { return color(i); });
        
        var xTest = d3.scaleLinear().domain([0, d3.max(data, function(d) {
            return d[1]-d[0]
        })]).range([0, width]);
        
        var xScale = d3.scaleLinear().rangeRound([0, width]);
		var yScale = d3.scaleBand().rangeRound([height, 0]).padding(0.1);
        var xAxis = d3.axisBottom(xScale),
            yAxis =  d3.axisLeft(yScale);
        
        xScale.domain([0, d3.max(layers[layers.length - 1], function(d) { return (d[0] + d[1])/2; }) ]).nice();        
        yScale.domain(data.map(function(d) { return d.category; })).padding(0.1);
        
        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).ticks(5).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]));
        g.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale));
        
        
        layer.selectAll("rect")
			  .data(function(d) { return d; })
			  .enter().append("rect")
              .attr("class", "stack-rect")
              .attr("y", function(d) { 
                return yScale(d.data.category); } )
			  .attr("x", function(d) { return xScale(d[0]); })
			  .attr("height", yScale.bandwidth())
			  .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]) });


        // text label for the title
        svg.append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                 (margin.top - 10) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Number of Trending Videos vs Categories and Channel");

        // text label for the x axis
        svg.append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                 (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Views");

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Categories");  

//        .on("mouseover", function(d) {
//            console.log(d);
//            div.transition()
//                .duration(200)
//                .style("opacity", .9);
//
//            div.html(d.data.category + " <br/>" )
//                .style("left", "500 px")
//                .style("top", "500 px")
//                .style("background-color", "red");
//                //.style("left", (d3.event.pageX) + "px")
//                //.style("top", (d3.event.pageY - 28) + "px");
//        }).on("mouseout", function(d) {
//           div.transition()
//             .duration(500)
//             .style("opacity", 0);
//       });
        
        // console.log();
        //TODO: pickup here

        var stackedLayers = d3.selectAll(".stack-rect");
        stackedLayers.on("mouseover", (d) => {
            var hoverContent = countMap[d[1]-d[0]] + " <br/> total views: " + numberWithCommas(d[1]-d[0]) + " <br/>";
            console.log(d);
            console.log(d[1]-d[0]);
            console.log(countMap[d[1]-d[0]]);
            console.log("views: " + numberWithCommas(d[1]-d[0]));


            div.transition()
                .duration(100)
                .style("opacity", 0.9);
            div.html(hoverContent)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background-color", "#6D6D6D")
                .style("color", "white")
                .style("font-family", "'Roboto'")
                .style("font-family", "12px");

            }).on("mouseout", (d) => {
            setTimeout(()=>{
              div.transition()
                 .duration(2000)
                 .style("opacity", 0);
            }, 100);

        }).on("mouseout", (d) => {
            setTimeout(()=>{
              div.transition()
                 .duration(2000)
                 .style("opacity", 0);
            }, 100);
        });

})
}

function cleanDFCategoryJSON(youtubeData) {
    var finalArray = [];
    var categoryObj = {},
        categoryArr = [],
        channelArr = [];
    
    var channelSet = new Set();
    console.log(youtubeData);
    for (var i=0; i<youtubeData["data"].length; i++) {
        channelSet.add(youtubeData["data"][i][1]);
    }
    
    for (var i=0; i<youtubeData["data"].length; i++) {
         let category = youtubeData["data"][i][0],
             channel = youtubeData["data"][i][1];

         if (!categoryObj[category]) {
             categoryObj[category] = {};
         }
         categoryObj[category][channel] = youtubeData["data"][i][2];
    }
    
    for (var category in categoryObj) {
        tempObj = categoryObj[category]
        tempObj['category'] = category;
        
        for (var channel of channelSet) {
            if (!tempObj[channel]) {
                tempObj[channel] = 0;
            }
        }
        finalArray.push(tempObj);
    }
    
    for (var channel of channelSet) {
        channelArr.push(channel);
    }
    
    return [finalArray, channelArr];
}

function scatterplot(csvURI, category) {
    var div = d3.select("#tool-tip-scatter");
    div.html("");
    d3.csv(csvURI, (data) => {
        data.forEach(function(d) {
            d.views = +d.views;
            d.likes = +d.likes;
        });
        
        var newData = [],
            maxViews = 0;
        data.forEach((d)=> {
            if (d.category_id == category){
                newData.push(d);
                maxViews = Math.max(d.views, maxViews);
            }
        });
        data = newData;
        
        xScatter.domain(d3.extent(data, function(d) { return parseInt(d.views); })).nice();
        yScatter.domain([0,100]);
        //yScatter.domain(d3.extent(data, function(d) { return parseFloat(parseInt(d.likes)/(parseInt(d.likes)+parseInt(d.dislikes))); })).nice();
        //var div = d3.select("body").append("div").attr("id","tool-tip-scatter").style("position","absolute");
        

     if (svgScatter.selectAll("*")._groups[0].length != 0) {
         // svgScatter.selectAll("*:not(.x-axis)").remove();
         if (scatterSize > data.length) {
             deleteSomeOldies(scatterSize-data.length);
         } else {
             createSomeNewies(data.length-scatterSize);
         }
         redrawScatter(data);
         updateXAxis(maxViews);
     } else {
         svgScatter.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxisScatter.tickFormat(d3.format(".2s")))
        .append("text")
          .attr("class", "x-tick")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end");
         
         svgScatter.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .transition()
          .duration(250)
          .attr("class", "dot")
          .attr("r", 3)
          .attr("cx", function(d) { return xScatter(d.views); })
          .attr("cy", yScalerScatter)
          .style("fill", function(d) { return colorScatter(d.category_id); })
        
        // text label for the title
        svgScatter.append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                 (marginScatter.top - 10) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Trending Videos by Views and % Likes (<for some date>)");

        // text label for the x axis
        svgScatter.append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                 (height + marginScatter.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Views");

        // text label for the y axis
        svgScatter.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - marginScatter.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("% of Likes");  

     } 
    
        d3.selectAll("circle").on("mouseover", (d) => {
          var hoverContent =  d.title + " <br/> views: " + numberWithCommas(d.views) + " <br/>";

            div.transition()
                .duration(100)
                .style("opacity", 0.9);
            div.html(hoverContent)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background-color", "#6D6D6D")
                .style("color", "white")
                .style("font-family", "'Roboto'")
                .style("font-family", "12px");

        }).on("mouseout", (d) => {
            setTimeout(()=>{
              div.transition()
                 .duration(2000)
                 .style("opacity", 0);
            }, 100);
        });
        
      svgScatter.append("g")
          .attr("class", "y axis")
          .call(yAxisScatter)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end");
        scatterSize = data.length;
        
        
        
    })
}

function updateXAxis(maxX){
    xScatter.domain([0, maxX]);
    svgScatter.select(".x-axis")
        .transition().duration(500)
            .call(xAxisScatter.tickFormat(d3.format(".2s")));
}

function updateXAxisGraph(maxX){
    x.domain([0, maxX]);
    g.select(".x axis")
    .transition().duration(1000)
            //.call(xAxisScatter.tickFormat(d3.format(".2s")));
}

function redrawScatter(data) {
    svgScatter.selectAll("circle")
      .data(data)
      .transition()
      .duration(500)
      .attr("r", 3)
      .attr("cx", function(d) { return xScatter(d.views); })
      .attr("cy", yScalerScatter)
      .style("fill", function(d) { return colorScatter(d.category_id); });
}

function deleteSomeOldies(deleteSize) {
    var circles = svgScatter.selectAll("circle");
    
    if (deleteSize > circles.size()) {
        deleteSize = deleteSize-circles.size();
    }
    if (deleteSize > circles.size()) {
        return;
    }
    circles.each(function(d,i) {            
       if (deleteSize!=0) {
           this.remove();   
           deleteSize--;
       }
    });
}

function createSomeNewies(appendSize) {
    for (var i=0; i < appendSize; i++) {
        svgScatter.append("circle")
                  .attr("class", "dot")
                  .attr("cx", 1)
                  .attr("cy", 1);
    }
}

var marginScatter = {top: 20, right: 200, bottom: 30, left: 40},
    widthScatter = 960 - margin.left - margin.right,
    heightScatter = 500 - margin.top - margin.bottom;
var xScatter = d3.scaleLinear()
    .range([0, width]);
var yScatter = d3.scaleLinear()
    .range([height, 0]);
var colorScatter = d3.scaleOrdinal(d3.schemeCategory10);
var xAxisScatter = d3.axisBottom(xScatter);
var yAxisScatter = d3.axisLeft(yScatter);
var svgScatter = d3.select("#scatter-chart").append( "svg")
    .attr("width", widthScatter + marginScatter.left + marginScatter.right)
    .attr("height", heightScatter + marginScatter.top + marginScatter.bottom)
  .append("g")
    .attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")");

var scatterSize = 0;

var yScalerScatter = function(d) { return yScatter(parseFloat(parseInt(d.likes)/(parseInt(d.likes)+parseInt(d.dislikes))) * 100); };

showGraphTwo('ca-catts.json'); 
showGraphCategoriesAndCreators('us-catts-creats.json');
scatterplot('us_scatter.csv', 'News & Politics');

/* SCROLLY*/ 


		// using d3 for convenience
	/*	var container = d3.select('#scroll');
		var graphic = container.select('.scroll__graphic');
		var chart = graphic.select('.chart');
		var text = container.select('.scroll__text');
		var step = text.selectAll('.step');
		// initialize the scrollama
		var scroller = scrollama();
		// generic window resize listener event
		function handleResize() {
			// 1. update height of step elements
			var stepHeight = Math.floor(window.innerHeight * 0.75);
			step.style('height', stepHeight + 'px');
			// 2. update width/height of graphic element
			var bodyWidth = d3.select('body').node().offsetWidth;
			graphic
				.style('width', bodyWidth + 'px')
				.style('height', window.innerHeight + 'px');
			var chartMargin = 32;
			var textWidth = text.node().offsetWidth;
			var chartWidth = graphic.node().offsetWidth - textWidth - chartMargin;
			chart
				.style('width', chartWidth + 'px')
				.style('height', Math.floor(window.innerHeight / 2) + 'px');
			// 3. tell scrollama to update new element dimensions
			scroller.resize();
		}
		// scrollama event handlers
		function handleStepEnter(response) {
			// response = { element, direction, index }
			// add color to current step only
			step.classed('is-active', function (d, i) {
				return i === response.index;
			})
			// update graphic based on step
			chart.select('p').text(response.index + 1)
		}
		function handleContainerEnter(response) {
			// response = { direction }
			// sticky the graphic (old school)
			graphic.classed('is-fixed', true);
			graphic.classed('is-bottom', false);
		}
		function handleContainerExit(response) {
			// response = { direction }
			// un-sticky the graphic, and pin to top/bottom of container
			graphic.classed('is-fixed', false);
			graphic.classed('is-bottom', response.direction === 'down');
		}
		function init() {
			// 1. force a resize on load to ensure proper dimensions are sent to scrollama
			handleResize();
			// 2. setup the scroller passing options
			// this will also initialize trigger observations
			// 3. bind scrollama event handlers (this can be chained like below)
			scroller.setup({
				container: '#scroll',
				graphic: '.scroll__graphic',
				text: '.scroll__text',
				step: '.scroll__text .step',
				debug: true,
			})
				.onStepEnter(handleStepEnter)
				.onContainerEnter(handleContainerEnter)
				.onContainerExit(handleContainerExit);
			// setup resize event
			window.addEventListener('resize', handleResize);
		}
		// kick things off
		init();
*/

// Helpers
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
