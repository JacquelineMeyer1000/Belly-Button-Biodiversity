//Portions of code are from the bootcamp office hours tutorial.
console.log("app.js loaded");

function init() {
    //Populate dropdown
    var dropdown = d3.select("#selDataset");

    d3.json("data/samples.json").then(d => {
        console.log(d);

        var sampleNames = d.names;

        
        sampleNames.forEach(sample => {
            dropdown.append("option")
                .text(sample)
                .property("value", sample);
        });

    //Get initial selected dropdown value
    optionSelected(sampleNames[0]);

    });
};

function optionSelected(selectedSample){
    console.log(selectedSample);

    //Draw graphs and get demo data
    drawGraphs(selectedSample);
    getDemoData(selectedSample);

};

function drawGraphs(selectedSample){
    //console.log(`Draw Bargraph for ${selectedSample}`);

    d3.json("data/samples.json").then(d => {

        var samples = d.samples;
        var resultArray = samples.filter(s => s.id == selectedSample);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        drawBargraph(otu_ids, otu_labels, sample_values);
        drawBubbleChart(otu_ids, otu_labels, sample_values);
        
    });

};

function drawBargraph(otu_ids, otu_labels, sample_values){
    //draw Bargraph based on selected sample ID
    xticks = sample_values.slice(0,10).reverse();
    yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    var barTrace = {
        x: xticks,
        y: yticks,
        type: "bar",
        text: otu_labels.slice(0,10).reverse(),
        orientation: "h"
    }

    var barData = [barTrace];

    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {t:30, l:150}
    }

    Plotly.newPlot("bar", barData, barLayout);

};

function drawBubbleChart(otu_ids, otu_labels, sample_values) {
    //draw Bubble Chart based on selected sample ID
    var bubbleTrace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values
        }
    }

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
        height: 600,
        width: 1200
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
};


function getDemoData(selectedSample){
    console.log(`Show Demographic Data for ${selectedSample}`);

    d3.json("data/samples.json").then(d => {

        var metadata = d.metadata;
        var resultArray = metadata.filter(m => m.id == selectedSample);
        var result = resultArray[0];

        console.log(result);

        //Object.entries(result).forEach(([key, value]) => console.log(`${key}: ${value}`));

        
        var panel = d3.select("#sample-metadata");
        panel.html("");

        var table = panel.append("table");

        Object.entries(result).forEach(([key, value]) => {
            var row = table.append("tr");
            row.append("td").text(`${key}: `)
                .classed("key");
            row.append("td").text(value);
        });

        console.log(table);

    });

};

init();