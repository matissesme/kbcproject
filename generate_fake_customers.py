"""Generate 100 fake KBC Compass-style customers. Synthetic data only."""
from __future__ import annotations

import csv
import json
import random
from datetime import date, datetime, timedelta
from pathlib import Path

SEED = 20260930
random.seed(SEED)

OUT_DIR = Path(__file__).resolve().parent / "mathis data fake"

FIRST_M = [
    "Mathis", "Noah", "Lucas", "Arthur", "Leon", "Finn", "Jules", "Lars",
    "Wout", "Daan", "Milan", "Tibo", "Seppe", "Vince", "Stan", "Mats", "Kobe",
    "Bram", "Jens", "Robbe", "Senne", "Louis", "Hugo", "Nathan", "Theo",
    "Raphael", "Maxime", "Antoine", "Pierre",
]
FIRST_F = [
    "Lien", "Emma", "Louise", "Olivia", "Mila", "Ella", "Nora", "Sofie", "Fien",
    "Lotte", "Amber", "Jade", "Nina", "Luna", "Fleur", "Eva", "Noor", "Hanne",
    "Elise", "Marie", "Julie", "Laura", "Camille", "Chloe", "Manon", "Lea",
    "Ines", "Zoe", "Alice", "Clara",
]
LAST = [
    "Peeters", "Janssens", "Maes", "Jacobs", "Mertens", "Willems", "Claes",
    "Goossens", "Wouters", "De Smet", "Vermeulen", "De Vos", "Pauwels",
    "Lambert", "Dupont", "Martin", "Dubois", "Laurent", "Simon", "Michel",
    "Declercq", "Van den Berg", "De Clercq", "Van Damme", "Hermans",
    "Smets", "Coppens", "Aerts", "Verstraeten", "Cools", "De Cock",
    "Van Dyck", "Baert", "Desmet", "Vandenberghe", "Lemmens", "Bosmans",
]

CITIES = [
    ("Leuven", "3000", "Vlaams-Brabant", "nl"),
    ("Mechelen", "2800", "Antwerpen", "nl"),
    ("Antwerpen", "2000", "Antwerpen", "nl"),
    ("Gent", "9000", "Oost-Vlaanderen", "nl"),
    ("Brugge", "8000", "West-Vlaanderen", "nl"),
    ("Hasselt", "3500", "Limburg", "nl"),
    ("Aalst", "9300", "Oost-Vlaanderen", "nl"),
    ("Kortrijk", "8500", "West-Vlaanderen", "nl"),
    ("Turnhout", "2300", "Antwerpen", "nl"),
    ("Sint-Niklaas", "9100", "Oost-Vlaanderen", "nl"),
    ("Brussel", "1000", "Brussel", "fr"),
    ("Brussel", "1050", "Brussel", "fr"),
    ("Vilvoorde", "1800", "Vlaams-Brabant", "nl"),
    ("Genk", "3600", "Limburg", "nl"),
    ("Oostende", "8400", "West-Vlaanderen", "nl"),
    ("Roeselare", "8800", "West-Vlaanderen", "nl"),
    ("Dendermonde", "9200", "Oost-Vlaanderen", "nl"),
    ("Lier", "2500", "Antwerpen", "nl"),
    ("Tienen", "3300", "Vlaams-Brabant", "nl"),
    ("Waregem", "8790", "West-Vlaanderen", "nl"),
]

STREETS = [
    "Kerkstraat", "Stationsstraat", "Dorpsstraat", "Nieuwstraat", "Schoolstraat",
    "Molenstraat", "Kasteelstraat", "Veldstraat", "Bosstraat", "Langestraat",
    "Rue de la Loi", "Avenue Louise", "Naamsestraat", "Bondgenotenlaan",
    "Grote Markt", "Meir", "Veldkantstraat", "Tiensevest",
]

OCCUPATIONS = [
    "software developer", "verpleegkundige", "leerkracht", "boekhouder",
    "projectleider", "verkoper", "ingenieur", "HR-medewerker", "jurist",
    "zelfstandige bakker", "chauffeur", "apotheker", "architect",
    "marketing manager", "data analist", "elektricien", "kok",
    "politieagent", "civil servant", "student-jobber", "pensioen",
]

EMPLOYMENT = [
    "voltijds loontrekkende", "deeltijds loontrekkende", "zelfstandige",
    "ambtenaar", "werkzoekend", "student", "pensioen",
]

MARITAL = ["alleenstaand", "samenwonend", "gehuwd", "gescheiden", "weduwe/weduwnaar"]
HOUSING = ["eigenaar met hypotheek", "eigenaar zonder hypotheek", "huurder", "inwonend bij ouders"]
RISK = ["defensief", "neutraal", "dynamisch", "zeer dynamisch"]
CHANNELS = ["KBC Mobile", "KBC Touch", "kantoor", "telefoon", "chat"]
BRANCHES = [
    "KBC Leuven centrum", "KBC Mechelen", "KBC Antwerpen Meir", "KBC Gent Zuid",
    "KBC Brugge", "KBC Hasselt", "KBC Brussel Louise", "KBC Kortrijk",
    "KBC Turnhout", "KBC Aalst",
]
LIFE_EVENTS = [
    "geen",
    "verhuis gepland",
    "eerste kind verwacht",
    "tweede kind verwacht",
    "huwelijk gepland",
    "scheiding in behandeling",
    "nieuwe job",
    "start als zelfstandige",
    "pensioen binnen 24 maanden",
    "woning kopen",
    "woning verkopen",
    "auto vervangen",
    "studie kind start",
    "erfenis ontvangen",
    "langdurige ziekte",
]
INTENTS = [
    "sparen opbouwen",
    "woningfinanciering",
    "beleggingsadvies",
    "pensioenplanning",
    "verzekering herzien",
    "liquiditeit nodig",
    "kinderen beschermen",
    "duurzaam beleggen",
    "schulden verminderen",
    "digitaliseren van bankieren",
]
NBA = [
    "gesprek woningkrediet",
    "hospitalisatieverzekering voorstellen",
    "pensioensparen activeren",
    "beleggingsprofiel actualiseren",
    "brandverzekering updaten na verhuis",
    "automatisch sparen opzetten",
    "KBC Mobile onboarding",
    "overlijdensdekking herzien",
    "budgetcoach in Mobile",
    "termijnrekening voor overtollige cash",
    "autoverzekering hernieuwen",
    "geen actie",
]


def iban(i: int) -> str:
    return f"BE71 968 {1000000 + i:07d}"


def birth_date(age: int) -> str:
    today = date(2026, 9, 30)
    b = today.replace(year=today.year - age) - timedelta(days=random.randint(0, 364))
    return b.isoformat()


def make_customer(i: int) -> dict:
    n = i + 1
    city, postal, province, lang = random.choice(CITIES)
    gender = random.choices(["vrouw", "man", "x"], weights=[48, 48, 4])[0]
    first = random.choice(FIRST_F if gender == "vrouw" else FIRST_M)
    last = random.choice(LAST)
    age = random.randint(18, 78)

    if age < 23:
        employment = random.choice(["student", "deeltijds loontrekkende"])
        occupation = "student-jobber" if employment == "student" else random.choice(
            ["verkoper", "kok", "chauffeur"]
        )
        marital = random.choice(["alleenstaand", "samenwonend"])
        children = 0
        housing = random.choice(["huurder", "inwonend bij ouders"])
        income = round(random.uniform(500, 1600), 2)
    elif age >= 66:
        employment = "pensioen"
        occupation = "pensioen"
        marital = random.choice(["gehuwd", "weduwe/weduwnaar", "alleenstaand", "gescheiden"])
        children = random.randint(0, 3)
        housing = random.choice(["eigenaar zonder hypotheek", "eigenaar zonder hypotheek", "huurder"])
        income = round(random.uniform(1400, 3200), 2)
    else:
        employment = random.choices(
            ["voltijds loontrekkende", "deeltijds loontrekkende", "zelfstandige", "ambtenaar", "werkzoekend"],
            weights=[50, 15, 15, 12, 8],
        )[0]
        occupation = random.choice([o for o in OCCUPATIONS if o not in ("student-jobber", "pensioen")])
        marital = random.choice(["alleenstaand", "samenwonend", "gehuwd", "gescheiden"])
        children = 0 if marital == "alleenstaand" and random.random() < 0.75 else random.randint(0, 3)
        if age < 28:
            housing = random.choice(["huurder", "huurder", "inwonend bij ouders", "eigenaar met hypotheek"])
        else:
            housing = random.choice(
                ["eigenaar met hypotheek", "eigenaar met hypotheek", "eigenaar zonder hypotheek", "huurder"]
            )
        if employment == "werkzoekend":
            income = round(random.uniform(1100, 1800), 2)
        else:
            income = round(random.uniform(1800, 7200), 2)

    current_balance = round(random.uniform(250, 18000), 2)
    savings_balance = round(random.uniform(0, 85000), 2)
    investments = round(max(0, random.gauss(12000, 25000)), 2)
    if age < 25:
        investments = round(random.uniform(0, 2500), 2)
    pension = round(random.uniform(0, 45000), 2) if age >= 25 else 0.0
    real_estate = 0.0
    mortgage = 0.0
    if housing.startswith("eigenaar"):
        real_estate = round(random.uniform(180000, 620000), 2)
        if "met hypotheek" in housing:
            mortgage = round(real_estate * random.uniform(0.15, 0.75), 2)
    consumer_loan = 0.0
    if employment != "pensioen" and random.random() < 0.22:
        consumer_loan = round(random.uniform(800, 18000), 2)

    insurances = {
        "woning": housing.startswith("eigenaar") or random.random() < 0.35,
        "auto": random.random() < 0.62,
        "leven": random.random() < 0.4 or mortgage > 0,
        "hospitalisatie": random.random() < 0.55,
        "familiale": random.random() < 0.5,
        "rechtsbijstand": random.random() < 0.22,
    }

    liquid = round(current_balance + savings_balance, 2)
    invested = round(investments + pension, 2)
    assets = round(liquid + invested + real_estate, 2)
    liabilities = round(mortgage + consumer_loan, 2)
    net_worth = round(assets - liabilities, 2)

    if housing == "huurder" and 25 <= age <= 40 and random.random() < 0.4:
        life_event, intent = "woning kopen", "woningfinanciering"
    elif age >= 58 and age < 67:
        life_event, intent = "pensioen binnen 24 maanden", "pensioenplanning"
    elif children > 0 and age < 45 and random.random() < 0.25:
        life_event, intent = "studie kind start", "kinderen beschermen"
    elif employment == "zelfstandige" and random.random() < 0.3:
        life_event, intent = "start als zelfstandige", "verzekering herzien"
    else:
        life_event = random.choice(["geen", "geen", "nieuwe job", "auto vervangen", "verhuis gepland"])
        intent = random.choice(INTENTS)

    products = []
    products.append("zichtrekening")
    if savings_balance > 50:
        products.append("spaarrekening")
    if investments > 500:
        products.append("beleggingen")
    if pension > 0:
        products.append("pensioensparen")
    if mortgage > 0:
        products.append("woonlening")
    if consumer_loan > 0:
        products.append("lening op afbetaling")
    for k, v in insurances.items():
        if v:
            products.append(f"verzekering_{k}")

    last_login = date(2026, 9, 30) - timedelta(days=random.randint(0, 90))
    last_advice = date(2026, 9, 30) - timedelta(days=random.randint(10, 720))

    risk = random.choice(RISK)
    if age >= 65:
        risk = random.choice(["defensief", "neutraal"])

    return {
        "customer_id": f"KBC-{n:04d}",
        "profile": {
            "first_name": first,
            "last_name": last,
            "full_name": f"{first} {last}",
            "gender": gender,
            "birth_date": birth_date(age),
            "age": age,
            "nationality": "BE",
            "language": lang,
            "email": f"{first.lower()}.{last.lower().replace(' ', '')}{n}@example.be",
            "phone": f"+32 4{random.randint(70, 99)} {random.randint(10, 99)} {random.randint(10, 99)} {random.randint(10, 99)}",
            "address": {
                "street": f"{random.choice(STREETS)} {random.randint(1, 180)}",
                "postal_code": postal,
                "city": city,
                "province": province,
                "country": "Belgie",
            },
        },
        "household": {
            "marital_status": marital,
            "children_count": children,
            "employment_status": employment,
            "occupation": occupation,
            "net_monthly_income_eur": income,
            "housing_status": housing,
        },
        "compass": {
            "branch": random.choice(BRANCHES),
            "relationship_manager": random.choice(
                ["Anke Vermeulen", "Tom Janssens", "Sofie Maes", "Pieter Claes", "Elise Dupont"]
            ),
            "kbc_mobile_active": random.random() < 0.82,
            "preferred_channel": random.choice(CHANNELS),
            "risk_profile": risk,
            "sustainability_preference": random.choice(["geen voorkeur", "duurzaam", "sterk duurzaam"]),
            "last_mobile_login": last_login.isoformat(),
            "last_advice_contact": last_advice.isoformat(),
            "engagement_score": random.randint(12, 98),
            "iban_main": iban(n),
            "products": products,
            "assets_eur": {
                "current_account": current_balance,
                "savings": savings_balance,
                "liquid_assets": liquid,
                "investments": investments,
                "tax_advantaged_pension": pension,
                "real_estate_estimated": real_estate,
                "total_assets": assets,
            },
            "liabilities_eur": {
                "mortgage_outstanding": mortgage,
                "consumer_loan_outstanding": consumer_loan,
                "total_liabilities": liabilities,
            },
            "net_worth_eur": net_worth,
            "insurances": insurances,
        },
        "signals": {
            "life_event": life_event,
            "detected_intent": intent,
            "next_best_action": random.choice(NBA),
            "churn_risk": random.choice(["laag", "laag", "laag", "medium", "hoog"]),
            "credit_need_signal": mortgage == 0 and housing in ("huurder", "inwonend bij ouders") and 26 <= age <= 42,
        },
    }


def flatten(c: dict) -> dict:
    p, h, k, s = c["profile"], c["household"], c["compass"], c["signals"]
    a = p["address"]
    return {
        "customer_id": c["customer_id"],
        "first_name": p["first_name"],
        "last_name": p["last_name"],
        "gender": p["gender"],
        "birth_date": p["birth_date"],
        "age": p["age"],
        "language": p["language"],
        "email": p["email"],
        "phone": p["phone"],
        "street": a["street"],
        "postal_code": a["postal_code"],
        "city": a["city"],
        "province": a["province"],
        "marital_status": h["marital_status"],
        "children_count": h["children_count"],
        "employment_status": h["employment_status"],
        "occupation": h["occupation"],
        "net_monthly_income_eur": h["net_monthly_income_eur"],
        "housing_status": h["housing_status"],
        "branch": k["branch"],
        "relationship_manager": k["relationship_manager"],
        "kbc_mobile_active": k["kbc_mobile_active"],
        "preferred_channel": k["preferred_channel"],
        "risk_profile": k["risk_profile"],
        "sustainability_preference": k["sustainability_preference"],
        "last_mobile_login": k["last_mobile_login"],
        "last_advice_contact": k["last_advice_contact"],
        "engagement_score": k["engagement_score"],
        "iban_main": k["iban_main"],
        "products": "|".join(k["products"]),
        "current_account_eur": k["assets_eur"]["current_account"],
        "savings_eur": k["assets_eur"]["savings"],
        "investments_eur": k["assets_eur"]["investments"],
        "pension_eur": k["assets_eur"]["tax_advantaged_pension"],
        "real_estate_eur": k["assets_eur"]["real_estate_estimated"],
        "total_assets_eur": k["assets_eur"]["total_assets"],
        "mortgage_eur": k["liabilities_eur"]["mortgage_outstanding"],
        "consumer_loan_eur": k["liabilities_eur"]["consumer_loan_outstanding"],
        "net_worth_eur": k["net_worth_eur"],
        "ins_woning": k["insurances"]["woning"],
        "ins_auto": k["insurances"]["auto"],
        "ins_leven": k["insurances"]["leven"],
        "ins_hospitalisatie": k["insurances"]["hospitalisatie"],
        "ins_familiale": k["insurances"]["familiale"],
        "life_event": s["life_event"],
        "detected_intent": s["detected_intent"],
        "next_best_action": s["next_best_action"],
        "churn_risk": s["churn_risk"],
        "credit_need_signal": s["credit_need_signal"],
    }


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    customers = [make_customer(i) for i in range(100)]
    (OUT_DIR / "customers.json").write_text(
        json.dumps(
            {
                "generated_at": datetime(2026, 9, 30, 19, 55).isoformat(),
                "count": 100,
                "note": "Volledig synthetische testdata. Geen echte KBC-klanten. IBANs en e-mails zijn nep.",
                "customers": customers,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )
    rows = [flatten(c) for c in customers]
    with (OUT_DIR / "customers.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {len(customers)} customers to {OUT_DIR}")


if __name__ == "__main__":
    main()
