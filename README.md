# KBC Kompas

Klant kiest de bestemming. KBC toont de route en stuurt bij.

## Data (klaar)

Synthetische testdata, geen echte klanten.

- Datamodel: `data/schema.sql`
- Doelcatalogus: `data/catalog/goals.json`
- SQLite: `data/kompas.db`
- CSV + persona's: `mathis data fake/`

Persona's voor de demo: `lisa`, `koppel`, `gezinsvader`.

Opnieuw genereren:

```
py -3 generate_fake_customers.py
```

## Volgende stappen

1. Kompas-engine (spaarcapaciteit / nodig per maand / ratio)
2. FastAPI (`/doel`, `/kompas/{klant}`, `/event`, `/adviseur/{klant}`, `/dashboard`)
3. Schermen + knop "simuleer event"
