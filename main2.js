

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

var svg = d3.select("body").append("svg")
        .attr("width", 1000)
        .attr("height", 1000);
    //margin = {top: 20, right: 20, bottom: 30, left: 80},
    //width = +svg.attr("width") - margin.left - margin.right,
    //height = +svg.attr("height") - margin.top - margin.bottom;
  
var tooltip = d3.select("body").append("div").attr("class", "toolTip");
var width = 1000; 
var height = 700; 
var margin = {top: 20, right: 20, bottom: 30, left: 80};
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]);

function showGraphTwo(jsonURI) { 
    d3.json(jsonURI, (data) => {
        var data = cleanDFJSON(data);
 
    //var data = cleanDFJSON(inlineData); 
    x.domain([0, d3.max(data, function(d) { return d.Frequency; })]);
    y.domain(data.map(function(d) { return d.Category; })).padding(0.1);



    svg.selectAll("*").remove();
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d / 1000); }).tickSizeInner([-height]));

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

showGraphTwo('ca-catts.json'); 





  
  	