// Perform an API call to the Citi Bike Station Information endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

    // Create an object to keep of the number of markers in each layer
    var earthQuakeCount = {
        zeroToOne: 0,
        oneToTwo: 0,
        twoToThree: 0,
        threeToFour: 0,
        fourToFize: 0,
        fivePlus: 0,
    };

   createFeatures(data.features);

});

// Initialize an object containing icons for each layer group
// var icons = {
//     zeroToOne: L.ExtraMarkers.icon({
//       icon: "ion-settings",
//       iconColor: "white",
//       markerColor: "yellow",
//       shape: "star"
//     }),
//     oneToTwo: L.ExtraMarkers.icon({
//       icon: "ion-android-bicycle",
//       iconColor: "white",
//       markerColor: "red",
//       shape: "circle"
//     }),
//     twoToThree: L.ExtraMarkers.icon({
//       icon: "ion-minus-circled",
//       iconColor: "white",
//       markerColor: "blue-dark",
//       shape: "penta"
//     }),
//     threeToFour: L.ExtraMarkers.icon({
//       icon: "ion-android-bicycle",
//       iconColor: "white",
//       markerColor: "orange",
//       shape: "circle"
//     }),
//     fourToFize: L.ExtraMarkers.icon({
//       icon: "ion-android-bicycle",
//       iconColor: "white",
//       markerColor: "green",
//       shape: "circle"
//     }),
//     fivePlus: L.ExtraMarkers.icon({
//         icon: "ion-android-bicycle",
//         iconColor: "white",
//         markerColor: "green",
//         shape: "circle"
//       })    
//   };

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  };

  function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });

    
      // Initialize all of the LayerGroups we'll be using
      var layers = {
        zeroToOne: new L.LayerGroup(),
        oneToTwo: new L.LayerGroup(),
        twoToThree: new L.LayerGroup(),
        threeToFour: new L.LayerGroup(),
        fourToFize: new L.LayerGroup(),
        fivePlus: new L.LayerGroup()
      };
       
    // Create an overlays object to add to the layer control
    var overlays = {
        "0-1": layers.zeroToOne,
        "1-2": layers.oneToTwo,
        "2-3": layers.twoToThree,
        "3-4": layers.threeToFour,
        "4-5": layers.fourToFize,
        "5+": layers.fivePlus,
        Earthquakes: earthquakes
      };    
      
      // Create the map with our layers
      var map = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 5,
        layers: [
          layers.zeroToOne,
          layers.oneToTwo,
          layers.twoToThree,
          layers.threeToFour,
          layers.fourToFize,
          layers.fivePlus,
          lightmap,
          earthquakes
        ]
      });
    
    // Create a control for our layers, add our overlay layers to it
    L.control.layers(null, overlays).addTo(map);  
        
    // Create a legend to display information about our map
    //   var info = L.control({
    //     position: "bottomright"
    //   });
      
      // When the layer control is added, insert a div with the class of "legend"
    //   info.onAdd = function() {
    //     var div = L.DomUtil.create("div", "legend");
    //     return div;
    //   }; 
      
    }; 

