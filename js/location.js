// initialize map, set coordinates and zoom level
var map = L.map('map', {
    center: [54.82893, 25.35116],
    zoom: 16
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

// add marker
//var marker = L.marker([60.196926, 24.966691]).addTo(map);
// add circles
var circle1 = L.circle([60.196802, 24.967040]).addTo(map);
var circle2 = L.circle([60.196897, 24.967420], {
    color: 'yellow',
    fillColor: 'black',
    fillOpacity: 0.4,
    radius: 4
}).addTo(map);
// add polygon
var polygon1 = L.polygon([
    [60.196732, 24.967318],
    [60.196810, 24.967619],
    [60.196650, 24.967686],
    [60.196668, 24.967325]
]).addTo(map);
var polygon2 = L.polygon([
    [60.196556, 24.966981],
    [60.196650, 24.966871],
    [60.196558, 24.967233]
    ], {
    color: 'white',
    fillOpacity: 0.8
}).addTo(map);
// add popups
//marker.bindPopup("marker").openPopup();
//marker.bindPopup("marker");
circle1.bindPopup("circle1");
circle2.bindPopup("circle2");
polygon1.bindPopup("polygon1");
polygon2.bindPopup("polygon2");
// var standalonePopup = L.popup()
//     .setLatLng([60.197021, 24.967640])
//     .setContent("standalone popup")
//     .openOn(map);

// print coordinates on click
var popup = L.popup();
function onMapClick(e) { // e = event object
    popup
        .setLatLng(e.latlng)
        .setContent(String(e.latlng))
        .openOn(map);
    //alert("click coordinates: " + e.latlng);
}
map.on('click', onMapClick);