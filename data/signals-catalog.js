/**
 * KBC AURA - CATALOGUS VAN 24+ LIVE SIMULEERBARE SIGNALEN (VOOR DE SIMULATOR VAN PERSOON 1)
 * Elke signaal-actie voegt realistische transacties, in-app telemetrie of externe omgevingssignalen
 * toe aan de geselecteerde klant, waarna de Profiel-Engine (Persoon 2) het Digitaal Profiel herberekent.
 */
window.KBCAura = window.KBCAura || {};

window.KBCAura.SignalsCatalog = [
  // ================= CATEGORIE 1: NOODGEVALLEN & REIS CRISIS =================
  {
    id: "sig-autopech-frankrijk",
    category: "Noodgeval & Mobiliteit",
    title: "🚨 Autopech op snelweg in Zuid-Frankrijk (23:45u)",
    shortLabel: "+ Sleepdienst Frankrijk (220 EUR)",
    icon: "🚨",
    badgeColor: "#dc2626",
    description: "Klant betaalt om 23:45u bij Dépannage Autoroute A7 (Orange, FR) en opent gestrest 3x de KBC-app.",
    transactionToAdd: {
      date: "Vandaag, 23:45",
      merchant: "Dépannage Autoroute A7 - Garage du Midi (FR)",
      amount: -220.00,
      category: "Mobiliteit & Nood",
      mcc: "7549",
      location: "Orange, Frankrijk (A7)",
      signalTag: "EMERGENCY_ROADSIDE_ABROAD"
    },
    telemetryEffect: {
      panicTaps: 6,
      nightSessionAbroad: true,
      lastSearchedInApp: "pechverhelping nummer buitenland"
    },
    inferredSignal: {
      id: "inf-roadside-crisis",
      title: "Acute Autopech in het Buitenland (Frankrijk)",
      source: "Kaartbetaling MCC 7549 (Sleepdienst) + Locatie Frankrijk om 23:45u",
      confidence: 98,
      category: "CRISIS_CARE"
    }
  },
  {
    id: "sig-ziekenhuis-buitenland",
    category: "Noodgeval & Mobiliteit",
    title: "🏥 Spoedopname / Apotheek op vakantie in Spanje",
    shortLabel: "+ Spoedkliniek Barcelona (340 EUR)",
    icon: "🏥",
    badgeColor: "#dc2626",
    description: "Betaling bij Hospital Clínic Barcelona + zoekopdracht naar reisbijstand en hospitalisatie.",
    transactionToAdd: {
      date: "Vandaag, 21:15",
      merchant: "Hospital Clínic & Farmacia Barcelona (ES)",
      amount: -340.00,
      category: "Gezondheid & Reizen",
      mcc: "8062",
      location: "Barcelona, Spanje",
      signalTag: "MEDICAL_ABROAD"
    },
    telemetryEffect: {
      panicTaps: 4,
      nightSessionAbroad: true,
      lastSearchedInApp: "medische kosten terugbetaling spanje"
    },
    inferredSignal: {
      id: "inf-medical-abroad",
      title: "Medische Spoeduitgave in het Buitenland",
      source: "Transactie Ziekenhuis (MCC 8062) buiten België",
      confidence: 96,
      category: "CRISIS_CARE"
    }
  },

  // ================= CATEGORIE 2: WONEN, HUIS KOPEN & VERBOUWEN =================
  {
    id: "sig-notaris-voorschot",
    category: "Levensmijlpaal: Wonen",
    title: "🏡 Betaling Notaris & Compromis + 4x Twijfel op Woonkrediet",
    shortLabel: "+ Notaris De Vries (650 EUR) + Woon-twijfel",
    icon: "🏡",
    badgeColor: "#009DE0",
    description: "Klant betaalt dossierkosten bij Notaris De Vries en bekeek deze week 4x de pagina Woonlening zonder aanvraag.",
    transactionToAdd: {
      date: "Vandaag, 14:20",
      merchant: "Notariskantoor De Vries & Associés (Dossier Koopakte)",
      amount: -650.00,
      category: "Wonen & Vastgoed",
      mcc: "6513",
      location: "Gent, België",
      signalTag: "FIRST_HOME_NOTARY"
    },
    telemetryEffect: {
      mortgagePageViews: 5,
      mortgageSimulatorAbandons: 4,
      lastSearchedInApp: "eigen inbreng woonlening en brandverzekering"
    },
    inferredSignal: {
      id: "inf-first-home-intent",
      title: "Aankoop Eerste Woning & Keuzestress Hypotheek",
      source: "Betaling Notaris + €34k spaarbuffer + 4x afgebroken Woonlening-simulatie",
      confidence: 95,
      category: "LIFE_MILESTONE"
    }
  },
  {
    id: "sig-verbouwing-brico-ikea",
    category: "Levensmijlpaal: Wonen",
    title: "🔨 Grote Verbouwings- & Inrichtingsuitgaven (Brico Plan-It & IKEA)",
    shortLabel: "+ Brico Plan-It & IKEA (1.890 EUR)",
    icon: "🔨",
    badgeColor: "#0284c7",
    description: "Meerdere grote betalingen bij bouwmarkten en meubelzaken wijzen op verhuis of zware renovatie.",
    transactionToAdd: {
      date: "Vandaag, 16:05",
      merchant: "Brico Plan-It & IKEA Zaventem (Bouwmaterialen)",
      amount: -1890.00,
      category: "Wonen & Renovatie",
      mcc: "5211",
      location: "Zaventem, België",
      signalTag: "HOME_RENOVATION"
    },
    telemetryEffect: {
      renovationLoanViews: 3,
      lastSearchedInApp: "inboedelverzekering verhogen na verbouwing"
    },
    inferredSignal: {
      id: "inf-renovation-wave",
      title: "Actieve Verhuizing of Woningrenovatie",
      source: "Hoge uitgaven Bouwmarkt/Meubelen (MCC 5211) > €1.500",
      confidence: 89,
      category: "LIFE_MILESTONE"
    }
  },

  // ================= CATEGORIE 3: GEZINSUITBREIDING & KINDEREN =================
  {
    id: "sig-baby-dreambaby",
    category: "Levensmijlpaal: Gezin",
    title: "👶 Uitgaven bij Dreambaby + Inschrijving Kinderdagverblijf",
    shortLabel: "+ Dreambaby & Crèche (425 EUR)",
    icon: "👶",
    badgeColor: "#8b5cf6",
    description: "Klant koopt baby-uitzet bij Dreambaby en betaalt waarborg bij Kinderdagverblijf De Kleine Ster.",
    transactionToAdd: {
      date: "Vandaag, 11:30",
      merchant: "Dreambaby Geboortelijst & Crèche De Kleine Ster",
      amount: -425.00,
      category: "Gezin & Kinderen",
      mcc: "5641",
      location: "Antwerpen, België",
      signalTag: "NEW_BABY_ARRIVAL"
    },
    telemetryEffect: {
      familyInsuranceViews: 2,
      lastSearchedInApp: "kind toevoegen hospitalisatie en groeipakket"
    },
    inferredSignal: {
      id: "inf-baby-expecting",
      title: "Gezinsuitbreiding / Baby op Komst",
      source: "Transacties Dreambaby (MCC 5641) + Waarborg Kinderopvang",
      confidence: 93,
      category: "LIFE_MILESTONE"
    }
  },
  {
    id: "sig-groeipakket-storting",
    category: "Levensmijlpaal: Gezin",
    title: "🍼 Eerste storting Vlaams Groeipakket (Startbedrag Kraamgeld)",
    shortLabel: "+ Storting Kraamgeld (+1.214 EUR)",
    icon: "🍼",
    badgeColor: "#10b981",
    description: "Eerste officiële uitbetaling van het Vlaams Groeipakket (Startbedrag geboorte) op de zichtrekening.",
    transactionToAdd: {
      date: "Vandaag, 09:00",
      merchant: "Fons / Vlaams Groeipakket - Startbedrag Geboorte",
      amount: 1214.49,
      category: "Inkomen & Gezin",
      mcc: "9399",
      location: "Brussel, België",
      signalTag: "GROEIPAKKET_FIRST_PAYMENT"
    },
    telemetryEffect: {
      lastSearchedInApp: "kinderspaarrekening openen"
    },
    inferredSignal: {
      id: "inf-newborn-confirmed",
      title: "Pasgeboren Kindje in het Gezin (100% Bevestigd)",
      source: "Inkomende betaling Startbedrag Vlaams Groeipakket",
      confidence: 99,
      category: "LIFE_MILESTONE"
    }
  },

  // ================= CATEGORIE 4: TWIJFEL, SPAREN, BELEGGEN & GELDSTRESS =================
  {
    id: "sig-beleggen-twijfel",
    category: "In-App Gedrag & Vermogen",
    title: "📈 6x Twijfel-kliks op 'Beleggen' + €34.000 Stilstaand Spaargeld",
    shortLabel: "+ 6x Twijfel op Beleggen (Inflatie-verlies)",
    icon: "📈",
    badgeColor: "#0ea5e9",
    description: "Klant heeft een grote spaarbuffer die waarde verliest door inflatie, opent 6x 'Starten met Beleggen' maar sluit telkens na 20s af.",
    transactionToAdd: null,
    telemetryEffect: {
      investmentTabViews: 6,
      investmentAbandons: 6,
      avgTimeOnInvestmentSec: 22,
      lastSearchedInApp: "is beleggen gevaarlijk als ik 100 euro per maand doe"
    },
    inferredSignal: {
      id: "inf-investment-hesitation",
      title: "Sterke Interesse in Beleggen, maar Drempelvrees / Keuzestress",
      source: "6x bezoek aan Beleggen zonder actie + €34.200 spaarbuffer (> 8 maanden buffer)",
      confidence: 91,
      category: "HESITATION_COACHING"
    }
  },
  {
    id: "sig-geldstress-eindemaand",
    category: "Financiële Gezondheid",
    title: "⚠️ Hoge Eindafrekening Energie + Laag Saldo vóór Loonstorting",
    shortLabel: "+ Eindafrekening Luminus (-840 EUR)",
    icon: "⚠️",
    badgeColor: "#f59e0b",
    description: "Onverwachte jaarafrekening energie zorgt ervoor dat het zichtrekeningsaldo onder de aankomende huurdomiciliëring zakt.",
    transactionToAdd: {
      date: "Vandaag, 08:30",
      merchant: "Luminus Energie - Jaarlijkse Eindafrekening",
      amount: -840.00,
      category: "Vaste Lasten & Energie",
      mcc: "4900",
      location: "Domiciliëring België",
      signalTag: "CASHFLOW_SQUEEZE"
    },
    telemetryEffect: {
      balanceChecksToday: 9,
      lastSearchedInApp: "domiciliering tijdelijk uitstellen of spreiden"
    },
    inferredSignal: {
      id: "inf-cashflow-stress",
      title: "Tijdelijke Cashflow-Druk vóór Loonstorting",
      source: "Hoge energie-afschrijving (-€840) + 9x saldo-check op 1 dag",
      confidence: 94,
      category: "CRISIS_CARE"
    }
  },

  // ================= CATEGORIE 5: TOEGANKELIJKHEID & MASSA-SCHAAL (2.3M) =================
  {
    id: "sig-senior-miskliks",
    category: "Toegankelijkheid & Comfort",
    title: "👓 Klant tikt 7x mis op kleine knopjes & zoekt hulp bij overschrijving",
    shortLabel: "+ 7x Misklik / Zoom-gedrag (Activeer Grote Modus)",
    icon: "👓",
    badgeColor: "#14b8a6",
    description: "App-telemetrie detecteert herhaalde miskliks naast kleine iconen en lange twijfeltijd op het overschrijvingsscherm.",
    transactionToAdd: null,
    telemetryEffect: {
      misclicksCount: 7,
      fontSizeZoomAttempts: 4,
      transferScreenDurationSec: 240,
      forceAccessibilitySuggestion: true
    },
    inferredSignal: {
      id: "inf-accessibility-need",
      title: "Behoefte aan Vereenvoudigde Interface & Grote Knoppen",
      source: "In-App Telemetrie: 7 miskliks op kleine iconen + 4 minuten op overschrijvingsscherm",
      confidence: 97,
      category: "ACCESSIBILITY_ASSIST"
    }
  },
  {
    id: "sig-storm-antwerpen-massa",
    category: "Massa-Schaal (2,3M Klanten)",
    title: "⛈️ KMI Code Rood: Zware Storm & Hagel boven Postcode Klant",
    shortLabel: "+ KMI Code Rood Storm in Woonplaats",
    icon: "⛈️",
    badgeColor: "#e11d48",
    description: "Externe weerswaarschuwing (windstoten 115 km/u) treft de postcode van de klant (en 120.000 andere KBC-klanten tegelijk).",
    transactionToAdd: null,
    telemetryEffect: {
      activeWeatherAlert: "KMI_CODE_ROOD_STORM",
      affectedCustomersCount: 124500,
      lastSearchedInApp: "dakpannen stormschade aangeven"
    },
    inferredSignal: {
      id: "inf-macro-storm-alert",
      title: "KMI Code Rood Storm in Postcode Klant (Proactieve Schade-Modus)",
      source: "KMI Geo-Feed gekoppeld aan Postcode + Woningpolis database (124.500 klanten)",
      confidence: 99,
      category: "CRISIS_CARE"
    }
  }
];
