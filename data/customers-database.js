/**
 * KBC AURA - UITGEBREIDE KLANTENDATABASE (6 BELGISCHE PERSONA'S MET MASSIEVE DATA)
 * Bevat per klant:
 * - Persoons- & Gezinsgegevens
 * - KBC Zichtrekening, Spaarrekening, Kredietkaart & Leningen (met echte Belgische IBAN-structuur)
 * - Uitgebreide Transactiehistoriek (met MCC-codes, locaties, bedragen en signaal-tags)
 * - Lopende Verzekeringen (Actief) + Bewuste Dekkingsgaten (voor AI Gap-Analysis)
 * - Beleggingsportefeuille
 * - In-App Gedrag & Telemetrie (clicks, twijfel-momenten, zoekopdrachten)
 * - Bewerkbare Klantvoorkeuren (voor de 'Instellingen -> Mijn Digitaal Profiel' pagina in de KBC App!)
 */
window.KBCAura = window.KBCAura || {};

window.KBCAura.CustomersDatabase = [
  // =========================================================================
  // KLANT 1: LUKAS VERMEULEN (28, Gent) - Starter / Eerste Woning & Auto-Reiziger
  // =========================================================================
  {
    id: "cust-lukas-01",
    name: "Lukas Vermeulen",
    avatar: "👨‍💻",
    age: 28,
    city: "Gent",
    postalCode: "9000",
    address: "Kortrijksesteenweg 142, 9000 Gent",
    occupation: "Software Engineer bij TechGent NV",
    householdStatus: "Samenwonend",
    housingType: "Huurder (Op zoek naar koopwoning)",
    childrenCount: 0,
    carOwner: true,
    carDetails: "Volkswagen Golf 1.5 TSI (Nummerplaat: 1-VKB-892)",
    personaTagline: "Starter (28j) • Spaart voor eerste huis & reist met de wagen",

    accounts: {
      checkingIban: "BE68 7340 1928 3746",
      checkingName: "KBC-Plusrekening",
      checkingBalance: 2480.50,
      savingsIban: "BE91 7340 8821 0042",
      savingsName: "KBC-Spaarrekening",
      savingsBalance: 34200.00,
      creditCardNumber: "•••• 4829 (KBC Mastercard Gold)",
      creditCardLimit: 2500.00,
      creditCardSpent: 410.00,
      monthlyIncome: 3150.00,
      monthlyFixedCosts: 1380.00
    },

    activeInsurances: [
      { id: "ins-ba-auto", policyNumber: "POL-39-882104", status: "ACTIEF", monthlyCost: 42.50, detail: "VW Golf (1-VKB-892) • Wettelijke BA" },
      { id: "ins-woning-huurder", policyNumber: "POL-12-449102", status: "ACTIEF", monthlyCost: 16.50, detail: "Huurappartement Kortrijksesteenweg 142, Gent" }
    ],

    investments: [
      { id: "inv-wisselgeld", name: "KBC Wisselgeld Beleggen", value: 485.20, monthlyContribution: 22.00, returnPct: "+4,8%" }
    ],

    loans: [],

    telemetry: {
      mortgagePageViews: 4,
      mortgageSimulatorAbandons: 3,
      investmentTabViews: 5,
      investmentAbandons: 5,
      renovationLoanViews: 1,
      familyInsuranceViews: 0,
      panicTaps: 0,
      misclicksCount: 0,
      nightSessionAbroad: false,
      activeWeatherAlert: null,
      lastSearchedInApp: "hoeveel eigen inbreng nodig voor woonlening 320.000 euro"
    },

    inferredSignals: [
      {
        id: "sig-init-lukas-1",
        title: "Zoektocht naar Eerste Koopwoning",
        source: "Betaling Immoweb & Notaris + 4x bezoek aan Woonlening-simulator",
        confidence: 92,
        category: "LIFE_MILESTONE",
        userConfirmed: null
      },
      {
        id: "sig-init-lukas-2",
        title: "Hoge Stilstaande Spaarbuffer (€34.200) + Twijfel over Beleggen",
        source: "Spaarrekening > 8 maanden buffer + 5x gekeken naar Beleggen zonder actie",
        confidence: 88,
        category: "HESITATION_COACHING",
        userConfirmed: null
      },
      {
        id: "sig-init-lukas-3",
        title: "Frequente Autoritten zonder Pechverhelping-dekking",
        source: "Tankbeurten TotalEnergies / Q8 + 4411 Parkeren, maar géén KBC Pechverhelping actief",
        confidence: 85,
        category: "INSURANCE_GAP",
        userConfirmed: null
      }
    ],

    userPreferences: {
      manualLifeStageOverride: "AUTO",
      primaryGoal: "EERSTE_WONING",
      riskAppetite: "GEMIDDELD",
      desiredSavingsBufferMonths: 6,
      accessibilityLargeMode: false,
      communicationTone: "COACHEND_HELDER",
      privacySettings: {
        allowTransactionAnalysis: true,
        allowLocationEmergency: true,
        allowBehaviorCoaching: true,
        allowInsuranceGapAlerts: true
      }
    },

    transactions: [
      { id: "tx-101", date: "Gisteren, 17:40", merchant: "Immoweb NV - Premium Zoekertjes & Schattingsrapport", amount: -49.00, category: "Wonen & Vastgoed", mcc: "6513", location: "Online (België)", signalTag: "HOME_SEARCH" },
      { id: "tx-102", date: "28 sep, 14:15", merchant: "TotalEnergies Gent-Zuid E17", amount: -74.80, category: "Mobiliteit & Brandstof", mcc: "5541", location: "Gent, België", signalTag: "CAR_USAGE" },
      { id: "tx-103", date: "27 sep, 18:30", merchant: "Colruyt Gent Sint-Amandsberg", amount: -118.45, category: "Boodschappen", mcc: "5411", location: "Gent, België", signalTag: "GROCERIES" },
      { id: "tx-104", date: "25 sep, 09:00", merchant: "TechGent NV - Salaris September", amount: 3150.00, category: "Loon & Inkomen", mcc: "9999", location: "Overschrijving", signalTag: "SALARY" },
      { id: "tx-105", date: "24 sep, 11:20", merchant: "4411 Parkeren Stad Gent (Vrijdagmarkt)", amount: -8.60, category: "Mobiliteit", mcc: "7523", location: "Gent, België", signalTag: "CAR_USAGE" },
      { id: "tx-106", date: "22 sep, 16:00", merchant: "Immo Deilde Gent - Waarborg Bezoekdossier", amount: -150.00, category: "Wonen & Vastgoed", mcc: "6513", location: "Gent, België", signalTag: "HOME_SEARCH" },
      { id: "tx-107", date: "19 sep, 20:10", merchant: "Bol.com - Boek 'Slim een Huis Kopen in Vlaanderen'", amount: -29.99, category: "Wonen & Boeken", mcc: "5942", location: "Online", signalTag: "HOME_SEARCH" },
      { id: "tx-108", date: "15 sep, 08:15", merchant: "NMBS Treinticket Gent-Sint-Pieters <-> Brussel", amount: -19.60, category: "Mobiliteit", mcc: "4112", location: "KBC Mobile Ticket", signalTag: "PUBLIC_TRANSPORT" },
      { id: "tx-109", date: "10 sep, 12:00", merchant: "Telenet Internet & Mobiel Domiciliëring", amount: -78.50, category: "Vaste Lasten", mcc: "4814", location: "Domiciliëring", signalTag: "FIXED_COST" },
      { id: "tx-110", date: "05 sep, 07:00", merchant: "Luminus Voorschot Elektriciteit & Gas", amount: -135.00, category: "Vaste Lasten & Energie", mcc: "4900", location: "Domiciliëring", signalTag: "FIXED_COST" },
      { id: "tx-111", date: "01 sep, 06:00", merchant: "Huur Appartement Kortrijksesteenweg Gent", amount: -890.00, category: "Wonen & Huur", mcc: "6513", location: "Doorlopende opdracht", signalTag: "RENT" },
      { id: "tx-112", date: "01 sep, 06:05", merchant: "KBC Verzekeringen (BA Auto + Brand Huurder)", amount: -59.00, category: "Verzekeringen", mcc: "6300", location: "Domiciliëring KBC", signalTag: "INSURANCE_PREMIUM" }
    ]
  },

  // =========================================================================
  // KLANT 2: SARAH & TOM PEETERS (32, Antwerpen) - Jong Gezin & Verwachten Tweede Kindje
  // =========================================================================
  {
    id: "cust-sarah-02",
    name: "Sarah & Tom Peeters",
    avatar: "👩‍❤️‍👨",
    age: 32,
    city: "Antwerpen",
    postalCode: "2000",
    address: "Mechelsesteenweg 88, 2000 Antwerpen",
    occupation: "HR Manager & Architect",
    householdStatus: "Gehuwd (Gezin met 1 kind + baby op komst)",
    housingType: "Eigenaar (Rijwoning met KBC Woonlening)",
    childrenCount: 1,
    carOwner: true,
    carDetails: "Volvo XC40 Recharge (Nummerplaat: 2-ABC-411)",
    personaTagline: "Jong gezin (32j) • Koophuis in Antwerpen & baby op komst",

    accounts: {
      checkingIban: "BE42 7310 5542 9910",
      checkingName: "KBC-Gezinsrekening Plus",
      checkingBalance: 3890.20,
      savingsIban: "BE19 7310 9981 2201",
      savingsName: "KBC-Gezinsspaarrekening",
      savingsBalance: 18400.00,
      creditCardNumber: "•••• 9012 (KBC Visa Platinum)",
      creditCardLimit: 5000.00,
      creditCardSpent: 845.00,
      monthlyIncome: 5420.00,
      monthlyFixedCosts: 2690.00
    },

    activeInsurances: [
      { id: "ins-woning-eigenaar", policyNumber: "POL-88-102938", status: "ACTIEF", monthlyCost: 34.80, detail: "Rijwoning Mechelsesteenweg 88, 2000 Antwerpen" },
      { id: "ins-ba-auto", policyNumber: "POL-39-112094", status: "ACTIEF", monthlyCost: 42.50, detail: "Volvo XC40 (2-ABC-411)" },
      { id: "ins-omnium-auto", policyNumber: "POL-39-112095", status: "ACTIEF", monthlyCost: 68.00, detail: "Volledige Omnium Volvo XC40" },
      { id: "ins-schuldsaldo", policyNumber: "POL-77-501922", status: "ACTIEF", monthlyCost: 24.00, detail: "100% dekking op KBC Woonkrediet" }
    ],

    investments: [
      { id: "inv-beleggingsplan", name: "KBC-Beleggingsplan Dynamisch", value: 8420.00, monthlyContribution: 150.00, returnPct: "+7,2%" },
      { id: "inv-pensioensparen", name: "KBC Pensioensparen (Sarah & Tom)", value: 14200.00, monthlyContribution: 170.00, returnPct: "+5,9%" }
    ],

    loans: [
      { id: "loan-woon-01", name: "KBC Woonkrediet (Mechelsesteenweg 88)", remainingCapital: 248500.00, monthlyPayment: 1185.00, interestRate: "2,45%" }
    ],

    telemetry: {
      mortgagePageViews: 0,
      mortgageSimulatorAbandons: 0,
      investmentTabViews: 2,
      investmentAbandons: 0,
      renovationLoanViews: 2,
      familyInsuranceViews: 4,
      panicTaps: 0,
      misclicksCount: 0,
      nightSessionAbroad: false,
      activeWeatherAlert: null,
      lastSearchedInApp: "pasgeboren baby toevoegen aan hospitalisatie en familiale verzekering"
    },

    inferredSignals: [
      {
        id: "sig-init-sarah-1",
        title: "Gezinsuitbreiding: Baby-aankopen & Gynaecologie",
        source: "Herhaalde uitgaven bij Dreambaby, Apotheek & ZNA Middelheim Kraamafdeling",
        confidence: 95,
        category: "LIFE_MILESTONE",
        userConfirmed: null
      },
      {
        id: "sig-init-sarah-2",
        title: "Ontbrekende Familiale- & Hospitalisatieverzekering voor Gezin",
        source: "Gezin met kind(eren), maar nog géén KBC Gezinspolis (Familiale) of Hospitalisatie",
        confidence: 91,
        category: "INSURANCE_GAP",
        userConfirmed: null
      }
    ],

    userPreferences: {
      manualLifeStageOverride: "AUTO",
      primaryGoal: "GEZINSUITBREIDING",
      riskAppetite: "DYNAMISCH",
      desiredSavingsBufferMonths: 5,
      accessibilityLargeMode: false,
      communicationTone: "WARM_GEZINSGERICHT",
      privacySettings: {
        allowTransactionAnalysis: true,
        allowLocationEmergency: true,
        allowBehaviorCoaching: true,
        allowInsuranceGapAlerts: true
      }
    },

    transactions: [
      { id: "tx-201", date: "Gisteren, 15:10", merchant: "Dreambaby Antwerpen - Kinderwagen & Autostoel", amount: -689.00, category: "Gezin & Kinderen", mcc: "5641", location: "Antwerpen, België", signalTag: "NEW_BABY_ARRIVAL" },
      { id: "tx-202", date: "28 sep, 10:30", merchant: "ZNA Middelheim Ziekenhuis - Consultatie Gynaecologie", amount: -45.50, category: "Gezondheid", mcc: "8062", location: "Antwerpen, België", signalTag: "MEDICAL_MATERNITY" },
      { id: "tx-203", date: "26 sep, 14:00", merchant: "Kinderdagverblijf Het Kabouterbos - Waarborg", amount: -250.00, category: "Gezin & Kinderen", mcc: "8351", location: "Antwerpen, België", signalTag: "NEW_BABY_ARRIVAL" },
      { id: "tx-204", date: "25 sep, 09:00", merchant: "Gezamenlijk Salaris Sarah & Tom", amount: 5420.00, category: "Loon & Inkomen", mcc: "9999", location: "Overschrijving", signalTag: "SALARY" },
      { id: "tx-205", date: "22 sep, 17:45", merchant: "Delhaize Antwerpen Zuid", amount: -184.30, category: "Boodschappen", mcc: "5411", location: "Antwerpen, België", signalTag: "GROCERIES" },
      { id: "tx-206", date: "18 sep, 11:15", merchant: "Apotheek Multipharma - Zwangerschapsvitaminen & Zorg", amount: -62.40, category: "Gezondheid", mcc: "5912", location: "Antwerpen, België", signalTag: "MEDICAL_MATERNITY" },
      { id: "tx-207", date: "12 sep, 16:20", merchant: "Hema & Zara Kids Antwerpen Meir", amount: -94.50, category: "Gezin & Kleding", mcc: "5641", location: "Antwerpen, België", signalTag: "NEW_BABY_ARRIVAL" },
      { id: "tx-208", date: "08 sep, 09:00", merchant: "Fons Vlaams Groeipakket (1e Kind: Finn Peeters)", amount: 184.62, category: "Inkomen & Gezin", mcc: "9399", location: "Overschrijving", signalTag: "GROEIPAKKET" },
      { id: "tx-209", date: "01 sep, 06:00", merchant: "KBC Woonkrediet Maandelijkse Aflossing", amount: -1185.00, category: "Wonen & Lening", mcc: "6012", location: "Domiciliëring KBC", signalTag: "MORTGAGE" }
    ]
  },

  // =========================================================================
  // KLANT 3: MARIA JANSSENS (79, Leuven) - Senior / Toegankelijkheid & Comfort
  // =========================================================================
  {
    id: "cust-maria-03",
    name: "Maria Janssens",
    avatar: "👵",
    age: 79,
    city: "Leuven",
    postalCode: "3000",
    address: "Tiensevest 44 bus 2, 3000 Leuven",
    occupation: "Gepensioneerd Onderwijzeres",
    householdStatus: "Alleenstaand (Weduwe, 2 kleinkinderen)",
    housingType: "Eigenaar (Schuldenvrij appartement)",
    childrenCount: 2,
    carOwner: false,
    carDetails: "Geen wagen (Gebruikt De Lijn & NMBS)",
    personaTagline: "Senior (79j) • Vindt kleine knopjes lastig & wil veilig bankieren",

    accounts: {
      checkingIban: "BE84 7360 1120 4498",
      checkingName: "KBC-Basisrekening",
      checkingBalance: 1920.80,
      savingsIban: "BE22 7360 8840 1129",
      savingsName: "KBC-Spaarrekening",
      savingsBalance: 46800.00,
      creditCardNumber: "Geen kredietkaart (Enkel KBC Debetkaart)",
      creditCardLimit: 0,
      creditCardSpent: 0,
      monthlyIncome: 1980.00,
      monthlyFixedCosts: 810.00
    },

    activeInsurances: [
      { id: "ins-woning-eigenaar", policyNumber: "POL-11-002918", status: "ACTIEF", monthlyCost: 28.50, detail: "Appartement Tiensevest 44, Leuven" },
      { id: "ins-familiale", policyNumber: "POL-55-991023", status: "ACTIEF", monthlyCost: 8.20, detail: "KBC Gezinspolis Alleenstaande" },
      { id: "ins-hospitalisatie", policyNumber: "POL-66-771209", status: "ACTIEF", monthlyCost: 48.00, detail: "KBC Hospitalisatie Senior Comfort" }
    ],

    investments: [],
    loans: [],

    telemetry: {
      mortgagePageViews: 0,
      mortgageSimulatorAbandons: 0,
      investmentTabViews: 0,
      investmentAbandons: 0,
      renovationLoanViews: 0,
      familyInsuranceViews: 0,
      panicTaps: 2,
      misclicksCount: 8,
      fontSizeZoomAttempts: 5,
      transferScreenDurationSec: 265,
      nightSessionAbroad: false,
      activeWeatherAlert: null,
      lastSearchedInApp: "hoe schrijf ik geld over naar kleinkind"
    },

    inferredSignals: [
      {
        id: "sig-init-maria-1",
        title: "Moeite met Kleine Knopjes & Lange Zoektijd bij Overschrijven",
        source: "App-gedrag: 8x mis-getikt naast kleine iconen + 4,5 min op overschrijvingsscherm",
        confidence: 96,
        category: "ACCESSIBILITY_ASSIST",
        userConfirmed: null
      },
      {
        id: "sig-init-maria-2",
        title: "Regelmatige Schenkingen aan Kleinkinderen (Verjaardag & Studie)",
        source: "Terugkerende overschrijvingen naar 'Kleindochter Lotte' en 'Kleinzoon Noah'",
        confidence: 90,
        category: "LIFE_MILESTONE",
        userConfirmed: null
      }
    ],

    userPreferences: {
      manualLifeStageOverride: "AUTO",
      primaryGoal: "EENVOUD_EN_VEILIGHEID",
      riskAppetite: "ZEER_DEFENSIEF",
      desiredSavingsBufferMonths: 12,
      accessibilityLargeMode: true,
      communicationTone: "RUSTIG_GROTE_LETTERS",
      privacySettings: {
        allowTransactionAnalysis: true,
        allowLocationEmergency: true,
        allowBehaviorCoaching: true,
        allowInsuranceGapAlerts: true
      }
    },

    transactions: [
      { id: "tx-301", date: "Gisteren, 10:15", merchant: "Apotheek De Voorzorg Leuven", amount: -34.20, category: "Gezondheid & Apotheek", mcc: "5912", location: "Leuven, België", signalTag: "PHARMACY" },
      { id: "tx-302", date: "27 sep, 14:30", merchant: "Overschrijving naar Kleindochter Lotte (Verjaardag)", amount: -100.00, category: "Gezin & Schenking", mcc: "9999", location: "KBC Mobile", signalTag: "GRANDCHILD_GIFT" },
      { id: "tx-303", date: "24 sep, 08:30", merchant: "Federale Pensioendienst - Rustpensioen", amount: 1980.00, category: "Pensioen & Inkomen", mcc: "9999", location: "Overschrijving", signalTag: "PENSION" },
      { id: "tx-304", date: "21 sep, 11:00", merchant: "Bakkerij & Spar Supermarkt Leuven", amount: -64.10, category: "Boodschappen", mcc: "5411", location: "Leuven, België", signalTag: "GROCERIES" },
      { id: "tx-305", date: "16 sep, 09:45", merchant: "UZ Leuven Gasthuisberg - Jaarlijkse Controle", amount: -28.00, category: "Gezondheid", mcc: "8062", location: "Leuven, België", signalTag: "MEDICAL" },
      { id: "tx-306", date: "10 sep, 14:00", merchant: "De Lijn Lijnwinkel Leuven", amount: -15.00, category: "Mobiliteit", mcc: "4111", location: "Leuven, België", signalTag: "PUBLIC_TRANSPORT" }
    ]
  },

  // =========================================================================
  // KLANT 4: KARIM EL AMRANI (24, Brussel) - Jonge Starter met Einde-Maand Stress
  // =========================================================================
  {
    id: "cust-karim-04",
    name: "Karim El Amrani",
    avatar: "🧑‍🎨",
    age: 24,
    city: "Brussel",
    postalCode: "1000",
    address: "Anspachlaan 62, 1000 Brussel",
    occupation: "Junior Grafisch Ontwerper",
    householdStatus: "Alleenstaand",
    housingType: "Huurstudio in Brussel",
    childrenCount: 0,
    carOwner: false,
    carDetails: "Geen wagen (Gebruikt NMBS, MIVB & Deelsteps)",
    personaTagline: "Jonge starter (24j) • Hoge vaste lasten & krap bij kas eind van de maand",

    accounts: {
      checkingIban: "BE55 7320 4019 8832",
      checkingName: "KBC-Basisrekening",
      checkingBalance: 142.30,
      savingsIban: "BE09 7320 1190 3384",
      savingsName: "KBC-Spaarrekening",
      savingsBalance: 650.00,
      creditCardNumber: "•••• 3319 (KBC Prepaid Card)",
      creditCardLimit: 500.00,
      creditCardSpent: 390.00,
      monthlyIncome: 2050.00,
      monthlyFixedCosts: 1590.00
    },

    activeInsurances: [
      { id: "ins-woning-huurder", policyNumber: "POL-14-882011", status: "ACTIEF", monthlyCost: 14.50, detail: "Huurstudio Anspachlaan 62, Brussel" }
    ],

    investments: [],
    loans: [],

    telemetry: {
      mortgagePageViews: 0,
      mortgageSimulatorAbandons: 0,
      investmentTabViews: 1,
      investmentAbandons: 1,
      renovationLoanViews: 0,
      familyInsuranceViews: 0,
      panicTaps: 3,
      balanceChecksToday: 8,
      misclicksCount: 0,
      nightSessionAbroad: false,
      activeWeatherAlert: null,
      lastSearchedInApp: "wanneer wordt huur afgeschreven als saldo te laag is"
    },

    inferredSignals: [
      {
        id: "sig-init-karim-1",
        title: "Einde-Maand Cashflow Spanning (€142 saldo vóór huurdomiciliëring)",
        source: "Zichtrekening €142,30 + 8x saldo gecheckt vandaag + huur (€820) volgt op de 1e",
        confidence: 95,
        category: "CRISIS_CARE",
        userConfirmed: null
      },
      {
        id: "sig-init-karim-2",
        title: "Veel Losse Abonnementen & Hoge Energie-afschrijving",
        source: "5 streaming/app-abonnementen (€74/mnd) + stijgende energievoorschotten",
        confidence: 89,
        category: "HESITATION_COACHING",
        userConfirmed: null
      }
    ],

    userPreferences: {
      manualLifeStageOverride: "AUTO",
      primaryGoal: "BUDGET_EN_SPAARBUFFER",
      riskAppetite: "DEFENSIEF",
      desiredSavingsBufferMonths: 3,
      accessibilityLargeMode: false,
      communicationTone: "COACHEND_HELDER",
      privacySettings: {
        allowTransactionAnalysis: true,
        allowLocationEmergency: true,
        allowBehaviorCoaching: true,
        allowInsuranceGapAlerts: true
      }
    },

    transactions: [
      { id: "tx-401", date: "Vandaag, 09:10", merchant: "Engie Electrabel - Verhoogd Maandvoorschot", amount: -195.00, category: "Vaste Lasten & Energie", mcc: "4900", location: "Domiciliëring", signalTag: "CASHFLOW_SQUEEZE" },
      { id: "tx-402", date: "Gisteren, 21:00", merchant: "Uber Eats & Takeaway.com Brussel", amount: -34.50, category: "Horeca & Bezorging", mcc: "5812", location: "Brussel, België", signalTag: "LIFESTYLE" },
      { id: "tx-403", date: "28 sep, 08:20", merchant: "NMBS / MIVB Maandabonnement", amount: -59.00, category: "Mobiliteit", mcc: "4112", location: "KBC Mobile Ticket", signalTag: "PUBLIC_TRANSPORT" },
      { id: "tx-404", date: "26 sep, 04:00", merchant: "Netflix + Spotify + PlayStation Plus + Adobe", amount: -74.90, category: "Abonnementen", mcc: "4899", location: "Kaartbetaling", signalTag: "SUBSCRIPTIONS" },
      { id: "tx-405", date: "24 sep, 18:10", merchant: "Albert Heijn Brussel Centrum", amount: -68.20, category: "Boodschappen", mcc: "5411", location: "Brussel, België", signalTag: "GROCERIES" },
      { id: "tx-406", date: "01 sep, 06:00", merchant: "Huur Studio Anspachlaan 62 Brussel", amount: -820.00, category: "Wonen & Huur", mcc: "6513", location: "Doorlopende opdracht", signalTag: "RENT" }
    ]
  }
];
