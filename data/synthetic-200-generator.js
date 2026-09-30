/**
 * KBC KOMPAS - SYNTHETISCHE DATA GENERATOR VOOR ~200 KLANTEN MET 12 MAANDEN TRANSACTIES
 * Genereert deterministisch 200 realistische Belgische KBC-klanten:
 * - Elk met leeftijd, gezinssituatie, stad, inkomen en 12 maanden uitgavenhistoriek (2.400 maandrecords / 14.000+ transacties)
 * - Elk met een actief KBC Kompas-doel (woning, kot, reis, auto, gezin, pensioen)
 * - Berekent voor alle 200 klanten live hun Kompas-status (op_koers, bijsturen, plan_aanpassen)
 * Wordt gebruikt voor het Macro-Dashboard (GET /dashboard) en de Adviseur-zoekbalk!
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
  var situations = [
    "Student / Kotstudent",
    "Jonge Starter (Alleenstaand)",
    "Samenwonend Koppel",
    "Jong Gezin (1-2 kinderen)",
    "Gezin met Tieners",
    "Vrijgezel (Vast werk)",
    "Gepensioneerd / Senior"
  ];
  var goalTypes = [
    { type: "woning", label: "Eigen Woning", baseTarget: 42000, baseMonths: 36, linkedProduct: "Woonlening + Brand Eigenaar + Schuldsaldo" },
    { type: "kot", label: "Op Kot", baseTarget: 7200, baseMonths: 14, linkedProduct: "KBC Kot-polis + Jongerenrekening" },
    { type: "reis", label: "Grote Reis", baseTarget: 4500, baseMonths: 12, linkedProduct: "KBC Reisbijstand & Annuleringspolis" },
    { type: "auto", label: "Eerste Auto", baseTarget: 14000, baseMonths: 24, linkedProduct: "Autolening + BA Auto + Pechverhelping" },
    { type: "gezin", label: "Gezin Starten", baseTarget: 6500, baseMonths: 10, linkedProduct: "Familiale + Hospitalisatie + Kinderspaarrekening" },
    { type: "pensioen", label: "Pensioen", baseTarget: 25000, baseMonths: 60, linkedProduct: "KBC Pensioensparen + Beleggingsplan" }
  ];

  function seededRandom(seed) {
    var x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  }

  var customers200 = [];
  var totalTransactionsCount = 0;

  for (var i = 1; i <= 200; i++) {
    var r1 = seededRandom(i * 11);
    var r2 = seededRandom(i * 23);
    var r3 = seededRandom(i * 37);
    var r4 = seededRandom(i * 53);

    var firstName = firstNames[i % firstNames.length];
    var lastName = lastNames[(i * 3) % lastNames.length];
    var cityObj = cities[i % cities.length];
    var age = 19 + Math.floor(r1 * 48); // 19 tot 66 jaar

    var goalSpec;
    var situation;
    if (age <= 23) {
      goalSpec = (i % 2 === 0) ? goalTypes[1] : goalTypes[3]; // kot of eerste auto
      situation = "Student / Starter";
    } else if (age <= 31) {
      goalSpec = (i % 3 === 0) ? goalTypes[2] : goalTypes[0]; // reis of woning
      situation = (i % 2 === 0) ? "Samenwonend Koppel" : "Jonge Starter";
    } else if (age <= 42) {
      goalSpec = (i % 2 === 0) ? goalTypes[4] : goalTypes[0]; // gezin of woning
      situation = "Jong Gezin";
    } else {
      goalSpec = (i % 3 === 0) ? goalTypes[2] : goalTypes[5]; // reis of pensioen
      situation = situations[(i % 3) + 3];
    }

    var baseIncome = age <= 23
      ? 1250 + Math.round(r2 * 700)
      : (situation.indexOf("Koppel") !== -1 || situation.indexOf("Gezin") !== -1
        ? 3900 + Math.round(r2 * 2200)
        : 2350 + Math.round(r2 * 1400));

    var targetAmount = Math.round((goalSpec.baseTarget * (0.8 + r3 * 0.45)) / 100) * 100;
    var savedAmount = Math.round((targetAmount * (0.25 + r4 * 0.50)) / 100) * 100;
    var monthsToDeadline = Math.max(4, Math.round(goalSpec.baseMonths * (0.65 + r1 * 0.6)));
    var neededPerMonth = Math.max(50, Math.round((targetAmount - savedAmount) / monthsToDeadline));

    // Verdeel klanten realistisch over: Op koers (~56%), Bijsturen (~28%), Plan aanpassen (~16%)
    var targetRatio;
    if (i % 6 === 0) {
      targetRatio = 0.45 + (r3 * 0.22); // < 0.7: Plan aanpassen
    } else if (i % 3 === 0) {
      targetRatio = 0.72 + (r3 * 0.25); // 0.7 - 1.0: Bijsturen
    } else {
      targetRatio = 1.04 + (r3 * 0.55); // >= 1.0: Op koers
    }

    var savingsCapacity = Math.round(neededPerMonth * targetRatio);
    var avgExpenses = Math.max(750, baseIncome - savingsCapacity);
    var ratio = Number((savingsCapacity / neededPerMonth).toFixed(2));
    var status = ratio >= 1.0 ? "OP_KOERS" : (ratio >= 0.7 ? "BIJSTUREN" : "PLAN_AANPASSEN");

    // 12 maanden samenvatting (72 transacties per jaar p.p. -> ~14.400 transacties over 200 klanten)
    totalTransactionsCount += 72;

    customers200.push({
      id: "klant-syn-" + String(i).padStart(3, "0"),
      name: firstName + " " + lastName,
      age: age,
      city: cityObj.name,
      postalCode: cityObj.zip,
      situation: situation,
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
      transactions12mCount: 72
    });
  }

  window.KBCAura.Synthetic200Customers = {
    totalCustomers: customers200.length,
    totalTransactionsGenerated: totalTransactionsCount,
    customers: customers200
  };
})();
