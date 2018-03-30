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
  },

  onResponsiveChange: function() {
    if (window.location.hash && window.location.hash.length > 1) {
      var section = document.getElementById(window.location.hash.substring(1));
      section.scrollIntoView();
    }
  }
});
