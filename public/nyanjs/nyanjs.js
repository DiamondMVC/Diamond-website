nyan = {
  app: undefined,

  controllers: {},
  models: {},
  views: {},
  viewControllers: {},

  __nextElementId: 0,

  getNextElementId: function() {
    var id = 'nyan-' + this.__nextElementId;

    this.__nextElementId++;

    return id;
  },

  getController: function(name) {
    return this.controllers[name];
  },

  getModel: function(name) {
    return this.models[name];
  },

  getView: function(name) {
    return this.view[name];
  },

  getViewController: function(name) {
    return this.viewControllers[name];
  },

  xhr: function(url, method, callback, error, headers) {
    var xhr = new XMLHttpRequest();

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = window.location.protocol + '//' + window.location.host + url;
    }

    xhr.open(method, url, true);

    if (headers) {
      for (var prop in headers) {
        xhr.setRequestHeader(prop, headers[prop]);
      }
    }

    xhr.onreadystatechange = function() {
      if (error && xhr.status !== 200) {
        var notFound = xhr.status === 404;

        error(notFound);
      } else if (callback && xhr.readyState === 4) {
        callback(xhr.responseText);
      }
    };

    return xhr;
  },

  loadFiles: function(files, callback, ignoreErrors, callbackOnEmpty) {
    if (!files || !files.length) {
      if (callbackOnEmpty && callback) {
        callback();
      }
      return;
    }

    var file = files[0],
        me = this;

    switch (me.getExtension(file)) {
      case ".js": {
        var scriptElement = document.createElement('script');

        scriptElement.setAttribute('src', window.location.protocol + '//' + window.location.host + file);
        scriptElement.onload = function() {
          if (files.length == 1) {
            if (callback) {
              callback();
            }
          } else {
            me.loadFiles(files.slice(1), callback, ignoreErrors);
          }
        };

        document.head.appendChild(scriptElement);
        break;
      }

      default: {
        this.xhr(file, 'GET', function(content) {
          me.views[me.getFileNameWithoutExtension(file)] = content;

          if (files.length == 1) {
            if (callback) {
              callback();
            }
          } else {
            me.loadFiles(files.slice(1), callback, ignoreErrors);
          }
        }, function(notFound) {
          if (ignoreErrors) {
            return;
          }

          if (notFound) {
            console.error("Could not find: " + file);
          } else {
            console.error('Failed to load: ' + file);
          }
        }).send();
        break;
      }
    }
  },

  getExtension: function(fileName) {
    var startIndex = fileName.lastIndexOf('.');

    return fileName.substring(startIndex, fileName.length) || fileName;
  },

  getFileNameWithoutExtension: function(fileName) {
    var startIndex = fileName.lastIndexOf('/');

    if (startIndex < 0) {
      startIndex = -1;
    }

    fileName = fileName.substring(startIndex + 1, fileName.length) || fileName;

    return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  },

  initialize: function() {
    var me = this;

    me.loadFiles(['/nyanjs/config.js'], function() {
      me.loadFiles(nyan.config.files, function() {
        function loadAppFiles() {
          me.loadFiles([window.appPath || '/app/app.js'], function() {
            me.loadFiles(me.app.config.files, function() {
              me.initializeApp();

              if (me.app) {
                me.app.events.fire('load');
              } else {
                console.error('Failed to load app.');
              }

              if (location.hash && location.hash.length >= 2) {
                nyan.Routing.navigateTo(location.hash.substring(1, location.hash.length));
              } else if (me.app.config.appView && me.app.config.mainView) {
                me.setView(me.app.config.appView, me.app.config.mainView);
              }
            }, false, true);
          });
        }

        if (window.nyanui) {
          me.loadFiles(window.nyanui.config.files, function() {
            loadAppFiles();
          });
        } else {
          loadAppFiles();
        }
      });
    });
  },

  queryAll: function(element, handler) {
    if (handler) {
      handler.call(this, element);
    }

    if (element.children && element.children.length) {
      for (var i = 0; i < element.children.length; i++) {
        this.queryAll(element.children[i], handler);
      }
    }
  },

  queryAllSelector: function(element, selector, handler) {
    if (handler) {
      handler.call(this, element);
    }

    if (element.children && element.children.length) {
      var children = element.querySelectorAll(selector);

      for (var i = 0; i < children.length; i++) {
        this.queryAll(children[i], handler);
      }
    }
  }
};

nyan.initialize();
