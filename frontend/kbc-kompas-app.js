/**
 * KBC KOMPAS & KBC MOBILE APP CLONE - HOOFD APPLICATIE (frontend/kbc-kompas-app.js)
 * Bevat:
 * 1. Volledig Gekloonde KBC Mobile App met 5 Tabs:
 *    - Tab 1: Start (KBC Home + Kompas Koers Widget + Rekeningen + Acties + Transacties)
 *    - Tab 2: Kompas (Levensplan + Route-analyse + 3-Vragen Onboarding + Bijsturen-Popup)
 *    - Tab 3: Producten (Bankieren, Verzekeren & Beleggen gekoppeld aan je doel)
 *    - Tab 4: Kate (Persoonlijke AI-Coach & Uitleg)
 *    - Tab 5: Instellingen (Mijn Digitaal Profiel aanpassen, "Waarom zie ik dit?", Privacy)
 * 2. KBC Adviseursscherm (GET /adviseur/{klant})
 * 3. 200-Klanten Macro Dashboard (GET /dashboard)
 * 4. Live Event Simulator (Verrassings-uitgave, Nieuwe job, etc.)
 */
window.KBCAura = window.KBCAura || {};

(function () {
  var esc = window.KBCAura.escapeHtml;

  // Applicatie Status
  var state = {
    currentTopView: "split", // "split", "phone_only", "adviseur", "dashboard"
    activeCustomerIndex: 0,
    customers: JSON.parse(JSON.stringify(window.KBCAura.PersonasDatabase || [])),
    activeAppTab: "start", // "start", "kompas", "producten", "kate", "instellingen"
    showSteeringModal: false,
    showOnboardingModal: false,
    onboardingStep: 1,
    tempNewGoal: {
      type: "woning",
      targetAmount: 45000,
      months: 36
    }
  };

  function getActiveCustomer() {
    return state.customers[state.activeCustomerIndex];
  }

  function getKompasEvaluation() {
    var cust = getActiveCustomer();
    return window.KBCAura.KompasEngine.evaluateCustomer(cust);
  }

  // --- Render Hoofdlayout ---
  function renderAll() {
    var appRoot = document.getElementById("kbc-app-root");
    if (!appRoot) return;

    var cust = getActiveCustomer();
    var kompas = getKompasEvaluation();

    var topNavHtml =
      '<header class="top-navbar">' +
        '<div class="brand-wrap">' +
          '<span class="kbc-logo-badge">KBC</span>' +
          '<div class="brand-text">' +
            '<h1>KBC Kompas &amp; Mobile</h1>' +
            '<small>Context-Adaptive Banking &amp; Living Digital Profile PoC</small>' +
          '</div>' +
        '</div>' +
        '<div class="top-view-tabs">' +
          '<button class="view-tab-btn ' + (state.currentTopView === "split" ? "active" : "") + '" data-view="split">🖥️ Split-Screen (Demo)</button>' +
          '<button class="view-tab-btn ' + (state.currentTopView === "phone_only" ? "active" : "") + '" data-view="phone_only">📱 Enkel KBC App</button>' +
          '<button class="view-tab-btn ' + (state.currentTopView === "adviseur" ? "active" : "") + '" data-view="adviseur">👔 KBC Adviseursscherm</button>' +
          '<button class="view-tab-btn ' + (state.currentTopView === "dashboard" ? "active" : "") + '" data-view="dashboard">🌐 200-Klanten Dashboard</button>' +
        '</div>' +
      '</header>';

    var bodyHtml = '<div class="main-stage">';

    if (state.currentTopView === "split" || state.currentTopView === "phone_only") {
      if (state.currentTopView === "split") {
        bodyHtml += '<div class="control-sidebar">' + renderSidebar(cust, kompas) + '</div>';
      }
      bodyHtml += '<div class="phone-stage">' + renderPhone(cust, kompas) + '</div>';
    } else if (state.currentTopView === "adviseur") {
      bodyHtml += '<div style="width:100%;max-width:1100px;margin:0 auto;">' + renderAdviseurView(cust, kompas) + '</div>';
    } else if (state.currentTopView === "dashboard") {
      bodyHtml += '<div style="width:100%;max-width:1200px;margin:0 auto;">' + renderMacroDashboard() + '</div>';
    }

    bodyHtml += '</div>';

    // Modals
    if (state.showSteeringModal) {
      bodyHtml += renderSteeringModal(cust, kompas);
    }
    if (state.showOnboardingModal) {
      bodyHtml += renderOnboardingModal(cust);
    }

    appRoot.innerHTML = topNavHtml + bodyHtml;
    bindEvents(appRoot);
  }

  // --- Linker Sidebar: Persona's + Events Simulator ---
  function renderSidebar(cust, kompas) {
    var personasHtml = state.customers.map(function (c, idx) {
      var isActive = idx === state.activeCustomerIndex;
      return (
        '<button class="persona-btn ' + (isActive ? "active" : "") + '" data-persona-idx="' + idx + '">' +
          '<span class="persona-avatar">' + esc(c.avatar) + '</span>' +
          '<div class="persona-info">' +
            '<strong>' + esc(c.name) + ' (' + c.age + 'j)</strong>' +
            '<small>' + esc(c.situation) + ' • ' + esc(c.city) + '</small>' +
          '</div>' +
        '</button>'
      );
    }).join("");

    var events = window.KBCAura.PlanEventsCatalog || [];
    var eventsHtml = events.map(function (evt) {
      return (
        '<button class="event-btn" data-event-id="' + esc(evt.id) + '" style="border-left-color:' + esc(evt.badgeColor) + '">' +
          '<div>' +
            '<strong>' + esc(evt.title) + '</strong>' +
            '<small>' + esc(evt.description) + '</small>' +
          '</div>' +
          '<span class="event-trigger-tag" style="background:' + esc(evt.badgeColor) + '">Simuleer &rarr;</span>' +
        '</button>'
      );
    }).join("");

    return (
      '<div class="card-control">' +
        '<div class="card-control-header">' +
          '<h2>👤 1. Kies een Demo-Persona</h2>' +
          '<span class="pill-badge">Jasper Spec</span>' +
        '</div>' +
        '<div class="personas-grid">' + personasHtml + '</div>' +
      '</div>' +

      '<div class="card-control">' +
        '<div class="card-control-header">' +
          '<h2>⚡ 2. Simuleer een Live Event</h2>' +
          '<span class="pill-badge">POST /event</span>' +
        '</div>' +
        '<p style="font-size:12px;color:#64748b;margin-bottom:12px;">' +
          'Klik op een gebeurtenis. De Kompas-engine herrekent direct de spaarcapaciteit en ratio, en de KBC-app rechts springt live naar een nieuwe koers!' +
        '</p>' +
        '<div class="events-list">' + eventsHtml + '</div>' +
      '</div>' +

      '<div class="card-control">' +
        '<div class="card-control-header">' +
          '<h2>📐 3. Kompas Formule (Live Cijfers)</h2>' +
          '<span class="pill-badge">' + esc(kompas.status.code) + '</span>' +
        '</div>' +
        '<div style="font-size:12px;line-height:1.6;color:#334155;">' +
          '<div>• <strong>Gem. Inkomen (3 mnd):</strong> €' + kompas.metrics.avgIncome3m + '</div>' +
          '<div>• <strong>Gem. Uitgaven (3 mnd):</strong> €' + kompas.metrics.avgExpenses3m + '</div>' +
          '<div style="color:var(--kbc-blue);font-weight:700;">• Spaarcapaciteit: €' + kompas.metrics.savingsCapacity + ' / mnd</div>' +
          '<div style="margin-top:6px;">• <strong>Resterend doel:</strong> €' + kompas.metrics.remainingAmount.toLocaleString("nl-BE") + ' over ' + kompas.metrics.monthsToDeadline + ' mnd</div>' +
          '<div style="color:#d97706;font-weight:700;">• Nodig per maand: €' + kompas.metrics.neededPerMonth + ' / mnd</div>' +
          '<div style="margin-top:6px;font-size:13px;font-weight:800;color:' + esc(kompas.status.color) + ';">' +
            '• Ratio = ' + kompas.metrics.ratio.toFixed(2).replace(".", ",") + ' &rarr; ' + esc(kompas.status.label) +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // --- Rechter Smartphone: KBC Mobile App Clone ---
  function renderPhone(cust, kompas) {
    var screenContentHtml = "";
    if (state.activeAppTab === "start") {
      screenContentHtml = renderAppStartTab(cust, kompas);
    } else if (state.activeAppTab === "kompas") {
      screenContentHtml = renderAppKompasTab(cust, kompas);
    } else if (state.activeAppTab === "producten") {
      screenContentHtml = renderAppProductenTab(cust, kompas);
    } else if (state.activeAppTab === "kate") {
      screenContentHtml = renderAppKateTab(cust, kompas);
    } else if (state.activeAppTab === "instellingen") {
      screenContentHtml = renderAppSettingsTab(cust, kompas);
    }

    return (
      '<div class="iphone-frame">' +
        '<div class="dynamic-island"></div>' +
        '<div class="phone-status-bar">' +
          '<span>9:41</span>' +
          '<span>5G 📶 98% 🔋</span>' +
        '</div>' +

        '<div class="kbc-app-header">' +
          '<div class="kbc-user-greeting">' +
            '<div class="kbc-user-avatar">' + esc(cust.avatar) + '</div>' +
            '<div>' +
              '<h3>Hoi ' + esc(cust.name.split(" ")[0]) + '</h3>' +
              '<small>' + (cust.isCoupleMode ? "Koppelmodus Samen met " + esc(cust.partnerName) : esc(cust.city)) + '</small>' +
            '</div>' +
          '</div>' +
          '<div class="kbc-header-actions">' +
            '<button class="btn-header-icon btn-open-onboarding" title="Start Nieuw Kompas-Doel">➕</button>' +
            '<button class="btn-header-icon btn-go-settings" title="Mijn Digitaal Profiel">⚙️</button>' +
          '</div>' +
        '</div>' +

        '<div class="phone-screen">' +
          '<div class="app-content">' + screenContentHtml + '</div>' +
        '</div>' +

        '<div class="phone-bottom-nav">' +
          '<button class="tab-nav-item ' + (state.activeAppTab === "start" ? "active" : "") + '" data-tab="start"><span>🏠</span>Start</button>' +
          '<button class="tab-nav-item ' + (state.activeAppTab === "kompas" ? "active" : "") + '" data-tab="kompas"><span>🧭</span>Kompas</button>' +
          '<button class="tab-nav-item ' + (state.activeAppTab === "producten" ? "active" : "") + '" data-tab="producten"><span>🛡️</span>Producten</button>' +
          '<button class="tab-nav-item ' + (state.activeAppTab === "kate" ? "active" : "") + '" data-tab="kate"><span>🤖</span>Kate</button>' +
          '<button class="tab-nav-item ' + (state.activeAppTab === "instellingen" ? "active" : "") + '" data-tab="instellingen"><span>⚙️</span>Profiel</button>' +
        '</div>' +
        '<div class="phone-home-bar"></div>' +
      '</div>'
    );
  }

  // --- Tab 1: Start (KBC Home) ---
  function renderAppStartTab(cust, kompas) {
    var txHtml = (cust.transactions || []).slice(0, 5).map(function (tx) {
      var isNeg = tx.amount < 0;
      var amtStr = (isNeg ? "" : "+") + tx.amount.toFixed(2).replace(".", ",") + " €";
      return (
        '<div class="app-tx-item">' +
          '<div class="app-tx-item-left">' +
            '<strong>' + esc(tx.merchant) + '</strong>' +
            '<small>' + esc(tx.date) + ' • ' + esc(tx.category) + '</small>' +
          '</div>' +
          '<span class="app-tx-item-right ' + (isNeg ? "neg" : "pos") + '">' + amtStr + '</span>' +
        '</div>'
      );
    }).join("");

    return (
      // Kompas Widget bovenaan het startscherm
      '<div class="kompas-hero-card" style="border-top: 4px solid ' + esc(kompas.status.color) + '">' +
        '<div class="kompas-card-top">' +
          '<span class="kompas-tag">🧭 KBC KOMPAS • JE KOERS</span>' +
          '<span class="status-pill status-' + esc(kompas.status.code.toLowerCase().replace(/_/g, "-")) + '">' +
            esc(kompas.status.badgeText) +
          '</span>' +
        '</div>' +

        '<div class="kompas-visual-gauge">' +
          '<div class="kompas-needle-wrap" style="transform: rotate(' + kompas.status.compassAngle + 'deg);">' +
            '🧭' +
          '</div>' +
          '<div class="kompas-headline-text">' +
            '<h4>' + esc(kompas.activeGoal.title) + '</h4>' +
            '<p>' + esc(kompas.status.headline) + '</p>' +
          '</div>' +
        '</div>' +

        '<div class="progress-bar-wrap">' +
          '<div class="progress-labels">' +
            '<span>Voortgang: €' + kompas.metrics.savedAmount.toLocaleString("nl-BE") + '</span>' +
            '<span>Doel: €' + kompas.metrics.targetAmount.toLocaleString("nl-BE") + ' (' + kompas.metrics.progressPct + '%)</span>' +
          '</div>' +
          '<div class="progress-track">' +
            '<div class="progress-fill" style="width:' + kompas.metrics.progressPct + '%;background:' + esc(kompas.status.color) + '"></div>' +
          '</div>' +
        '</div>' +

        '<div class="kompas-metric-ticker">' +
          '<div class="ticker-item"><small>Spaarruimte</small><strong>€' + kompas.metrics.savingsCapacity + '/mnd</strong></div>' +
          '<div class="ticker-item"><small>Nodig</small><strong>€' + kompas.metrics.neededPerMonth + '/mnd</strong></div>' +
          '<div class="ticker-item"><small>Resterend</small><strong>' + kompas.metrics.monthsToDeadline + ' mnd</strong></div>' +
        '</div>' +

        '<button class="btn-bijsturen-action btn-open-steering">' +
          (kompas.status.code === "OP_KOERS" ? "✓ Bekijk Jouw Route &amp; Producten" : "⚡ Nu Bijsturen (3 Opties)") +
        '</button>' +
      '</div>' +

      // Rekeningen
      '<div class="kbc-account-card">' +
        '<div class="account-info">' +
          '<small>' + esc(cust.accounts.checkingIban) + '</small>' +
          '<strong>' + esc(cust.accounts.checkingName) + '</strong>' +
        '</div>' +
        '<span class="account-balance">€ ' + cust.accounts.checkingBalance.toFixed(2).replace(".", ",") + '</span>' +
      '</div>' +

      '<div class="kbc-account-card">' +
        '<div class="account-info">' +
          '<small>' + esc(cust.accounts.savingsIban) + '</small>' +
          '<strong>' + esc(cust.accounts.savingsName) + '</strong>' +
        '</div>' +
        '<span class="account-balance" style="color:var(--kbc-blue);">€ ' + cust.accounts.savingsBalance.toFixed(2).replace(".", ",") + '</span>' +
      '</div>' +

      (cust.accounts.jointIban
        ? '<div class="kbc-account-card" style="border-left: 3px solid #ec4899;">' +
            '<div class="account-info">' +
              '<small>' + esc(cust.accounts.jointIban) + ' • Samen met ' + esc(cust.partnerName) + '</small>' +
              '<strong>Gezamenlijke KBC-Rekening</strong>' +
            '</div>' +
            '<span class="account-balance">€ ' + cust.accounts.jointBalance.toFixed(2).replace(".", ",") + '</span>' +
          '</div>'
        : '') +

      // Snelle KBC Acties
      '<div class="kbc-quick-actions">' +
        '<button class="quick-action-btn btn-sim-transfer"><span>💶</span><small>Overschrijven</small></button>' +
        '<button class="quick-action-btn btn-sim-payconiq"><span>📱</span><small>Payconiq / QR</small></button>' +
        '<button class="quick-action-btn btn-open-onboarding"><span>🎯</span><small>Nieuw Doel</small></button>' +
        '<button class="quick-action-btn btn-sim-nmbs"><span>🚆</span><small>NMBS / 4411</small></button>' +
      '</div>' +

      // Recente Transacties
      '<div class="app-tx-card">' +
        '<div class="app-tx-header">' +
          '<h4>Recente verrichtingen</h4>' +
          '<small style="color:var(--kbc-cyan);font-weight:700;cursor:pointer;">Alles &gt;</small>' +
        '</div>' +
        txHtml +
      '</div>'
    );
  }

  // --- Tab 2: Kompas (Levensplan & Route-analyse) ---
  function renderAppKompasTab(cust, kompas) {
    var routeHaveHtml = kompas.routeAnalysis.whatYouHave.map(function (item) {
      return (
        '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:12px;">' +
          '<span style="font-size:18px;">' + esc(item.icon) + '</span>' +
          '<div style="flex:1;">' +
            '<strong>' + esc(item.label) + '</strong>' +
            '<small style="display:block;color:#64748b;">' + esc(item.detail) + '</small>' +
          '</div>' +
          '<span style="color:var(--status-green);font-weight:800;">✓ In orde</span>' +
        '</div>'
      );
    }).join("");

    var routeMissingHtml = kompas.routeAnalysis.whatIsMissing.map(function (item) {
      return (
        '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:12px;">' +
          '<span style="font-size:18px;">' + esc(item.icon) + '</span>' +
          '<div style="flex:1;">' +
            '<strong>' + esc(item.label) + '</strong>' +
            '<small style="display:block;color:#dc2626;">' + esc(item.detail) + '</small>' +
          '</div>' +
          '<button class="btn-activate-product" data-prod-id="' + esc(item.id) + '" style="background:var(--kbc-cyan);color:#fff;border:none;padding:4px 8px;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;">' +
            '+ Koppel' +
          '</button>' +
        '</div>'
      );
    }).join("");

    var goalsListHtml = (cust.goals || []).map(function (g) {
      var isCurrent = g.id === cust.activeGoalId;
      return (
        '<button class="btn-switch-goal" data-goal-id="' + esc(g.id) + '" style="padding:6px 12px;border-radius:16px;border:1px solid ' + (isCurrent ? 'var(--kbc-cyan)' : '#cbd5e1') + ';background:' + (isCurrent ? '#f0f9ff' : '#fff') + ';font-size:11px;font-weight:700;color:' + (isCurrent ? 'var(--kbc-blue)' : '#475569') + ';cursor:pointer;">' +
          (isCurrent ? '● ' : '') + esc(g.title) +
        '</button>'
      );
    }).join(" ");

    return (
      '<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;">' +
        goalsListHtml +
        '<button class="btn-open-onboarding" style="padding:6px 10px;border-radius:16px;border:1px dashed var(--kbc-cyan);background:#fff;font-size:11px;font-weight:700;color:var(--kbc-cyan);cursor:pointer;">+ Nieuw Doel</button>' +
      '</div>' +

      '<div class="kompas-hero-card" style="border-top: 4px solid ' + esc(kompas.status.color) + '">' +
        '<div class="kompas-card-top">' +
          '<span class="kompas-tag">🧭 ' + esc(kompas.goalSpec.title) + '</span>' +
          '<span class="status-pill status-' + esc(kompas.status.code.toLowerCase().replace(/_/g, "-")) + '">' +
            esc(kompas.status.badgeText) +
          '</span>' +
        '</div>' +
        '<p style="font-size:12px;color:#334155;line-height:1.45;margin-bottom:12px;">' +
          esc(kompas.status.adviceText) +
        '</p>' +
        '<button class="btn-bijsturen-action btn-open-steering">⚡ Bekijk Bijstuur-Opties &amp; Simulatie</button>' +
      '</div>' +

      // Route ernaartoe: Wat heb je al vs Wat ontbreekt nog
      '<div class="card-control" style="padding:14px;">' +
        '<h4 style="font-size:13px;color:var(--kbc-blue);margin-bottom:10px;">✅ Wat je al hebt voor dit doel</h4>' +
        routeHaveHtml +
      '</div>' +

      '<div class="card-control" style="padding:14px;">' +
        '<h4 style="font-size:13px;color:#dc2626;margin-bottom:10px;">⚠️ Wat nog ontbreekt op je route</h4>' +
        (routeMissingHtml || '<p style="font-size:12px;color:var(--status-green);">Alles staat klaar op je route! 🎉</p>') +
      '</div>'
    );
  }

  // --- Tab 3: Producten ---
  function renderAppProductenTab(cust, kompas) {
    var insHtml = (cust.activeInsurances || []).map(function (ins) {
      return (
        '<div style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:12px;display:flex;justify-content:space-between;align-items:center;">' +
          '<div><strong>' + esc(ins.id) + '</strong><small style="display:block;color:#64748b;">' + esc(ins.detail) + '</small></div>' +
          '<span style="font-weight:700;color:var(--kbc-blue);">€' + ins.monthlyCost.toFixed(2) + '/mnd</span>' +
        '</div>'
      );
    }).join("");

    return (
      '<div class="card-control" style="padding:14px;">' +
        '<h3 style="font-size:14px;color:var(--kbc-blue);margin-bottom:10px;">Gekoppelde Producten aan ' + esc(kompas.activeGoal.title) + '</h3>' +
        '<p style="font-size:12px;color:#64748b;margin-bottom:12px;">KBC koppelt automatisch bankieren, verzekeren en beleggen aan jouw gekozen Kompas-bestemming.</p>' +
        '<div style="display:flex;flex-direction:column;gap:8px;">' +
          (kompas.goalSpec.linkedProducts || []).map(function (p) {
            return (
              '<div style="background:#f8fafc;padding:10px;border-radius:8px;border:1px solid #e2e8f0;display:flex;align-items:center;gap:10px;">' +
                '<span style="font-size:22px;">' + esc(p.icon) + '</span>' +
                '<div style="flex:1;">' +
                  '<strong style="font-size:12px;">' + esc(p.name) + '</strong>' +
                  '<small style="display:block;color:#64748b;">' + esc(p.costLabel) + ' • ' + (p.mandatory ? 'Aanbevolen' : 'Optioneel') + '</small>' +
                '</div>' +
              '</div>'
            );
          }).join("") +
        '</div>' +
      '</div>' +

      '<div class="card-control" style="padding:14px;">' +
        '<h4 style="font-size:13px;color:var(--kbc-blue);margin-bottom:10px;">Lopende KBC Verzekeringen</h4>' +
        insHtml +
      '</div>'
    );
  }

  // --- Tab 4: Kate & Persoonlijke Kompas Coach ---
  function renderAppKateTab(cust, kompas) {
    return (
      '<div class="card-control" style="padding:16px;">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">' +
          '<div style="width:40px;height:40px;border-radius:50%;background:var(--kbc-cyan);color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;">🤖</div>' +
          '<div>' +
            '<h3 style="font-size:14px;color:var(--kbc-blue);">Kate • Jouw Kompas Co-Piloot</h3>' +
            '<small style="color:#64748b;">"Ik gok niet meer, jij kiest de richting!"</small>' +
          '</div>' +
        '</div>' +

        '<div style="background:#f0f9ff;border-left:3px solid var(--kbc-cyan);padding:12px;border-radius:6px;font-size:12px;line-height:1.45;color:#0369a1;margin-bottom:14px;">' +
          'Hoi ' + esc(cust.name.split(" ")[0]) + '! Je bestemming staat ingesteld op <strong>' + esc(kompas.activeGoal.title) + '</strong>. ' +
          'Elke maand controleer ik je transacties en loonstorting om te checken of je nog op koers ligt. ' +
          'Huidige status: <strong>' + esc(kompas.status.label) + '</strong> (Ratio ' + kompas.metrics.ratio + ').' +
        '</div>' +

        '<h4 style="font-size:12px;color:var(--kbc-blue);margin-bottom:8px;">Veelgestelde vragen voor jouw doel:</h4>' +
        '<button class="quick-action-btn" style="width:100%;text-align:left;padding:8px 12px;margin-bottom:6px;align-items:flex-start;">' +
          '<strong style="font-size:11px;color:var(--kbc-blue);">❓ Hoe kan ik €50/mnd sneller sparen zonder pijn?</strong>' +
        '</button>' +
        '<button class="quick-action-btn" style="width:100%;text-align:left;padding:8px 12px;margin-bottom:6px;align-items:flex-start;">' +
          '<strong style="font-size:11px;color:var(--kbc-blue);">❓ Welke verzekering is verplicht als ik een huis koop?</strong>' +
        '</button>' +
        '<button class="quick-action-btn" style="width:100%;text-align:left;padding:8px 12px;margin-bottom:6px;align-items:flex-start;">' +
          '<strong style="font-size:11px;color:var(--kbc-blue);">❓ Wat als mijn partner en ik samen willen sparen?</strong>' +
        '</button>' +
      '</div>'
    );
  }

  // --- Tab 5: Instellingen (Mijn Digitaal Profiel & Privacy) ---
  function renderAppSettingsTab(cust, kompas) {
    var prefs = cust.userPreferences || {};
    var priv = prefs.privacySettings || {};

    return (
      '<div class="settings-group">' +
        '<h4>⚙️ Mijn Digitaal Profiel (Live Bewerkbaar)</h4>' +
        '<p style="font-size:11px;color:#64748b;margin-bottom:10px;">Pas hier je profielgegevens aan. De KBC-app en je Kompas-koers rekenen direct live mee!</p>' +

        '<div class="setting-row">' +
          '<span>Naam</span>' +
          '<input type="text" class="setting-input-text inp-profile-name" value="' + esc(cust.name) + '" />' +
        '</div>' +

        '<div class="setting-row">' +
          '<span>Leeftijd</span>' +
          '<input type="number" class="setting-input-text inp-profile-age" style="width:70px;" value="' + cust.age + '" />' +
        '</div>' +

        '<div class="setting-row">' +
          '<span>Gezinssituatie</span>' +
          '<input type="text" class="setting-input-text inp-profile-situation" value="' + esc(cust.situation) + '" />' +
        '</div>' +

        '<div class="setting-row">' +
          '<span>Koppelmodus</span>' +
          '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;">' +
            '<input type="checkbox" class="chk-couple-mode" ' + (cust.isCoupleMode ? 'checked' : '') + ' />' +
            '<small>' + (cust.isCoupleMode ? 'Samen sparen met partner' : 'Alleen') + '</small>' +
          '</label>' +
        '</div>' +

        '<div class="setting-row">' +
          '<span>Gem. Maandinkomen (3 mnd)</span>' +
          '<input type="number" class="setting-input-text inp-profile-income" style="width:100px;" value="' + Math.round(cust.avgMonthlyIncome3m) + '" />' +
        '</div>' +

        '<div class="setting-row">' +
          '<span>Gem. Maanduitgaven (3 mnd)</span>' +
          '<input type="number" class="setting-input-text inp-profile-expenses" style="width:100px;" value="' + Math.round(cust.avgMonthlyExpenses3m) + '" />' +
        '</div>' +

        '<div class="setting-row">' +
          '<span>Huidig Spaargeld</span>' +
          '<input type="number" class="setting-input-text inp-profile-savings" style="width:100px;" value="' + Math.round(cust.accounts.savingsBalance) + '" />' +
        '</div>' +

        '<button class="btn-save-profile" style="width:100%;margin-top:10px;background:var(--kbc-blue);color:#fff;border:none;padding:8px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">' +
          '💾 Profiel-Wijzigingen Opslaan' +
        '</button>' +
      '</div>' +

      // "Waarom zie ik dit?"
      '<div class="settings-group">' +
        '<h4>🔍 "Waarom zie ik dit?" (Cijfer-Uitleg)</h4>' +
        '<div class="explain-box">' +
          '<strong>Gebruikte Kompas-Formule &amp; Data:</strong>' +
          '• Spaarcapaciteit = Inkomen (€' + kompas.metrics.avgIncome3m + ') - Uitgaven (€' + kompas.metrics.avgExpenses3m + ') = <strong>€' + kompas.metrics.savingsCapacity + ' / mnd</strong>.<br/>' +
          '• Doelbedrag: €' + kompas.metrics.targetAmount.toLocaleString("nl-BE") + ' - Gespaard: €' + kompas.metrics.savedAmount.toLocaleString("nl-BE") + ' = Resterend €' + kompas.metrics.remainingAmount.toLocaleString("nl-BE") + '.<br/>' +
          '• Nodig per maand over ' + kompas.metrics.monthsToDeadline + ' mnd = <strong>€' + kompas.metrics.neededPerMonth + ' / mnd</strong>.<br/>' +
          '• Ratio = ' + kompas.metrics.savingsCapacity + ' / ' + kompas.metrics.neededPerMonth + ' = <strong>' + kompas.metrics.ratio + ' (' + esc(kompas.status.label) + ')</strong>.' +
        '</div>' +
      '</div>' +

      // Privacy Schakelaars
      '<div class="settings-group">' +
        '<h4>🛡️ Privacy &amp; Toegestane Data</h4>' +
        '<div class="setting-row"><span>Transactie-analyse (3 mnd)</span><input type="checkbox" class="chk-priv-tx" ' + (priv.allowTransactionAnalysis ? 'checked' : '') + ' /></div>' +
        '<div class="setting-row"><span>Loon- &amp; Inkomensdetectie</span><input type="checkbox" class="chk-priv-inc" ' + (priv.allowIncomeTracking ? 'checked' : '') + ' /></div>' +
        '<div class="setting-row"><span>Product- &amp; Verzekeringskoppeling</span><input type="checkbox" class="chk-priv-prod" ' + (priv.allowProductMatching ? 'checked' : '') + ' /></div>' +
        '<div class="setting-row"><span>Inzicht delen met KBC Adviseur</span><input type="checkbox" class="chk-priv-adv" ' + (priv.allowAdvisorSharing ? 'checked' : '') + ' /></div>' +
      '</div>'
    );
  }

  // --- Modal: Bijsturen (3 Opties van Jasper!) ---
  function renderSteeringModal(cust, kompas) {
    var opts = kompas.steeringOptions || [];
    var optsHtml = opts.map(function (opt) {
      return (
        '<div class="steering-option-card ' + (opt.recommended ? 'recommended' : '') + '" data-opt-id="' + esc(opt.id) + '">' +
          '<span class="opt-radio-icon">' + esc(opt.icon) + '</span>' +
          '<div class="opt-details" style="flex:1;">' +
            '<strong>' + esc(opt.title) + '</strong>' +
            '<small>' + esc(opt.subtitle) + '</small>' +
            '<span class="opt-impact">' + esc(opt.impactLabel) + '</span>' +
          '</div>' +
          '<button class="btn-apply-steering" data-opt-type="' + esc(opt.type) + '" style="background:var(--kbc-blue);color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">' +
            'Kies &gt;' +
          '</button>' +
        '</div>'
      );
    }).join("");

    return (
      '<div class="kbc-modal-backdrop">' +
        '<div class="kbc-modal-sheet">' +
          '<div class="kbc-modal-header">' +
            '<h3>⚡ KBC Kompas Bijsturen</h3>' +
            '<button class="btn-close-modal">✕</button>' +
          '</div>' +
          '<p style="font-size:12px;color:#64748b;margin-bottom:14px;">' +
            'Jij bepaalt de richting! Kies hoe je jouw plan voor <strong>\'' + esc(kompas.activeGoal.title) + '\'</strong> weer gezond op koers brengt:' +
          '</p>' +
          optsHtml +
        '</div>' +
      '</div>'
    );
  }

  // --- Modal: 3-Vragen Onboarding Wizard (1 minuut) ---
  function renderOnboardingModal(cust) {
    var cat = window.KBCAura.GoalCatalog || {};
    var step1Html = Object.keys(cat).map(function (k) {
      var g = cat[k];
      var isSel = state.tempNewGoal.type === k;
      return (
        '<button class="goal-pick-btn" data-goal-type="' + k + '" style="background:' + (isSel ? '#f0f9ff' : '#fff') + ';border:2px solid ' + (isSel ? 'var(--kbc-cyan)' : '#e2e8f0') + ';border-radius:8px;padding:10px;display:flex;align-items:center;gap:10px;cursor:pointer;text-align:left;width:100%;margin-bottom:8px;">' +
          '<span style="font-size:24px;">' + esc(g.icon) + '</span>' +
          '<div>' +
            '<strong style="font-size:13px;color:var(--kbc-blue);">' + esc(g.title) + '</strong>' +
            '<small style="display:block;color:#64748b;font-size:11px;">Standaard richtbedrag: €' + g.defaultTargetAmount.toLocaleString("nl-BE") + ' over ' + g.defaultMonths + ' mnd</small>' +
          '</div>' +
        '</button>'
      );
    }).join("");

    return (
      '<div class="kbc-modal-backdrop">' +
        '<div class="kbc-modal-sheet">' +
          '<div class="kbc-modal-header">' +
            '<h3>🧭 Nieuwe Bestemming Kiezen (Stap ' + state.onboardingStep + ' van 3)</h3>' +
            '<button class="btn-close-modal">✕</button>' +
          '</div>' +

          (state.onboardingStep === 1
            ? '<div>' +
                '<p style="font-size:12px;color:#64748b;margin-bottom:12px;"><strong>Vraag 1:</strong> Wat is je belangrijkste levensdoel voor de komende 5 jaar?</p>' +
                step1Html +
                '<button class="btn-onboarding-next" style="width:100%;margin-top:10px;background:var(--kbc-blue);color:#fff;border:none;padding:10px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">' +
                  'Volgende Stap &rarr;' +
                '</button>' +
              '</div>'
            : (state.onboardingStep === 2
              ? '<div>' +
                  '<p style="font-size:12px;color:#64748b;margin-bottom:12px;"><strong>Vraag 2:</strong> Welk bedrag en welke deadline heb je voor ogen?</p>' +
                  '<div style="margin-bottom:12px;">' +
                    '<label style="display:block;font-size:12px;font-weight:700;margin-bottom:4px;">Doelbedrag: €' + state.tempNewGoal.targetAmount.toLocaleString("nl-BE") + '</label>' +
                    '<input type="range" class="rng-onboarding-amount" min="2000" max="100000" step="1000" value="' + state.tempNewGoal.targetAmount + '" style="width:100%;" />' +
                  '</div>' +
                  '<div style="margin-bottom:16px;">' +
                    '<label style="display:block;font-size:12px;font-weight:700;margin-bottom:4px;">Deadline: ' + state.tempNewGoal.months + ' maanden</label>' +
                    '<input type="range" class="rng-onboarding-months" min="3" max="60" step="1" value="' + state.tempNewGoal.months + '" style="width:100%;" />' +
                  '</div>' +
                  '<button class="btn-onboarding-finish" style="width:100%;background:var(--kbc-cyan);color:#fff;border:none;padding:10px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">' +
                    '✓ Activeer Nieuw Kompas-Doel' +
                  '</button>' +
                '</div>'
              : '')) +
        '</div>' +
      '</div>'
    );
  }

  // --- KBC Adviseursscherm (GET /adviseur/{klant}) ---
  function renderAdviseurView(cust, kompas) {
    return (
      '<div class="card-control">' +
        '<div class="card-control-header">' +
          '<h2>👔 KBC Adviseurs-Cockpit (GET /adviseur/' + esc(cust.id) + ')</h2>' +
          '<span class="pill-badge">Kantoor-perspectief</span>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:14px;">' +
          '<div style="background:#f8fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0;">' +
            '<h3 style="font-size:14px;color:var(--kbc-blue);margin-bottom:8px;">Klantdossier: ' + esc(cust.name) + '</h3>' +
            '<div style="font-size:12px;line-height:1.7;">' +
              '<div>• <strong>Leeftijd &amp; Woonplaats:</strong> ' + cust.age + ' jaar, ' + esc(cust.city) + '</div>' +
              '<div>• <strong>Gezinssituatie:</strong> ' + esc(cust.situation) + '</div>' +
              '<div>• <strong>Spaarcapaciteit:</strong> €' + kompas.metrics.savingsCapacity + ' / maand</div>' +
              '<div>• <strong>Actief Levensdoel:</strong> ' + esc(kompas.activeGoal.title) + '</div>' +
              '<div>• <strong>Kompas Status:</strong> <span style="font-weight:800;color:' + esc(kompas.status.color) + ';">' + esc(kompas.status.badgeText) + '</span></div>' +
            '</div>' +
          '</div>' +
          '<div style="background:#eff6ff;padding:16px;border-radius:8px;border:1px solid #bfdbfe;">' +
            '<h3 style="font-size:14px;color:#1e40af;margin-bottom:8px;">💡 Aanbevolen Gespreksonderwerp voor Adviseur</h3>' +
            '<p style="font-size:12px;line-height:1.5;color:#1e3a8a;">' +
              (kompas.status.code === "OP_KOERS"
                ? "Klant ligt uitstekend op schema voor zijn/haar doel. Bevestig de route en controleer of de gekoppelde verzekeringen (zoals schuldsaldo of brandpolis) al klaargezet kunnen worden."
                : "Klant heeft een tekort van €" + Math.max(10, kompas.metrics.neededPerMonth - kompas.metrics.savingsCapacity) + "/mnd. Bespreek tijdens het adviesgesprek optie 1 (deadline + " + kompas.steeringOptions[0].extraMonthsNeeded + " maanden) of help met budgetspreiding.") +
            '</p>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // --- 200-Klanten Macro Dashboard (GET /dashboard) ---
  function renderMacroDashboard() {
    var dash = window.KBCAura.KompasEngine.evaluateDashboard200();

    var rowsHtml = (dash.customers || []).slice(0, 20).map(function (c) {
      var badgeStyle = c.status === "OP_KOERS"
        ? "background:#ecfdf5;color:#10b981;"
        : (c.status === "BIJSTUREN" ? "background:#fffbeb;color:#f59e0b;" : "background:#fef2f2;color:#dc2626;");
      return (
        '<tr style="border-bottom:1px solid #f1f5f9;font-size:12px;">' +
          '<td style="padding:8px;"><strong>' + esc(c.name) + '</strong> (' + c.age + 'j)</td>' +
          '<td style="padding:8px;">' + esc(c.city) + '</td>' +
          '<td style="padding:8px;">' + esc(c.goalLabel) + '</td>' +
          '<td style="padding:8px;">€' + c.targetAmount.toLocaleString("nl-BE") + '</td>' +
          '<td style="padding:8px;">€' + c.savingsCapacity + ' / mnd</td>' +
          '<td style="padding:8px;"><span style="padding:2px 8px;border-radius:12px;font-weight:700;' + badgeStyle + '">' + esc(c.status) + ' (' + c.ratio + ')</span></td>' +
        '</tr>'
      );
    }).join("");

    return (
      '<div class="card-control">' +
        '<div class="card-control-header">' +
          '<h2>🌐 KBC Kompas Macro-Dashboard (200 Synthetische Klanten)</h2>' +
          '<span class="pill-badge">GET /dashboard</span>' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:14px;margin:16px 0;">' +
          '<div class="ticker-item" style="padding:14px;">' +
            '<small>Totaal Geanalyseerd</small><strong style="font-size:20px;">' + dash.totalCustomers + ' klanten</strong>' +
            '<span style="font-size:10px;color:#64748b;">(' + dash.totalTransactions.toLocaleString("nl-BE") + ' transacties)</span>' +
          '</div>' +
          '<div class="ticker-item" style="padding:14px;border-top:3px solid var(--status-green);">' +
            '<small>🟢 Op Koers</small><strong style="font-size:20px;color:var(--status-green);">' + dash.statusCounts.OP_KOERS + '</strong>' +
            '<span style="font-size:10px;color:#64748b;">(' + Math.round((dash.statusCounts.OP_KOERS / dash.totalCustomers) * 100) + '%)</span>' +
          '</div>' +
          '<div class="ticker-item" style="padding:14px;border-top:3px solid var(--status-amber);">' +
            '<small>🟠 Bijsturen</small><strong style="font-size:20px;color:var(--status-amber);">' + dash.statusCounts.BIJSTUREN + '</strong>' +
            '<span style="font-size:10px;color:#64748b;">(' + Math.round((dash.statusCounts.BIJSTUREN / dash.totalCustomers) * 100) + '%)</span>' +
          '</div>' +
          '<div class="ticker-item" style="padding:14px;border-top:3px solid var(--status-red);">' +
            '<small>🔴 Plan Aanpassen</small><strong style="font-size:20px;color:var(--status-red);">' + dash.statusCounts.PLAN_AANPASSEN + '</strong>' +
            '<span style="font-size:10px;color:#64748b;">(' + Math.round((dash.statusCounts.PLAN_AANPASSEN / dash.totalCustomers) * 100) + '%)</span>' +
          '</div>' +
        '</div>' +

        '<h3 style="font-size:13px;color:var(--kbc-blue);margin:16px 0 8px;">Klantendossiers Sample (Eerste 20 van 200):</h3>' +
        '<div style="overflow-x:auto;">' +
          '<table style="width:100%;border-collapse:collapse;text-align:left;">' +
            '<thead style="background:#f8fafc;color:#64748b;font-size:11px;text-transform:uppercase;">' +
              '<tr>' +
                '<th style="padding:8px;">Klant</th>' +
                '<th style="padding:8px;">Stad</th>' +
                '<th style="padding:8px;">Kompas Doel</th>' +
                '<th style="padding:8px;">Doelbedrag</th>' +
                '<th style="padding:8px;">Spaarruimte</th>' +
                '<th style="padding:8px;">Status &amp; Ratio</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' + rowsHtml + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>'
    );
  }

  // --- Event Handlers & Binding ---
  function bindEvents(root) {
    // Top view switcher
    root.querySelectorAll(".view-tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.currentTopView = btn.getAttribute("data-view");
        renderAll();
      });
    });

    // Persona switcher
    root.querySelectorAll(".persona-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.activeCustomerIndex = parseInt(btn.getAttribute("data-persona-idx"), 10);
        renderAll();
      });
    });

    // App Bottom tabs
    root.querySelectorAll(".tab-nav-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.activeAppTab = btn.getAttribute("data-tab");
        renderAll();
      });
    });

    // Header buttons
    var btnGoSettings = root.querySelector(".btn-go-settings");
    if (btnGoSettings) {
      btnGoSettings.addEventListener("click", function () {
        state.activeAppTab = "instellingen";
        renderAll();
      });
    }

    // Modal triggers
    root.querySelectorAll(".btn-open-steering").forEach(function (b) {
      b.addEventListener("click", function () {
        state.showSteeringModal = true;
        renderAll();
      });
    });

    root.querySelectorAll(".btn-open-onboarding").forEach(function (b) {
      b.addEventListener("click", function () {
        state.showOnboardingModal = true;
        state.onboardingStep = 1;
        renderAll();
      });
    });

    root.querySelectorAll(".btn-close-modal").forEach(function (b) {
      b.addEventListener("click", function () {
        state.showSteeringModal = false;
        state.showOnboardingModal = false;
        renderAll();
      });
    });

    // Switch between existing goals
    root.querySelectorAll(".btn-switch-goal").forEach(function (b) {
      b.addEventListener("click", function () {
        var gid = b.getAttribute("data-goal-id");
        getActiveCustomer().activeGoalId = gid;
        renderAll();
      });
    });

    // Live Event Simulator Knop geklikt!
    root.querySelectorAll(".event-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var evtId = b.getAttribute("data-event-id");
        var catalog = window.KBCAura.PlanEventsCatalog || [];
        var evt = catalog.find(function (e) { return e.id === evtId; });
        if (!evt) return;

        var cust = getActiveCustomer();
        // Pas effect toe
        if (evt.effect.savingsDelta) {
          cust.accounts.savingsBalance = Math.max(0, cust.accounts.savingsBalance + evt.effect.savingsDelta);
          var activeG = (cust.goals || []).find(function (g) { return g.id === cust.activeGoalId; });
          if (activeG) activeG.savedAmount = Math.max(0, activeG.savedAmount + evt.effect.savingsDelta);
        }
        if (evt.effect.checkingDelta) {
          cust.accounts.checkingBalance = Math.max(0, cust.accounts.checkingBalance + evt.effect.checkingDelta);
        }
        if (evt.effect.monthlyIncomeDelta) {
          cust.avgMonthlyIncome3m = Math.max(800, cust.avgMonthlyIncome3m + evt.effect.monthlyIncomeDelta);
        }
        if (evt.effect.monthlyExpensesDelta) {
          cust.avgMonthlyExpenses3m = Math.max(600, cust.avgMonthlyExpenses3m + evt.effect.monthlyExpensesDelta);
        }
        if (evt.effect.transaction) {
          cust.transactions.unshift(evt.effect.transaction);
        }
        cust.planEvents.unshift({
          id: "pe-" + Date.now(),
          date: "Vandaag",
          type: evt.type,
          label: evt.title
        });

        renderAll();
      });
    });

    // Bijsturen toepassing
    root.querySelectorAll(".btn-apply-steering").forEach(function (b) {
      b.addEventListener("click", function () {
        var optType = b.getAttribute("data-opt-type");
        var cust = getActiveCustomer();
        var kompas = getKompasEvaluation();
        var opt = (kompas.steeringOptions || []).find(function (o) { return o.type === optType; });
        var activeG = (cust.goals || []).find(function (g) { return g.id === cust.activeGoalId; });

        if (optType === "SHIFT_DEADLINE" && opt && activeG) {
          activeG.monthsToDeadline = opt.newMonthsToDeadline;
        } else if (optType === "LOWER_TARGET" && opt && activeG) {
          activeG.targetAmount = opt.newTargetAmount;
        } else if (optType === "SAVE_MORE" && opt) {
          cust.avgMonthlyExpenses3m = Math.max(500, cust.avgMonthlyExpenses3m - opt.expenseReduction);
        }

        state.showSteeringModal = false;
        renderAll();
      });
    });

    // Onboarding wizard handlers
    root.querySelectorAll(".goal-pick-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var gt = b.getAttribute("data-goal-type");
        var spec = (window.KBCAura.GoalCatalog && window.KBCAura.GoalCatalog[gt]) || {};
        state.tempNewGoal.type = gt;
        state.tempNewGoal.targetAmount = spec.defaultTargetAmount || 15000;
        state.tempNewGoal.months = spec.defaultMonths || 24;
        renderAll();
      });
    });

    var btnNext = root.querySelector(".btn-onboarding-next");
    if (btnNext) {
      btnNext.addEventListener("click", function () {
        state.onboardingStep = 2;
        renderAll();
      });
    }

    var rngAmount = root.querySelector(".rng-onboarding-amount");
    if (rngAmount) {
      rngAmount.addEventListener("input", function (e) {
        state.tempNewGoal.targetAmount = parseInt(e.target.value, 10);
      });
    }
    var rngMonths = root.querySelector(".rng-onboarding-months");
    if (rngMonths) {
      rngMonths.addEventListener("input", function (e) {
        state.tempNewGoal.months = parseInt(e.target.value, 10);
      });
    }

    var btnFinish = root.querySelector(".btn-onboarding-finish");
    if (btnFinish) {
      btnFinish.addEventListener("click", function () {
        var cust = getActiveCustomer();
        var spec = window.KBCAura.GoalCatalog[state.tempNewGoal.type];
        var newGoalId = "goal-" + Date.now();
        cust.goals = cust.goals || [];
        cust.goals.unshift({
          id: newGoalId,
          type: state.tempNewGoal.type,
          title: spec.title,
          targetAmount: state.tempNewGoal.targetAmount,
          savedAmount: Math.round(state.tempNewGoal.targetAmount * 0.15),
          monthsToDeadline: state.tempNewGoal.months,
          createdAt: "Vandaag"
        });
        cust.activeGoalId = newGoalId;
        state.showOnboardingModal = false;
        state.activeAppTab = "kompas";
        renderAll();
      });
    }

    // Save profile form in Instellingen
    var btnSaveProfile = root.querySelector(".btn-save-profile");
    if (btnSaveProfile) {
      btnSaveProfile.addEventListener("click", function () {
        var cust = getActiveCustomer();
        cust.name = root.querySelector(".inp-profile-name").value;
        cust.age = parseInt(root.querySelector(".inp-profile-age").value, 10) || cust.age;
        cust.situation = root.querySelector(".inp-profile-situation").value;
        cust.isCoupleMode = root.querySelector(".chk-couple-mode").checked;
        cust.avgMonthlyIncome3m = parseFloat(root.querySelector(".inp-profile-income").value) || cust.avgMonthlyIncome3m;
        cust.avgMonthlyExpenses3m = parseFloat(root.querySelector(".inp-profile-expenses").value) || cust.avgMonthlyExpenses3m;
        cust.accounts.savingsBalance = parseFloat(root.querySelector(".inp-profile-savings").value) || cust.accounts.savingsBalance;

        alert("✓ Digitaal Profiel succesvol opgeslagen! De Kompas-koers is direct herberekend.");
        renderAll();
      });
    }

    // Quick demo actions
    var btnSimTransfer = root.querySelector(".btn-sim-transfer");
    if (btnSimTransfer) {
      btnSimTransfer.addEventListener("click", function () {
        var cust = getActiveCustomer();
        var bedrag = 50;
        cust.accounts.checkingBalance -= bedrag;
        cust.transactions.unshift({
          id: "tx-" + Date.now(),
          date: "Zojuist",
          merchant: "Overschrijving naar Spaarrekening Kompas",
          amount: -bedrag,
          category: "Sparen",
          mcc: "6012",
          location: "KBC Mobile"
        });
        cust.accounts.savingsBalance += bedrag;
        var ag = (cust.goals || []).find(function (g) { return g.id === cust.activeGoalId; });
        if (ag) ag.savedAmount += bedrag;
        renderAll();
      });
    }
  }

  // Initialiseer wanneer DOM geladen is
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAll);
  } else {
    renderAll();
  }
})();
