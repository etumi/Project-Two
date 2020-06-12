var url = "/api/pollution" ;

d3.json(url).then(resp=> {

    var data = resp;

function make_bars(state1,i) {
  
    var metadata = data.filter(data=> data.state==state1);

// console.log(i);

    var year_length = metadata.length;

    var year1 = [];
    var aqi = [];
    var backgroundc = [];
    var borderc = [];

for (var x=0; x<year_length; x++){

    year1.push(metadata[x].year);
    aqi.push(metadata[x][i].toFixed(2));

// console.log(year1);
// console.log(aqi);

if (i=='co'){
    backgroundc.push('rgba(255, 99, 132, 0.2)');
    borderc.push('rgba(255,99,132,1)');
    
};

if (i=='no2'){
    
    backgroundc.push('rgba(54, 162, 235, 0.2)');
    borderc.push('rgba(54, 162, 235, 1)');
    ;}

if (i=='o3'){

    backgroundc.push('rgba(255, 206, 86, 0.2)'); 
    borderc.push('rgba(255, 206, 86, 1)');

    };


if (i=='so2'){

    backgroundc.push('rgba(75, 192, 192, 0.2)');


    borderc.push('rgba(75, 192, 192, 1)'); 
    }

};

    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: year1,
            datasets: [{
                label: 'AQI',
                data: aqi,
                backgroundColor: backgroundc,
                borderColor: borderc,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
    


};


make_bars("Alabama",'co');


d3.selectAll("#state_selection").on("change", handlechange);

d3.selectAll(".slidecontainer").on('change',handlechange1);


function handlechange(){
  
    var dropdown = d3.select("#state_selection");
    
    var state_name = dropdown.property("value");
    console.log(state_name);

    $('#myChart').remove();
    $('#charty').append('<canvas id="myChart"><canvas>');

    make_bars(state_name,'co');

    $("input").remove();
    
  };

  function handlechange1(){

    var gas =d3.select(".slidecontainer");

    var gg = gas.property("value");
    var lower_gas = gg.toLowerCase()

    // console.log(lower_gas);

    var dropdown = d3.select("#state_selection");
    var state_name = dropdown.property("value");
  
    $('#myChart').remove();
    $('#charty').append('<canvas id="myChart"><canvas>');
  
    make_bars(state_name,lower_gas);
    // console.log(year_index);
  };


  function gas_maker(){


    var selector = d3.select(".slidecontainer");
    var i = 0;

    var gases =['CO','NO2','O3','SO2']
    var name = (data[0].state);
  
    for(var x=0; x<4; x++){

        selector.append("option").text(gases[x]);

    }
  
      };

      gas_maker();

  function state_name_populator(){
    
    var selector = d3.select("#state_selection");
 
   var i = 0;
 
   var name = (data[0].state);
 
   data.forEach(element =>{
 
        if (name != element.state || i==0){
        selector.append("option").text(element.state);
        name = element.state;
        i=1;
 
     };
 
   })
 
 }


state_name_populator();

});









  






