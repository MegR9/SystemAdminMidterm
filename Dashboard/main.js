function initialize() {
    var panelList = document.getElementsByClassName("panel-container")
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
function expandPanel(panelNumber) {
    var panelList = document.getElementsByClassName("panel-container")
    console.log(panelNumber)
    for (let i = 0; i < panelList.length; i++) {
        if (i != panelNumber) {
            panelList[i].style.visibility = "hidden"
            //panelList[i].classList.add("fade-panel")
        }
    }
    panelList[panelNumber].style.position = "absolute"
    panelList[panelNumber].style.width = "90vw"
    panelList[panelNumber].style.height = "90vh"
    panelList[panelNumber].style.zIndex = "2"
    panelList[panelNumber].style.transition = "width 1s ease-out, height 1s ease-out"
}