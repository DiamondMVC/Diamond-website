nyan.define('nyan.Controller', {
  alias: 'controller',

  inherit: 'nyan.Events',

  map: 'nyan.controllers',

  proxyMembers: ['events']
});

nyan.define('nyan.ViewController', {
  alias: 'controller',

  inherit: 'nyan.Events',

  map: 'nyan.viewControllers',

  proxyMembers: ['events']
});
