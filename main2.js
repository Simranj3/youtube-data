

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
  
var tooltip = d3.select("body").append("div").attr("class", "toolTip");
var width = 1000; 
var height = 300; 
var margin = {top: 20, right: 20, bottom: 30, left: 80};
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]);

function showGraphTwo(jsonURI) { 
    d3.json(jsonURI, (data) => {
        var data = cleanDFJSON(data);
      	data.sort(function(a, b) { return a.value - b.value; });

    console.log(data);
    //var data = cleanDFJSON(inlineData); 
    x.domain([0, d3.max(data, function(d) { return d.Frequency; })]);
    y.domain(data.map(function(d) { return d.Category; })).padding(0.1);



    svg.selectAll("*").remove();
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]));

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    g.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.Category); })
        .attr("width", function(d) { return x(d.Frequency); })
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.area) + "<br>" + "£" + (d.Frequency));
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});
    
 });
}


function showGraphCategoriesAndCreators(jsonURI) {
    
/*var width = 1000; 
var height = 300; 
var margin = {top: 20, right: 20, bottom: 30, left: 80};
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]);*/
    
    var svg = d3.select("#stacked-chart").append("svg")
        .attr("width", 2000)
        .attr("height", 400);
    
    
    d3.json(jsonURI, (data) => {
        var results = cleanDFCategoryJSON(data);
        var data = results[0];
        var catKeys = results[1];
        var stack = d3.stack().keys(catKeys);
        var layers= stack(data);
        var color = d3.scaleOrdinal(d3.schemeCategory20);
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
              .attr("y", function(d) { return y(d.data.category); } )
			  .attr("x", function(d) { return xScale(d[0]); })
			  .attr("height", yScale.bandwidth())
			  .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]) });
                
        
    
    })
}

function cleanDFCategoryJSON(youtubeData) {
    var finalArray = [];
    var categoryObj = {},
        categoryArr = [],
        channelArr = [];
    
    var channelSet = new Set();
    
    for (var i=0; i<youtubeData["index"].length; i++) {
        channelSet.add(youtubeData["index"][i][1]);
    }
    
    for (var i=0; i<youtubeData["index"].length; i++) {
         let category = youtubeData["index"][i][0],
             channel = youtubeData["index"][i][1];

         if (!categoryObj[category]) {
             categoryObj[category] = {};
         }
         categoryObj[category][channel] = youtubeData["data"][i];
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

showGraphTwo('ca-catts.json'); 
showGraphCategoriesAndCreators('us-catts-creats.json');