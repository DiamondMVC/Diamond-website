nyan.define('nyan.Application', {
  alias: 'application',

  inherit: 'nyan.Events',

  static: true,

  proxyMembers: ['events']
});
