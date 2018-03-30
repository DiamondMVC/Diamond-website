nyan.extend = function(identifier, extension) {
  var identifiers = identifier.split('.'),
      entry = window;

  for (var i = 0; i < identifiers.length; i++) {
    entry = entry[identifiers[i]];
  }

  if (entry) {
    entry[extension.name] = extension.impl;
  }
};
