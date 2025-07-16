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

var cpuX
var time

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
}

function panelButton(panelNumber) {
    if (panelNumber == openPanel) {
        collapsePanel(panelNumber)
    } else {
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


function usageAlert() {
    setTimeout(function() {
        //for (let i = 0; i < sliders.length; i++) {
            if (cpuX > sliders[0].value && sliderCheckboxes[0].value == on)
                alert("your CPU usage is high!")
            if (ramX > sliders[1].value && sliderCheckboxes[1].value == on)
                alert("your RAM usage is high!")
            if (diskX > sliders[2].value && sliderCheckboxes[2].value == on)
                alert("your Disk usage is high!")
            if (netX > sliders[3].value && sliderCheckboxes[3].value == on)
                alert("your Network usage is high!")
            if (avgX > sliders[4].value && sliderCheckboxes[4].value == on)
                alert("your Average usage is high!")
            if (cpuX > sliders[5].value && sliderCheckboxes[5].value == on)
                alert("your  usage is high!")
        //}
    }, 1000)
}


async function getData() {
    const response = await fetch('population.json') //fetch('http://34.148.159.57/res.json')//fetch('http://' + IP + ":" + port +'/res.json');
    //response.preventDefault();
    console.log(response);
    const data = await response.json();
    console.log(data);
    length = data.length;
    console.log(length);

    time = data[length - 1].year
    cpuX = data[length - 1].people //cpuUsagePercent
    // ramX = data[length - 1].memory
    // avgX = data[length - 1].loadAverage
    // netX = data[length - 1].network
    // diskX = data[length - 1].disk.space

    var cpuChart = Chart.getChart('cpuUsage')
    // var ramChart = Chart.getChart('ramUsage')
    // var diskChart = Chart.getChart('diskUsage')
    // var netChart = Chart.getChart('netUsage')
    // var avgChart = Chart.getChart('avgUsage')

    if (length > 5) {
        //removeData(cpuChart)
        //removeData(cpuChart)
    }

    addData(cpuChart, time, cpuX)
    // addData(ramChart, time, ramX)
    // addData(diskChart, time, avgX)
    // addData(avgChart, time, netX)
    // addData(netChart, time, diskX)
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
