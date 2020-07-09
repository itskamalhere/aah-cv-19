(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common"],{

/***/ "./node_modules/@ionic/core/dist/esm/button-active-274abd17.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/button-active-274abd17.js ***!
  \*********************************************************************/
/*! exports provided: c */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return createButtonActiveGesture; });
/* harmony import */ var _index_29df6f59_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index-29df6f59.js */ "./node_modules/@ionic/core/dist/esm/index-29df6f59.js");
/* harmony import */ var _index_eea61379_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index-eea61379.js */ "./node_modules/@ionic/core/dist/esm/index-eea61379.js");
/* harmony import */ var _haptic_7b8ba70a_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./haptic-7b8ba70a.js */ "./node_modules/@ionic/core/dist/esm/haptic-7b8ba70a.js");




const createButtonActiveGesture = (el, isButton) => {
    let touchedButton;
    const activateButtonAtPoint = (x, y, hapticFeedbackFn) => {
        if (typeof document === 'undefined') {
            return;
        }
        const target = document.elementFromPoint(x, y);
        if (!target || !isButton(target)) {
            clearActiveButton();
            return;
        }
        if (target !== touchedButton) {
            clearActiveButton();
            setActiveButton(target, hapticFeedbackFn);
        }
    };
    const setActiveButton = (button, hapticFeedbackFn) => {
        touchedButton = button;
        const buttonToModify = touchedButton;
        Object(_index_29df6f59_js__WEBPACK_IMPORTED_MODULE_0__["w"])(() => buttonToModify.classList.add('ion-activated'));
        hapticFeedbackFn();
    };
    const clearActiveButton = (dispatchClick = false) => {
        if (!touchedButton) {
            return;
        }
        const buttonToModify = touchedButton;
        Object(_index_29df6f59_js__WEBPACK_IMPORTED_MODULE_0__["w"])(() => buttonToModify.classList.remove('ion-activated'));
        if (dispatchClick) {
            touchedButton.click();
        }
        touchedButton = undefined;
    };
    return Object(_index_eea61379_js__WEBPACK_IMPORTED_MODULE_1__["createGesture"])({
        el,
        gestureName: 'buttonActiveDrag',
        threshold: 0,
        onStart: ev => activateButtonAtPoint(ev.currentX, ev.currentY, _haptic_7b8ba70a_js__WEBPACK_IMPORTED_MODULE_2__["a"]),
        onMove: ev => activateButtonAtPoint(ev.currentX, ev.currentY, _haptic_7b8ba70a_js__WEBPACK_IMPORTED_MODULE_2__["b"]),
        onEnd: () => {
            clearActiveButton(true);
            Object(_haptic_7b8ba70a_js__WEBPACK_IMPORTED_MODULE_2__["h"])();
        }
    });
};




/***/ }),

/***/ "./node_modules/@ionic/core/dist/esm/framework-delegate-d1eb6504.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/framework-delegate-d1eb6504.js ***!
  \**************************************************************************/
/*! exports provided: a, d */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return attachComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return detachComponent; });
const attachComponent = async (delegate, container, component, cssClasses, componentProps) => {
    if (delegate) {
        return delegate.attachViewToDom(container, component, componentProps, cssClasses);
    }
    if (typeof component !== 'string' && !(component instanceof HTMLElement)) {
        throw new Error('framework delegate is missing');
    }
    const el = (typeof component === 'string')
        ? container.ownerDocument && container.ownerDocument.createElement(component)
        : component;
    if (cssClasses) {
        cssClasses.forEach(c => el.classList.add(c));
    }
    if (componentProps) {
        Object.assign(el, componentProps);
    }
    container.appendChild(el);
    if (el.componentOnReady) {
        await el.componentOnReady();
    }
    return el;
};
const detachComponent = (delegate, element) => {
    if (element) {
        if (delegate) {
            const container = element.parentElement;
            return delegate.removeViewFromDom(container, element);
        }
        element.remove();
    }
    return Promise.resolve();
};




/***/ }),

/***/ "./node_modules/@ionic/core/dist/esm/haptic-7b8ba70a.js":
/*!**************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/haptic-7b8ba70a.js ***!
  \**************************************************************/
/*! exports provided: a, b, c, d, h */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return hapticSelectionStart; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return hapticSelectionChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return hapticSelection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return hapticImpact; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return hapticSelectionEnd; });
const HapticEngine = {
    getEngine() {
        const win = window;
        return (win.TapticEngine) || (win.Capacitor && win.Capacitor.isPluginAvailable('Haptics') && win.Capacitor.Plugins.Haptics);
    },
    available() {
        return !!this.getEngine();
    },
    isCordova() {
        return !!window.TapticEngine;
    },
    isCapacitor() {
        const win = window;
        return !!win.Capacitor;
    },
    impact(options) {
        const engine = this.getEngine();
        if (!engine) {
            return;
        }
        const style = this.isCapacitor() ? options.style.toUpperCase() : options.style;
        engine.impact({ style });
    },
    notification(options) {
        const engine = this.getEngine();
        if (!engine) {
            return;
        }
        const style = this.isCapacitor() ? options.style.toUpperCase() : options.style;
        engine.notification({ style });
    },
    selection() {
        this.impact({ style: 'light' });
    },
    selectionStart() {
        const engine = this.getEngine();
        if (!engine) {
            return;
        }
        if (this.isCapacitor()) {
            engine.selectionStart();
        }
        else {
            engine.gestureSelectionStart();
        }
    },
    selectionChanged() {
        const engine = this.getEngine();
        if (!engine) {
            return;
        }
        if (this.isCapacitor()) {
            engine.selectionChanged();
        }
        else {
            engine.gestureSelectionChanged();
        }
    },
    selectionEnd() {
        const engine = this.getEngine();
        if (!engine) {
            return;
        }
        if (this.isCapacitor()) {
            engine.selectionEnd();
        }
        else {
            engine.gestureSelectionEnd();
        }
    }
};
/**
 * Trigger a selection changed haptic event. Good for one-time events
 * (not for gestures)
 */
const hapticSelection = () => {
    HapticEngine.selection();
};
/**
 * Tell the haptic engine that a gesture for a selection change is starting.
 */
const hapticSelectionStart = () => {
    HapticEngine.selectionStart();
};
/**
 * Tell the haptic engine that a selection changed during a gesture.
 */
const hapticSelectionChanged = () => {
    HapticEngine.selectionChanged();
};
/**
 * Tell the haptic engine we are done with a gesture. This needs to be
 * called lest resources are not properly recycled.
 */
const hapticSelectionEnd = () => {
    HapticEngine.selectionEnd();
};
/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
 */
const hapticImpact = (options) => {
    HapticEngine.impact(options);
};




/***/ }),

/***/ "./node_modules/@ionic/core/dist/esm/spinner-configs-c78e170e.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/spinner-configs-c78e170e.js ***!
  \***********************************************************************/
/*! exports provided: S */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "S", function() { return SPINNERS; });
const spinners = {
    'bubbles': {
        dur: 1000,
        circles: 9,
        fn: (dur, index, total) => {
            const animationDelay = `${(dur * index / total) - dur}ms`;
            const angle = 2 * Math.PI * index / total;
            return {
                r: 5,
                style: {
                    'top': `${9 * Math.sin(angle)}px`,
                    'left': `${9 * Math.cos(angle)}px`,
                    'animation-delay': animationDelay,
                }
            };
        }
    },
    'circles': {
        dur: 1000,
        circles: 8,
        fn: (dur, index, total) => {
            const step = index / total;
            const animationDelay = `${(dur * step) - dur}ms`;
            const angle = 2 * Math.PI * step;
            return {
                r: 5,
                style: {
                    'top': `${9 * Math.sin(angle)}px`,
                    'left': `${9 * Math.cos(angle)}px`,
                    'animation-delay': animationDelay,
                }
            };
        }
    },
    'circular': {
        dur: 1400,
        elmDuration: true,
        circles: 1,
        fn: () => {
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
        fn: () => {
            return {
                r: 26,
                style: {}
            };
        }
    },
    'dots': {
        dur: 750,
        circles: 3,
        fn: (_, index) => {
            const animationDelay = -(110 * index) + 'ms';
            return {
                r: 6,
                style: {
                    'left': `${9 - (9 * index)}px`,
                    'animation-delay': animationDelay,
                }
            };
        }
    },
    'lines': {
        dur: 1000,
        lines: 12,
        fn: (dur, index, total) => {
            const transform = `rotate(${30 * index + (index < 6 ? 180 : -180)}deg)`;
            const animationDelay = `${(dur * index / total) - dur}ms`;
            return {
                y1: 17,
                y2: 29,
                style: {
                    'transform': transform,
                    'animation-delay': animationDelay,
                }
            };
        }
    },
    'lines-small': {
        dur: 1000,
        lines: 12,
        fn: (dur, index, total) => {
            const transform = `rotate(${30 * index + (index < 6 ? 180 : -180)}deg)`;
            const animationDelay = `${(dur * index / total) - dur}ms`;
            return {
                y1: 12,
                y2: 20,
                style: {
                    'transform': transform,
                    'animation-delay': animationDelay,
                }
            };
        }
    }
};
const SPINNERS = spinners;




/***/ }),

/***/ "./node_modules/@ionic/core/dist/esm/theme-3f0b0c04.js":
/*!*************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/theme-3f0b0c04.js ***!
  \*************************************************************/
/*! exports provided: c, g, h, o */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return createColorClasses; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return getClassMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return hostContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return openURL; });
const hostContext = (selector, el) => {
    return el.closest(selector) !== null;
};
/**
 * Create the mode and color classes for the component based on the classes passed in
 */
const createColorClasses = (color) => {
    return (typeof color === 'string' && color.length > 0) ? {
        'ion-color': true,
        [`ion-color-${color}`]: true
    } : undefined;
};
const getClassList = (classes) => {
    if (classes !== undefined) {
        const array = Array.isArray(classes) ? classes : classes.split(' ');
        return array
            .filter(c => c != null)
            .map(c => c.trim())
            .filter(c => c !== '');
    }
    return [];
};
const getClassMap = (classes) => {
    const map = {};
    getClassList(classes).forEach(c => map[c] = true);
    return map;
};
const SCHEME = /^[a-z][a-z0-9+\-.]*:/;
const openURL = async (url, ev, direction, animation) => {
    if (url != null && url[0] !== '#' && !SCHEME.test(url)) {
        const router = document.querySelector('ion-router');
        if (router) {
            if (ev != null) {
                ev.preventDefault();
            }
            return router.push(url, direction, animation);
        }
    }
    return false;
};




/***/ }),

/***/ "./src/app/directives/custom.directive.ts":
/*!************************************************!*\
  !*** ./src/app/directives/custom.directive.ts ***!
  \************************************************/
/*! exports provided: HasPermissionsDirective, ValueChangeDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HasPermissionsDirective", function() { return HasPermissionsDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValueChangeDirective", function() { return ValueChangeDirective; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_session_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/session.service */ "./src/app/services/session.service.ts");



let HasPermissionsDirective = class HasPermissionsDirective {
    constructor(session, templateRef, viewContainer) {
        this.session = session;
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
    }
    ngOnInit() {
        if (this.hasPermissions(this.permissions)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
        else {
            this.viewContainer.clear();
        }
    }
    hasPermissions(permissions) {
        for (const permission of permissions) {
            if (!this.session.getPermissions() || !this.session.getPermissions().includes(permission)) {
                return false;
            }
        }
        return true;
    }
};
HasPermissionsDirective.ctorParameters = () => [
    { type: _services_session_service__WEBPACK_IMPORTED_MODULE_2__["SessionService"] },
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"] },
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"] }
];
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])('hasPermissions')
], HasPermissionsDirective.prototype, "permissions", void 0);
HasPermissionsDirective = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Directive"])({ selector: '[hasPermissions]' })
], HasPermissionsDirective);

let ValueChangeDirective = class ValueChangeDirective {
    constructor(viewContainer, templateRef) {
        this.viewContainer = viewContainer;
        this.templateRef = templateRef;
        this.hasView = false;
    }
    set valueChange(val) {
        if (!this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        }
        else if (val !== this.currentValue) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.currentValue = val;
        }
    }
};
ValueChangeDirective.ctorParameters = () => [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"] },
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"] }
];
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()
], ValueChangeDirective.prototype, "valueChange", null);
ValueChangeDirective = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Directive"])({ selector: '[valueChange]' })
], ValueChangeDirective);



/***/ }),

/***/ "./src/app/directives/shared-directives/shared-directives.module.ts":
/*!**************************************************************************!*\
  !*** ./src/app/directives/shared-directives/shared-directives.module.ts ***!
  \**************************************************************************/
/*! exports provided: SharedDirectivesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedDirectivesModule", function() { return SharedDirectivesModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _custom_directive__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../custom.directive */ "./src/app/directives/custom.directive.ts");




let SharedDirectivesModule = class SharedDirectivesModule {
};
SharedDirectivesModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [_custom_directive__WEBPACK_IMPORTED_MODULE_3__["HasPermissionsDirective"], _custom_directive__WEBPACK_IMPORTED_MODULE_3__["ValueChangeDirective"]],
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]
        ],
        exports: [_custom_directive__WEBPACK_IMPORTED_MODULE_3__["HasPermissionsDirective"], _custom_directive__WEBPACK_IMPORTED_MODULE_3__["ValueChangeDirective"]]
    })
], SharedDirectivesModule);



/***/ }),

/***/ "./src/app/services/firebase.service.ts":
/*!**********************************************!*\
  !*** ./src/app/services/firebase.service.ts ***!
  \**********************************************/
/*! exports provided: FirebaseService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FirebaseService", function() { return FirebaseService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_fire_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/fire/firestore */ "./node_modules/@angular/fire/__ivy_ngcc__/fesm2015/angular-fire-firestore.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");




let FirebaseService = class FirebaseService {
    constructor(firestore) {
        this.firestore = firestore;
        this.userCollectionName = "users";
        this.vitalCollectionName = "vitals";
        this.commentCollectionName = "comments";
        this.userDb = this.firestore.collection(this.userCollectionName);
        this.vitalDb = this.firestore.collection(this.vitalCollectionName);
        this.commentDb = this.firestore.collection(this.commentCollectionName);
    }
    createUser(record) {
        return this.userDb.add(record);
    }
    fetchUserbyNo(mobileNo) {
        let query = this.firestore.collection(this.userCollectionName, ref => ref.where("mobileNumber", '==', mobileNo));
        return this.fetchUserbyField(query);
    }
    fetchUserbyField(query) {
        return new Promise((resolve, reject) => {
            try {
                this.fetchUserbyNoSub = query.get().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(snapshot => {
                    return snapshot.docs.map(a => {
                        const data = a.data();
                        const id = a.id;
                        const ref = a.ref;
                        return { id, ref, data };
                    });
                })).subscribe((users) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                    resolve(users);
                    if (this.fetchUserbyNoSub && !this.fetchUserbyNoSub.closed) {
                        this.fetchUserbyNoSub.unsubscribe();
                    }
                }));
            }
            catch (e) {
                reject(e);
            }
        });
    }
    fetchUsers() {
        return this.userDb.snapshotChanges().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(snapshot => {
            return snapshot.map(a => {
                // const data: ItemData = a.payload.doc.data() as ItemData;
                // const id = a.payload.doc.id;
                // const ref = a.payload.doc.ref;  
                // return {id,ref,data};
                const id = a.payload.doc.id;
                const isEdit = false;
                const firstName = a.payload.doc.data()['firstName'];
                const lastName = a.payload.doc.data()['lastName'];
                const age = a.payload.doc.data()['age'];
                return { id, isEdit, firstName, lastName, age };
            });
        }));
    }
    updateUser(recordID, record) {
        return this.firestore.doc(this.userCollectionName + '/' + recordID).update(record);
    }
    deleteUser(recordID) {
        return this.firestore.doc(this.userCollectionName + '/' + recordID).delete();
    }
};
FirebaseService.ctorParameters = () => [
    { type: _angular_fire_firestore__WEBPACK_IMPORTED_MODULE_2__["AngularFirestore"] }
];
FirebaseService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], FirebaseService);



/***/ })

}]);
//# sourceMappingURL=common-es2015.js.map