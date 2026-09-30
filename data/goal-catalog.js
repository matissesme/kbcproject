/**
 * KBC KOMPAS - DOELCATALOGUS (JSON / JS)
 * Bevat alle bestemmingen die een klant in de KBC-app kan kiezen:
 * - Eigen Woning
 * - Op Kot / Studie
 * - Grote Reis / Wereldreis
 * - Eerste Auto / Elektrische Wagen
 * - Gezin Starten / Baby
 * - Pensioen & Vermogen
 * Inclusief standaardkost, minimale termijn, gekoppelde KBC-producten (Bank + Verzekering + Belegging)
 * en de checklist voor "Wat je al hebt" vs. "Wat nog ontbreekt".
 */
window.KBCAura = window.KBCAura || {};

window.KBCAura.GoalCatalog = {
  woning: {
    id: "woning",
    title: "Eigen Woning Kopen",
    shortTitle: "Eigen Woning",
    icon: "🏡",
    color: "#009DE0",
    defaultTargetAmount: 45000,
    minAmount: 15000,
    maxAmount: 150000,
    defaultMonths: 36,
    minMonths: 6,
    maxMonths: 120,
    costBreakdownLabel: "10% eigen inbreng + registratierechten (3%) + notariskosten op een woning van €320.000",
    description: "Spaar doelgericht voor je eigen inbreng en aankoopkosten, terwijl KBC je leencapaciteit en verplichte woningverzekeringen klaarzet.",
    linkedProducts: [
      { id: "bank-woonkrediet", type: "Krediet", name: "KBC Woonlening Simulatie op Maat", costLabel: "Rente vanaf 3,12% vast", mandatory: true, icon: "🏠" },
      { id: "ins-woning-eigenaar", type: "Verzekering", name: "KBC Woningpolis (Brandverzekering Eigenaar)", costLabel: "€34,80 / maand", mandatory: true, icon: "🏡" },
      { id: "ins-schuldsaldo", type: "Verzekering", name: "KBC Schuldsaldoverzekering", costLabel: "€24,00 / maand", mandatory: true, icon: "🔐" }
    ],
    routeMilestones: [
      { pct: 25, label: "Noodbuffer van 3 maanden veiliggesteld" },
      { pct: 50, label: "Notaris- & registratiekosten (€14.500) bereikt" },
      { pct: 80, label: "KBC Haalbaarheids-attest klaar voor makelaar" },
      { pct: 100, label: "10% Eigen inbreng compleet — Klaar voor compromis!" }
    ]
  },

  kot: {
    id: "kot",
    title: "Op Kot Gaan & Studeren",
    shortTitle: "Op Kot",
    icon: "🎓",
    color: "#8b5cf6",
    defaultTargetAmount: 7200,
    minAmount: 2000,
    maxAmount: 25000,
    defaultMonths: 18,
    minMonths: 3,
    maxMonths: 48,
    costBreakdownLabel: "Huurwaarborg (2 mnd) + 10 maanden kothuur (€540/mnd) + IKEA meubels & studieboeken",
    description: "Bereid je kotjaar financieel voor zodat huurwaarborg, inrichting en verzekeringen op tijd geregeld zijn.",
    linkedProducts: [
      { id: "ins-woning-huurder", type: "Verzekering", name: "KBC Kot- & Huurderspolis (Brand + Inboedel)", costLabel: "€7,50 / maand (Studententarief)", mandatory: true, icon: "🏢" },
      { id: "ins-familiale", type: "Verzekering", name: "KBC Familiale Verzekering (Studentendekking)", costLabel: "€8,20 / maand", mandatory: false, icon: "👨‍👩‍👧" },
      { id: "ext-nmbs", type: "Mobiliteit", name: "NMBS Student Multi / Campus-kaart in KBC Mobile", costLabel: "Direct in app", mandatory: false, icon: "🚆" }
    ],
    routeMilestones: [
      { pct: 20, label: "Huurwaarborg (€1.080) apart gezet" },
      { pct: 45, label: "Inrichting & studiemateriaal budget klaar" },
      { pct: 75, label: "KBC Kot-verzekering gekoppeld aan huurcontract" },
      { pct: 100, label: "Volledig academiejaar kotbudget gedekt!" }
    ]
  },

  reis: {
    id: "reis",
    title: "Grote Reis / Droomvakantie",
    shortTitle: "Grote Reis",
    icon: "✈️",
    color: "#0ea5e9",
    defaultTargetAmount: 4800,
    minAmount: 800,
    maxAmount: 30000,
    defaultMonths: 12,
    minMonths: 2,
    maxMonths: 36,
    costBreakdownLabel: "Vluchten / Autoreis + Verblijf + Dagbudget + Onvoorziene reisbuffer",
    description: "Zorgeloos op reis vertrekken met een vol spaardoel én de juiste reis- en pechbijstand voor onderweg.",
    linkedProducts: [
      { id: "ins-reisbijstand-wereld", type: "Verzekering", name: "KBC Reis- en Annuleringsverzekering", costLabel: "€14,50 / maand", mandatory: true, icon: "✈️" },
      { id: "ins-pechverhelping", type: "Verzekering", name: "KBC Pechverhelping Europa (voor autovakantie)", costLabel: "€11,90 / maand", mandatory: false, icon: "🚨" },
      { id: "bank-noodlimiet", type: "Betalen", name: "KBC Kredietkaart Werelddekking & Reisbuffer", costLabel: "Inbegrepen in Plusrekening", mandatory: false, icon: "💳" }
    ],
    routeMilestones: [
      { pct: 30, label: "Vliegtickets / Verblijf voorschot + Annuleringspolis" },
      { pct: 65, label: "Reisbudget & Activiteiten bij elkaar gespaard" },
      { pct: 90, label: "Betalen buiten Europa & Pechverhelping gecheckt" },
      { pct: 100, label: "100% Reisbudget klaar voor vertrek!" }
    ]
  },

  auto: {
    id: "auto",
    title: "Eerste Auto / Nieuwe Wagen",
    shortTitle: "Eerste Auto",
    icon: "🚗",
    color: "#10b981",
    defaultTargetAmount: 14500,
    minAmount: 3500,
    maxAmount: 60000,
    defaultMonths: 24,
    minMonths: 4,
    maxMonths: 60,
    costBreakdownLabel: "Aankoopbudget / Eigen inleg + BIV (Inschrijvingstaks) + Verzekering & Onderhoudsbuffer",
    description: "Van aankoopbedrag tot nummerplaat en verzekering: weet exact wanneer je nieuwe wagen betaalbaar is.",
    linkedProducts: [
      { id: "ins-ba-auto", type: "Verzekering", name: "KBC Autoverzekering (BA Wettelijk Verplicht)", costLabel: "€42,50 / maand", mandatory: true, icon: "🚗" },
      { id: "ins-omnium-auto", type: "Verzekering", name: "KBC (Mini-)Omnium Eigen Schade", costLabel: "€68,00 / maand", mandatory: false, icon: "🛡️" },
      { id: "ins-pechverhelping", type: "Verzekering", name: "KBC Pechverhelping België + Europa", costLabel: "€11,90 / maand", mandatory: false, icon: "🚨" }
    ],
    routeMilestones: [
      { pct: 25, label: "BIV, verkeersbelasting en eerste jaar verzekering gedekt" },
      { pct: 60, label: "Ruime aanbetaling voor jonge tweedehands/elektrische wagen" },
      { pct: 100, label: "Volledig autobudget klaar — Offerte BA & Omnium staat klaar!" }
    ]
  },

  gezin: {
    id: "gezin",
    title: "Gezin Starten / Baby op Komst",
    shortTitle: "Gezin Starten",
    icon: "👶",
    color: "#ec4899",
    defaultTargetAmount: 6500,
    minAmount: 2000,
    maxAmount: 25000,
    defaultMonths: 9,
    minMonths: 2,
    maxMonths: 36,
    costBreakdownLabel: "Babykamer & uitzet (€2.200) + Waarborg crèche + Ouderschapsverlof-inkomensbuffer (€3.500)",
    description: "Bereid de komst van jullie kindje financieel én qua gezinsverzekeringen rustig stap voor stap voor.",
    linkedProducts: [
      { id: "ins-hospitalisatie", type: "Verzekering", name: "KBC Hospitalisatieverzekering (Moeder & Kind)", costLabel: "€29,50 / maand", mandatory: true, icon: "🏥" },
      { id: "ins-familiale", type: "Verzekering", name: "KBC Gezinspolis (Familiale BA)", costLabel: "€8,20 / maand", mandatory: true, icon: "👨‍👩‍👧" },
      { id: "bank-kinderspaarrekening", type: "Sparen", name: "KBC Kinderspaarrekening / Pamperrekening", costLabel: "1,80% rente • Gratis", mandatory: false, icon: "🍼" }
    ],
    routeMilestones: [
      { pct: 30, label: "Hospitalisatieverzekering & Kraamzorg gecheckt" },
      { pct: 65, label: "Baby-uitzet & Kinderopvang waarborg klaar" },
      { pct: 100, label: "Gezinsbuffer compleet + Kinderspaarrekening klaar!" }
    ]
  },

  pensioen: {
    id: "pensioen",
    title: "Pensioen & Financiële Vrijheid",
    shortTitle: "Pensioen & Vermogen",
    icon: "🎯",
    color: "#f59e0b",
    defaultTargetAmount: 25000,
    minAmount: 5000,
    maxAmount: 250000,
    defaultMonths: 60,
    minMonths: 12,
    maxMonths: 240,
    costBreakdownLabel: "Fiscaal pensioensparen (€1.020/jaar) + Maandelijks KBC-Beleggingsplan tegen inflatie",
    description: "Laat je geld op lange termijn groeien met 30% belastingvoordeel en bescherm je spaarbuffer tegen inflatie.",
    linkedProducts: [
      { id: "inv-pensioensparen", type: "Pensioen", name: "KBC Pensioensparen (30% Fiscaal Voordeel)", costLabel: "Tot €85 / maand", mandatory: true, icon: "🎯" },
      { id: "inv-beleggingsplan", type: "Beleggen", name: "KBC-Beleggingsplan op Maat", costLabel: "Vanaf €25 / maand", mandatory: true, icon: "📈" },
      { id: "inv-wisselgeld", type: "Beleggen", name: "KBC Wisselgeld Beleggen", costLabel: "Automatische afronding", mandatory: false, icon: "🪙" }
    ],
    routeMilestones: [
      { pct: 20, label: "Fiscaal jaarplafond Pensioensparen (€1.020) geactiveerd" },
      { pct: 50, label: "Automatisch maandelijks Beleggingsplan draait stabiel" },
      { pct: 100, label: "Doelvermogen van €25.000 opgebouwd!" }
    ]
  }
};
