$(document).ready(() =>{
    start();
    getAportIdsWrapper();
});
function sleep(milliseconds) {
    let start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
function progressBar(){
    $('#bar').append('Going through TSA Security...')
    let elem = document.getElementById("bar");   
    let width = 19;
    let id = setInterval(frame, 100);
    function frame() {
        if (width >= 100) {
            clearInterval(id)
            buildGateInterface()
        } else {
            width++; 
            elem.style.width = width + '%'; 
        }
    }
}
