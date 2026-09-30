/**
 * KBC AURA - VOLLEDIGE KBC PRODUCTEN, VERZEKERINGEN, BELEGGINGEN & EXTRA DIENSTEN CATALOGUS
 * Bevat alle cross-product bouwstenen die door de Profiel-Analyse Engine (Persoon 2),
 * het Dashboard (Persoon 3) en de KBC Mobile App (Persoon 4) worden gebruikt.
 */
window.KBCAura = window.KBCAura || {};

window.KBCAura.ProductsCatalog = {
  insurances: [
    {
      id: "ins-ba-auto",
      name: "KBC Autoverzekering (BA Burgerlijke Aansprakelijkheid)",
      shortName: "BA Auto",
      category: "Mobiliteit",
      monthlyPremium: 42.50,
      icon: "🚗",
      description: "Verplichte wettelijke aansprakelijkheidsverzekering voor schade met je wagen aan derden.",
      triggers: ["AUTO_BEZIT", "TANKSTATION", "GARAGE", "PARKEREN_4411"]
    },
    {
      id: "ins-omnium-auto",
      name: "KBC Volledige Omnium & Eigen Schade",
      shortName: "Omnium Auto",
      category: "Mobiliteit",
      monthlyPremium: 68.00,
      icon: "🛡️",
      description: "Dekt schade aan je eigen wagen bij aanrijding, diefstal, glasbreuk, storm en natuurschade.",
      triggers: ["NIEUWE_WAGEN", "AUTOLENING", "HOGE_AUTO_WAARDE"]
    },
    {
      id: "ins-pechverhelping",
      name: "KBC-Pechverhelping & Reisbijstand (België + Europa)",
      shortName: "KBC Pechverhelping & Reisbijstand",
      category: "Mobiliteit & Reizen",
      monthlyPremium: 11.90,
      icon: "🚨",
      description: "24/7 takeldienst, vervangwagen en directe bijstand bij autopech of ongeval in België en heel Europa.",
      triggers: ["AUTO_PECH", "TOLWEG_BUITENLAND", "TANKSTATION_BUITENLAND", "VAKANTIE_AUTO"]
    },
    {
      id: "ins-woning-huurder",
      name: "KBC Woningpolis (Brandverzekering Huurder)",
      shortName: "Brandverzekering Huurder",
      category: "Wonen",
      monthlyPremium: 16.50,
      icon: "🏢",
      description: "Beschermt je huurdersaansprakelijkheid en inboedel tegen brand-, water- en stormschade.",
      triggers: ["HUUR_BETALING", "APPARTEMENT"]
    },
    {
      id: "ins-woning-eigenaar",
      name: "KBC Woningpolis (Brandverzekering Eigenaar + Natuurrampen)",
      shortName: "Brandverzekering Eigenaar",
      category: "Wonen",
      monthlyPremium: 34.80,
      icon: "🏡",
      description: "Volledige bescherming van je eigen woning, dak, zonnepanelen en tuin tegen brand, storm, hagel en overstroming.",
      triggers: ["NOTARIS", "WOONKREDIET", "IMMOWEB", "BOUWMARKT", "STORM_REGIO"]
    },
    {
      id: "ins-schuldsaldo",
      name: "KBC Schuldsaldoverzekering (Woonkrediet Bescherming)",
      shortName: "Schuldsaldoverzekering",
      category: "Wonen & Gezin",
      monthlyPremium: 24.00,
      icon: "🔐",
      description: "Neemt de terugbetaling van je woonlening over bij overlijden zodat je partner en gezin zorgeloos in de woning kunnen blijven.",
      triggers: ["WOONKREDIET", "NOTARIS", "SAMENWONEND", "GEZIN"]
    },
    {
      id: "ins-familiale",
      name: "KBC Gezinspolis (Familiale Burgerlijke Aansprakelijkheid)",
      shortName: "Familiale Verzekering",
      category: "Gezin",
      monthlyPremium: 8.20,
      icon: "👨‍👩‍👧",
      description: "Dekt schade die jij, je partner, je kinderen of je huisdieren per ongeluk veroorzaken aan anderen.",
      triggers: ["BABY_UITGAVEN", "GROEIPAKKET", "KINDEROPVANG", "DIERENARTS", "SCHOOL"]
    },
    {
      id: "ins-hospitalisatie",
      name: "KBC Hospitalisatieverzekering (Gezin & Kind)",
      shortName: "Hospitalisatieverzekering",
      category: "Gezondheid & Gezin",
      monthlyPremium: 29.50,
      icon: "🏥",
      description: "Terugbetaling van ziekenhuisopnames, eenpersoonskamer, bevallingskosten en voor-/nazorg.",
      triggers: ["ZIEKENHUIS", "APOTHEEK", "BABY_UITGAVEN", "ZWANGERSCHAP", "SENIOR"]
    },
    {
      id: "ins-reisbijstand-wereld",
      name: "KBC Reis- en Annuleringsverzekering Wereldwijd",
      shortName: "Reis- & Annuleringspolis",
      category: "Reizen",
      monthlyPremium: 14.50,
      icon: "✈️",
      description: "Medische kosten in het buitenland, repatriëring, bagageverlies en terugbetaling bij annulering van je reis.",
      triggers: ["VLIEGTICKET", "HOTEL_BOEKING", "BUITENLAND_BETALING"]
    },
    {
      id: "ins-rechtsbijstand",
      name: "KBC Globale Rechtsbijstandsverzekering",
      shortName: "Rechtsbijstand",
      category: "Juridisch & Wonen",
      monthlyPremium: 12.00,
      icon: "⚖️",
      description: "Juridische hulp bij geschillen rond verkeer, aannemers, verbouwingen of consumentenaankopen.",
      triggers: ["VERBOUWING", "AANNEMER", "AUTO_ONGEVAL"]
    }
  ],

  bankingAndLoans: [
    {
      id: "bank-woonkrediet",
      name: "KBC Woonlening op Maat (Samenstelbaar met Eigenaarsbundel)",
      category: "Kredieten",
      rateIndicative: "3,12% vast",
      icon: "🏠",
      description: "Simuleer en vraag je hypothecaire lening digitaal aan met korting bij combinatie met KBC Woningpolis en Schuldsaldo."
    },
    {
      id: "bank-renovatie",
      name: "KBC Groene Energielening & Renovatiekrediet",
      category: "Kredieten",
      rateIndicative: "2,85% JKP",
      icon: "🔨",
      description: "Voordelige financiering voor isolatie, warmtepomp, zonnepanelen of verbouwing na aankoop."
    },
    {
      id: "bank-noodlimiet",
      name: "Tijdelijke Nood-Verhoging Kredietkaart & Reisbuffer",
      category: "Noodhulp Betalen",
      rateIndicative: "Direct actief (0 EUR kosten)",
      icon: "💳",
      description: "Verhoog met 1 tik je KBC-kredietkaartlimiet met 2.500 EUR voor onverwachte kosten in het buitenland (garage, ziekenhuis, hotel)."
    },
    {
      id: "bank-kinderspaarrekening",
      name: "KBC-Spaarrekening op naam van je Kind / Pamperrekening",
      category: "Sparen & Gezin",
      rateIndicative: "1,80% totale rente",
      icon: "🍼",
      description: "Automatisch maandelijks sparen vanaf de geboorte, gekoppeld aan het Groeipakket."
    },
    {
      id: "bank-budget-split",
      name: "KBC Slimme Vaste-Lasten Buffer & Betaalspreiding",
      category: "Budgetbeheer",
      rateIndicative: "Gratis in KBC Plusrekening",
      icon: "📊",
      description: "Zet bij binnenkomst van je loon automatisch het exacte bedrag voor huur, energie en lening apart zodat je nooit voor verrassingen staat."
    }
  ],

  investments: [
    {
      id: "inv-wisselgeld",
      name: "KBC Wisselgeld Beleggen (Laagdrempelig Starten)",
      category: "Beleggen",
      minAmount: "Vanaf 10 EUR / maand",
      icon: "🪙",
      description: "Rond elke kaartbetaling automatisch af naar de volgende euro en beleg het wisselgeld zonder dat je het voelt."
    },
    {
      id: "inv-beleggingsplan",
      name: "KBC-Beleggingsplan tegen Inflatieverlies",
      category: "Beleggen",
      minAmount: "Vanaf 25 EUR / maand",
      icon: "📈",
      description: "Laat overtollig spaargeld boven je veilige 6-maanden buffer gespreid renderen volgens jouw risicoprofiel."
    },
    {
      id: "inv-pensioensparen",
      name: "KBC Pensioensparen met 30% Belastingvoordeel",
      category: "Pensioen & Fiscaliteit",
      minAmount: "Fiscaal maximum 1.020 EUR / jaar",
      icon: "🎯",
      description: "Bouw extra pensioenkapitaal op en krijg tot 306 EUR per jaar terug via je belastingaangifte."
    }
  ],

  extraServices: [
    { id: "ext-nmbs", name: "NMBS Treintickets", icon: "🚆", category: "Mobiliteit", priceInfo: "Direct ticket zonder toeslag" },
    { id: "ext-delijn", name: "De Lijn M-Ticket", icon: "🚌", category: "Mobiliteit", priceInfo: "2,50 EUR per rit (60 min)" },
    { id: "ext-4411", name: "4411 Straat- & Ziekenhuisparkeren", icon: "🅿️", category: "Mobiliteit", priceInfo: "Betaal per minuut via KBC" },
    { id: "ext-storm-claim", name: "KBC 60-Seconden Stormschade Melder", icon: "⛈️", category: "Schadehulp", priceInfo: "Foto uploaden & directe voorschot-uitkering" },
    { id: "ext-kate-coach", name: "Kate Persoonlijke Financiële Coach", icon: "🤖", category: "AI Advies", priceInfo: "24/7 proactieve begeleiding" }
  ]
};
