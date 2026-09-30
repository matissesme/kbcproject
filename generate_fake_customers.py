"""Seed KBC Kompas: ~200 klanten, 12 maanden transacties, 3 demo-persona's."""
from __future__ import annotations

import csv
import json
import random
import sqlite3
from datetime import date, datetime, timedelta
from pathlib import Path

SEED = 20260930
random.seed(SEED)

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
OUT_DIR = ROOT / "mathis data fake"
TODAY = date(2026, 9, 30)
TX_START = date(2025, 10, 1)

FIRST_M = [
    "Noah", "Lucas", "Arthur", "Leon", "Finn", "Jules", "Lars", "Wout", "Daan",
    "Milan", "Tibo", "Seppe", "Vince", "Stan", "Mats", "Kobe", "Bram", "Jens",
    "Robbe", "Senne", "Louis", "Hugo", "Nathan", "Theo", "Maxime", "Pierre",
]
FIRST_F = [
    "Lien", "Emma", "Louise", "Olivia", "Mila", "Ella", "Nora", "Sofie", "Fien",
    "Lotte", "Amber", "Jade", "Nina", "Luna", "Fleur", "Eva", "Noor", "Hanne",
    "Elise", "Marie", "Julie", "Laura", "Camille", "Chloe", "Manon", "Lea",
]
LAST = [
    "Peeters", "Janssens", "Maes", "Jacobs", "Mertens", "Willems", "Claes",
    "Goossens", "Wouters", "De Smet", "Vermeulen", "De Vos", "Pauwels",
    "Lambert", "Dupont", "Martin", "Dubois", "Hermans", "Smets", "Coppens",
    "Aerts", "Cools", "Lemmens", "Bosmans", "Declercq",
]
CITIES = ["Leuven", "Mechelen", "Antwerpen", "Gent", "Brugge", "Hasselt", "Aalst", "Kortrijk", "Brussel"]
EXPENSE_CATS = [
    ("boodschappen", 180, 420),
    ("horeca", 40, 220),
    ("transport", 30, 160),
    ("abonnementen", 15, 55),
    ("shopping", 20, 180),
    ("energie", 60, 160),
]

GOAL_TYPES_BY_SITUATIE = {
    "student": ["kot", "reis"],
    "starter": ["eerste_auto", "reis", "kot", "woning"],
    "koppel": ["woning", "gezin", "reis"],
    "gezin": ["woning", "gezin", "eerste_auto", "pensioen"],
    "pensioen": ["pensioen", "reis"],
}


def months_between(start: date, end: date) -> list[date]:
    cur = date(start.year, start.month, 1)
    out = []
    while cur <= end:
        out.append(cur)
        if cur.month == 12:
            cur = date(cur.year + 1, 1, 1)
        else:
            cur = date(cur.year, cur.month + 1, 1)
    return out


def random_day(year: int, month: int, lo: int = 1, hi: int = 28) -> date:
    return date(year, month, random.randint(lo, hi))


def add_months(d: date, months: int) -> date:
    m = d.month - 1 + months
    y = d.year + m // 12
    m = m % 12 + 1
    day = min(d.day, 28)
    return date(y, m, day)


def load_catalog() -> dict:
    return json.loads((DATA_DIR / "catalog" / "goals.json").read_text(encoding="utf-8"))


def catalog_by_type(catalog: dict) -> dict:
    return {g["type"]: g for g in catalog["doelen"]}


def make_transactions(klant_id: str, inkomen: float, housing_cost: float, extra_cats: list[tuple] | None = None) -> list[tuple]:
    rows = []
    extra = extra_cats or []
    for m in months_between(TX_START, TODAY):
        rows.append((klant_id, random_day(m.year, m.month, 1, 4).isoformat(), round(inkomen, 2), "loon"))
        if housing_cost > 0:
            rows.append((klant_id, random_day(m.year, m.month, 1, 6).isoformat(), round(-housing_cost, 2), "huisvesting"))
        for cat, lo, hi in EXPENSE_CATS + extra:
            amount = round(-random.uniform(lo, hi), 2)
            rows.append((klant_id, random_day(m.year, m.month, 5, 27).isoformat(), amount, cat))
            if random.random() < 0.35:
                rows.append((klant_id, random_day(m.year, m.month, 8, 28).isoformat(), round(-random.uniform(8, 45), 2), cat))
    return rows


def pick_goals(klant_id: str, situatie: str, catalog: dict, saved: float) -> list[tuple]:
    types = GOAL_TYPES_BY_SITUATIE[situatie]
    n = 1 if random.random() < 0.55 else 2
    chosen = random.sample(types, k=min(n, len(types)))
    goals = []
    remaining = saved
    for t in chosen:
        meta = catalog[t]
        bedrag = round(random.uniform(meta["kost_min_eur"], min(meta["kost_typisch_eur"] * 1.2, meta["kost_max_eur"])), 2)
        months = random.randint(meta["minimale_termijn_maanden"], meta["minimale_termijn_maanden"] + 18)
        deadline = add_months(TODAY, months).isoformat()
        part = round(remaining * random.uniform(0.2, 0.7), 2) if remaining > 0 else 0.0
        remaining = max(0.0, remaining - part)
        goals.append((klant_id, t, bedrag, deadline, part, "actief"))
    return goals


def persona_lisa(catalog: dict) -> dict:
    inkomen = 1180.0
    huis = 480.0
    txs = make_transactions("lisa", inkomen, huis, extra_cats=[("studie", 20, 70)])
    return {
        "klant": ("lisa", "Lisa", "Vandenberghe", 21, "student", inkomen, 2100.0, "Leuven", "nl", "lisa", None),
        "doelen": [
            ("lisa", "kot", 4500.0, "2027-08-15", 1400.0, "actief"),
            ("lisa", "reis", 1800.0, "2027-07-01", 700.0, "actief"),
        ],
        "transacties": txs,
        "events": [],
        "simulate": [
            {
                "type": "verrassing_uitgave",
                "datum": TODAY.isoformat(),
                "bedrag": -620.0,
                "categorie": "onverwachte_uitgave",
                "toelichting": "Laptop kapot, herstelling 620 euro.",
            },
            {
                "type": "nieuwe_job",
                "datum": TODAY.isoformat(),
                "bedrag": 450.0,
                "categorie": "loon",
                "toelichting": "Weekendjob erbij, +450 euro per maand.",
            },
        ],
    }


def persona_koppel(catalog: dict) -> dict:
    inkomen = 4200.0
    huis = 1100.0
    txs = make_transactions("koppel", inkomen, huis)
    return {
        "klant": ("koppel", "Jan", "Peeters", 29, "koppel", inkomen, 18500.0, "Mechelen", "nl", "koppel", "hh-koppel"),
        "partner": ("koppel-lotte", "Lotte", "Peeters", 28, "koppel", 2400.0, 6200.0, "Mechelen", "nl", "koppel", "hh-koppel"),
        "doelen": [
            ("koppel", "woning", 45000.0, "2029-06-01", 15200.0, "actief"),
            ("koppel", "gezin", 8000.0, "2028-03-01", 2100.0, "actief"),
        ],
        "transacties": txs,
        "events": [
            ("koppel", "2026-06-12", "inkomenswijziging", 300.0, "Jan krijgt opslag van 300 euro."),
        ],
        "simulate": [
            {
                "type": "verrassing_uitgave",
                "datum": TODAY.isoformat(),
                "bedrag": -2400.0,
                "categorie": "onverwachte_uitgave",
                "toelichting": "Autopech, factuur 2400 euro.",
            }
        ],
    }


def persona_gezin(catalog: dict) -> dict:
    inkomen = 3900.0
    huis = 1350.0
    txs = make_transactions("gezinsvader", inkomen, huis, extra_cats=[("kinderen", 80, 220)])
    return {
        "klant": ("gezinsvader", "Tom", "Janssens", 41, "gezin", inkomen, 9400.0, "Gent", "nl", "gezinsvader", "hh-gezin"),
        "doelen": [
            ("gezinsvader", "eerste_auto", 12000.0, "2027-05-01", 3800.0, "actief"),
            ("gezinsvader", "pensioen", 80000.0, "2045-09-01", 4100.0, "actief"),
        ],
        "transacties": txs,
        "events": [
            ("gezinsvader", "2026-04-02", "nieuwe_job", 0.0, "Nieuwe job, inkomen stabiel maar andere ritmes."),
        ],
        "simulate": [
            {
                "type": "verrassing_uitgave",
                "datum": TODAY.isoformat(),
                "bedrag": -1800.0,
                "categorie": "onverwachte_uitgave",
                "toelichting": "Wasbak en leidingen, 1800 euro.",
            }
        ],
    }


def random_klant(i: int, catalog: dict) -> dict:
    kid = f"KBC-{i:04d}"
    roll = random.random()
    if roll < 0.18:
        situatie, age = "student", random.randint(18, 24)
        inkomen = round(random.uniform(700, 1400), 2)
        huis = round(random.uniform(0, 520), 2)
        gender = random.choice(["vrouw", "man"])
    elif roll < 0.38:
        situatie, age = "starter", random.randint(23, 30)
        inkomen = round(random.uniform(1900, 3200), 2)
        huis = round(random.uniform(450, 900), 2)
        gender = random.choice(["vrouw", "man"])
    elif roll < 0.58:
        situatie, age = "koppel", random.randint(26, 38)
        inkomen = round(random.uniform(3200, 5600), 2)
        huis = round(random.uniform(800, 1400), 2)
        gender = random.choice(["vrouw", "man"])
    elif roll < 0.88:
        situatie, age = "gezin", random.randint(32, 52)
        inkomen = round(random.uniform(2800, 6200), 2)
        huis = round(random.uniform(900, 1600), 2)
        gender = "man" if random.random() < 0.55 else "vrouw"
    else:
        situatie, age = "pensioen", random.randint(66, 78)
        inkomen = round(random.uniform(1400, 2800), 2)
        huis = round(random.uniform(0, 700), 2)
        gender = random.choice(["vrouw", "man"])

    first = random.choice(FIRST_F if gender == "vrouw" else FIRST_M)
    last = random.choice(LAST)
    saved = round(max(50, random.gauss(4000 if situatie != "student" else 800, 3500)), 2)
    extra = [("studie", 15, 60)] if situatie == "student" else []
    if situatie == "gezin":
        extra.append(("kinderen", 70, 240))
    events = []
    if random.random() < 0.22:
        events.append((kid, random_day(2026, random.randint(1, 9)).isoformat(), "verrassing_uitgave", round(-random.uniform(200, 900), 2), "Onverwachte factuur."))
    if random.random() < 0.12:
        events.append((kid, random_day(2026, random.randint(1, 9)).isoformat(), "nieuwe_job", round(random.uniform(150, 500), 2), "Inkomenswijziging door nieuwe job."))
    return {
        "klant": (kid, first, last, age, situatie, inkomen, saved, random.choice(CITIES), "nl", None, None),
        "doelen": pick_goals(kid, situatie, catalog, saved),
        "transacties": make_transactions(kid, inkomen, huis, extra),
        "events": events,
    }


def init_db(path: Path) -> sqlite3.Connection:
    if path.exists():
        path.unlink()
    conn = sqlite3.connect(path)
    conn.executescript((DATA_DIR / "schema.sql").read_text(encoding="utf-8"))
    return conn


def insert_bundle(conn: sqlite3.Connection, bundle: dict) -> None:
    conn.execute(
        "INSERT INTO klant VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        bundle["klant"],
    )
    if bundle.get("partner"):
        conn.execute(
            "INSERT INTO klant VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            bundle["partner"],
        )
    conn.executemany(
        "INSERT INTO doel (klant_id, type, bedrag, deadline, gespaard, status) VALUES (?,?,?,?,?,?)",
        bundle["doelen"],
    )
    conn.executemany(
        "INSERT INTO transactie (klant_id, datum, bedrag, categorie) VALUES (?,?,?,?)",
        bundle["transacties"],
    )
    if bundle.get("events"):
        conn.executemany(
            "INSERT INTO plan_event (klant_id, datum, type, bedrag, toelichting) VALUES (?,?,?,?,?)",
            bundle["events"],
        )


def export_csv(conn: sqlite3.Connection, out: Path) -> None:
    out.mkdir(parents=True, exist_ok=True)
    for table in ("klant", "doel", "transactie", "plan_event"):
        rows = conn.execute(f"SELECT * FROM {table}").fetchall()
        names = [d[0] for d in conn.execute(f"SELECT * FROM {table} LIMIT 0").description]
        with (out / f"{table}.csv").open("w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(names)
            w.writerows(rows)


def export_personas(lisa, koppel, gezin, out: Path) -> None:
    folder = out / "personas"
    folder.mkdir(parents=True, exist_ok=True)
    for name, bundle in (("lisa", lisa), ("koppel", koppel), ("gezinsvader", gezin)):
        payload = {
            "klant": {
                "id": bundle["klant"][0],
                "voornaam": bundle["klant"][1],
                "achternaam": bundle["klant"][2],
                "leeftijd": bundle["klant"][3],
                "situatie": bundle["klant"][4],
                "inkomen": bundle["klant"][5],
                "gespaard": bundle["klant"][6],
                "stad": bundle["klant"][7],
            },
            "doelen": [
                {"type": d[1], "bedrag": d[2], "deadline": d[3], "gespaard": d[4]}
                for d in bundle["doelen"]
            ],
            "simulate_events": bundle.get("simulate", []),
            "transactie_count": len(bundle["transacties"]),
        }
        if bundle.get("partner"):
            payload["partner"] = {
                "id": bundle["partner"][0],
                "voornaam": bundle["partner"][1],
                "achternaam": bundle["partner"][2],
                "leeftijd": bundle["partner"][3],
                "inkomen": bundle["partner"][5],
            }
        (folder / f"{name}.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> None:
    catalog = catalog_by_type(load_catalog())
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    db_path = DATA_DIR / "kompas.db"
    conn = init_db(db_path)

    lisa = persona_lisa(catalog)
    koppel = persona_koppel(catalog)
    gezin = persona_gezin(catalog)
    for bundle in (lisa, koppel, gezin):
        insert_bundle(conn, bundle)

    extras = 197
    for i in range(1, extras + 1):
        insert_bundle(conn, random_klant(i, catalog))

    conn.commit()

    counts = {
        "klanten": conn.execute("SELECT COUNT(*) FROM klant").fetchone()[0],
        "transacties": conn.execute("SELECT COUNT(*) FROM transactie").fetchone()[0],
        "doelen": conn.execute("SELECT COUNT(*) FROM doel").fetchone()[0],
        "events": conn.execute("SELECT COUNT(*) FROM plan_event").fetchone()[0],
    }

    export_csv(conn, OUT_DIR)
    export_personas(lisa, koppel, gezin, OUT_DIR)
    (OUT_DIR / "kompas.db").write_bytes(db_path.read_bytes())
    (OUT_DIR / "meta.json").write_text(
        json.dumps(
            {
                "generated_at": datetime(2026, 9, 30, 20, 10).isoformat(),
                "today": TODAY.isoformat(),
                "transaction_window": [TX_START.isoformat(), TODAY.isoformat()],
                "counts": counts,
                "personas": ["lisa", "koppel", "gezinsvader"],
                "note": "Synthetische testdata voor KBC Kompas. Geen echte klanten.",
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )
    conn.close()
    print(json.dumps(counts, indent=2))
    print(f"DB: {db_path}")
    print(f"Export: {OUT_DIR}")


if __name__ == "__main__":
    main()
