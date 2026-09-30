type Goal = { id: string; type: string; title: string; targetAmount: number; savedAmount: number; monthsToDeadline: number };
type Transaction = { date: string; merchant: string; amount: number; category: string };
type Customer = {
  id: string; name: string; city: string; activeGoalId: string; goals: Goal[]; transactions: Transaction[];
  avgMonthlyIncome3m: number; avgMonthlyExpenses3m: number;
  accounts: { checkingName: string; checkingIban: string; checkingBalance: number; savingsName: string; savingsIban: string; savingsBalance: number };
  activeInsurances?: { id: string; status?: string; monthlyCost?: number }[];
  investments?: { id: string; name?: string; value?: number }[];
};
type Evaluation = {
  activeGoal: Goal;
  metrics: { avgIncome3m: number; avgExpenses3m: number; savingsCapacity: number; savedAmount: number; targetAmount: number; neededPerMonth: number; progressPct: number; monthsToDeadline: number; ratio: number };
  status: { code: string; label: string; headline: string; adviceText: string };
  steeringOptions: { type: string; title: string; subtitle: string; newMonthsToDeadline?: number; newTargetAmount?: number; expenseReduction?: number }[];
  routeAnalysis: { linkedProducts: { id: string; name: string; type: string; costLabel: string; icon: string; isOwned: boolean; mandatory: boolean }[]; milestones: { pct: number; label: string }[] };
  spendingByCategory: Record<string, number>;
};
type Sheet = "none" | "profile" | "scenario" | "kate" | "account" | "insight" | "more" | "goals" | "new-goal" | "steering" | "why" | "transaction";
type Tab = "home" | "account" | "insight" | "products" | "more";
type ScenarioId = "rent" | "job" | "repair";
type IconName = "user" | "search" | "chevron" | "arrow" | "home" | "grid" | "chart" | "more" | "spark" | "wallet" | "swap" | "close" | "check" | "info" | "briefcase" | "house" | "tool" | "eye";
type Scenario = { id: ScenarioId; label: string; detail: string; icon: IconName; apply: (customer: Customer) => void };

type GoalSpec = { id: string; title: string; shortTitle: string; icon: string; defaultTargetAmount: number; defaultMonths: number; minAmount: number; maxAmount: number; minMonths: number; maxMonths: number };
type SyntheticCustomer = { id: string; name: string; city: string; goalType: string; goalLabel: string; targetAmount: number; savedAmount: number; monthsToDeadline: number; avgIncome3m: number; avgExpenses3m: number; ibanChecking: string; ibanSavings: string; checkingBalance: number; savingsBalance: number; transactions: Transaction[] };
interface Window { KBCAura: { PersonasDatabase: Customer[]; Synthetic200Customers: { getById: (id: string) => SyntheticCustomer | null }; GoalCatalog: Record<string, GoalSpec>; KompasEngine: { evaluateCustomer: (customer: Customer) => Evaluation } } }

const root = document.getElementById("kbc-app-root");
if (!root) throw new Error("App-element ontbreekt");
const customers: Customer[] = structuredClone(window.KBCAura.PersonasDatabase);
const requestedCustomer = new URLSearchParams(window.location.search).get("customer");
if (requestedCustomer) {
  const entry = window.KBCAura.Synthetic200Customers?.getById(requestedCustomer);
  if (entry) customers.unshift({
    id: entry.id, name: entry.name, city: entry.city, activeGoalId: `goal-${entry.goalType}`,
    goals: [{ id: `goal-${entry.goalType}`, type: entry.goalType, title: entry.goalLabel, targetAmount: entry.targetAmount, savedAmount: entry.savedAmount, monthsToDeadline: entry.monthsToDeadline }],
    transactions: entry.transactions, avgMonthlyIncome3m: entry.avgIncome3m, avgMonthlyExpenses3m: entry.avgExpenses3m,
    accounts: { checkingName: "KBC-Plusrekening", checkingIban: entry.ibanChecking, checkingBalance: entry.checkingBalance, savingsName: "KBC-Spaarrekening", savingsIban: entry.ibanSavings, savingsBalance: entry.savingsBalance }
  });
}
const state: { customerIndex: number; sheet: Sheet; tab: Tab; scenarioId: ScenarioId | null; hideAmounts: boolean; transactionIndex: number; notice: string } = {
  customerIndex: 0, sheet: "none", tab: "home", scenarioId: null, hideAmounts: false, transactionIndex: 0, notice: ""
};

const scenarios: Scenario[] = [
  { id: "rent", label: "Huur en energie stijgen", detail: "+ €240 vaste kosten per maand", icon: "house", apply: (c) => { c.avgMonthlyExpenses3m += 240; } },
  { id: "job", label: "Een nieuwe job", detail: "+ €480 netto per maand", icon: "briefcase", apply: (c) => { c.avgMonthlyIncome3m += 480; } },
  { id: "repair", label: "Onverwachte herstelling", detail: "€1.450 uit je spaarbuffer", icon: "tool", apply: (c) => {
    c.accounts.savingsBalance = Math.max(0, c.accounts.savingsBalance - 1450);
    const goal = c.goals.find((g) => g.id === c.activeGoalId);
    if (goal) goal.savedAmount = Math.max(0, goal.savedAmount - 1450);
  } }
];

const paths: Record<IconName, string> = {
  user: '<circle cx="12" cy="8" r="3.3"/><path d="M5.5 20c.4-3.6 2.5-5.4 6.5-5.4s6.1 1.8 6.5 5.4"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.6"/><path d="m16 16 4.2 4.2"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  chart: '<path d="M4 19V5m0 14h17M7.5 15l4-4 3 2 5-6"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  spark: '<path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/><path d="m19 17 .7 1.3L21 19l-1.3.7L19 21l-.7-1.3L17 19l1.3-.7z"/>',
  wallet: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18m-4 5h2"/>',
  swap: '<path d="M4 7h15l-4-4m4 4-4 4M20 17H5l4-4m-4 4 4 4"/>',
  close: '<path d="M5 5 19 19M19 5 5 19"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3m-13 7h18"/>',
  house: '<path d="m3 11 9-8 9 8v10H3z"/><path d="M9 21v-7h6v7"/>',
  tool: '<path d="M14.5 6.5a5 5 0 0 0-6 6L3 18l3 3 5.5-5.5a5 5 0 0 0 6-6l-3 2-2-2z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
};
function icon(name: IconName, size = 20): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
function escapeHtml(value: unknown): string {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value ?? "").replace(/[&<>"']/g, (char) => entities[char] || char);
}
function euro(value: number, digits = 0): string {
  return new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}
function amount(value: number, digits = 2): string { return state.hideAmounts ? "••••" : euro(value, digits); }
function customer(): Customer { return customers[state.customerIndex]; }
function evaluate(c: Customer): Evaluation { return window.KBCAura.KompasEngine.evaluateCustomer(c); }
function status(result: Evaluation): string {
  return result.status.code === "OP_KOERS" ? "Op koers" : result.status.code === "BIJSTUREN" ? "Bijsturen" : "Plan aanpassen";
}

function transactions(items: Transaction[], limit = 4): string {
  return items.slice(0, limit).map((tx, index) => `<button class="transaction" data-transaction="${index}">
    <span class="transaction-icon">${icon(tx.amount >= 0 ? "wallet" : "swap", 18)}</span>
    <span class="transaction-copy"><strong>${escapeHtml(tx.merchant)}</strong><small>${escapeHtml(tx.date)}</small></span>
    <strong class="transaction-amount ${tx.amount >= 0 ? "positive" : ""}">${state.hideAmounts ? "••••" : `${tx.amount > 0 ? "+" : ""}${euro(tx.amount, 2)}`}</strong>
  </button>`).join("");
}

function home(c: Customer, result: Evaluation): string {
  return `<section class="welcome"><p>Goedemorgen, ${escapeHtml(c.name.split(" ")[0])}</p><h1>Je bent goed bezig.</h1></section>
    <section class="section-block accounts-block"><div class="section-heading"><h2>Je rekeningen</h2><button class="text-link" data-action="account">Bekijk alles ${icon("chevron", 15)}</button></div>
      <button class="account-card" data-action="account"><span class="account-top"><span class="account-monogram">KBC</span><span class="account-type">Zichtrekening ${icon("chevron", 17)}</span></span>
        <span class="account-balance">${amount(c.accounts.checkingBalance)}</span>
        <span class="account-bottom"><span>${escapeHtml(c.accounts.checkingName)}</span><span>${escapeHtml(c.accounts.checkingIban.slice(-9))}</span></span>
      </button><div class="account-dots"><span class="active"></span><span></span></div></section>
    <section class="section-block for-you"><div class="section-heading"><h2>Voor jou</h2><span class="tiny-tag">Nieuw inzicht</span></div>
      <button class="insight-card" data-action="insight"><span class="insight-top"><span class="kompas-logo">${icon("spark", 18)}</span><span>KBC Kompas</span><span class="insight-arrow">${icon("chevron", 18)}</span></span>
        <strong>Je doel: ${escapeHtml(result.activeGoal.title)}</strong>
        <span class="insight-explain">${status(result) === "Op koers" ? "Je planning ligt op koers. Ontdek wat een verandering doet met je plan." : "Je planning vraagt aandacht. Bekijk wat je kunt aanpassen."}</span>
        <span class="insight-footer"><span class="status-dot ${result.status.code.toLowerCase()}"></span>${status(result)}<span class="insight-cta">Bekijk je plan ${icon("arrow", 16)}</span></span>
      </button></section>
    <section class="section-block quick-block"><div class="section-heading"><h2>Snel geregeld</h2></div><div class="quick-actions">
      <button data-action="scenario"><span>${icon("chart", 22)}</span>Wat als?</button>
      <button data-action="profile"><span>${icon("user", 22)}</span>Mijn profiel</button>
      <button data-action="kate"><span>${icon("spark", 22)}</span>Vraag Kate</button>
    </div></section>
    <section class="section-block transactions-block"><div class="section-heading"><h2>Laatste verrichtingen</h2><button class="text-link" data-action="account">Bekijk alles ${icon("chevron", 15)}</button></div><div class="transactions-list">${transactions(c.transactions)}</div></section>`;
}

function accountPage(c: Customer): string {
  return `<section class="page-heading"><p>Mijn KBC</p><h1>Je rekeningen</h1></section>
    <button class="account-card" data-action="account"><span class="account-top"><span class="account-monogram">KBC</span><span class="account-type">Zichtrekening ${icon("chevron", 17)}</span></span><span class="account-balance">${amount(c.accounts.checkingBalance)}</span><span class="account-bottom"><span>${escapeHtml(c.accounts.checkingName)}</span><span>${escapeHtml(c.accounts.checkingIban.slice(-9))}</span></span></button>
    <button class="account-card savings-card" data-action="account"><span class="account-top"><span class="account-monogram">KBC</span><span class="account-type">Spaarrekening ${icon("chevron", 17)}</span></span><span class="account-balance">${amount(c.accounts.savingsBalance)}</span><span class="account-bottom"><span>${escapeHtml(c.accounts.savingsName)}</span><span>${escapeHtml(c.accounts.savingsIban.slice(-9))}</span></span></button>
    <section class="section-block"><div class="section-heading"><h2>Verrichtingen</h2></div><div class="transactions-list">${transactions(c.transactions, c.transactions.length)}</div></section>`;
}

function kompasPage(c: Customer, result: Evaluation): string {
  const m = result.metrics;
  return `<section class="page-heading"><p>KBC Kompas</p><h1>${escapeHtml(result.activeGoal.title)}</h1></section>
    <div class="kompas-panel"><div class="kompas-gauge ${result.status.code.toLowerCase()}"><span>${m.progressPct}%</span><small>gespaard</small></div><span class="kompas-status"><span class="status-dot ${result.status.code.toLowerCase()}"></span>${escapeHtml(status(result))}</span><h2>${escapeHtml(result.status.headline)}</h2><p>${escapeHtml(result.status.adviceText)}</p><div class="progress-track"><div style="width:${m.progressPct}%"></div></div><div class="progress-label"><span>${amount(m.savedAmount, 0)} gespaard</span><span>doel ${amount(m.targetAmount, 0)}</span></div></div>
    <div class="metric-pair"><div><span>Ruimte per maand</span><strong>${amount(m.savingsCapacity, 0)}</strong></div><div><span>Nodig per maand</span><strong>${amount(m.neededPerMonth, 0)}</strong></div></div>
    <button class="primary-button" data-action="steering">Bekijk bijstuurmogelijkheden ${icon("arrow", 17)}</button>
    <div class="section-heading page-section"><h2>Jouw route</h2><button class="text-link" data-action="goals">Doelen ${icon("chevron", 15)}</button></div>
    <div class="route-list">${result.routeAnalysis.milestones.map((milestone) => `<div class="route-row"><span class="route-marker ${m.progressPct >= milestone.pct ? "done" : ""}">${m.progressPct >= milestone.pct ? icon("check", 14) : milestone.pct + "%"}</span><span>${escapeHtml(milestone.label)}</span></div>`).join("")}</div>
    <button class="subtle-button" data-action="why">Waarom zie ik dit? ${icon("info", 17)}</button>`;
}

function productsPage(c: Customer, result: Evaluation): string {
  return `<section class="page-heading"><p>Voor jouw doel</p><h1>Producten & bescherming</h1></section><p class="page-intro">Gekoppeld aan ${escapeHtml(result.activeGoal.title)}. Jij beslist of je een product wilt bekijken.</p>
    <div class="product-list">${result.routeAnalysis.linkedProducts.map((product) => `<article class="product-card"><span class="product-icon">${escapeHtml(product.icon)}</span><div><small>${escapeHtml(product.type)}</small><strong>${escapeHtml(product.name)}</strong><p>${escapeHtml(product.costLabel)}</p><span class="product-state ${product.isOwned ? "owned" : ""}">${product.isOwned ? "Al in je portefeuille" : "Nog niet in je portefeuille"}</span></div></article>`).join("")}</div>
    <div class="explain-box">${icon("info", 19)}<span>Dit zijn suggesties op basis van je gekozen doel en bekende producten. Ze worden niet automatisch aangevraagd.</span></div>`;
}

function morePage(c: Customer, result: Evaluation): string {
  return `<section class="page-heading"><p>Welkom, ${escapeHtml(c.name.split(" ")[0])}</p><h1>Meer</h1></section>
    <button class="menu-row" data-action="profile">${icon("user", 20)} Mijn profiel ${icon("chevron", 18)}</button>
    <button class="menu-row" data-action="goals">${icon("chart", 20)} Mijn doelen ${icon("chevron", 18)}</button>
    <button class="menu-row" data-action="scenario">${icon("swap", 20)} Wat als? ${icon("chevron", 18)}</button>
    <button class="menu-row" data-action="why">${icon("info", 20)} Hoe werkt Kompas? ${icon("chevron", 18)}</button>
    <button class="menu-row" data-action="toggle-amounts">${icon("eye", 20)} ${state.hideAmounts ? "Bedragen tonen" : "Bedragen verbergen"} ${icon("chevron", 18)}</button>
    <a class="menu-row dashboard-menu-link" href="dashboard.html">${icon("grid", 20)} Medewerkerdashboard ${icon("chevron", 18)}</a>
    <p class="demo-disclaimer">Demo met fictieve klantgegevens.</p>`;
}

function sheet(c: Customer, result: Evaluation): string {
  if (state.sheet === "none") return "";
  let title = "";
  let body = "";
  if (state.sheet === "insight") {
    title = "Jouw Kompas";
    body = `<div class="sheet-kicker">Jouw financieel profiel</div><h3>${escapeHtml(result.activeGoal.title)}</h3>
      <p class="sheet-lead">Je hebt ${amount(result.metrics.savedAmount, 0)} van ${amount(result.metrics.targetAmount, 0)} opzijgezet.</p>
      <div class="progress-track"><div style="width:${result.metrics.progressPct}%"></div></div>
      <div class="progress-label"><span>${result.metrics.progressPct}% bereikt</span><span>${result.metrics.monthsToDeadline} maanden te gaan</span></div>
      <div class="metric-pair"><div><span>Ruimte per maand</span><strong>${amount(result.metrics.savingsCapacity, 0)}</strong></div><div><span>Nodig voor je doel</span><strong>${amount(result.metrics.neededPerMonth, 0)}</strong></div></div>
      <div class="explain-box">${icon("info", 19)}<span>Gebaseerd op je gekozen doel en gemiddeld inkomen en uitgaven van de laatste 3 maanden. Alle klantgegevens in deze demo zijn fictief.</span></div>
      <button class="primary-button" data-action="scenario">Bekijk wat er verandert ${icon("arrow", 18)}</button>`;
  } else if (state.sheet === "scenario") {
    title = "Wat als?";
    const selected = scenarios.find((item) => item.id === state.scenarioId);
    const projected = structuredClone(c);
    if (selected) selected.apply(projected);
    const next = evaluate(projected);
    body = `<p class="sheet-lead">Ontdek wat een verandering doet met jouw doel. Je gegevens worden niet aangepast.</p>
      <div class="scenario-options">${scenarios.map((item) => `<button class="scenario-option ${item.id === state.scenarioId ? "selected" : ""}" data-scenario="${item.id}"><span class="scenario-icon">${icon(item.icon, 20)}</span><span><strong>${item.label}</strong><small>${item.detail}</small></span><span class="radio-mark"></span></button>`).join("")}</div>
      ${selected ? `<div class="scenario-result"><div class="result-heading"><span>Jouw nieuwe situatie</span><strong>${escapeHtml(status(next))}</strong></div>
        <div class="comparison"><div><small>Nu</small><strong>${amount(selected.id === "repair" ? result.metrics.savedAmount : result.metrics.savingsCapacity, 0)}</strong><span>${selected.id === "repair" ? "voor doel gespaard" : "ruimte / maand"}</span></div><span class="comparison-arrow">${icon("arrow", 21)}</span><div><small>Na verandering</small><strong>${amount(selected.id === "repair" ? next.metrics.savedAmount : next.metrics.savingsCapacity, 0)}</strong><span>${selected.id === "repair" ? "voor doel gespaard" : "ruimte / maand"}</span></div></div>
        <p>${selected.id === "repair" ? `Je doel is nu ${next.metrics.progressPct}% gefinancierd, tegenover ${result.metrics.progressPct}% eerder.` : next.metrics.neededPerMonth > next.metrics.savingsCapacity ? "Voor dit doel heb je dan maandelijks meer nodig dan je beschikbare ruimte." : "Je doel blijft volgens deze berekening haalbaar."}</p></div>` : ""}
      <div class="explain-box">${icon("info", 19)}<span>Dit is een eenvoudige simulatie met fictieve gegevens, geen financieel advies.</span></div>`;
  } else if (state.sheet === "profile") {
    title = "Mijn profiel";
    body = `<p class="sheet-lead">${escapeHtml(c.name)} · ${escapeHtml(c.city)}. Je Kompas gebruikt het gemiddelde van je laatste drie maanden.</p>
      <form data-form="budget" class="edit-form"><label>Maandinkomen <input name="income" type="number" min="0" step="1" required value="${c.avgMonthlyIncome3m}"></label><label>Maanduitgaven <input name="expenses" type="number" min="0" step="1" required value="${c.avgMonthlyExpenses3m}"></label><button class="primary-button" type="submit">Budget opslaan</button></form>
      <h3 class="detail-heading">Demoprofiel kiezen</h3><div class="profile-list">${customers.map((item, index) => `<button class="profile-row ${index === state.customerIndex ? "selected" : ""}" data-customer="${index}"><span class="profile-avatar">${escapeHtml(item.name.charAt(0))}</span><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.city)} · ${escapeHtml(item.goals.find((goal) => goal.id === item.activeGoalId)?.title || "Kompas")}</small></span>${index === state.customerIndex ? icon("check", 20) : icon("chevron", 18)}</button>`).join("")}</div>
      <button class="subtle-button" data-action="toggle-amounts">${icon("eye", 18)} ${state.hideAmounts ? "Bedragen tonen" : "Bedragen verbergen"}</button>`;
  } else if (state.sheet === "account") {
    title = "Mijn rekeningen";
    body = `<div class="detail-account"><span>Zichtrekening</span><strong>${amount(c.accounts.checkingBalance)}</strong><small>${escapeHtml(c.accounts.checkingIban)}</small></div>
      <div class="detail-account savings"><span>Spaarrekening</span><strong>${amount(c.accounts.savingsBalance)}</strong><small>${escapeHtml(c.accounts.savingsIban)}</small></div>
      <h3 class="detail-heading">Verrichtingen</h3><div class="transactions-list">${transactions(c.transactions, c.transactions.length)}</div>`;
  } else if (state.sheet === "kate") {
    title = "Kate";
    body = `<div class="kate-orb">${icon("spark", 32)}</div><h3 class="kate-title">Waarmee kan ik je helpen?</h3><p class="sheet-lead center">Bekijk je Kompas of ontdek wat een verandering voor je financiële ruimte betekent.</p>
      <button class="kate-suggestion" data-action="insight">Hoe sta ik ervoor met mijn doel? ${icon("arrow", 18)}</button>
      <button class="kate-suggestion" data-action="scenario">Wat als mijn kosten stijgen? ${icon("arrow", 18)}</button>
      <button class="kate-suggestion" data-action="why">Hoe wordt mijn profiel berekend? ${icon("arrow", 18)}</button>`;
  } else if (state.sheet === "goals") {
    title = "Mijn doelen";
    body = `<p class="sheet-lead">Kies een doel om je Kompas direct opnieuw te berekenen.</p><div class="profile-list">${c.goals.map((goal) => `<button class="profile-row ${goal.id === c.activeGoalId ? "selected" : ""}" data-goal="${escapeHtml(goal.id)}"><span class="profile-avatar">${escapeHtml(window.KBCAura.GoalCatalog[goal.type]?.icon || "🎯")}</span><span><strong>${escapeHtml(goal.title)}</strong><small>${amount(goal.savedAmount, 0)} van ${amount(goal.targetAmount, 0)} · ${goal.monthsToDeadline} maanden</small></span>${goal.id === c.activeGoalId ? icon("check", 20) : icon("chevron", 18)}</button>`).join("")}</div><button class="primary-button form-top" data-action="new-goal">Nieuw doel toevoegen</button>`;
  } else if (state.sheet === "new-goal") {
    title = "Nieuw Kompasdoel";
    body = `<form data-form="new-goal" class="edit-form"><label>Wat wil je bereiken?<select name="goalType">${Object.values(window.KBCAura.GoalCatalog).map((goal) => `<option value="${escapeHtml(goal.id)}" ${goal.id === "kot" ? "selected" : ""}>${escapeHtml(goal.icon)} ${escapeHtml(goal.shortTitle)}</option>`).join("")}</select></label><label>Doelbedrag (€)<input name="target" type="number" min="500" step="100" required value="7200"></label><label>Termijn in maanden<input name="months" type="number" min="1" max="240" step="1" required value="18"></label><button class="primary-button" type="submit">Doel toevoegen en activeren</button></form>`;
  } else if (state.sheet === "steering") {
    title = "Je plan bijsturen";
    body = `<p class="sheet-lead">Bekijk drie berekende mogelijkheden voor ${escapeHtml(result.activeGoal.title)}. Een keuze past alleen deze demo aan.</p><div class="steering-list">${result.steeringOptions.map((option) => `<div class="steering-card"><strong>${escapeHtml(option.title)}</strong><p>${escapeHtml(option.subtitle)}</p><button class="subtle-button" data-steer="${escapeHtml(option.type)}">Kies deze optie ${icon("arrow", 16)}</button></div>`).join("")}</div>`;
  } else if (state.sheet === "why") {
    title = "Waarom zie ik dit?";
    body = `<p class="sheet-lead">Je Kompas vergelijkt wat je voor je doel per maand nodig hebt met je geschatte financiële ruimte.</p><div class="metric-pair"><div><span>Inkomen / maand</span><strong>${amount(result.metrics.avgIncome3m, 0)}</strong></div><div><span>Uitgaven / maand</span><strong>${amount(result.metrics.avgExpenses3m, 0)}</strong></div></div><div class="metric-pair"><div><span>Ruimte / maand</span><strong>${amount(result.metrics.savingsCapacity, 0)}</strong></div><div><span>Nodig / maand</span><strong>${amount(result.metrics.neededPerMonth, 0)}</strong></div></div><p class="sheet-lead">Status: ${escapeHtml(status(result))}. Verhouding: ${result.metrics.ratio.toFixed(2).replace(".", ",")}. De berekening gebruikt je gekozen doel, gemiddelde inkomsten en uitgaven van drie maanden en gekende producten. Producten zijn suggesties; niets wordt automatisch afgesloten.</p><button class="primary-button" data-action="profile">Pas mijn budget aan</button>`;
  } else if (state.sheet === "transaction") {
    title = "Verrichting";
    const tx = c.transactions[state.transactionIndex];
    body = tx ? `<div class="transaction-detail"><span>${escapeHtml(tx.date)}</span><h3>${escapeHtml(tx.merchant)}</h3><strong class="${tx.amount > 0 ? "positive" : ""}">${amount(tx.amount)}</strong><p>Categorie: ${escapeHtml(tx.category)}</p></div>` : "";
  } else {
    title = "Meer";
    body = `<button class="menu-row" data-action="profile">${icon("user", 20)} Mijn profiel ${icon("chevron", 18)}</button>
      <button class="menu-row" data-action="account">${icon("wallet", 20)} Mijn rekeningen ${icon("chevron", 18)}</button>
      <button class="menu-row" data-action="scenario">${icon("chart", 20)} Wat als? ${icon("chevron", 18)}</button>
      <button class="menu-row" data-action="goals">${icon("chart", 20)} Mijn doelen ${icon("chevron", 18)}</button>`;
  }
  return `<div class="sheet-backdrop" data-action="close"><section class="bottom-sheet" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}"><div class="sheet-handle"></div><div class="sheet-header"><h2>${escapeHtml(title)}</h2><button class="sheet-close" data-action="close" aria-label="Sluiten">${icon("close", 21)}</button></div><div class="sheet-body">${body}</div></section></div>`;
}

function render(): void {
  const c = customer();
  const result = evaluate(c);
  const page = state.tab === "account" ? accountPage(c) : state.tab === "insight" ? kompasPage(c, result) : state.tab === "products" ? productsPage(c, result) : state.tab === "more" ? morePage(c, result) : home(c, result);
  root!.innerHTML = `<div class="demo-stage"><div class="phone-and-dashboard"><div class="iphone-frame"><div class="iphone-screen">
    <div class="ios-status"><span>9:41</span><span class="dynamic-island"></span><span class="status-icons"><span class="signal-bars"><i></i><i></i><i></i><i></i></span><svg width="19" height="12" viewBox="0 0 19 12" fill="none" aria-hidden="true"><path d="M1 4c4.4-4 12.6-4 17 0M4 7c3-2.8 8.9-2.8 11 0M8 10c1.2-1 2.8-1 4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span class="battery"><i></i></span></span></div>
    <header class="app-header"><button class="round-button profile-button" data-action="profile" aria-label="Mijn profiel">${icon("user", 22)}</button><button class="kate-search" data-action="kate">${icon("search", 19)}<span>Vraag het aan Kate</span></button><button class="round-button kate-button" data-action="kate" aria-label="Open Kate">${icon("spark", 22)}</button></header>
    <div class="phone-content">${page}</div>
    <nav class="bottom-nav" aria-label="Hoofdnavigatie"><button class="${state.tab === "home" ? "active" : ""}" data-tab="home">${icon("home", 22)}<span>Start</span></button><button class="${state.tab === "account" ? "active" : ""}" data-tab="account">${icon("grid", 22)}<span>Mijn KBC</span></button><button class="central-action ${state.tab === "insight" ? "active" : ""}" data-tab="insight" aria-label="Kompas"><span>${icon("chart", 25)}</span></button><button class="${state.tab === "products" ? "active" : ""}" data-tab="products">${icon("wallet", 22)}<span>Producten</span></button><button class="${state.tab === "more" ? "active" : ""}" data-tab="more">${icon("more", 22)}<span>Meer</span></button></nav>
    <div class="home-indicator"></div>${sheet(c, result)}
  </div></div><a class="staff-entry" href="dashboard.html" aria-label="Open medewerkerdashboard"><span class="staff-entry-icon">${icon("grid", 19)}</span><span>Medewerkerdashboard</span>${icon("arrow", 17)}</a></div></div>`;
}

root.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const choice = target.closest<HTMLElement>("[data-scenario]");
  const persona = target.closest<HTMLElement>("[data-customer]");
  const goal = target.closest<HTMLElement>("[data-goal]");
  const steer = target.closest<HTMLElement>("[data-steer]");
  const transaction = target.closest<HTMLElement>("[data-transaction]");
  const tab = target.closest<HTMLElement>("[data-tab]");
  const button = target.closest<HTMLElement>("[data-action]");
  if (choice) { state.scenarioId = choice.dataset.scenario as ScenarioId; render(); return; }
  if (persona) { state.customerIndex = Number(persona.dataset.customer); state.scenarioId = null; state.sheet = "none"; state.tab = "home"; render(); return; }
  if (goal) { customer().activeGoalId = goal.dataset.goal || customer().activeGoalId; state.sheet = "none"; state.tab = "insight"; render(); return; }
  if (transaction) { state.transactionIndex = Number(transaction.dataset.transaction); state.sheet = "transaction"; render(); return; }
  if (tab) { state.tab = tab.dataset.tab as Tab; state.sheet = "none"; render(); return; }
  if (steer) {
    const option = evaluate(customer()).steeringOptions.find((item) => item.type === steer.dataset.steer);
    const activeGoal = customer().goals.find((item) => item.id === customer().activeGoalId);
    if (option && activeGoal) {
      if (option.newMonthsToDeadline) activeGoal.monthsToDeadline = option.newMonthsToDeadline;
      if (option.newTargetAmount) activeGoal.targetAmount = option.newTargetAmount;
      if (option.expenseReduction) customer().avgMonthlyExpenses3m = Math.max(0, customer().avgMonthlyExpenses3m - option.expenseReduction);
      state.sheet = "none"; state.tab = "insight"; render();
    }
    return;
  }
  if (!button) return;
  if (button.dataset.action === "close" && target.closest(".bottom-sheet") && !target.closest(".sheet-close")) return;
  const action = button.dataset.action;
  if (action === "toggle-amounts") state.hideAmounts = !state.hideAmounts;
  else if (action === "close") state.sheet = "none";
  else if (action === "profile" || action === "scenario" || action === "kate" || action === "account" || action === "insight" || action === "more" || action === "goals" || action === "new-goal" || action === "steering" || action === "why") state.sheet = action;
  render();
});

root.addEventListener("submit", (event: SubmitEvent) => {
  const form = event.target as HTMLFormElement;
  if (!form.matches("[data-form]")) return;
  event.preventDefault();
  const values = new FormData(form);
  if (form.dataset.form === "budget") {
    const income = Number(values.get("income"));
    const expenses = Number(values.get("expenses"));
    if (!Number.isFinite(income) || !Number.isFinite(expenses) || income < 0 || expenses < 0) return;
    customer().avgMonthlyIncome3m = income;
    customer().avgMonthlyExpenses3m = expenses;
    state.sheet = "none"; state.tab = "insight";
  } else if (form.dataset.form === "new-goal") {
    const type = String(values.get("goalType") || "");
    const spec = window.KBCAura.GoalCatalog[type];
    const target = Number(values.get("target"));
    const months = Number(values.get("months"));
    if (!spec || !Number.isFinite(target) || !Number.isFinite(months) || target < spec.minAmount || target > spec.maxAmount || months < spec.minMonths || months > spec.maxMonths) {
      form.querySelector<HTMLElement>(".form-error")?.remove();
      form.insertAdjacentHTML("beforeend", `<p class="form-error">Voor ${escapeHtml(spec?.shortTitle || "dit doel")}: bedrag ${euro(spec?.minAmount || 500, 0)}–${euro(spec?.maxAmount || 150000, 0)} en ${spec?.minMonths || 1}–${spec?.maxMonths || 120} maanden.</p>`);
      return;
    }
    const id = `goal-${type}-${Date.now()}`;
    customer().goals.push({ id, type, title: spec.title, targetAmount: target, savedAmount: 0, monthsToDeadline: months });
    customer().activeGoalId = id;
    state.sheet = "none"; state.tab = "insight";
  }
  render();
});

render();
