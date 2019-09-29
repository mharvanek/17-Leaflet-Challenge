// Earthquake json url
var earthQuakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var platesUrl = "static/js/plates.json"

// GET
d3.json(earthQuakeUrl, function(data) {
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  // Add popup with earthquake info
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 224;
      var g = Math.floor(255-80*feature.properties.mag);
      var b = 0;
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: feature.properties.mag * 5,
        fillColor: color,
        color: "white",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });


  createMap(earthquakes);
  
}

function createMap(earthquakes) {

  // Create map layer
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
  

  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

// Only one base layer can be shown at a time
var baseMaps = {
  Graysacle: darkmap,
  Outdoors: outdoorsmap,
  Satellite: satellitemap
};

  // Initialize all of the LayerGroups we'll be using
  var layers = {
//    faultLines: faultLines,
    earthquakes: earthquakes
  };  

  var overlays = {
    "Earthquakes" : layers.earthquakes,
 //   "Fault Lines" : layers.faultLines
  };      

  // Crete map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [darkmap, earthquakes]//, faultLines]
  });


  function getColor(d) {
      return d < 1 ? 'rgb(142, 224, 0)' :
            d < 2  ? 'rgb(224, 224, 0)' :
            d < 3  ? 'rgb(224, 180, 0)' :
            d < 4  ? 'rgb(224, 120, 0)' :
            d < 5  ? 'rgb(224, 60, 0)' :
            d < 6  ? 'rgb(224, 0, 0)' :
                     'rgb(255,0,0)';
  }

  // Create legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      intervals = [0, 1, 2, 3, 4, 5]

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop through our intervals to create a label for each color
      for (var i = 0; i < intervals.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(intervals[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              intervals[i] + (intervals[i + 1] ? '&ndash;' + intervals[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  L.control.layers(baseMaps, overlays).addTo(myMap); 
  legend.addTo(myMap);

}