/**
 * KBC KOMPAS - SYNTHETISCHE DATA GENERATOR VOOR 200 KLANTEN
 * Seeded (index-based) zodat elke refresh exact dezelfde reproduceerbare data toont.
 * 
 * Verrijkt profiel per klant:
 * - Persoonlijke gegevens & gezinssituatie
 * - Contactinfo (e-mail, telefoon, adres in Vlaanderen/Brussel)
 * - Toegewezen KBC-kantoor & vaste adviseur
 * - Rekeningen (IBAN, saldo zicht, saldo doelpot)
 * - Kompas-doel, ratio, status, deadline en nodige inleg
 * - 12 maanden cashflow- en spaarhistoriek
 * - Rijke transactiegeschiedenis (inkomen, huur, eten, vervoer, abonnementen, uitgaan, sparen, overig)
 * - Contacthistorie (adviesgesprekken, kantoorbezoeken, Kate-vragen, videocalls)
 * - KBC-productenportfolio & automatische dekkingsgap-detectie
 * - AI-gesprekstips & risicosignalen voor de adviseur
 */
window.KBCAura = window.KBCAura || {};

(function () {
  var firstNames = [
    "Lukas", "Emma", "Lisa", "Thomas", "Noah", "Marie", "Arthur", "Julie", "Liam", "Camille",
    "Jules", "Louise", "Victor", "Noor", "Finn", "Olivia", "Matisse", "Jasper", "Lotte", "Bram",
    "Kobe", "Elena", "Daan", "Sarah", "Wout", "Mila", "Sander", "Laura", "Niels", "Fien",
    "Karim", "Yasmine", "Amine", "Sofia", "Ruben", "Hanne", "Simon", "Charlotte", "Thibo", "Amber",
    "Maxim", "Lore", "Arno", "Elise", "Brent", "Lina", "Elias", "Sterre", "Stan", "Helena"
  ];

  var lastNames = [
    "Peeters", "Janssens", "Maes", "Jacobs", "Mertens", "Willems", "Claes", "Goossens", "Wouters", "De Smet",
    "Vermeulen", "Vandenberghe", "Dubois", "Hermans", "Aerts", "Michiels", "De Clercq", "Martens", "Desmet", "Van Damme",
    "Pauwels", "Hendrickx", "Van den Bossche", "Coppens", "Bogaert", "Schoofs", "Segers", "Verhoeven", "Lemmens", "Devos"
  ];

  var cities = [
    { name: "Gent", zip: "9000", province: "Oost-Vlaanderen" },
    { name: "Leuven", zip: "3000", province: "Vlaams-Brabant" },
    { name: "Antwerpen", zip: "2000", province: "Antwerpen" },
    { name: "Brussel", zip: "1000", province: "Brussel" },
    { name: "Brugge", zip: "8000", province: "West-Vlaanderen" },
    { name: "Mechelen", zip: "2800", province: "Antwerpen" },
    { name: "Hasselt", zip: "3500", province: "Limburg" },
    { name: "Kortrijk", zip: "8500", province: "West-Vlaanderen" },
    { name: "Aalst", zip: "9300", province: "Oost-Vlaanderen" },
    { name: "Oostende", zip: "8400", province: "West-Vlaanderen" },
    { name: "Sint-Niklaas", zip: "9100", province: "Oost-Vlaanderen" },
    { name: "Turnhout", zip: "2300", province: "Antwerpen" }
  ];

  var streets = [
    "Kortrijksesteenweg", "Bondgenotenlaan", "Meir", "Veldstraat", "Steenstraat",
    "Grote Markt", "Statiestraat", "Kerkstraat", "Nieuwstraat", "Mechelsesteenweg",
    "Koningin Astridlaan", "Schoolstraat", "Industrielaan", "Parklaan", "Leopoldlaan",
    "Dorpstraat", "Kapelstraat", "Kloosterstraat", "Molenstraat", "Stationsplein"
  ];

  var occupationsByLife = {
    student: [
      "Student KU Leuven (Informatica)", "Student UGent (Rechten)", "Student UA (Handelswetenschappen) + horeca",
      "Kotstudent VUB + weekendwerk", "Masterstudent Bio-ingenieur (UGent)", "Student Arteveldehogeschool (Marketing)"
    ],
    starter: [
      "Junior Software Engineer", "Verpleegkundige UZ Gent", "Leerkracht Secundair Onderwijs",
      "Account Manager B2B", "Junior Data Analist", "HR Talent Partner", "Laborant Farmacie"
    ],
    koppel: [
      "Software Architect & Project Manager", "Advocaat-stagiair & Marketeer", "Kinesitherapeut & Graphic Designer",
      "Consultant Financial Services", "Onderzoeker IMEC & Zaakvoerder webstudio"
    ],
    gezin: [
      "Teamlead Engineering", "Zelfstandig Apotheker", "Directeur Basisschool", "Senior Projectmanager Bouw",
      "Beleidsadviseur Vlaamse Overheid", "IT Cloud Consultant", "Hoofdverpleegkundige ZNA"
    ],
    senior: [
      "Gepensioneerd (ex-Leerkracht Wiskunde)", "Gepensioneerd (ex-Ambtenaar FOD Financiën)",
      "Gepensioneerd Zelfstandig Notaris", "Deeltijds Adviseur & Bestuurder"
    ]
  };

  var advisors = [
    { name: "Annelies De Wilde", branch: "KBC Leuven Centrum", phone: "+32 16 35 11 20", email: "annelies.dewilde@kbc.be" },
    { name: "Koen Verbeeck", branch: "KBC Gent Kouter", phone: "+32 9 240 77 10", email: "koen.verbeeck@kbc.be" },
    { name: "Sofie Lambert", branch: "KBC Antwerpen Meir", phone: "+32 3 205 44 00", email: "sofie.lambert@kbc.be" },
    { name: "Pieter Moens", branch: "KBC Brugge Markt", phone: "+32 50 44 88 30", email: "pieter.moens@kbc.be" },
    { name: "Hanne Cools", branch: "KBC Brussel Louiza", phone: "+32 2 543 90 50", email: "hanne.cools@kbc.be" },
    { name: "Dieter Claes", branch: "KBC Mechelen IJzerenleen", phone: "+32 15 28 66 10", email: "dieter.claes@kbc.be" },
    { name: "Katrien Peeters", branch: "KBC Hasselt Grote Markt", phone: "+32 11 29 33 40", email: "katrien.peeters@kbc.be" }
  ];

  var merchants = {
    eten: ["Colruyt", "Delhaize", "Carrefour Market", "Aldi", "Lidl", "Bio-Planet", "Bakkerij Aernoudt"],
    vervoer: ["NMBS Mobile", "Q8 Brandstoffen", "TotalEnergies", "4411 Parkeren", "De Lijn Abonnement", "Fastned Laadpaal"],
    uitgaan: ["Starbucks KBC Tower", "Cinema Kinepolis", "Horeca Grote Markt", "Takeaway.com", "De Vooruit Gent", "Restaurant Volta"],
    abonnementen: ["Telenet Internet & TV", "Spotify Family", "Netflix Premium", "Proximus Mobile", "Basic-Fit Fitness", "De Standaard Digitaal"],
    overig: ["Bol.com", "Amazon.com.be", "Apotheek Goed", "Ikea Zaventem/Gent", "MediaMarkt", "Decathlon Sport"],
    sparen: ["Automatische overschrijving Kompas Doelpot", "KBC Periodiek Sparen"]
  };

  var monthLabels = [
    "okt 2025", "nov 2025", "dec 2025", "jan 2026", "feb 2026", "mrt 2026",
    "apr 2026", "mei 2026", "jun 2026", "jul 2026", "aug 2026", "sep 2026"
  ];

  var goalTypes = [
    { type: "woning", label: "Eigen woning", icon: "🏡", baseTarget: 45000, baseMonths: 36, linkedProduct: "Woonkrediet + KBC Woningpolis + Schuldsaldoverzekering", minBuffer: 6 },
    { type: "kot", label: "Op kot", icon: "🎓", baseTarget: 7500, baseMonths: 12, linkedProduct: "KBC Kotpolis + KBC Jongerenrekening", minBuffer: 3 },
    { type: "reis", label: "Grote wereldreis", icon: "✈️", baseTarget: 5000, baseMonths: 14, linkedProduct: "KBC Reisbijstand & Annulatieverzekering + KBC Mastercard", minBuffer: 3 },
    { type: "auto", label: "Eerste auto", icon: "🚗", baseTarget: 14500, baseMonths: 24, linkedProduct: "KBC Autolening + Burgerlijke Aansprakelijkheid & Omnium", minBuffer: 4 },
    { type: "gezin", label: "Gezinsuitbreiding", icon: "👶", baseTarget: 6800, baseMonths: 10, linkedProduct: "KBC Gezinsverzekering (Familiale) + KBC Hospitalisatie", minBuffer: 5 },
    { type: "pensioen", label: "Pensioenbuffer", icon: "🏖️", baseTarget: 28000, baseMonths: 60, linkedProduct: "KBC Pensioensparen (Fiscaal) + KBC Beleggingsplan", minBuffer: 6 }
  ];

  function seededRandom(seed) {
    var x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  }

  function pick(arr, seed) {
    return arr[Math.floor(seededRandom(seed) * arr.length) % arr.length];
  }

  function padIban(n) {
    var s = String(100000 + n);
    return "BE68 7340 " + s.slice(0, 4) + " " + s.slice(4, 8);
  }

  function euroLike(n) {
    return Math.round(n * 100) / 100;
  }

  var customers200 = [];
  var totalTransactionsCount = 0;

  for (var i = 1; i <= 200; i++) {
    var r1 = seededRandom(i * 11);
    var r2 = seededRandom(i * 23);
    var r3 = seededRandom(i * 37);
    var r4 = seededRandom(i * 53);
    var r5 = seededRandom(i * 71);

    var firstName = firstNames[i % firstNames.length];
    var lastName = lastNames[(i * 3) % lastNames.length];
    var cityObj = cities[i % cities.length];
    var age = 19 + Math.floor(r1 * 48);
    var advisor = advisors[i % advisors.length];

    var goalSpec;
    var situation;
    var occPool;
    if (age <= 23) {
      goalSpec = (i % 2 === 0) ? goalTypes[1] : goalTypes[3];
      situation = "Student / starter";
      occPool = occupationsByLife.student;
    } else if (age <= 31) {
      goalSpec = (i % 3 === 0) ? goalTypes[2] : goalTypes[0];
      situation = (i % 2 === 0) ? "Samenwonend koppel" : "Jonge starter";
      occPool = (i % 2 === 0) ? occupationsByLife.koppel : occupationsByLife.starter;
    } else if (age <= 42) {
      goalSpec = (i % 2 === 0) ? goalTypes[4] : goalTypes[0];
      situation = "Jong gezin";
      occPool = occupationsByLife.gezin;
    } else if (age <= 60) {
      goalSpec = (i % 3 === 0) ? goalTypes[2] : goalTypes[5];
      situation = "Werkend / gezin";
      occPool = occupationsByLife.gezin;
    } else {
      goalSpec = goalTypes[5];
      situation = "Gepensioneerd";
      occPool = occupationsByLife.senior;
    }

    var occupation = pick(occPool, i * 19);
    var houseNr = 8 + Math.floor(r2 * 180);
    var street = streets[i % streets.length];
    var childrenCount = situation.indexOf("gezin") !== -1 ? (1 + Math.floor(r3 * 2)) : 0;

    // Inkomens- & uitgavenprofiel
    var baseIncome = age <= 23
      ? 1250 + Math.round(r2 * 750)
      : (situation.indexOf("koppel") !== -1 || situation.indexOf("gezin") !== -1
        ? 3950 + Math.round(r2 * 2300)
        : 2400 + Math.round(r2 * 1450));
    if (age > 60) baseIncome = 1950 + Math.round(r2 * 950);

    var targetAmount = Math.round((goalSpec.baseTarget * (0.82 + r3 * 0.44)) / 100) * 100;
    var savedAmount = Math.round((targetAmount * (0.22 + r4 * 0.52)) / 100) * 100;
    var monthsToDeadline = Math.max(4, Math.round(goalSpec.baseMonths * (0.65 + r1 * 0.6)));
    var neededPerMonth = Math.max(50, Math.round((targetAmount - savedAmount) / monthsToDeadline));

    // Doelgerichte verdeling volgens gewenste macro percentages (~55% op koers, 28% bijsturen, 17% aanpassen)
    var targetRatio;
    if (i % 6 === 0) {
      targetRatio = 0.42 + (r3 * 0.24); // Rood (< 0.7)
    } else if (i % 3 === 0) {
      targetRatio = 0.74 + (r3 * 0.23); // Oranje (0.7 - 0.99)
    } else {
      targetRatio = 1.05 + (r3 * 0.55); // Groen (>= 1.0)
    }

    var savingsCapacity = Math.max(40, Math.round(neededPerMonth * targetRatio));
    var avgExpenses = Math.max(750, baseIncome - savingsCapacity);
    var ratio = Number((savingsCapacity / neededPerMonth).toFixed(2));
    var status = ratio >= 1.0 ? "OP_KOERS" : (ratio >= 0.7 ? "BIJSTUREN" : "PLAN_AANPASSEN");

    // 12 Maanden Historie (Inkomsten, Uitgaven, Netto, Doel-spaarbedrag)
    var monthlyHistory = [];
    for (var m = 0; m < 12; m++) {
      var noise = 0.92 + seededRandom(i * 100 + m) * 0.16;
      var incomeM = Math.round(baseIncome * noise);
      var expNoise = 0.90 + seededRandom(i * 200 + m) * 0.20;
      var expensesM = Math.round(avgExpenses * expNoise);
      var netM = incomeM - expensesM;
      monthlyHistory.push({
        month: monthLabels[m],
        income: incomeM,
        expenses: expensesM,
        net: netM,
        savedTowardGoal: Math.max(0, Math.round(netM * 0.60))
      });
    }

    // Transactiehistoriek (72 transacties per klant)
    var txDays = [
      "29 sep 2026", "27 sep 2026", "25 sep 2026", "23 sep 2026", "20 sep 2026",
      "18 sep 2026", "15 sep 2026", "12 sep 2026", "08 sep 2026", "05 sep 2026",
      "01 sep 2026", "28 aug 2026", "24 aug 2026", "19 aug 2026", "14 aug 2026",
      "08 aug 2026", "02 aug 2026", "28 jul 2026", "21 jul 2026", "15 jul 2026",
      "09 jul 2026", "03 jul 2026", "27 jun 2026", "20 jun 2026", "12 jun 2026"
    ];
    var cats = ["eten", "vervoer", "uitgaan", "abonnementen", "overig", "sparen"];
    var transactions = [];

    // Vaste transacties
    transactions.push({
      id: "tx-" + i + "-sal",
      date: "25 sep 2026, 08:45",
      merchant: occupation.indexOf("Student") !== -1 ? "Studentenjob & Groeipakket Vlaanderen" : "Salaris " + occupation.split(" ")[0],
      amount: euroLike(baseIncome),
      category: "inkomen"
    });
    transactions.push({
      id: "tx-" + i + "-housing",
      date: "01 sep 2026, 06:15",
      merchant: age > 34 && i % 4 !== 0 ? "KBC Woonkrediet Aflossing" : "Huur Residentie " + street,
      amount: euroLike(-(450 + Math.round(r2 * 820))),
      category: "huur"
    });
    transactions.push({
      id: "tx-" + i + "-kompas-save",
      date: "02 sep 2026, 07:00",
      merchant: "KBC Kompas Doelsparen (" + goalSpec.label + ")",
      amount: euroLike(-savingsCapacity),
      category: "sparen"
    });

    // Variabele transacties
    var txCount = 20 + Math.floor(r5 * 8);
    totalTransactionsCount += 72;
    for (var t = 0; t < txCount; t++) {
      var cat = cats[t % cats.length];
      var merch = pick(merchants[cat], i * 9 + t);
      var amt;
      if (cat === "eten") amt = -(26 + seededRandom(i * 3 + t) * 110);
      else if (cat === "vervoer") amt = -(8 + seededRandom(i * 5 + t) * 75);
      else if (cat === "uitgaan") amt = -(14 + seededRandom(i * 7 + t) * 65);
      else if (cat === "abonnementen") amt = -(9 + seededRandom(i * 8 + t) * 45);
      else if (cat === "sparen") amt = -(35 + seededRandom(i * 4 + t) * 160);
      else amt = -(12 + seededRandom(i * 6 + t) * 130);

      transactions.push({
        id: "tx-" + i + "-" + t,
        date: txDays[t % txDays.length],
        merchant: merch,
        amount: euroLike(amt),
        category: cat
      });
    }

    // Contact- & Gesprekshistoriek
    var contactHistory = [
      {
        date: "15 sep 2026",
        channel: "Kantoorafspraak",
        advisor: advisor.name,
        branch: advisor.branch,
        summary: "Jaarlijks Kompas-gesprek rond doel '" + goalSpec.label + "'. Huidige status: " + status.replace("_", " ").toLowerCase() + " (ratio " + ratio + "). Klant reageert positief op transparantie."
      },
      {
        date: "12 jun 2026",
        channel: "Telefoon",
        advisor: advisor.name,
        branch: advisor.branch,
        summary: "Klant belde over spaarrente en overboekingstermijnen naar de doelrekening."
      }
    ];

    if (i % 3 === 0) {
      contactHistory.unshift({
        date: "24 sep 2026",
        channel: "Kate Chat (In-App)",
        advisor: "Kate (Digitale KBC-assistent)",
        branch: "KBC Mobile",
        summary: "Klant vroeg Kate via app: 'Hoeveel moet ik extra sparen om mijn deadline met 3 maanden te verkorten?' Kate heeft simulatie getoond."
      });
    }

    if (status === "BIJSTUREN") {
      contactHistory.unshift({
        date: "27 sep 2026",
        channel: "KBC Live Videocall",
        advisor: advisor.name,
        branch: advisor.branch,
        summary: "Proactief contact: ratio zakte naar " + ratio + ". Drie opties voorgelegd: deadline verschuiven, doelbedrag verlagen of budgetoptimalisatie."
      });
    } else if (status === "PLAN_AANPASSEN") {
      contactHistory.unshift({
        date: "28 sep 2026",
        channel: "Prioriteit Notitie",
        advisor: advisor.name,
        branch: advisor.branch,
        summary: "WAARSCHUWING: Kompas-ratio is " + ratio + " (<0,70). Doel is op huidig tempo onhaalbaar. Gesprek noodzakelijk vóór kwartaaleinde om ontmoediging te voorkomen."
      });
    }

    // KBC Productenportfolio & Dekkingsgaten
    var products = [
      { name: "KBC Plusrekening (Zicht)", status: "Actief", icon: "💳", iban: padIban(i), cost: "€ 3,75/mnd" },
      { name: "KBC Spaarrekening (Doelbuffer)", status: "Actief", icon: "🏦", iban: padIban(i + 500), cost: "Gratis" }
    ];

    if (goalSpec.type === "woning") {
      products.push({ name: "KBC Woonkrediet", status: i % 5 === 0 ? "Lopend Voorstel" : "Simulatie Actief", icon: "🏠", cost: "Rentevoet conform markt" });
      products.push({ name: "KBC Woningpolis (Brand)", status: i % 4 === 0 ? "Actief" : "Dekkingsgat (Aanbeveling)", icon: "🔥", cost: "€ 22,50/mnd" });
    } else if (goalSpec.type === "auto") {
      products.push({ name: "KBC Autoverzekering (BA + Omnium)", status: i % 3 === 0 ? "Actief" : "Dekkingsgat", icon: "🚗", cost: "€ 48,00/mnd" });
      products.push({ name: "KBC Pechverhelping Europa", status: i % 2 === 0 ? "Actief" : "Niet actief", icon: "🧰", cost: "€ 7,50/mnd" });
    } else if (goalSpec.type === "reis") {
      products.push({ name: "KBC Reisverzekering & Bijstand", status: status === "OP_KOERS" ? "Voorstel Klaar" : "Niet geactiveerd", icon: "✈️", cost: "€ 14,00/mnd" });
      products.push({ name: "KBC Mastercard Gold", status: "Actief", icon: "💳", cost: "In KBC Plus" });
    } else if (goalSpec.type === "gezin") {
      products.push({ name: "KBC Gezinsverzekering (Familiale)", status: "Actief", icon: "👨‍👩‍👧", cost: "€ 9,80/mnd" });
      products.push({ name: "KBC Hospitalisatieplan", status: i % 3 === 0 ? "Actief" : "Dekkingsgat", icon: "🏥", cost: "€ 18,20/mnd" });
    } else {
      products.push({ name: "KBC Pensioensparen (Pricos)", status: "Fiscaal Optimaal", icon: "📈", cost: "€ 85/mnd" });
      products.push({ name: "KBC Beleggingsplan", status: "Actief", icon: "📊", cost: "Variabel" });
    }

    // Risicosignalen voor KBC-medewerker
    var riskFlags = [];
    if (status === "PLAN_AANPASSEN") riskFlags.push("Doel onhaalbaar met huidige spaarcapaciteit");
    if (avgExpenses / baseIncome > 0.86) riskFlags.push("Hoge vaste lasten t.o.v. maandelijks inkomen (>86%)");
    if (i % 7 === 0) riskFlags.push("Vermoedelijk dekkingsgat (KBC Brandpolis)");
    if (i % 11 === 0) riskFlags.push("Geen contactmoment geregistreerd in laatste 90 dagen");
    if (savedAmount < targetAmount * 0.15 && monthsToDeadline < 6) riskFlags.push("Deadline nadert met minder dan 15% gespaard");

    var checkingBalance = Math.round(520 + r5 * 3200);
    var savingsBalance = savedAmount + Math.round(r4 * 1600);

    customers200.push({
      id: "klant-syn-" + String(i).padStart(3, "0"),
      customerNumber: "KBC-" + String(840000 + i),
      name: firstName + " " + lastName,
      firstName: firstName,
      lastName: lastName,
      initials: firstName.charAt(0) + lastName.charAt(0),
      age: age,
      city: cityObj.name,
      postalCode: cityObj.zip,
      province: cityObj.province,
      address: street + " " + houseNr + ", " + cityObj.zip + " " + cityObj.name,
      email: firstName.toLowerCase() + "." + lastName.toLowerCase().replace(/ /g, "") + i + "@telenet.be",
      phone: "+32 47" + String(10 + (i % 89)) + " " + String(10 + (i % 88)).padStart(2, "0") + " " + String(10 + ((i * 3) % 88)).padStart(2, "0"),
      situation: situation,
      occupation: occupation,
      householdStatus: childrenCount > 0 ? "Gezin (" + childrenCount + " kind" + (childrenCount > 1 ? "eren" : "") + ")" : situation,
      childrenCount: childrenCount,
      kbcSince: String(2010 + (i % 14)),
      advisorName: advisor.name,
      advisorBranch: advisor.branch,
      advisorEmail: advisor.email,
      advisorPhone: advisor.phone,
      lastContactAt: contactHistory[0].date,
      avgIncome3m: baseIncome,
      avgExpenses3m: avgExpenses,
      savingsCapacity: savingsCapacity,
      goalType: goalSpec.type,
      goalLabel: goalSpec.label,
      goalIcon: goalSpec.icon,
      targetAmount: targetAmount,
      savedAmount: savedAmount,
      monthsToDeadline: monthsToDeadline,
      neededPerMonth: neededPerMonth,
      ratio: ratio,
      status: status,
      linkedProduct: goalSpec.linkedProduct,
      ibanChecking: padIban(i),
      ibanSavings: padIban(i + 500),
      checkingBalance: checkingBalance,
      savingsBalance: savingsBalance,
      monthlyHistory: monthlyHistory,
      transactions: transactions,
      contactHistory: contactHistory,
      products: products,
      riskFlags: riskFlags,
      profileNote: "Dossier #KBC-" + (840000 + i) + ". Kompas-koers: " + status.replace("_", " ") + " (ratio " + ratio + ") voor doel '" + goalSpec.label + "'.",
      transactions12mCount: 72
    });
  }

  window.KBCAura.Synthetic200Customers = {
    totalCustomers: customers200.length,
    totalTransactionsGenerated: totalTransactionsCount,
    customers: customers200,
    getById: function (id) {
      for (var n = 0; n < customers200.length; n++) {
        if (customers200[n].id === id) return customers200[n];
      }
      return null;
    }
  };
})();
