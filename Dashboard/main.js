const charts = document.getElementsByClassName("chart-holder")
const sidebars = document.getElementsByClassName("sidebar")
const panelList = document.getElementsByClassName("panel-container")
const icons = document.getElementsByClassName("expand-icon")
const placeholders = document.getElementsByClassName("placeholder")
const sliders = document.getElementsByClassName("options-slider")
const sliderLabels = document.getElementsByClassName("slider-label")
const sliderCheckboxes = document.getElementsByClassName("checkbox")

var openPanel = -1
var openPanelInitRatio
var lastCoords

var gettingData = false

var cpuUsage, ramUsage, diskUsage, IOUsage, netUsage, avgUsage
var stats = [cpuUsage, ramUsage, diskUsage, IOUsage, netUsage, avgUsage]
var statNames = ["CPU", "RAM", "Disk Space", "Disk IO", "Network", "Average"]
var time

var cpuChart, ramChart, diskChart, IOChart, netChart, avgChart

var IP = "0.0.0.0"
var port = "3000"

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
}

function panelButton(panelNumber) {
        if (panelNumber == openPanel) {
            collapsePanel(panelNumber)
        } else if (openPanel == -1) {
            expandPanel(panelNumber)
        }
}

function expandPanel(panelNumber) {
    console.log(panelNumber)
    for (let i = 0; i < panelList.length; i++) {
        if (i != panelNumber) {
            //panelList[i].style.visibility = "hidden"
            //panelList[i].children[0].children[0].classList.remove("fade-panel-in")
            //panelList[i].children[0].children[0].classList.add("fade-panel-out")
        }
    }
    openPanelInitRatio = panelList[panelNumber].getBoundingClientRect().width / panelList[panelNumber].parentElement.getBoundingClientRect().width
    //console.log(openPanelInitRatio)
    icons[panelNumber].src = "Media/Icons/close.svg"
    lastCoords = getCoords(panelList[panelNumber]);
    panelList[panelNumber].style.position = "absolute"
    panelList[panelNumber].style.left = lastCoords.left + "px";
    panelList[panelNumber].style.top = lastCoords.top + "px";
    placeholders[panelNumber].style.width = panelList[panelNumber].style.width
    //panelList[panelNumber].children[0].children[0].style.backgroundColor = "rgba(255, 255, 255, 0.5)"
    panelList[panelNumber].style.width = "100vw"
    panelList[panelNumber].style.height = "80vh"
    panelList[panelNumber].style.zIndex = "2"
    setTimeout(function () {
        panelList[panelNumber].style.transition = "width 0.5s ease, height 0.5s ease, top 0.5s ease, left 0.5s ease"
        panelList[panelNumber].style.left = getCoords(panelList[0]).left + "px";
        panelList[panelNumber].style.top = getCoords(panelList[0]).top + "px";
    }, 1)
    sidebars[panelNumber].classList.add("right-sidebar")
    sidebars[panelNumber].classList.remove("hidden-sidebar")
    //sidebars[panelNumber].children[1].children[0].classList.add("fade-panel-in")
    //charts[panelNumber].style.width = "75%"
    openPanel = panelNumber
}

function collapsePanel(panelNumber) {
    for (let i = 0; i < panelList.length; i++) {
        panelList[i].style.visibility = "visible"
        //panelList[i].children[0].children[0].classList.add("fade-panel-in")
        //panelList[i].children[0].children[0].classList.remove("fade-panel-out")
    }
    icons[panelNumber].src = "Media/Icons/open.svg"
    setTimeout(function () {
        panelList[panelNumber].style.position = "static"
        panelList[panelNumber].style.width = "calc(100% *" + openPanelInitRatio + ")"
        placeholders[panelNumber].style.width = "0px"
    }, 500)

    //initialize()
    panelList[panelNumber].style.width = (((window.innerWidth * 0.6667) * openPanelInitRatio) - 9) + "px"
    setTimeout(function () {
        panelList[panelNumber].style.transition = "width 0.5s ease, height 0.5s ease, top 0.5s ease, left 0.5s ease"
        panelList[panelNumber].style.left = lastCoords.left + "px";
        panelList[panelNumber].style.top = lastCoords.top + "px";
    }, 1)

    panelList[panelNumber].style.height = "300px"
    panelList[panelNumber].style.zIndex = "0"
    sidebars[panelNumber].classList.remove("right-sidebar")
    sidebars[panelNumber].classList.add("hidden-sidebar")
    openPanel = -1
}

function getCoords(elem) {
    let box = elem.getBoundingClientRect();

    return {
        top: box.top + window.pageYOffset,
        right: box.right + window.pageXOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset
    };
}

function checkIP(input) {
    var match = input.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    return match != null &&
        match[1] <= 255 && match[2] <= 255 &&
        match[3] <= 255 && match[4] <= 255;
}

function updateIP(input) {
    if (checkIP(input)) {
        document.querySelector("#ip-text").innerHTML = input
        IP = input
        getData()
        gettingData = true
        document.querySelector("#ip-header").style.visibility = "visible"
        document.querySelector("#ip-text").style.visibility = "visible"
    } else {
        alert("IP Address Invalid")
        gettingData = false
    }
}

function updateSlider(sliderNumber) {
    sliderLabels[sliderNumber].innerHTML = "Alert at " + sliders[sliderNumber].value + "% Usage";
}


async function usageAlert() {
    for (let i = 0; i < sliders.length; i++) {
        if (stats[i] > sliders[i].value && sliderCheckboxes[i].value == on)
            alert("Your " + statNames[i] + " usage is high!")
    }
    setTimeout(function () {
        usageAlert()
    }, 1000)
}

function setHistory(chartName, history) {
    chart = Chart.getChart(chartName)
    while (chart.data.labels.length > history) {
        removeData(chart)
    }
    chart.update()
}

function setColor(chartName, color) {
    chart = Chart.getChart(chartName)
    chart.options.elements.line.borderColor = color
    chart.options.elements.point.backgroundColor = color
    chart.update()
}

async function getData() {
    const response = await fetch('population.json') //fetch('http://' + IP + ":" + port + '/res.json'); //fetch('population.json') //fetch('http://34.148.159.57/res.json')
    //response.preventDefault();
    console.log(response);
    const data = await response.json();
    console.log(data);
    length = data.length;
    console.log(length);

    time = data[length - 1].time
    cpuUsage = data[length - 1].people//cpuUsagePercent
    // ramUsage = data[length - 1].memory
    // diskUsage = data[length - 1].disk.space
    // IOUsage = data[length - 1].disk.io
    // netUsage = data[length - 1].network
    // avgUsage = data[length - 1].loadAverage

    if (length > 5) {
        //removeData(cpuChart)
    }

    addData(cpuChart, time, cpuUsage)
    addData(ramChart, time, ramUsage)
    addData(diskChart, time, diskUsage)
    addData(IOChart, time, IOUsage)
    addData(netChart, time, netUsage)
    addData(avgChart, time, avgUsage)

    if (gettingData) {
        setTimeout(getData, 2000)
    }
}

function addData(chart, label, newData) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
