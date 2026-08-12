# West Restaurant — Website beheer

Deze website is gebouwd met [Hugo](https://gohugo.io) en wordt automatisch gepubliceerd via Cloudflare Pages. Je hoeft niets te installeren om content aan te passen — alles kan via GitHub.

---

## Content aanpassen via GitHub

Ga naar [github.com/westrotterdam/website](https://github.com/westrotterdam/website), klik op het bestand dat je wilt aanpassen, dan op het potlood-icoontje (✏️ Edit), maak je wijziging, en klik op **"Commit changes"**. De website is binnen ~1 minuut bijgewerkt.

---

## Restaurant gegevens

**Bestand:** `data/restaurant.yaml`

Hier staan het adres, telefoonnummer, e-mail en Instagram. Pas deze aan als iets verandert.

```yaml
naam: "West"
telefoon: "010-0000000"
email: "info@westrotterdam.nl"
adres: "Burgemeester Meineszlaan 2-A"
postcode: "3022 BH"
stad: "Rotterdam"
instagram_handle: "bijwest"
instagram_url: "https://www.instagram.com/bijwest/"
osm_lat: "51.917330"
osm_lon: "4.453532"
```

---

## Menu aanpassen

**Bestand:** `data/menu.yaml`

Het menu is opgebouwd uit categorieën (Lunch, Diner, etc.) met daarin de gerechten.

### Gerecht toevoegen

Voeg een nieuw item toe onder de juiste categorie:

```yaml
- naam: "Naam van het gerecht"
  omschrijving: "Korte beschrijving van de ingrediënten"
  prijs: "12.50"
  vegetarisch: true   # true = vegetarisch, false = niet vegetarisch
```

### Gerecht verwijderen

Verwijder de vier regels (`naam`, `omschrijving`, `prijs`, `vegetarisch`) van het gerecht.

### Prijs aanpassen

Verander alleen de waarde achter `prijs:`, bijvoorbeeld:
```yaml
prijs: "11.00"
```

### Categorie toevoegen

Voeg een nieuwe categorie toe aan het einde van het bestand:

```yaml
  - naam: "Nieuwe categorie"
    items:
      - naam: "Eerste gerecht"
        omschrijving: "Omschrijving"
        prijs: "9.00"
        vegetarisch: false
```

---

## Openingstijden aanpassen

**Bestand:** `data/openingstijden.yaml`

Pas `van` en `tot` aan voor de juiste tijden. Zet `open: false` als het restaurant op die dag gesloten is.

```yaml
- dag: "Maandag"
  open: true
  van: "11:00"
  tot: "22:00"
```

Voor een gesloten dag:

```yaml
- dag: "Maandag"
  open: false
  van: ""
  tot: ""
```

---

## Foto's op de homepage vervangen

De drie sfeerfotos op de homepage staan in:

```
static/images/instagram/post1.jpg
static/images/instagram/post2.jpg
static/images/instagram/post3.jpg
```

Om een foto te vervangen:
1. Ga naar de map `static/images/instagram/` op GitHub
2. Klik op het bestand dat je wilt vervangen
3. Klik op het prullenbak-icoontje om te verwijderen, of gebruik "Add file" om een nieuw bestand te uploaden met dezelfde naam

---

## Vragen of hulp nodig?

Neem contact op met de ontwikkelaar.
