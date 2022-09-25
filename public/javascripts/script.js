const socket = io();

//get objects corresponding to various page elements
//from the DOM
const lat = document.querySelector('.lat');
const long = document.querySelector('.long');
const hotOrCold = document.querySelector('.hot-or-cold');
const reveal = document.querySelector('.reveal');

let lat_current;
let long_current;

function testUI(){
    let coordinates = getCoordinates();
    lat_current = coordinates.latitude;
    long_current = coordinates.longitude;
    lat.innerText = lat_current;
    long.innerText = long_current;
    hotOrCold.innerText = "hot or cold";
    reveal.innerText = "reveal";
}

function getCoordinates(){
    let coordinates = navigator.geolocation.getCurrentPosition((position) => {
        return {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }
    });
    return coordinates;
}

function sameCoordinates(coordinates){
    return (coordinates.latitude === lat_current && coordinates.longitude === long_current);
}

function decideCoordinateTransmission(){
    coordinates = getCoordinates();
    if (!sameCoordinates(coordinates)){
        transmitCoordinates(coordinates);
    }
}

function transmitCoordinates(coordinates){
    socket.emit('coordinates',coordinates);
}

function requestReveal(){
    socket.emit('reveal');
}

function hasGeolocation(){
    return 'geolocation' in navigator;
}

socket.on('hot-or-cold',message=>{
    //modify UI to add the received message
    renderHotOrCold(message);
});

socket.on('reveal',message=>{
    renderReveal(message)
})


