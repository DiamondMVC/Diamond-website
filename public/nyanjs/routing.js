nyan.define('nyan.Routing', {
  alias: 'routing',

  static: true,

  inherit: 'nyan.Events',

  routes: {},

  history: undefined,

  navigateTo: function(route) {
    var newHash = '#' + route;
    if (location.hash === newHash) {
      this.onHashChange();
    } else {
      location.hash = '#' + route;
    }
  },

  navigateBack: function() {
    if (this.history && this.history.last){
      var route = this.history.last.route;

      this.history = this.history.last ? this.history.last.last : undefined;

      this.navigateTo(route);
    }
  },

  getView: function(route) {
    return this.routes[route];
  },

  addRoute: function(route, view) {
    this.routes[route] = view;
  },

  onHashChange: function() {
    if (nyan.app && nyan.app.config && nyan.app.config.navigationView) {

      if (!location.hash || location.hash.length < 2 || location.hash === '#') {
        return;
      }

      var route = location.hash.substring(1, location.hash.length),
          routingView = this.getView(route);

      if (routingView) {
        if (this.events.fire('navigating') === false) {
          return;
        }

        nyan.setView(nyan.app.config.navigationView, routingView);

        this.history = {
          last: this.history,

          route: route
        };

        this.events.fire('navigated');
      }
    }
  }
});


window.onhashchange = function() {
  nyan.Routing.onHashChange();
};
