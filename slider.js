
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
    let id = setInterval(frame, 50);
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

var buildGateInterface = function(){
    let container = $("<div class = 'container'></div>");
    container.append("<h1 id = 'headerTitle'>Welcome!</h1>")
    container.append('<h2>Click where you want to go!<h2>')
    let bar = $("<div class = 'slideshow'></div>")
    let numtodo = 4
    //city = getPossibleFlights()
    for (i = 1; i <= numtodo; i++){
        let s = 'pic' + i
        let z = 'slide'+i
        let url = "https://source.unsplash.com/800x400/?london?sig=" + i
        fetch(url).then(function(response) {
            bar.append("<div class = 'slide' id = " + z  + 
            "><img alt = 'testing' id = " + s + " src = " +response.url+
            " ><span>London</span><button class = 'fly' onclick = 'buildFlightInterface(" + z + ")'>Fly Here</button></div>")
      });
    }
    container.append(bar)
    let body = $('body')
    body.empty()
    body.append(container)
}
var buildFlightInterface = function(id){
    let city = $(id).find('span').text()
    console.log(city)
}
