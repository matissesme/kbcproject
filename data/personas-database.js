/**
 * KBC KOMPAS - UITGEBREIDE PERSONA DATABASE & LIVE EVENTS CATALOGUS
 * Bevat:
 * 1. De 3 kern-persona's van Jasper + 1 Senior Comfort persona:
 *    - Persona 1: Lisa Peeters (21j, Student / Starter) -> Doel: Op Kot & Eerste Auto
 *    - Persona 2: Lukas & Emma Vermeulen (28j, Koppel in Koppelmodus!) -> Doel: Eigen Woning + Grote Reis
 *    - Persona 3: Thomas Vandenberghe (37j, Gezinsvader) -> Doel: Gezin Starten / Baby + Pensioen
 *    - Persona 4: Maria Janssens (79j, Senior) -> Doel: Pensioenbuffer & Comfort-modus
 * 2. Voor elke persona: 12 MAANDEN aan maandelijkse inkomens- en uitgaven-overzichten én tientallen
 *    gedetailleerde Belgische transacties, lopende verzekeringen, gekozen Kompas-doelen en plan_events.
 * 3. De Live Events Catalogus (Verrassings-uitgave, Nieuwe job, Inkomenswijziging, Energie-schok, Autopech, Baby, etc.)
 */
window.KBCAura = window.KBCAura || {};

window.KBCAura.PlanEventsCatalog = [
  {
    id: "evt-verrassing-uitgave",
    title: "💥 Verrassings-uitgave (-€1.450 Spoedreparatie & Factuur)",
    shortLabel: "Verrassings-uitgave (-€1.450)",
    type: "SURPRISE_EXPENSE",
    icon: "💥",
    badgeColor: "#dc2626",
    description: "Onverwachte grote kostenpost (kapotte verwarmingsketel / autoreparatie) verlaagt je spaarbuffer én verhoogt je gemiddelde maanduitgaven.",
    effect: {
      savingsDelta: -1450,
      checkingDelta: -350,
      monthlyExpensesDelta: 210,
      transaction: {
        date: "Vandaag, 14:10",
        merchant: "Spoedherstelling Verwarming & Garage Factuur",
        amount: -1450.00,
        category: "Onvoorziene Uitgave",
        mcc: "7538",
        location: "België"
      }
    }
  },
  {
    id: "evt-inkomens-daling",
    title: "📉 Inkomenswijziging: Deeltijds / Tijdelijk Minder Inkomen (-€420/mnd)",
    shortLabel: "Inkomen daalt (-€420/mnd)",
    type: "INCOME_DROP",
    icon: "📉",
    badgeColor: "#f59e0b",
    description: "Klant gaat 4/5e werken of verliest bijbaan: het gemiddelde maandinkomen daalt met €420/mnd waardoor de Kompas-koers onder druk komt.",
    effect: {
      savingsDelta: 0,
      checkingDelta: 0,
      monthlyIncomeDelta: -420,
      transaction: {
        date: "Vandaag, 09:00",
        merchant: "Aanpassing Loonstrook (Wijziging Werkregime 80%)",
        amount: -420.00,
        category: "Inkomenswijziging",
        mcc: "9999",
        location: "Werkgever"
      }
    }
  },
  {
    id: "evt-nieuwe-job",
    title: "🚀 Nieuwe Job / Promotie (+€480/mnd netto + €1.200 tekenbonus)",
    shortLabel: "Nieuwe Job (+€480/mnd)",
    type: "NEW_JOB_PROMOTION",
    icon: "🚀",
    badgeColor: "#10b981",
    description: "Klant krijgt promotie of nieuwe baan: maandelijkse spaarcapaciteit stijgt met €480/mnd en er komt €1.200 extra op de spaarrekening.",
    effect: {
      savingsDelta: 1200,
      checkingDelta: 480,
      monthlyIncomeDelta: 480,
      transaction: {
        date: "Vandaag, 08:30",
        merchant: "Nieuwe Werkgever NV - Eerste Verhoogd Loon + Bonus",
        amount: 1680.00,
        category: "Loon & Inkomen",
        mcc: "9999",
        location: "Overschrijving"
      }
    }
  },
  {
    id: "evt-huur-energie-stijging",
    title: "⚡ Stijging Vaste Lasten: Indexatie Huur & Energie (+€240/mnd)",
    shortLabel: "Vaste Lasten +€240/mnd",
    type: "FIXED_COST_RISE",
    icon: "⚡",
    badgeColor: "#ea580c",
    description: "Huurindexatie en hoger energievoorschot verhogen de maandelijkse uitgaven structureel met €240/maand.",
    effect: {
      savingsDelta: 0,
      checkingDelta: -240,
      monthlyExpensesDelta: 240,
      transaction: {
        date: "Vandaag, 07:15",
        merchant: "Luminus & Huurindexatie - Nieuw Maandbedrag",
        amount: -240.00,
        category: "Vaste Lasten & Energie",
        mcc: "4900",
        location: "Domiciliëring"
      }
    }
  },
  {
    id: "evt-autopech-reis",
    title: "🚨 Autopech in Zuid-Frankrijk (-€280 Sleepdienst A7)",
    shortLabel: "Autopech Frankrijk (-€280)",
    type: "ROADSIDE_EMERGENCY",
    icon: "🚨",
    badgeColor: "#e11d48",
    description: "Onverwachte sleepkosten op de Franse snelweg. KBC Kompas detecteert ontbrekende KBC Pechverhelping én past reisbuffer aan.",
    effect: {
      savingsDelta: 0,
      checkingDelta: -280,
      monthlyExpensesDelta: 95,
      emergencyFlag: "ROADSIDE_ABROAD",
      transaction: {
        date: "Vandaag, 23:40",
        merchant: "Dépannage Autoroute A7 Orange (FR)",
        amount: -280.00,
        category: "Mobiliteit & Nood",
        mcc: "7549",
        location: "Orange, Frankrijk"
      }
    }
  },
  {
    id: "evt-baby-dreambaby",
    title: "👶 Gezinsuitbreiding: Dreambaby & Waarborg Crèche (-€675)",
    shortLabel: "Baby-uitgaven (-€675)",
    type: "FAMILY_EVENT",
    icon: "👶",
    badgeColor: "#8b5cf6",
    description: "Uitgaven bij Dreambaby en kinderdagverblijf. KBC Kompas stelt voor om Gezinsbescherming (Familiale + Hospitalisatie) te koppelen.",
    effect: {
      savingsDelta: -400,
      checkingDelta: -275,
      monthlyExpensesDelta: 150,
      familyFlag: true,
      transaction: {
        date: "Vandaag, 11:20",
        merchant: "Dreambaby Geboortelijst & Crèche De Kleine Ster",
        amount: -675.00,
        category: "Gezin & Kinderen",
        mcc: "5641",
        location: "Antwerpen, België"
      }
    }
  }
];

window.KBCAura.PersonasDatabase = [
  // =========================================================================
  // PERSONA 1: LISA PEETERS (21j, Leuven) - Student / Starter (Op Kot & Eerste Auto)
  // =========================================================================
  {
    id: "klant-lisa-01",
    name: "Lisa Peeters",
    avatar: "👩‍🎓",
    age: 21,
    city: "Leuven",
    postalCode: "3000",
    address: "Naamsestraat 118 bus 4, 3000 Leuven",
    occupation: "Masterstudent & Werkstudent (Weekendjob + Stagevergoeding)",
    situation: "Student / Starter (Alleenstaand)",
    isCoupleMode: false,
    partnerName: "",
    childrenCount: 0,
    carOwner: false,
    personaBadge: "Persona 1: Lisa (21j) • Doel: Op Kot & Eerste Auto",

    accounts: {
      checkingIban: "BE68 7340 1102 9981",
      checkingName: "KBC-Jongerenrekening",
      checkingBalance: 1140.50,
      savingsIban: "BE91 7340 8821 4410",
      savingsName: "KBC-Spaarrekening (Kot & Auto)",
      savingsBalance: 3600.00,
      jointIban: null,
      jointBalance: 0,
      creditCardNumber: "•••• 1104 (KBC Prepaid Mastercard)",
      creditCardLimit: 750.00,
      creditCardSpent: 185.00
    },

    // Laatste 3 maanden voor de Kompas-formule + 12 maanden historiek
    monthlyHistory12m: [
      { month: "Okt 2025", income: 1280, expenses: 960 },
      { month: "Nov 2025", income: 1310, expenses: 990 },
      { month: "Dec 2025", income: 1450, expenses: 1120 },
      { month: "Jan 2026", income: 1220, expenses: 910 },
      { month: "Feb 2026", income: 1290, expenses: 940 },
      { month: "Mrt 2026", income: 1340, expenses: 980 },
      { month: "Apr 2026", income: 1320, expenses: 995 },
      { month: "Mei 2026", income: 1360, expenses: 1010 },
      { month: "Jun 2026", income: 1290, expenses: 970 },
      { month: "Jul 2026", income: 1620, expenses: 1150 },
      { month: "Aug 2026", income: 1580, expenses: 1180 },
      { month: "Sep 2026", income: 1360, expenses: 1030 }
    ],

    // Gemiddelde laatste 3 maanden: inkomen = 1520, uitgaven = 1120 -> spaarcapaciteit = 400 €/mnd
    avgMonthlyIncome3m: 1520.00,
    avgMonthlyExpenses3m: 1120.00,

    activeGoalId: "goal-lisa-kot",
    goals: [
      {
        id: "goal-lisa-kot",
        type: "kot",
        title: "Op Kot in Leuven (Masterjaar)",
        targetAmount: 7200.00,
        savedAmount: 3600.00,
        monthsToDeadline: 10,
        createdAt: "2026-06-01",
        notes: "Waarborg + 10 maanden kothuur Naamsestraat + studiemateriaal"
      },
      {
        id: "goal-lisa-auto",
        type: "auto",
        title: "Eerste Tweedehands Auto na Afstuderen",
        targetAmount: 9500.00,
        savedAmount: 1800.00,
        monthsToDeadline: 24,
        createdAt: "2026-08-15",
        notes: "Compacte stadswagen voor eerste job"
      }
    ],

    activeInsurances: [
      { id: "ins-familiale", policyNumber: "POL-19-44012", status: "ACTIEF", monthlyCost: 8.20, detail: "Meegedekt via gezinspolis ouders" }
    ],

    investments: [
      { id: "inv-wisselgeld", name: "KBC Wisselgeld Beleggen", value: 310.40, monthlyContribution: 15.00, returnPct: "+4,2%" }
    ],

    loans: [],

    planEvents: [
      { id: "pe-1", date: "15 aug 2026", type: "START_PLAN", label: "KBC Kompas gestart voor 'Op Kot in Leuven' (€7.200 doel)" },
      { id: "pe-2", date: "02 sep 2026", type: "SPAREN", label: "Automatische spaaropdracht +€360/mnd uitgevoerd" }
    ],

    userPreferences: {
      riskAppetite: "DEFENSIEF",
      desiredSavingsBufferMonths: 3,
      accessibilityLargeMode: false,
      communicationTone: "COACHEND_HELDER",
      privacySettings: {
        allowTransactionAnalysis: true,
        allowIncomeTracking: true,
        allowProductMatching: true,
        allowAdvisorSharing: true
      }
    },

    transactions: [
      { id: "tx-l1", date: "Gisteren, 16:45", merchant: "Standaard Boekhandel Leuven (Studieboeken)", amount: -142.50, category: "Studie & Kot", mcc: "5942", location: "Leuven" },
      { id: "tx-l2", date: "28 sep, 12:20", merchant: "Alma Studentenrestaurant KU Leuven", amount: -14.80, category: "Horeca & Campus", mcc: "5812", location: "Leuven" },
      { id: "tx-l3", date: "25 sep, 09:00", merchant: "Stagevergoeding & Weekendjob Horeca Leuven", amount: 1360.00, category: "Loon & Inkomen", mcc: "9999", location: "Overschrijving" },
      { id: "tx-l4", date: "22 sep, 18:10", merchant: "Colruyt Heverlee (Kookbeurt Kot)", amount: -58.90, category: "Boodschappen", mcc: "5411", location: "Leuven" },
      { id: "tx-l5", date: "18 sep, 08:15", merchant: "NMBS Student Multi (10 ritten Leuven-Antwerpen)", amount: -19.60, category: "Mobiliteit", mcc: "4112", location: "KBC Mobile Ticket" },
      { id: "tx-l6", date: "12 sep, 15:30", merchant: "IKEA Zaventem (Bureau & Bureaustoel Kot)", amount: -189.00, category: "Wonen & Kot", mcc: "5712", location: "Zaventem" },
      { id: "tx-l7", date: "05 sep, 07:00", merchant: "Mobile Vikings Unlimited Student", amount: -20.00, category: "Vaste Lasten", mcc: "4814", location: "Domiciliëring" },
      { id: "tx-l8", date: "01 sep, 06:00", merchant: "Kothuur Naamsestraat 118 Leuven", amount: -540.00, category: "Wonen & Huur", mcc: "6513", location: "Doorlopende opdracht" }
    ]
  },

  // =========================================================================
  // PERSONA 2: KOPPEL LUKAS & EMMA VERMEULEN (28j, Gent) - Koppelmodus! (Eigen Woning & Reis)
  // =========================================================================
  {
    id: "klant-koppel-02",
    name: "Lukas & Emma Vermeulen",
    avatar: "👩‍❤️‍👨",
    age: 28,
    city: "Gent",
    postalCode: "9000",
    address: "Kortrijksesteenweg 142, 9000 Gent",
    occupation: "Software Engineer & Verpleegkundige",
    situation: "Samenwonend Koppel (Huurappartement, zoeken eerste koophuis)",
    isCoupleMode: true,
    partnerName: "Emma De Smet",
    childrenCount: 0,
    carOwner: true,
    personaBadge: "Persona 2: Koppel Lukas & Emma (28j) • Doel: Eigen Woning (Koppelmodus)",

    accounts: {
      checkingIban: "BE68 7340 1928 3746",
      checkingName: "KBC-Plusrekening (Lukas)",
      checkingBalance: 2480.50,
      savingsIban: "BE91 7340 8821 0042",
      savingsName: "KBC-Woonspaarrekening Samen",
      savingsBalance: 31500.00,
      jointIban: "BE44 7340 5001 8820",
      jointBalance: 1890.00,
      creditCardNumber: "•••• 4829 (KBC Mastercard Gold)",
      creditCardLimit: 3500.00,
      creditCardSpent: 410.00
    },

    monthlyHistory12m: [
      { month: "Okt 2025", income: 4850, expenses: 3820 },
      { month: "Nov 2025", income: 4850, expenses: 3890 },
      { month: "Dec 2025", income: 5400, expenses: 4210 },
      { month: "Jan 2026", income: 4920, expenses: 3790 },
      { month: "Feb 2026", income: 4920, expenses: 3850 },
      { month: "Mrt 2026", income: 4920, expenses: 3910 },
      { month: "Apr 2026", income: 4980, expenses: 3880 },
      { month: "Mei 2026", income: 5600, expenses: 4120 },
      { month: "Jun 2026", income: 4980, expenses: 3950 },
      { month: "Jul 2026", income: 4980, expenses: 4080 },
      { month: "Aug 2026", income: 4980, expenses: 4020 },
      { month: "Sep 2026", income: 4980, expenses: 3990 }
    ],

    // Gemiddelde laatste 3 mnd: inkomen = 4980, uitgaven = 4030 -> spaarcapaciteit = 950 €/mnd
    // Doel woning: 45.000, gespaard: 31.500 -> nog 13.500 nodig in 15 maanden = 900 €/mnd nodig -> ratio = 1.06 (OP KOERS!)
    avgMonthlyIncome3m: 4980.00,
    avgMonthlyExpenses3m: 4030.00,

    activeGoalId: "goal-koppel-woning",
    goals: [
      {
        id: "goal-koppel-woning",
        type: "woning",
        title: "Eerste Koopwoning in Gent (Eigen Inbreng & Kosten)",
        targetAmount: 45000.00,
        savedAmount: 31500.00,
        monthsToDeadline: 15,
        createdAt: "2026-01-10",
        notes: "Eigen inbreng + notariskosten voor rijwoning met tuin rond Gent (€330.000)"
      },
      {
        id: "goal-koppel-reis",
        type: "reis",
        title: "Autovakantie Zuid-Frankrijk & Italië",
        targetAmount: 3600.00,
        savedAmount: 2400.00,
        monthsToDeadline: 6,
        createdAt: "2026-05-01",
        notes: "Roadtrip langs Côte d'Azur en Toscane met eigen wagen"
      }
    ],

    activeInsurances: [
      { id: "ins-ba-auto", policyNumber: "POL-39-882104", status: "ACTIEF", monthlyCost: 42.50, detail: "VW Golf (1-VKB-892) • Wettelijke BA" },
      { id: "ins-woning-huurder", policyNumber: "POL-12-449102", status: "ACTIEF", monthlyCost: 16.50, detail: "Huurappartement Kortrijksesteenweg 142, Gent" }
    ],

    investments: [
      { id: "inv-wisselgeld", name: "KBC Wisselgeld Beleggen", value: 685.20, monthlyContribution: 30.00, returnPct: "+5,1%" },
      { id: "inv-beleggingsplan", name: "KBC-Beleggingsplan Defensief", value: 4200.00, monthlyContribution: 100.00, returnPct: "+4,6%" }
    ],

    loans: [],

    planEvents: [
      { id: "pe-k1", date: "10 jan 2026", type: "START_PLAN", label: "Koppel-Kompas gestart: 'Eerste Koopwoning Gent' (€45.000)" },
      { id: "pe-k2", date: "22 sep 2026", type: "SIGNAL", label: "Signaal herkend: Waarborg bezoekdossier Immo Deilde (€150)" }
    ],

    userPreferences: {
      riskAppetite: "GEMIDDELD",
      desiredSavingsBufferMonths: 6,
      accessibilityLargeMode: false,
      communicationTone: "COACHEND_HELDER",
      privacySettings: {
        allowTransactionAnalysis: true,
        allowIncomeTracking: true,
        allowProductMatching: true,
        allowAdvisorSharing: true
      }
    },

    transactions: [
      { id: "tx-k1", date: "Gisteren, 17:40", merchant: "Immoweb NV - Schattingsrapport & Zoekertjes", amount: -49.00, category: "Wonen & Vastgoed", mcc: "6513", location: "Gent" },
      { id: "tx-k2", date: "28 sep, 14:15", merchant: "TotalEnergies Gent-Zuid E17", amount: -74.80, category: "Mobiliteit & Brandstof", mcc: "5541", location: "Gent" },
      { id: "tx-k3", date: "27 sep, 18:30", merchant: "Colruyt Sint-Amandsberg (Weekboodschappen)", amount: -164.45, category: "Boodschappen", mcc: "5411", location: "Gent" },
      { id: "tx-k4", date: "25 sep, 09:00", merchant: "Salaris Lukas (TechGent NV) + Emma (UZ Gent)", amount: 4980.00, category: "Loon & Inkomen", mcc: "9999", location: "Overschrijving" },
      { id: "tx-k5", date: "22 sep, 16:00", merchant: "Immo Deilde Gent - Dossierkosten Bezoekdag", amount: -150.00, category: "Wonen & Vastgoed", mcc: "6513", location: "Gent" },
      { id: "tx-k6", date: "19 sep, 11:20", merchant: "4411 Parkeren Stad Gent (Vrijdagmarkt)", amount: -9.80, category: "Mobiliteit", mcc: "7523", location: "Gent" },
      { id: "tx-k7", date: "10 sep, 12:00", merchant: "Telenet All-Internet & 2x Mobiel", amount: -108.50, category: "Vaste Lasten", mcc: "4814", location: "Domiciliëring" },
      { id: "tx-k8", date: "05 sep, 07:00", merchant: "Luminus Voorschot Elektriciteit & Gas", amount: -165.00, category: "Vaste Lasten & Energie", mcc: "4900", location: "Domiciliëring" },
      { id: "tx-k9", date: "01 sep, 06:00", merchant: "Huur Appartement Kortrijksesteenweg Gent", amount: -980.00, category: "Wonen & Huur", mcc: "6513", location: "Doorlopende opdracht" }
    ]
  },

  // =========================================================================
  // PERSONA 3: GEZINSVADER THOMAS VANDENBERGHE (37j, Antwerpen) - Gezin & Pensioen (BIJSTUREN NODIG!)
  // =========================================================================
  {
    id: "klant-thomas-03",
    name: "Thomas Vandenberghe",
    avatar: "👨‍👧‍👦",
    age: 37,
    city: "Antwerpen",
    postalCode: "2000",
    address: "Mechelsesteenweg 88, 2000 Antwerpen",
    occupation: "Projectleider Bouw & Logistiek",
    situation: "Gezinsvader (Gehuwd, 2 kinderen + baby/gezinsuitbreiding)",
    isCoupleMode: true,
    partnerName: "Sofie Vandenberghe",
    childrenCount: 2,
    carOwner: true,
    personaBadge: "Persona 3: Gezinsvader Thomas (37j) • Doel: Gezin & Pensioen (Bijsturen)",

    accounts: {
      checkingIban: "BE42 7310 5542 9910",
      checkingName: "KBC-Gezinsrekening Plus",
      checkingBalance: 2140.20,
      savingsIban: "BE19 7310 9981 2201",
      savingsName: "KBC-Gezinsspaarrekening",
      savingsBalance: 4100.00,
      jointIban: "BE88 7310 2200 1190",
      jointBalance: 940.00,
      creditCardNumber: "•••• 9012 (KBC Visa Classic)",
      creditCardLimit: 4000.00,
      creditCardSpent: 920.00
    },

    monthlyHistory12m: [
      { month: "Okt 2025", income: 4650, expenses: 4120 },
      { month: "Nov 2025", income: 4650, expenses: 4190 },
      { month: "Dec 2025", income: 5100, expenses: 4680 },
      { month: "Jan 2026", income: 4720, expenses: 4210 },
      { month: "Feb 2026", income: 4720, expenses: 4290 },
      { month: "Mrt 2026", income: 4720, expenses: 4310 },
      { month: "Apr 2026", income: 4720, expenses: 4350 },
      { month: "Mei 2026", income: 4720, expenses: 4380 },
      { month: "Jun 2026", income: 4720, expenses: 4390 },
      { month: "Jul 2026", income: 4750, expenses: 4460 },
      { month: "Aug 2026", income: 4750, expenses: 4490 },
      { month: "Sep 2026", income: 4750, expenses: 4460 }
    ],

    // Gemiddelde laatste 3 mnd: inkomen = 4750, uitgaven = 4470 -> spaarcapaciteit = 280 €/mnd
    // Doel Gezin/Baby: 6.500, gespaard: 4.100 -> nog 2.400 nodig in 7 maanden = 342.85 €/mnd nodig -> ratio = 280 / 342.85 = 0.82 (BIJSTUREN!)
    avgMonthlyIncome3m: 4750.00,
    avgMonthlyExpenses3m: 4470.00,

    activeGoalId: "goal-thomas-gezin",
    goals: [
      {
        id: "goal-thomas-gezin",
        type: "gezin",
        title: "Gezinsuitbreiding & Babybuffer (Ouderschapsverlof + Crèche)",
        targetAmount: 6500.00,
        savedAmount: 4100.00,
        monthsToDeadline: 7,
        createdAt: "2026-04-01",
        notes: "Babykamer, waarborg kinderdagverblijf en buffer voor 3 maanden ouderschapsverlof"
      },
      {
        id: "goal-thomas-pensioen",
        type: "pensioen",
        title: "Extra Pensioenbuffer & Studiekapitaal Kinderen",
        targetAmount: 25000.00,
        savedAmount: 11200.00,
        monthsToDeadline: 60,
        createdAt: "2025-01-01",
        notes: "KBC Pensioensparen + Beleggingsplan voor later"
      }
    ],

    activeInsurances: [
      { id: "ins-woning-eigenaar", policyNumber: "POL-88-102938", status: "ACTIEF", monthlyCost: 34.80, detail: "Rijwoning Mechelsesteenweg 88, Antwerpen" },
      { id: "ins-ba-auto", policyNumber: "POL-39-112094", status: "ACTIEF", monthlyCost: 42.50, detail: "Gezinswagen Volvo XC40 (2-ABC-411)" },
      { id: "ins-schuldsaldo", policyNumber: "POL-77-501922", status: "ACTIEF", monthlyCost: 24.00, detail: "100% dekking op KBC Woonkrediet" }
    ],

    investments: [
      { id: "inv-pensioensparen", name: "KBC Pensioensparen", value: 11200.00, monthlyContribution: 85.00, returnPct: "+5,8%" }
    ],

    loans: [
      { id: "loan-woon-01", name: "KBC Woonkrediet (Mechelsesteenweg 88)", remainingCapital: 218500.00, monthlyPayment: 1145.00, interestRate: "2,35%" }
    ],

    planEvents: [
      { id: "pe-t1", date: "01 apr 2026", type: "START_PLAN", label: "KBC Kompas gestart: 'Gezinsuitbreiding & Babybuffer' (€6.500)" },
      { id: "pe-t2", date: "18 sep 2026", type: "ALERT", label: "Koers-signaal: Hogere gezinsuitgaven verlagen spaarcapaciteit naar €280/mnd (Ratio 0,82 -> Bijsturen)" }
    ],

    userPreferences: {
      riskAppetite: "GEMIDDELD",
      desiredSavingsBufferMonths: 4,
      accessibilityLargeMode: false,
      communicationTone: "WARM_GEZINSGERICHT",
      privacySettings: {
        allowTransactionAnalysis: true,
        allowIncomeTracking: true,
        allowProductMatching: true,
        allowAdvisorSharing: true
      }
    },

    transactions: [
      { id: "tx-t1", date: "Gisteren, 15:10", merchant: "Dreambaby Antwerpen - Kinderwagen & Autostoel", amount: -489.00, category: "Gezin & Kinderen", mcc: "5641", location: "Antwerpen" },
      { id: "tx-t2", date: "28 sep, 10:30", merchant: "ZNA Middelheim Ziekenhuis - Consultatie Gynaecologie", amount: -45.50, category: "Gezondheid", mcc: "8062", location: "Antwerpen" },
      { id: "tx-t3", date: "26 sep, 14:00", merchant: "Kinderdagverblijf Het Kabouterbos - Waarborg", amount: -250.00, category: "Gezin & Kinderen", mcc: "8351", location: "Antwerpen" },
      { id: "tx-t4", date: "25 sep, 09:00", merchant: "Salaris Thomas & Sofie + Vlaams Groeipakket", amount: 4750.00, category: "Loon & Inkomen", mcc: "9999", location: "Overschrijving" },
      { id: "tx-t5", date: "22 sep, 17:45", merchant: "Delhaize & Colruyt Antwerpen (Gezinsboodschappen)", amount: -248.30, category: "Boodschappen", mcc: "5411", location: "Antwerpen" },
      { id: "tx-t6", date: "14 sep, 09:20", merchant: "Brico Plan-It Antwerpen (Verf & Babykamer)", amount: -178.90, category: "Wonen & Renovatie", mcc: "5211", location: "Antwerpen" },
      { id: "tx-t7", date: "01 sep, 06:00", merchant: "KBC Woonkrediet Maandelijkse Aflossing", amount: -1145.00, category: "Wonen & Lening", mcc: "6012", location: "Domiciliëring KBC" }
    ]
  }
];
