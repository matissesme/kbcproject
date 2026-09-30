/**
 * KBC KOMPAS - SYNTHETISCHE DATA GENERATOR VOOR 200 KLANTEN
 * Seeded (index-based) zodat elke refresh dezelfde portefeuille toont.
 * Per klant: dossiergegevens, rekeningen, 12 maanden cashflow, transacties,
 * contacthistorie, producten en Kompas-status.
 */
window.KBCAura = window.KBCAura || {};

(function () {
  var firstNames = [
    "Lukas", "Emma", "Lisa", "Thomas", "Noah", "Marie", "Arthur", "Julie", "Liam", "Camille",
    "Jules", "Louise", "Victor", "Noor", "Finn", "Olivia", "Matisse", "Jasper", "Lotte", "Bram",
    "Kobe", "Elena", "Daan", "Sarah", "Wout", "Mila", "Sander", "Laura", "Niels", "Fien",
    "Karim", "Yasmine", "Amine", "Sofia", "Ruben", "Hanne", "Simon", "Charlotte", "Thibo", "Amber"
  ];
  var lastNames = [
    "Peeters", "Janssens", "Maes", "Jacobs", "Mertens", "Willems", "Claes", "Goossens", "Wouters", "De Smet",
    "Vermeulen", "Vandenberghe", "Dubois", "Hermans", "Aerts", "Michiels", "De Clercq", "Martens", "Desmet", "Van Damme"
  ];
  var cities = [
    { name: "Antwerpen", zip: "2000" },
    { name: "Gent", zip: "9000" },
    { name: "Leuven", zip: "3000" },
    { name: "Brussel", zip: "1000" },
    { name: "Brugge", zip: "8000" },
    { name: "Mechelen", zip: "2800" },
    { name: "Hasselt", zip: "3500" },
    { name: "Kortrijk", zip: "8500" },
    { name: "Aalst", zip: "9300" },
    { name: "Oostende", zip: "8400" }
  ];
  var streets = [
    "Statiestraat", "Kerkstraat", "Nieuwstraat", "Kortrijksesteenweg", "Mechelsesteenweg",
    "Veldstraat", "Bondgenotenlaan", "Meir", "Steenstraat", "Grote Markt",
    "Koningin Astridlaan", "Stationstraat", "Schoolstraat", "Industrielaan", "Parklaan"
  ];
  var occupationsByLife = {
    student: ["Student KU Leuven", "Student UGent", "Student UA + horeca-job", "Kotstudent + weekendwerk"],
    starter: ["Junior analist", "Verkoopmedewerker", "Verpleegkundige", "Leerkracht lager onderwijs", "Software developer"],
    koppel: ["HR-medewerker", "Architect", "Projectleider", "Boekhouder", "Marketing specialist"],
    gezin: ["Teamlead operations", "Zelfstandige zaakvoerder", "Ambtenaar", "Ingenieur", "Apotheker"],
    senior: ["Gepensioneerd (ex-leerkracht)", "Gepensioneerd (ex-ambtenaar)", "Deeltijds consultant"]
  };
  var advisors = [
    { name: "Annelies De Wilde", branch: "KBC Leuven" },
    { name: "Koen Verbeeck", branch: "KBC Gent-Zuid" },
    { name: "Sofie Lambert", branch: "KBC Antwerpen-Meir" },
    { name: "Pieter Moens", branch: "KBC Brugge" },
    { name: "Hanne Cools", branch: "KBC Brussel-Louiza" }
  ];
  var merchants = {
    eten: ["Colruyt", "Delhaize", "Aldi", "Lidl", "Okay"],
    vervoer: ["NMBS Mobile", "Q8", "TotalEnergies", "4411 Parkeren", "De Lijn"],
    uitgaan: ["Starbucks", "Pizza Hut", "Horeca avond", "Cinema Kinepolis", "Takeaway.com"],
    abonnementen: ["Telenet", "Spotify", "Netflix", "Proximus", "Disney+"],
    overig: ["Bol.com", "Amazon", "Apotheek", "Ikea", "Mediamarkt"],
    sparen: ["Overschrijving naar spaarrekening"]
  };
  var monthLabels = [
    "okt 2025", "nov 2025", "dec 2025", "jan 2026", "feb 2026", "mrt 2026",
    "apr 2026", "mei 2026", "jun 2026", "jul 2026", "aug 2026", "sep 2026"
  ];
  var goalTypes = [
    { type: "woning", label: "Eigen woning", baseTarget: 42000, baseMonths: 36, linkedProduct: "Woonkrediet + brandverzekering + schuldsaldo" },
    { type: "kot", label: "Op kot", baseTarget: 7200, baseMonths: 14, linkedProduct: "Kotpolis + jongerenrekening" },
    { type: "reis", label: "Grote reis", baseTarget: 4500, baseMonths: 12, linkedProduct: "Reisverzekering + spaarrekening" },
    { type: "auto", label: "Eerste auto", baseTarget: 14000, baseMonths: 24, linkedProduct: "Autolening + BA-verzekering" },
    { type: "gezin", label: "Gezin starten", baseTarget: 6500, baseMonths: 10, linkedProduct: "Familiale + hospitalisatie + kinderspaar" },
    { type: "pensioen", label: "Pensioen", baseTarget: 25000, baseMonths: 60, linkedProduct: "Pensioensparen + beleggingsplan" }
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
    } else if (age <= 62) {
      goalSpec = (i % 3 === 0) ? goalTypes[2] : goalTypes[5];
      situation = "Werkend / gezin met tieners";
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

    var baseIncome = age <= 23
      ? 1250 + Math.round(r2 * 700)
      : (situation.indexOf("koppel") !== -1 || situation.indexOf("gezin") !== -1
        ? 3900 + Math.round(r2 * 2200)
        : 2350 + Math.round(r2 * 1400));
    if (age > 62) baseIncome = 1850 + Math.round(r2 * 900);

    var targetAmount = Math.round((goalSpec.baseTarget * (0.8 + r3 * 0.45)) / 100) * 100;
    var savedAmount = Math.round((targetAmount * (0.25 + r4 * 0.50)) / 100) * 100;
    var monthsToDeadline = Math.max(4, Math.round(goalSpec.baseMonths * (0.65 + r1 * 0.6)));
    var neededPerMonth = Math.max(50, Math.round((targetAmount - savedAmount) / monthsToDeadline));

    var targetRatio;
    if (i % 6 === 0) {
      targetRatio = 0.45 + (r3 * 0.22);
    } else if (i % 3 === 0) {
      targetRatio = 0.72 + (r3 * 0.25);
    } else {
      targetRatio = 1.04 + (r3 * 0.55);
    }

    var savingsCapacity = Math.round(neededPerMonth * targetRatio);
    var avgExpenses = Math.max(750, baseIncome - savingsCapacity);
    var ratio = Number((savingsCapacity / neededPerMonth).toFixed(2));
    var status = ratio >= 1.0 ? "OP_KOERS" : (ratio >= 0.7 ? "BIJSTUREN" : "PLAN_AANPASSEN");

    var monthlyHistory = [];
    for (var m = 0; m < 12; m++) {
      var noise = 0.92 + seededRandom(i * 100 + m) * 0.16;
      var incomeM = Math.round(baseIncome * noise);
      var expNoise = 0.9 + seededRandom(i * 200 + m) * 0.2;
      var expensesM = Math.round(avgExpenses * expNoise);
      var netM = incomeM - expensesM;
      monthlyHistory.push({
        month: monthLabels[m],
        income: incomeM,
        expenses: expensesM,
        net: netM,
        savedTowardGoal: Math.round(Math.max(0, netM * 0.55))
      });
    }

    var txCount = 16 + Math.floor(r5 * 6);
    totalTransactionsCount += 72;
    var transactions = [];
    var txDays = [
      "29 sep 2026", "27 sep 2026", "24 sep 2026", "21 sep 2026", "18 sep 2026",
      "15 sep 2026", "12 sep 2026", "08 sep 2026", "04 sep 2026", "01 sep 2026",
      "28 aug 2026", "22 aug 2026", "16 aug 2026", "09 aug 2026", "02 aug 2026",
      "26 jul 2026", "18 jul 2026", "10 jul 2026", "03 jul 2026", "28 jun 2026"
    ];
    var cats = ["eten", "vervoer", "uitgaan", "abonnementen", "overig", "sparen"];
    transactions.push({
      id: "tx-" + i + "-inc",
      date: "25 sep 2026, 09:02",
      merchant: occupation.indexOf("Student") !== -1 ? "Studentenjob / groeipakket" : "Loon " + occupation.split(" ")[0],
      amount: euroLike(baseIncome),
      category: "inkomen"
    });
    transactions.push({
      id: "tx-" + i + "-huur",
      date: "01 sep 2026, 06:00",
      merchant: age > 35 && i % 4 !== 0 ? "Aflossing woonkrediet" : "Huur " + street,
      amount: euroLike(-(420 + Math.round(r2 * 780))),
      category: "huur"
    });
    for (var t = 0; t < txCount; t++) {
      var cat = cats[t % cats.length];
      var merch = pick(merchants[cat], i * 9 + t);
      var amt;
      if (cat === "eten") amt = -(28 + seededRandom(i * 3 + t) * 95);
      else if (cat === "vervoer") amt = -(6 + seededRandom(i * 5 + t) * 70);
      else if (cat === "uitgaan") amt = -(12 + seededRandom(i * 7 + t) * 55);
      else if (cat === "abonnementen") amt = -(8 + seededRandom(i * 8 + t) * 45);
      else if (cat === "sparen") amt = -(40 + seededRandom(i * 4 + t) * 180);
      else amt = -(9 + seededRandom(i * 6 + t) * 120);
      transactions.push({
        id: "tx-" + i + "-" + t,
        date: txDays[t % txDays.length],
        merchant: merch,
        amount: euroLike(amt),
        category: cat
      });
    }

    var contactHistory = [
      {
        date: "12 sep 2026",
        channel: "Kantoor",
        advisor: advisor.name,
        summary: "Kompas-doel '" + goalSpec.label + "' overlopen. Status: " + status.replace("_", " ").toLowerCase() + "."
      },
      {
        date: "03 jun 2026",
        channel: "Telefoon",
        advisor: advisor.name,
        summary: "Vragen over spaarrente en automatische overboeking naar doelpot."
      }
    ];
    if (i % 4 === 0) {
      contactHistory.unshift({
        date: "22 sep 2026",
        channel: "Kate-chat",
        advisor: "Kate (digitaal)",
        summary: "Klant vroeg waarom het kompas op " + status.toLowerCase().replace("_", " ") + " staat."
      });
    }
    if (status === "PLAN_AANPASSEN") {
      contactHistory.unshift({
        date: "26 sep 2026",
        channel: "Video",
        advisor: advisor.name,
        summary: "Opvolging: plan te strak. Opties deadline / bedrag / extra sparen voorbereid voor gesprek."
      });
    }

    var products = [
      { name: "Zichtrekening", status: "Actief" },
      { name: "Spaarrekening", status: "Actief" }
    ];
    if (goalSpec.type === "woning") products.push({ name: "Woonkrediet-simulatie", status: i % 5 === 0 ? "Lopend dossier" : "Niet gestart" });
    if (goalSpec.type === "auto") products.push({ name: "BA-verzekering", status: i % 3 === 0 ? "Actief" : "Ontbreekt" });
    if (goalSpec.type === "reis") products.push({ name: "Reisverzekering", status: status === "OP_KOERS" ? "Voorstel klaar" : "Nog niet" });
    if (goalSpec.type === "pensioen") products.push({ name: "Pensioensparen", status: "Actief" });
    if (i % 7 === 0) products.push({ name: "Brandverzekering", status: "Dekkingsgat" });

    var riskFlags = [];
    if (status === "PLAN_AANPASSEN") riskFlags.push("Doel niet haalbaar op huidige cap");
    if (i % 7 === 0) riskFlags.push("Mogelijke verzekeringsgap");
    if (i % 11 === 0) riskFlags.push("Geen contact > 90 dagen vóór juni");
    if (avgExpenses / baseIncome > 0.88) riskFlags.push("Hoge vaste lasten t.o.v. inkomen");

    var checkingBalance = Math.round(420 + r5 * 2800);
    var savingsBalance = savedAmount + Math.round(r4 * 1200);

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
      address: street + " " + houseNr + ", " + cityObj.zip + " " + cityObj.name,
      email: firstName.toLowerCase() + "." + lastName.toLowerCase().replace(/ /g, "") + i + "@mail.be",
      phone: "+32 47" + String(10 + (i % 89)) + " " + String(10 + (i % 88)).padStart(2, "0") + " " + String(10 + ((i * 3) % 88)).padStart(2, "0"),
      situation: situation,
      occupation: occupation,
      householdStatus: childrenCount > 0 ? "Gezin (" + childrenCount + " kind" + (childrenCount > 1 ? "eren" : "") + ")" : situation,
      childrenCount: childrenCount,
      kbcSince: String(2012 + (i % 12)),
      advisorName: advisor.name,
      advisorBranch: advisor.branch,
      lastContactAt: contactHistory[0].date,
      avgIncome3m: baseIncome,
      avgExpenses3m: avgExpenses,
      savingsCapacity: savingsCapacity,
      goalType: goalSpec.type,
      goalLabel: goalSpec.label,
      targetAmount: targetAmount,
      savedAmount: savedAmount,
      monthsToDeadline: monthsToDeadline,
      neededPerMonth: neededPerMonth,
      ratio: ratio,
      status: status,
      linkedProduct: goalSpec.linkedProduct,
      ibanChecking: padIban(i),
      ibanSavings: padIban(i + 400),
      checkingBalance: checkingBalance,
      savingsBalance: savingsBalance,
      monthlyHistory: monthlyHistory,
      transactions: transactions,
      contactHistory: contactHistory,
      products: products,
      riskFlags: riskFlags,
      profileNote: "Synthetisch dossier voor schaaldemo. Kompas-ratio " + ratio + " op doel " + goalSpec.label + ".",
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
