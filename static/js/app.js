d3.json("samples.json").then((data) => {
  var metadata = data.metadata;
  var subjectNames = data.names;

  // add test subjects to select
  var testSubject = d3.select("#selDataset");
  subjectNames.forEach((subject) => {
    var newSubject = testSubject.append("option");
    newSubject.text(subject);
  });
});
