// Creating map object
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 6
});

// Adding tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: API_KEY
}).addTo(myMap);

var url = "/api/pollution";

d3.json(url, function(response) {

  console.log(response);

  var heatArray = [];

  for (var i = 0; i < response.length; i++) {
    var location = response[i].coord;

    if (location) {
      heatArray.push([location[1], location[0]]);
    }
  }

  console.log("response")
  console.log(heatArray);

  var heat = L.heatLayer(heatArray, {
    radius: 50,
    blur: 35
  }).addTo(myMap);

});

var circle = L.circle([37.0902, -95.7129], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 5000
}).addTo(myMap);
