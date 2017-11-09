/*
  Copyright © Diamond MVC 2017
*/
Diamond = {};

$(document).ready(function() {
  Diamond.Core = {
    changeLanguage: function(language) {
      Diamond.Net.Ajax.post({
        url: '/home/setLanguage/' + (language || 'en_us'),
        success: function(result) {
          window.location = "/";
        }
      });
    }
  };
});
