const charts = document.getElementsByClassName("chart-holder")
const sidebars = document.getElementsByClassName("sidebar")
const panelList = document.getElementsByClassName("panel-container")
const icons = document.getElementsByClassName("expand-icon")
const placeholders = document.getElementsByClassName("placeholder")

var openPanel = -1

function initialize() {
    for (let row = 0; row < panelList.length / 2; row++) {
        for (let col = 0; col < 2; col++) {
            if (row % 2 == 0) {
                panelList[row*2].style.width = "calc(100% / 3)"
                panelList[row*2+1].style.width = "calc(100% / 3 * 2)"
            } else {
                panelList[row*2].style.width = "calc(100% / 3 * 2)"
                panelList[row*2+1].style.width = "calc(100% / 3)"
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
    icons[panelNumber].src = "Media/Icons/close.svg"
    placeholders[panelNumber].style.width = panelList[panelNumber].style.width
    panelList[panelNumber].style.position = "absolute"
    //panelList[panelNumber].children[0].children[0].style.backgroundColor = "rgba(255, 255, 255, 0.5)"
    panelList[panelNumber].style.width = "90vw"
    panelList[panelNumber].style.height = "80vh"
    panelList[panelNumber].style.zIndex = "2"
    panelList[panelNumber].style.transition = "width 0.5s ease, height 0.5s ease"
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
        placeholders[panelNumber].style.width = "0px"
    }, 500)
    //panelList[panelNumber].style.width = "calc(100% / 3)"
    initialize()
    panelList[panelNumber].style.height = "300px"
    panelList[panelNumber].style.zIndex = "0"
    sidebars[panelNumber].classList.remove("right-sidebar")
    sidebars[panelNumber].classList.add("hidden-sidebar")
    openPanel = -1
}