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
  function initSlideshow() {
    var slides = document.querySelectorAll('.slideshow-bg .slide');
    if (slides.length < 2) return;
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 4000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSlideshow();
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
    setNavHeight();
    if (!isMobile()) {
      const hash = window.location.hash.replace('#', '') || 'home';
      navigateTo(hash);
    }
  });
})();
