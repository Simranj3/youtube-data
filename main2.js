

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

                div.html(d.Category + " <br/>" )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")                    
                    .style("background-color", "red");
                
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
        
//        .on("mousemove", function(d){
//            tooltip
//              .style("left", d3.event.pageX - 50 + "px")
//              .style("top", d3.event.pageY - 70 + "px")
//              .style("display", "inline-block")
//              .html((d.area) + "<br>" + "£" + (d.Frequency));
//        })
//    		.on("mouseout", function(d){ tooltip.style("display", "none");});
        
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
    
    
    d3.json(jsonURI, (data) => {
        var results = cleanDFCategoryJSON(data);
        var data = results[0];
        var catKeys = results[1];
        var stack = d3.stack().keys(catKeys);
        var layers= stack(data);
        var color = d3.scaleOrdinal(d3.schemeCategory20);
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        console.log(data);
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
        
        var div = d3.select("body").append("div").attr("id","tool-tip")
                    //.attr("class", "tooltip")
                    //.style("opacity", 0);
        
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
              .attr("class", function(d) {
                return "stack-rect" + d.data.category.split(' ').join('-').split('&').join('-');
              })
              .attr("y", function(d) { 
                return yScale(d.data.category); } )
			  .attr("x", function(d) { return xScale(d[0]); })
			  .attr("height", yScale.bandwidth())
			  .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]) });


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
//            
//           div.transition()
//             .duration(500)
//             .style("opacity", 0);
//       });
//        
        // console.log();
        //TODO: pickup here
        
//        var stackedLayers = d3.selectAll(".stack-rect");
//                stackedLayers.on("mouseover", (d) => {
//                    console.log(d[1]);
//                     var thisName = d3.select(this.parentNode).datum().key;
//                console.log(thisName);
//                div.transition()
//                    .duration(200)
//                    .style("opacity", .9);
//                console.log(d);
//                div.html(d.data.category + " <br/>" )
//                    .style("left", "500 px")
//                    .style("top", "500 px")
//                    .style("background-color", "red");
//                
//            }).on("mouseout", (d) => {
//                div.transition()
//                .duration(500)
//                .style("opacity", 0);
//            });

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
        yScatter.domain([0,1]);
        //yScatter.domain(d3.extent(data, function(d) { return parseFloat(parseInt(d.likes)/(parseInt(d.likes)+parseInt(d.dislikes))); })).nice();
        var div = d3.select("body").append("div").attr("id","tool-tip-scatter").style("position","absolute");
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
          .attr("r", 2)
          .attr("cx", function(d) { return xScatter(d.views); })
          .attr("cy", function(d) { return yScatter(parseFloat(parseInt(d.likes)/(parseInt(d.likes)+parseInt(d.dislikes))));  })
          .style("fill", function(d) { return colorScatter(d.category_id); })
          
     }
    
        d3.selectAll("circle").on("mouseover", (d) => {
             // d3.select(this).attr("color", "black")
            console.log("hovering");
            div.transition()
                .duration(100)
                .style("opacity", 0.9);
            div.html(d.title + " <br/>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")                    
                .style("background-color", "red");
        }).on("mouseout", (d) => {
            div.transition()
            .duration(500)
            .style("opacity", 0);
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
      .attr("r", 4)
      .attr("cx", function(d) { return xScatter(d.views); })
      .attr("cy", function(d) { return yScatter(parseFloat(parseInt(d.likes)/(parseInt(d.likes)+parseInt(d.dislikes))));  })
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
           deleteSize --;
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

showGraphTwo('ca-catts.json'); 
showGraphCategoriesAndCreators('us-catts-creats.json');
scatterplot('us_scatter.csv', 'News & Politics');