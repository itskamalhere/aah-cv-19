function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common"], {
  /***/
  "./node_modules/@ionic/core/dist/esm/button-active-274abd17.js":
  /*!*********************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/button-active-274abd17.js ***!
    \*********************************************************************/

  /*! exports provided: c */

  /***/
  function node_modulesIonicCoreDistEsmButtonActive274abd17Js(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "c", function () {
      return createButtonActiveGesture;
    });
    /* harmony import */


    var _index_29df6f59_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./index-29df6f59.js */
    "./node_modules/@ionic/core/dist/esm/index-29df6f59.js");
    /* harmony import */


    var _index_eea61379_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./index-eea61379.js */
    "./node_modules/@ionic/core/dist/esm/index-eea61379.js");
    /* harmony import */


    var _haptic_7b8ba70a_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./haptic-7b8ba70a.js */
    "./node_modules/@ionic/core/dist/esm/haptic-7b8ba70a.js");

    var createButtonActiveGesture = function createButtonActiveGesture(el, isButton) {
      var touchedButton;

      var activateButtonAtPoint = function activateButtonAtPoint(x, y, hapticFeedbackFn) {
        if (typeof document === 'undefined') {
          return;
        }

        var target = document.elementFromPoint(x, y);

        if (!target || !isButton(target)) {
          clearActiveButton();
          return;
        }

        if (target !== touchedButton) {
          clearActiveButton();
          setActiveButton(target, hapticFeedbackFn);
        }
      };

      var setActiveButton = function setActiveButton(button, hapticFeedbackFn) {
        touchedButton = button;
        var buttonToModify = touchedButton;
        Object(_index_29df6f59_js__WEBPACK_IMPORTED_MODULE_0__["w"])(function () {
          return buttonToModify.classList.add('ion-activated');
        });
        hapticFeedbackFn();
      };

      var clearActiveButton = function clearActiveButton() {
        var dispatchClick = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!touchedButton) {
          return;
        }

        var buttonToModify = touchedButton;
        Object(_index_29df6f59_js__WEBPACK_IMPORTED_MODULE_0__["w"])(function () {
          return buttonToModify.classList.remove('ion-activated');
        });

        if (dispatchClick) {
          touchedButton.click();
        }

        touchedButton = undefined;
      };

      return Object(_index_eea61379_js__WEBPACK_IMPORTED_MODULE_1__["createGesture"])({
        el: el,
        gestureName: 'buttonActiveDrag',
        threshold: 0,
        onStart: function onStart(ev) {
          return activateButtonAtPoint(ev.currentX, ev.currentY, _haptic_7b8ba70a_js__WEBPACK_IMPORTED_MODULE_2__["a"]);
        },
        onMove: function onMove(ev) {
          return activateButtonAtPoint(ev.currentX, ev.currentY, _haptic_7b8ba70a_js__WEBPACK_IMPORTED_MODULE_2__["b"]);
        },
        onEnd: function onEnd() {
          clearActiveButton(true);
          Object(_haptic_7b8ba70a_js__WEBPACK_IMPORTED_MODULE_2__["h"])();
        }
      });
    };
    /***/

  },

  /***/
  "./node_modules/@ionic/core/dist/esm/framework-delegate-d1eb6504.js":
  /*!**************************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/framework-delegate-d1eb6504.js ***!
    \**************************************************************************/

  /*! exports provided: a, d */

  /***/
  function node_modulesIonicCoreDistEsmFrameworkDelegateD1eb6504Js(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "a", function () {
      return attachComponent;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "d", function () {
      return detachComponent;
    });

    var attachComponent = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(delegate, container, component, cssClasses, componentProps) {
        var el;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!delegate) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", delegate.attachViewToDom(container, component, componentProps, cssClasses));

              case 2:
                if (!(typeof component !== 'string' && !(component instanceof HTMLElement))) {
                  _context.next = 4;
                  break;
                }

                throw new Error('framework delegate is missing');

              case 4:
                el = typeof component === 'string' ? container.ownerDocument && container.ownerDocument.createElement(component) : component;

                if (cssClasses) {
                  cssClasses.forEach(function (c) {
                    return el.classList.add(c);
                  });
                }

                if (componentProps) {
                  Object.assign(el, componentProps);
                }

                container.appendChild(el);

                if (!el.componentOnReady) {
                  _context.next = 11;
                  break;
                }

                _context.next = 11;
                return el.componentOnReady();

              case 11:
                return _context.abrupt("return", el);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function attachComponent(_x, _x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
      };
    }();

    var detachComponent = function detachComponent(delegate, element) {
      if (element) {
        if (delegate) {
          var container = element.parentElement;
          return delegate.removeViewFromDom(container, element);
        }

        element.remove();
      }

      return Promise.resolve();
    };
    /***/

  },

  /***/
  "./node_modules/@ionic/core/dist/esm/haptic-7b8ba70a.js":
  /*!**************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/haptic-7b8ba70a.js ***!
    \**************************************************************/

  /*! exports provided: a, b, c, d, h */

  /***/
  function node_modulesIonicCoreDistEsmHaptic7b8ba70aJs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "a", function () {
      return hapticSelectionStart;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "b", function () {
      return hapticSelectionChanged;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "c", function () {
      return hapticSelection;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "d", function () {
      return hapticImpact;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "h", function () {
      return hapticSelectionEnd;
    });

    var HapticEngine = {
      getEngine: function getEngine() {
        var win = window;
        return win.TapticEngine || win.Capacitor && win.Capacitor.isPluginAvailable('Haptics') && win.Capacitor.Plugins.Haptics;
      },
      available: function available() {
        return !!this.getEngine();
      },
      isCordova: function isCordova() {
        return !!window.TapticEngine;
      },
      isCapacitor: function isCapacitor() {
        var win = window;
        return !!win.Capacitor;
      },
      impact: function impact(options) {
        var engine = this.getEngine();

        if (!engine) {
          return;
        }

        var style = this.isCapacitor() ? options.style.toUpperCase() : options.style;
        engine.impact({
          style: style
        });
      },
      notification: function notification(options) {
        var engine = this.getEngine();

        if (!engine) {
          return;
        }

        var style = this.isCapacitor() ? options.style.toUpperCase() : options.style;
        engine.notification({
          style: style
        });
      },
      selection: function selection() {
        this.impact({
          style: 'light'
        });
      },
      selectionStart: function selectionStart() {
        var engine = this.getEngine();

        if (!engine) {
          return;
        }

        if (this.isCapacitor()) {
          engine.selectionStart();
        } else {
          engine.gestureSelectionStart();
        }
      },
      selectionChanged: function selectionChanged() {
        var engine = this.getEngine();

        if (!engine) {
          return;
        }

        if (this.isCapacitor()) {
          engine.selectionChanged();
        } else {
          engine.gestureSelectionChanged();
        }
      },
      selectionEnd: function selectionEnd() {
        var engine = this.getEngine();

        if (!engine) {
          return;
        }

        if (this.isCapacitor()) {
          engine.selectionEnd();
        } else {
          engine.gestureSelectionEnd();
        }
      }
    };
    /**
     * Trigger a selection changed haptic event. Good for one-time events
     * (not for gestures)
     */

    var hapticSelection = function hapticSelection() {
      HapticEngine.selection();
    };
    /**
     * Tell the haptic engine that a gesture for a selection change is starting.
     */


    var hapticSelectionStart = function hapticSelectionStart() {
      HapticEngine.selectionStart();
    };
    /**
     * Tell the haptic engine that a selection changed during a gesture.
     */


    var hapticSelectionChanged = function hapticSelectionChanged() {
      HapticEngine.selectionChanged();
    };
    /**
     * Tell the haptic engine we are done with a gesture. This needs to be
     * called lest resources are not properly recycled.
     */


    var hapticSelectionEnd = function hapticSelectionEnd() {
      HapticEngine.selectionEnd();
    };
    /**
     * Use this to indicate success/failure/warning to the user.
     * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
     */


    var hapticImpact = function hapticImpact(options) {
      HapticEngine.impact(options);
    };
    /***/

  },

  /***/
  "./node_modules/@ionic/core/dist/esm/spinner-configs-c78e170e.js":
  /*!***********************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/spinner-configs-c78e170e.js ***!
    \***********************************************************************/

  /*! exports provided: S */

  /***/
  function node_modulesIonicCoreDistEsmSpinnerConfigsC78e170eJs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "S", function () {
      return SPINNERS;
    });

    var spinners = {
      'bubbles': {
        dur: 1000,
        circles: 9,
        fn: function fn(dur, index, total) {
          var animationDelay = "".concat(dur * index / total - dur, "ms");
          var angle = 2 * Math.PI * index / total;
          return {
            r: 5,
            style: {
              'top': "".concat(9 * Math.sin(angle), "px"),
              'left': "".concat(9 * Math.cos(angle), "px"),
              'animation-delay': animationDelay
            }
          };
        }
      },
      'circles': {
        dur: 1000,
        circles: 8,
        fn: function fn(dur, index, total) {
          var step = index / total;
          var animationDelay = "".concat(dur * step - dur, "ms");
          var angle = 2 * Math.PI * step;
          return {
            r: 5,
            style: {
              'top': "".concat(9 * Math.sin(angle), "px"),
              'left': "".concat(9 * Math.cos(angle), "px"),
              'animation-delay': animationDelay
            }
          };
        }
      },
      'circular': {
        dur: 1400,
        elmDuration: true,
        circles: 1,
        fn: function fn() {
          return {
            r: 20,
            cx: 48,
            cy: 48,
            fill: 'none',
            viewBox: '24 24 48 48',
            transform: 'translate(0,0)',
            style: {}
          };
        }
      },
      'crescent': {
        dur: 750,
        circles: 1,
        fn: function fn() {
          return {
            r: 26,
            style: {}
          };
        }
      },
      'dots': {
        dur: 750,
        circles: 3,
        fn: function fn(_, index) {
          var animationDelay = -(110 * index) + 'ms';
          return {
            r: 6,
            style: {
              'left': "".concat(9 - 9 * index, "px"),
              'animation-delay': animationDelay
            }
          };
        }
      },
      'lines': {
        dur: 1000,
        lines: 12,
        fn: function fn(dur, index, total) {
          var transform = "rotate(".concat(30 * index + (index < 6 ? 180 : -180), "deg)");
          var animationDelay = "".concat(dur * index / total - dur, "ms");
          return {
            y1: 17,
            y2: 29,
            style: {
              'transform': transform,
              'animation-delay': animationDelay
            }
          };
        }
      },
      'lines-small': {
        dur: 1000,
        lines: 12,
        fn: function fn(dur, index, total) {
          var transform = "rotate(".concat(30 * index + (index < 6 ? 180 : -180), "deg)");
          var animationDelay = "".concat(dur * index / total - dur, "ms");
          return {
            y1: 12,
            y2: 20,
            style: {
              'transform': transform,
              'animation-delay': animationDelay
            }
          };
        }
      }
    };
    var SPINNERS = spinners;
    /***/
  },

  /***/
  "./node_modules/@ionic/core/dist/esm/theme-3f0b0c04.js":
  /*!*************************************************************!*\
    !*** ./node_modules/@ionic/core/dist/esm/theme-3f0b0c04.js ***!
    \*************************************************************/

  /*! exports provided: c, g, h, o */

  /***/
  function node_modulesIonicCoreDistEsmTheme3f0b0c04Js(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "c", function () {
      return createColorClasses;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "g", function () {
      return getClassMap;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "h", function () {
      return hostContext;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "o", function () {
      return openURL;
    });

    var hostContext = function hostContext(selector, el) {
      return el.closest(selector) !== null;
    };
    /**
     * Create the mode and color classes for the component based on the classes passed in
     */


    var createColorClasses = function createColorClasses(color) {
      return typeof color === 'string' && color.length > 0 ? _defineProperty({
        'ion-color': true
      }, "ion-color-".concat(color), true) : undefined;
    };

    var getClassList = function getClassList(classes) {
      if (classes !== undefined) {
        var array = Array.isArray(classes) ? classes : classes.split(' ');
        return array.filter(function (c) {
          return c != null;
        }).map(function (c) {
          return c.trim();
        }).filter(function (c) {
          return c !== '';
        });
      }

      return [];
    };

    var getClassMap = function getClassMap(classes) {
      var map = {};
      getClassList(classes).forEach(function (c) {
        return map[c] = true;
      });
      return map;
    };

    var SCHEME = /^[a-z][a-z0-9+\-.]*:/;

    var openURL = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url, ev, direction, animation) {
        var router;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(url != null && url[0] !== '#' && !SCHEME.test(url))) {
                  _context2.next = 5;
                  break;
                }

                router = document.querySelector('ion-router');

                if (!router) {
                  _context2.next = 5;
                  break;
                }

                if (ev != null) {
                  ev.preventDefault();
                }

                return _context2.abrupt("return", router.push(url, direction, animation));

              case 5:
                return _context2.abrupt("return", false);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function openURL(_x6, _x7, _x8, _x9) {
        return _ref3.apply(this, arguments);
      };
    }();
    /***/

  },

  /***/
  "./src/app/directives/custom.directive.ts":
  /*!************************************************!*\
    !*** ./src/app/directives/custom.directive.ts ***!
    \************************************************/

  /*! exports provided: HasPermissionsDirective, ValueChangeDirective */

  /***/
  function srcAppDirectivesCustomDirectiveTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "HasPermissionsDirective", function () {
      return HasPermissionsDirective;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ValueChangeDirective", function () {
      return ValueChangeDirective;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _services_session_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ../services/session.service */
    "./src/app/services/session.service.ts");

    var HasPermissionsDirective = /*#__PURE__*/function () {
      function HasPermissionsDirective(session, templateRef, viewContainer) {
        _classCallCheck(this, HasPermissionsDirective);

        this.session = session;
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
      }

      _createClass(HasPermissionsDirective, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          if (this.hasPermissions(this.permissions)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainer.clear();
          }
        }
      }, {
        key: "hasPermissions",
        value: function hasPermissions(permissions) {
          var _iterator = _createForOfIteratorHelper(permissions),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var permission = _step.value;

              if (!this.session.getPermissions() || !this.session.getPermissions().includes(permission)) {
                return false;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return true;
        }
      }]);

      return HasPermissionsDirective;
    }();

    HasPermissionsDirective.ctorParameters = function () {
      return [{
        type: _services_session_service__WEBPACK_IMPORTED_MODULE_2__["SessionService"]
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"]
      }];
    };

    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])('hasPermissions')], HasPermissionsDirective.prototype, "permissions", void 0);
    HasPermissionsDirective = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Directive"])({
      selector: '[hasPermissions]'
    })], HasPermissionsDirective);

    var ValueChangeDirective = /*#__PURE__*/function () {
      function ValueChangeDirective(viewContainer, templateRef) {
        _classCallCheck(this, ValueChangeDirective);

        this.viewContainer = viewContainer;
        this.templateRef = templateRef;
        this.hasView = false;
      }

      _createClass(ValueChangeDirective, [{
        key: "valueChange",
        set: function set(val) {
          if (!this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
          } else if (val !== this.currentValue) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.currentValue = val;
          }
        }
      }]);

      return ValueChangeDirective;
    }();

    ValueChangeDirective.ctorParameters = function () {
      return [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"]
      }, {
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"]
      }];
    };

    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()], ValueChangeDirective.prototype, "valueChange", null);
    ValueChangeDirective = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Directive"])({
      selector: '[valueChange]'
    })], ValueChangeDirective);
    /***/
  },

  /***/
  "./src/app/directives/shared-directives/shared-directives.module.ts":
  /*!**************************************************************************!*\
    !*** ./src/app/directives/shared-directives/shared-directives.module.ts ***!
    \**************************************************************************/

  /*! exports provided: SharedDirectivesModule */

  /***/
  function srcAppDirectivesSharedDirectivesSharedDirectivesModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SharedDirectivesModule", function () {
      return SharedDirectivesModule;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _custom_directive__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../custom.directive */
    "./src/app/directives/custom.directive.ts");

    var SharedDirectivesModule = function SharedDirectivesModule() {
      _classCallCheck(this, SharedDirectivesModule);
    };

    SharedDirectivesModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      declarations: [_custom_directive__WEBPACK_IMPORTED_MODULE_3__["HasPermissionsDirective"], _custom_directive__WEBPACK_IMPORTED_MODULE_3__["ValueChangeDirective"]],
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]],
      exports: [_custom_directive__WEBPACK_IMPORTED_MODULE_3__["HasPermissionsDirective"], _custom_directive__WEBPACK_IMPORTED_MODULE_3__["ValueChangeDirective"]]
    })], SharedDirectivesModule);
    /***/
  },

  /***/
  "./src/app/services/firebase.service.ts":
  /*!**********************************************!*\
    !*** ./src/app/services/firebase.service.ts ***!
    \**********************************************/

  /*! exports provided: FirebaseService */

  /***/
  function srcAppServicesFirebaseServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "FirebaseService", function () {
      return FirebaseService;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_fire_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/fire/firestore */
    "./node_modules/@angular/fire/__ivy_ngcc__/fesm2015/angular-fire-firestore.js");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");

    var FirebaseService = /*#__PURE__*/function () {
      function FirebaseService(firestore) {
        _classCallCheck(this, FirebaseService);

        this.firestore = firestore;
        this.userCollectionName = "users";
        this.vitalCollectionName = "vitals";
        this.commentCollectionName = "comments";
        this.userDb = this.firestore.collection(this.userCollectionName);
        this.vitalDb = this.firestore.collection(this.vitalCollectionName);
        this.commentDb = this.firestore.collection(this.commentCollectionName);
      }

      _createClass(FirebaseService, [{
        key: "createUser",
        value: function createUser(record) {
          return this.userDb.add(record);
        }
      }, {
        key: "fetchUserbyNo",
        value: function fetchUserbyNo(mobileNo) {
          var query = this.firestore.collection(this.userCollectionName, function (ref) {
            return ref.where("mobileNumber", '==', mobileNo);
          });
          return this.fetchUserbyField(query);
        }
      }, {
        key: "fetchUserbyField",
        value: function fetchUserbyField(query) {
          var _this = this;

          return new Promise(function (resolve, reject) {
            try {
              _this.fetchUserbyNoSub = query.get().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (snapshot) {
                return snapshot.docs.map(function (a) {
                  var data = a.data();
                  var id = a.id;
                  var ref = a.ref;
                  return {
                    id: id,
                    ref: ref,
                    data: data
                  };
                });
              })).subscribe(function (users) {
                return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(_this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          resolve(users);

                          if (this.fetchUserbyNoSub && !this.fetchUserbyNoSub.closed) {
                            this.fetchUserbyNoSub.unsubscribe();
                          }

                        case 2:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3, this);
                }));
              });
            } catch (e) {
              reject(e);
            }
          });
        }
      }, {
        key: "fetchUsers",
        value: function fetchUsers() {
          return this.userDb.snapshotChanges().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (snapshot) {
            return snapshot.map(function (a) {
              // const data: ItemData = a.payload.doc.data() as ItemData;
              // const id = a.payload.doc.id;
              // const ref = a.payload.doc.ref;  
              // return {id,ref,data};
              var id = a.payload.doc.id;
              var isEdit = false;
              var firstName = a.payload.doc.data()['firstName'];
              var lastName = a.payload.doc.data()['lastName'];
              var age = a.payload.doc.data()['age'];
              return {
                id: id,
                isEdit: isEdit,
                firstName: firstName,
                lastName: lastName,
                age: age
              };
            });
          }));
        }
      }, {
        key: "updateUser",
        value: function updateUser(recordID, record) {
          return this.firestore.doc(this.userCollectionName + '/' + recordID).update(record);
        }
      }, {
        key: "deleteUser",
        value: function deleteUser(recordID) {
          return this.firestore.doc(this.userCollectionName + '/' + recordID)["delete"]();
        }
      }]);

      return FirebaseService;
    }();

    FirebaseService.ctorParameters = function () {
      return [{
        type: _angular_fire_firestore__WEBPACK_IMPORTED_MODULE_2__["AngularFirestore"]
      }];
    };

    FirebaseService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    })], FirebaseService);
    /***/
  }
}]);
//# sourceMappingURL=common-es5.js.map