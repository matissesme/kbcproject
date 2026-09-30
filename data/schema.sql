-- KBC Kompas datamodel (synthetisch)

CREATE TABLE IF NOT EXISTS klant (
    id TEXT PRIMARY KEY,
    voornaam TEXT NOT NULL,
    achternaam TEXT NOT NULL,
    leeftijd INTEGER NOT NULL,
    situatie TEXT NOT NULL,
    inkomen REAL NOT NULL,
    gespaard REAL NOT NULL DEFAULT 0,
    stad TEXT,
    taal TEXT NOT NULL DEFAULT 'nl',
    persona TEXT,
    huishouden_id TEXT
);

CREATE TABLE IF NOT EXISTS transactie (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    klant_id TEXT NOT NULL REFERENCES klant(id),
    datum TEXT NOT NULL,
    bedrag REAL NOT NULL,
    categorie TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS doel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    klant_id TEXT NOT NULL REFERENCES klant(id),
    type TEXT NOT NULL,
    bedrag REAL NOT NULL,
    deadline TEXT NOT NULL,
    gespaard REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'actief'
);

CREATE TABLE IF NOT EXISTS plan_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    klant_id TEXT NOT NULL REFERENCES klant(id),
    datum TEXT NOT NULL,
    type TEXT NOT NULL,
    bedrag REAL,
    toelichting TEXT
);

CREATE INDEX IF NOT EXISTS idx_tx_klant_datum ON transactie(klant_id, datum);
CREATE INDEX IF NOT EXISTS idx_doel_klant ON doel(klant_id);
CREATE INDEX IF NOT EXISTS idx_event_klant ON plan_event(klant_id);
