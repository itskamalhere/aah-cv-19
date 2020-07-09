(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-home-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/home/home.page.html":
/*!***************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/home/home.page.html ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-tabs>\r\n\r\n  <ion-tab-bar slot=\"bottom\">\r\n    <ion-tab-button tab=\"tab1\">      \r\n      <ion-icon name=\"medical\"></ion-icon>\r\n      <ion-label>AAH</ion-label>\r\n    </ion-tab-button>\r\n\r\n    <ion-tab-button *hasPermissions=\"['patient-list']\" tab=\"patient-list\">\r\n      <!-- <ion-icon name=\"body\"></ion-icon> -->\r\n      <ion-icon name=\"people-circle\"></ion-icon> \r\n      <ion-label>Patients</ion-label>\r\n    </ion-tab-button>\r\n\r\n    <ion-tab-button *hasPermissions=\"['patient-detail']\" tab=\"patient-details\">\r\n      <ion-icon name=\"body\"></ion-icon>\r\n      <ion-label>Details</ion-label>\r\n    </ion-tab-button>\r\n\r\n    <ion-tab-button *hasPermissions=\"['notifications']\" tab=\"tab4\">\r\n      <ion-icon name=\"notifications\"></ion-icon>\r\n      <ion-label>Notifications</ion-label>\r\n    </ion-tab-button>\r\n\r\n    <ion-tab-button *hasPermissions=\"['notifications']\" tab=\"tab5\">\r\n      <ion-icon name=\"people\"></ion-icon>\r\n      <ion-label>Staff</ion-label>\r\n    </ion-tab-button>\r\n\r\n  </ion-tab-bar>\r\n\r\n</ion-tabs>");

/***/ }),

/***/ "./src/app/home/home-routing.module.ts":
/*!*********************************************!*\
  !*** ./src/app/home/home-routing.module.ts ***!
  \*********************************************/
/*! exports provided: HomePageRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePageRoutingModule", function() { return HomePageRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _home_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./home.page */ "./src/app/home/home.page.ts");




const routes = [
    {
        path: '',
        component: _home_page__WEBPACK_IMPORTED_MODULE_3__["HomePage"],
        children: [
            {
                path: 'tab1',
                children: [
                    {
                        path: '',
                        loadChildren: () => Promise.all(/*! import() | patient-list-patient-list-module */[__webpack_require__.e("common"), __webpack_require__.e("patient-list-patient-list-module")]).then(__webpack_require__.bind(null, /*! ../patient-list/patient-list.module */ "./src/app/patient-list/patient-list.module.ts")).then(m => m.PatientListPageModule)
                    }
                ]
            },
            {
                path: 'patient-list',
                children: [
                    {
                        path: '',
                        loadChildren: () => Promise.all(/*! import() | patient-list-patient-list-module */[__webpack_require__.e("common"), __webpack_require__.e("patient-list-patient-list-module")]).then(__webpack_require__.bind(null, /*! ../patient-list/patient-list.module */ "./src/app/patient-list/patient-list.module.ts")).then(m => m.PatientListPageModule)
                    }
                ]
            },
            {
                path: 'patient-details',
                children: [
                    {
                        path: '',
                        loadChildren: () => __webpack_require__.e(/*! import() | patient-details-patient-details-module */ "patient-details-patient-details-module").then(__webpack_require__.bind(null, /*! ../patient-details/patient-details.module */ "./src/app/patient-details/patient-details.module.ts")).then(m => m.PatientDetailsPageModule)
                    }
                ]
            },
            {
                path: 'tab4',
                children: [
                    {
                        path: '',
                        loadChildren: () => Promise.all(/*! import() | patient-list-patient-list-module */[__webpack_require__.e("common"), __webpack_require__.e("patient-list-patient-list-module")]).then(__webpack_require__.bind(null, /*! ../patient-list/patient-list.module */ "./src/app/patient-list/patient-list.module.ts")).then(m => m.PatientListPageModule)
                    }
                ]
            },
            {
                path: 'tab5',
                children: [
                    {
                        path: '',
                        loadChildren: () => Promise.all(/*! import() | patient-list-patient-list-module */[__webpack_require__.e("common"), __webpack_require__.e("patient-list-patient-list-module")]).then(__webpack_require__.bind(null, /*! ../patient-list/patient-list.module */ "./src/app/patient-list/patient-list.module.ts")).then(m => m.PatientListPageModule)
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full'
            }
        ]
    }
];
let HomePageRoutingModule = class HomePageRoutingModule {
};
HomePageRoutingModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], HomePageRoutingModule);



/***/ }),

/***/ "./src/app/home/home.module.ts":
/*!*************************************!*\
  !*** ./src/app/home/home.module.ts ***!
  \*************************************/
/*! exports provided: HomePageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePageModule", function() { return HomePageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/__ivy_ngcc__/fesm2015/ionic-angular.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _home_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./home.page */ "./src/app/home/home.page.ts");
/* harmony import */ var _directives_shared_directives_shared_directives_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../directives/shared-directives/shared-directives.module */ "./src/app/directives/shared-directives/shared-directives.module.ts");
/* harmony import */ var _home_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./home-routing.module */ "./src/app/home/home-routing.module.ts");








let HomePageModule = class HomePageModule {
};
HomePageModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonicModule"],
            _home_routing_module__WEBPACK_IMPORTED_MODULE_7__["HomePageRoutingModule"],
            _directives_shared_directives_shared_directives_module__WEBPACK_IMPORTED_MODULE_6__["SharedDirectivesModule"]
        ],
        declarations: [_home_page__WEBPACK_IMPORTED_MODULE_5__["HomePage"]]
    })
], HomePageModule);



/***/ }),

/***/ "./src/app/home/home.page.scss":
/*!*************************************!*\
  !*** ./src/app/home/home.page.scss ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("#container {\n  text-align: center;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50%;\n  transform: translateY(-50%);\n}\n\n#container strong {\n  font-size: 20px;\n  line-height: 26px;\n}\n\n#container p {\n  font-size: 16px;\n  line-height: 22px;\n  margin: 0;\n}\n\n#container a {\n  text-decoration: none;\n}\n\nion-content {\n  --ion-background-color: #8d4d9a;\n  --color: #ffffff;\n}\n\nion-toolbar {\n  --ion-background-color: #8d4d9a;\n  --color: #ffffff;\n}\n\n.icon-ctrl {\n  font-size: 80px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvaG9tZS9DOlxcaW9uaWNfcHJvamVjdHNcXGFhaC1jdi0xOS9zcmNcXGFwcFxcaG9tZVxcaG9tZS5wYWdlLnNjc3MiLCJzcmMvYXBwL2hvbWUvaG9tZS5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsT0FBQTtFQUNBLFFBQUE7RUFDQSxRQUFBO0VBQ0EsMkJBQUE7QUNDRjs7QURFQTtFQUNFLGVBQUE7RUFDQSxpQkFBQTtBQ0NGOztBREVBO0VBQ0UsZUFBQTtFQUNBLGlCQUFBO0VBQ0EsU0FBQTtBQ0NGOztBREVBO0VBQ0UscUJBQUE7QUNDRjs7QURFQTtFQUNFLCtCQUFBO0VBQ0EsZ0JBQUE7QUNDRjs7QURFQTtFQUNFLCtCQUFBO0VBQ0EsZ0JBQUE7QUNDRjs7QURFQTtFQUNFLGVBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL2hvbWUvaG9tZS5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjY29udGFpbmVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICB0b3A6IDUwJTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xufVxuXG4jY29udGFpbmVyIHN0cm9uZyB7XG4gIGZvbnQtc2l6ZTogMjBweDtcbiAgbGluZS1oZWlnaHQ6IDI2cHg7XG59XG5cbiNjb250YWluZXIgcCB7ICBcbiAgZm9udC1zaXplOiAxNnB4O1xuICBsaW5lLWhlaWdodDogMjJweDtcbiAgbWFyZ2luOiAwO1xufVxuXG4jY29udGFpbmVyIGEge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG59XG5cbmlvbi1jb250ZW50IHtcbiAgLS1pb24tYmFja2dyb3VuZC1jb2xvcjogIzhkNGQ5YTtcbiAgLS1jb2xvcjogI2ZmZmZmZjtcbn1cblxuaW9uLXRvb2xiYXIge1xuICAtLWlvbi1iYWNrZ3JvdW5kLWNvbG9yOiAjOGQ0ZDlhO1xuICAtLWNvbG9yOiAjZmZmZmZmO1xufVxuXG4uaWNvbi1jdHJsIHtcbiAgZm9udC1zaXplOiA4MHB4O1xufSIsIiNjb250YWluZXIge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIHRvcDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XG59XG5cbiNjb250YWluZXIgc3Ryb25nIHtcbiAgZm9udC1zaXplOiAyMHB4O1xuICBsaW5lLWhlaWdodDogMjZweDtcbn1cblxuI2NvbnRhaW5lciBwIHtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBsaW5lLWhlaWdodDogMjJweDtcbiAgbWFyZ2luOiAwO1xufVxuXG4jY29udGFpbmVyIGEge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG59XG5cbmlvbi1jb250ZW50IHtcbiAgLS1pb24tYmFja2dyb3VuZC1jb2xvcjogIzhkNGQ5YTtcbiAgLS1jb2xvcjogI2ZmZmZmZjtcbn1cblxuaW9uLXRvb2xiYXIge1xuICAtLWlvbi1iYWNrZ3JvdW5kLWNvbG9yOiAjOGQ0ZDlhO1xuICAtLWNvbG9yOiAjZmZmZmZmO1xufVxuXG4uaWNvbi1jdHJsIHtcbiAgZm9udC1zaXplOiA4MHB4O1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/home/home.page.ts":
/*!***********************************!*\
  !*** ./src/app/home/home.page.ts ***!
  \***********************************/
/*! exports provided: HomePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePage", function() { return HomePage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _ionic_native_firebase_x_ngx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic-native/firebase-x/ngx */ "./node_modules/@ionic-native/firebase-x/__ivy_ngcc__/ngx/index.js");




let HomePage = class HomePage {
    constructor(router, firebase) {
        this.router = router;
        this.firebase = firebase;
    }
    ngOnInit() {
        this.firebase.onMessageReceived().subscribe((data) => {
            this.router.navigate(["/patient-details"]);
        });
    }
    ngAfterViewInit() {
        // document.addEventListener('ionBackButton', (ev: BackButtonEvent) => {
        //   ev.detail.register(-1, () => {
        //     App.exitApp();
        //   });
        // });
    }
    ngOnDestroy() { }
};
HomePage.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
    { type: _ionic_native_firebase_x_ngx__WEBPACK_IMPORTED_MODULE_3__["FirebaseX"] }
];
HomePage = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: "app-home",
        template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! raw-loader!./home.page.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/home/home.page.html")).default,
        styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! ./home.page.scss */ "./src/app/home/home.page.scss")).default]
    })
], HomePage);



/***/ })

}]);
//# sourceMappingURL=home-home-module-es2015.js.map