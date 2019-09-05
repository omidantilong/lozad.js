/*! lozad.js - v1.10.0 - 2019-09-05
* https://github.com/ApoorvSaxena/lozad.js
* Copyright (c) 2019 Apoorv Saxena; Licensed MIT */


(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.lozad = factory());
}(this, function () { 'use strict';

  /**
   * Detect IE browser
   * @const {boolean}
   * @private
   */
  var isIE = typeof document !== 'undefined' && document.documentMode;

  var defaultConfig = {
    rootMargin: '0px',
    threshold: 0,
    watchExit: false,
    load: function load(element) {
      if (element.nodeName.toLowerCase() === 'picture') {
        var img = document.createElement('img');
        if (isIE && element.getAttribute('data-iesrc')) {
          img.src = element.getAttribute('data-iesrc');
        }

        if (element.getAttribute('data-alt')) {
          img.alt = element.getAttribute('data-alt');
        }

        element.append(img);
      }

      if (element.nodeName.toLowerCase() === 'video' && !element.getAttribute('data-src')) {
        if (element.children) {
          var childs = element.children;
          var childSrc = void 0;
          for (var i = 0; i <= childs.length - 1; i++) {
            childSrc = childs[i].getAttribute('data-src');
            if (childSrc) {
              childs[i].src = childSrc;
            }
          }

          element.load();
        }
      }

      if (element.getAttribute('data-src')) {
        element.src = element.getAttribute('data-src');
      }

      if (element.getAttribute('data-srcset')) {
        element.setAttribute('srcset', element.getAttribute('data-srcset'));
      }

      if (element.getAttribute('data-background-image')) {
        element.style.backgroundImage = 'url(\'' + element.getAttribute('data-background-image') + '\')';
      }

      if (element.getAttribute('data-toggle-class')) {
        element.classList.toggle(element.getAttribute('data-toggle-class'));
      }
    },
    loaded: function loaded() {},
    exit: function exit() {}
  };

  function markAsLoaded(element) {
    element.setAttribute('data-loaded', true);
  }

  var isLoaded = function isLoaded(element) {
    return element.getAttribute('data-loaded') === 'true';
  };

  var onIntersection = function onIntersection(load, loaded, exit, watchExit) {
    return function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          if (!watchExit) {
            observer.unobserve(entry.target);
          }

          if (!isLoaded(entry.target)) {
            load(entry.target);
            loaded(entry.target);
            if (!watchExit) {
              markAsLoaded(entry.target);
            }
          }
        } else if (watchExit) {
          exit(entry.target);
        }
      });
    };
  };

  var getElements = function getElements(selector) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    if (selector instanceof Element) {
      return [selector];
    }

    if (selector instanceof NodeList) {
      return selector;
    }

    return root.querySelectorAll(selector);
  };

  function lozad () {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.lozad';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _Object$assign = Object.assign({}, defaultConfig, options),
        root = _Object$assign.root,
        rootMargin = _Object$assign.rootMargin,
        threshold = _Object$assign.threshold,
        watchExit = _Object$assign.watchExit,
        load = _Object$assign.load,
        loaded = _Object$assign.loaded,
        exit = _Object$assign.exit;

    var observer = void 0;

    if (typeof window !== 'undefined' && window.IntersectionObserver) {
      observer = new IntersectionObserver(onIntersection(load, loaded, exit, watchExit), {
        root: root,
        rootMargin: rootMargin,
        threshold: threshold
      });
    }

    return {
      observe: function observe() {
        var elements = getElements(selector, root);

        for (var i = 0; i < elements.length; i++) {
          if (isLoaded(elements[i])) {
            continue;
          }

          if (observer) {
            observer.observe(elements[i]);
            continue;
          }

          load(elements[i]);
          loaded(elements[i]);
          if (!watchExit) {
            markAsLoaded(elements[i]);
          }
        }
      },
      triggerLoad: function triggerLoad(element) {
        if (isLoaded(element)) {
          return;
        }

        load(element);
        loaded(element);
        if (!watchExit) {
          markAsLoaded(element);
        }
      },

      observer: observer
    };
  }

  return lozad;

}));
