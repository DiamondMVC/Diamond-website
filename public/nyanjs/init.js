nyan.extend('nyan', {
  name: 'initializeApp',

  impl: function() {
    if (!this.app) {
      console.error("No app found.");
      return;
    }

    var app = this.app;

    app.events = this.clone(nyan.Events);

    app.init();
  }
})
