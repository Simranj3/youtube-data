// Processing
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

function cleanDFCategoryJSON(youtubeData) {
    var finalArray = [];
    var categoryObj = {},
        categoryArr = [];
    
    for (var i=0; i<youtubeData["index"].length; i++) {
         let tempObj = {};

         let category = youtubeData["index"][i][0],
             channel = youtubeData["index"][i][1];
         
         if (!categoryObj[category]) {
             categoryObj[category] = []
         }
         tempObj['Category'] = category;
         tempObj['Channel'] = channel;
         tempObj['Frequency'] = youtubeData["data"][i];
         finalArray.push(tempObj);
         //categoryObj[category].push(tempObj);
    }
    
    for (var category in categoryObj) {
        categoryObj[category].sort((a,b)=> {
           return b.Frequency - a.Frequency; 
        });
        categoryArr.push(category);
    }
    
    return [finalArray, categoryArr];
}

// SVG
// set the dimensions of the canvas
var margin = {top: 20, right: 20, bottom: 70, left: 80},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
// set the ranges
var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.05);
var y = d3.scaleLinear().range([height, 0]);
//// define the axis
//var xAxis = d3.svg.axis()
//    .scale(x)
//    .orient("bottom");
//var yAxis = d3.svg.axis()
//    .scale(y)
//    .orient("left")
//    .ticks(10);

var xAxis = d3.axisBottom(x).tickFormat(function(d){ return d.x;});
var yAxis = d3.axisLeft(y);

// add the SVG element
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+100)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Graphs/animations
function showGraph(jsonURI) {
    d3.json(jsonURI, (data) => {
        var data = cleanDFJSON(data);

        // load the data
        data.forEach(function(d) {
            d.Category = d.Category;
            d.Frequency = +d.Frequency;
        });
      
        // Scale the range of the data in the domains
          x.domain(data.map(function(d) { return d.Category; }));
          y.domain([0, d3.max(data, function(d) { return d.Frequency; })]);
          
          svg.selectAll("*").remove();
          // append the rectangles for the bar chart
          svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.Category); })
              .attr("width", x.bandwidth())
              .attr("y", function(d) { return y(d.Frequency); })
              .attr("height", function(d) { return height - y(d.Frequency); });

          // add the x Axis
          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          // add the y Axis
          svg.append("g")
              .call(d3.axisLeft(y));
        
      // scale the range of the data
//      x.domain(data.map(function(d) { return d.Category; }));
//      y.domain([0, d3.max(data, function(d) { return d.Frequency; })]);
//        
//      svg.selectAll("*").remove();
//      // add axis
//      svg.append("g")
//          .attr("class", "x axis")
//          .attr("transform", "translate(0," + height + ")")
//          .call(xAxis)
//        .selectAll("text")
//          .style("text-anchor", "end")
//          .attr("dx", "-.8em")
//          .attr("dy", "-.55em")
//          .attr("transform", "rotate(-90)" );
//      svg.append("g")
//          .attr("class", "y axis")
//          .call(yAxis)
//        .append("text")
//          .attr("transform", "rotate(-90)")
//          .attr("y", 5)
//          .attr("dy", ".71em")
//          .style("text-anchor", "end");
//      // Add bar chart
//      svg.selectAll("bar")
//          .data(data)
//        .enter().append("rect")
//          .attr("class", "bar")
//          .attr("x", function(d) { return x(d.Category); })
//          //.attr("width", x.rangeBand())
//          .attr("y", function(d) { return y(d.Frequency); })
//          .attr("height", function(d) { return height - y(d.Frequency); });
    });
}

function showGraphCategoriesAndCreators(jsonURI) {
    d3.json(jsonURI, (data) => {
        var results = cleanDFCategoryJSON(data);
        var data = results[0];
        var catKeys = results[1];
        
        //var categories = d3.layout.stack().keys(catKeys)(data);
        var keys = [];

        data.forEach(function(d){
            d.total = 0;
            catKeys.forEach(function(k){
              d.total += d[k];
            })
        });
    
        var test = d3.stack().keys(catKeys)(data);
        console.log(test);
    })
}
showGraph('ca-catts.json');
showGraphCategoriesAndCreators('us-catts-creats.json');