function InitDashboard() {

  d3.json("data/samples.json").then(function (data) {
      
      // pull data
      var samples = data.samples;

      // select and populate the dropdown with options
      var select = document.getElementById("selDataset");
      var options = document.querySelectorAll('#selDataset option');

      if (options.length === 0) {

          // populate dropdown with loop
          for (var i = 0; i < samples.length; i++) {
              var option = document.createElement('option');
              option.text = samples[i].id;
              select.add(option, 0);
          };
      };

      // create dropdown value
      var dropdownMenu = d3.select("#selDataset");
      var currentID = dropdownMenu.property("value");

      // create id filter 
      var result = samples.filter(obj => {
          return obj.id === currentID
      });

      // Clear out Demographic info panel before updating
      document.getElementById("sample-metadata").innerHTML = "";

      // Filter out the metadata by selected ID
      var metadata = data.metadata;
      var currentMeta = metadata.filter(obj => {
          return obj.id == currentID
      });

      // create & assign metadata variables for the demo info panel
      var ethnicityMeta = currentMeta[0].ethnicity;
      var genderMeta = currentMeta[0].gender;
      var ageMeta = currentMeta[0].age;
      var locationMeta = currentMeta[0].location;
      var bbtypeMeta = currentMeta[0].bbtype;
      var wfreqMeta = currentMeta[0].wfreq;
      
      // add list to the demo info panel
      var sampleList = [`id: ${currentID}`, `ethnicity: ${ethnicityMeta}`, `gender: ${genderMeta}`, `age: ${ageMeta}`, `location: ${locationMeta}`, `bbtype: ${bbtypeMeta}`, `wfreq: ${wfreqMeta}`];
      var panel = document.getElementById("sample-metadata");
      var ul = document.createElement("ul");
      
      // create li
      for (i = 0; i <= sampleList.length - 1; i++) {
          var li = document.createElement('li');
          li.innerHTML = sampleList[i];
          li.setAttribute('style', 'display: block;');
          ul.appendChild(li);
      };

      // append ul
      panel.appendChild(ul);

      // store variabless for chart
      var sampleValues = result[0].sample_values;
      var sampleValuesTen = [...sampleValues]
      var otuIDs = result[0].otu_ids;
      var otuIdNums = [...otuIDs];
      var otuLabels = result[0].otu_labels;

      sampleValuesTen = sampleValuesTen.slice(0, 10); // flip chart

      // add OTU id to the y axis as f-string
      otuIDs.forEach(function (part, index, otuIDs) {
          otuIDs[index] = `OTU ${otuIDs[index]}`;
      });

      // create trace for hbar 
      var hbarData = [{
          type: 'bar',
          x: sampleValuesTen,
          y: otuIDs,
          text: otuLabels,
          orientation: 'h'
      }];
      
      // hbar layout
      var hbarLayout = {
        title: "Top 10 OTU (Operational Taxonomic Unit) IDs",
        yaxis:{
            autorange: "reversed"
        }
    };

      // create hbar
      Plotly.newPlot('bar', hbarData, hbarLayout);

      // create list for marker colors
      var colors = ['pink', 'red', 'orange', 'blue', 'yellow', 'purple', 'green', 'brown', 'lime', 'violet']
      var markerColors = [];

      // input colors into an array
      for (var i = 0; i < otuIdNums.length; i++) {
          var counter = i % 10;
          counter = Math.floor(counter);
          console.log(counter);
          markerColors.push(colors[counter]);
      };
     
      // trace for bubble chart
      var bubbleData = [{
          x: otuIdNums,
          y: sampleValues,
          text: otuLabels,
          mode: 'markers',
          marker: {
              color: markerColors,
              size: sampleValues,
              colorscale: "electric"
          }
      }];

      // bubble chart layout
      var bubbleLayout = {
          title: 'Bacteria Cultures per Sample',
          hovermode: 'closest',
          showlegend: false,
          xaxis: {
              title: 'OTU (Operational Taxonomic Unit) ID'
          }
      };

      Plotly.newPlot('bubble', bubbleData, bubbleLayout);
      
  });
};

InitDashboard();
