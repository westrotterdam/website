# Plan: TEBI Reserveringen Integratie & GDPR

Dit document beschrijft de stappen die nodig zijn zodra West overstapt op online reserveringen via Tebi.

## Fase 1: Voorbereiding (Verantwoordelijkheid Eigenaren)
1. [ ] **Tebi Account & Configuratie**
   - Account bij Tebi afronden.
   - Reserveringsmodules instellen in Tebi (tafels, capaciteit, bloktijden).
2. [ ] **Widget-code aanvragen**
   - Haal bij Tebi de insluitcode op (HTML iframe of JavaScript snippet) voor reserveringen.
3. [ ] **Verwerkersovereenkomst (GDPR)**
   - Accepteer de verwerkersovereenkomst (DPA) met Tebi (gaat vaak via hun terms of service).

## Fase 2: Privacyverklaring Toevoegen (Gedeelde Verantwoordelijkheid)
1. [ ] **Opstellen Privacy Statement** (Eigenaren)
   - Een korte tekst waarin staat dat er persoonsgegevens (naam, mail, telefoon) worden verzameld voor de dienstverlening, dat data niet wordt gedeeld met derden behalve systeembeheerder Tebi, en hoe mensen hun data kunnen inzien/verwijderen.
2. [ ] **Pagina bouwen** (Webbouwer)
   - Maak `content/privacy.md` aan.
   - Bouw een simpele Hugo layout `layouts/privacy/single.html` (geen single-page-sectie, maar een losse pagina zodat het netjes buiten de hoofdervaring blijft).
3. [ ] **Footer link toevoegen** (Webbouwer)
   - Voeg "Privacy & Cookies" toe als tekstlink in de `layouts/partials/footer.html`.

## Fase 3: Website Integratie (Verantwoordelijkheid Webbouwer)
1. [ ] **Reserveer-banner updaten**
   - Verwijder of verander de huidige *bordeauxrode* reserveerbalk onderaan de contactpagina.
   - Verander de *mailto:* functionaliteit.
2. [ ] **Tebi Widget implementeren**
   - Plaats de Tebi snippet in `layouts/partials/section-contact.html` of `section-home.html`.
   - Zorg voor een knop (bijv. in de navigatie of in de hero) "Reserveer een tafel" die de Tebi-widget (een pop-up of los tabblad) activeert.
3. [ ] **Testen op GDPR-cookies**
   - Bezoek de site en check via de DevTools (Application > Cookies) of Tebi trackers laadt. Zo niet -> geen irritante cookie popup nodig!

## Fase 4: Oplevering & Go-live
1. [ ] Commit en push naar GitHub.
2. [ ] Cloudflare pakt dit automatisch op.
3. [ ] Test de reserveringsflow (mobiel en desktop).
