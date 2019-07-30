// var margin = { top: 50, right: 300, bottom: 50, left: 50 },
//   outerWidth = 1050,
//   outerHeight = 500,
//   width = outerWidth - margin.left - margin.right,
//   height = outerHeight - margin.top - margin.bottom;

// var x = d3.scaleLinear()
//   .range([0, width]).nice();

// var y = d3.scaleLinear()
//   .range([height, 0]).nice();

// var xCat = "Neighborhood",
//   yCat = "Crime Rate By Neighborhood",
//   rCat = 5,
//   colorCat = "Neighborhood";

d3.csv("crime_rate_by_neighborhood.csv", function (data) {
  data.forEach(function (d) {
    d["Crime Rate By Neighborhood"] = +d["Crime Rate By Neighborhood"];
  });

  var xMax = 1,
    xMin = -1,
    yMax = 0.3,
    yMin = -0.1;
  // yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
  // yMin = d3.min(data, function(d) { return d[yCat]; }),
  // yMin = yMin > 0 ? 0 : yMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  // var xAxis = d3.svg.axis()
  //     .scale(x)
  //     .orient("bottom")
  //     .tickSize(-height);

  var xAxis = d3.axisBottom(x).tickSize(-height);

  // var yAxis = d3.svg.axis()
  //     .scale(y)
  //     .orient("left")
  //     .tickSize(-width);

  var yAxis = d3.axisLeft(y).tickSize(-width);

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d) {
      return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
    });

  var svg = d3.select("#crime_rate_by_neighborhood_scatter")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  svg.append("rect")
    .attr("width", width)
    .attr("height", height);

  svg.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .style("display", "none")
    .append("text")
    .classed("label", true)
    .attr("x", width)
    .attr("y", margin.bottom - 10)
    .style("text-anchor", "end")
    .text(xCat)
    .style("display", "none");

  svg.append("g")
    .classed("y axis", true)
    .call(yAxis)
    .append("text")
    .classed("label", true)
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(yCat);

  var objects = svg.append("svg")
    .classed("objects", true)
    .attr("width", width)
    .attr("height", height);

  // objects.append("svg:line")
  //   .classed("axisLine hAxisLine", true)
  //   .attr("x1", 0)
  //   .attr("y1", 0)
  //   .attr("x2", width)
  //   .attr("y2", 0)
  //   .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
    .classed("axisLine vAxisLine", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", height)
    .style("display", "none");

  objects.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .classed("dot", true)
    .attr("r", function (d) { return 6 * Math.sqrt(rCat / Math.PI); })
    .attr("transform", transform)
    .style("fill", function (d) { return color(d[colorCat]); })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .classed("legend", true)
    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("circle")
    .attr("r", 3.5)
    .attr("cx", width + 20)
    .attr("fill", color);

  legend.append("text")
    .attr("x", width + 26)
    .attr("dy", ".35em")
    .text(function (d) { return d; });

  function transform(d) {
    return "translate(" + x(Math.random() * 0.1) + "," + y(d[yCat]) + ")";
  }
});
