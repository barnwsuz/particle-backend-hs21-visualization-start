var rootUrl = window.location.origin; // get the root URL, e.g. https://example.herokuapp.com or http://localhost:3001

// initialise server-sent events
function initSSE() {
    if (typeof (EventSource) !== "undefined") {
        var url = rootUrl + "/api/events";
        var source = new EventSource(url);
        source.onmessage = (event) => {
            updateVariables(JSON.parse(event.data));
        };
    } else {
        alert("Your browser does not support server-sent events.");
    }
}
initSSE();

var tempMaxLevel = 50;
var capMaxLevel = 1000;

// Diese Funktion wird immer dann ausgeführt, wenn ein neues Event empfangen wird.
function updateVariables(data) {
    
    if (data.eventName === "PlantSaverEvent") {
        // Erhaltenen Wert in der Variable 'lux' speichern
        var measurement = JSON.parse(data.eventData);
        var temperature = measurement.temperature;
        var capacitive = measurement.capacitive;

        // Wert in Prozent umrechnen und in 'level' speichern
        var tempLevel = temperature * (100 / tempMaxLevel);
        var capLevel = capacitive * (100 / capMaxLevel);

        updateTemperature(temperature, tempLevel);
        updateCapacitive(capacitive, capLevel);

        // Wert im Chart hinzufügen
        addData(measurement);
    }
}

function updateTemperature(temperature, tempLevel){
    // Farbe des Balkens abhängig von Level festlegen
    // Liste aller unterstützten Farben: https://www.w3schools.com/cssref/css_colors.asp
    // -- TODO Aufgabe 2 -- 
    // Weitere Farben abhängig vom Level
    if (tempLevel < 50) {
        color = "Blue";
    } else {
        color = "Orange";
    }

    // CSS Style für die Hintergrundfarbe des Balkens
    var colorStyle = "background-color: " + color + " !important;";

    // CSS Style für die Breite des Balkens in Prozent
    var widthStyle = "width: " + tempLevel + "%;"

    // Oben definierte Styles für Hintergrundfarbe und Breite des Balkens verwenden, um
    // den Progressbar im HTML-Dokument zu aktualisieren
    document.getElementById("templevel-bar").style = colorStyle + widthStyle;

    // Text unterhalb des Balkens aktualisieren
    document.getElementById("templevel-text").innerHTML = temperature + " Degrees";
}

function updateCapacitive(capacitive, capLevel){
    // Farbe des Balkens abhängig von Level festlegen
    // Liste aller unterstützten Farben: https://www.w3schools.com/cssref/css_colors.asp
    // -- TODO Aufgabe 2 -- 
    // Weitere Farben abhängig vom Level
    if (capLevel < 50) {
        color = "Blue";
    } else {
        color = "Orange";
    }

    // CSS Style für die Hintergrundfarbe des Balkens
    var colorStyle = "background-color: " + color + " !important;";

    // CSS Style für die Breite des Balkens in Prozent
    var widthStyle = "width: " + capLevel + "%;"

    // Oben definierte Styles für Hintergrundfarbe und Breite des Balkens verwenden, um
    // den Progressbar im HTML-Dokument zu aktualisieren
    document.getElementById("caplevel-bar").style = colorStyle + widthStyle;

    // Text unterhalb des Balkens aktualisieren
    document.getElementById("caplevel-text").innerHTML = capacitive + " Cap";
}

//////////////////////////////////
/////   Code für das Chart   /////
//////////////////////////////////

// Line Chart Dokumentation: https://developers.google.com/chart/interactive/docs/gallery/linechart

// Chart und Variablen 
var tempChartData, tempChartOptions, tempChart;
var capChartData, capChartOptions, capChart;
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(tempDrawChart);
google.charts.setOnLoadCallback(capDrawChart);

// Chart initialisieren. Diese Funktion wird einmalig aufgerufen, wenn die Page geladen wurde.
function tempDrawChart() {
    // Daten mit dem Dummy-Wert ["", 0] initialisieren. 
    // (Dieser Dummy-Wert ist nötig, damit wir das Chart schon anzeigen können, bevor 
    // wir Daten erhalten. Es können keine Charts ohne Daten gezeichnet werden.)
    tempChartData = google.visualization.arrayToDataTable([['Time', 'Temp'], ["", 0]]);
    // Chart Options festlegen
    tempChartOptions = {
        title: 'Temp Level',
        hAxis: { title: 'Time' },
        vAxis: { title: 'Temp' },
        animation: {
            duration: 300, // Dauer der Animation in Millisekunden
            easing: 'out',
        },
        curveType: 'function', // Werte als Kurve darstellen (statt mit Strichen verbundene Punkte)
        legend: 'none',
        vAxis: {
            // Range der vertikalen Achse
            viewWindow: {
                min: 0,
                max: tempMaxLevel
            },
        }
    };
    // LineChart initialisieren
    tempChart = new google.visualization.LineChart(document.getElementById('templevel-chart'));
    tempChartData.removeRow(0); // Workaround: ersten (Dummy-)Wert löschen, bevor das Chart zum ersten mal gezeichnet wird.
    tempChart.draw(tempChartData, tempChartOptions); // Chart zeichnen
}

// Chart initialisieren. Diese Funktion wird einmalig aufgerufen, wenn die Page geladen wurde.
function capDrawChart() {
    // Daten mit dem Dummy-Wert ["", 0] initialisieren. 
    // (Dieser Dummy-Wert ist nötig, damit wir das Chart schon anzeigen können, bevor 
    // wir Daten erhalten. Es können keine Charts ohne Daten gezeichnet werden.)
    capChartData = google.visualization.arrayToDataTable([['Time', 'Cap'], ["", 0]]);
    // Chart Options festlegen
    capChartOptions = {
        title: 'Cap Level',
        hAxis: { title: 'Time' },
        vAxis: { title: 'Cap' },
        animation: {
            duration: 300, // Dauer der Animation in Millisekunden
            easing: 'out',
        },
        curveType: 'function', // Werte als Kurve darstellen (statt mit Strichen verbundene Punkte)
        legend: 'none',
        vAxis: {
            // Range der vertikalen Achse
            viewWindow: {
                min: 0,
                max: capMaxLevel
            },
        }
    };
    // LineChart initialisieren
    capChart = new google.visualization.LineChart(document.getElementById('caplevel-chart'));
    capChartData.removeRow(0); // Workaround: ersten (Dummy-)Wert löschen, bevor das Chart zum ersten mal gezeichnet wird.
    capChart.draw(capChartData, capChartOptions); // Chart zeichnen
}

// Eine neuen Wert ins Chart hinzufügen
function addData(measurement) {

    // -- TODO Aufgabe 4 --
    // Nur die letzten 10 gemessenen Werte anzeigen.
    // Tipp: mit chartData.removeRow(0) kann der erste Eintrag im Chart entfernt werden.

    // aktuelles Datum/Zeit
    var date = new Date();
    // aktuelle Zeit in der Variable 'localTime' speichern
    var localTime = date.toLocaleTimeString();

    // neuen Wert zu den Chartdaten hinzufügen
    tempChartData.addRow([localTime, measurement.temperature]);
    capChartData.addRow([localTime, measurement.capacitive]);

    // Chart neu rendern
    tempChart.draw(tempChartData, tempChartOptions);
    capChart.draw(capChartData, capChartOptions);
}

async function saveIdealCap() {
    var idealCap = document.getElementById("idealCap").value;

    // call the function
    var response = await axios.post(rootUrl + "/api/device/0/function/setIdealCap", { arg: idealCap });

    // Handle the response from the server
    if (response.data.result != 1){
        alert("Response: " + response.data.result); // we could to something meaningful with the return value here ... 
    } 
}

async function saveAcceptedDeviation() {
    
    var acceptedDeviation = document.getElementById("acceptedDeviation").value;

    // call the function
    var response = await axios.post(rootUrl + "/api/device/0/function/setAcceptedDeviation", { arg: acceptedDeviation });

    // Handle the response from the server
    if (response.data.result != 1){
        alert("Response: " + response.data.result); // we could to something meaningful with the return value here ... 
    }
}