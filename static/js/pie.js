// js 
// var data = [
//     {
//       "co": 4.12903225806452, 
//       "no2": 21.3870967741935, 
//       "o3": 18.9032258064516, 
//       "so2": 6.58064516129032, 
//       "state": "Alabama", 
//       "year": 2013
//     }, 
//     {
//       "co": 3.71144278606965, 
//       "no2": 21.4958540630182, 
//       "o3": 36.983416252073, 
//       "so2": 7.95695364238411, 
//       "state": "Alabama", 
//       "year": 2014
//     }, 
// ]

var url = "/api/pollution"

console.log(url)

d3.json(url).then(data => {

    console.log(data);
    var metadata = data.filter(data=> data.state=="Alabama")
    var i = 0;
    var trace = [{
        values: [metadata[i].co, metadata[i].no, metadata[i].o3, metadata[i].so2],
        labels :["CO2", "NO", "03", "SO2"],
        type: "pie"
    }];

    Plotly.newPlot("pie",trace,
    {
        sliders: [{
        pad: {t: 30},
        currentvalue: {
            xanchor: "right",
            prefix: "color: ",
            font: {
            color: "#888",
            size: 20
            }
        },
        steps: [{
        label: "red",
        method: "restyle",
        args: ["i", 1]
        }, {
        label: "green",
        method: "restyle",
        args: ["i", "2"]
        }, {
        label: "blue",
        method: "restyle",
        args: ["line.color", "blue"]
        }]
    }]
    });
});

// var data = [{
//     values: [19, 26, 55],
//     labels: ['Residential', 'Non-Residential', 'Utility'],
//     type: 'pie'
//   }];
  
//   var layout = {
//     height: 400,
//     width: 500
//   };
  
//   Plotly.newPlot('pie', data, layout);