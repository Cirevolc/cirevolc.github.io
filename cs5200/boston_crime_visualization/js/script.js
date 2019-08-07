function dropDownCallBack() {
    d3.csv("data/crime_rate_by_neighborhood.csv", function (data) {
        var flag = 0;
        data.forEach(function (d) {
            if (d.Neighborhood == document.getElementById("neighborhood_select").value) {
                flag = 1;
                document.getElementById("drop_down_display1").innerHTML = "Crime per 100K population: " + Number(d["Crime Rate By Neighborhood"]).toFixed(4)*100000;
            }
        });
        if(flag == 0){
            document.getElementById("drop_down_display1").innerHTML = "Crime rate not available" ;
        }
    });
    d3.csv("data/average_price_by_neighborhood.csv", function (data) {
        var flag = 0;
        data.forEach(function (d) {
            if (d.area == document.getElementById("neighborhood_select").value) {
                flag = 1;
                document.getElementById("drop_down_display2").innerHTML = "Average price of property: $" + Number(d["average_price_per_square_feet"]).toFixed(2) + "/sf";
            }
        });
        if(flag == 0){
            document.getElementById("drop_down_display2").innerHTML = "Average price of property not available" ;
        }
    });
}

d3.csv("data/crime_rate_by_neighborhood.csv")
    .row(function (d) {
        return {
            neighborhood: d["Neighborhood"],
            crimeRate: Math.round(+d["Crime Rate By Neighborhood"] * 100000)
        };
    })
    .get(function (error, data) {
        var margin = { left: 100, right: 250, top: 50, bottom: 50 };
        var outerHeight = 525, outerWidth = document.getElementById("scatter1").offsetWidth;
        var height = outerHeight - margin.top - margin.bottom;
        var width = outerWidth - margin.left - margin.right;
        var maxCrimeRate = d3.max(data, function (d) { return d.crimeRate; }) * 1.05;
        var minCrimeRate = d3.min(data, function (d) { return d.crimeRate; }) * 0.95;
        var y = d3.scaleLinear().domain([minCrimeRate, maxCrimeRate]).range([height, 0]).nice();
        var x = d3.scaleLinear().domain([-1, 1]).range([0, width]).nice();
        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y).tickSize(-width);
        var allNeighborhoods = [];
        data.forEach(function (d) { allNeighborhoods.push(d.neighborhood); });
        var color = d3.scaleOrdinal().domain(allNeighborhoods).range(d3.schemeSet3);
        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function (d) { return "Neighborhood: " + d.neighborhood + "<br>" + "Crime per 100K population: " + d.crimeRate });
        var svg = d3.select("#scatter1").append("svg").attr("width", outerWidth).attr("height", outerHeight)
            .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg.call(tip);
        svg.append("g").attr("class", "y axis").call(yAxis)
        svg.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2)).attr("dy", "1em")
            .attr("text-anchor", "middle").text("Crime Per 100K Population");
        svg.append("g").attr("class", "x axis hidden").attr("transform", "translate(0," + height + ")").call(xAxis);
        svg.append("text").attr("x", (width / 2)).attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle").attr("font-weight", "bold").text("Crime Per 100K Population by Neighborhood");
        svg.append("rect").attr("class", "bigrect").attr("width", width).attr("height", height);
        var objects = svg.append("svg").classed("objects", true).attr("width", width).attr("height", height);
        objects.append("svg:line")
            .classed("axisLine hAxisLine", true)
            .attr("x1", 0).attr("y1", 0).attr("x2", width).attr("y2", 0)
            .attr("transform", "translate(0," + y(7200) + ")");
        objects.append("text").attr("x", width).attr("y", y(7200) - 5)
            .attr("text-anchor", "end").text("Average across all neighborhoods: 7200")
        objects.selectAll(".dot")
            .data(data).enter().append("circle")
            .classed("dot", true).attr("r", 8)
            .attr("transform", function (d) { return "translate(" + x(Math.random() * 0.1) + "," + y(d.crimeRate) + ")"; })
            .attr("fill", function (d) { return color(d.neighborhood); })
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

    });

d3.csv("data/crime_rate_by_neighborhood_and_type.csv")
    .row(function (d) {
        return {
            neighborhood: d["Neighborhood"],
            violentPct: +d["UCR part1 rate"],
            crimeRate: Math.round(+d["Avg. Crime Rate By Neighborhood"] * 100000)
        };
    })
    .get(function (error, data) {
        var margin = { left: 100, right: 250, top: 50, bottom: 50 };
        var outerHeight = 525, outerWidth = document.getElementById("scatter2").offsetWidth;
        var height = outerHeight - margin.top - margin.bottom;
        var width = outerWidth - margin.left - margin.right;
        var maxCrimeRate = d3.max(data, function (d) { return d.crimeRate; }) * 1.05;
        var minCrimeRate = d3.min(data, function (d) { return d.crimeRate; }) * 0.95;
        var maxViolentPct = d3.max(data, function (d) { return 1 - d.violentPct; }) * 1.05
        var y = d3.scaleLinear().domain([minCrimeRate, maxCrimeRate]).range([height, 0]).nice();
        var x = d3.scaleLinear().domain([0, maxViolentPct]).range([0, width]).nice();
        var xAxis = d3.axisBottom(x).tickSize(-height);
        var yAxis = d3.axisLeft(y).tickSize(-width);
        var allNeighborhoods = [];
        data.forEach(function (d) { allNeighborhoods.push(d.neighborhood); });
        var color = d3.scaleOrdinal().domain(allNeighborhoods).range(d3.schemeSet3);
        var tip2 = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function (d) {
                return "Neighborhood: " + d.neighborhood + "<br>"
                    + "Crime per 100K population: " + d.crimeRate + "<br>"
                    + "Percentage of violent crime: " + (d.violentPct * 100).toFixed(2) + "%"
            });
        var tip3 = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function (d) {
                return "Neighborhood: " + d.neighborhood + "<br>"
                    + "Crime per 100K population: " + d.crimeRate + "<br>"
                    + "Percentage of non-violent crime: " + ((1 - d.violentPct) * 100).toFixed(2) + "%"
            });
        var svg = d3.select("#scatter2").append("svg").attr("width", outerWidth).attr("height", outerHeight)
            .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg.call(tip2);
        svg.call(tip3);
        svg.append("g").attr("class", "y axis").call(yAxis)
        svg.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2)).attr("dy", "1em")
            .attr("text-anchor", "middle").text("Crime Per 100K Population");
        svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top - 10) + ")")
            .style("text-anchor", "middle").text("Percentage of Violent/Non-violent Crime Among All Crime");
        svg.append("text").attr("x", (width / 2)).attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle").attr("font-weight", "bold")
            .text("Crime Per 100K Population by Neighborhood & Percentage of Violent/Non-violent Crime");
        svg.append("rect").attr("class", "bigrect").attr("width", width).attr("height", height);
        var objects = svg.append("svg").classed("objects", true).attr("width", width).attr("height", height);
        objects.append("svg:line")
            .classed("axisLine hAxisLine", true)
            .attr("x1", 0).attr("y1", 0).attr("x2", width).attr("y2", 0)
            .attr("transform", "translate(0," + y(7200) + ")");
        objects.append("text").attr("x", width).attr("y", y(7200) - 5)
            .attr("text-anchor", "end").text("Average across all neighborhoods: 7200")
        objects.selectAll(".dot")
            .data(data).enter().append("circle")
            .classed("dot", true).attr("r", 8)
            .attr("transform", function (d) { return "translate(" + x(d.violentPct) + "," + y(d.crimeRate) + ")"; })
            .attr("fill", function (d) { return color(d.neighborhood); })
            .on("mouseover", tip2.show)
            .on("mouseout", tip2.hide);
        objects.selectAll(".dot2")
            .data(data).enter().append("rect")
            .classed("dot2", true).attr("x", -8).attr("y", -8)
            .attr("width", 16).attr("height", 16)
            .attr("transform", function (d) { return "translate(" + x(1 - d.violentPct) + "," + y(d.crimeRate) + ")"; })
            .attr("fill", function (d) { return color(d.neighborhood); })
            .on("mouseover", tip3.show)
            .on("mouseout", tip3.hide);
        objects.selectAll(".connect")
            .data(data).enter().append("svg:line")
            .classed("connectLine", true)
            .attr("x1", function (d) { return x(d.violentPct) + 8; }).attr("y1", function (d) { return y(d.crimeRate); })
            .attr("x2", function (d) { return x(1 - d.violentPct) - 8; }).attr("y2", function (d) { return y(d.crimeRate); });
        svg.append("circle")
            .attr("r", 3.5)
            .attr("cx", width + 20)
            .attr("fill", "steelblue");
        svg.append("text")
            .attr("x", width + 26)
            .attr("dy", ".35em")
            .text("Violent Crime");
        svg.append("rect")
            .attr("width", 7)
            .attr("height", 7)
            .attr("x", width + 16.5).attr("y", 16.5)
            .attr("fill", "steelblue");
        svg.append("text")
            .attr("x", width + 26)
            .attr("dy", "1.7em")
            .text("Non-Violent Crime");

    });


function drawChartWhole() {
    var margin = { top: 50, right: 100, bottom: 50, left: 50 };
    var outerHeight = 525, outerWidth = document.getElementById("bostonmapdiv").offsetWidth * 0.6;
    var width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);
    var svg = d3.select("#bostonchart").attr("width", outerWidth).attr("height", outerHeight)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.csv("data/map/crime_by_quarter_whole_boston.csv", function (error, data) {
        if (error) throw error;

        data.forEach(function (d) {
            d.violent_rate = (+d.violent) / 8.6;
            d.non_violent_rate = (+d.non_violent) / 8.6;
        });

        x.domain(data.map(function (d) { return d.quarter; }));
        y.domain([0, d3.max(data, function (d) { return (d.violent_rate + d.non_violent_rate) * 1.1; })]);

        svg.selectAll(".bar-non-violent")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-non-violent")
            .attr("x", function (d) { return x(d.quarter); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.non_violent_rate); })
            .attr("height", function (d) { return height - y(d.non_violent_rate); })
            .attr("fill", "blue")
            .attr("opacity", "0.5");

        svg.selectAll(".bar-violent")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-violent")
            .attr("x", function (d) { return x(d.quarter); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.violent_rate) - (height - y(d.non_violent_rate)); })
            .attr("height", function (d) { return height - y(d.violent_rate); })
            .attr("fill", "red")
            .attr("opacity", "0.5");

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("x", 50)
            .attr("y", 0)
            .style("font-size", "14px")
            .text("Crime Per 100K Population By Quarter 2015-2018");

        svg.append("rect")
            .attr("width", 7)
            .attr("height", 7)
            .attr("x", width + 16.5).attr("y", 0)
            .attr("fill", "red")
            .attr("opacity", "0.5");
        svg.append("text")
            .attr("x", width + 26)
            .attr("dy", "0.35em")
            .text("Violent");
        svg.append("rect")
            .attr("width", 7)
            .attr("height", 7)
            .attr("x", width + 16.5).attr("y", 16.5)
            .attr("fill", "blue")
            .attr("opacity", "0.5");
        svg.append("text")
            .attr("x", width + 26)
            .attr("dy", "1.7em")
            .text("Non-Violent");

    });
}

function destroyChartWhole(){
    var svg = d3.select("#bostonchart");
    svg.selectAll("*").remove();
}

function drawChartArea(){
    var margin = { top: 50, right: 100, bottom: 50, left: 50 };
    var outerHeight = 525, outerWidth = document.getElementById("bostonmapdiv").offsetWidth * 0.6;
    var width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);
    var svg = d3.select("#bostonchart").attr("width", outerWidth).attr("height", outerHeight)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.csv("data/map/crime_by_quarter_whole_boston.csv", function (error, data) {
        if (error) throw error;

        data.forEach(function (d) {
            d.violent_rate = (+d.violent) / 8.6;
            d.non_violent_rate = (+d.non_violent) / 8.6;
        });

        x.domain(data.map(function (d) { return d.quarter; }));
        y.domain([0, d3.max(data, function (d) { return (d.violent_rate + d.non_violent_rate) * 1.1; })]);

        svg.selectAll(".bar-non-violent")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-non-violent")
            .attr("x", function (d) { return x(d.quarter); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.non_violent_rate); })
            .attr("height", function (d) { return height - y(d.non_violent_rate); })
            .attr("fill", "blue")
            .attr("opacity", "0.5");

        svg.selectAll(".bar-violent")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-violent")
            .attr("x", function (d) { return x(d.quarter); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.violent_rate) - (height - y(d.non_violent_rate)); })
            .attr("height", function (d) { return height - y(d.violent_rate); })
            .attr("fill", "red")
            .attr("opacity", "0.5");

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("x", 50)
            .attr("y", 0)
            .style("font-size", "14px")
            .text("Crime Per 100K Population By Quarter 2015-2018");

        svg.append("rect")
            .attr("width", 7)
            .attr("height", 7)
            .attr("x", width + 16.5).attr("y", 0)
            .attr("fill", "red")
            .attr("opacity", "0.5");
        svg.append("text")
            .attr("x", width + 26)
            .attr("dy", "0.35em")
            .text("Violent");
        svg.append("rect")
            .attr("width", 7)
            .attr("height", 7)
            .attr("x", width + 16.5).attr("y", 16.5)
            .attr("fill", "blue")
            .attr("opacity", "0.5");
        svg.append("text")
            .attr("x", width + 26)
            .attr("dy", "1.7em")
            .text("Non-Violent");

    });
}

var crimeData;
d3.csv("data/map/crimeRate_by_zipcode_across_UCR.csv", function (data) {
    crimeData = data;
    crimeData.forEach(function (row) {
        row.crime_rate = +row.crime_rate;
    });
});
function crimeRate(d) {
    var zipcode = d.properties.ZIP5;
    var crime_rate = 0;
    crimeData.forEach(function (row) {
        if (row.zipcode == zipcode) {
            crime_rate = crime_rate + row.crime_rate;
        }
    });
    return (crime_rate * 100000 / 4).toFixed(1);
}
var mapColor = d3.scaleLinear()
    .domain([0, 25000])
    .clamp(true)
    .range(['#d0f5f5', '#1d5959']);
function fillFn(d) {
    return mapColor(crimeRate(d));
}

var objects = {
    "02121": "Dorchester", "02118": "Boston",
    "02130": "Jamaica Plain", "02126": "Mattapan",
    "02119": "Roxbury", "02122": "Dorchester",
    "02124": "Dorchester Center", "02127": "Boston",
    "02131": "Roslindale", "02125": "Dorchester Center",
    "02135": "Brighton", "02116": "Boston",
    "02134": "Allston", "02120": "Roxbury Crossing",
    "02109": "Boston", "02136": "Hyde Park",
    "02150": "Chelsea", "02115": "Boston",
    "02132": "West Roxbury", "02111": "Boston",
    "02129": "Charlestown", "02110": "Boston",
    "02199": "Boston", "02215": "Boston",
    "02114": "Boston", "02108": "Boston",
    "02210": "Boston", "02128": "Boston",
    "02117": "Boston", "02113": "Boston",
    "02186": "Milton", "02445": "Brookline",
    "02026": "Dedham", "02141": "Cambridge",
    "02171": "Quincy", "02151": "Revere",
    "02205": "Boston", "02446": "Brookline",
    "02145": "Somerville", "02152": "Winthrop"
};

d3.json("data/map/ZIP_Codes.geojson", function (error, boston) {
    if (error) throw error;
    
    var margin = { left: 50, right: 50, top: 50, bottom: 50 };
    var outerHeight = 525, outerWidth = document.getElementById("bostonmapdiv").offsetWidth * 0.4;
    var svg = d3.select("#bostonmapdiv").append("svg").attr("id", "bostonmap").attr("width", outerWidth).attr("height", outerHeight)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var height = outerHeight - margin.top - margin.bottom;
    var width = outerWidth - margin.left - margin.right;

    var path = d3.geoPath()
        .projection(d3.geoConicConformal()
            .parallels([41 + 43 / 60, 42 + 41 / 60])
            .rotate([71 + 30 / 60, 0])
            .fitSize([width, height], boston));

    svg.selectAll("path")
        .data(boston.features)
        .enter().append("path")
        .attr("d", path)
        .style('fill', fillFn)
        .on("mouseover", function (d) {
            d3.select(this)
                .style("stroke-width", 1.5)
                .style("stroke-dasharray", 0)
                .style("fill", "Orange");
            d3.select("#neighborhoodPopover")
                .transition()
                .style("opacity", 1)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .text("Zip code: " + d.properties.ZIP5 + "\u00A0\u00A0\u00A0 Neighborhood: " + objects[d.properties.ZIP5] + "\u00A0\u00A0\u00A0 Average crime rate per 100K population: " + crimeRate(d));
            destroyChartWhole();
            drawChartArea();
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke-width", .25)
                .style("stroke-dasharray", 1)
                .style('fill', fillFn);

            d3.select("#neighborhoodPopover")
                .transition()
                .style("opacity", 0);
            destroyChartWhole();
            drawChartWhole();
        });

    svg.append("text").text("Darker areas have higher overall crime rate!");

    d3.select("#bostonmapdiv").append("svg").attr("id", "bostonchart");
    drawChartWhole();
});

function fillHeatmap(d){
    var zipcode = d.properties.ZIP5;
    console.log(zipcode);
    var heatZones = ["02121", "02119", "02124", "02126", "02122"];
    if (heatZones.indexOf(zipcode) >= 0){
        return "red";
    }
    else{
        return "lightsteelblue";
    }
}

d3.json("data/map/ZIP_Codes.geojson", function (error, boston) {
    if (error) throw error;
    var margin = { left: 50, right: 50, top: 50, bottom: 50 };
    var outerHeight = 525, outerWidth = document.getElementById("moremap").offsetWidth;
    var svg = d3.select("#moremap").append("svg").attr("id", "bostonmap2").attr("width", outerWidth).attr("height", outerHeight)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var height = outerHeight - margin.top - margin.bottom;
    var width = outerWidth - margin.left - margin.right;

    var path = d3.geoPath()
        .projection(d3.geoConicConformal()
            .parallels([41 + 43 / 60, 42 + 41 / 60])
            .rotate([71 + 30 / 60, 0])
            .fitSize([width, height], boston));

    svg.selectAll("path")
        .data(boston.features)
        .enter().append("path")
        .attr("d", path)
        .style('fill', fillHeatmap)
        .on("mouseover", function (d) {
            d3.select(this)
                .style("stroke-width", 1.5)
                .style("stroke-dasharray", 0)
                .style("fill", "Orange");
            d3.select("#neighborhoodPopover2")
                .transition()
                .style("opacity", 1)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .text("Zip code: " + d.properties.ZIP5 + "\u00A0\u00A0\u00A0 Neighborhood: " + objects[d.properties.ZIP5]);
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke-width", .25)
                .style("stroke-dasharray", 1)
                .style('fill', fillHeatmap);

            d3.select("#neighborhoodPopover2")
                .transition()
                .style("opacity", 0);
        });;
});