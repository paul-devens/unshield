// initialize map, set coordinates and zoom level
var map = L.map('map', {
    center: [54.826658, 25.355635],
    zoom: 17
});
// add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let watchID = null; // ID for geolocation position watcher
let userMarker; // marker drawn to user location
let userCircle; // circle drawn around user location representing accuracy

// start tracking geolocation
function startTracking() {
    if (watchID != null) {
        document.getElementById("geo-text").innerHTML = "tracking already enabled";
    } else {
        document.getElementById("geo-text").innerHTML = "tracking enabled";
        watchID = navigator.geolocation.watchPosition(success, error, {enableHighAccuracy: true});
        document.getElementById("geo-disable").disabled = false; // enable stop button
        document.getElementById("geo-enable").disabled = true; // disable start button
    }
}

// stop tracking geolocation
function stopTracking() {
    navigator.geolocation.clearWatch(watchID)
    watchID = null;
    document.getElementById("geo-text").innerHTML = "tracking disabled";
    document.getElementById("geo-enable").disabled = false; // enable start button
    document.getElementById("geo-disable").disabled = true; // disable stop button
    // if marker exists, remove it
    if (userMarker) {
        map.removeLayer(userMarker);
        map.removeLayer(userCircle);
    }
}

// launched when position is fetched successfully
function success(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    const timestamp = position.timestamp;
    const time = new Date(timestamp);
    // if marker already exists, remove it
    if (userMarker) {
        map.removeLayer(userMarker);
        map.removeLayer(userCircle);
    }
    // add new marker and circle
    userMarker = L.marker([lat, lng]).addTo(map);""
    userCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: 'white',
        fillOpacity: 0.3
    }).addTo(map)
    // set map view to marker
    map.setView([lat, lng]);
    // print coordinates, accuracy and time
    document.getElementById("geo-text").innerHTML = "lat: " + String(lat) + "<br>lng: " + String(lng) + "<br>accuracy: " + String(+accuracy.toFixed(2)) + " m<br>" + time.toString().split(' (')[0];
}

// launched when position cannot be fetched
function error(error) {
    // if (error.code === 1) {
    //     document.getElementById("geo-text").innerHTML = "please allow geolocation access";
    // } else {
    //     document.getElementById("geo-text").innerHTML = "cannot get location";
    // }
    document.getElementById("geo-text").innerHTML = error.code.toString() + " : " + error.message;
}

function addMapPoint(lat, lon, rad) {
    var point = L.circle([lat, lon], {
        color: 'white',
        fillOpacity: 0.8,
        radius: rad
    }).addTo(map);
    return point;
}

var point1 = addMapPoint(54.826389, 25.355278, 5);
var point2 = addMapPoint(54.826944, 25.355278, 5);
var point3 = addMapPoint(54.826667, 25.356111, 5);

// print coordinates on click
var popup = L.popup();
function onMapClick(e) { // e = event object
    popup
        .setLatLng(e.latlng)
        .setContent(String(e.latlng))
        .openOn(map);
}
map.on('click', onMapClick);