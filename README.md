# 🧭 KBC Kompas — Levensplan & Context-Adaptive KBC Mobile PoC
**Tectonic Hackathon — KBC Challenge Proof of Concept**

> **Idee:** *KBC raadt niet langer blind wat je nodig hebt — jij kiest je bestemming, en KBC leest de signalen onderweg om je op koers te houden.*

---

## 🎯 Wat we gebouwd hebben
1. **Volledige KBC Mobile App Clone (`frontend/` + `index.html`):**
   * **🏠 Start:** Zichtrekening, Spaarrekening, Gezamenlijke rekening (Koppelmodus), **Live KBC Kompas Koers-Kaart**, Snelle acties en Recente verrichtingen.
   * **🧭 Kompas:** Persoonlijk levensplan (*Eigen Woning, Op Kot, Grote Reis, Eerste Auto, Gezin Starten, Pensioen*), **3-Vragen Onboarding Wizard**, Route-analyse (*Wat je al hebt* vs. *Wat nog ontbreekt*) en de **Bijsturen-Popup** (*Deadline verschuiven*, *Doelbedrag verlagen*, *Meer sparen*).
   * **🛡️ Producten:** Automatische productkoppeling (Leningen, Verzekeringen & Beleggingen) per gekozen levensdoel.
   * **🤖 Kate:** Jouw Kompas Co-Piloot die uitleg geeft op basis van jouw gekozen richting.
   * **⚙️ Instellingen (Mijn Digitaal Profiel & Privacy):** Pas live je naam, leeftijd, gezinssituatie, Koppelmodus, inkomen, uitgaven en spaargeld aan, bekijk **"Waarom zie ik dit?"** (de exacte Kompas-formule en cijfers) en beheer je **Privacy-toggles**.
2. **KBC Kompas-Engine (`engine/kompas-engine.js`):**
   * `spaarcapaciteit = gem. inkomen (3 mnd) - gem. uitgaven (3 mnd)`
   * `nodig_per_maand = (doelbedrag - gespaard) / maanden_tot_deadline`
   * `ratio = spaarcapaciteit / nodig_per_maand` (`≥ 1.0` 🟢 Op koers, `0.7–1.0` 🟠 Bijsturen, `< 0.7` 🔴 Plan aanpassen).
3. **Uitgebreide Data Lake (`data/`):**
   * [`data/goal-catalog.js`](./data/goal-catalog.js): Doelcatalogus met kosten, termijnen en gekoppelde KBC-producten.
   * [`data/personas-database.js`](./data/personas-database.js): De 3 demo-persona's (*Lisa*, *Koppel Lukas & Emma*, *Gezinsvader Thomas*) met 12 maanden historiek en live events.
   * [`data/synthetic-200-generator.js`](./data/synthetic-200-generator.js): Generator voor **200 synthetische KBC-klanten met 12 maanden transacties (14.400 transacties)**.
   * [`data/kbc-products-catalog.js`](./data/kbc-products-catalog.js): Alle KBC Bank-, Verzekerings- en Beleggingsproducten.
4. **Python + FastAPI + SQLite Backend (`backend/`):**
   * Implementeert `POST /doel`, `GET /kompas/{klant_id}`, `POST /event`, `GET /adviseur/{klant_id}` en `GET /dashboard`.

---

## 📁 Projectstructuur

```text
kbcproject/
├── index.html                        # Direct te openen web-app (Split-Screen, Telefoon, Adviseur & Dashboard)
├── styles/
│   └── kbc-theme.css                 # Officiële KBC Mobile styling & iPhone frame
├── data/
│   ├── goal-catalog.js               # Doelcatalogus (Woning, Kot, Reis, Auto, Gezin, Pensioen)
│   ├── personas-database.js          # 3 Demo-persona's + 12m historiek + Live Events
│   ├── synthetic-200-generator.js    # 200 synthetische klanten (14.400 transacties)
│   ├── kbc-products-catalog.js       # KBC Verzekeringen, Leningen & Beleggingen
│   ├── customers-database.js         # Uitgebreide KBC klantprofielen
│   └── signals-catalog.js            # Extra signaal-scenario's
├── engine/
│   └── kompas-engine.js              # KBC Kompas rekenmotor & bijstuur-opties
├── frontend/
│   └── kbc-kompas-app.js             # Volledige KBC Mobile Clone + Simulator + Adviseur + Dashboard
└── backend/
    ├── main.py                       # Python FastAPI + SQLite server (5 endpoints)
    └── requirements.txt              # FastAPI & Uvicorn dependencies
```

---

## 🚀 Hoe starten via Localhost of direct lokaal?

### Optie 1: Direct openen (Geen installatie nodig)
Dubbelklik op [`index.html`](./index.html) om de volledige app direct in je browser te openen.

### Optie 2: Via Localhost Webserver
```bash
python -m http.server 8080
```
Open daarna **[http://localhost:8080](http://localhost:8080)** in je browser.

### Optie 3: Python FastAPI Backend starten (Optioneel op poort 8000)
```bash
pip install -r backend/requirements.txt
python backend/main.py
```
De API en Swagger-docs draaien dan op **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**.