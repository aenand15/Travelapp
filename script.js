var root="http://comp426.cs.unc.edu:3001/",
user="pacquito",
pass="superiorte4l";
var portIds='';
var names = ['miami']

function getAportIdsWrapper(){
    getFlights();
    return true;
}

function start(){
    login()
    return true;
}
function login(){
    $.ajax(root+'sessions',{
    type: 'POST',
    dataType: 'json',
    data:{
        "user":{
            "username": "pacquito",
            "password": "superiorte4l"
        }
    },
    xhrFields: {withCredentials: true},
    success: (response, status) =>{
        //nothing needs to happen here other than 'calling the login function' at some point
        console.log('Success');
    }, error: () =>{
        console.log('error');
    }
    });
}

function getAirlines(){
    $.ajax(root+'airlines', {
        type: 'GET',
        dataType: 'JSON',
        xhrFields: {withCredentials: true},
        success: (response) =>{
            console.log(response);
        }, error: () =>{
            console.log('error');
        }
    });
}

function getFlights(){
    $.ajax(root+'flights', {
        type: 'GET',
        dataTpe: 'json',
        xhrFields: {withCredentials: true},
        success: (response) =>{
        //for loop generates 10 random numbers to gain flight information for
            var rando=[]
            for(let i=0; i<4;i++){
                let rng = Math.floor(Math.random() * response.length)
                if(!rando.includes(rng)){
                rando.push(rng)
                } else {
                    i--;}
            }
            //console.log(rando);
            //this for loop takes a random flight from the rng and grabs its airport ids
            var aports = []
            var dports = []
            for(let j=0; j<rando.length; j++){
                aports.push(response[rando[j]].arrival_id)
                dports.push(response[rando[j]].departure_id)
            }
            portIds=dports[0] + " " + aports[0];
            getAirport(aports[0])
            getAirport(aports[1])
            getAirport(aports[2])
            getAirport(aports[3])
            getAirport(dports[0])
            getAirport(dports[1])
            getAirport(dports[2])
            getAirport(dports[3])
            names.shift()
            return aports;
        }, error: ()  =>{
            console.log('error');
        }
    });
}
var airports =[]
//call allAirports to get the airports array so user can select their airport
function allAirports(){
    $.ajax(root+'airports',{
        type: 'GET',
        dataType: 'json',
        xhrFields: {withCredentials: true},
        success: (response) =>{
            //create a list that holds all airports and their ids
                //so user can look up airport ids for flight creation
            for(let i=0;i<response.length; i++){
                airports.push('(airport_id:'+ response[i].id+')'+' '+response[i].name)
            }
        }, error: () =>{
            console.log('error');
        }
    });
}
//taking airport_id, returns airport name and city
function getAirport(getting_carded){
    //getting_carded is the airport id
    $.ajax(root+'airports/'+getting_carded,{
        type: 'GET',
        dataType: 'json',
        xhrFields: {withCredentials: true},
        success: (response) =>{
            //response.name is the airport name
            console.log(response.name+' in: '+response.city);
            names.push(response.city)
            return response.city
        }, error: () =>{
            console.log('error');
        }
    });
}

//assuming a 'form' submission with airports and times (flight number is also required)
function createFlight(){
    //read form fields with these ids
    var departFrom = $('#dPort').val(),
    arriveAt = $('#aPort').val(),
    dTime = $('#departureTime').val(),
    aTime = $('#arrivalTime').val(),
    flNum = $('#flightNum').val();
    $.ajax(root+'flights',{
        type: 'POST',
        dataType: 'json',
        xhrFields: {withCredentials: true},
        data:{
            "flight":{
                "departs_at": dTime,
                "arrives_at": aTime,
                "number": flNum,
                "departure_id": departFrom,
                "arrival_id": arriveAt
            }
        },
        success: (response) =>{
            console.log('New flight created');
            portIds = departFrom +' '+arriveAt;
            console.log(portIds);
            return portIds;
        }
    })
}
function startsc(cityname){
    var query = '';
    var serp =[], serp2=[];
    var user ='';
    query = cityname
    alert(window.localStorage.getItem('token'))
    if(window.localStorage.getItem('token')== null){
        
        alert('get new token')
                // Set token
                let authEndpoint = 'https://accounts.spotify.com/authorize';

                // Replace with your app's client ID, redirect URI and desired scopes
                let clientId = '7bf8e705b8784dc093df8333cc8fea87';
                let redirectUri = 'http://www.cs.unc.edu/Courses/comp426-f18/users/amitamit/fp/index.html';
                let scopes = [
                'playlist-modify-public user-read-private user-read-birthdate'];

                // If there is no token, redirect to Spotify authorization
                window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=playlist-modify-public user-read-private user-read-birthdate&response_type=token&show_dialog=true`;
                const hash = window.location.hash.substring(1).split('&').reduce(function (initial, item) {
                    if (item) {
                        var parts = item.split('=');
                        initial[parts[0]] = decodeURIComponent(parts[1]);
                    }
                    return initial;
                    }, {});

                window.location.hash = '';
                window.localStorage.setItem('token', hash.access_token)
                alert(window.localStorage.getItem('token'))
                }
                let _token = window.localStorage.getItem('token')
                
                // Make a call using the token
                
                $.ajax({
                url: "https://api.spotify.com/v1/search",
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
                dataType: 'json',
                data:{
                    q: query,
                    type: 'track',
                    market: 'US',
                    limit: 20
                },
                success: function(resdata) { 
                        for(let i=0; i<resdata.tracks.items.length; i++){
                            //item is a uri we can place into the spotify iframe widget
                        let item = $('<li>'+resdata.tracks.items[i].name+'</li>');
                        item.appendTo($('#top-artists'));
                        serp.push(resdata.tracks.items[i].uri.substring(8).replace(':','/'));
                        serp2.push(resdata.tracks.items[i].uri);
                        }
                    // Do something with the returned data
                    //call play widget with item as parameter
                    $.ajax('https://api.spotify.com/v1/me',{
                    type:'GET',
                    dataType:'json',
                    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer '+_token);},
                    success: (response) =>{
                        user = response.id;
                        createPlayList(query, serp,serp2, _token, user);

                    }
                })
                },
                });
}
var newRP;
//create playlist function
    //from the search results create a playlist. 
function createPlayList(qry, rp,rp2, tk, usr){
     console.log(qry);
    // console.log(rp);
     //console.log(tk);
    // console.log(usr);
    randoRP=[];
    for(let i=0; i<rp.length;i++){
        let rng = Math.floor(Math.random() * 20)
        if(!randoRP.includes(rng)){
        randoRP.push(rng)
        } else {
            i--;}
    }
    //newRP is a *shuffled* tracklist order from the results. use newRP to add track links to the playlist
    //var newRP = []
        $.ajax('https://api.spotify.com/v1/users/'+usr+'/playlists',{
        type: 'POST',
        dataType: 'json',
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer '+tk);},
        contentType: 'application-json',
        data: JSON.stringify({
            'name': qry}),
        success: (response) =>{
                    var plID = response.id;
                    var plUri = response.uri;
                    for(let j=0;j<randoRP.length;j++){
                        var newRP = newRP+rp2[randoRP[j]]+','}
                        console.log(newRP.substring(9))
                    
                        $.ajax('https://api.spotify.com/v1/playlists/'+plID+'/tracks?uris='+newRP.substring(9),{
                            type: 'POST',
                            dataType: 'json',
                            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer '+tk);},
                            contentType: 'application-json',
                            success: (response) =>{
                                playList(plUri, usr)
                            }, error: (response) =>{
                                console.log(rp2[0]);
                            }
                        })
                    
            //playList(plID, plUri);
        }, error: (response) => {
            console.log(response.responseText);
        }
    })
}
function playList(uri, user){
    console.log(uri)
    var url = uri.split(":");
    console.log(url[4]);
    var playBtn = $('<iframe id= "play" src="https://open.spotify.com/embed/user/'+user+'/playlist/'+url[4]+'" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>');
    var play_goes_here = $('#playgoeshere');
    playBtn.appendTo(play_goes_here);
    $('body').append(playBtn)
}

//playList grabs the play widget and plays the newly created playlist.

var buildGateInterface = function(){
    let container = $("<div class = 'container'></div>");
    container.append("<h1 id = 'headerTitle'>Welcome!</h1>")
    container.append('<h2>Click where you want to go!</h2>')
    let bar = $("<div class = 'slideshow'></div>")
    let leftPanel = $('<div class = leftPane></div>')
    let l = leftPanel.append($('<ul></ul>'))
    let numtodo = 4
    for (i = 1; i <= numtodo; i++){
        let s = 'pic' + i
        let z = 'slide'+i
        let m = i -1
        let city = names[m]
        l.append($("<li class = 'noBullet'><button class = 'fly' id = " + m + ">Fly To: " + city + "</button></li>"))
        let url = "https://source.unsplash.com/800x300/?" + city +"?sig=" + i
        fetch(url).then(function(response) {
            bar.append("<div class = 'slide' id = " + z  + 
            "><h3>" + city + "</h3><img alt = 'testing' id = " + s + " src = " +response.url+
            " >")
      });
    }
    l.append($("<li class = 'noBullet'><button class = 'fly' id = " + 5 + ">Create your own flight!</button></li>"))
    
    container.append(bar)
    let body = $('body')
    body.empty()
    body.append(leftPanel)
    body.append(container)
}

var buildFlightInterface = function(l){
    let num = parseInt(l)
    if(num == 5){
        buildCreateInterface()
    }else{
    let acity = names[num]
    let dcity = names[num+4]
    let container = $("<div class = 'container'></div>")
    container.append("<h1>Now Leaving " + dcity + " and Heading to "  + acity + "</h1>")
    let bar = $("<div class = 'slideshow'></div>")
    let numtodo = 4
    for (i = 1; i <= numtodo; i++){
        let s = 'pic' + i
        let z = 'slide'+i
        let city = acity
        let url = "https://source.unsplash.com/400x300/?" + city +"?sig=" + i
        fetch(url).then(function(response) {
            bar.append("<div class = 'slide' id = " + z  + 
            "><h3>" + city + "</h3><img alt = 'testing' id = " + s + " src = " +response.url+
            " >")
      });
    }
    container.append(bar)
    let body = $('body')
    body.empty()
    body.append(container)
    startsc(acity)
}
}

var buildCreateInterface = function(){
    let body = $('body')
    let l = $('<ul class = "airports"></ul>')
    for (let i = 0; i < airports.length;i++){
        l.append($('<li class = "airport">' + airports[i] + '</li>'))
    }
    let container = $('<div class = container><h1>Create a flight or go back to the terminal</h1></div>')
    container.append($('<form>Flight Number: <br><input type="text" id="flightNum" name="flightNum" placeholder="XX XXXX" required><br>Departure: <br><input type="text" id="departureTime" name="departureTime" placeholder="24 Hour" required><br>Arrival:<br><input type="text" id="arrivalTime" name="arrivalTime" placeholder="24 Hour" required><br>Depart from:<br><input type="text" id="dPort" name="dPort"><br>Arrive at:<br><input type="text" id="aPort" name="aPort"><br><br></form>'))
    let x = $('<div id = "listWrapper"></div>')
    x.append(l)
    container.append(x)
    body.empty()
    body.append(container)
    //form to build flight then launches
}
//changes need to be made such that names of places with buttons on left side