(globalThis["webpackChunk_ugandaemr_openmrs_esm_laboratory_app"] = globalThis["webpackChunk_ugandaemr_openmrs_esm_laboratory_app"] || []).push([["src_index_ts-webpack_sharing_consume_default_openmrs_esm-framework_src_internal_openmrs_esm-f-d0ff54"],{

/***/ "./src/components/create-dashboard-link.component.tsx":
/*!************************************************************!*\
  !*** ./src/components/create-dashboard-link.component.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHomeDashboardLink: () => (/* binding */ createHomeDashboardLink)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "webpack/sharing/consume/default/react-router-dom/react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);



function DashboardExtension(param) {
    var dashboardLinkConfig = param.dashboardLinkConfig;
    var name = dashboardLinkConfig.name, title = dashboardLinkConfig.title;
    var location = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useLocation)();
    var spaBasePath = "".concat(window.spaBase, "/home");
    var navLink = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        var pathArray = location.pathname.split("/home");
        var lastElement = pathArray[pathArray.length - 1];
        return decodeURIComponent(lastElement);
    }, [
        location.pathname
    ]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.ConfigurableLink, {
        to: "".concat(spaBasePath, "/").concat(name),
        className: "cds--side-nav__link ".concat(navLink.match(name) && "active-left-nav-link")
    }, title);
}
var createHomeDashboardLink = function(dashboardLinkConfig) {
    return function() {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.BrowserRouter, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(DashboardExtension, {
            dashboardLinkConfig: dashboardLinkConfig
        }));
    };
};


/***/ }),

/***/ "./src/config-schema.ts":
/*!******************************!*\
  !*** ./src/config-schema.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   configSchema: () => (/* binding */ configSchema)
/* harmony export */ });
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__);

var configSchema = {
    laboratoryQueueConcept: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.String,
        _default: "1836ac8a-a855-4c7e-b2ba-a290233c67b7",
        _description: "Concept uuid for the laboratory queue."
    },
    laboratoryLocationTag: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.String,
        _default: "Laboratory",
        _description: "Location tag for laboratory locations."
    }
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   importTranslation: () => (/* binding */ importTranslation),
/* harmony export */   laboratoryComponent: () => (/* binding */ laboratoryComponent),
/* harmony export */   laboratoryDashboardLink: () => (/* binding */ laboratoryDashboardLink),
/* harmony export */   laboratoryOrderComponent: () => (/* binding */ laboratoryOrderComponent),
/* harmony export */   laboratoryOrderDashboardLink: () => (/* binding */ laboratoryOrderDashboardLink),
/* harmony export */   root: () => (/* binding */ root),
/* harmony export */   startupApp: () => (/* binding */ startupApp)
/* harmony export */ });
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_schema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config-schema */ "./src/config-schema.ts");
/* harmony import */ var _components_create_dashboard_link_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/create-dashboard-link.component */ "./src/components/create-dashboard-link.component.tsx");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "./node_modules/@openmrs/esm-patient-common-lib/src/index.ts");




var moduleName = "@ugandaemr/esm-laboratory-app";
var options = {
    featureName: "ugandaemr-laboratory",
    moduleName: moduleName
};
var importTranslation = __webpack_require__("./translations lazy .json$");
var root = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("src_laboratory_component_tsx"), __webpack_require__.e("src_root_component_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./root.component */ "./src/root.component.tsx"));
}, options);
var laboratoryDashboardLink = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)((0,_components_create_dashboard_link_component__WEBPACK_IMPORTED_MODULE_2__.createHomeDashboardLink)({
    name: "laboratory",
    slot: "laboratory-dashboard-slot",
    title: "Laboratory"
}), options);
var laboratoryComponent = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return __webpack_require__.e(/*! import() */ "src_laboratory_component_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./laboratory.component */ "./src/laboratory.component.tsx"));
}, options);
// Patient chart
var laboratoryOrderDashboardLink = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)((0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__.createDashboardLink)({
    path: "laboratory-orders",
    title: "Laboratory",
    moduleName: moduleName
}), options);
var laboratoryOrderComponent = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_rxjs__esm5_internal_operators_map_js"), __webpack_require__.e("vendors-node_modules_ohri_openmrs-esm-ohri-commons-lib_src_index_ts-node_modules_moment_local-7713c9"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-src_patient-chart_laboratory-order_component_tsx-w-87a496")]).then(__webpack_require__.bind(__webpack_require__, /*! ./patient-chart/laboratory-order.component */ "./src/patient-chart/laboratory-order.component.tsx"));
}, options);
function startupApp() {
    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.defineConfigSchema)(moduleName, _config_schema__WEBPACK_IMPORTED_MODULE_1__.configSchema);
}


/***/ }),

/***/ "./translations lazy .json$":
/*!************************************************!*\
  !*** ./translations/ lazy nonrecursive .json$ ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./en.json": [
		"./translations/en.json",
		"translations_en_json"
	],
	"./es.json": [
		"./translations/es.json",
		"translations_es_json"
	],
	"./fr.json": [
		"./translations/fr.json",
		"translations_fr_json"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = "./translations lazy .json$";
module.exports = webpackAsyncContext;

/***/ })

}]);
//# sourceMappingURL=src_index_ts-webpack_sharing_consume_default_openmrs_esm-framework_src_internal_openmrs_esm-f-d0ff54.js.map