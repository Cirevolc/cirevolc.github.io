var margin = { top: 50, right: 300, bottom: 50, left: 50 },
  outerWidth = 1050,
  outerHeight = 500,
  width = outerWidth - margin.left - margin.right,
  height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
  .range([0, width]).nice();

var y = d3.scale.linear()
  .range([height, 0]).nice();

var xCat = "UCR part1 rate",
  xCat2 = "UCR part3 rate",
  yCat = "Avg. Crime Rate By Neighborhood",
  rCat = 5,
  colorCat = "Neighborhood";

d3.csv("crime_rate_by_neighborhood_and_type.csv", function (data) {
  data.forEach(function (d) {
    d["UCR part1 rate"] = +d["UCR part1 rate"];
    d["UCR part3 rate"] = +d["UCR part3 rate"];
    d["Avg. Crime Rate By Neighborhood"] = +d["Avg. Crime Rate By Neighborhood"];
  });

  var xMax = 1,
    xMin = -0.1,
    yMax = 1,
    yMin = -0.1;
  // yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
  // yMin = d3.min(data, function(d) { return d[yCat]; }),
  // yMin = yMin > 0 ? 0 : yMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(-width);

  var color = d3.scale.category20();

  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d) {
      return colorCat + ": " + d[colorCat] + "<br>" + xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
    });

  var tip2 = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d) {
      return colorCat + ": " + d[colorCat] + "<br>" + xCat2 + ": " + d[xCat2] + "<br>" + yCat + ": " + d[yCat];
    });

  var zoomBeh = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([0, 500])
    .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoomBeh);

  svg.call(tip);
  svg.call(tip2);

  svg.append("rect")
    .attr("width", width)
    .attr("height", height);

  svg.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .classed("label", true)
    .attr("x", width)
    .attr("y", margin.bottom - 10)
    .style("text-anchor", "end")
    .text("Crime Rate By Type");

  svg.append("g")
    .classed("y axis", true)
    .call(yAxis)
    .append("text")
    .classed("label", true)
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Crime Rate By Neighborhood");

  var objects = svg.append("svg")
    .classed("objects", true)
    .attr("width", width)
    .attr("height", height);

  objects.append("svg:line")
    .classed("axisLine hAxisLine", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width)
    .attr("y2", 0)
    .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
    .classed("axisLine vAxisLine", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", height);

  objects.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .classed("dot", true)
    .attr("r", function (d) { return 8; })
    .attr("transform", transform)
    .style("fill", function (d) { return color(d[colorCat]); })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

  objects.selectAll(".dot2")
    .data(data)
    .enter().append("rect")
    .classed("dot2", true)
    .attr("x", -8)
    .attr("y", -8)
    .attr("width", 16)
    .attr("height", 16)
    .attr("transform", transform2)
    .style("fill", function (d) { return color(d[colorCat]); })
    .on("mouseover", tip2.show)
    .on("mouseout", tip2.hide);

  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .classed("legend", true)
    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("circle")
    .attr("r", 3.5)
    .attr("cx", width + 20)
    .attr("fill", color);

    legend.append("rect")
    .attr("width", 7)
    .attr("height", 7)
    .attr("x", width + 26)
    .attr("dy", ".35em")
    .attr("fill", color);

  legend.append("text")
    .attr("x", width + 36)
    .attr("dy", ".35em")
    .text(function (d) { return d; });

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
      .attr("transform", transform);

    svg.selectAll(".dot2")
      .attr("transform", transform2);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }

  function transform2(d) {
    return "translate(" + x(d[xCat2]) + "," + y(d[yCat]) + ")";
  }
});
// select the svg area
var svg = d3.select("#my_dataviz");

// Handmade legend
svg.append("circle").attr("cx", 200).attr("cy", 30).attr("r", 6).style("fill", "#69b3a2");
svg.append("rect").attr("x", 344).attr("y", 24).attr("width", 12).attr("height", 12).style("fill", "#69b3a2");
svg.append("text").attr("x", 220).attr("y", 30).text("Crime of Part 1").style("font-size", "15px").attr("alignment-baseline", "middle");
svg.append("text").attr("x", 370).attr("y", 30).text("Crime of Part 3").style("font-size", "15px").attr("alignment-baseline", "middle");