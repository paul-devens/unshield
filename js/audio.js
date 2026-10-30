let audioContext = null; // audio context variable
let current_reverb = null; // currently selected reverb
let stream = null; // user media audio stream
let source = null; // audio source variable
let input_id = null; // selected input deviceId
let output_id = null; // selected output deviceId
let reverb_1 = null;
let reverb_2 = null;
let reverb_3 = null;
const reverbs = new Map();

// create audio context and reverbs
async function initAudio() {
    // create audio context
    audioContext = new AudioContext();
    await audioContext.resume();
    // create reverb nodes
    reverb_1 = audioContext.createConvolver();
    reverb_2 = audioContext.createConvolver();
    reverb_3 = audioContext.createConvolver();
    // load impulse responses
    loadReverb(reverb_1, "./res/audio/ir-blockhaus-stereo.wav");
    loadReverb(reverb_2, "./res/audio/ir-coupole-stereo.wav");
    loadReverb(reverb_3, "./res/audio/ir-wiederstandsnest-stereo.wav");
    // connect to output
    reverb_1.connect(audioContext.destination);
    reverb_2.connect(audioContext.destination);
    reverb_3.connect(audioContext.destination);
    // map to IDs
    reverbs.set("0", null);
    reverbs.set("1", reverb_1);
    reverbs.set("2", reverb_2);
    reverbs.set("3", reverb_3);
}

// update input devices
async function refreshDevices() {
    devices = await navigator.mediaDevices.enumerateDevices();
    devices.forEach((device) => console.log(`kind = ${device.kind} label = ${device.label} deviceId = ${device.deviceId} groupId = ${device.groupId}`));
    // add to input select
    input_select = document.getElementById("input-select");
    clearOptions(input_select);
    devices.forEach((device) => {
        if (device.kind =="audioinput") {
            addOption(input_select, device.deviceId, device.label);
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

// start listening to user's microphone
async function startListening() {
    try {
        if (audioContext == null) {
            initAudio();
        }
        // get user device audio (default input or inputId)
        if (input_id == null) {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });
        } else {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    deviceId: {exact: input_id}
                }
            });
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
        // log stream settings to console
        console.log(stream.getAudioTracks()[0].getSettings());
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

// handle reverb changing
function changeReverb(reverb_id) {
    // get target reverb
    let target_reverb = reverbs.get(reverb_id);
    // if target matches current, do nothing
    if (target_reverb == current_reverb) {
        return;
    }
    // handle reverb connection / disconnection
    if (target_reverb == null) {
        disconnectReverb();
    } else {
        connectReverb(target_reverb);
    }
    // update current_reverb
    current_reverb = target_reverb;
    appendInfo("reverb set to " + reverb_id);
}

// handle reverb manual override
function overrideReverb() {
    let reverb_id = document.getElementById("reverb-select").value;
    changeReverb(reverb_id);
}