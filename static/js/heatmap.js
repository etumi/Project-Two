// Creating map object
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 5
});

// Adding tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: API_KEY
}).addTo(myMap);


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

function createMap(){
  d3.json(url).then(function(response) {

    // populate years dropdown
    // var years = response.map(entry => entry.year);
    // years.sort(function(a, b){return a - b})
    // //console.log(years);
    // var yearsUnique = new Set(years)
    // //console.log(yearsUnique)

    // // var yearsDropDown = d3.select("#years-dropdown")

    // yearsUnique.forEach(year => {
    //   yearsDropDown.append("option").text(year)
    // })

    // console.log(response);

    // console.log(d3.extent(response, d => d.no2));
    // console.log(d3.extent(response, d => d.so2));
    // console.log(d3.extent(response, d => d.o3));
    // console.log(d3.extent(response, d => d.co));

    // console.log([response[0].coord[0], response[0].coord[1]])


    var filteredResponse = response.filter(filterData)
    console.log(filteredResponse);

    // if (typeof circleCO !== 'undefined') {
    //   // myMap.remove(circleCO)
    //   // myMap.remove(circleO3)
    //   // myMap.remove(circleNO2)
    //   // myMap.remove(circleSO2)
    //   // myMap.remove(marker)
    //   console.log("hi")
    //   circleCO.remove()
    //   circleO3.remove()
    //   circleNO2.remove()
    //   circleSO2.remove()
    //   marker.remove()
    // }
    // console.log(circleCO)
    // myMap.eachLayer(layer => {
    //   console.log("remove layer")
    //   // console.log(layer)

    //   myMap.removeLayer(layer)
    // })

    filteredResponse.forEach(entry => {
      var circleCO = L.circle([entry.coord[0], entry.coord[1]], {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.5,
        radius: setRadius(entry.co)*25000
      }).addTo(myMap);
      

      var circleO3 = L.circle([entry.coord[0], entry.coord[1]], {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.5,
        radius: setRadius(entry.o3)*5000
      }).addTo(myMap);

      var circleSO2 = L.circle([entry.coord[0], entry.coord[1]], {
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.5,
        radius: setRadius(entry.so2)*10000
      }).addTo(myMap);

      var circleNO2 = L.circle([entry.coord[0], entry.coord[1]], {
        color: 'yellow',
        fillColor: 'yellow',
        fillOpacity: 0.5,
        radius: setRadius(entry.no2)*15000
      }).addTo(myMap);

      var marker = L.marker([entry.coord[0], entry.coord[1]]).addTo(myMap);

      marker.bindPopup("<b>" + entry.state + "</b><hr>Year: " + Math.round(entry.year) + "</b><br>CO: " + Math.round(entry.co) + "<br>SO2: " + Math.round(entry.so2) + "<br>NO2: " + Math.round(entry.no2) + "<br>O3: " + Math.round(entry.o3))

    })

  })

}

createMap()

    // eventListener //
  // --------------//
  yearsDropDown.on("change", function() {
    //console.log(response)
    selYear = yearsDropDown.property("value")
    console.log(selYear)

    createMap()
    
  })