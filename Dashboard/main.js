const charts = document.getElementsByClassName("chart-holder")
const sidebars = document.getElementsByClassName("sidebar")
const panelList = document.getElementsByClassName("panel-container")
const icons = document.getElementsByClassName("expand-icon")
const placeholders = document.getElementsByClassName("placeholder")
const sliders = document.getElementsByClassName("options-slider")
const sliderLabels = document.getElementsByClassName("slider-label")

var openPanel = -1
var openPanelInitRatio
var lastCoords

function initialize() {
    for (let row = 0; row < panelList.length / 2; row++) {
        for (let col = 0; col < 2; col++) {
            if (row % 2 == 0) {
                panelList[row*2].style.width = "calc(100% / 3 * 2)"
                panelList[row*2+1].style.width = "calc(100% / 3)"
            } else {
                panelList[row*2].style.width = "calc(100% / 3)"
                panelList[row*2+1].style.width = "calc(100% / 3 * 2)"
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
            panelList[i].style.visibility = "hidden"
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
    setTimeout(function() {
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
    panelList[panelNumber].style.width = (((window.innerWidth * 0.8) * openPanelInitRatio) - 9) + "px"
    setTimeout(function() {
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

function updateIP() {
    let input = prompt("Enter Server IP", "0.0.0.0")
    document.querySelector("#ip-button").innerHTML = '<h3 class="title right-align">' + input + '</h3>'
}

function UpdateSlider(sliderNumber) {
    sliderLabels[sliderNumber].innerHTML = "Alert at " + sliders[sliderNumber].value + "% Usage";
}

/*
function alert() {
    setTimeout(function() {
        for (let i = 0; i < sliders.length; i++) {
        if value > sliders[i].value
            alert("your usage is high!")
        }
    }, whatever)
}
*/