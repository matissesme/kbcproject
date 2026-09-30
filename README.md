# KBC Kompas — Levensplan & Context-Adaptive KBC Mobile PoC
**Tectonic Hackathon — KBC Challenge Proof of Concept**

> **Idee:** *KBC raadt niet langer blind wat je nodig hebt — jij kiest je bestemming, en KBC leest de signalen onderweg om je op koers te houden.*

---

## Wat we gebouwd hebben
1. **Volledige KBC Mobile App Clone (`frontend/` + `index.html`):**
   * **Start:** Zichtrekening, Spaarrekening, Gezamenlijke rekening (Koppelmodus), live KBC Kompas koers-kaart, snelle acties en recente verrichtingen.
   * **Kompas:** Persoonlijk levensplan (eigen woning, op kot, grote reis, eerste auto, gezin starten, pensioen), route-analyse en bijstuur-opties (deadline verschuiven, doelbedrag verlagen, meer sparen).
   * **Kompas via het logo:** Klik op het ronde logo in de app. De eerste keer komt een vragenlijst (wat wil je over 5 jaar, wat komt eerst, wanneer, sparen of beleggen). Daarna een koerslijn: op koers, bijsturen of plan aanpassen, plus of je geld overhoudt of tekortkomt.
   * **Producten:** Automatische productkoppeling (leningen, verzekeringen en beleggingen) per gekozen levensdoel.
   * **Kate:** Kompas-copiloot die uitleg geeft op basis van de gekozen richting.
   * **Instellingen:** Digitaal profiel, "Waarom zie ik dit?" en privacy-toggles.
2. **KBC Kompas-engine (`engine/kompas-engine.js`):**
   * `spaarcapaciteit = gem. inkomen (3 mnd) - gem. uitgaven (3 mnd)`
   * `nodig_per_maand = (doelbedrag - gespaard) / maanden_tot_deadline`
   * `ratio = spaarcapaciteit / nodig_per_maand` (`≥ 1.0` op koers, `0.7–1.0` bijsturen, `< 0.7` plan aanpassen).
3. **Data (`data/`):**
   * `data/goal-catalog.js`: doelcatalogus met kosten, termijnen en gekoppelde producten.
   * `data/personas-database.js`: demo-persona's Lisa, koppel Lukas & Emma, gezinsvader Thomas.
   * `data/synthetic-200-generator.js`: generator voor synthetische klanten.
   * `data/kbc-products-catalog.js`: bank-, verzekerings- en beleggingsproducten.
   * `data/schema.sql`, `data/kompas.db` en `mathis data fake/`: extra synthetische set (klant, transactie, doel, plan_event). Geen echte klanten.
4. **Python + FastAPI + SQLite (`backend/`):**
   * `POST /doel`, `GET /kompas/{klant_id}`, `POST /event`, `GET /adviseur/{klant_id}` en `GET /dashboard`.

---

## Projectstructuur

```text
kbcproject/
├── index.html
├── assets/
│   └── kompas-logo.svg
├── styles/
│   └── kbc-theme.css
├── data/
│   ├── goal-catalog.js
│   ├── personas-database.js
│   ├── synthetic-200-generator.js
│   ├── kbc-products-catalog.js
│   ├── schema.sql
│   └── catalog/goals.json
├── engine/
│   └── kompas-engine.js
├── frontend/
│   ├── kbc-kompas-app.js
│   └── kompas-feature.js
├── mathis data fake/
└── backend/
    ├── main.py
    └── requirements.txt
```

---

## Starten

Dubbelklik op `index.html`, of:

```bash
py -3 -m http.server 8080
```

Open daarna http://localhost:8080.

Optioneel, de API:

```bash
pip install -r backend/requirements.txt
py -3 backend/main.py
```

Swagger staat dan op http://127.0.0.1:8000/docs.

Synthetische SQLite-set opnieuw maken:

```bash
py -3 generate_fake_customers.py
```
