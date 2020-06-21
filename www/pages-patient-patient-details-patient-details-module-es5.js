function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-patient-patient-details-patient-details-module"], {
  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/patient/patient-details/patient-details.page.html":
  /*!***************************************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/patient/patient-details/patient-details.page.html ***!
    \***************************************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppPagesPatientPatientDetailsPatientDetailsPageHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<ion-header>\r\n    <ion-toolbar>\r\n        <ion-buttons slot=\"start\">\r\n            <ion-back-button></ion-back-button>\r\n        </ion-buttons>\r\n        <ion-title>PatientDetails</ion-title>\r\n    </ion-toolbar>\r\n  </ion-header>\r\n  \r\n  <ion-content>\r\n    <ion-card>\r\n        <ion-card-header>\r\n            {{patientDetails.firstName}} {{patientDetails.lastName}}\r\n        </ion-card-header>  \r\n        <ion-card-content>\r\n            {{patientDetails.aadharNo}}\r\n        </ion-card-content>\r\n    </ion-card>\r\n  </ion-content> ";
    /***/
  },

  /***/
  "./src/app/pages/patient/patient-details/patient-details-routing.module.ts":
  /*!*********************************************************************************!*\
    !*** ./src/app/pages/patient/patient-details/patient-details-routing.module.ts ***!
    \*********************************************************************************/

  /*! exports provided: PatientDetailsPageRoutingModule */

  /***/
  function srcAppPagesPatientPatientDetailsPatientDetailsRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PatientDetailsPageRoutingModule", function () {
      return PatientDetailsPageRoutingModule;
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


    var _patient_details_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./patient-details.page */
    "./src/app/pages/patient/patient-details/patient-details.page.ts");

    var routes = [{
      path: '',
      component: _patient_details_page__WEBPACK_IMPORTED_MODULE_3__["PatientDetailsPage"]
    }];

    var PatientDetailsPageRoutingModule = function PatientDetailsPageRoutingModule() {
      _classCallCheck(this, PatientDetailsPageRoutingModule);
    };

    PatientDetailsPageRoutingModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
      exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })], PatientDetailsPageRoutingModule);
    /***/
  },

  /***/
  "./src/app/pages/patient/patient-details/patient-details.module.ts":
  /*!*************************************************************************!*\
    !*** ./src/app/pages/patient/patient-details/patient-details.module.ts ***!
    \*************************************************************************/

  /*! exports provided: PatientDetailsPageModule */

  /***/
  function srcAppPagesPatientPatientDetailsPatientDetailsModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PatientDetailsPageModule", function () {
      return PatientDetailsPageModule;
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


    var _patient_details_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./patient-details-routing.module */
    "./src/app/pages/patient/patient-details/patient-details-routing.module.ts");
    /* harmony import */


    var _patient_details_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./patient-details.page */
    "./src/app/pages/patient/patient-details/patient-details.page.ts");

    var PatientDetailsPageModule = function PatientDetailsPageModule() {
      _classCallCheck(this, PatientDetailsPageModule);
    };

    PatientDetailsPageModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"], _patient_details_routing_module__WEBPACK_IMPORTED_MODULE_5__["PatientDetailsPageRoutingModule"]],
      declarations: [_patient_details_page__WEBPACK_IMPORTED_MODULE_6__["PatientDetailsPage"]]
    })], PatientDetailsPageModule);
    /***/
  },

  /***/
  "./src/app/pages/patient/patient-details/patient-details.page.scss":
  /*!*************************************************************************!*\
    !*** ./src/app/pages/patient/patient-details/patient-details.page.scss ***!
    \*************************************************************************/

  /*! exports provided: default */

  /***/
  function srcAppPagesPatientPatientDetailsPatientDetailsPageScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3BhdGllbnQvcGF0aWVudC1kZXRhaWxzL3BhdGllbnQtZGV0YWlscy5wYWdlLnNjc3MifQ== */";
    /***/
  },

  /***/
  "./src/app/pages/patient/patient-details/patient-details.page.ts":
  /*!***********************************************************************!*\
    !*** ./src/app/pages/patient/patient-details/patient-details.page.ts ***!
    \***********************************************************************/

  /*! exports provided: PatientDetailsPage */

  /***/
  function srcAppPagesPatientPatientDetailsPatientDetailsPageTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PatientDetailsPage", function () {
      return PatientDetailsPage;
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

    var PatientDetailsPage = /*#__PURE__*/function () {
      function PatientDetailsPage() {
        _classCallCheck(this, PatientDetailsPage);

        this.nodeJSService = new _services_node_js_service__WEBPACK_IMPORTED_MODULE_2__["NodeJSService"]();
        this.patientDetails = this.nodeJSService.getPatientDetails();
      }

      _createClass(PatientDetailsPage, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }]);

      return PatientDetailsPage;
    }();

    PatientDetailsPage = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-patient-details',
      template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! raw-loader!./patient-details.page.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/patient/patient-details/patient-details.page.html"))["default"],
      styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! ./patient-details.page.scss */
      "./src/app/pages/patient/patient-details/patient-details.page.scss"))["default"]]
    })], PatientDetailsPage);
    /***/
  }
}]);
//# sourceMappingURL=pages-patient-patient-details-patient-details-module-es5.js.map