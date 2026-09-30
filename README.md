# KBC Kompas

KBC Kompas is een demo voor de KBC-opdracht. De klant bepaalt zelf de richting: een kot, een eerste woning, een reis, een auto, een gezin of pensioen. De app zet dat doel af tegen het geld dat er maandelijks overblijft, en geeft aan of het plan op koers ligt, bijgestuurd moet worden, of te strak is. Alle namen, rekeningen en bedragen zijn verzonnen.

De berekening werkt in twee stappen. Eerst neemt ze het gemiddelde inkomen en de gemiddelde uitgaven van de laatste drie maanden. Het verschil is de spaarruimte. Daarna deelt ze wat er nog ontbreekt aan het doel door het aantal maanden tot de deadline. Is de spaarruimte minstens even groot als dat maandbedrag, dan staat de klant op koers. Zit ze er net onder, dan is bijsturen nodig. Zit ze er duidelijk onder, dan moet het plan aangepast worden. In die laatste twee gevallen zijn er drie keuzes: de deadline opschuiven, het doelbedrag verlagen, of elke maand meer opzij zetten.

Open `index.html` voor de klantapp en `dashboard.html` voor het medewerkersscherm. Er hoeft niets geïnstalleerd te worden.

## Wat de klant ziet op de gsm

De klantapp staat in een telefoonframe. Op Start staan een begroeting, de zichtrekening, een Kompas-kaart en de laatste verrichtingen. De kaart toont het doel, de voortgang en de status. Tik je erop, dan opent het Kompasscherm: een meter, gespaard bedrag tegenover het doel, resterende maanden, spaarruimte per maand en wat er per maand nodig is.

Onderaan zitten vijf knoppen. Start is het beginscherm. Mijn KBC toont zichtrekening, spaarrekening en alle verrichtingen. De middelste knop opent Kompas. Producten toont wat bij het doel past, zoals een verzekering of een spaarvorm, en of dat al in de portefeuille zit. Niets wordt automatisch afgesloten. Meer bundelt het profiel, de doelen, de “wat als”-oefening en de uitleg van de berekening, en linkt door naar het medewerkerdashboard. Naast de telefoon staat diezelfde doorgang.

Bovenaan opent de klant Kate. Kate stelt korte vragen voor: hoe het doel ervoor staat, wat een stijging van de kosten doet, en hoe het profiel berekend wordt.

In Mijn profiel wissel je tussen Lisa Peeters, Lukas en Emma Vermeulen, en Thomas Vandenberghe. Daar pas je maandinkomen en maanduitgaven aan. De meter herberekent meteen. Bedragen kun je verbergen.

Bij Mijn doelen kies je een bestaand doel of maak je een nieuw doel, met soort, bedrag en termijn. Op het Kompasscherm bekijk je daarna de bijstuurmogelijkheden en kies je er een. “Waarom zie ik dit?” zet inkomen, uitgaven, spaarruimte en het nodige maandbedrag naast elkaar.

“Wat als?” test een verandering zonder de gegevens echt te wijzigen: huur en energie die stijgen, een nieuwe job, of een onverwachte herstelling. Je ziet meteen of het doel dan nog haalbaar is.

## Wat de medewerker ziet

`dashboard.html` is het interne scherm, met 200 fictieve dossiers. Bovenaan staan het aantal klanten en de verdeling over op koers, bijsturen en plan aanpassen, plus welk soort doel het vaakst voorkomt: woning, kot, reis, auto, gezin of pensioen.

Je zoekt op naam, klantnummer, stad, beroep of adviseur, en filtert op status, soort doel en stad. Elke rij toont het doel, de spaarvoortgang, de spaarruimte tegenover wat er nodig is, de adviseur en de status. Tik op de rij, of op “Dossier bekijken”, om die persoon te openen.

Het dossier heeft vijf tabbladen. Overzicht toont identiteit, adres, kantoor, adviseur, rekeningen, Kompas-cijfers en gesprekspunten. 12 maanden toont per maand inkomen, uitgaven en wat er overbleef. Transacties lijst betalingen op met datum, omschrijving en bedrag. Contact toont afspraken, telefoons en chats. Producten toont wat de klant al heeft en waar nog iets ontbreekt, bijvoorbeeld een verzekering die bij het doel past. Vanuit het dossier open je diezelfde persoon ook in de gsm-app.
