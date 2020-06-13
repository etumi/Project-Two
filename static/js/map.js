var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
})

// Initialize all of the LayerGroups we'll be using
var layers = {
    coGroup: new L.LayerGroup(),
    o3Group: new L.LayerGroup(),
    so2Group: new L.LayerGroup(),
    no2Group: new L.LayerGroup(),
    states: new L.LayerGroup()
  };

var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 5, 
    layers: [
        layers.coGroup,
        layers.o3Group,
        layers.so2Group,
        layers.no2Group,
        layers.states
    ]
});

baseMap.addTo(myMap)

// Create an overlay object
var overlays = {
    "<span style='font-size: 10px'>Carbon Monoxide</span>": layers.coGroup,
    "<span style='font-size: 10px'>Ozone</span>": layers.o3Group,
    "<span style='font-size: 10px'>Sulpher Dioxide</span>": layers.so2Group,
    "<span style='font-size: 10px'>Nitrogen Dioxide</span><hr>": layers.no2Group,
    "<span style='font-size: 10px'>State Info</span>": layers.states
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(myMap);


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

function setColor(mag){

    switch(true){
      case (mag <= 50):
        return "#90BE6D";
        break;
      case (mag <= 100):
        return "#F9C74F";
        break;
      case (mag <= 150):
        return "#F8961E";
        break;
      case (mag <= 200):
        return "#F94144";
        break;
      case (mag <= 300):
        return "#7209B7";
        break;
      default:
        return "#772E25"
    }
  }

var selYear = 2000;

function filterData(data){
    return data.year == selYear
}

var url = "/api/pollution";

var yearsDropDown = d3.select("#years-dropdown")

d3.json(url).then(function(response) {

    // populate years dropdown
    var years = response.map(entry => entry.year);
    years.sort(function(a, b){return a - b})

    var yearsUnique = new Set(years)
    yearsUnique.forEach(year => {
        yearsDropDown.append("option").text(year)
    })
});

// d3.json(url).then(function(response) {
function createMap(response){
    layers.coGroup.clearLayers()
    layers.o3Group.clearLayers()
    layers.so2Group.clearLayers()
    layers.no2Group.clearLayers()
    layers.states.clearLayers()

    var filteredResponse = response.filter(filterData)

    for(var i=0; i< filteredResponse.length; i ++){
        var entry = filteredResponse[i];

        var circleCo = L.circle([entry.coord[0], entry.coord[1]], {
                color: 'blue',
                fillColor: setColor(entry.co),
                fillOpacity: 0.5,
                radius: setRadius(entry.co)*25000
            })
        circleCo.addTo(layers["coGroup"])

        var circleO3 = L.circle([entry.coord[0], entry.coord[1]], {
            color: '#788091',
            fillColor: setColor(entry.o3),
            fillOpacity: 0.5,
            radius: setRadius(entry.o3)*5000
        })
        circleO3.addTo(layers["o3Group"])

        var circleSo2 = L.circle([entry.coord[0], entry.coord[1]], {
            color: '#FFFFFF',
            fillColor: setColor(entry.so2),
            fillOpacity: 0.5,
            radius: setRadius(entry.so2)*15000
        })
        circleSo2.addTo(layers["so2Group"])

        var circleNo2 = L.circle([entry.coord[0], entry.coord[1]], {
            color: '#252422',
            fillColor: setColor(entry.no2),
            fillOpacity: 0.5,
            radius: setRadius(entry.no2)*10000
        })
        circleNo2.addTo(layers["no2Group"])

        var marker = L.marker([entry.coord[0], entry.coord[1]])

        marker.bindPopup("<b>" + entry.state + "</b><hr>Year: " + Math.round(entry.year) + "</b><br>CO: " + Math.round(entry.co) + "<br>SO2: " + Math.round(entry.so2) + "<br>NO2: " + Math.round(entry.no2) + "<br>O3: " + Math.round(entry.o3))

        marker.addTo(layers["states"])
    }
// })
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

    // myMap.removeLayer(layers.coGroup);
    
    d3.json(url).then(function(response) {
        createMap(response)
    })
      
})

// LEGEND //

var legend = L.control({position: "bottomright"});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 50, 100, 150, 200, 300],
        labels = ['Good', 'Moderate', 'Unhealthy1', 'Unhealthy2', 'Very Unhealthy', 'Hazardous'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + setColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ': ' + labels[i] +
            '<br>' : '+: Hazardous');
    }

    return div;
};

legend.addTo(myMap);