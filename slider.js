$(document).ready(() =>{
    start()
    getAportIdsWrapper();
    startsc('Charlotte')
    allAirports()
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

$(function (){
    $(document).on('click', '.fly', function(){
        buildFlightInterface(event.target.id)
    })
})

$(function(){
$('#refairports').on('keyup change', function () {
    alert('keyup')
    var search = $(this).val();
    $('#listWrapper li').each(function () {
        var val = $(this).text();
        $(this).toggle( !! val.match(search)).html(
            val.replace(search, function(match) {
                    return '<mark>'+match+'</mark>'}, 'gi')
        );
    });
});
})