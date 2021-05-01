function InitDashboard() {

  d3.json("./data/samples.json").then(function (data) {

      var samples = data.samples;

      // select and populate the dropdwon
      var select = document.getElementById("selDataset");

      // create dropdown options
      var options = document.querySelectorAll('#selDataset option');

      if (options.length === 0) {

          // populate dropdown with loop
          for (var i = 0; i < samples.length; i++) {
              var option = document.createElement('option');
              option.text = samples[i].id;
              select.add(option, 0);
          };
      };

      // get current dropdown value
      var dropdownMenu = d3.select("#selDataset");
      var currentID = dropdownMenu.property("value");

      // filter based on id
      var result = samples.filter(obj => {
          return obj.id === currentID
      });

      // Storing vars for chart data
      var sampleValues = result[0].sample_values;
      var sampleValuesTen = [...sampleValues]
      sampleValuesTen = sampleValuesTen.slice(0, 10); // Add line to reverse so chart is flipped
      var otuIDs = result[0].otu_ids;
      var otuIdNums = [...otuIDs];
      var otuLabels = result[0].otu_labels;

      // adding OTU id to the y axis as f-string
      otuIDs.forEach(function (part, index, otuIDs) {
          otuIDs[index] = `OTU ${otuIDs[index]}`;
      });

      // Create trace for hbar plot
      var hbarData = [{
          type: 'bar',
          x: sampleValuesTen,
          y: otuIDs,
          text: otuLabels,
          orientation: 'h'
      }];

      // create the hbar chart
      Plotly.newPlot('bar', hbarData);

      // color lists for marker colors
      var colors = ['pink', 'red', 'orange', 'yellow', 'green', 'blue', 'grey', 'black']
      var markerColors = [];

      // put a bunch of colors into an array
      for (var i = 0; i < otuIdNums.length; i++) {
          var counter = i % 8;
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
              size: sampleValues
          }
      }];

      // bubble chart layout
      var bubbleLayout = {
          showlegend: false,
          xaxis: {
              title: 'OTU ID'
          }
      };

      Plotly.newPlot('bubble', bubbleData, bubbleLayout);

      // Clear out Demographic info panel before updating
      document.getElementById("sample-metadata").innerHTML = "";

      // Filter out the metadata corresponding to the selected ID, similar to filtering the sample values above
      var metadata = data.metadata;
      var currentMeta = metadata.filter(obj => {
          return obj.id == currentID
      });

      // create & assign metadata variables for the demographic info panel
      var ethnicityMeta = currentMeta[0].ethnicity;
      var genderMeta = currentMeta[0].gender;
      var ageMeta = currentMeta[0].age;
      var locationMeta = currentMeta[0].location;
      var bbtypeMeta = currentMeta[0].bbtype;
      var wfreqMeta = currentMeta[0].wfreq;
      
      // add list to the Demographic Info panel
      var sampleList = [`id: ${currentID}`, `ethnicity: ${ethnicityMeta}`, `gender: ${genderMeta}`, `age: ${ageMeta}`, `location: ${locationMeta}`, `bbtype: ${bbtypeMeta}`, `wfreq: ${wfreqMeta}`];
      var panel = document.getElementById("sample-metadata");
      var ul = document.createElement("ul");
      
      // create all the li
      for (i = 0; i <= sampleList.length - 1; i++) {
          var li = document.createElement('li');
          li.innerHTML = sampleList[i];
          li.setAttribute('style', 'display: block;');
          ul.appendChild(li);
      };

      // append ul
      panel.appendChild(ul);
  });
};

InitDashboard();
