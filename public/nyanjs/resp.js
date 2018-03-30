nyan.extend('nyan', {
  name: 'getResp',

  impl: function() {
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
    if (width > 994) {
      return 'lg';
    } else if (width > 780) {
      return 'md';
    } else if (width > 564) {
      return 'sm';
    } else {
      return 'xs';
    }
  }
});
