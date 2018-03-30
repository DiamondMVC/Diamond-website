nyan.extend('nyan', {
  name: 'define',

  impl: function(identifier, obj) {
    if (obj.inherit) {
      var inherit = nyan.getDefinition(obj.inherit);

      if (inherit && inherit.alias) {
        var inheritance = nyan.clone(inherit);

        delete inheritance.create;

        obj[inheritance.alias] = inheritance;

        if (inheritance.init) {
          if (!obj.init) {
            obj.init = function() {};
          }

          var originalInit = obj.init;

          obj.init = function() {
            inheritance.init();

            originalInit();
          };
        }

        if (inheritance.map) {
          var mappedLocation = nyan.getDefinition(inheritance.map);

          if (mappedLocation) {
            mappedLocation[identifier] = obj;
          }
        }

        if (inheritance.proxyMembers) {
          for (var i = 0; i < inheritance.proxyMembers; i++) {
            var member = inheritance.proxyMembers[i];

            obj[member] = inheritance[member];
          }
        }

        if (inheritance.static) {
          obj.static = inheritance.static;
        }
      }
    }

    if (!obj.init) {
      obj.init = function() {};
    }

    if (!obj.create && !obj.static) {
      obj.create = function() {
        return nyan.clone(obj);
      };
    }

    var identifiers = identifier.split('.'),
        entry = window;

    for (var i = 0; i < identifiers.length; i++) {
      if (i === (identifiers.length - 1)) {
        entry[identifiers[i]] = obj;
      }
      else {
        if (!entry[identifiers[i]]) {
          entry[identifiers[i]] = {};
        }

        entry = entry[identifiers[i]];
      }
    }

    return obj;
  }
});

nyan.extend('nyan', {
  name: 'getDefinition',

  impl: function(identifier) {
    var identifiers = identifier.split('.'),
        entry = window;

    for (var i = 0; i < identifiers.length; i++) {
      entry = entry[identifiers[i]];
    }

    return entry;
  }
});


nyan.extend('nyan', {
  name: 'create',

  impl: function(identifier) {
    var definition = this.getDefinition(identifier);

    if (!definition.static) {
      return definition.create();
    }
  }
})
