/*
  Copyright © Diamond MVC 2017
*/
$(document).ready(function() {
  Diamond.Net = {
    Ajax: {
      get: function(req) {
        req.method = 'GET';
        this.request(req);
      },
      post: function(req) {
        req.method = 'POST';
        this.request(req);
      },
      put: function(req) {
        req.method = 'PUT';
        this.request(req);
      },
      request: function(req) {
        req.dataType = req.dataType || 'json';

        if (req.dataType === 'json') {
          req.data = JSON.stringify(req.data);
        }

        $.ajax({
          method: req.method,
          data: req.data,
          dataType: req.dataType,
          contentType: req.dataType === 'json' ? 'application/json; charset=utf-8' : req.contentType,
          url: window.location.protocol + '//' + window.location.host + (req.params ? (req.url + '?' + $.params(req.params)) : req.url),
          success: function(result,status,xhr) {
            if (req.success) {
              req.success.call(req.scope || this, result, status, xhr);
            }
          },
          error: function(xhr,status,error) {
            if (req.error) {
              req.error.call(req.scope || this, xhr, status, error);
            }
          }
        });
      }
    }
  };
});
