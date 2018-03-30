nyan.extend('nyan', {
  name: 'setView',

  impl: function(viewContainer, viewName, model, internal) {
    var useWholePage = !viewContainer && !viewName,
        viewTag = !useWholePage ? document.getElementById(viewContainer) : document.body,
        view;

    if (!useWholePage) {
      if (!viewTag || !viewTag.tagName.toLowerCase() === 'view') {
        return;
      }

      view = this.views[viewName];

      if (!view) {
        return;
      }

      viewTag.innerHTML = view;
    }

    var viewController = this.getController(viewTag.getAttribute('n-controller')) || this.getViewController(viewName) || this.getViewController(this.app.defaultViewController);

    if (viewController) {
      viewConroller = this.clone(viewController);
      viewController.events = this.clone(nyan.Events);

      viewController.init();
    }

    viewTag.style.visibility = 'hidden';

    if (viewController) {
      var dataBind = viewTag.getAttribute('n-data-bind');

      if (dataBind) {
        viewController[dataBind] = model;
      }
    }

    var applier = viewTag.__applier || viewTag.querySelector('viewapply');

    if (applier && applier.attributes) {
      viewTag.__applier = applier;
      applier.parentNode.removeChild(applier);

      for (var i = 0; i < applier.attributes.length; i++) {
        var attr = applier.attributes[i];

        if (attr.name == 'class') {
          var classes = viewTag.getAttribute('class') || '';

          classes = attr.value + ' ' + classes;

          viewTag.setAttribute(attr.name, classes);
        } else if (attr.name == 'style') {
          var styles = viewTag.getAttribute('style') || '';

          styles = attr.value + ' ' + styles;

          viewTag.setAttribute(attr.name, styles);
        } else {
          viewTag.setAttribute(attr.name, attr.value);
        }
      }
    }

    this.bind(viewTag, model || null, viewController, internal);

    viewTag.style.visibility = 'visible';

    function rebindResponsive(resp) {
      viewTag.__responsive = {};

      var responsiveElements = viewTag.querySelectorAll('[n-resp-bind]');

      if (responsiveElements && responsiveElements.length) {
        for (var i = 0; i < responsiveElements.length; i++) {
          var responsiveElement = responsiveElements[i],
              responsiveSizes = responsiveElement.getAttribute('n-resp');

          if (responsiveSizes || responsiveSizes === '') {
            var respBinding = responsiveElement.getAttribute('n-resp-bind'),
                respSelect = responsiveElement.getAttribute('n-resp-select'),
                respData = viewTag.__responsive[respBinding] || { innerHTML: '' };

            if (respSelect || respSelect === '' || (!respData.innerHTML && !respData.innerHTML.trim().length)) {
              if (responsiveElement.innerHTML && responsiveElement.innerHTML.trim().length > 0) {
                respData.innerHTML = responsiveElement.innerHTML || '';
              }
            }

            var sizes = responsiveSizes.split(',');

            for (var j = 0; j < sizes.length; j++) {
              switch (sizes[j]) {
                case 'xs': respData.xs = responsiveElement; break;
                case 'sm': respData.sm = responsiveElement; break;
                case 'md': respData.md = responsiveElement; break;
                case 'lg': respData.lg = responsiveElement; break;
              }
            }

            viewTag.__responsive[respBinding] = respData;
          }
        }
      }

      this.app.events.fire('responsiveChange', [resp]);
    }

    function responsiveCopy() {
      var responsiveElements = viewTag.querySelectorAll('[n-resp-copy]');

      if (responsiveElements && responsiveElements.length) {
        for (var i = 0; i < responsiveElements.length; i++) {
          var responsiveElement = responsiveElements[i],
              respInsert = responsiveElement.getAttribute('n-resp-insert');

          if (respInsert) {
            viewTag.querySelector(respInsert).innerHTML = responsiveElement.innerHTML;
          }
        }
      }
    }

    rebindResponsive();
    responsiveCopy();

    if (!viewTag.__detachEvent) {
      viewTag.__detachEvent = function() {
        responsiveCopy();

        for (var prop in viewTag.__responsive) {
          var respData = viewTag.__responsive[prop];

          if (!respData.xs && !respData.sm && !respData.md && !respData.lg) {
            continue;
          }

          var resp = nyan.getResp(),
              element = respData[resp],
              responsiveReplace = element.getAttribute('n-resp-replace'),
              clearStyle = element.getAttribute('n-resp-clear'),
              respVisible = element.getAttribute('n-resp-visible');

          setTimeout(function() {
            if (element && respVisible) {
              nyan.queryAll(element, function() {
                element.style.visibility = 'visible';
              });
            }

            if (element && (clearStyle || clearStyle === '')) {
              var clearStyles = clearStyle.split(',');

              for (var i = 0; i < clearStyles.length; i++) {
                var clearElements = element.querySelectorAll(clearStyles[i]);

                if (clearElements && clearElements.length) {
                  for (var j = 0; j < clearElements.length; j++) {
                    var clearElement = clearElements[j];

                    clearElement.setAttribute('style', '');

                    if (clearElement.children && clearElement.children.length) {
                      var isHidden = true;

                      for (var k = 0; k < clearElement.children.length; k++) {
                        if (clearElement.children[k].style.visibility !== 'hidden') {
                          isHidden = false;
                        }
                      }

                      if (isHidden) {
                        clearElement.parentNode.removeChild(clearElement);
                      }
                    }
                  }
                }
              }
            }
          });

          if (!element || (!responsiveReplace && responsiveReplace !== '' && element.innerHTML && element.innerHTML.trim().length > 0)) {
            return;
          }

          if (resp !== 'xs') respData.xs.innerHTML = '';
          if (resp !== 'sm') respData.sm.innerHTML = '';
          if (resp !== 'md') respData.md.innerHTML = '';
          if (resp !== 'lg') respData.lg.innerHTML = '';

          element.innerHTML = respData.innerHTML;

          rebindResponsive(resp);
        }
      };

      window.addEventListener('resize', viewTag.__detachEvent);
      viewTag.__detachEvent();
    }
  }
});
