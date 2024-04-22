"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "client_auth_SignOut_js";
exports.ids = ["client_auth_SignOut_js"];
exports.modules = {

/***/ "./client/auth/SignOut.js":
/*!********************************!*\
  !*** ./client/auth/SignOut.js ***!
  \********************************/
/***/ ((module, exports, __webpack_require__) => {

eval("/* module decorator */ module = __webpack_require__.nmd(module);\n\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports[\"default\"] = void 0;\nvar _react = _interopRequireWildcard(__webpack_require__(/*! react */ \"react\"));\nvar _reactRouterDom = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\nvar _authHelper = _interopRequireDefault(__webpack_require__(/*! ./../auth/auth-helper */ \"./client/auth/auth-helper.js\"));\nvar _AuthProvider = __webpack_require__(/*! ./../core/AuthProvider */ \"./client/core/AuthProvider.js\");\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\nfunction _getRequireWildcardCache(e) { if (\"function\" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }\nfunction _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || \"object\" != typeof e && \"function\" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if (\"default\" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\nconst SalidaUsr = () => {\n  const navigate = (0, _reactRouterDom.useNavigate)();\n  const {\n    isAuthenticated,\n    setIsAuthenticated,\n    isJwtRol,\n    setIsJwtRol\n  } = (0, _react.useContext)(_AuthProvider.AuthContext);\n  _authHelper.default.clearJWT();\n  (0, _react.useEffect)(() => {\n    setIsAuthenticated(false);\n    setIsJwtRol(false);\n    navigate(\"/\");\n  }, [isAuthenticated]);\n  return /*#__PURE__*/_react.default.createElement(\"div\", null, /*#__PURE__*/_react.default.createElement(\"h1\", null, \"Saliendo del usuario\"), /*#__PURE__*/_react.default.createElement(\"button\", null, \" Aqui \"));\n};\n__signature__(SalidaUsr, \"useNavigate{navigate}\\nuseContext{{ isAuthenticated, setIsAuthenticated, isJwtRol, setIsJwtRol }}\\nuseEffect{}\", () => [_reactRouterDom.useNavigate]);\nconst _default = SalidaUsr;\nvar _default2 = exports[\"default\"] = _default;\n;\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n  if (!reactHotLoader) {\n    return;\n  }\n  reactHotLoader.register(SalidaUsr, \"SalidaUsr\", \"C:\\\\clc\\\\AppNew\\\\client\\\\auth\\\\SignOut.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\clc\\\\AppNew\\\\client\\\\auth\\\\SignOut.js\");\n})();\n;\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://setup/./client/auth/SignOut.js?");

/***/ })

};
;