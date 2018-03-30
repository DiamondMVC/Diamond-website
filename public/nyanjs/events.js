nyan.define('nyan.Events', {
  alias: 'events',

  events: {},

  scope: this,

  attach: function(name, handler) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    this.events[name].push(handler);
  },

  detach: function(name) {
    this.events[name] = undefined;
  },

  fire: function(name, args) {
    if (!this.events) {
      return;
    }

    var handlers = this.events[name];

    if (!handlers || !handlers.length) {
      return;
    }

    for (var i = 0; i < handlers.length; i++) {
      var result = handlers[i].apply(this.scope || this, args);

      if (result === false) {
        return false;
      }
    }
  }
});
