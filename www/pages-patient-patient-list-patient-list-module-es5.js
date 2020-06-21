function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-patient-patient-list-patient-list-module"], {
  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/patient/patient-list/patient-list.page.html":
  /*!*********************************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/patient/patient-list/patient-list.page.html ***!
    \*********************************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppPagesPatientPatientListPatientListPageHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<ion-header>\r\n    <ion-toolbar>\r\n      <ion-title>PatientList</ion-title>\r\n    </ion-toolbar>\r\n  </ion-header>\r\n  \r\n  <ion-content>\r\n    <ion-card (click)=\"getDetailsPage()\"  *ngFor=\"let patientDetail of patientDetails\">\r\n      <ion-item>\r\n        <ion-avatar slot=\"start\">\r\n          <img src=\"https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y\">\r\n        </ion-avatar>\r\n        <ion-label> {{patientDetail.firstName}} - {{patientDetail.lastName}}\r\n        </ion-label>\r\n      </ion-item>  \r\n      <ion-card-content>\r\n        {{patientDetail.aadharNo}}\r\n      </ion-card-content>\r\n    </ion-card>\r\n  </ion-content>";
    /***/
  },

  /***/
  "./src/app/pages/patient/patient-list/patient-list-routing.module.ts":
  /*!***************************************************************************!*\
    !*** ./src/app/pages/patient/patient-list/patient-list-routing.module.ts ***!
    \***************************************************************************/

  /*! exports provided: PatientListPageRoutingModule */

  /***/
  function srcAppPagesPatientPatientListPatientListRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PatientListPageRoutingModule", function () {
      return PatientListPageRoutingModule;
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


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _patient_list_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./patient-list.page */
    "./src/app/pages/patient/patient-list/patient-list.page.ts");

    var routes = [{
      path: '',
      component: _patient_list_page__WEBPACK_IMPORTED_MODULE_3__["PatientListPage"]
    }];

    var PatientListPageRoutingModule = function PatientListPageRoutingModule() {
      _classCallCheck(this, PatientListPageRoutingModule);
    };

    PatientListPageRoutingModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
      exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })], PatientListPageRoutingModule);
    /***/
  },

  /***/
  "./src/app/pages/patient/patient-list/patient-list.module.ts":
  /*!*******************************************************************!*\
    !*** ./src/app/pages/patient/patient-list/patient-list.module.ts ***!
    \*******************************************************************/

  /*! exports provided: PatientListPageModule */

  /***/
  function srcAppPagesPatientPatientListPatientListModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PatientListPageModule", function () {
      return PatientListPageModule;
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


    var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
    /* harmony import */


    var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @ionic/angular */
    "./node_modules/@ionic/angular/__ivy_ngcc__/fesm2015/ionic-angular.js");
    /* harmony import */


    var _patient_list_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./patient-list-routing.module */
    "./src/app/pages/patient/patient-list/patient-list-routing.module.ts");
    /* harmony import */


    var _patient_list_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./patient-list.page */
    "./src/app/pages/patient/patient-list/patient-list.page.ts");

    var PatientListPageModule = function PatientListPageModule() {
      _classCallCheck(this, PatientListPageModule);
    };

    PatientListPageModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"], _patient_list_routing_module__WEBPACK_IMPORTED_MODULE_5__["PatientListPageRoutingModule"]],
      declarations: [_patient_list_page__WEBPACK_IMPORTED_MODULE_6__["PatientListPage"]]
    })], PatientListPageModule);
    /***/
  },

  /***/
  "./src/app/pages/patient/patient-list/patient-list.page.scss":
  /*!*******************************************************************!*\
    !*** ./src/app/pages/patient/patient-list/patient-list.page.scss ***!
    \*******************************************************************/

  /*! exports provided: default */

  /***/
  function srcAppPagesPatientPatientListPatientListPageScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3BhdGllbnQvcGF0aWVudC1saXN0L3BhdGllbnQtbGlzdC5wYWdlLnNjc3MifQ== */";
    /***/
  },

  /***/
  "./src/app/pages/patient/patient-list/patient-list.page.ts":
  /*!*****************************************************************!*\
    !*** ./src/app/pages/patient/patient-list/patient-list.page.ts ***!
    \*****************************************************************/

  /*! exports provided: PatientListPage */

  /***/
  function srcAppPagesPatientPatientListPatientListPageTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PatientListPage", function () {
      return PatientListPage;
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


    var _services_node_js_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ../../../services/node-js.service */
    "./src/app/services/node-js.service.ts");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");

    var PatientListPage = /*#__PURE__*/function () {
      function PatientListPage(router) {
        _classCallCheck(this, PatientListPage);

        this.router = router;
        this.nodeJSService = new _services_node_js_service__WEBPACK_IMPORTED_MODULE_2__["NodeJSService"]();
        this.patientDetails = this.nodeJSService.getPatientsList();
      }

      _createClass(PatientListPage, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }, {
        key: "getDetailsPage",
        value: function getDetailsPage() {
          console.log("Get Patient Details Page");
          this.router.navigate(['/patient-details']);
        }
      }]);

      return PatientListPage;
    }();

    PatientListPage.ctorParameters = function () {
      return [{
        type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]
      }];
    };

    PatientListPage = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-patient-list',
      template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! raw-loader!./patient-list.page.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/patient/patient-list/patient-list.page.html"))["default"],
      styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! ./patient-list.page.scss */
      "./src/app/pages/patient/patient-list/patient-list.page.scss"))["default"]]
    })], PatientListPage);
    /***/
  }
}]);
//# sourceMappingURL=pages-patient-patient-list-patient-list-module-es5.js.map