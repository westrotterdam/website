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

Het menu heeft drie niveaus:

1. **Hoofdcategorie**: `Eten`, `Dranken`, `Wijn`
2. **Subcategorie**: bijvoorbeeld `LUNCH`, `PIZZA'S`, `WARME DRANKEN`
3. **Gerecht of drankje** (`items`)

Zo ziet een stukje eruit:

```yaml
hoofdcategorieen:
  - naam: "Eten"
    subcategorieen:
      - naam: "PIZZA'S"
        omschrijving: "17:00 - 21:30"        # optioneel, staat onder de titel
        items:
          - naam: "Margherita"
            omschrijving: "Tomatensaus, mozzarella, basilicum"   # optioneel
            prijs: "11,50"
            vegetarisch: true                # optioneel
```

Let op de **inspringing** (spaties, geen tabs): die bepaalt bij welk onderdeel een regel hoort.

### Gerecht of drankje toevoegen

Kopieer een bestaand gerecht uit dezelfde subcategorie, plak het eronder en pas het aan. Alleen `naam` en `prijs` zijn verplicht:

```yaml
          - naam: "Naam van het gerecht"
            omschrijving: "Korte beschrijving"   # weglaten als je het niet nodig hebt
            prijs: "12,50"
            vegetarisch: true                    # weglaten als het niet vegetarisch is
```

### Prijs aanpassen

Verander alleen de waarde achter `prijs:`. Gebruik een **komma** en zet **geen** euroteken neer, want dat wordt automatisch toegevoegd:

```yaml
            prijs: "11,00"
```

### Gerecht verwijderen

Verwijder alle regels van dat gerecht, van `- naam: ...` tot en met de laatste regel vóór het volgende `- naam:`.

### Vegetarisch of vegan markeren

Zet `vegetarisch: true` (🌿) of `vegan: true` (🌱) onder het gerecht. Is het geen van beide, laat die regel dan weg.

### Subcategorie toevoegen

Voeg onder `subcategorieen:` van de juiste hoofdcategorie een nieuw blok toe:

```yaml
      - naam: "NIEUWE CATEGORIE"
        omschrijving: "Optionele toelichting of tijden"
        items:
          - naam: "Eerste gerecht"
            prijs: "9,00"
```

### Controleren

Na het opslaan wordt de site opnieuw gebouwd. Staat er een fout in het bestand (bijvoorbeeld verkeerde inspringing), dan mislukt die build en blijft de oude versie online staan. Check na een wijziging of de site binnen een paar minuten is bijgewerkt.

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

## Hosting en overdracht

### Hoe komt een wijziging online?

```
Wijziging op GitHub (branch main)  →  Cloudflare Pages ziet de wijziging
→ Cloudflare bouwt de site met Hugo  →  live op https://westrotterdam.nl
```

- De code staat op GitHub: `westrotterdam/website`.
- Cloudflare Pages is gekoppeld aan die repository ("Connect to Git") en haalt de code zelf op.
- Er zijn geen GitHub Actions of andere CI-configuratie. Alle instellingen staan in het Cloudflare-dashboard.
- Een wijziging staat meestal binnen een paar minuten online.
- De site is bereikbaar op `westrotterdam.nl`, `www.westrotterdam.nl` en `westrotterdam.pages.dev` (het Pages-project heet `westrotterdam`).

### Build-instellingen in Cloudflare Pages

| Instelling | Waarde |
|---|---|
| Framework preset | Hugo |
| Build command | `hugo --minify` |
| Build output directory | `public` |
| Environment variable | `HUGO_VERSION` = `0.159.0` |

Controleer deze waarden in het Cloudflare-dashboard onder het Pages-project, tab *Settings*.

### Nog te doen

- Telefoonnummer in `data/restaurant.yaml` is nog een placeholder (`010-0000000`).

### Lokaal werken (alleen voor ontwikkelaars)

Met [Nix](https://nixos.org) levert `nix develop` Hugo en Tailwind. Daarna:

- `hugo server` voor een lokale preview op http://localhost:1313
- `hugo --minify` voor een productiebuild

Meer achtergrond staat in `docs/superpowers/specs/` (ontwerp) en `docs/superpowers/plans/` (implementatie).

---

## Vragen of hulp nodig?

Neem contact op met de ontwikkelaar.
