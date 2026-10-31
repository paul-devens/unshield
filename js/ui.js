let testMode = false;

if (new URLSearchParams(location.search).has('test')) {
    document.getElementById('options')?.classList.remove('hidden');
    testMode = true;
}

function startApp() {
    document.getElementById('splash').remove()
    startTracking();
    startListening();
}

function appendInfo(text) {
    const time = new Date(Date.now());
    const timestamp = time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0") + ":" + time.getSeconds().toString().padStart(2, "0") + "." + time.getMilliseconds().toString().padStart(3, "0");
    document.getElementById("info-text").value += timestamp + " " + text + "\n";
}

function clearOptions(select) {
    for (option in select.options) {
        select.options.remove(0);
    }
}

function addOption(select, value, label) {
    option = document.createElement('option');
    option.value = value;
    option.innerHTML = label;
    select.appendChild(option);
}