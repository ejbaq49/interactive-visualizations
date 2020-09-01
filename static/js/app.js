// Pull in and process samples.json for charts
d3.json("/static/data/samples.json").then((data) => {
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

  // change event for select
  testSubject.on("change", updateCharts);

  // event functions
  function updateCharts() {
    // Prevent refresh
    d3.event.preventDefault();

    // get selectedSubject
    var selectedSubject = testSubject.property("value");

    // filter metadata for panel-body
    filteredMetadata = metadata.filter(function (meta) {
      return meta.id == selectedSubject;
    });

    // filter samples
    var filteredSamples = samples.filter(function (sample) {
      return sample.id == selectedSubject;
    });

    // remove all paragraph elements first
    sampleMetadata.html("");
    // add paragraph tags in panel-body
    filteredMetadata.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        // console.log(`${key}: ${value}`);
        var newParagraph = sampleMetadata.append("p");
        newParagraph.text(`${key}: ${value}`);
      });
    });

    // console.log
    console.log(`Selected Sample: ${selectedSubject}`);
    console.log(`Sample Metadata: ${JSON.stringify(filteredMetadata)}`);
    console.log(`Samples: ${JSON.stringify(filteredSamples)}`);
  }
});
