# 🗄️ KBC Aura Data Lake (`/data`)

Deze map bevat alle uitgebreide Belgische bank-, verzekerings-, transactie- en gedragsdata waarmee het **Digitaal Klantprofiel** wordt opgebouwd.

## Bestanden in deze map:
1. **[`kbc-products-catalog.js`](./kbc-products-catalog.js)**:
   Volledige catalogus van KBC-producten over alle 4 de pijlers:
   * **Bankieren & Kredieten:** KBC Plusrekening, Spaarrekening, Woonlening, Renovatiekrediet, Autolening, Kredietkaartlimiet-boost.
   * **Verzekeren:** KBC Woningpolis (Huurder & Eigenaar), BA Auto, Volledige Omnium, KBC Pechverhelping, Familiale Verzekering, Hospitalisatieverzekering, Reisbijstand, Schuldsaldoverzekering.
   * **Beleggen & Pensioen:** KBC-Beleggingsplan, Wisselgeld Beleggen, Pensioensparen, Bolero Zelf Beleggen.
   * **Extra Diensten (Beyond Banking):** NMBS Treintickets, De Lijn, 4411 Parkeren, Payconiq, KBC Stormschade-Melder.

2. **[`signals-catalog.js`](./signals-catalog.js)**:
   Catalogus van **24+ simuleerbare real-time signalen** (Transacties, In-App Twijfelgedrag, Locatie/Noodgevallen, Toegankelijkheid voor Senioren en Externe KMI Storm / Beurs-events).

3. **[`customers-database.js`](./customers-database.js)**:
   **6 diepgaand uitgewerkte Belgische KBC-klanten** met elk hun IBAN-rekeningen, tientallen realistische transacties (Colruyt, Delhaize, NMBS, Notaris, Dreambaby, Brico, Garage Autoroute A7, etc.), actieve verzekeringen, ontbrekende dekkingen, beleggingen, in-app telemetrie en instelbare profielvoorkeuren.
