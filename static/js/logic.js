//Store API inside query.
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

//Create the circle radius based on the magnitude.
function radiusSize(magnitude) {
    return magnitude * 20000;
}

//Set the circle color based on the magnitude.
function circleColor(magnitude) {
    if (magnitude < 1) {
        return "#ccff33"
    }
    else if (magnitude < 2) {
        return "#ffff33"
    }
    else if (magnitude < 3) {
        return "#ffcc33"
    }
    else if (magnitude < 4) {
        return "#ff9933"
    }
    else if (magnitude < 5) {
        return "#ff6633"
    }
    else {
        return "ff3333"
    }
}

var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
        return L.circle(latlng, {
            radius: radiusSize(earthquakeData.properties.mag),
            color: circleColor(earthquakeData.properties.mag),
            fillOpacity: 1
        });
    },
    onEachFeature: onEachFeature
});

//Sending our earthquakes layer to the createMap function
createMap(earthquakes);


}
function createMap(earthquakes) {

//Define outdoormap, 
  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  }); 

//Define satellite map
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

//Define grayscale map
  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  //Creating faultline layer
  var faultline = new L.LayerGroup();

  //BaseMaps object to hold base layers.
  var baseMaps = {
    "Outdoor Map": outdoorsmap,
    "Greyscale Map": grayscalemap,
    "Satellite Map": satellitemap
  };

  //Creating overlay object to hold layer.
  var overlayMaps = {
    Earthquakes: earthquakes,
    FaultLines: faultLine
  };

  //Create map, giving it the streetmap and earthquake layers to display.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [outdoorsmap, earthquakes, faultLine]
  });

  //Create a layer control,add the layer to control the map.
  L.control.layers(baseMaps, overlayMaps, {
      collapsed:false
  }).addTo(myMap);

  //Query to retrieve the faultline data
  var faultlinequery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

  

}