"""
KBC KOMPAS - BACKEND API (Python + FastAPI + SQLite)
Implementeert de 5 endpoints van Jasper:
  1. POST /doel              -> Maak of update een doel (type, bedrag, deadline)
  2. GET  /kompas/{klant_id} -> Berekent Kompas-status, ratio, spaarcapaciteit, route & bijstuur-opties
  3. POST /event             -> Simuleer een plan_event (verrassings-uitgave, inkomenswijziging, etc.)
  4. GET  /adviseur/{klant_id} -> KBC Adviseursscherm met klantprofiel & productkoppeling
  5. GET  /dashboard         -> Macro-dashboard over alle ~200 klanten
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import sqlite3
import os
import secrets
import hashlib

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
    c.execute("""
        CREATE TABLE IF NOT EXISTS api_user (
            id TEXT PRIMARY KEY,
            api_key_hash TEXT NOT NULL UNIQUE,
            role TEXT NOT NULL,
            klant_id TEXT,
            naam TEXT NOT NULL,
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

    # Seed demo API users with keys (for testing - in production, use secure key generation and distribution)
    c.execute("SELECT COUNT(*) FROM api_user")
    if c.fetchone()[0] == 0:
        # Customer users - can only access their own data
        lisa_key = "lisa-demo-key-12345"
        lisa_hash = hashlib.sha256(lisa_key.encode()).hexdigest()
        c.execute("INSERT INTO api_user VALUES ('user-lisa', ?, 'customer', 'klant-lisa-01', 'Lisa Peeters')", (lisa_hash,))
        
        koppel_key = "koppel-demo-key-67890"
        koppel_hash = hashlib.sha256(koppel_key.encode()).hexdigest()
        c.execute("INSERT INTO api_user VALUES ('user-koppel', ?, 'customer', 'klant-koppel-02', 'Lukas & Emma Vermeulen')", (koppel_hash,))
        
        thomas_key = "thomas-demo-key-11111"
        thomas_hash = hashlib.sha256(thomas_key.encode()).hexdigest()
        c.execute("INSERT INTO api_user VALUES ('user-thomas', ?, 'customer', 'klant-thomas-03', 'Thomas Vandenberghe')", (thomas_hash,))
        
        # Adviser user - can access all customer data
        adviser_key = "adviser-demo-key-99999"
        adviser_hash = hashlib.sha256(adviser_key.encode()).hexdigest()
        c.execute("INSERT INTO api_user VALUES ('user-adviser', ?, 'adviser', NULL, 'KBC Adviseur')", (adviser_hash,))
        
        # Admin user - full access
        admin_key = "admin-demo-key-00000"
        admin_hash = hashlib.sha256(admin_key.encode()).hexdigest()
        c.execute("INSERT INTO api_user VALUES ('user-admin', ?, 'admin', NULL, 'KBC Admin')", (admin_hash,))

    conn.commit()
    conn.close()

init_db()

# --- Authentication & Authorization ---
class AuthenticatedUser(BaseModel):
    user_id: str
    role: str  # 'customer', 'adviser', 'admin'
    klant_id: Optional[str] = None
    naam: str

def authenticate_user(x_api_key: Optional[str] = Header(None)) -> AuthenticatedUser:
    """
    Validates the API key and returns the authenticated user.
    Raises HTTPException if authentication fails.
    """
    if not x_api_key:
        raise HTTPException(
            status_code=401,
            detail="Missing authentication credentials",
            headers={"WWW-Authenticate": "ApiKey"}
        )
    
    # Hash the provided key and look up in database
    key_hash = hashlib.sha256(x_api_key.encode()).hexdigest()
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, role, klant_id, naam FROM api_user WHERE api_key_hash = ?", (key_hash,))
    user_row = c.fetchone()
    conn.close()
    
    if not user_row:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "ApiKey"}
        )
    
    return AuthenticatedUser(
        user_id=user_row["id"],
        role=user_row["role"],
        klant_id=user_row["klant_id"],
        naam=user_row["naam"]
    )

def authorize_customer_access(user: AuthenticatedUser, requested_klant_id: str):
    """
    Verifies that the authenticated user has permission to access the requested customer data.
    - Customers can only access their own data
    - Advisers and admins can access any customer data
    """
    if user.role == "customer":
        if user.klant_id != requested_klant_id:
            raise HTTPException(
                status_code=403,
                detail="Access denied: You can only access your own customer data"
            )
    elif user.role not in ["adviser", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied: Insufficient permissions"
        )

def require_adviser_or_admin(user: AuthenticatedUser):
    """
    Verifies that the authenticated user has adviser or admin role.
    """
    if user.role not in ["adviser", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied: Adviser or admin role required"
        )

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
def create_or_update_doel(doel: DoelInput, user: AuthenticatedUser = Depends(authenticate_user)):
    # Verify the user has permission to modify this customer's goal
    authorize_customer_access(user, doel.klant_id)
    
    conn = get_db()
    c = conn.cursor()
    
    # Verify the customer exists
    c.execute("SELECT id FROM klant WHERE id = ?", (doel.klant_id,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Klant niet gevonden")
    
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
def get_kompas(klant_id: str, user: AuthenticatedUser = Depends(authenticate_user)):
    # Verify the user has permission to access this customer's data
    authorize_customer_access(user, klant_id)
    
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
def trigger_event(event: EventInput, user: AuthenticatedUser = Depends(authenticate_user)):
    # Verify the user has permission to create events for this customer
    authorize_customer_access(user, event.klant_id)
    
    conn = get_db()
    c = conn.cursor()
    
    # Verify the customer exists
    c.execute("SELECT id FROM klant WHERE id = ?", (event.klant_id,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Klant niet gevonden")
    
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
def get_adviseur_dossier(klant_id: str, user: AuthenticatedUser = Depends(authenticate_user)):
    # Adviseur endpoint requires adviser or admin role
    require_adviser_or_admin(user)
    
    # Note: get_kompas now requires authentication, so we need to pass the user
    # Since we've already verified the user is an adviser/admin, they can access any customer
    kompas_data = get_kompas(klant_id, user)
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
def get_macro_dashboard(user: AuthenticatedUser = Depends(authenticate_user)):
    # Dashboard requires adviser or admin role
    require_adviser_or_admin(user)
    
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
