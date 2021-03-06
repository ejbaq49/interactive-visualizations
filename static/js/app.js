// Pull in and process samples.json for charts
d3.json("./static/data/samples.json").then((data) => {
  // retrieve datasets
  var metadata = data.metadata;
  var subjectNames = data.names;
  var samples = data.samples;

  // console.log(metadata);

  // add test subjects to select
  var testSubject = d3.select("#selDataset");
  subjectNames.forEach((subject) => {
    var newSubject = testSubject.append("option");
    newSubject.text(subject);
  });

  // define elements
  var sampleMetadata = d3.select("#sample-metadata");
  var barPlot = d3.select("#bar");
  var gaugePlot = d3.select("#gauge");
  var bubblePlot = d3.select("#bubble");

  // create change event for select
  testSubject.on("change", updateCharts);

  // event functions
  function updateCharts() {
    // Prevent refresh
    d3.event.preventDefault();

    // clear console
    // console.clear();

    // get selectedSubject
    var selectedSubject = testSubject.property("value");

    // filter metadata for panel-body
    filteredMetadata = metadata.filter(function (meta) {
      return meta.id == selectedSubject;
    });

    // filter samples by selectedSubject
    var filteredSamples = samples.filter(function (sample) {
      return sample.id == selectedSubject;
    });

    // remove all paragraph elements first
    sampleMetadata.html("");
    // add paragraph tags in panel-body; return wash frequency
    var washFreq = 0;
    filteredMetadata.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        // console.log(`${key}: ${value}`);
        var newParagraph = sampleMetadata.append("p");
        newParagraph.text(`${key}: ${value}`);
        if (key === "wfreq") {
          washFreq = value;
        }
      });
    });

    // slice samples for first 10 items for barPlot
    var sampleValues = filteredSamples[0].sample_values.slice(0, 10);
    var otuLabels = filteredSamples[0].otu_labels.slice(0, 10);
    var otuIDs = filteredSamples[0].otu_ids.slice(0, 10);
    // prefix otuIDs with "OTU"
    var otuIDsP = [];
    otuIDs.forEach(function (otu) {
      otuIDsP.push(`OTU ${otu}`);
    });

    // create trace for bar chart
    var traceBar = {
      type: "bar",
      x: sampleValues.reverse(),
      y: otuIDsP.reverse(),
      text: otuLabels.reverse(),
      orientation: "h",
    };

    var dataBar = [traceBar];

    Plotly.newPlot("bar", dataBar);

    // create trace for bubble plot
    var traceBubble = {
      x: otuIDs.reverse(),
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIDs,
      },
    };

    var layBubble = {
      xaxis: {
        title: {
          text: "OTU ID",
        },
      },
    };

    var dataBubble = [traceBubble];

    Plotly.newPlot("bubble", dataBubble, layBubble);

    // Gauge Chart
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        // line: { color: "blue", width: 3 },
        // color: "blue",
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        // delta: { reference: 380 },
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "lightgray" },
            { range: [1, 2], color: "gray" },
            { range: [2, 3], color: "lightgray" },
            { range: [3, 4], color: "gray" },
            { range: [4, 5], color: "lightgray" },
            { range: [5, 6], color: "gray" },
            { range: [6, 7], color: "lightgray" },
            { range: [7, 8], color: "gray" },
            { range: [8, 9], color: "lightgray" },
          ],
          bar: { color: "steelblue" },
          threshold: {
            line: { color: "steelblue", width: 3 },
            thickness: 0.75,
            value: washFreq,
          },
        },
      },
    ];

    var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    // Gauge Chart

    // console.log
    console.log(`Selected Sample: ${selectedSubject}`);
    console.log(`Sample Metadata: ${JSON.stringify(filteredMetadata)}`);
    console.log(`Filtered Sample: ${JSON.stringify(filteredSamples)}`);
    console.log(`Sample Values: ${JSON.stringify(sampleValues)}`);
    console.log(`OTU IDs: ${JSON.stringify(otuIDs)}`);
    console.log(`OTU IDs Prefixed: ${otuIDsP}`);
    console.log(`OTU Labels: ${JSON.stringify(otuLabels)}`);
    console.log(`Wash Frequency: ${washFreq}`);
  }
});
