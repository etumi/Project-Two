var url = "/api/co2_aqi"

d3.json(url).then(response=> {

    console.log(response)

    var currentState
    var currentLevel = [];
    var currentYear = []; 
    var listofStates = [];

    var allStateNames = response.map(entry => entry.state)
    var allYear = response.map(entry => entry.year)
    var allLevel = response.map(entry => entry.co2);
    
      for (var i = 0; i < allStateNames.length; i++ ){
        if (listofStates.indexOf(allStateNames[i]) === -1 ){
          listofStates.push(allStateNames[i]);
        }
      }
      
      function getStateData(chosenState) {
        currentLevel = [];
        currentYear = [];
        for (var i = 0 ; i < allStateNames.length ; i++){
          if ( allStateNames[i] === chosenState ) {
            currentLevel.push(allLevel[i]);
            currentYear.push(allYear[i]);
          } 
        }
      };
    
    // Default State Data
    setBubblePlot('Alabama');
      
    function setBubblePlot(chosenState) {
        getStateData(chosenState);  
    
        var trace1 = {
          x: currentYear,
          y: currentLevel,
          mode: 'lines+markers',
          marker: {
            size: 12, 
            opacity: 0.5
          }
        };
    
        var data = [trace1];
    
        var layout = {
          title: 'CO2 Levels across Years<br>'+ chosenState + ' Levels'
        };
    
        Plotly.newPlot('plotdiv', data, layout, {showSendToCloud: true});
    };
      
    var innerContainer = document.querySelector('[data-num="0"'),
        plotEl = innerContainer.querySelector('.plot'),
        stateSelector = innerContainer.querySelector('#statedata');
    
    function assignOptions(textArray, selector) {
      for (var i = 0; i < textArray.length;  i++) {
          var currentOption = document.createElement('option');
          currentOption.text = textArray[i];
          selector.appendChild(currentOption);
      }
    }
    
    assignOptions(listofStates, stateSelector);
    
    function updateState(){
        setBubblePlot(stateSelector.value);
    }
      
    stateSelector.addEventListener('change', updateState, false);
});