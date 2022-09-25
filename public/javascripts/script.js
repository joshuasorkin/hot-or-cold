const socket = io();

//get objects corresponding to various page elements
//from the DOM
const lat = document.querySelector('.lat');
const long = document.querySelector('.long');
const hotOrCold = document.querySelector('.hot-or-cold');
const reveal = document.querySelector('.reveal');

let lat_prev;
let long_prev;

async function testUI(){
    let coordinates = await getCoordinates();
    console.log({coordinates});
    updateCoordinates(coordinates);
    hotOrCold.innerText = "Let's play 'Hot or Cold'!";
    reveal.innerText = "reveal";
}

function createCoordinatesObject(position){
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
    console.log({coordinates});
    console.log({lat_prev});
    console.log({long_prev});
    return (coordinates.latitude === lat_prev && coordinates.longitude === long_prev);
}

function updateCoordinates(coordinates){
    lat_prev = coordinates.latitude;
    long_prev = coordinates.longitude;
    lat.innerText = lat_prev;
    long.innerText = long_prev;
}

async function decideCoordinateTransmission(){
    coordinates = await getCoordinates();
    if (!sameCoordinates(coordinates)){
        console.log(`coordinates changed, sending`);
        transmitCoordinates(coordinates);
        updateCoordinates(coordinates);
        
    }
    else{
        console.log(`same coordinates, don't send`);
    }
}

function renderHotOrCold(message){
    hotOrCold.innerText = message;
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


