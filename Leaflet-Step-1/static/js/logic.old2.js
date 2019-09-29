// Creating map object
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Link to GeoJSON
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var geojson;

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
  return magnitude * 5;
}

// Grab data with d3
d3.json(APILink, function(data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "mag",

    // Set color scale
    scale: ["#b0e882", "#b10026"],

    // Number of breaks in step range
    steps: 5,

    // q for quartile, e for equidistant, k for k-means
    mode: "e",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.9
    },

    // Binding a pop-up to each layer
    pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng,
                    {
                    radius: markerSize(feature.properties.mag)}
                    ).bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + 
            "<p> Magnitude: " + feature.properties.mag + "</p>");
        }
      }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Magnitude</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});
