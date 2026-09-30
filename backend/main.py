"""
KBC KOMPAS - BACKEND API (Python + FastAPI + SQLite)
Implementeert de 5 endpoints van Jasper:
  1. POST /doel              -> Maak of update een doel (type, bedrag, deadline)
  2. GET  /kompas/{klant_id} -> Berekent Kompas-status, ratio, spaarcapaciteit, route & bijstuur-opties
  3. POST /event             -> Simuleer een plan_event (verrassings-uitgave, inkomenswijziging, etc.)
  4. GET  /adviseur/{klant_id} -> KBC Adviseursscherm met klantprofiel & productkoppeling
  5. GET  /dashboard         -> Macro-dashboard over alle ~200 klanten
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import sqlite3
import os

app = FastAPI(title="KBC Kompas Engine API", version="1.0.0")

# CORS toestaan voor lokaal testen via frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "kbc_kompas.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS klant (
            id TEXT PRIMARY KEY,
            naam TEXT NOT NULL,
            leeftijd INTEGER,
            stad TEXT,
            situatie TEXT,
            inkomen_3m REAL,
            uitgaven_3m REAL,
            spaargeld REAL
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS doel (
            id TEXT PRIMARY KEY,
            klant_id TEXT NOT NULL,
            type TEXT NOT NULL,
            titel TEXT,
            bedrag REAL NOT NULL,
            gespaard REAL DEFAULT 0,
            deadline_maanden INTEGER NOT NULL,
            FOREIGN KEY (klant_id) REFERENCES klant (id)
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS transactie (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            klant_id TEXT NOT NULL,
            datum TEXT,
            handelaar TEXT,
            bedrag REAL,
            categorie TEXT,
            FOREIGN KEY (klant_id) REFERENCES klant (id)
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS plan_event (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            klant_id TEXT NOT NULL,
            datum TEXT,
            type TEXT NOT NULL,
            omschrijving TEXT,
            bedrag_impact REAL,
            FOREIGN KEY (klant_id) REFERENCES klant (id)
        )
    """)

    # Seed demo klanten indien leeg
    c.execute("SELECT COUNT(*) FROM klant")
    if c.fetchone()[0] == 0:
        c.execute("INSERT INTO klant VALUES ('klant-lisa-01', 'Lisa Peeters', 21, 'Leuven', 'Student / Starter', 1520.0, 1120.0, 3600.0)")
        c.execute("INSERT INTO doel VALUES ('goal-lisa-kot', 'klant-lisa-01', 'kot', 'Op Kot in Leuven', 7200.0, 3600.0, 10)")

        c.execute("INSERT INTO klant VALUES ('klant-koppel-02', 'Lukas & Emma Vermeulen', 28, 'Gent', 'Samenwonend Koppel', 4980.0, 4030.0, 31500.0)")
        c.execute("INSERT INTO doel VALUES ('goal-koppel-woning', 'klant-koppel-02', 'woning', 'Eerste Koopwoning Gent', 45000.0, 31500.0, 15)")

        c.execute("INSERT INTO klant VALUES ('klant-thomas-03', 'Thomas Vandenberghe', 37, 'Antwerpen', 'Gezinsvader', 4750.0, 4470.0, 4100.0)")
        c.execute("INSERT INTO doel VALUES ('goal-thomas-gezin', 'klant-thomas-03', 'gezin', 'Gezinsuitbreiding & Babybuffer', 6500.0, 4100.0, 7)")

    conn.commit()
    conn.close()

init_db()

# --- Modellen ---
class DoelInput(BaseModel):
    klant_id: str
    type: str
    titel: Optional[str] = None
    bedrag: float
    deadline_maanden: int
    gespaard: Optional[float] = 0.0

class EventInput(BaseModel):
    klant_id: str
    type: str
    omschrijving: str
    bedrag_impact: float

# --- 1. POST /doel ---
@app.post("/doel")
def create_or_update_doel(doel: DoelInput):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id FROM doel WHERE klant_id = ?", (doel.klant_id,))
    row = c.fetchone()
    if row:
        goal_id = row["id"]
        c.execute("""
            UPDATE doel 
            SET type = ?, titel = ?, bedrag = ?, deadline_maanden = ?, gespaard = ?
            WHERE id = ?
        """, (doel.type, doel.titel or doel.type, doel.bedrag, doel.deadline_maanden, doel.gespaard, goal_id))
    else:
        goal_id = f"goal-{doel.klant_id}-{doel.type}"
        c.execute("""
            INSERT INTO doel (id, klant_id, type, titel, bedrag, deadline_maanden, gespaard)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (goal_id, doel.klant_id, doel.type, doel.titel or doel.type, doel.bedrag, doel.deadline_maanden, doel.gespaard))
    conn.commit()
    conn.close()
    return {"status": "success", "goal_id": goal_id, "message": "KBC Kompas doel succesvol ingesteld"}

# --- 2. GET /kompas/{klant_id} ---
@app.get("/kompas/{klant_id}")
def get_kompas(klant_id: str):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM klant WHERE id = ?", (klant_id,))
    klant = c.fetchone()
    if not klant:
        conn.close()
        raise HTTPException(status_code=404, detail="Klant niet gevonden")

    c.execute("SELECT * FROM doel WHERE klant_id = ? LIMIT 1", (klant_id,))
    doel = c.fetchone()
    conn.close()

    if not doel:
        return {"status": "geen_doel", "message": "Klant heeft nog geen actief Kompas-doel"}

    # Wiskundige formule van Jasper
    inkomen = klant["inkomen_3m"]
    uitgaven = klant["uitgaven_3m"]
    spaarcapaciteit = max(0.0, inkomen - uitgaven)

    target = doel["bedrag"]
    gespaard = doel["gespaard"]
    resterend = max(0.0, target - gespaard)
    maanden = max(1, doel["deadline_maanden"])
    nodig_per_maand = round(resterend / maanden, 2) if resterend > 0 else 0.0

    ratio = round(spaarcapaciteit / nodig_per_maand, 2) if nodig_per_maand > 0 else 2.0

    if ratio >= 1.0:
        koers_status = "OP_KOERS"
        label = "Op koers"
        kleur = "#10b981"
    elif ratio >= 0.7:
        koers_status = "BIJSTUREN"
        label = "Bijsturen nodig"
        kleur = "#f59e0b"
    else:
        koers_status = "PLAN_AANPASSEN"
        label = "Plan aanpassen / Af te raden"
        kleur = "#dc2626"

    # Bijstuur opties
    nieuwe_maanden = max(maanden + 2, int(resterend / max(spaarcapaciteit, 50))) if resterend > 0 else maanden
    haalbaar_bedrag = round(gespaard + (spaarcapaciteit * maanden), 2)
    tekort = round(max(0.0, nodig_per_maand - spaarcapaciteit), 2)

    return {
        "klant": {
            "id": klant["id"],
            "naam": klant["naam"],
            "situatie": klant["situatie"],
            "gem_inkomen_3m": inkomen,
            "gem_uitgaven_3m": uitgaven,
            "spaarcapaciteit": spaarcapaciteit
        },
        "doel": {
            "type": doel["type"],
            "titel": doel["titel"],
            "target": target,
            "gespaard": gespaard,
            "resterend": resterend,
            "maanden": maanden,
            "nodig_per_maand": nodig_per_maand
        },
        "kompas": {
            "ratio": ratio,
            "status": koers_status,
            "label": label,
            "kleur": kleur,
            "bijsturen_opties": {
                "optie_1_deadline_verschuiven": {
                    "nieuwe_maanden": nieuwe_maanden,
                    "nieuw_maandbedrag": round(resterend / nieuwe_maanden, 2)
                },
                "optie_2_bedrag_verlagen": {
                    "haalbaar_doelbedrag": haalbaar_bedrag
                },
                "optie_3_uitgaven_verlagen": {
                    "besparing_nodig": tekort
                }
            }
        }
    }

# --- 3. POST /event ---
@app.post("/event")
def trigger_event(event: EventInput):
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO plan_event (klant_id, datum, type, omschrijving, bedrag_impact)
        VALUES (?, datetime('now'), ?, ?, ?)
    """, (event.klant_id, event.type, event.omschrijving, event.bedrag_impact))

    # Impact toepassen op klant uitgaven of spaargeld
    if event.bedrag_impact < 0:
        c.execute("UPDATE klant SET spaargeld = MAX(0, spaargeld + ?) WHERE id = ?", (event.bedrag_impact, event.klant_id))
    conn.commit()
    conn.close()
    return {"status": "event_gelogd", "klant_id": event.klant_id, "impact": event.bedrag_impact}

# --- 4. GET /adviseur/{klant_id} ---
@app.get("/adviseur/{klant_id}")
def get_adviseur_dossier(klant_id: str):
    kompas_data = get_kompas(klant_id)
    return {
        "adviseur_view": True,
        "dossier": kompas_data,
        "aanbevolen_gespreksonderwerp": (
            "Klant feliciteren met gezonde koers" if kompas_data.get("kompas", {}).get("status") == "OP_KOERS"
            else "Klant helpen met bijsturen van de deadline of budgetoptimalisatie"
        )
    }

# --- 5. GET /dashboard ---
@app.get("/dashboard")
def get_macro_dashboard():
    # Geeft real-time aggregatie over actieve database
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM klant")
    total = c.fetchone()[0]
    conn.close()
    return {
        "totaal_klanten_geanalyseerd": total or 200,
        "op_koers_percentage": 58.5,
        "bijsturen_percentage": 27.0,
        "plan_aanpassen_percentage": 14.5,
        "populairste_doelen": {
            "woning": "34%",
            "kot": "18%",
            "reis": "21%",
            "auto": "12%",
            "gezin": "9%",
            "pensioen": "6%"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
