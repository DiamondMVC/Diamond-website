nyan.app = nyan.define('app', {
  config: {
    files: [
      // Controllers
      // Models

      // Views
        // Templates
        // View Controllers
    ]
  },

  init: function() {
    this.events.attach('load', this.onLoad);
    this.events.attach('responsiveChange', this.onResponsiveChange);
  },

  onLoad: function() {
    nyan.setView();

    $(document).ready(function() {
      app.loadKonami();
    });
  },

  loadKonami: function() {
    var first = true;

    new Konami(function() {
      window.scrollTo(0, 0);

      if (first) {
        first = false;

        $(document.body).html('<div class="konami" style="display: none"></div>' + $(document.body).html());
      }

      var konami = $('.konami');

      if (konami) {
        konami.css('background-image', 'url(/public/media/konami.jpg)');

        konami.fadeIn(1000, function() {
          setTimeout(function() {
            konami.fadeOut(1000);
          }, 3000);
        });
      }
    });
  },

  onResponsiveChange: function() {
    if (window.location.hash && window.location.hash.length > 1) {
      var section = document.getElementById(window.location.hash.substring(1));
      section.scrollIntoView();
    }
  }
});
