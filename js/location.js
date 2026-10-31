// initialize map, set coordinates and zoom level
var map = L.map('map', {
    center: [54.826533, 25.355641],
    zoom: 17,
    zoomControl: false
});
// OpenStreetMap tiles
const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
// Stadia Alidade Smooth Dark
const stadia = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=b3cab5bc-de52-47c5-b792-d4f74e178bd2', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
});
// use OSM as backup if Stadia fails (3 successive tile errors)
let stadia_fails = 0;
stadia.on('tileerror', () => {
    stadia_fails++;
    if (stadia_fails >= 3) {
        map.removeLayer(stadia);
        osm.addTo(map);
    }
});
stadia.on('tileload', () => { stadia_fails = 0; });
stadia.addTo(map);

let watchID = null; // ID for geolocation position watcher
let userMarker; // marker drawn to user location
let userCircle; // circle drawn around user location representing accuracy
let currentLocation = null;
const detectionRadius = 5; // reverb activation range in meters
// map point styles (inactive and active)
const pointStyleInactive = {
    color: 'white',
    weight: 3,
    stroke: false,
    fillOpacity: 0.6,
    radius: detectionRadius
}
const pointStyleActive = {
    color: 'white',
    weight: 3,
    stroke: true,
    fillOpacity: 0.6,
    radius: detectionRadius
}

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
    userCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: 'white',
        fillOpacity: 0.1,
        stroke: false
    }).addTo(map);
    userMarker = L.circleMarker([lat, lng], {
        color: 'black',
        weight: 2,
        fillCoor: 'white',
        fillOpacity: 1,
        radius: 5
    }).addTo(map);
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
    var circle = L.circle([lat, lng], pointStyleInactive).addTo(map);
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
let activePoint = null;

function checkProximity() {
    // get distances to map points
    var distanceBlockhaus = currentLocation.distanceTo(pointBlockhaus[0]);
    var distanceCoupole = currentLocation.distanceTo(pointCoupole[0]);
    var distanceWiederstandsnest = currentLocation.distanceTo(pointWiederstandsnest[0]);
    // set reverb according to distance
    if (distanceBlockhaus < detectionRadius) {
        if (activePoint != pointBlockhaus) {
            changeReverb("1");
            setHighlight(pointBlockhaus);
            activePoint = pointBlockhaus;
        }
    } else if (distanceCoupole < detectionRadius) {
        if (activePoint != pointCoupole) {
            changeReverb("2");
            setHighlight(pointCoupole);
            activePoint = pointCoupole;
        }
    } else if (distanceWiederstandsnest < detectionRadius) {
        if (activePoint != pointWiederstandsnest) {
            changeReverb("3");
            setHighlight(pointWiederstandsnest);
            activePoint = pointWiederstandsnest;
        }
    } else {
        if (activePoint != null) {
            changeReverb("0"); // reverb off
            removeHighlights();
            activePoint = null;
        }
    }
}

// highlight active map point
function setHighlight(point) {
    removeHighlights();
    point[1].setStyle(pointStyleActive);
}
// remove highlights from all map points
function removeHighlights() {
    pointBlockhaus[1].setStyle(pointStyleInactive);
    pointCoupole[1].setStyle(pointStyleInactive);
    pointWiederstandsnest[1].setStyle(pointStyleInactive);
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