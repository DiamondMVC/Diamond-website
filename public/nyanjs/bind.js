nyan.extend('nyan', {
  name: 'bind',

  impl: function(element, model, viewController, internal) {
    if (!element) {
      return;
    }

    var me = this;

    element.rebindElement = function() { me.bind(element, model, viewController); };

    if (element.tagName.toLowerCase() === 'viewapply') {
      return;
    }

    if (element.tagName.toLowerCase() === 'view' && !internal) {
      if (!element.id) {
        element.id = this.getNextElementId();
      }

      var viewName = element.getAttribute('n-view');

      if (viewName) {
        var data = element.getAttribute('n-data'),
            attr = element.getAttribute('n-attr'),
            ifCondition = (element.getAttribute('n-if') || ''),
            hasIf = ifCondition.length,
            ifIndex = ifCondition.indexOf('|'),
            dataIsModel;

        if (!model) {
          eval('model = ' + data + ';');
          dataIsModel = true;
        }

        ifCondition = ifIndex > 0 ? [ifCondition.substring(0,ifIndex), ifCondition.substring(ifIndex + 1, ifCondition.length)] : undefined;

        if (hasIf) {
          if (!ifCondition || ifCondition.length !== 2) {
            return;
          }

          eval('var ' + ifCondition[0] + ' = model;');
          eval('var success = ' + ifCondition[1] + ';');

          if (!success) {
            return;
          }
        }

        if (attr && model) {
          var attributeEntries = attr.split('|');

          for (var i = 0; i < attributeEntries.length; i++) {
            var attributeEntry = attributeEntries[i].split(':');

            if (attributeEntry.length == 2) {
              var value = model[attributeEntry[1]];

              if (value) {
                element.setAttribute(attributeEntry[0], value);
              }
            }
          }
        }

        if (dataIsModel) {
          this.setView(element.id, viewName, model, true);
        } else {
          this.setView(element.id, viewName, model ? model[data] : null, true);
        }
        return;
      }
    }

    var eventController = viewController || this.getController(element.getAttribute('n-event-controller'));

    if (eventController) {
      var events = element.getAttribute('n-events');

      if (events) {
        var eventEntries = events.split('|');

        for (var i = 0; i < eventEntries.length; i++) {
          var eventEntry = eventEntries[i].split(':'),
              eventHandler = eventEntry.length === 2 ? eventController[eventEntry[1]] : undefined;

          if (!eventHandler) {
            continue;
          }

          if (!element.id) {
            element.id = this.getNextElementId();
          }

          var eventName = eventEntry[0] + '::' + element.id + '::' + this.getNextElementId();

          eventController.controller.events.detach(eventName);
          element.removeEventListener(eventEntry[0], element.__detachEvent);

          eventController.controller.events.attach(eventName, function() {
              eventHandler.apply(this, [element, model].concat(Array.prototype.slice.call(arguments)));
          });

          element.__detachEvent = function() {
            eventController.controller.events.fire(eventName, Array.prototype.slice.call(arguments))
          };

          element.addEventListener(eventEntry[0], element.__detachEvent);
        }
      }
    }

    var source = element.getAttribute('n-data-source');

    if (source) {
      var type = element.getAttribute('n-data-type'),
          children = element.querySelectorAll(nyan.config.tags),
          sort = element.getAttribute('n-sort'),
          filter = element.getAttribute('n-filter'),
          ifCondition = (element.getAttribute('n-if') || '');

      if (ifCondition && ifCondition.length) {
        switch (type) {
          case 'foreach':
          case 'model':
            type = 'if_' + type;
            break;
        }
      }

      switch (type) {
        case 'foreach': {
          element.templateHTML = element.templateHTML || element.innerHTML;
          element.innerHTML = '';

          var ghostData = element.getAttribute('n-ghost');

          if (ghostData === '' && model) {
            source = model[source];
          }

          eval('var __ndata = ' + source);

          if (__ndata && __ndata.length) {
            if (sort || sort === '') {
              if (sort.length) {
                eval('__ndata.sort(function(a,b) { return ' + sort + '; });');
              } else {
                __ndata.sort();
              }
            }

            if (filter && filter.length) {
              eval('__ndata = __ndata.filter(function(value) { return ' + filter + '; });');
            }

            var child;
            for (var i = 0; i < __ndata.length; i++) {
              element.innerHTML += element.templateHTML;

              this.bind(element.children[element.children.length - 1], __ndata[i], viewController);
            }
          }
          break;
        }

        case 'if_foreach': {
          element.templateHTML = element.templateHTML || element.innerHTML;
          element.innerHTML = '';

          var ghostData = element.getAttribute('n-ghost');

          if (ghostData === '' && model) {
            source = model[source];
          }

          eval('var __ndata = ' + source);

          var ifIndex = ifCondition.indexOf('|');

          ifCondition = ifIndex > 0 ? [ifCondition.substring(0,ifIndex), ifCondition.substring(ifIndex + 1, ifCondition.length)] : undefined;

          if (!ifCondition || ifCondition.length !== 2) {
            break;
          }

          if (__ndata && __ndata.length) {
            eval('var ' + ifCondition[0] + ' = __ndata;');
            eval('var success = ' + ifCondition[1] + ';');

            if (success) {
              if (sort || sort === '') {
                if (sort.length) {
                  eval('__ndata.sort(function(a,b) { return ' + sort + '; });');
                } else {
                  __ndata.sort();
                }
              }

              if (filter && filter.length) {
                eval('__ndata = __ndata.filter(function(value) { return ' + filter + '; });');
              }

              var child;
              for (var i = 0; i < __ndata.length; i++) {
                element.innerHTML += element.templateHTML;
                var lastChild = Array.prototype.slice.call(element.querySelectorAll(nyan.config.tags));
                lastChild = lastChild[lastChild.length - 1];

                this.bind(lastChild, __ndata[i], viewController);
              }
            }
          }
          break;
        }

        case 'if_model': {
          model = this.clone(this.models[source]);

          var ifIndex = ifCondition.indexOf('|');

          ifCondition = ifIndex > 0 ? [ifCondition.substring(0,ifIndex), ifCondition.substring(ifIndex + 1, ifCondition.length)] : undefined;

          if (!ifCondition || ifCondition.length !== 2) {
            break;
          }

          eval('var ' + ifCondition[0] + ' = model;');
          eval('var success = ' + ifCondition[1] + ';');

          if (success) {
            for (var i = 0; i < children.length; i++) {
              var child = children[i];

              this.bind(child, model, viewController);
            }
          }
          break;
        }

        case 'model': {
          model = this.clone(this.models[source]);

          for (var i = 0; i < children.length; i++) {
            var child = children[i];

            this.bind(child, model, viewController);
          }

          break;
        }

        case 'controller':
        default: {
          var call = element.getAttribute('n-call'),
              controller;

          if (call) {
            controller = this.getController[source];
          } else {
            controller = viewController;
            call = source;
          }

          if (controller) {
            call = controller[call];

            if (call) {
              var me = this;

              call.call(controller, function(data) {
                if (data.length) {
                  element.templateHTML = element.templateHTML || element.innerHTML;
                  element.innerHTML = '';

                  if (data && data.length) {
                    if (sort || sort === '') {
                      if (sort.length) {
                        eval('data.sort(function(a,b) { return ' + sort + '; });');
                      } else {
                        data.sort();
                      }
                    }

                    if (filter && filter.length) {
                      eval('data = data.filter(function(value) { return ' + filter + '; });');
                    }

                    for (var i = 0; i < data.length; i++) {
                      element.innerHTML += element.templateHTML;
                      var lastChild = Array.prototype.slice.call(element.querySelectorAll(nyan.config.tags));
                      lastChild = lastChild[lastChild.length - 1];

                      me.bind(lastChild, data[i], viewController);
                    }
                  }
                } else {
                  for (var i = 0; i < children.length; i++) {
                    var child = children[i];

                    me.bind(child, data, viewController);
                  }
                }
              });
            }
          }
          break;
        }
      }
    } else if (model) {
      var data = element.getAttribute('n-data'),
          inlineData = element.getAttribute('n-inline'),
          attr = element.getAttribute('n-attr'),
          ifCondition = (element.getAttribute('n-if') || ''),
          hasIf = ifCondition.length,
          ifIndex = ifCondition.indexOf('|');

      ifCondition = ifIndex > 0 ? [ifCondition.substring(0,ifIndex), ifCondition.substring(ifIndex + 1, ifCondition.length)] : undefined;

      if (hasIf) {
        if (!ifCondition || ifCondition.length !== 2) {
          return;
        }

        eval('var ' + ifCondition[0] + ' = model;');
        eval('var success = ' + ifCondition[1] + ';');

        if (!success) {
          return;
        }
      }

      if (attr) {
        var attributeEntries = attr.split('|');

        for (var i = 0; i < attributeEntries.length; i++) {
          var attributeEntry = attributeEntries[i].split(':');

          if (attributeEntry.length == 2) {
            var value = model[attributeEntry[1]];

            if (value) {
              element.setAttribute(attributeEntry[0], value);
            }
          }
        }
      }

      if (inlineData || inlineData === '') {
        element.innerHTML = model;
      } else if (model[data]) {
        element.innerHTML = model[data];
      } else {
        this.queryAllSelector(element, nyan.config.tags, function(el) {
          if (el !== element) {
            this.bind(el, model, viewController);
          }
        });
      }
    } else {
      this.queryAllSelector(element, nyan.config.tags, function(el) {
        if (el !== element) {
          this.bind(el, model, viewController);
        }
      });
    }
  }
});
