// Get lists of page elements
const chartContainers = document.getElementsByClassName("chart-holder")
const sidebars = document.getElementsByClassName("sidebar")
const panelList = document.getElementsByClassName("panel-container")
const icons = document.getElementsByClassName("expand-icon")
const placeholders = document.getElementsByClassName("placeholder")
const sliders = document.getElementsByClassName("options-slider")
const sliderLabels = document.getElementsByClassName("slider-label")
const sliderCheckboxes = document.getElementsByClassName("checkbox")

// No panel is currently open
var openPanel = -1
// Store the initial aspect ratio of each panel
var openPanelInitRatio
// Store the initial position of each panel
var lastCoords

// Flag to prevent getData() from repeating endlessly
var gettingData = false

// Define statistics, a list of the statistics (for iteration), a list of the names of the statistics, a list of the set timescales, and the time variable
var cpuUsage, ramUsage, diskUsage, IOUsage, netUsage, avgUsage
var stats = [cpuUsage, ramUsage, diskUsage, IOUsage, netUsage, avgUsage]
var statNames = ["CPU", "RAM", "Disk Space", "Disk IO", "Network", "Average"]
var timeScales = [30, 30, 30, 30, 30, 30]
var time
// Define the chart variables and an empty array to store a list of the charts (ChartJS getChart() does not work until the page is loaded)
var cpuChart, ramChart, diskChart, IOChart, netChart, avgChart
var charts = []

// Default IP and port
var IP = "0.0.0.0"
var port = "8050"

// Size the panels according to their position and populate the chart list
function initialize() {
    for (let row = 0; row < panelList.length / 2; row++) {
        for (let col = 0; col < 2; col++) {
            if (row % 2 == 0) {
                panelList[row * 2].style.width = "calc(100% / 3 * 2)"
                panelList[row * 2 + 1].style.width = "calc(100% / 3)"
            } else {
                panelList[row * 2].style.width = "calc(100% / 3)"
                panelList[row * 2 + 1].style.width = "calc(100% / 3 * 2)"
            }
        }
    }

    cpuChart = Chart.getChart('cpuUsage')
    ramChart = Chart.getChart('ramUsage')
    diskChart = Chart.getChart('diskUsage')
    IOChart = Chart.getChart('diskIOUsage')
    netChart = Chart.getChart('netUsage')
    avgChart = Chart.getChart('avgUsage')
    charts = [cpuChart, ramChart, diskChart, IOChart, netChart, avgChart]
}

// Handle expansion and closing of panels (-1 means that no panel is currently open)
function panelButton(panelNumber) {
    if (panelNumber == openPanel) {
        collapsePanel(panelNumber)
    } else if (openPanel == -1) {
        expandPanel(panelNumber)
    }
}

// Expand the chosen panel
function expandPanel(panelNumber) {
    // Store the inital width ratio of the panel
    openPanelInitRatio = panelList[panelNumber].getBoundingClientRect().width / panelList[panelNumber].parentElement.getBoundingClientRect().width
    // Store the initial position of the panel before expanding
    lastCoords = getCoords(panelList[panelNumber]);

    // Switch the icon to close
    icons[panelNumber].src = "Media/Icons/close.svg"
    // Change the CSS style properties to absolute, move it to the initial position, and add a placeholder so nothing else moves.
    panelList[panelNumber].style.position = "absolute"
    panelList[panelNumber].style.left = lastCoords.left + "px";
    panelList[panelNumber].style.top = lastCoords.top + "px";
    placeholders[panelNumber].style.width = panelList[panelNumber].style.width

    // Change the size and z Index of the panel
    panelList[panelNumber].style.width = "100vw"
    panelList[panelNumber].style.height = "80vh"
    panelList[panelNumber].style.zIndex = "2"
    // Wait one milisecond
    setTimeout(function () {
        // Enable animation for the width, height, top, and left CSS properties
        panelList[panelNumber].style.transition = "width 0.5s ease, height 0.5s ease, top 0.5s ease, left 0.5s ease"
        // Move the panel to the location of the top left panel
        panelList[panelNumber].style.left = getCoords(panelList[0]).left + "px";
        panelList[panelNumber].style.top = getCoords(panelList[0]).top + "px";
    }, 1)
    // Enable the sidebar with stat-specific settings
    sidebars[panelNumber].classList.add("right-sidebar")
    sidebars[panelNumber].classList.remove("hidden-sidebar")
    // Set the currently open panel
    openPanel = panelNumber
}

function collapsePanel(panelNumber) {
    // Change the icon to the open icon
    icons[panelNumber].src = "Media/Icons/open.svg"
    // Wait half a second
    setTimeout(function () {
        // Switch the panel back to static and set its width, also remove the placeholder
        panelList[panelNumber].style.position = "static"
        panelList[panelNumber].style.width = "calc(100% *" + openPanelInitRatio + ")"
        placeholders[panelNumber].style.width = "0px"
    }, 500)
    // Set the panel width to one third of the window width multiplied by the ratio
    panelList[panelNumber].style.width = (((window.innerWidth * 0.6667) * openPanelInitRatio) - 16) + "px"
    // Wait one milisecond
    setTimeout(function () {
        // Enable animation for the width, height, top, and left CSS properties
        panelList[panelNumber].style.transition = "width 0.5s ease, height 0.5s ease, top 0.5s ease, left 0.5s ease"
        // Move the panel to its inital position
        panelList[panelNumber].style.left = lastCoords.left + "px";
        panelList[panelNumber].style.top = lastCoords.top + "px";
    }, 1)
    // Set the height of the panel back to 300px and restore the z index
    panelList[panelNumber].style.height = "300px"
    panelList[panelNumber].style.zIndex = "0"
    // Remove the side settings panel
    sidebars[panelNumber].classList.remove("right-sidebar")
    sidebars[panelNumber].classList.add("hidden-sidebar")
    // No panel is currently open
    openPanel = -1
}
// Get the coordinates of an element on the screen (different than CSS top and left properties)
function getCoords(elem) {
    let box = elem.getBoundingClientRect()

    return {
        top: box.top + window.pageYOffset,
        right: box.right + window.pageXOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset
    };
}
// Check the IP address using regex
function checkIP(input) {
    var match = input.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    return match != null &&
        match[1] <= 255 && match[2] <= 255 &&
        match[3] <= 255 && match[4] <= 255;
}
// Handle updating the ip address
function updateIP(input) {
    if (checkIP(input)) {
        // Update the IP
        document.querySelector("#ip-text").innerHTML = input
        IP = input
        // Start pulling data from the server
        getData()
        gettingData = true
        document.querySelector("#ip-header").style.visibility = "visible"
        document.querySelector("#ip-text").style.visibility = "visible"
    } else {
        alert("IP Address Invalid")
        gettingData = false
    }
}
// Make the slider text say the slider value
function updateSlider(sliderNumber) {
    sliderLabels[sliderNumber].innerHTML = "Alert at " + sliders[sliderNumber].value + "% Usage";
}

// Check for usage above a specific value
async function usageAlert() {
    for (let i = 0; i < sliders.length; i++) {
        if (stats[i] > sliders[i].value && sliderCheckboxes[i].value == on)
            alert("Your " + statNames[i] + " usage is high!")
    }
    setTimeout(function () {
        usageAlert()
    }, 1000)
}
// Set the timescale for a statistic (-1 sets for all statistics)
function setTimeScale(chartNumber, scale) {
    if (chartNumber != -1) {
        timeScales[chartNumber] = scale
        updateCharts()
    } else {
        for (let i = 0; i < charts.length; i++) {
            timeScales[i] = scale
            updateCharts()
        }
    }
}

// Set the color for a statistic (all sets for all statistics)
function setColor(chartName, color) {
    if (chartName != 'all') {
        chart = Chart.getChart(chartName)
        chart.options.elements.line.borderColor = color
        chart.options.elements.point.backgroundColor = color
        chart.update()
    } else {
        for (let i = 0; i < charts.length; i++) {
            charts[i].options.elements.line.borderColor = color
            charts[i].options.elements.point.backgroundColor = color
            charts[i].update()
        }
    }
}

// Get the actual data from the server
async function getData() {
    // fetch a json file from the server
    var response = await fetch('test.json') //fetch('http://' + IP + ":" + port + '/res.json'); //fetch('population.json') //fetch('http://34.148.159.57/res.json')
    console.log(response);
    // Get data from the file
    var data = await response.json();
    console.log(data);
    // Get the length of the data
    length = data.length;
    console.log(length);
    // Get statistics from the data
    time = Date //data[length - 1].timestamp
    cpuUsage = Math.random() * 100 //data[length - 1].cpuUsagePercent
    ramUsage = Math.random() * 100 //data[length - 1].memory
    diskUsage = Math.random() * 100 //data[length - 1].disk.space
    IOUsage = Math.random() * 100 //data[length - 1].disk.io
    netUsage = Math.random() * 100 //data[length - 1].network
    avgUsage = Math.random() * 100 //data[length - 1].loadAverage
    // Add the data to each chart
    addData(cpuChart, time, cpuUsage)
    addData(ramChart, time, ramUsage)
    addData(diskChart, time, diskUsage)
    addData(IOChart, time, IOUsage)
    addData(netChart, time, netUsage)
    addData(avgChart, time, avgUsage)
    // Remove data if above set timescale
    updateCharts()
    // Repeat every second
    if (gettingData) {
        setTimeout(getData, 1000)
    }
}
// Remove data if above set timescale
function updateCharts() {
    for (let i = 0; i < 1; i++) {
        while (charts[i].data.labels.length > timeScales[i]) {
            removeData(charts[i])
        }
    }
}
// Push data to the chart
function addData(chart, label, newData) {
    chart.data.labels.push(label)
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData)
    });
    chart.update();
}
// Remove data from the chart
function removeData(chart) {
    chart.data.labels.shift()
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift()
    });
    chart.update()
}
