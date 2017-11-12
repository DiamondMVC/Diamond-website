/*
  Copyright © Diamond MVC 2017
*/
Diamond = {};

$(document).ready(function() {
  Diamond.Core = {
    lastKnownOpacity: 0.6,

    changeLanguage: function(language) {
      Diamond.Net.Ajax.post({
        url: '/home/setLanguage/' + (language || 'en_us'),
        success: function(result) {
          window.location = "/";
        }
      });
    },

    getFeature: function(feature) {
      Diamond.Net.Ajax.get({
        url: '/home/getFeature/' + feature,
        dataType: 'text',
        contentType: 'text/plain',
        success: function(result) {
          $('#feature-display').html(result);
        }
      });
    },

    fadeOutHeader: function(element, opacity, maxOpacity, callback) {
      var me = this;

      opacity += 0.1;

      if (opacity > maxOpacity) {
        if (callback) callback(opacity);
        return;
      }

      me.lastKnownOpacity = opacity;

      $(element).css('background-color', 'rgba(27, 79, 114, ' + opacity + ')');

      setTimeout(function() {
        me.fadeOutHeader(element, opacity, maxOpacity, callback);
      }, 100);
    },

    fadeInHeader: function(element, opacity, minOpacity, callback) {
      var me = this;

      opacity -= 0.1;

      if (opacity < minOpacity) {
        if (callback) callback();
        return;
      }

      me.lastKnownOpacity = opacity;

      $(element).css('background-color', 'rgba(27, 79, 114, ' + opacity + ')');

      setTimeout(function() {
        me.fadeInHeader(element, opacity, minOpacity, callback);
      }, 100);
    },

    setNextBackgroundImage: function(id) {
      var me = this;

      if (id > 4) {
        id = 1;
      }

      me.fadeOutHeader('.d-header-cover', me.lastKnownOpacity, 0.9, function(opacity) {
        $('.d-header')
          .css('background-image', 'url("/public/diamond/images/cover_bg_' + id + '.jpg")');
        $('.d-header-small')
          .css('background-image', 'url("/public/diamond/images/cover_bg_' + id + '.jpg")');

        me.fadeInHeader('.d-header-cover', opacity, 0.6, function() {
          setTimeout(function() {
            me.setNextBackgroundImage(id + 1);
          }, 7500);
        });
      });
    }
  };

  Diamond.Core.setNextBackgroundImage(1);
});
