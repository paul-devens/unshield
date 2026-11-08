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

const texts = {
    lt: {
        colophon1: "Un/shield („Ne/apsaugotas“) – tai specialiai Europos parko erdvei sukurtas meno kūrinys. Jį sudaro trys atviro karkaso konstrukcijos, išdėstytos tam tikru atstumu viena nuo kitos.",
        colophon2: "Šios formos atkuria trijų Atlanto sienos bunkerių, stūksančių Normandijos ir Bretanės pakrantėse, architektūrinius kontūrus, sumažintus 1:3 masteliu.",
        colophon3: "Meno kūrinys Un/shield atskleidžia šių trijų skirtingų bunkerių akustinę erdvę per specialią mobiliąją programėlę. Naudodama išmaniojo telefono GPS, programėlė nustato, kada lankytojas atsiduria po viena iš konstrukcijų arba jos viduje. Tuomet aplinkos garsai skaitmeniniu būdu susilieja su autentiškų Antrojo pasaulinio karo bunkerių vidaus atgarsiais. Norint išgirsti šį efektą, būtina naudoti telefono ausines.",
        colophon4: "Un/shield tyrinėja priešpriešą tarp pažeidžiamumo ir saugumo troškimo. Šiandienis pasaulis čia stebimas per architektūrines formas, kylančias iš istorinės karinės galios tradicijos. Kūrinys apmąsto šiuolaikines geopolitines įtampas, suteikdamas joms žmogiškąjį mastelį. Jis veikia kaip observatorija, kuri lankytojo vaizduotėje sukuria dvejopą būseną: kartu ir stiprų ryšį su aplinka, ir visišką izoliaciją nuo jos.",
        colophon5: "Normandijos ir Bretanės pakrantėse išmatuoti bunkeriai: Pasipriešinimo lizdas 33A (Widerstandsnest 33A), R666 bunkeris su šarvuotu kupolu (R666 Coupole) ir „Kepurės“ bunkeris (Blockhaus de la Casquette). ",
        colophon6_1: "Un/shield („Ne/apsaugotas“) – tai Paul Devens meno projektas,",
        colophon6_2: "sukurtas Europos Parkui, Europos centro muziejui kaip parodos „Parko garsas“ dalis.",
        colophon6_3: "Konstrukcijas pagamino – Bert Reijnen",
        colophon6_4: "Programėlę sukūrė – Miikka Lehto",
        colophon7_1: "Projektą finansavo:",
        colophon7_2: "Lietuvos kultūros taryba, Lietuva",
        colophon7_3: "Mondriaan fondas, Nyderlandai",
        colophon7_4: "Zuydo taikomųjų mokslų universitetas, Nyderlandai",
    },
    en: {
        colophon1: "Un/shield is an artwork specially developed for Europos Parkas. It consists of three open structures placed at some distance from each other throughout the park.",
        colophon2: "The structures follow the contours of the architecture of three bunkers from the Atlantic Wall, located on the Normandy and Brittany coasts, scaled down to 1:3.",
        colophon3: "In the artwork Un/shield, the acoustics of the three individual bunkers are recreated through an app. Using the smartphone’s GPS, the app detects when a visitor is under or inside one of the forms. The live sounds present at the location are then digitally enhanced with the reflections of the interiors of the original World War II bunkers. To hear this, visitors must use their smartphone’s earphones or headphones.",
        colophon4: "Un/shield explores the tension between vulnerability and protection as a means of expression. Within the derived forms of the power-architecture from the historical military tradition, the contemporary world is observed. The artwork engages with geopolitical tensions and translates them into a human scale. It functions as an observatory that, through imagination, simultaneously offers both a connection to- and an isolation from the surroundings.",
        colophon5: "The measured bunkers on the Normandy and Brittany coasts are: Widerstandsnest 33A, R666 Coupole, Blockhaus de la Casquette.",
        colophon6_1: "Un/shield is an art project by Paul Devens",
        colophon6_2: "at the invitation of Europos Parkas as part of the open-air exhibition Park Sound",
        colophon6_3: "Construction execution: Bert Reijnen",
        colophon6_4: "App development: Miikka Lehto",
        colophon7_1: "With financial support of:",
        colophon7_2: "Mondriaan Fund, Netherlands",
        colophon7_3: "Lithuanian Council for Culture, Lithuania",
        colophon7_4: "Zuyd University of Applied Sciences, Netherlands",
    },
    nl: {
        colophon1: "Un/shield is een kunstwerk die speciaal voor Europos Parkas ontwikkeld is. Het bestaat uit drie open constructies die op enige afstand van elkaar door het park geplaatst is.",
        colophon2: "De constructies volgen de ribben van de architectuur van drie bunkers uit de Atlantic Wall, aan de Normandische en Bretonse kust, verkleind op schaal 1:3.",
        colophon3: "In het kunstwerk Un/shield komt de akoestiek van de drie afzonderlijke bunkers terug via deze app. Via de GPS van de smartphone lokaliseert de app dat de bezoeker zich onder, of -in één van de vormen bevindt. Daar worden de aanwezige ‘live’ geluiden digitaal voorzien van de reflecties van de interieurs van de oorspronkelijke bunker uit de 2e wereldoorlog. Om dit te horen moeten de oortjes of de koptelefoon van de smartphone worden opgezet.",
        colophon4: "Un/shield zoekt de spanning tussen kwetsbaarheid en bescherming als een expressiemiddel. Binnen de afgeleide vormen van de machts-architectuur uit de historische militaire traditie wordt het hedendaagse geobserveerd. Het kunstwerk betrekt de geopolitieke spanningen en vertaalt dit naar een menselijk formaat. Het werkt als een observatorium die via verbeelding tegelijk een verbinding als een isolatie met de omgeving biedt.",
        colophon5: "De gemeten bunkers aan de Normandische- en Bretonse kust zijn: Wiederstandsnest 33A, R666 Coupole, Blockhaus de la Casquette.",
        colophon6_1: "Un/shield is een kunstproject van Paul Devens",
        colophon6_2: "op uitnodiging van Europos Parkas als deel van de openlucht tentoonstelling Park Sound",
        colophon6_3: "Uitvoering van de constructie: Bert Reijnen",
        colophon6_4: "Ontwikkeling van de app: Miikka Lehto",
        colophon7_1: "Met ondersteuning van:",
        colophon7_2: "Mondriaan Fonds, Nederland",
        colophon7_3: "Litouwse Raad voor Cultuur, Litouwen",
        colophon7_4: "Zuyd University of Applied Sciences, Nederland",
    }
}

const langSelect = document.getElementById("lang-select");
const colophon = document.getElementById("panel-colophon");
const colophonElements = colophon.querySelectorAll("[data-i18n]");

function setLang(lang) {
    for (const element of colophonElements) {
        element.textContent = texts[lang][element.dataset.i18n];
    }
}

langSelect.addEventListener("change", () => setLang(langSelect.value));

setLang(langSelect.value);

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