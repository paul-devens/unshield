let audioContext = new AudioContext(); // audio context variable
let current_reverb = null; // currently selected reverb
let stream = null; // user media audio stream
let source = null; // audio source variable
let input_id = null; // selected input deviceId
let output_id = null; // selected output deviceId

// create reverb nodes
let reverb_1 = audioContext.createConvolver();
let reverb_2 = audioContext.createConvolver();
let reverb_3 = audioContext.createConvolver();
// load impulse responses
loadReverb(reverb_1, "./res/audio/ir-blockhaus-stereo.wav");
loadReverb(reverb_2, "./res/audio/ir-coupole-stereo.wav");
loadReverb(reverb_3, "./res/audio/ir-wiederstandsnest-stereo.wav");
// connect to output
reverb_1.connect(audioContext.destination);
reverb_2.connect(audioContext.destination);
reverb_3.connect(audioContext.destination);
// map to IDs
const reverbs = new Map();
reverbs.set("0", null);
reverbs.set("1", reverb_1);
reverbs.set("2", reverb_2);
reverbs.set("3", reverb_3);

// update devices (inputs and outputs)
async function refreshDevices() {
    devices = await navigator.mediaDevices.enumerateDevices();
    devices.forEach((device) => console.log(`kind = ${device.kind} label = ${device.label} deviceId = ${device.deviceId} groupId = ${device.groupId}`));
    // add to input & output select
    input_select = document.getElementById("input-select");
    clearOptions(input_select);
    output_select = document.getElementById("output-select");
    clearOptions(output_select);
    devices.forEach((device) => {
        if (device.kind =="audioinput") {
            addOption(input_select, device.deviceId, device.label);
        } else if (device.kind =="audiooutput") {
            addOption(output_select, device.deviceId, device.label);
        }
    });
}

// log device info (capabilities) to console
function logDeviceInfo() {
    tracks = stream.getTracks();
    tracks.map((t) => console.log(t.getCapabilities()));
}

async function inputChanged() {
    input_id = document.getElementById("input-select").value;
    console.log(`selected input_id: ${input_id}`);
    try {
        if (source != null) {
            stopListening();
        }
        await startListening();
        logDeviceInfo();
    } catch (error) {
        appendInfo(error);
    }
}

function outputChanged() {
    output_id = document.getElementById("output-select").value;
    console.log(`selected output_id: ${output_id}`);
}

// start listening to user's microphone
async function startListening() {
    try {
        // get user device audio (default input or inputId)
        if (input_id == null) {
            stream = await navigator.mediaDevices.getUserMedia({audio: true});
        } else {
            stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: {exact: input_id}}});
        }
        // set device audio as audio context's source
        source = audioContext.createMediaStreamSource(stream);
        // connect source to destination or reverb
        if (current_reverb == null) {
            source.connect(audioContext.destination);
        } else {
            source.connect(current_reverb);
        }
        appendInfo("listening enabled");
        document.getElementById("audio-disable").disabled = false; // enable stop button
        document.getElementById("audio-enable").disabled = true; // disable start button
    } catch (error) {
        appendInfo(error);
    }
}

// stop listening to user's microphone
function stopListening() {
    if (current_reverb != null) {
        source.disconnect(current_reverb);
    } else {
        source.disconnect(audioContext.destination);
    }
    source = null;
    appendInfo("listening disabled");
    document.getElementById("audio-enable").disabled = false; // enable start button
    document.getElementById("audio-disable").disabled = true; // disable stop button
}

// load impulse response file
async function loadReverb(reverb, path) {
    let response = await fetch(path);
    let arraybuffer = await response.arrayBuffer();
    reverb.buffer = await audioContext.decodeAudioData(arraybuffer);
}

// connect selected reverb if source exists
function connectReverb(reverb) {
    try {
        if (source != null) {
            // if reverb is currently off, disconnect source from output
            if (current_reverb == null) {
                source.disconnect(audioContext.destination);
            } else { // otherwise disconnect source from current reverb
                source.disconnect(current_reverb);
            }
            // connect source to selected reverb
            source.connect(reverb);
        }
    } catch (error) {
        appendInfo(error);
    }
}

// disconnect reverb if source exists
function disconnectReverb() {
    try {
        if (source != null && current_reverb != null) {
            source.disconnect(current_reverb);
            source.connect(audioContext.destination);
        }
    } catch (error) {
        appendInfo(error);
    }
}

// handle reverb selector change
function reverbChanged() {
    // get target reverb
    let reverb_id = document.getElementById("reverb-select").value;
    let target_reverb = reverbs.get(reverb_id);
    // handle reverb connection / disconnection
    if (target_reverb == null) {
        disconnectReverb();
    } else {
        connectReverb(target_reverb);
    }
    // update current_reverb
    current_reverb = target_reverb;
}