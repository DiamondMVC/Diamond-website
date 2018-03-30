nyan.define('nyan.Ajax', {
  static: true,

  defaultHeaders: undefined,

  get: function(url, callback, error, headers) {
    if (!headers) {
      headers = {};
    }

    if (this.defaultHeaders) {
      for (var prop in this.defaultHeaders) {
        headers[prop] = this.defaultHeaders[prop];
      }
    }

    nyan.xhr(url, 'GET', callback, error, headers).send();
  },

  post: function(url, contentType, data, callback, error, headers) {
    if (!headers) {
      headers = {};
    }

    if (this.defaultHeaders) {
      for (var prop in this.defaultHeaders) {
        headers[prop] = this.defaultHeaders[prop];
      }
    }

    headers['Content-Type'] = contentType;

    if (typeof data !== 'string' && !(data instanceof String)) {
      data = JSON.stringify(data);
    }

    nyan.xhr(url, 'POST', callback, error, headers).send(data);
  },

  put: function(url, contentType, data, callback, error, headers) {
    if (!headers) {
      headers = {};
    }

    if (this.defaultHeaders) {
      for (var prop in this.defaultHeaders) {
        headers[prop] = this.defaultHeaders[prop];
      }
    }

    headers['Content-Type'] = contentType;

    if (typeof data !== 'string' && !(data instanceof String)) {
      data = JSON.stringify(data);
    }

    nyan.xhr(url, 'PUT', callback, error, headers).send(data);
  },

  delete: function(url, callback, error, headers) {
    if (!headers) {
      headers = {};
    }

    if (this.defaultHeaders) {
      for (var prop in this.defaultHeaders) {
        headers[prop] = this.defaultHeaders[prop];
      }
    }

    nyan.xhr(url, 'DELETE', callback, error, headers).send();
  }
});
