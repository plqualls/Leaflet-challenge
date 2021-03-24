//Store API inside query
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Perform a Get request to the query and send the data.features object to the createFeatures function.
dj.json(queryUrl, function(data) {
    createFeatures(data.features);
    console.log(data.features)
});
function createFeatures(earthquakeData) {
//Define a function to run once for each feature in the array and give each feature a pop-up describing the place and time of earthquake.
function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "<p>");
}

//Create the circle radius based on the magnitude
function radiusSize(magnitude) {
    return magnitude * 20000;
}


}