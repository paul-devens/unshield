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
let currentLocation = null;
const detectionRadius = 5;

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
    // update current location variable
    currentLocation = L.latLng(lat, lng);
    // check proximity to map points
    checkProximity();
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

// create map point as array [latLng, Circle]
function addMapPoint(lat, lng) {
    var latlng = L.latLng(lat, lng);
    var circle = L.circle([lat, lng], {
        color: 'white',
        fillOpacity: 0.8,
        radius: detectionRadius
    }).addTo(map);
    return [latlng, circle];
}

// set given map point to current location (for testing)
function setMapPoint(point) {
    if (currentLocation != null) {
        point[0] = currentLocation; // update latLng coordinates
        point[1].setLatLng(currentLocation); // set circle coordinates
    }
}

var pointBlockhaus = addMapPoint(54.826708, 25.355745);
var pointCoupole = addMapPoint(54.826417, 25.355439);
var pointWiederstandsnest = addMapPoint(54.826462, 25.355901);

function checkProximity() {
    // get distances to map points
    var distanceBlockhaus = currentLocation.distanceTo(pointBlockhaus[0]);
    var distanceCoupole = currentLocation.distanceTo(pointCoupole[0]);
    var distanceWiederstandsnest = currentLocation.distanceTo(pointWiederstandsnest[0]);
    // set reverb according to distance
    if (distanceBlockhaus < detectionRadius) {
        changeReverb("1");
    } else if (distanceCoupole < detectionRadius) {
        changeReverb("2");
    } else if (distanceWiederstandsnest < detectionRadius) {
        changeReverb("3");
    } else {
        changeReverb("0"); // reverb off
    }
}

// print coordinates on click
var popup = L.popup();
function onMapClick(e) { // e = event object
    popup
        .setLatLng(e.latlng)
        .setContent(String(e.latlng))
        .openOn(map);
    // currentLocation = e.latlng;
    // checkProximity();
}
map.on('click', onMapClick);