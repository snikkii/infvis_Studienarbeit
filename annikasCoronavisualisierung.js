var click = true; //verhindert Drehen der Daten an x-Achse, wenn man Button mehrmals betätigt
//Ränder des Graphen einstellen
var margin = { top: 30, right: 30, bottom: 140, left: 60 },
    width = (window.innerWidth / 2) - margin.left - margin.right,
    height = (window.innerHeight / 2) - margin.top - margin.bottom;

//svg-Objekt an div mit ID "graph" anfügen
var svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Tooltip an div mit ID "graph" anfügen
var Tooltip = d3.select("#graph")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip");

//x-Achse initialisieren
var x = d3.scaleBand()
    .range([0, width])
    .padding(1);
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")");

//y-Achse initialisieren
var y = d3.scaleLinear()
    .range([height, 0]);
var yAxis = svg.append("g")
    .attr("class", "myYaxis");
click = true;

//Funktion "update" erstellt das Diagramm anhand der ausgewählten Variable bzw. datet diese up
function update(selectedVar) {
    //Daten analysieren
    d3.csv("bundeslaender_gesamt.csv", function(data) {
        //x-Achse
        x.domain(data.map(function(d) { return d.Bundesland; }));
        xAxis.transition().duration(1000).call(d3.axisBottom(x));
        if (click == true) {
            svg.selectAll("text")
                .attr("transform", "translate(-15,70) rotate(-90)");
            click = false;
        }

        //y-Achse
        y.domain([0, d3.max(data, function(d) { return +d[selectedVar] })]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        //Variable "j" erstellt die Linien, die als Stiele für die "Lollipops" gelten
        var j = svg.selectAll(".myLine")
            .data(data);
        j
            .enter()
            .append("line")
            .attr("class", "myLine")
            .merge(j)
            .transition()
            .duration(1000)
            .attr("x1", function(d) { console.log(x(d.Bundesland)); return x(d.Bundesland); })
            .attr("x2", function(d) { return x(d.Bundesland); })
            .attr("y1", y(0))
            .attr("y2", function(d) { return y(d[selectedVar]); })
            .attr("stroke", "rgb(54, 65, 68)");

        //3 Funktionen zum Zeigen/Verstecken der Informationen der einzelnen Bundesländern 
        //Bei Bewegungen im gleichen Kreis bleibt die Informationsanzeige erhalten
        var mouseOver = function() {
            Tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("opacity", 1);
        };

        var mouseMove = function(d) {
            Tooltip
                .html(d.Bundesland + "<br>Einwohner: " + d.Einwohner +
                    "<br>Coronafälle: " + d.Faelle +
                    "<br>Todesfälle durch Corona: " + d.Todesfaelle)
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px");
        };
        var mouseLeave = function() {
            Tooltip
                .style("opacity", 0);
            d3.select(this)
                .style("opacity", 0.8);
        };

        //Variable u erstellt Kreise, die als Topping der "Lollipops" gelten
        var u = svg.selectAll("circle")
            .data(data)
            .on("mouseover", mouseOver)
            .on("mousemove", mouseMove)
            .on("mouseleave", mouseLeave);
        u
            .enter()
            .append("circle")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("cx", function(d) { return x(d.Bundesland); })
            .attr("cy", function(d) { return y(d[selectedVar]); })
            .attr("r", 8)
            .attr("fill", "rgba(0, 118, 148, 0.7)")
            .attr("class", "u");
    });
}
//Aufrufen der Funktion, sodass sie die Fälle zuerst anzeigt
update('Faelle');