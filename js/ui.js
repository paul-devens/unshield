let testMode = false;

if (new URLSearchParams(location.search).has('test')) {
    document.getElementById('tab-options')?.classList.remove('hidden');
    testMode = true;
}

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const mapDiv = document.getElementById('map');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(tab.dataset.panel);
        panel.classList.add('active');
        if (panel.contains(mapDiv)) {
            map.invalidateSize();
        }
    });
});

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