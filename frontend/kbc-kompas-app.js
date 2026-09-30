/**
 * KBC KOMPAS & KBC MOBILE APP CLONE - HOOFD APPLICATIE (frontend/kbc-kompas-app.js)
 * 
 * Bevat 2 gescheiden werelden:
 * 1. KLANTAPP (KBC Mobile interface):
 *    - Telefoonframe met KBC-kleuren & Dynamic Island
 *    - Tab 1: Start (Rekeningen, Kompas Koers Widget, Snelle Acties, Transacties)
 *    - Tab 2: Kompas (Halve cirkelmeter met naald, route, deadline, "Waarom zie ik dit?", Bijsturen modal)
 *    - Tab 3: Producten (Gekoppeld aan het doel: wat je hebt vs. wat nog ontbreekt)
 *    - Tab 4: Kate AI-Coach
 *    - Tab 5: Mijn Profiel & Instellingen (Doel wijzigen, budget aanpassen)
 * 
 * 2. KBC-MEDEWERKER INTERFACE ("KBC Pro / Portefeuille Kompas"):
 *    - Professioneel portaal voor adviseurs en kantoormedewerkers
 *    - Macro KPI-balk over de 200 klanten
 *    - Geavanceerde zoekbalk & filters (Status, Doel, Stad)
 *    - Interactieve 200-klanten portefeuillelijst
 *    - Klikken op ELKE persoon opent een diepgaand KLANTDOSSIER:
 *      * Tab Overzicht & Kompas (ratio, nodige inleg, kantoor, IBAN's)
 *      * Tab 12-Maanden Cashflow (grafiek met inkomsten, uitgaven en maandelijkse netto-opbouw)
 *      * Tab Transactiehistorie (volledig overzicht van reële transacties per categorie)
 *      * Tab Contacthistorie & Gespreksnota's (adviesgesprekken, videocalls, Kate-vragen)
 *      * Tab Producten & Dekkingsgaten (zichtrekening, woonkrediet, brandpolis, beleggingen)
 *      * Direct doorklikken: "Bekijk als klant in KBC Mobile"
 */
window.KBCAura = window.KBCAura || {};

(function () {
  var esc = window.KBCAura.escapeHtml;

  // Centrale State
  var state = {
    currentTopView: "medewerker", // Klantapp staat op index.html.
    activeCustomerIndex: 0,
    customers: JSON.parse(JSON.stringify(window.KBCAura.PersonasDatabase || [])),
    activeAppTab: "start",
    showSteeringModal: false,
    showOnboardingModal: false,
    onboardingStep: 1,
    tempNewGoal: {
      type: "woning",
      targetAmount: 45000,
      months: 36
    },
    // Filters & paginering voor Medewerker Portaal
    staffSearch: "",
    staffStatus: "ALL",
    staffGoal: "ALL",
    staffCity: "ALL",
    staffPage: 1,
    staffPageSize: 12,
    selectedStaffCustomerId: null,
    staffDossierTab: "overzicht" // "overzicht", "historie", "transacties", "contact", "producten"
  };

  function euro(n) {
    var v = Math.round(Number(n) || 0);
    return "€ " + v.toLocaleString("nl-BE");
  }

  function statusMeta(code) {
    if (code === "OP_KOERS") return { label: "Op koers", color: "#168866", bg: "#e9f7f1", border: "#b8e5d4", cls: "ok", dot: "" };
    if (code === "BIJSTUREN") return { label: "Bijsturen", color: "#b37b20", bg: "#fff7e8", border: "#f2d8a8", cls: "warn", dot: "" };
    return { label: "Aanpassen", color: "#c45c5a", bg: "#fff0ee", border: "#f1c7c2", cls: "risk", dot: "" };
  }

  var proIconPaths = {
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    back: '<path d="M19 12H5m6 6-6-6 6-6"/>',
    chart: '<path d="M3 19h18M5 16l5-5 4 2 5-7"/>',
    wallet: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18m-4 5h2"/>',
    user: '<circle cx="12" cy="8" r="3.3"/><path d="M5.5 20c.4-3.6 2.5-5.4 6.5-5.4s6.1 1.8 6.5 5.4"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
    message: '<path d="M4 4h16v12H9l-5 4V4Z"/>',
    shield: '<path d="M12 2 20 5v6c0 5-3 8-8 11-5-3-8-6-8-11V5l8-3Z"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.6"/><path d="m16 16 4.2 4.2"/>'
  };
  function proIcon(name, size) {
    return '<svg class="pro-icon" width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (proIconPaths[name] || proIconPaths.grid) + '</svg>';
  }

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

    var isStaff = state.currentTopView === "medewerker";

    var topNavHtml =
      '<header class="top-navbar">' +
        '<div class="brand-wrap">' +
          '<span class="kbc-logo-badge">KBC</span>' +
          '<div class="brand-text">' +
            '<h1>' + (isStaff ? 'KBC Pro' : 'KBC Kompas') + '</h1>' +
            '<small>' + (isStaff
              ? 'Portefeuille Kompas · medewerkeromgeving'
              : 'Klantinterface • KBC Mobile • Live Kompas & Stuurmechanisme') + '</small>' +
          '</div>' +
        '</div>' +
        '<div class="top-view-tabs">' +
          '<a class="view-tab-btn" href="index.html">' + proIcon("phone", 16) + ' Klantapp</a>' +
          '<span class="view-tab-btn active">' + proIcon("grid", 16) + ' Medewerkerdashboard</span>' +
        '</div>' +
      '</header>';

    var bodyHtml = '<div class="main-stage' + (isStaff ? " staff-stage" : "") + '">';

    if (isStaff) {
      bodyHtml += renderStaffWorkspace();
    } else {
      if (state.currentTopView === "split") {
        bodyHtml += '<div class="control-sidebar">' + renderSidebar(cust, kompas) + '</div>';
      }
      bodyHtml += '<div class="phone-stage">' + renderPhone(cust, kompas) + '</div>';
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

  // --- Linker Sidebar: Persona's + Events Simulator (Voor Klantapp Demo) ---
  function renderSidebar(cust, kompas) {
    var personasHtml = state.customers.map(function (c, idx) {
      var isActive = idx === state.activeCustomerIndex;
      return (
        '<button class="persona-btn ' + (isActive ? "active" : "") + '" data-persona-idx="' + idx + '">' +
          '<span class="persona-avatar">' + esc(c.avatar) + '</span>' +
          '<span class="persona-info">' +
            '<strong>' + esc(c.name) + ' (' + c.age + 'j)</strong>' +
            '<small>' + esc(c.situation) + ' • ' + esc(c.city) + '</small>' +
          '</span>' +
        '</button>'
      );
    }).join("");

    var events = window.KBCAura.PlanEventsCatalog || [];
    var eventsHtml = events.map(function (evt) {
      return (
        '<button class="event-btn" data-event-id="' + esc(evt.id) + '" style="border-left-color:' + esc(evt.badgeColor) + '">' +
          '<span>' +
            '<strong>' + esc(evt.title) + '</strong>' +
            '<small>' + esc(evt.description) + '</small>' +
          '</span>' +
          '<span class="event-trigger-tag" style="background:' + esc(evt.badgeColor) + '">Simuleer &rarr;</span>' +
        '</button>'
      );
    }).join("");

    return (
      '<div class="card-control">' +
        '<div class="card-control-header">' +
          '<h2>👤 1. Kies een Demo-Persona (Klant)</h2>' +
          '<span class="pill-badge">Klantapp demo</span>' +
        '</div>' +
        '<div class="personas-grid">' + personasHtml + '</div>' +
      '</div>' +

      '<div class="card-control">' +
        '<div class="card-control-header">' +
          '<h2>⚡ 2. Simuleer een Live Event (POST /event)</h2>' +
          '<span class="pill-badge">Real-time</span>' +
        '</div>' +
        '<p style="font-size:12px;color:#64748b;margin-bottom:12px;">' +
          'Klik op een gebeurtenis. De Kompas-engine herrekent direct de spaarcapaciteit en ratio, en de smartphone rechts slaat live om naar de nieuwe status!' +
        '</p>' +
        '<div class="events-list">' + eventsHtml + '</div>' +
      '</div>' +

      '<div class="card-control">' +
        '<div class="card-control-header">' +
          '<h2>📐 3. Kompas Formule (Live Cijfers)</h2>' +
          '<span class="pill-badge">' + esc(kompas.status.code) + '</span>' +
        '</div>' +
        '<div style="font-size:12px;line-height:1.6;color:#334155;">' +
          '<div>• <strong>Gem. Inkomen (3 mnd):</strong> ' + euro(kompas.metrics.avgIncome3m) + '</div>' +
          '<div>• <strong>Gem. Uitgaven (3 mnd):</strong> ' + euro(kompas.metrics.avgExpenses3m) + '</div>' +
          '<div style="color:var(--kbc-blue);font-weight:700;">• Spaarcapaciteit: ' + euro(kompas.metrics.savingsCapacity) + ' / mnd</div>' +
          '<div style="margin-top:6px;">• <strong>Resterend doel:</strong> ' + euro(kompas.metrics.remainingAmount) + ' over ' + kompas.metrics.monthsToDeadline + ' mnd</div>' +
          '<div style="color:#d97706;font-weight:700;">• Nodig per maand: ' + euro(kompas.metrics.neededPerMonth) + ' / mnd</div>' +
          '<div style="margin-top:6px;font-size:13px;font-weight:800;color:' + esc(kompas.status.color) + ';">' +
            '• Ratio = ' + kompas.metrics.ratio.toFixed(2).replace(".", ",") + ' &rarr; ' + esc(kompas.status.label) +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // --- Rechter Smartphone: KBC Mobile App Clone (Klant) ---
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

  // --- Klant Tab 1: Start (KBC Mobile Home) ---
  function renderAppStartTab(cust, kompas) {
    var accts = cust.accounts || {};
    var txList = (cust.transactions || []).slice(0, 5).map(function (tx) {
      var isNeg = tx.amount < 0;
      var amtStr = (isNeg ? "-€ " : "+€ ") + Math.abs(tx.amount).toFixed(2).replace(".", ",");
      return (
        '<div class="tx-item">' +
          '<div class="tx-desc">' +
            '<strong>' + esc(tx.merchant) + '</strong>' +
            '<small>' + esc(tx.date) + ' • ' + esc(tx.category) + '</small>' +
          '</div>' +
          '<span class="tx-amount ' + (isNeg ? 'neg' : 'pos') + '">' + amtStr + '</span>' +
        '</div>'
      );
    }).join("");

    return (
      '<!-- Kompas Widget op het Startscherm -->' +
      '<div class="app-card kompas-hero-card" style="border-left: 5px solid ' + esc(kompas.status.color) + ';">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
          '<span style="font-size:12px;font-weight:800;color:var(--kbc-blue);display:flex;align-items:center;gap:4px;">🧭 KBC KOMPAS</span>' +
          '<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:12px;background:' + esc(kompas.status.bgLight) + ';color:' + esc(kompas.status.color) + ';">' +
            esc(kompas.status.label) +
          '</span>' +
        '</div>' +
        '<h4 style="font-size:14px;color:var(--kbc-text-dark);margin-bottom:4px;">' + esc(kompas.activeGoal.title) + '</h4>' +
        '<p style="font-size:12px;color:#64748b;line-height:1.4;margin-bottom:12px;">' + esc(kompas.status.adviceText) + '</p>' +
        '<div style="display:flex;gap:8px;">' +
          '<button class="btn-card-action tab-nav-item" data-tab="kompas" style="flex:1;background:var(--kbc-blue);color:#fff;border:none;padding:8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">' +
            'Bekijk Route &rarr;' +
          '</button>' +
          (kompas.status.code !== "OP_KOERS"
            ? '<button class="btn-open-steering" style="flex:1;background:' + esc(kompas.status.color) + ';color:#fff;border:none;padding:8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">' +
                '⚡ Nu Bijsturen' +
              '</button>'
            : '') +
        '</div>' +
      '</div>' +

      '<!-- Rekeningen Overzicht -->' +
      '<div class="app-card">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
          '<strong style="font-size:13px;color:var(--kbc-blue);">Mijn Rekeningen</strong>' +
          '<span style="font-size:11px;color:var(--kbc-cyan);font-weight:700;cursor:pointer;">Details</span>' +
        '</div>' +
        '<div class="account-row">' +
          '<div>' +
            '<strong>' + esc(accts.checkingName || "Zichtrekening") + '</strong>' +
            '<small>' + esc(accts.checkingIban || "BE68 7340 0000 0000") + '</small>' +
          '</div>' +
          '<span class="acc-balance">' + euro(accts.checkingBalance) + '</span>' +
        '</div>' +
        '<div class="account-row">' +
          '<div>' +
            '<strong>' + esc(accts.savingsName || "Spaarrekening") + '</strong>' +
            '<small>' + esc(accts.savingsIban || "BE91 7340 0000 0000") + '</small>' +
          '</div>' +
          '<span class="acc-balance" style="color:var(--kbc-cyan);">' + euro(accts.savingsBalance) + '</span>' +
        '</div>' +
      '</div>' +

      '<!-- Snelle Acties -->' +
      '<div class="quick-actions-bar">' +
        '<button class="quick-action-btn btn-sim-transfer"><span>💸</span>Overschrijven</button>' +
        '<button class="quick-action-btn tab-nav-item" data-tab="kompas"><span>🎯</span>Mijn Doelen</button>' +
        '<button class="quick-action-btn tab-nav-item" data-tab="kate"><span>💬</span>Vraag Kate</button>' +
      '</div>' +

      '<!-- Recente Transacties -->' +
      '<div class="app-card">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
          '<strong style="font-size:13px;color:var(--kbc-blue);">Laatste Betalingen</strong>' +
          '<small style="font-size:11px;color:#94a3b8;">Laatste 5</small>' +
        '</div>' +
        '<div class="tx-list">' + txList + '</div>' +
      '</div>'
    );
  }

  // --- Klant Tab 2: Kompas (Volledig Scherm met Naaldmeter) ---
  function renderAppKompasTab(cust, kompas) {
    var angle = kompas.status.compassAngle || 0;
    var goals = cust.goals || [];
    var goalsButtons = goals.map(function (g) {
      var isAct = g.id === cust.activeGoalId;
      return (
        '<button class="btn-switch-goal ' + (isAct ? 'active' : '') + '" data-goal-id="' + esc(g.id) + '">' +
          esc(g.title) +
        '</button>'
      );
    }).join("");

    var missingHtml = (kompas.routeAnalysis.whatIsMissing || []).map(function (m) {
      return (
        '<div class="route-item missing">' +
          '<span>⚠️</span>' +
          '<div>' +
            '<strong>' + esc(m.title) + '</strong>' +
            '<small>' + esc(m.desc) + '</small>' +
          '</div>' +
        '</div>'
      );
    }).join("") || '<p style="font-size:11px;color:#10b981;">✓ Geen ontbrekende stappen of risico\'s gedetecteerd!</p>';

    return (
      '<!-- Doelen Kiezer Header -->' +
      '<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:12px;">' +
        goalsButtons +
        '<button class="btn-open-onboarding" style="padding:6px 12px;border:1px dashed var(--kbc-cyan);background:#fff;border-radius:20px;font-size:11px;color:var(--kbc-cyan);font-weight:700;white-space:nowrap;cursor:pointer;">+ Nieuw Doel</button>' +
      '</div>' +

      '<!-- Halve Cirkel Meter met Naald -->' +
      '<div class="app-card compass-dial-card">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
          '<h3 style="font-size:14px;color:var(--kbc-blue);">' + esc(kompas.activeGoal.title) + '</h3>' +
          '<span style="font-size:11px;font-weight:800;color:' + esc(kompas.status.color) + ';">' + esc(kompas.status.label) + '</span>' +
        '</div>' +
        '<p style="font-size:11px;color:#64748b;margin-bottom:10px;">' + esc(kompas.status.headline) + '</p>' +

        '<!-- SVG Wijzer Kompas -->' +
        '<div class="compass-svg-container">' +
          '<svg viewBox="0 0 200 115" class="compass-gauge">' +
            '<path d="M 20 100 A 80 80 0 0 1 65 35" fill="none" stroke="#ef4444" stroke-width="18" stroke-linecap="round"/>' +
            '<path d="M 68 32 A 80 80 0 0 1 132 32" fill="none" stroke="#f59e0b" stroke-width="18"/>' +
            '<path d="M 135 35 A 80 80 0 0 1 180 100" fill="none" stroke="#10b981" stroke-width="18" stroke-linecap="round"/>' +
            '<g transform="translate(100, 100) rotate(' + angle + ')">' +
              '<line x1="0" y1="0" x2="0" y2="-72" stroke="#003665" stroke-width="4" stroke-linecap="round"/>' +
              '<circle cx="0" cy="0" r="7" fill="#003665"/>' +
              '<circle cx="0" cy="-72" r="3" fill="#009DE0"/>' +
            '</g>' +
          '</svg>' +
          '<div class="compass-legend">' +
            '<span style="color:#ef4444;">Aanpassen (&lt;0,7)</span>' +
            '<span style="color:#f59e0b;">Bijsturen</span>' +
            '<span style="color:#10b981;">Op Koers (&ge;1,0)</span>' +
          '</div>' +
        '</div>' +

        '<!-- Voortgangsbalk -->' +
        '<div class="progress-bar-wrap" style="margin-top:14px;">' +
          '<div class="progress-bar-fill" style="width:' + kompas.metrics.progressPct + '%;background:' + esc(kompas.status.color) + ';"></div>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;font-size:11px;color:#64748b;margin-top:4px;">' +
          '<span>' + euro(kompas.metrics.savedAmount) + ' gespaard</span>' +
          '<span>Doel: ' + euro(kompas.metrics.targetAmount) + ' (' + kompas.metrics.monthsToDeadline + ' mnd)</span>' +
        '</div>' +

        '<div style="margin-top:14px;display:flex;gap:8px;">' +
          '<button class="btn-open-steering" style="flex:1;background:var(--kbc-blue);color:#fff;border:none;padding:10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">' +
            '⚙️ Bekijk Bijstuur-Opties' +
          '</button>' +
        '</div>' +
      '</div>' +

      '<!-- Route Analyse: Wat ontbreekt nog? -->' +
      '<div class="app-card">' +
        '<strong style="font-size:13px;color:var(--kbc-blue);display:block;margin-bottom:8px;">Wat heb je nodig voor deze bestemming?</strong>' +
        missingHtml +
      '</div>'
    );
  }

  // --- Klant Tab 3: Gekoppelde Producten ---
  function renderAppProductenTab(cust, kompas) {
    var prods = kompas.routeAnalysis.linkedProducts || [];
    var list = prods.map(function (p) {
      return (
        '<div class="product-item-card ' + (p.isOwned ? 'owned' : 'missing') + '">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span style="font-size:22px;">' + esc(p.icon) + '</span>' +
            '<div>' +
              '<strong>' + esc(p.name) + '</strong>' +
              '<small style="display:block;color:#64748b;font-size:11px;">' + esc(p.costLabel) + ' • ' + (p.mandatory ? 'Verplicht bij aankoop' : 'Aanbevolen') + '</small>' +
            '</div>' +
          '</div>' +
          '<span class="product-status-tag ' + (p.isOwned ? 'owned' : 'missing') + '">' +
            (p.isOwned ? '✓ Actief' : '+ Ontbreekt nog') +
          '</span>' +
        '</div>'
      );
    }).join("");

    return (
      '<div class="app-card">' +
        '<h3 style="font-size:14px;color:var(--kbc-blue);margin-bottom:6px;">Producten voor je doel \'' + esc(kompas.activeGoal.title) + '\'</h3>' +
        '<p style="font-size:11px;color:#64748b;margin-bottom:12px;">KBC koppelt automatisch bank-, verzekerings- en beleggingsproducten die vereist zijn voor je bestemming.</p>' +
        list +
      '</div>'
    );
  }

  // --- Klant Tab 4: Kate AI-Coach ---
  function renderAppKateTab(cust, kompas) {
    return (
      '<div class="app-card kate-chat-card">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">' +
          '<div class="kate-avatar">🤖</div>' +
          '<div>' +
            '<h3 style="font-size:14px;color:var(--kbc-blue);">Kate • KBC Kompas Coach</h3>' +
            '<small style="color:#10b981;font-weight:700;">🟢 Online • 100% Proactief &amp; Transparant</small>' +
          '</div>' +
        '</div>' +

        '<div class="kate-message-bubble">' +
          '<p>Dag ' + esc(cust.name.split(" ")[0]) + '! Ik hou 24/7 je uitgavenpatroon en doelen in de gaten.</p>' +
          '<p style="margin-top:6px;"><strong>Status voor ' + esc(kompas.activeGoal.title) + ':</strong> ' + esc(kompas.status.label) + ' (Ratio ' + kompas.metrics.ratio.toFixed(2).replace(".", ",") + ').</p>' +
          '<p style="margin-top:6px;">' + esc(kompas.status.adviceText) + '</p>' +
        '</div>' +

        '<div class="kate-action-suggestions" style="margin-top:14px;">' +
          '<small style="font-size:11px;font-weight:700;color:#64748b;display:block;margin-bottom:6px;">Veelgestelde vragen aan Kate:</small>' +
          '<button class="kate-chip btn-open-steering">Hoe kan ik mijn koers verbeteren?</button>' +
          '<button class="kate-chip btn-go-settings">Waarom zie ik deze cijfers?</button>' +
        '</div>' +
      '</div>'
    );
  }

  // --- Klant Tab 5: Mijn Digitaal Profiel & Instellingen ---
  function renderAppSettingsTab(cust, kompas) {
    var breakdown = (kompas.spendingByCategory || []).map(function (b) {
      return (
        '<div style="margin-bottom:6px;">' +
          '<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px;">' +
            '<span>' + esc(b.category) + '</span>' +
            '<strong>' + euro(b.amount) + ' (' + b.pct + '%)</strong>' +
          '</div>' +
          '<div class="progress-bar-wrap" style="height:6px;">' +
            '<div class="progress-bar-fill" style="width:' + b.pct + '%;background:var(--kbc-blue);"></div>' +
          '</div>' +
        '</div>'
      );
    }).join("");

    return (
      '<div class="app-card">' +
        '<h3 style="font-size:14px;color:var(--kbc-blue);margin-bottom:4px;">⚙️ Mijn Digitaal Profiel</h3>' +
        '<p style="font-size:11px;color:#64748b;margin-bottom:12px;">Bij KBC blijf je zélf de baas over je data en de aannames van het Kompas.</p>' +

        '<div class="settings-group">' +
          '<h4>👤 Persoonlijke Informatie</h4>' +
          '<div class="setting-row">' +
            '<span>Naam</span>' +
            '<input type="text" class="setting-input-text inp-profile-name" value="' + esc(cust.name) + '" />' +
          '</div>' +
          '<div class="setting-row">' +
            '<span>Leeftijd</span>' +
            '<input type="number" class="setting-input-text inp-profile-age" style="width:60px;" value="' + cust.age + '" />' +
          '</div>' +
          '<div class="setting-row">' +
            '<span>Situatie</span>' +
            '<select class="setting-select inp-profile-situation">' +
              '<option value="Student / starter"' + (cust.situation.indexOf("Student") !== -1 ? ' selected' : '') + '>Student / starter</option>' +
              '<option value="Samenwonend koppel"' + (cust.situation.indexOf("Samenwonend") !== -1 ? ' selected' : '') + '>Samenwonend koppel</option>' +
              '<option value="Jong gezin"' + (cust.situation.indexOf("gezin") !== -1 ? ' selected' : '') + '>Gezin</option>' +
              '<option value="Senior"' + (cust.situation.indexOf("Senior") !== -1 ? ' selected' : '') + '>Senior</option>' +
            '</select>' +
          '</div>' +
          '<div class="setting-row">' +
            '<span>Koppelmodus Actief</span>' +
            '<input type="checkbox" class="chk-couple-mode"' + (cust.isCoupleMode ? ' checked' : '') + ' />' +
          '</div>' +
        '</div>' +

        '<div class="settings-group">' +
          '<h4>💰 Financiële Parameters (3-Maands Gemiddelde)</h4>' +
          '<div class="setting-row">' +
            '<span>Maandinkomen</span>' +
            '<input type="number" class="setting-input-text inp-profile-income" value="' + Math.round(cust.avgMonthlyIncome3m) + '" />' +
          '</div>' +
          '<div class="setting-row">' +
            '<span>Maanduitgaven</span>' +
            '<input type="number" class="setting-input-text inp-profile-expenses" value="' + Math.round(cust.avgMonthlyExpenses3m) + '" />' +
          '</div>' +
          '<div class="setting-row">' +
            '<span>Huidige Spaarbuffer</span>' +
            '<input type="number" class="setting-input-text inp-profile-savings" value="' + Math.round(cust.accounts.savingsBalance) + '" />' +
          '</div>' +
          '<button class="btn-save-profile" style="width:100%;margin-top:10px;background:var(--kbc-blue);color:#fff;border:none;padding:8px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">' +
            '💾 Wijzigingen Opslaan &amp; Herberekenen' +
          '</button>' +
        '</div>' +

        '<!-- Explainable AI Box -->' +
        '<div class="explain-box">' +
          '<strong>💡 Waarom zie ik deze koers? (Transparantie)</strong>' +
          '<p>KBC berekent je spaarcapaciteit op basis van je geanonimiseerde transacties over de voorbije 3 maanden. Er wordt geen data verkocht of gedeeld met derden.</p>' +
          '<div style="margin-top:8px;">' + breakdown + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // --- Modal: Bijsturen van het Kompas (De 3 Opties) ---
  function renderSteeringModal(cust, kompas) {
    var opts = kompas.steeringOptions || [];
    var optsHtml = opts.map(function (opt) {
      return (
        '<div class="steering-option-card ' + (opt.recommended ? 'recommended' : '') + '" data-opt-type="' + esc(opt.type) + '">' +
          '<span class="opt-radio-icon">' + esc(opt.icon) + '</span>' +
          '<div class="opt-details">' +
            '<strong>' + esc(opt.title) + ' ' + (opt.recommended ? '<span style="color:#10b981;font-size:10px;">(AANBEVOLEN)</span>' : '') + '</strong>' +
            '<small>' + esc(opt.subtitle) + '</small>' +
            '<span class="opt-impact">' + esc(opt.impactLabel) + '</span>' +
          '</div>' +
          '<button class="btn-apply-steering" data-opt-type="' + esc(opt.type) + '" style="background:var(--kbc-blue);color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">' +
            'Kies &rarr;' +
          '</button>' +
        '</div>'
      );
    }).join("");

    return (
      '<div class="kbc-modal-backdrop">' +
        '<div class="kbc-modal-sheet">' +
          '<div class="kbc-modal-header">' +
            '<h3>⚡ Kompas Bijsturen: Maak je plan haalbaar</h3>' +
            '<button class="btn-close-modal">✕</button>' +
          '</div>' +
          '<p style="font-size:12px;color:#64748b;margin-bottom:12px;">' +
            'Je spaarcapaciteit is momenteel <strong>' + euro(kompas.metrics.savingsCapacity) + '/mnd</strong>, maar voor je huidige doel heb je <strong>' + euro(kompas.metrics.neededPerMonth) + '/mnd</strong> nodig. Kies hoe je wilt corrigeren:' +
          '</p>' +
          '<div class="steering-options-list">' + optsHtml + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // --- Modal: Onboarding (Nieuw Doel Kiezen) ---
  function renderOnboardingModal(cust) {
    var cat = window.KBCAura.GoalCatalog || {};
    var step1Html = Object.keys(cat).map(function (k) {
      var g = cat[k];
      var isSel = state.tempNewGoal.type === k;
      return (
        '<button class="goal-pick-btn" data-goal-type="' + k + '" style="background:' + (isSel ? '#f0f9ff' : '#fff') + ';border:2px solid ' + (isSel ? 'var(--kbc-cyan)' : '#e2e8f0') + ';border-radius:8px;padding:10px;display:flex;align-items:center;gap:10px;cursor:pointer;text-align:left;width:100%;margin-bottom:8px;">' +
          '<span style="font-size:24px;">' + esc(g.icon) + '</span>' +
          '<span>' +
            '<strong style="font-size:13px;color:var(--kbc-blue);">' + esc(g.title) + '</strong>' +
            '<small style="display:block;color:#64748b;font-size:11px;">Standaard richtbedrag: ' + euro(g.defaultTargetAmount) + ' over ' + g.defaultMonths + ' mnd</small>' +
          '</span>' +
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
                '<p style="font-size:12px;color:#64748b;margin-bottom:12px;"><strong>Vraag 1:</strong> Wat is je belangrijkste levensdoel voor de komende jaren?</p>' +
                step1Html +
                '<button class="btn-onboarding-next" style="width:100%;margin-top:10px;background:var(--kbc-blue);color:#fff;border:none;padding:10px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">' +
                  'Volgende Stap &rarr;' +
                '</button>' +
              '</div>'
            : (state.onboardingStep === 2
              ? '<div>' +
                  '<p style="font-size:12px;color:#64748b;margin-bottom:12px;"><strong>Vraag 2:</strong> Welk bedrag en welke deadline heb je voor ogen?</p>' +
                  '<div style="margin-bottom:12px;">' +
                    '<label style="display:block;font-size:12px;font-weight:700;margin-bottom:4px;">Doelbedrag: ' + euro(state.tempNewGoal.targetAmount) + '</label>' +
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

  // =========================================================================
  // 2. KBC-MEDEWERKER PORTAAL (200 KLANTEN & DIEPGAAND DOSSIER)
  // =========================================================================

  function getStaffCustomersFiltered() {
    var syn = (window.KBCAura.Synthetic200Customers && window.KBCAura.Synthetic200Customers.customers) || [];
    var q = (state.staffSearch || "").trim().toLowerCase();
    return syn.filter(function (c) {
      if (state.staffStatus !== "ALL" && c.status !== state.staffStatus) return false;
      if (state.staffGoal !== "ALL" && c.goalType !== state.staffGoal) return false;
      if (state.staffCity !== "ALL" && c.city !== state.staffCity) return false;
      if (q) {
        var hay = (c.name + " " + c.id + " " + c.customerNumber + " " + c.city + " " + c.occupation + " " + c.email + " " + c.goalLabel + " " + c.advisorName).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function renderStaffWorkspace() {
    var selected = state.selectedStaffCustomerId
      ? window.KBCAura.Synthetic200Customers.getById(state.selectedStaffCustomerId)
      : null;
    if (selected) return renderStaffDossier(selected);
    return renderStaffDashboard();
  }

  function renderStaffDashboard() {
    var dash = window.KBCAura.KompasEngine.evaluateDashboard200();
    var filtered = getStaffCustomersFiltered();
    var totalPages = Math.max(1, Math.ceil(filtered.length / state.staffPageSize));
    if (state.staffPage > totalPages) state.staffPage = totalPages;
    var start = (state.staffPage - 1) * state.staffPageSize;
    var pageRows = filtered.slice(start, start + state.staffPageSize);

    // Steden voor filter
    var cities = [];
    (dash.customers || []).forEach(function (c) {
      if (cities.indexOf(c.city) === -1) cities.push(c.city);
    });
    cities.sort();

    var n = dash.totalCustomers || 1;
    var pctOk = Math.round((dash.statusCounts.OP_KOERS / n) * 100);
    var pctWarn = Math.round((dash.statusCounts.BIJSTUREN / n) * 100);
    var pctRisk = Math.round((dash.statusCounts.PLAN_AANPASSEN / n) * 100);

    var goalMax = 1;
    Object.keys(dash.goalCounts || {}).forEach(function (k) {
      if (dash.goalCounts[k] > goalMax) goalMax = dash.goalCounts[k];
    });

    var goalLabels = { woning: "Woning", kot: "Studie & kot", reis: "Reizen", auto: "Mobiliteit", gezin: "Gezin", pensioen: "Pensioen" };
    var goalBars = Object.keys(dash.goalCounts || {}).map(function (k) {
      var cnt = dash.goalCounts[k] || 0;
      var w = Math.round((cnt / goalMax) * 100);
      return (
        '<button class="staff-goal-row" data-goal-select="' + esc(k) + '" aria-label="Filter op ' + esc(goalLabels[k] || k) + ', ' + cnt + ' dossiers">' +
          '<span class="staff-goal-label">' + esc(goalLabels[k] || k) + '</span>' +
          '<div class="staff-goal-track"><div class="staff-goal-fill" style="width:' + w + '%"></div></div>' +
          '<strong>' + cnt + '</strong>' +
        '</button>'
      );
    }).join("");

    var rowsHtml = pageRows.map(function (c) {
      var sm = statusMeta(c.status);
      var progress = Math.min(100, Math.round((c.savedAmount / Math.max(1, c.targetAmount)) * 100));
      return (
        '<tr class="staff-row" data-staff-id="' + esc(c.id) + '">' +
          '<td>' +
            '<div class="staff-namecell">' +
              '<span class="staff-avatar">' + esc(c.initials) + '</span>' +
              '<div>' +
                '<strong>' + esc(c.name) + '</strong>' +
                '<small>' + esc(c.customerNumber) + ' • ' + c.age + ' j</small>' +
              '</div>' +
            '</div>' +
          '</td>' +
          '<td>' +
            '<strong>' + esc(c.city) + '</strong>' +
            '<small class="muted-block">' + esc(c.situation) + '</small>' +
          '</td>' +
          '<td>' +
            '<div style="display:flex;align-items:center;gap:6px;">' +
              '<strong>' + esc(c.goalLabel) + '</strong>' +
            '</div>' +
            '<div class="mini-progress"><div style="width:' + progress + '%;background:' + sm.color + '"></div></div>' +
            '<small class="muted-block">' + euro(c.savedAmount) + ' / ' + euro(c.targetAmount) + ' (' + progress + '%)</small>' +
          '</td>' +
          '<td>' +
            '<strong style="color:var(--kbc-blue);">' + euro(c.savingsCapacity) + '/mnd</strong>' +
            '<small class="muted-block">Nodig: ' + euro(c.neededPerMonth) + '/mnd</small>' +
          '</td>' +
          '<td>' +
            '<span>' + esc(c.advisorName) + '</span>' +
            '<small class="muted-block">' + esc(c.advisorBranch.replace("KBC ", "")) + ' • ' + esc(c.lastContactAt) + '</small>' +
          '</td>' +
          '<td>' +
            '<span class="staff-status staff-status-' + sm.cls + '">' +
              esc(sm.label) + ' · ' + String(c.ratio).replace(".", ",") +
            '</span>' +
          '</td>' +
          '<td style="text-align:right;">' +
            '<button class="staff-view-btn" data-staff-id="' + esc(c.id) + '">Dossier bekijken &rarr;</button>' +
          '</td>' +
        '</tr>'
      );
    }).join("");

    if (!rowsHtml) {
      rowsHtml = '<tr><td colspan="7" class="staff-empty">Geen klanten gevonden voor deze filters of zoekopdracht.</td></tr>';
    }

    var cityOpts = '<option value="ALL">Alle steden (' + cities.length + ')</option>' + cities.map(function (city) {
      return '<option value="' + esc(city) + '"' + (state.staffCity === city ? " selected" : "") + ">" + esc(city) + "</option>";
    }).join("");

    return (
      '<div class="staff-shell">' +
        '<div class="staff-banner">' +
          '<div>' +
            '<span class="staff-kicker">PORTEFEUILLE / KOMPAS</span>' +
            '<h2>Goed overzicht. Gerichte aandacht.</h2>' +
            '<p>Inzicht in de voortgang en financiële ruimte van ' + dash.totalCustomers + ' klantdossiers.</p>' +
          '</div>' +
          '<div class="staff-banner-meta">' +
            '<span>Fictieve demodata</span>' +
            '<strong>30 sep 2026</strong>' +
          '</div>' +
        '</div>' +

        '<section class="portfolio-overview" aria-label="Visueel portefeuilleoverzicht">' +
          '<div class="portfolio-numbers">' +
            '<span class="staff-kicker">ACTIEVE DOSSIERS</span>' +
            '<strong class="portfolio-total">' + dash.totalCustomers + '</strong>' +
            '<span class="portfolio-number-label">klanten in Kompas</span>' +
            '<div class="portfolio-volumes"><div><small>Doelvolume</small><strong>' + euro(dash.totalTargetVolume) + '</strong></div><div><small>Reeds opgebouwd</small><strong>' + euro(dash.totalSavedVolume) + '</strong></div></div>' +
          '</div>' +
          '<div class="portfolio-status">' +
            '<div class="panel-heading"><div><span class="staff-kicker">KOERS VAN DE PORTEFEUILLE</span><h3>Waar is aandacht nodig?</h3></div><small>Ratio spaarcapaciteit / benodigde inleg</small></div>' +
            '<div class="status-visual"><div class="status-donut" role="img" aria-label="' + pctOk + '% op koers, ' + pctWarn + '% bijsturen, ' + pctRisk + '% aanpassen" style="background:conic-gradient(#199779 0 ' + (dash.statusCounts.OP_KOERS / n * 100).toFixed(2) + '%,#dbaa52 ' + (dash.statusCounts.OP_KOERS / n * 100).toFixed(2) + '% ' + ((dash.statusCounts.OP_KOERS + dash.statusCounts.BIJSTUREN) / n * 100).toFixed(2) + '%,#cd706b ' + ((dash.statusCounts.OP_KOERS + dash.statusCounts.BIJSTUREN) / n * 100).toFixed(2) + '% 100%)"><div><strong>' + pctOk + '%</strong><small>op koers</small></div></div>' +
              '<div class="status-breakdown">' +
                '<button data-staff-status="OP_KOERS"><span class="status-mark ok"></span><span>Op koers</span><strong>' + dash.statusCounts.OP_KOERS + '</strong><small>' + pctOk + '%</small></button>' +
                '<button data-staff-status="BIJSTUREN"><span class="status-mark warn"></span><span>Bijsturen</span><strong>' + dash.statusCounts.BIJSTUREN + '</strong><small>' + pctWarn + '%</small></button>' +
                '<button data-staff-status="PLAN_AANPASSEN"><span class="status-mark risk"></span><span>Aanpassen</span><strong>' + dash.statusCounts.PLAN_AANPASSEN + '</strong><small>' + pctRisk + '%</small></button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>' +
        '<section class="goals-panel"><div class="panel-heading"><div><span class="staff-kicker">DOELEN</span><h3>Waar werken klanten naartoe?</h3></div><small>Klik op een doel om de dossiers te filteren</small></div><div class="goals-chart">' + goalBars + '</div></section>' +

        '<div class="staff-card staff-table-card">' +
          '<div class="panel-heading table-heading"><div><span class="staff-kicker">DOSSIERS</span><h3>Klantoverzicht</h3></div><small>Selecteer een rij voor het volledige dossier</small></div>' +
          '<div class="staff-toolbar">' +
            '<form class="staff-search-form">' +
              '<label class="staff-search-wrap">' + proIcon("search", 18) + '<input class="staff-search" type="search" aria-label="Zoek dossiers" placeholder="Zoek naam, klantnummer, gemeente of adviseur" value="' + esc(state.staffSearch) + '" /></label>' +
              '<button type="submit" class="staff-btn-primary">Zoeken</button>' +
              (state.staffSearch ? '<button type="button" class="staff-btn-clear">Wis</button>' : '') +
            '</form>' +
            '<div class="staff-filters">' +
              '<span style="font-size:12px;font-weight:700;color:#64748b;margin-right:4px;">Status:</span>' +
              '<button class="chip ' + (state.staffStatus === "ALL" ? "on" : "") + '" data-staff-status="ALL">Alle (' + dash.totalCustomers + ')</button>' +
              '<button class="chip ' + (state.staffStatus === "OP_KOERS" ? "on" : "") + '" data-staff-status="OP_KOERS"><span class="status-mark ok"></span>Op koers (' + dash.statusCounts.OP_KOERS + ')</button>' +
              '<button class="chip ' + (state.staffStatus === "BIJSTUREN" ? "on" : "") + '" data-staff-status="BIJSTUREN"><span class="status-mark warn"></span>Bijsturen (' + dash.statusCounts.BIJSTUREN + ')</button>' +
              '<button class="chip ' + (state.staffStatus === "PLAN_AANPASSEN" ? "on" : "") + '" data-staff-status="PLAN_AANPASSEN"><span class="status-mark risk"></span>Aanpassen (' + dash.statusCounts.PLAN_AANPASSEN + ')</button>' +
              '<span style="font-size:12px;font-weight:700;color:#64748b;margin-left:8px;margin-right:4px;">Doel:</span>' +
              '<select class="staff-select" data-staff-goal="1">' +
                '<option value="ALL"' + (state.staffGoal === "ALL" ? " selected" : "") + '>Alle doelen</option>' +
                '<option value="woning"' + (state.staffGoal === "woning" ? " selected" : "") + '>Woning</option>' +
                '<option value="kot"' + (state.staffGoal === "kot" ? " selected" : "") + '>Studie &amp; kot</option>' +
                '<option value="reis"' + (state.staffGoal === "reis" ? " selected" : "") + '>Reizen</option>' +
                '<option value="auto"' + (state.staffGoal === "auto" ? " selected" : "") + '>Mobiliteit</option>' +
                '<option value="gezin"' + (state.staffGoal === "gezin" ? " selected" : "") + '>Gezin</option>' +
                '<option value="pensioen"' + (state.staffGoal === "pensioen" ? " selected" : "") + '>Pensioen</option>' +
              '</select>' +
              '<span style="font-size:12px;font-weight:700;color:#64748b;margin-left:8px;margin-right:4px;">Regio:</span>' +
              '<select class="staff-select" data-staff-city="1">' + cityOpts + '</select>' +
            '</div>' +
          '</div>' +

          '<div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0 8px;">' +
            '<p class="staff-count">Weergegeven: <strong>' + filtered.length + ' van de 200 klanten</strong> (Pagina ' + state.staffPage + ' van ' + totalPages + ') • Klik op een rij om het volledige dossier te openen</p>' +
            '<div class="staff-pager">' +
              '<button class="staff-page-btn" data-staff-page="-1"' + (state.staffPage <= 1 ? " disabled" : "") + '>&larr; Vorige</button>' +
              '<span style="font-size:12px;color:#64748b;align-self:center;">Pagina ' + state.staffPage + ' / ' + totalPages + '</span>' +
              '<button class="staff-page-btn" data-staff-page="1"' + (state.staffPage >= totalPages ? " disabled" : "") + '>Volgende &rarr;</button>' +
            '</div>' +
          '</div>' +

          '<div class="staff-table-wrap">' +
            '<table class="staff-table">' +
              '<thead>' +
                '<tr>' +
                  '<th>Klant</th>' +
                  '<th>Woonplaats</th>' +
                  '<th>Kompas Doel &amp; Voortgang</th>' +
                  '<th>Spaarcap. / Nodig</th>' +
                  '<th>Toegewezen Adviseur</th>' +
                  '<th>Status &amp; Ratio</th>' +
                  '<th style="text-align:right;">Actie</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' + rowsHtml + '</tbody>' +
            '</table>' +
          '</div>' +

          '<div class="staff-pager" style="margin-top:16px;">' +
            '<button class="staff-page-btn" data-staff-page="-1"' + (state.staffPage <= 1 ? " disabled" : "") + '>&larr; Vorige</button>' +
            '<button class="staff-page-btn" data-staff-page="1"' + (state.staffPage >= totalPages ? " disabled" : "") + '>Volgende &rarr;</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // --- DIEPGAAND DOSSIER VAN 1 SPECIFIEKE PERSOON ---
  function renderStaffDossier(c) {
    var sm = statusMeta(c.status);
    var progress = Math.min(100, Math.round((c.savedAmount / Math.max(1, c.targetAmount)) * 100));
    var gap = Math.max(0, c.neededPerMonth - c.savingsCapacity);
    var tab = state.staffDossierTab;

    var extraMonths = c.savingsCapacity > 0
      ? Math.max(0, Math.ceil((c.targetAmount - c.savedAmount) / c.savingsCapacity) - c.monthsToDeadline)
      : c.monthsToDeadline;

    var tips;
    if (c.status === "OP_KOERS") {
      tips = [
        "Feliciteer de klant: het Kompas staat op koers met een ratio van " + c.ratio + ".",
        "Bevestig of het doelbedrag van " + euro(c.targetAmount) + " en de timing over " + c.monthsToDeadline + " maanden nog aansluiten bij de plannen.",
        "Koppel het passende beschermingsproduct: " + c.linkedProduct + ".",
        "Onderzoek of er een tweede doel kan worden geactiveerd (bv. fiscale pensioenopbouw of een veilige noodbuffer)."
      ];
    } else if (c.status === "BIJSTUREN") {
      tips = [
        "Toon de klant de 3 concrete bijstuur-opties: deadline verschuiven met " + extraMonths + " maanden, doelbedrag verlagen naar " + euro(c.savedAmount + (c.savingsCapacity * c.monthsToDeadline)) + ", of maandelijks " + euro(gap) + " extra besparen.",
        "De spaarcapaciteit is " + euro(c.savingsCapacity) + "/mnd, maar er is " + euro(c.neededPerMonth) + "/mnd nodig (maandelijks tekort: " + euro(gap) + ").",
        "Bekijk samen de categorieën abonnementen en uitgaven om te zien waar er structurele ademruimte zit."
      ];
    } else {
      tips = [
        "Het huidige plan is te strak: KBC raadt af om dit tempo geforceerd vol te houden, omdat het de gezinsbuffer kan aantasten.",
        "Verhoog de deadline of stel een haalbaarder tussendoel voor om de koers terug boven 1,00 te krijgen.",
        "Pushen op extra commerciële producten vermijden zolang het primaire levensdoel niet op schema staat.",
        "Zorg voor transparantie conform GDPR en AI Act: leg uit welke reële transacties aan de basis liggen van dit advies."
      ];
    }

    // Tab 1: Overzicht
    var overzicht =
      '<section class="dossier-hero">' +
        '<div class="dossier-hero-main"><span class="staff-kicker">ACTIEF KOMPASDOEL</span><h3>' + esc(c.goalLabel) + '</h3><p>' + euro(c.savedAmount) + ' van ' + euro(c.targetAmount) + ' opgebouwd · ' + c.monthsToDeadline + ' maanden tot de deadline</p>' +
          '<div class="dossier-progress"><div style="width:' + progress + '%"></div></div>' +
          '<div class="dossier-hero-figures"><div><small>Maandinkomen</small><strong>' + euro(c.avgIncome3m) + '</strong></div><div><small>Maanduitgaven</small><strong>' + euro(c.avgExpenses3m) + '</strong></div><div><small>Spaarcapaciteit</small><strong>' + euro(c.savingsCapacity) + '</strong></div><div><small>Nodig per maand</small><strong>' + euro(c.neededPerMonth) + '</strong></div></div>' +
          '<p class="dossier-recommendation">Aanbevolen productkoppeling: <strong>' + esc(c.linkedProduct) + '</strong></p>' +
        '</div>' +
        '<div class="dossier-hero-ring" style="--progress:' + progress + '%"><div><strong>' + progress + '%</strong><span>voortgang</span></div></div>' +
      '</section>' +
      '<div class="dossier-grid">' +
        '<!-- Profielgegevens -->' +
        '<section class="staff-card">' +
          '<h3>' + proIcon("user", 19) + ' Klant &amp; gezin</h3>' +
          '<dl class="dossier-dl">' +
            '<div><dt>Klantnummer</dt><dd><strong>' + esc(c.customerNumber) + '</strong></dd></div>' +
            '<div><dt>Adres</dt><dd>' + esc(c.address) + '</dd></div>' +
            '<div><dt>E-mail</dt><dd>' + esc(c.email) + '</dd></div>' +
            '<div><dt>Telefoon</dt><dd>' + esc(c.phone) + '</dd></div>' +
            '<div><dt>Beroep</dt><dd>' + esc(c.occupation) + '</dd></div>' +
            '<div><dt>Situatie</dt><dd>' + esc(c.householdStatus) + '</dd></div>' +
            '<div><dt>Klant bij KBC sinds</dt><dd>' + esc(c.kbcSince) + ' (' + (2026 - parseInt(c.kbcSince, 10)) + ' jaar cliënt)</dd></div>' +
            '<div><dt>Vaste Adviseur</dt><dd>' + esc(c.advisorName) + ' (' + esc(c.advisorBranch) + ')</dd></div>' +
          '</dl>' +
        '</section>' +

        '<!-- Rekeningen -->' +
        '<section class="staff-card">' +
          '<h3>' + proIcon("wallet", 19) + ' Gekoppelde rekeningen</h3>' +
          '<div class="account-line">' +
            '<span>Zicht</span>' +
            '<strong>' + euro(c.checkingBalance) + '</strong>' +
            '<small>' + esc(c.ibanChecking) + ' • KBC Plusrekening</small>' +
          '</div>' +
          '<div class="account-line">' +
            '<span>Spaar</span>' +
            '<strong style="color:var(--kbc-cyan);">' + euro(c.savingsBalance) + '</strong>' +
            '<small>' + esc(c.ibanSavings) + ' • Doelspaarbuffer voor ' + esc(c.goalLabel) + '</small>' +
          '</div>' +
        '</section>' +

        '<!-- Gesprekstips & Risicosignalen -->' +
        '<section class="staff-card">' +
          '<h3>' + proIcon("message", 19) + ' Gesprekspunten voor ' + esc(c.advisorName.split(" ")[0]) + '</h3>' +
          '<ul class="tip-list">' + tips.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul>' +
          (c.riskFlags && c.riskFlags.length
            ? '<div style="margin-top:12px;"><strong style="font-size:11px;color:#dc2626;display:block;margin-bottom:4px;">Gedetecteerde Risicosignalen:</strong><div class="risk-flags">' +
                c.riskFlags.map(function (f) { return '<span>' + esc(f) + "</span>"; }).join("") +
              '</div></div>'
            : "") +
        '</section>' +
      '</div>';

    // Tab 2: 12 Maanden Cashflow Historie
    var maxInc = 1;
    (c.monthlyHistory || []).forEach(function (h) {
      if (h.income > maxInc) maxInc = h.income;
      if (h.expenses > maxInc) maxInc = h.expenses;
    });

    var chartBars = (c.monthlyHistory || []).map(function (h, i) {
      var x = 42 + i * 68;
      var ih = Math.round((h.income / maxInc) * 172);
      var eh = Math.round((h.expenses / maxInc) * 172);
      return '<g><title>' + esc(h.month) + ': inkomen ' + euro(h.income) + ', uitgaven ' + euro(h.expenses) + ', netto ' + euro(h.net) + '</title>' +
        '<rect class="cashflow-income" x="' + x + '" y="' + (212 - ih) + '" width="17" height="' + ih + '" rx="4"/>' +
        '<rect class="cashflow-expense" x="' + (x + 21) + '" y="' + (212 - eh) + '" width="17" height="' + eh + '" rx="4"/>' +
        '<text x="' + (x + 18) + '" y="241" text-anchor="middle">' + esc(h.month) + '</text></g>';
    }).join("");
    var chartHtml = '<div class="cashflow-chart"><svg viewBox="0 0 900 260" role="img" aria-label="Inkomsten en uitgaven per maand over twaalf maanden">' +
      '<line x1="28" y1="212" x2="864" y2="212"/><line class="gridline" x1="28" y1="126" x2="864" y2="126"/><line class="gridline" x1="28" y1="40" x2="864" y2="40"/>' + chartBars + '</svg></div>';

    var monthsHtml = (c.monthlyHistory || []).map(function (h) {
      var iw = Math.round((h.income / maxInc) * 100);
      var ew = Math.round((h.expenses / maxInc) * 100);
      var netPos = h.net >= 0;
      return (
        '<div class="month-row">' +
          '<span class="month-lab">' + esc(h.month) + '</span>' +
          '<div class="month-bars">' +
            '<div class="mb inc" style="width:' + iw + '%;" title="Inkomen: ' + euro(h.income) + '"></div>' +
            '<div class="mb exp" style="width:' + ew + '%;" title="Uitgaven: ' + euro(h.expenses) + '"></div>' +
          '</div>' +
          '<span class="month-fig">' +
            euro(h.income) + ' / ' + euro(h.expenses) +
            '<small class="' + (netPos ? 'amt-pos' : 'amt-neg') + '" style="display:block;font-size:10px;">Netto: ' + (netPos ? '+' : '') + euro(h.net) + '</small>' +
          '</span>' +
        '</div>'
      );
    }).join("");

    // Tab 3: Transacties
    var txHtml = (c.transactions || []).map(function (tx) {
      var neg = tx.amount < 0;
      var amt = (neg ? "- " : "+ ") + euro(Math.abs(tx.amount)).replace("€ ", "") + " €";
      return (
        '<tr>' +
          '<td><strong>' + esc(tx.date) + '</strong></td>' +
          '<td>' +
            '<strong>' + esc(tx.merchant) + '</strong>' +
            '<span class="tx-badge">' + esc(tx.category) + '</span>' +
          '</td>' +
          '<td class="' + (neg ? "amt-neg" : "amt-pos") + '">' + amt + '</td>' +
        '</tr>'
      );
    }).join("");

    // Tab 4: Contacthistorie
    var histHtml = (c.contactHistory || []).map(function (h) {
      return (
        '<article class="timeline-item">' +
          '<div class="timeline-when">' +
            '<strong>' + esc(h.date) + '</strong>' +
            '<span class="channel-pill">' + esc(h.channel) + '</span>' +
          '</div>' +
          '<div>' +
            '<strong>' + esc(h.advisor) + ' (' + esc(h.branch || "KBC") + ')</strong>' +
            '<p>' + esc(h.summary) + '</p>' +
          '</div>' +
        '</article>'
      );
    }).join("");

    // Tab 5: Producten & Gaps
    var prodHtml = (c.products || []).map(function (p) {
      var isOk = p.status.indexOf("Actief") !== -1 || p.status.indexOf("Optimaal") !== -1;
      var isGap = p.status.indexOf("Dekkingsgat") !== -1;
      return (
        '<li class="dossier-prod-row ' + (isGap ? 'prod-gap' : '') + '">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span class="product-icon">' + proIcon(isGap ? "shield" : "layers", 19) + '</span>' +
            '<div>' +
              '<strong>' + esc(p.name) + '</strong>' +
              '<small style="display:block;color:#64748b;font-size:11px;">' + esc(p.cost || "KBC tarief") + (p.iban ? ' • ' + esc(p.iban) : '') + '</small>' +
            '</div>' +
          '</div>' +
          '<span class="prod-badge ' + (isOk ? 'ok' : (isGap ? 'gap' : 'info')) + '">' +
            (isGap ? 'Dekkingsgat' : esc(p.status)) +
          '</span>' +
        '</li>'
      );
    }).join("");

    var tabBody = overzicht;
    if (tab === "historie") {
      tabBody =
        '<div class="staff-card">' +
          '<h3>' + proIcon("chart", 19) + ' Cashflow over 12 maanden</h3>' +
          '<div class="cashflow-legend"><span><i class="income"></i> Inkomen</span><span><i class="expense"></i> Uitgaven</span></div>' +
          chartHtml +
          '<details class="cashflow-details"><summary>Maandbedragen en netto resultaat bekijken</summary>' + monthsHtml + '</details>' +
        '</div>';
    } else if (tab === "transacties") {
      tabBody =
        '<div class="staff-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
            '<h3>' + proIcon("wallet", 19) + ' Transacties · ' + esc(c.customerNumber) + '</h3>' +
            '<span style="font-size:12px;color:#64748b;">' + (c.transactions || []).length + ' transacties geladen</span>' +
          '</div>' +
          '<div class="staff-table-wrap">' +
            '<table class="staff-table compact">' +
              '<thead><tr><th>Datum &amp; Tijd</th><th>Omschrijving &amp; Categorie</th><th>Bedrag</th></tr></thead>' +
              '<tbody>' + txHtml + '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>';
    } else if (tab === "contact") {
      tabBody =
        '<div class="staff-card">' +
          '<h3>' + proIcon("message", 19) + ' Contacthistorie &amp; gespreksnota\'s</h3>' +
          '<p class="muted-block" style="margin-bottom:14px;">Alle geregistreerde interacties tussen de klant, het kantoor, Kate en adviseur ' + esc(c.advisorName) + '.</p>' +
          '<div class="timeline">' + histHtml + '</div>' +
          '<div style="margin-top:16px;padding:12px;background:#f8fafc;border-radius:8px;border-left:4px solid var(--kbc-blue);">' +
            '<strong>Dossier Opmerking:</strong> ' + esc(c.profileNote) +
          '</div>' +
        '</div>';
    } else if (tab === "producten") {
      tabBody =
        '<div class="staff-card">' +
          '<h3>' + proIcon("shield", 19) + ' Producten &amp; dekkingsgaten</h3>' +
          '<p class="muted-block" style="margin-bottom:14px;">Automatische gap-analyse op basis van het gekozen Kompas-doel (' + esc(c.goalLabel) + ').</p>' +
          '<ul class="prod-list">' + prodHtml + '</ul>' +
        '</div>';
    }

    return (
      '<div class="staff-shell">' +
        '<div class="dossier-actions">' +
          '<button class="staff-back" data-staff-back="1">' + proIcon("back", 17) + ' Terug naar portefeuille</button>' +
          '<button class="staff-btn-view-as-customer" data-staff-load-persona="' + esc(c.id) + '">' +
            proIcon("phone", 17) + ' Bekijk in klantapp ' + proIcon("arrow", 16) +
          '</button>' +
        '</div>' +

        '<header class="dossier-head">' +
          '<div class="staff-namecell lg">' +
            '<span class="staff-avatar lg">' + esc(c.initials) + '</span>' +
            '<div>' +
              '<p class="staff-kicker">KBC PRO DOSSIER • ' + esc(c.customerNumber) + '</p>' +
              '<h2>' + esc(c.name) + '</h2>' +
              '<p>' + c.age + ' jaar • ' + esc(c.city) + ' (' + esc(c.province) + ') • ' + esc(c.occupation) + '</p>' +
            '</div>' +
          '</div>' +
          '<div style="text-align:right;">' +
            '<span class="staff-status staff-status-' + sm.cls + ' lg">' +
              esc(sm.label) + ' · ratio ' + String(c.ratio).replace(".", ",") +
            '</span>' +
            '<small style="display:block;color:#64748b;margin-top:6px;">Kantoor: ' + esc(c.advisorBranch) + '</small>' +
          '</div>' +
        '</header>' +

        '<nav class="dossier-tabs">' +
          '<button class="' + (tab === "overzicht" ? "on" : "") + '" data-dossier-tab="overzicht">' + proIcon("grid", 16) + ' Overzicht</button>' +
          '<button class="' + (tab === "historie" ? "on" : "") + '" data-dossier-tab="historie">' + proIcon("chart", 16) + ' Cashflow</button>' +
          '<button class="' + (tab === "transacties" ? "on" : "") + '" data-dossier-tab="transacties">' + proIcon("wallet", 16) + ' Transacties <span class="tab-count">' + (c.transactions || []).length + '</span></button>' +
          '<button class="' + (tab === "contact" ? "on" : "") + '" data-dossier-tab="contact">' + proIcon("message", 16) + ' Contact <span class="tab-count">' + (c.contactHistory || []).length + '</span></button>' +
          '<button class="' + (tab === "producten" ? "on" : "") + '" data-dossier-tab="producten">' + proIcon("shield", 16) + ' Producten</button>' +
        '</nav>' +

        tabBody +
      '</div>'
    );
  }

  // --- Event Handlers & Binding ---
  function bindEvents(root) {
    // Top view switcher (Klantapp vs Medewerker)
    root.querySelectorAll("[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.currentTopView = btn.getAttribute("data-view");
        if (state.currentTopView !== "medewerker") {
          state.selectedStaffCustomerId = null;
        }
        renderAll();
      });
    });

    // Medewerker zoekbalk
    var searchForm = root.querySelector(".staff-search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var inp = root.querySelector(".staff-search");
        state.staffSearch = inp ? inp.value : "";
        state.staffPage = 1;
        renderAll();
      });
    }

    var clearSearchBtn = root.querySelector(".staff-btn-clear");
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", function () {
        state.staffSearch = "";
        state.staffPage = 1;
        renderAll();
      });
    }

    // Status filter chips
    root.querySelectorAll("[data-staff-status]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.staffStatus = btn.getAttribute("data-staff-status");
        state.staffPage = 1;
        renderAll();
      });
    });

    root.querySelectorAll("[data-goal-select]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.staffGoal = btn.getAttribute("data-goal-select");
        state.staffPage = 1;
        renderAll();
      });
    });

    // Doel filter
    var goalSel = root.querySelector("[data-staff-goal]");
    if (goalSel) {
      goalSel.addEventListener("change", function () {
        state.staffGoal = goalSel.value;
        state.staffPage = 1;
        renderAll();
      });
    }

    // Stad filter
    var citySel = root.querySelector("[data-staff-city]");
    if (citySel) {
      citySel.addEventListener("change", function () {
        state.staffCity = citySel.value;
        state.staffPage = 1;
        renderAll();
      });
    }

    // Paginering
    root.querySelectorAll("[data-staff-page]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        state.staffPage += parseInt(btn.getAttribute("data-staff-page"), 10);
        if (state.staffPage < 1) state.staffPage = 1;
        renderAll();
      });
    });

    // Klikken op een klant in de tabel -> open dossier
    root.querySelectorAll(".staff-row, .staff-view-btn").forEach(function (el) {
      el.addEventListener("click", function (e) {
        var cid = el.getAttribute("data-staff-id");
        if (cid) {
          state.selectedStaffCustomerId = cid;
          state.staffDossierTab = "overzicht";
          renderAll();
        }
      });
    });

    // Terugknop naar de 200-klanten lijst
    var backBtn = root.querySelector("[data-staff-back]");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        state.selectedStaffCustomerId = null;
        renderAll();
      });
    }

    // Dossier tabs (Overzicht, 12 Maanden, Transacties, Contact, Producten)
    root.querySelectorAll("[data-dossier-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.staffDossierTab = btn.getAttribute("data-dossier-tab");
        renderAll();
      });
    });

    // Direct dit profiel inladen in de KBC Mobile Klantapp!
    root.querySelectorAll("[data-staff-load-persona]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cid = btn.getAttribute("data-staff-load-persona");
        var c = window.KBCAura.Synthetic200Customers.getById(cid);
        if (c) window.location.href = "index.html?customer=" + encodeURIComponent(c.id);
      });
    });

    // Persona switcher in klantapp
    root.querySelectorAll(".persona-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.activeCustomerIndex = parseInt(btn.getAttribute("data-persona-idx"), 10);
        renderAll();
      });
    });

    // Klantapp tabs onderaan (Start, Kompas, Producten, Kate, Profiel)
    root.querySelectorAll(".tab-nav-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.activeAppTab = btn.getAttribute("data-tab");
        renderAll();
      });
    });

    // Profielknop in header
    var btnGoSettings = root.querySelector(".btn-go-settings");
    if (btnGoSettings) {
      btnGoSettings.addEventListener("click", function () {
        state.activeAppTab = "instellingen";
        renderAll();
      });
    }

    // Modals
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

    // Doel wisselen
    root.querySelectorAll(".btn-switch-goal").forEach(function (b) {
      b.addEventListener("click", function () {
        var gid = b.getAttribute("data-goal-id");
        getActiveCustomer().activeGoalId = gid;
        renderAll();
      });
    });

    // Live Event Simulator
    root.querySelectorAll(".event-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var evtId = b.getAttribute("data-event-id");
        var catalog = window.KBCAura.PlanEventsCatalog || [];
        var evt = catalog.find(function (e) { return e.id === evtId; });
        if (!evt) return;

        var cust = getActiveCustomer();
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

    // Bijsturen toepassen
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

    // Onboarding wizard
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

    // Profiel opslaan
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

    // Snelle demo overschrijving
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

  // Initialisatie bij laden
  document.addEventListener("DOMContentLoaded", function () {
    renderAll();
  });
})();
