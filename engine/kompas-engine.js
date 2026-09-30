/**
 * KBC KOMPAS & DIGITAAL PROFIEL ENGINE (engine/kompas-engine.js)
 *
 * Implementeert exact de formules en logica van KBC Kompas:
 *   1. spaarcapaciteit = gem. inkomen (3 mnd) - gem. uitgaven (3 mnd)
 *   2. nodig_per_maand = (doelbedrag - gespaard) / maanden_tot_deadline
 *   3. ratio = spaarcapaciteit / nodig_per_maand
 *      - ratio >= 1.0      -> OP_KOERS ("Op koers" - Groen)
 *      - 0.7 <= ratio < 1.0 -> BIJSTUREN ("Bijsturen nodig" - Oranje)
 *      - ratio < 0.7        -> PLAN_AANPASSEN ("Plan aanpassen / Af te raden" - Rood)
 *   4. Berekent de 3 concrete Bijstuur-opties:
 *      - Optie A: Deadline verschuiven
 *      - Optie B: Doelbedrag verlagen
 *      - Optie C: Meer sparen / Uitgaven optimaliseren
 *   5. Koppelt elk doel aan KBC-producten (Wat je al hebt vs. Wat nog ontbreekt vs. Wat het kost)
 */
window.KBCAura = window.KBCAura || {};

window.KBCAura.escapeHtml = function (str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

window.KBCAura.KompasEngine = {
  /**
   * Berekent het volledige Kompas-resultaat én het Digitale Profiel voor een klant.
   */
  evaluateCustomer: function (customer) {
    var goals = customer.goals || [];
    var activeGoal = goals.find(function (g) { return g.id === customer.activeGoalId; }) || goals[0];
    if (!activeGoal) {
      activeGoal = {
        id: "goal-default",
        type: "woning",
        title: "Eigen Woning Kopen",
        targetAmount: 45000,
        savedAmount: customer.accounts.savingsBalance || 10000,
        monthsToDeadline: 36
      };
    }

    var goalSpec = (window.KBCAura.GoalCatalog && window.KBCAura.GoalCatalog[activeGoal.type]) || window.KBCAura.GoalCatalog.woning;

    // 1. Spaarcapaciteit (op basis van gemiddeld inkomen & uitgaven laatste 3 maanden)
    var avgIncome3m = Math.round(customer.avgMonthlyIncome3m || 3000);
    var avgExpenses3m = Math.round(customer.avgMonthlyExpenses3m || 2200);
    var savingsCapacity = Math.max(0, avgIncome3m - avgExpenses3m);

    // 2. Nodig per maand voor het gekozen doel
    var targetAmount = Math.max(500, Math.round(activeGoal.targetAmount));
    var savedAmount = Math.max(0, Math.round(activeGoal.savedAmount));
    var remainingAmount = Math.max(0, targetAmount - savedAmount);
    var monthsToDeadline = Math.max(1, Math.round(activeGoal.monthsToDeadline));
    var neededPerMonth = remainingAmount > 0 ? Math.round(remainingAmount / monthsToDeadline) : 0;

    // 3. Ratio & Status
    var rawRatio = neededPerMonth > 0 ? (savingsCapacity / neededPerMonth) : 2.0;
    var ratio = Number(rawRatio.toFixed(2));
    var progressPct = Math.min(100, Math.round((savedAmount / targetAmount) * 100));

    var statusObj;
    if (ratio >= 1.0) {
      statusObj = {
        code: "OP_KOERS",
        label: "Op koers",
        badgeText: "🟢 OP KOERS (Ratio " + ratio.toFixed(2).replace(".", ",") + ")",
        color: "#10b981",
        bgLight: "#ecfdf5",
        compassAngle: Math.min(45, Math.round((ratio - 1.0) * 40)), // Naald in het groene vlak
        headline: "Je ligt mooi op koers voor '" + activeGoal.title + "'!",
        adviceText: "Je hebt €" + savingsCapacity + "/mnd spaarruimte en hebt €" + neededPerMonth + "/mnd nodig om over " + monthsToDeadline + " maanden je doel van €" + targetAmount.toLocaleString("nl-BE") + " te halen. Je houdt elke maand nog €" + Math.max(0, savingsCapacity - neededPerMonth) + " vrije buffer over."
      };
    } else if (ratio >= 0.7) {
      statusObj = {
        code: "BIJSTUREN",
        label: "Bijsturen nodig",
        badgeText: "🟠 BIJSTUREN (Ratio " + ratio.toFixed(2).replace(".", ",") + ")",
        color: "#f59e0b",
        bgLight: "#fffbeb",
        compassAngle: -35,
        headline: "Kleine afwijking: je komt €" + Math.max(10, neededPerMonth - savingsCapacity) + "/mnd tekort",
        adviceText: "Om '" + activeGoal.title + "' binnen " + monthsToDeadline + " maanden te halen is €" + neededPerMonth + "/mnd nodig, maar op basis van je laatste 3 maanden houd je gemiddeld €" + savingsCapacity + "/mnd over. Kies hieronder 1 van de 3 manieren om bij te sturen."
      };
    } else {
      statusObj = {
        code: "PLAN_AANPASSEN",
        label: "Plan aanpassen / Af te raden",
        badgeText: "🔴 PLAN AANPASSEN (Ratio " + ratio.toFixed(2).replace(".", ",") + ")",
        color: "#dc2626",
        bgLight: "#fef2f2",
        compassAngle: -75,
        headline: "Huidig tempo is financieel te zwaar (€" + Math.max(10, neededPerMonth - savingsCapacity) + "/mnd tekort)",
        adviceText: "KBC raadt af om nu €" + neededPerMonth + "/mnd opzij te zetten terwijl je spaarcapaciteit €" + savingsCapacity + "/mnd is. Dat zou je veilige betaalbuffer aantasten. Pas je deadline of doelbedrag met 1 klik aan naar een gezonde koers."
      };
    }

    // 4. Bereken de 3 Bijstuur-Opties (Deadline verschuiven, Doelbedrag verlagen, Meer sparen)
    var safeMonthly = Math.max(75, Math.floor(savingsCapacity * 0.92));
    var recommendedMonths = remainingAmount > 0 ? Math.max(monthsToDeadline + 2, Math.ceil(remainingAmount / safeMonthly)) : monthsToDeadline;
    var extraMonthsNeeded = Math.max(2, recommendedMonths - monthsToDeadline);
    var newMonthlyIfDelayed = Math.round(remainingAmount / recommendedMonths);

    var feasibleTargetAmount = Math.max(savedAmount + 500, Math.round((savedAmount + (safeMonthly * monthsToDeadline)) / 100) * 100);
    var amountReduction = Math.max(300, targetAmount - feasibleTargetAmount);
    var finalFeasibleTarget = Math.max(savedAmount + 500, targetAmount - amountReduction);

    var monthlyShortfall = Math.max(50, neededPerMonth - savingsCapacity + 25);

    var steeringOptions = [
      {
        id: "opt-shift-deadline",
        type: "SHIFT_DEADLINE",
        icon: "🗓️",
        title: "Optie 1: Deadline verschuiven (+" + extraMonthsNeeded + " maanden)",
        subtitle: "Geef jezelf " + recommendedMonths + " maanden i.p.v. " + monthsToDeadline + " maanden",
        impactLabel: "Nieuw maandbedrag: €" + newMonthlyIfDelayed + "/mnd (Ratio wordt ≥ 1,05 🟢)",
        newMonthsToDeadline: recommendedMonths,
        recommended: true
      },
      {
        id: "opt-lower-target",
        type: "LOWER_TARGET",
        icon: "🎯",
        title: "Optie 2: Doelbedrag bijstellen naar €" + finalFeasibleTarget.toLocaleString("nl-BE"),
        subtitle: "Verlaag je richtbedrag met €" + (targetAmount - finalFeasibleTarget).toLocaleString("nl-BE") + " en behoud je huidige deadline",
        impactLabel: "Haalbaar binnen " + monthsToDeadline + " maanden zonder stress 🟢",
        newTargetAmount: finalFeasibleTarget,
        recommended: false
      },
      {
        id: "opt-save-more",
        type: "SAVE_MORE",
        icon: "✂️",
        title: "Optie 3: Bespaar €" + monthlyShortfall + "/mnd op uitgaven & abonnementen",
        subtitle: "Verlaag je gemiddelde maanduitgaven van €" + avgExpenses3m + " naar €" + (avgExpenses3m - monthlyShortfall),
        impactLabel: "Spaarcapaciteit stijgt naar €" + (savingsCapacity + monthlyShortfall) + "/mnd 🟢",
        expenseReduction: monthlyShortfall,
        recommended: false
      }
    ];

    // 5. Route-analyse: Wat je al hebt vs. Wat nog ontbreekt + Productkoppeling per doel
    var ownedInsuranceIds = {};
    (customer.activeInsurances || []).forEach(function (ins) {
      ownedInsuranceIds[ins.id] = ins;
    });
    var ownedInvestmentIds = {};
    (customer.investments || []).forEach(function (inv) {
      ownedInvestmentIds[inv.id] = inv;
    });

    var whatYouHave = [
      {
        label: "Reeds gespaard voor dit doel",
        detail: "€" + savedAmount.toLocaleString("nl-BE") + " (" + progressPct + "% van €" + targetAmount.toLocaleString("nl-BE") + ")",
        icon: "💰"
      },
      {
        label: "Maandelijkse spaarcapaciteit",
        detail: "€" + savingsCapacity.toLocaleString("nl-BE") + " / maand beschikbaar",
        icon: "📈"
      }
    ];

    var whatIsMissing = [];
    if (remainingAmount > 0) {
      whatIsMissing.push({
        id: "miss-capital",
        label: "Resterend spaarkapitaal",
        detail: "Nog €" + remainingAmount.toLocaleString("nl-BE") + " op te bouwen (€" + neededPerMonth + "/mnd gedurende " + monthsToDeadline + " mnd)",
        costLabel: "€" + neededPerMonth + " / mnd",
        icon: "⏳",
        isProduct: false
      });
    }

    var linkedProductsStatus = (goalSpec.linkedProducts || []).map(function (lp) {
      var isOwned = Boolean(ownedInsuranceIds[lp.id] || ownedInvestmentIds[lp.id]);
      if (isOwned) {
        whatYouHave.push({
          label: lp.name,
          detail: "Actief in je KBC-portefeuille (" + lp.costLabel + ")",
          icon: lp.icon
        });
      } else {
        whatIsMissing.push({
          id: lp.id,
          label: lp.name,
          detail: (lp.mandatory ? "Aanbevolen bij " + goalSpec.shortTitle : "Optionele bescherming") + " • " + lp.costLabel,
          costLabel: lp.costLabel,
          icon: lp.icon,
          isProduct: true,
          productType: lp.type
        });
      }
      return {
        id: lp.id,
        name: lp.name,
        type: lp.type,
        costLabel: lp.costLabel,
        mandatory: lp.mandatory,
        icon: lp.icon,
        isOwned: isOwned
      };
    });

    // 6. Uitgaven per categorie (voor Digitaal Profiel & "Waarom zie ik dit?")
    var spendingByCategory = this.computeCategoryBreakdown(customer.transactions || []);

    return {
      customerId: customer.id,
      calculatedAt: new Date().toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      activeGoal: activeGoal,
      goalSpec: goalSpec,
      metrics: {
        avgIncome3m: avgIncome3m,
        avgExpenses3m: avgExpenses3m,
        savingsCapacity: savingsCapacity,
        targetAmount: targetAmount,
        savedAmount: savedAmount,
        remainingAmount: remainingAmount,
        monthsToDeadline: monthsToDeadline,
        neededPerMonth: neededPerMonth,
        ratio: ratio,
        progressPct: progressPct
      },
      status: statusObj,
      steeringOptions: steeringOptions,
      routeAnalysis: {
        whatYouHave: whatYouHave,
        whatIsMissing: whatIsMissing,
        linkedProducts: linkedProductsStatus,
        milestones: goalSpec.routeMilestones || []
      },
      spendingByCategory: spendingByCategory
    };
  },

  computeCategoryBreakdown: function (transactions) {
    var map = {
      "Wonen & Huur/Lening": 0,
      "Boodschappen & Gezin": 0,
      "Vaste Lasten & Energie": 0,
      "Mobiliteit & Reizen": 0,
      "Studie, Vrije Tijd & Overig": 0
    };
    var total = 0;
    transactions.forEach(function (tx) {
      if (tx.amount >= 0) return;
      var amt = Math.abs(tx.amount);
      total += amt;
      var c = (tx.category || "").toLowerCase();
      if (c.indexOf("wonen") !== -1 || c.indexOf("huur") !== -1 || c.indexOf("lening") !== -1) {
        map["Wonen & Huur/Lening"] += amt;
      } else if (c.indexOf("boodschappen") !== -1 || c.indexOf("gezin") !== -1 || c.indexOf("kinderen") !== -1 || c.indexOf("gezondheid") !== -1) {
        map["Boodschappen & Gezin"] += amt;
      } else if (c.indexOf("vaste") !== -1 || c.indexOf("energie") !== -1) {
        map["Vaste Lasten & Energie"] += amt;
      } else if (c.indexOf("mobiliteit") !== -1 || c.indexOf("nood") !== -1 || c.indexOf("brandstof") !== -1) {
        map["Mobiliteit & Reizen"] += amt;
      } else {
        map["Studie, Vrije Tijd & Overig"] += amt;
      }
    });
    var denom = Math.max(1, total);
    return Object.keys(map).map(function (k) {
      var val = Math.round(map[k]);
      return {
        category: k,
        amount: val,
        pct: Math.min(100, Math.round((val / denom) * 100))
      };
    });
  },

  /**
   * Berekent samenvattende statistieken over alle 200 synthetische klanten voor GET /dashboard
   */
  evaluateDashboard200: function () {
    var syn = (window.KBCAura.Synthetic200Customers && window.KBCAura.Synthetic200Customers.customers) || [];
    var counts = { OP_KOERS: 0, BIJSTUREN: 0, PLAN_AANPASSEN: 0 };
    var byGoal = { woning: 0, kot: 0, reis: 0, auto: 0, gezin: 0, pensioen: 0 };
    var totalSaved = 0;
    var totalTarget = 0;

    syn.forEach(function (c) {
      counts[c.status] = (counts[c.status] || 0) + 1;
      byGoal[c.goalType] = (byGoal[c.goalType] || 0) + 1;
      totalSaved += c.savedAmount;
      totalTarget += c.targetAmount;
    });

    return {
      totalCustomers: syn.length,
      totalTransactions: (window.KBCAura.Synthetic200Customers && window.KBCAura.Synthetic200Customers.totalTransactionsGenerated) || 14400,
      statusCounts: counts,
      goalCounts: byGoal,
      totalSavedVolume: totalSaved,
      totalTargetVolume: totalTarget,
      customers: syn
    };
  }
};
