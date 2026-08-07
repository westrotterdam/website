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
