# West Restaurant Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bouw de volledige West restaurant website — één HTML pagina met drie secties (home, menu, contact), desktop sectie-switching via JS, mobile scroll, data-driven content via YAML.

**Architecture:** Één Hugo `layouts/index.html` template rendert alle drie secties. JavaScript (`assets/js/nav.js`) beheert sectie-switching op desktop en hash-navigatie. Content staat in drie YAML bestanden in `data/` die de eigenaar zelfstandig bewerkt.

**Tech Stack:** Hugo (static site generator), Tailwind CSS via Hugo Pipes, Vanilla JS, Cloudflare Pages (hosting + CI/CD), Jujutsu (VCS)

---

## Bestandsoverzicht

| Pad | Actie | Verantwoordelijkheid |
|---|---|---|
| `hugo.toml` | Aanmaken | Site config — baseURL, taal, Hugo Pipes setup |
| `flake.nix` | Aanpassen | Verwijder use-local-*/use-remote-* scripts |
| `data/restaurant.yaml` | Aanmaken | Naam, adres, telefoon, email, Instagram, Maps URL |
| `data/menu.yaml` | Aanmaken | Categorieën + items (naam, omschrijving, prijs, vegetarisch) |
| `data/openingstijden.yaml` | Aanmaken | Per dag: open/gesloten + tijden |
| `assets/css/main.css` | Aanmaken | Tailwind imports + CSS variabelen uit visual identity |
| `assets/js/nav.js` | Aanmaken | Sectie-switching desktop, hash navigatie, mobile scroll |
| `assets/js/instagram.js` | Aanmaken | Instagram embed initialisatie |
| `layouts/index.html` | Aanmaken | Root template — assembleert alle partials |
| `layouts/partials/nav.html` | Aanmaken | Navigatiebalk met beeldmerk + woordmerk + links |
| `layouts/partials/section-home.html` | Aanmaken | Hero, info-blokken, Instagram strip |
| `layouts/partials/section-menu.html` | Aanmaken | Tabs + menu-items vanuit data/menu.yaml |
| `layouts/partials/section-contact.html` | Aanmaken | Adres, openingstijden, Maps embed, reserveer-banner |
| `layouts/partials/head.html` | Aanmaken | Meta tags, fonts, Tailwind, Cloudflare Analytics |
| `content/_index.md` | Aanmaken | SEO metadata (title, description) |
| `.gitignore` | Aanmaken | public/, resources/, .hugo_build.lock, .superpowers/ |

---

## Task 1: Repo opschonen en Hugo initialiseren

**Files:**
- Aanpassen: `flake.nix`
- Aanmaken: `hugo.toml`
- Aanmaken: `.gitignore`
- Aanmaken: `content/_index.md`

- [ ] **Stap 1: Vereenvoudig flake.nix**

Vervang de inhoud van `flake.nix` met:

```nix
{
  description = "West Restaurant website — Hugo static site deployed via Cloudflare Pages";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/832efc09b4caf6b4569fbf9dc01bec3082a00611";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};

          publish = pkgs.writeShellScriptBin "publish" ''
            set -e
            jj describe -m "''${1:-chore: update site}"
            jj bookmark set main -r @
            jj git push --bookmark main
            echo "Done! Cloudflare will build and deploy to https://westrotterdam.nl in a few minutes."
          '';
        in
        {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              hugo
              go
              jujutsu
              git
              publish
            ];

            shellHook = ''
              echo ""
              echo "  West Restaurant — dev environment"
              echo ""
              echo "  Commands:"
              echo "    hugo server       — lokale preview op http://localhost:1313"
              echo "    hugo --minify     — productie build (output in public/)"
              echo "    publish [message] — commit + push (Cloudflare deployt automatisch)"
              echo "    jj log            — geschiedenis"
              echo "    jj st             — status"
              echo ""
            '';
          };
        });
    };
}
```

- [ ] **Stap 2: Maak hugo.toml aan**

```toml
baseURL = "https://westrotterdam.nl"
languageCode = "nl"
title = "West — Italiaans Restaurant Rotterdam"
defaultContentLanguage = "nl"

[build]
  writeStats = true

[params]
  description = "Italiaans restaurant in Rotterdam West. Eerlijk eten, eerlijke prijzen."
```

- [ ] **Stap 3: Maak .gitignore aan**

```
public/
resources/
.hugo_build.lock
node_modules/
.superpowers/
.DS_Store
```

- [ ] **Stap 4: Maak content/_index.md aan**

```markdown
---
title: "West — Italiaans Restaurant Rotterdam"
description: "Italiaans restaurant in Rotterdam West. Vers eten, eerlijke prijzen, de hele dag open."
---
```

- [ ] **Stap 5: Test dat Hugo de site kan bouwen**

```bash
hugo server
```

Verwacht: server draait op http://localhost:1313, geen errors (lege pagina is OK)

- [ ] **Stap 6: Commit**

```bash
jj describe -m "chore: initialiseer Hugo site structuur"
```

---

## Task 2: Data bestanden aanmaken

**Files:**
- Aanmaken: `data/restaurant.yaml`
- Aanmaken: `data/menu.yaml`
- Aanmaken: `data/openingstijden.yaml`

- [ ] **Stap 1: Maak data/restaurant.yaml aan**

```yaml
naam: "West"
telefoon: "010-0000000"
email: "info@westrotterdam.nl"
adres: "Straatnaam 00"
postcode: "3000 AB"
stad: "Rotterdam"
instagram_handle: "west.rotterdam"
instagram_url: "https://www.instagram.com/west.rotterdam/"
# Plak hier de embed URL van Google Maps (via maps.google.com → Delen → Insluiten)
google_maps_embed_url: ""
```

- [ ] **Stap 2: Maak data/menu.yaml aan**

```yaml
categorieen:
  - naam: "Lunch"
    items:
      - naam: "Spaghetti Carbonara"
        omschrijving: "Ei, guanciale, pecorino romano, zwarte peper"
        prijs: "9.50"
        vegetarisch: false
      - naam: "Penne all'Arrabbiata"
        omschrijving: "San Marzano tomaat, knoflook, peperoncino"
        prijs: "8.50"
        vegetarisch: true
      - naam: "Risotto Funghi"
        omschrijving: "Gemengde paddenstoelen, parmezaan, tijm"
        prijs: "10.50"
        vegetarisch: true
      - naam: "Pizza Margherita"
        omschrijving: "San Marzano, fior di latte, basilicum"
        prijs: "8.00"
        vegetarisch: true
      - naam: "Bruschetta al Pomodoro"
        omschrijving: "Geroosterd brood, tomaat, knoflook, basilicum"
        prijs: "5.50"
        vegetarisch: true

  - naam: "Diner"
    items:
      - naam: "Bistecca alla Fiorentina"
        omschrijving: "Gegrild vlees, rucola, parmezaan, citroen"
        prijs: "16.50"
        vegetarisch: false
      - naam: "Salmone al Forno"
        omschrijving: "Ovengebakken zalm, kappertjes, citroenboter"
        prijs: "14.50"
        vegetarisch: false
      - naam: "Melanzane alla Parmigiana"
        omschrijving: "Aubergine, tomaat, mozzarella, parmezaan"
        prijs: "11.00"
        vegetarisch: true
      - naam: "Tagliatelle al Ragù"
        omschrijving: "Langzaam gegaarde vleessaus, parmezaan"
        prijs: "12.50"
        vegetarisch: false

  - naam: "Dolci"
    items:
      - naam: "Tiramisù"
        omschrijving: "Huisgemaakt, mascarpone, espresso, amaretto"
        prijs: "5.50"
        vegetarisch: true
      - naam: "Panna Cotta"
        omschrijving: "Vanille, verse bessensaus"
        prijs: "5.00"
        vegetarisch: true
      - naam: "Affogato"
        omschrijving: "Vanille-ijs, dubbele espresso"
        prijs: "4.50"
        vegetarisch: true

  - naam: "Dranken"
    items:
      - naam: "Espresso"
        omschrijving: ""
        prijs: "2.50"
        vegetarisch: true
      - naam: "Cappuccino"
        omschrijving: ""
        prijs: "3.00"
        vegetarisch: true
      - naam: "Huiswijn (glas)"
        omschrijving: "Rood of wit"
        prijs: "4.50"
        vegetarisch: true
      - naam: "San Pellegrino"
        omschrijving: "250ml"
        prijs: "2.50"
        vegetarisch: true
```

- [ ] **Stap 3: Maak data/openingstijden.yaml aan**

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
  - dag: "Woensdag"
    open: true
    van: "11:00"
    tot: "22:00"
  - dag: "Donderdag"
    open: true
    van: "11:00"
    tot: "22:00"
  - dag: "Vrijdag"
    open: true
    van: "11:00"
    tot: "23:00"
  - dag: "Zaterdag"
    open: true
    van: "12:00"
    tot: "23:00"
  - dag: "Zondag"
    open: true
    van: "12:00"
    tot: "21:00"
```

- [ ] **Stap 4: Commit**

```bash
jj describe -m "chore: voeg data bestanden toe (menu, openingstijden, restaurant)"
```

---

## Task 3: CSS setup — Tailwind + visual identity

**Files:**
- Aanmaken: `assets/css/main.css`

- [ ] **Stap 1: Maak assets/css/main.css aan**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary-orange: #E9672F;
  --color-light-blue: #D1E7FD;
  --color-dark-green: #27422B;
  --color-brown: #5D372B;
  --color-bg-cream-primary: #FFECBA;
  --color-bg-cream-secondary: #FFF7E0;
  --color-text-dark: #110E0C;

  --font-title: 'Inter', sans-serif;
  --font-heading: 'Georgia', serif;
  --font-body: 'Inter', sans-serif;
}

/* Sectie-switching: desktop toont één sectie per keer */
@media (min-width: 768px) {
  .site-section {
    display: none;
    min-height: 100vh;
  }

  .site-section.active {
    display: flex;
    flex-direction: column;
  }
}

/* Mobile: alle secties zichtbaar, normaal scrollen */
@media (max-width: 767px) {
  .site-section {
    display: block;
  }
}

/* Menu tabs */
.menu-tab-content {
  display: none;
}

.menu-tab-content.active {
  display: block;
}

/* Vegetarisch icoon kleur */
.vegetarisch-badge {
  color: var(--color-dark-green);
}
```

- [ ] **Stap 2: Maak tailwind.config.js aan in de repo root**

```js
module.exports = {
  content: ["./layouts/**/*.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#E9672F',
          blue: '#D1E7FD',
          green: '#27422B',
          brown: '#5D372B',
          cream: '#FFECBA',
          'cream-light': '#FFF7E0',
          dark: '#110E0C',
        },
      },
      fontFamily: {
        title: ['"Inter"', 'sans-serif'],
        heading: ['Georgia', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Stap 3: Commit**

```bash
jj describe -m "feat: voeg Tailwind CSS setup toe met visual identity variabelen"
```

---

## Task 4: JavaScript — navigatie en menu tabs

**Files:**
- Aanmaken: `assets/js/nav.js`
- Aanmaken: `assets/js/instagram.js`

- [ ] **Stap 1: Maak assets/js/nav.js aan**

```javascript
(function () {
  'use strict';

  const SECTIONS = ['home', 'menu', 'contact'];
  const MOBILE_BREAKPOINT = 768;

  function isMobile() {
    return window.innerWidth < MOBILE_BREAKPOINT;
  }

  // Toon een sectie op desktop, scroll naar sectie op mobile
  function navigateTo(sectionId) {
    if (!SECTIONS.includes(sectionId)) sectionId = 'home';

    if (isMobile()) {
      const el = document.getElementById('section-' + sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      SECTIONS.forEach(function (id) {
        const el = document.getElementById('section-' + id);
        if (el) el.classList.toggle('active', id === sectionId);
      });
    }

    // Update actieve nav link
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      link.classList.toggle('nav-active', link.dataset.nav === sectionId);
    });

    // Update URL hash zonder scroll
    history.replaceState(null, '', sectionId === 'home' ? '/' : '#' + sectionId);
  }

  // Menu tab switching
  function initMenuTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.dataset.tab;

        tabs.forEach(function (t) {
          t.classList.toggle('tab-active', t.dataset.tab === target);
        });

        document.querySelectorAll('.menu-tab-content').forEach(function (content) {
          content.classList.toggle('active', content.dataset.tabContent === target);
        });
      });
    });

    // Activeer eerste tab standaard
    if (tabs.length > 0) tabs[0].click();
  }

  // Initialiseer bij laden
  document.addEventListener('DOMContentLoaded', function () {
    // Lees hash uit URL
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);

    // Nav link clicks
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        navigateTo(link.dataset.nav);
      });
    });

    initMenuTabs();
  });

  // Herbereken bij resize (mobile ↔ desktop overgang)
  window.addEventListener('resize', function () {
    if (!isMobile()) {
      const hash = window.location.hash.replace('#', '') || 'home';
      navigateTo(hash);
    }
  });
})();
```

- [ ] **Stap 2: Maak assets/js/instagram.js aan**

```javascript
// Instagram embed — laadt de officiële Instagram embed script
// zodat alle <blockquote class="instagram-media"> elementen worden omgezet
(function () {
  'use strict';

  function loadInstagramEmbed() {
    if (document.querySelector('.instagram-media') === null) return;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInstagramEmbed);
  } else {
    loadInstagramEmbed();
  }
})();
```

- [ ] **Stap 3: Commit**

```bash
jj describe -m "feat: voeg nav.js en instagram.js toe"
```

---

## Task 5: Hugo partials — head en nav

**Files:**
- Aanmaken: `layouts/partials/head.html`
- Aanmaken: `layouts/partials/nav.html`

- [ ] **Stap 1: Maak layouts/partials/head.html aan**

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} — {{ .Site.Title }}{{ end }}</title>
<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}" />

<!-- Canonical -->
<link rel="canonical" href="{{ .Permalink }}" />

<!-- Open Graph -->
<meta property="og:title" content="{{ .Title }}" />
<meta property="og:description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}" />
<meta property="og:url" content="{{ .Permalink }}" />
<meta property="og:type" content="website" />

<!-- Google Fonts: Inter -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />

<!-- Tailwind CSS via Hugo Pipes -->
{{ $css := resources.Get "css/main.css" | css.TailwindCSS | minify | fingerprint }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}" />

<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "VERVANG_MET_JOUW_TOKEN"}'></script>
```

- [ ] **Stap 2: Maak layouts/partials/nav.html aan**

```html
{{ $r := .Site.Data.restaurant }}
<nav class="flex items-center justify-between px-6 py-3 border-b-2"
     style="background: var(--color-bg-cream-primary); border-color: var(--color-primary-orange);">

  <!-- Logo: beeldmerk + woordmerk -->
  <a href="/" data-nav="home" class="flex items-center gap-3 no-underline">
    <img
      src="/images/West - Beeldmerk/Beeldmerk - SVG/West -Beeldmerk - Donkerbruin.svg"
      alt="West beeldmerk"
      class="w-9 h-9"
    />
    <span class="font-black text-xl tracking-tight"
          style="font-family: var(--font-title); color: var(--color-text-dark);">
      {{ $r.naam }}
    </span>
  </a>

  <!-- Desktop navigatie -->
  <div class="hidden md:flex gap-8">
    <a href="/" data-nav="home"
       class="text-sm font-bold transition-colors nav-link"
       style="color: var(--color-brown);">
      Home
    </a>
    <a href="#menu" data-nav="menu"
       class="text-sm font-bold transition-colors nav-link"
       style="color: var(--color-brown);">
      Menu
    </a>
    <a href="#contact" data-nav="contact"
       class="text-sm font-bold transition-colors nav-link"
       style="color: var(--color-brown);">
      Contact
    </a>
  </div>

  <!-- Mobile: hamburger (simpele versie — links inline) -->
  <div class="flex md:hidden gap-5">
    <a href="#menu" data-nav="menu"
       class="text-xs font-bold"
       style="color: var(--color-brown);">Menu</a>
    <a href="#contact" data-nav="contact"
       class="text-xs font-bold"
       style="color: var(--color-brown);">Contact</a>
  </div>
</nav>

<style>
  .nav-active {
    color: var(--color-primary-orange) !important;
    border-bottom: 2px solid var(--color-primary-orange);
  }
</style>
```

- [ ] **Stap 3: Commit**

```bash
jj describe -m "feat: voeg head en nav partials toe"
```

---

## Task 6: Hugo partial — home sectie

**Files:**
- Aanmaken: `layouts/partials/section-home.html`

- [ ] **Stap 1: Maak layouts/partials/section-home.html aan**

```html
{{ $r := .Site.Data.restaurant }}
<section id="section-home" class="site-section active flex-col"
         style="background: var(--color-bg-cream-primary);">

  <!-- Hero -->
  <div class="flex-1 flex flex-col items-center justify-center text-center px-6 py-12"
       style="background: linear-gradient(160deg, var(--color-dark-green) 0%, var(--color-text-dark) 100%);">

    <!-- Beeldmerk -->
    <img
      src="/images/West - Beeldmerk/Beeldmerk - SVG/West -Beeldmerk - Creme.svg"
      alt="West restaurant"
      class="w-24 h-24 mb-6 opacity-90"
    />

    <!-- Woordmerk -->
    <h1 class="text-6xl md:text-8xl font-black mb-3 leading-none"
        style="font-family: var(--font-title); color: var(--color-bg-cream-primary);">
      {{ $r.naam }}
    </h1>

    <p class="text-lg mb-8 italic"
       style="font-family: var(--font-heading); color: rgba(255,236,186,0.75);">
      Italiaans in Rotterdam West
    </p>

    <a href="#menu" data-nav="menu"
       class="inline-block px-8 py-3 text-sm font-bold rounded transition-opacity hover:opacity-90"
       style="background: var(--color-primary-orange); color: white;">
      Bekijk het menu →
    </a>
  </div>

  <!-- Info blokken -->
  <div class="flex border-t-4 divide-x"
       style="border-color: var(--color-primary-orange); divide-color: rgba(0,0,0,0.08);">

    <div class="flex-1 flex flex-col items-center py-4 px-4 text-center">
      <span class="text-2xl mb-1">🕐</span>
      <span class="text-xs font-bold uppercase tracking-wide mb-1"
            style="color: var(--color-brown);">Open</span>
      <span class="text-sm" style="color: var(--color-text-dark);">Hele dag &amp; avond</span>
    </div>

    <div class="flex-1 flex flex-col items-center py-4 px-4 text-center">
      <span class="text-2xl mb-1">📍</span>
      <span class="text-xs font-bold uppercase tracking-wide mb-1"
            style="color: var(--color-brown);">Locatie</span>
      <span class="text-sm" style="color: var(--color-text-dark);">
        {{ $r.adres }}, {{ $r.stad }}
      </span>
    </div>

    <div class="flex-1 flex flex-col items-center py-4 px-4 text-center">
      <span class="text-2xl mb-1">📞</span>
      <span class="text-xs font-bold uppercase tracking-wide mb-1"
            style="color: var(--color-brown);">Reserveer</span>
      <a href="tel:{{ $r.telefoon }}" class="text-sm font-bold"
         style="color: var(--color-primary-orange);">
        {{ $r.telefoon }}
      </a>
    </div>

  </div>

  <!-- Instagram strip -->
  <div class="py-4 px-6" style="background: var(--color-dark-green);">
    <p class="text-xs font-bold uppercase tracking-widest mb-3"
       style="color: rgba(255,236,186,0.5);">
      📸 <a href="{{ $r.instagram_url }}" target="_blank" rel="noopener"
             style="color: rgba(255,236,186,0.5);">@{{ $r.instagram_handle }}</a>
    </p>
    <!-- Instagram embed: plak hier maximaal 4 recente post blockquotes vanuit Instagram -->
    <!-- Ga naar een Instagram post → "..." → "Insluiten" → kopieer de blockquote tag -->
    <div class="grid grid-cols-4 gap-2">
      <div class="aspect-square rounded"
           style="background: rgba(255,255,255,0.08);">
        <!-- Voorbeeld embed positie 1 -->
      </div>
      <div class="aspect-square rounded"
           style="background: rgba(255,255,255,0.08);">
        <!-- Voorbeeld embed positie 2 -->
      </div>
      <div class="aspect-square rounded"
           style="background: rgba(255,255,255,0.08);">
        <!-- Voorbeeld embed positie 3 -->
      </div>
      <div class="aspect-square rounded"
           style="background: rgba(255,255,255,0.08);">
        <!-- Voorbeeld embed positie 4 -->
      </div>
    </div>
  </div>

</section>
```

- [ ] **Stap 2: Test lokaal**

```bash
hugo server
```

Verwacht: homepage toont hero met donkergroene achtergrond, crème beeldmerk, "West" als grote titel, drie info-blokken, Instagram strip.

- [ ] **Stap 3: Commit**

```bash
jj describe -m "feat: voeg home sectie toe"
```

---

## Task 7: Hugo partial — menu sectie

**Files:**
- Aanmaken: `layouts/partials/section-menu.html`

- [ ] **Stap 1: Maak layouts/partials/section-menu.html aan**

```html
<section id="section-menu" class="site-section flex-col"
         style="background: var(--color-bg-cream-secondary);">

  <!-- Tabs -->
  <div class="flex border-b-2 px-6 overflow-x-auto"
       style="background: var(--color-bg-cream-primary); border-color: rgba(0,0,0,0.08);">
    {{ range .Site.Data.menu.categorieen }}
    <button
      data-tab="{{ .naam | urlize }}"
      class="px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 border-transparent -mb-0.5 transition-colors"
      style="color: var(--color-brown);">
      {{ .naam }}
    </button>
    {{ end }}
  </div>

  <!-- Tab inhoud -->
  <div class="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
    {{ range .Site.Data.menu.categorieen }}
    <div class="menu-tab-content" data-tab-content="{{ .naam | urlize }}">

      {{ range .items }}
      <div class="flex justify-between items-baseline py-3 border-b"
           style="border-color: rgba(0,0,0,0.08);">
        <div class="flex-1 pr-4">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold" style="color: var(--color-text-dark);">
              {{ .naam }}
            </span>
            {{ if .vegetarisch }}
            <span class="vegetarisch-badge text-xs" title="Vegetarisch">🌿</span>
            {{ end }}
          </div>
          {{ if .omschrijving }}
          <span class="text-xs italic" style="font-family: var(--font-heading); color: rgba(17,14,12,0.55);">
            {{ .omschrijving }}
          </span>
          {{ end }}
        </div>
        <span class="text-sm font-bold whitespace-nowrap"
              style="font-family: var(--font-heading); color: var(--color-primary-orange);">
          € {{ .prijs }}
        </span>
      </div>
      {{ end }}

    </div>
    {{ end }}
  </div>

</section>
```

- [ ] **Stap 2: Test lokaal**

```bash
hugo server
```

Navigeer naar `/#menu`. Verwacht: tabs gegenereerd vanuit menu.yaml, klik op tab toont items van die categorie, vegetarisch items tonen 🌿 icoon.

- [ ] **Stap 3: Commit**

```bash
jj describe -m "feat: voeg menu sectie toe met data-driven tabs"
```

---

## Task 8: Hugo partial — contact sectie

**Files:**
- Aanmaken: `layouts/partials/section-contact.html`

- [ ] **Stap 1: Maak layouts/partials/section-contact.html aan**

```html
{{ $r := .Site.Data.restaurant }}
<section id="section-contact" class="site-section flex-col"
         style="background: var(--color-bg-cream-primary);">

  <div class="flex-1 grid md:grid-cols-2">

    <!-- Links: adres + openingstijden -->
    <div class="px-8 py-8 border-r" style="border-color: rgba(0,0,0,0.08);">

      <!-- Contactgegevens -->
      <h2 class="text-lg font-bold italic mb-4 pb-2 border-b"
          style="font-family: var(--font-heading); color: var(--color-brown); border-color: rgba(93,55,43,0.2);">
        Vind ons
      </h2>

      <div class="space-y-3 mb-8 text-sm" style="color: var(--color-text-dark);">
        <div class="flex gap-3">
          <span style="color: var(--color-primary-orange);">📍</span>
          <span>{{ $r.adres }}<br/>{{ $r.postcode }} {{ $r.stad }}</span>
        </div>
        <div class="flex gap-3">
          <span style="color: var(--color-primary-orange);">📞</span>
          <a href="tel:{{ $r.telefoon }}" class="font-bold"
             style="color: var(--color-text-dark);">{{ $r.telefoon }}</a>
        </div>
        <div class="flex gap-3">
          <span style="color: var(--color-primary-orange);">✉️</span>
          <a href="mailto:{{ $r.email }}"
             style="color: var(--color-text-dark);">{{ $r.email }}</a>
        </div>
      </div>

      <!-- Openingstijden -->
      <h2 class="text-lg font-bold italic mb-4 pb-2 border-b"
          style="font-family: var(--font-heading); color: var(--color-brown); border-color: rgba(93,55,43,0.2);">
        Openingstijden
      </h2>

      <div class="space-y-1">
        {{ range .Site.Data.openingstijden.dagen }}
        <div class="flex justify-between text-sm py-1 border-b"
             style="border-color: rgba(0,0,0,0.06);">
          <span class="font-bold" style="color: var(--color-brown);">{{ .dag }}</span>
          {{ if .open }}
          <span style="color: var(--color-text-dark);">{{ .van }} – {{ .tot }}</span>
          {{ else }}
          <span style="color: rgba(17,14,12,0.4);">Gesloten</span>
          {{ end }}
        </div>
        {{ end }}
      </div>

    </div>

    <!-- Rechts: Google Maps -->
    <div class="flex flex-col">
      {{ if $r.google_maps_embed_url }}
      <iframe
        src="{{ $r.google_maps_embed_url }}"
        class="flex-1 w-full min-h-48"
        style="border: 0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="West Restaurant op de kaart">
      </iframe>
      {{ else }}
      <div class="flex-1 flex items-center justify-center min-h-48"
           style="background: rgba(39,66,43,0.06);">
        <span class="text-sm" style="color: rgba(17,14,12,0.4);">Kaart volgt</span>
      </div>
      {{ end }}
    </div>

  </div>

  <!-- Reserveer banner -->
  <div class="py-5 px-8 text-center"
       style="background: var(--color-primary-orange);">
    <p class="text-sm italic mb-1"
       style="font-family: var(--font-heading); color: rgba(255,255,255,0.85);">
      Reserveren? Bel ons direct —
    </p>
    <a href="tel:{{ $r.telefoon }}"
       class="text-2xl font-black"
       style="font-family: var(--font-title); color: white;">
      {{ $r.telefoon }}
    </a>
  </div>

</section>
```

- [ ] **Stap 2: Test lokaal**

```bash
hugo server
```

Navigeer naar `/#contact`. Verwacht: adres en openingstijden links, kaart-placeholder rechts (totdat google_maps_embed_url is ingevuld), oranje reserveer-banner onderaan.

- [ ] **Stap 3: Commit**

```bash
jj describe -m "feat: voeg contact sectie toe met openingstijden en reserveer-banner"
```

---

## Task 9: Root template — assembleer alles

**Files:**
- Aanmaken: `layouts/index.html`

- [ ] **Stap 1: Maak layouts/index.html aan**

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  {{ partial "head.html" . }}
</head>
<body style="margin: 0; background: var(--color-bg-cream-primary); color: var(--color-text-dark);">

  {{ partial "nav.html" . }}

  <main>
    {{ partial "section-home.html" . }}
    {{ partial "section-menu.html" . }}
    {{ partial "section-contact.html" . }}
  </main>

  <!-- JavaScript -->
  {{ $nav := resources.Get "js/nav.js" | minify | fingerprint }}
  <script src="{{ $nav.RelPermalink }}" integrity="{{ $nav.Data.Integrity }}" defer></script>

  {{ $instagram := resources.Get "js/instagram.js" | minify | fingerprint }}
  <script src="{{ $instagram.RelPermalink }}" integrity="{{ $instagram.Data.Integrity }}" defer></script>

</body>
</html>
```

- [ ] **Stap 2: Test de volledige site lokaal**

```bash
hugo server
```

Verwacht:
- Homepage toont hero + info-blokken + Instagram strip
- Klik op "Menu" in nav → menu sectie verschijnt, home verdwijnt (desktop)
- Klik op "Contact" → contact sectie met openingstijden
- URL hash updatet bij elke nav-klik
- Op mobile (verklein browser < 768px): alle secties onder elkaar zichtbaar

- [ ] **Stap 3: Test productie build**

```bash
hugo --minify
```

Verwacht: `public/` map aangemaakt, geen errors, geen warnings

- [ ] **Stap 4: Commit**

```bash
jj describe -m "feat: assembleer root template — site volledig werkend"
```

---

## Task 10: Cloudflare Pages koppelen

**Files:** Geen codewijzigingen — configuratie via Cloudflare dashboard

- [ ] **Stap 1: Push naar GitHub**

```bash
jj bookmark set main -r @
jj git push --bookmark main --allow-new
```

- [ ] **Stap 2: Koppel Cloudflare Pages aan GitHub repo**

1. Ga naar [pages.cloudflare.com](https://pages.cloudflare.com)
2. Klik "Create a project" → "Connect to Git"
3. Selecteer de `west` GitHub repo
4. Stel in:
   - **Framework preset:** Hugo
   - **Build command:** `hugo --minify`
   - **Build output directory:** `public`
5. Voeg environment variable toe:
   - `HUGO_VERSION` = `0.159.0`
6. Klik "Save and Deploy"

Verwacht: eerste build slaagt, site bereikbaar op `*.pages.dev` URL

- [ ] **Stap 3: Koppel eigen domein**

1. In Cloudflare Pages project → "Custom domains"
2. Voeg `westrotterdam.nl` toe (pas domeinnaam aan naar de echte)
3. Cloudflare toont DNS instructies
4. Pas DNS records aan bij de domeinregistrar van het restaurant
5. Wacht op SSL certificaat (automatisch, ~5 minuten)

- [ ] **Stap 4: Haal Cloudflare Analytics token op**

1. In Cloudflare dashboard → "Web Analytics"
2. Maak een site aan voor `westrotterdam.nl`
3. Kopieer het beacon token
4. Plak het token in `layouts/partials/head.html` op de plek van `VERVANG_MET_JOUW_TOKEN`
5. Commit en push

```bash
jj describe -m "chore: voeg Cloudflare Analytics token toe"
jj bookmark set main -r @
jj git push --bookmark main
```

---

## Task 11: Instagram embeds invullen

**Files:**
- Aanpassen: `layouts/partials/section-home.html`

- [ ] **Stap 1: Vraag eigenaar om Instagram posts te selecteren**

De eigenaar kiest 4 recente posts die op de homepage moeten verschijnen.

- [ ] **Stap 2: Haal embed code op per post**

Voor elke geselecteerde post:
1. Ga naar de post op instagram.com
2. Klik de drie puntjes `...` → "Insluiten"
3. Kopieer de `<blockquote class="instagram-media">` tag (zonder het `<script>` gedeelte — dat laadt `instagram.js` al)

- [ ] **Stap 3: Vervang de placeholder divs in section-home.html**

Vervang de vier `<div class="aspect-square rounded">` placeholders met de gekopieerde blockquote tags.

- [ ] **Stap 4: Test lokaal**

```bash
hugo server
```

Verwacht: Instagram posts laden als embedded previews in de strip

- [ ] **Stap 5: Commit**

```bash
jj describe -m "feat: voeg Instagram embeds toe aan homepage"
```

---

## Task 12: Google Maps embed invullen

**Files:**
- Aanpassen: `data/restaurant.yaml`

- [ ] **Stap 1: Haal Google Maps embed URL op**

1. Ga naar [maps.google.com](https://maps.google.com)
2. Zoek het adres van West restaurant
3. Klik "Delen" → "Kaart insluiten"
4. Kopieer de `src="..."` URL uit de iframe code

- [ ] **Stap 2: Vul in data/restaurant.yaml**

Vervang de lege `google_maps_embed_url: ""` met de gekopieerde URL.

- [ ] **Stap 3: Test lokaal**

```bash
hugo server
```

Navigeer naar `/#contact`. Verwacht: Google Maps kaart toont het restaurant op de juiste locatie.

- [ ] **Stap 4: Commit en deploy**

```bash
jj describe -m "chore: voeg Google Maps embed toe"
publish "chore: voeg Google Maps embed toe"
```

---

## Task 13: Eindcheck & oplevering

- [ ] **Stap 1: Test op desktop**

Open de live site. Controleer:
- [ ] Home sectie laadt correct, geen scroll mogelijk
- [ ] Klik "Menu" → menu verschijnt, tabs werken, vegetarisch icoon zichtbaar
- [ ] Klik "Contact" → openingstijden kloppen, kaart zichtbaar, reserveer-banner onderaan
- [ ] URL hash updatet bij elke klik
- [ ] Direct navigeren naar `westrotterdam.nl/#menu` opent de menu sectie

- [ ] **Stap 2: Test op mobile**

Open de live site op een telefoon (of Chrome DevTools → responsive mode). Controleer:
- [ ] Alle secties zichtbaar onder elkaar
- [ ] Nav links scrollen naar de juiste sectie
- [ ] Telefoonnummer in reserveer-banner is klikbaar (belt direct)
- [ ] Menu tabs werken op touch

- [ ] **Stap 3: Controleer data/restaurant.yaml**

Alle placeholder waarden vervangen door echte gegevens:
- [ ] Adres correct
- [ ] Telefoonnummer correct
- [ ] E-mailadres correct
- [ ] Instagram handle correct
- [ ] Google Maps embed URL ingevuld

- [ ] **Stap 4: Definitieve deploy**

```bash
publish "chore: oplevering West restaurant website v1"
```
