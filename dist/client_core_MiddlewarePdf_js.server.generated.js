"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "client_core_MiddlewarePdf_js";
exports.ids = ["client_core_MiddlewarePdf_js"];
exports.modules = {

/***/ "./client/core/MiddlewarePdf.js":
/*!**************************************!*\
  !*** ./client/core/MiddlewarePdf.js ***!
  \**************************************/
/***/ ((module, exports, __webpack_require__) => {

eval("/* module decorator */ module = __webpack_require__.nmd(module);\n\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\nvar _material = __webpack_require__(/*! @mui/material */ \"@mui/material\");\nvar _styles = __webpack_require__(/*! @mui/material/styles */ \"@mui/material/styles\");\nvar _VisorPdfFinal = _interopRequireDefault(__webpack_require__(/*! ./VisorPdfFinal */ \"./client/core/VisorPdfFinal.js\"));\nvar _ConfigPdf = __webpack_require__(/*! ../../config/ConfigPdf */ \"./config/ConfigPdf.js\");\nvar _reactRouter = __webpack_require__(/*! react-router */ \"react-router\");\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\nconst Item = (0, _styles.styled)(_material.Paper)(({\n  theme\n}) => ({\n  backgroundColor: theme.palette.mode === \"dark\" ? \"#1A2027\" : \"#fff\",\n  ...theme.typography.body2,\n  padding: theme.spacing(1),\n  textAlign: \"center\",\n  color: theme.palette.text.secondary\n}));\nfunction VisorPdfMiddleware() {\n  const location = (0, _reactRouter.useLocation)();\n  const idArch = location.state.ptr;\n  const pdfResult = _ConfigPdf.archivoPdf.find(pdf => pdf.id == idArch);\n  return /*#__PURE__*/_react.default.createElement(_material.Grid, {\n    item: true,\n    md: 12,\n    sx: {\n      paddingTop: \"88px\",\n      alignItems: \"center\",\n      justifyContent: \"center\",\n      margin: \"auto\",\n      maxWidth: \"70%\"\n    }\n  }, /*#__PURE__*/_react.default.createElement(Item, null, /*#__PURE__*/_react.default.createElement(_material.Typography, {\n    variant: \"h3\",\n    gutterBottom: true,\n    sx: {\n      color: \"blue\"\n    }\n  }, pdfResult.titulo)), /*#__PURE__*/_react.default.createElement(_material.Card, null, /*#__PURE__*/_react.default.createElement(_material.CardContent, {\n    style: {\n      height: \"920px\"\n    }\n  }, /*#__PURE__*/_react.default.createElement(_VisorPdfFinal.default, {\n    ArchivoUrl: pdfResult.archivo\n  }))));\n}\n__signature__(VisorPdfMiddleware, \"useLocation{location}\", () => [_reactRouter.useLocation]);\nconst _default = VisorPdfMiddleware;\nvar _default2 = exports[\"default\"] = _default;\n;\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n  if (!reactHotLoader) {\n    return;\n  }\n  reactHotLoader.register(Item, \"Item\", \"C:\\\\clc\\\\AppNew\\\\client\\\\core\\\\MiddlewarePdf.js\");\n  reactHotLoader.register(VisorPdfMiddleware, \"VisorPdfMiddleware\", \"C:\\\\clc\\\\AppNew\\\\client\\\\core\\\\MiddlewarePdf.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\clc\\\\AppNew\\\\client\\\\core\\\\MiddlewarePdf.js\");\n})();\n;\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://setup/./client/core/MiddlewarePdf.js?");

/***/ })

};
;