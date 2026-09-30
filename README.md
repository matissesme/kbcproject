# KBC Kompas

KBC Kompas is een demo voor de KBC-opdracht. Het idee is simpel: de bank raadt niet zomaar iets aan. De klant kiest zelf een doel, en de app zegt of dat doel haalbaar is met het geld dat er nu elke maand overblijft. Alle namen, rekeningen en bedragen in deze demo zijn verzonnen.

De app vergelijkt twee dingen. Eerst kijkt ze naar het gemiddelde inkomen en de gemiddelde uitgaven van de laatste drie maanden. Wat daar overblijft, is de ruimte om te sparen. Daarna kijkt ze hoeveel er nog nodig is voor het doel, en deelt dat door het aantal maanden tot de deadline. Ligt de spaarruimte minstens even hoog als wat er nodig is, dan staat de klant op koers. Zit het er net onder, dan moet het plan bijgestuurd worden. Zit het er duidelijk onder, dan is het plan te strak en moet het aangepast worden. Bij bijsturen of aanpassen krijgt de klant drie keuzes: de deadline opschuiven, het doelbedrag verlagen, of elke maand wat meer opzij zetten.

## Wat de klant ziet op de gsm

Open `index.html`. Je ziet een telefoon, zoals de KBC-app op een gsm.

Op Start staat een begroeting, de zichtrekening, een kaart van KBC Kompas en de laatste verrichtingen. De Kompas-kaart toont het doel, hoe ver de klant al is, en of het plan op koers ligt. Tik je op die kaart, dan kom je op het Kompasscherm: een meter, het gespaarde bedrag tegenover het doel, hoeveel maanden er nog zijn, hoeveel ruimte er per maand is en hoeveel er per maand nodig is.

Onderaan zitten vijf knoppen. Start is het beginscherm. Mijn KBC toont de zichtrekening, de spaarrekening en alle verrichtingen. De middelste knop opent Kompas. Producten toont wat bij het gekozen doel past, bijvoorbeeld een verzekering of een spaarvorm, en of dat al in de portefeuille zit. Niets wordt automatisch afgesloten. Meer geeft het profiel, de doelen, een “wat als”-oefening en de uitleg hoe de berekening werkt. Vanuit Meer ga je ook naar het dashboard voor medewerkers.

Bovenaan kan de klant Kate openen. Kate stelt korte vragen voor, zoals hoe het met het doel staat, wat er gebeurt als de kosten stijgen, en hoe het profiel berekend wordt.

In Mijn profiel wissel je tussen drie demoklanten: Lisa Peeters, Lukas en Emma Vermeulen, en Thomas Vandenberghe. Daar pas je ook het maandinkomen en de maanduitgaven aan. De meter herberekent meteen. Bedragen kun je verbergen, zoals in een echte bankapp.

Bij Mijn doelen kies je een bestaand doel of maak je een nieuw doel: wat je wilt bereiken, welk bedrag, en over hoeveel maanden. Op het Kompasscherm kun je daarna de bijstuurmogelijkheden bekijken en er een kiezen. “Waarom zie ik dit?” zet de cijfers naast elkaar: inkomen, uitgaven, spaarruimte en wat er per maand nodig is.

Met “Wat als?” probeer je een verandering uit zonder de gegevens echt te wijzigen. De drie voorbeelden zijn een stijging van huur en energie, een nieuwe job, en een onverwachte herstelling. Je ziet meteen of het doel dan nog haalbaar is.

Naast de telefoon staat een knop naar het medewerkerdashboard.

## Wat de medewerker ziet

Open `dashboard.html`. Dit scherm is niet voor de klant. Het is een overzicht voor een KBC-medewerker, met 200 fictieve dossiers.

Bovenaan zie je hoeveel klanten er zijn, en hoe die verdeeld zijn: op koers, bijsturen, of het plan aanpassen. Daarnaast zie je welk soort doel het vaakst voorkomt, zoals een woning, een kot, een reis, een auto, een gezin of pensioen.

Daaronder kun je zoeken op naam, klantnummer, stad, beroep of adviseur. Je kunt filteren op status, op soort doel en op stad. De lijst toont per persoon het doel, hoe ver het sparen staat, de spaarruimte tegenover wat er nodig is, de adviseur en de status. Tik op een rij, of op “Dossier bekijken”, om die ene persoon te openen.

Het dossier heeft vijf tabbladen. Overzicht toont wie de klant is, waar die woont, welk kantoor en welke adviseur erbij horen, de rekeningen, de Kompas-cijfers en een paar gesprekspunten voor de adviseur. 12 maanden toont per maand het inkomen, de uitgaven en wat er overbleef. Transacties is de lijst met betalingen, met datum, winkel of omschrijving en bedrag. Contact is de geschiedenis van afspraken, telefoons en chats. Producten toont wat de klant al heeft, en waar nog iets ontbreekt, bijvoorbeeld een verzekering die bij het doel past.

Vanuit een dossier kun je diezelfde persoon ook in de gsm-app openen, zodat je ziet wat de klant zelf zou zien.

## Hoe je het start

Je hoeft niets te installeren voor de demo. Dubbelklik op `index.html` voor de gsm, en op `dashboard.html` voor de medewerkers.

Wil je het via een adres in de browser openen, ga dan in een terminal naar deze map en typ:

```bash
py -3 -m http.server 8080
```

Ga daarna naar http://localhost:8080 voor de gsm, en naar http://localhost:8080/dashboard.html voor het dashboard. Als `py` niet werkt, probeer dan `python -m http.server 8080`.

Er zit ook een kleine Python-server in de map `backend`. Die heb je niet nodig om de demo te tonen. De pagina’s rekenen alles zelf in de browser.

## Wat nog niet af is

De gsm en het dashboard praten nog niet met die Python-server. De server kent alleen de drie demoklanten, terwijl het dashboard 200 personen in de browser toont. Er is geen login, en er is geen koppeling met echte klantgegevens van KBC.
