# West Restaurant Website — Design Document

**Datum:** 2026-08-07  
**Project:** West — Italiaans restaurant Rotterdam West  
**Status:** Goedgekeurd door opdrachtgever

---

## 1. Context & doelstelling

West is een Italiaans restaurant in Rotterdam West. De eigenaren richten zich op een lokaal publiek: advocaten die willen lunchen, bakfiets-ouders, en buurtbewoners die vaker willen terugkomen. De sfeer is toegankelijk en gezellig — geen sjiek restaurant, maar ook geen afhaalzaak. Italiaanse ingrediënten houden de marges laag en de kwaliteit hoog.

De website heeft drie doelen:
1. Bezoekers informeren over het menu, openingstijden en locatie
2. Reserveringen stimuleren via telefoon (later uitbreiden naar TEBI)
3. De Instagram-feed tonen om sfeer en actueel aanbod te communiceren

---

## 2. Stack & hosting

| Onderdeel | Keuze | Reden |
|---|---|---|
| Framework | Hugo (from scratch) | Volledige controle over visual identity, site te klein voor externe theme |
| CSS | Tailwind CSS via Hugo Pipes | Geen Node.js build stap nodig |
| JavaScript | Vanilla JS | Sectie-switching, menu tabs, Instagram embed — geen framework nodig |
| Hosting | Cloudflare Pages | Gratis, betrouwbaar, native GitHub integratie |
| CI/CD | Cloudflare bouwt automatisch | Geen GitHub Actions nodig — push naar `main` → live in ~1 minuut |
| Analytics | Cloudflare Web Analytics | Gratis, geen cookies, geen GDPR popup vereist |
| VCS | Jujutsu (jj) colocated met git | Één repo op GitHub |

**GDPR popup: niet nodig.** Er worden geen tracking cookies geplaatst.

---

## 3. Site-architectuur

### Één-pagina aanpak met hash-navigatie

De hele site is één HTML pagina met drie secties. Er zijn geen aparte routes of Hugo content-pagina's (behalve `_index.md` voor SEO metadata).

**Desktop:** JavaScript toont één sectie per keer (full-viewport, geen scroll). Klik op een nav-link → andere sectie wordt zichtbaar.

**Mobile:** Alle secties staan onder elkaar, normaal scrollen.

**Deep linking via URL hash:**
- `westrotterdam.nl/` → home sectie
- `westrotterdam.nl/#menu` → menu sectie
- `westrotterdam.nl/#contact` → contact sectie

JavaScript leest de hash bij paginalading en toont de juiste sectie. Nav-links updaten de hash automatisch.

### Secties

**Home (`/`)**
- Navigatie: beeldmerk (ovaal pand SVG) + woordmerk "West" links, nav-links rechts
- Hero: groot beeldmerk gecentreerd, woordmerk, ondertitel "Italiaans in Rotterdam West"
- Drie info-blokken: openingstijden / locatie / reserveren (telefoonnummer)
- Instagram feed strip onderaan (embed widget, 6–8 foto's)

**Menu (`/#menu`)**
- Zelfde navigatie
- Tabs per categorie — automatisch gegenereerd vanuit `data/menu.yaml`
- Per item: naam + omschrijving + prijs + optioneel vegetarisch-icoon (🌿)
- Geen subcategorieën in v1 — structuur ondersteunt dit later wel

**Contact (`/#contact`)**
- Adres, telefoonnummer, e-mailadres
- Openingstijden per dag (vanuit `data/openingstijden.yaml`)
- Google Maps iframe embed (geen API key nodig)
- Oranje reserveer-banner onderaan met telefoonnummer prominent

---

## 4. Content beheer

De eigenaar beheert drie YAML bestanden in `data/`. Geen HTML aanraken.

### `data/restaurant.yaml`
```yaml
naam: "West"
telefoon: "010-1234567"
email: "info@westrotterdam.nl"
adres: "Voorbeeldstraat 12"
postcode: "3014 AB"
stad: "Rotterdam"
instagram: "@west.rotterdam"
google_maps_embed_url: "https://maps.google.com/..."
```

### `data/menu.yaml`
```yaml
categorieen:
  - naam: "Lunch"
    items:
      - naam: "Spaghetti Carbonara"
        omschrijving: "Ei, guanciale, pecorino, zwarte peper"
        prijs: "9.50"
        vegetarisch: false
      - naam: "Penne all'Arrabbiata"
        omschrijving: "Tomaat, knoflook, peperoncino"
        prijs: "8.50"
        vegetarisch: true
  - naam: "Diner"
    items:
      - naam: "Bistecca"
        omschrijving: "Gegrild vlees, rucola, parmezaan"
        prijs: "16.50"
        vegetarisch: false
```

### `data/openingstijden.yaml`
```yaml
dagen:
  - dag: "Maandag"
    open: true
    van: "11:00"
    tot: "22:00"
  - dag: "Dinsdag"
    open: true
    van: "11:00"
    tot: "22:00"
  - dag: "Zondag"
    open: true
    van: "12:00"
    tot: "21:00"
```

---

## 5. Visual identity

| Element | Waarde |
|---|---|
| Primary orange | `#E9672F` |
| Light blue | `#D1E7FD` |
| Dark green | `#27422B` |
| Brown / dark rust | `#5D372B` |
| Cream (achtergrond) | `#FFECBA` |
| Cream light | `#FFF7E0` |
| Near black | `#110E0C` |
| Font titels | Inter Black |
| Font subkoppen | Georgia (Bold Italic) |
| Font body | Inter Regular / Bold |

**Logo in navigatie:** beeldmerk SVG (ovaal met pandtekening, donkerbruin op crème) naast woordmerk "West" in Inter Black.

**Sfeer:** warm bistro — crème achtergronden, oranje accenten, Georgia serif voor menukoppen en prijzen.

---

## 6. Integraties

| Integratie | Aanpak | Wanneer |
|---|---|---|
| Instagram feed | Embed widget (geen API key, geen kosten) | v1 |
| Google Maps | Iframe embed (geen API key) | v1 |
| Reserveringen | Telefonisch — prominent vermeld op contact | v1 |
| Cloudflare Analytics | Script tag in `<head>` — geen cookies | v1 |
| TEBI reserveringen | Widget embed of redirect | Later |

---

## 7. Bestandsstructuur

```
west/
├── flake.nix                          # dev omgeving (vereenvoudigd)
├── hugo.toml                          # site config
├── data/
│   ├── menu.yaml                      # ← eigenaar bewerkt
│   ├── openingstijden.yaml            # ← eigenaar bewerkt
│   └── restaurant.yaml               # ← eigenaar bewerkt
├── layouts/
│   ├── index.html                     # de hele site (één template)
│   └── partials/
│       ├── nav.html
│       ├── section-home.html
│       ├── section-menu.html
│       └── section-contact.html
├── assets/
│   ├── css/
│   │   └── main.css                   # Tailwind
│   └── js/
│       ├── nav.js                     # sectie-switching + hash navigatie
│       └── instagram.js               # embed
├── static/
│   └── images/                        # logo's en beeldmerken (al aanwezig)
└── content/
    └── _index.md                      # SEO metadata
```

---

## 8. flake.nix (vereenvoudigd)

Vergeleken met de originele opzet vervallen alle `use-local-content`, `use-remote-content`, `use-local-theme` en `use-remote-theme` scripts — die waren bedoeld voor de twee-repo aanpak die niet meer van toepassing is.

**Blijft over:**
- `hugo` — lokale preview en build
- `go` — vereist door Hugo modules
- `jujutsu` + `git` — versiebeheer
- `publish` script — `jj describe` + `jj bookmark set main` + `jj git push`

---

## 9. Uitbreidbaarheid

De structuur is bewust klein gehouden maar schaalt mee:

- **Subcategorieën in menu:** YAML structuur ondersteunt dit al, template uitbreiden wanneer nodig
- **Reserveringspagina:** nieuwe partial `section-reserveren.html` + tab in nav
- **TEBI integratie:** widget embed in reserveringssectie
- **Blog / weekmenu:** `content/blog/` toevoegen aan Hugo, aparte layout — geen impact op bestaande structuur

---

## 10. Wat de eigenaar moet weten

Na oplevering kan de eigenaar zelfstandig:
- Menu-items toevoegen, aanpassen of verwijderen via `data/menu.yaml` op GitHub
- Openingstijden aanpassen via `data/openingstijden.yaml`
- Contactgegevens bijwerken via `data/restaurant.yaml`

Workflow: bestand aanpassen in GitHub UI → groene "Commit changes" knop → site is live in ~1 minuut.
