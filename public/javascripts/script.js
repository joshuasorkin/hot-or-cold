const socket = io();

//get objects corresponding to various page elements
//from the DOM
const lat = document.querySelector('.lat');
const long = document.querySelector('.long');
const hotOrCold = document.querySelector('.hot-or-cold');
const reveal = document.querySelector('.reveal');

let lat_prev;
let long_prev;
var coordinates;

async function testUI(){
    coordinates = await getCoordinates();
    console.log({coordinates});
    lat_prev= coordinates.latitude;
    long_prev = coordinates.longitude;
    lat.innerText = lat_current;
    long.innerText = long_current;
    hotOrCold.innerText = "hot or cold";
    reveal.innerText = "reveal";
}

function createCoordinatesObject(position){
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    return {
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
    };
}

async function getCoordinates(){
    let position = await getPosition();
    return createCoordinatesObject(position);
}

function setCoordinates(coordinates){

}

function getPosition(){
    return new Promise((res,rej)=>{
        navigator.geolocation.getCurrentPosition(res,rej)
    });
}

function sameCoordinates(coordinates){
    return (coordinates.latitude === lat_prev && coordinates.longitude === long_prev);
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


