function setRadius(aqi){

switch(true){
    case (aqi < 10):
    return 1;
    break;
    case (aqi < 20):
    return 2;
    break;
    case (aqi < 30):
    return 4;
    break;
    case (aqi <= 40):
    return 8;
    break;
    case (aqi <= 50):
    return 16;
    break;
    case (aqi <= 60):
    return 32;
    break;
    case (aqi <= 70):
    return 64;
    break;
    default:
    return 128;
}
}

console.log("hello")

var url = "/api/pollution";

var yearsDropDown = d3.select("#years-dropdown")

d3.json(url).then(function(response) {

    // populate years dropdown
    var years = response.map(entry => entry.year);
    years.sort(function(a, b){return a - b})
    //console.log(years);
    var yearsUnique = new Set(years)
    //console.log(yearsUnique)

    // var yearsDropDown = d3.select("#years-dropdown")

    yearsUnique.forEach(year => {
        yearsDropDown.append("option").text(year)
    })
});
  
var selYear = 2000;

function filterData(data){

return data.year == selYear
}

function createMap(response){
    var filteredResponse = response.filter(filterData)
    console.log(filteredResponse);

    var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
}) 

    var cityMarkers = [];
    var coCircles = [];
    var o3Circles = [];
    var so2Circles = [];
    var no2Circles = [];


    // filteredResponse.forEach(entry => {
    for(var i=0; i< filteredResponse.length; i ++){
        var entry = filteredResponse[i];
        coCircles.push(
            L.circle([entry.coord[0], entry.coord[1]], {
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 0.5,
                    radius: setRadius(entry.co)*10000
                })
        )
        o3Circles.push(
            L.circle([entry.coord[0], entry.coord[1]], {
                    color: 'red',
                    fillColor: 'red',
                    fillOpacity: 0.5,
                    radius: setRadius(entry.o3)*10000
                })
        )
        so2Circles.push(
            L.circle([entry.coord[0], entry.coord[1]], {
                    color: 'green',
                    fillColor: 'green',
                    fillOpacity: 0.5,
                    radius: setRadius(entry.so2)*10000
                })
        )
        no2Circles.push(
            L.circle([entry.coord[0], entry.coord[1]], {
                    color: 'yellow',
                    fillColor: 'yellow',
                    fillOpacity: 0.5,
                    radius: setRadius(entry.no2)*10000
                })
        )
        
        cityMarkers.push(
            L.marker([entry.coord[0], entry.coord[1]])
        )

    // marker.bindPopup("<b>" + entry.state + "</b><hr>Year: " + Math.round(entry.year) + "</b><br>CO: " + Math.round(entry.co) + "<br>SO2: " + Math.round(entry.so2) + "<br>NO2: " + Math.round(entry.no2) + "<br>O3: " + Math.round(entry.o3))

    }
    //})

    //console.log(coCircles);

    // Create two separate layer groups: one for cities and one for states
    var coGroup = L.layerGroup(coCircles);
    var o3Group = L.layerGroup(o3Circles);
    var so2Group = L.layerGroup(so2Circles);
    var no2Group = L.layerGroup(no2Circles);
    var cities = L.layerGroup(cityMarkers);

    var myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 5, 
        layers: [baseMap, cities, coGroup, o3Group, so2Group, no2Group]
        });

    // Create a baseMaps object
        var baseMaps = {
            "Street Map": baseMap,
            };
    
        // Create an overlay object
        var overlayMaps = {
            "Carbon Monoxide": coGroup,
            "Ozone": o3Group,
            "Sulpher Dioxide": so2Group,
            "Nitrogen Dioxide": no2Group,
            "City Information": cities
        };

        L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
        }).addTo(myMap);
}
  
d3.json(url).then(function(response) {
      createMap(response)
})

  
// eventListener //
// --------------//

yearsDropDown.on("change", function() {
    //console.log(response)
    selYear = yearsDropDown.property("value")
    console.log(selYear)

    d3.select("#map").remove()
    d3.select(".col-xl-12").append("div").attr("id", "map")
    
    d3.json(url).then(function(response) {
        createMap(response)
    })
      
})