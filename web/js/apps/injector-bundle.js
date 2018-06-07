/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/web/js/apps";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./web/js/apps/injector.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./web/js/Electron.js":
/*!****************************!*\
  !*** ./web/js/Electron.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports.Electron = class {\n\n    static isElectron() {\n        var userAgent = navigator.userAgent.toLowerCase();\n        return userAgent.indexOf(' electron/') !== -1;\n    }\n\n};\n\n\n//# sourceURL=webpack:///./web/js/Electron.js?");

/***/ }),

/***/ "./web/js/Optional.js":
/*!****************************!*\
  !*** ./web/js/Optional.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// simple optional implementation so we don't need to resort to jquery\n\nclass Optional {\n\n    constructor(value) {\n        this.value = value;\n    }\n\n    map(fn) {\n        if (this.value !== undefined) {\n            return new Some(fn(this.value));\n        }\n        return None;\n    };\n\n    getOrElse(value) {\n        if (this.value !== undefined) {\n            return this.value;\n        }\n\n        return value;\n    };\n\n    static of(value) {\n        return new Optional(value);\n    };\n\n}\n\nvar None = new Optional();\n\nvar Some = function(value) {\n    if (typeof value !== undefined) {\n        return new Optional(value);\n    }\n    return None;\n};\n\nmodule.exports.Optional = Optional;\n\n\n//# sourceURL=webpack:///./web/js/Optional.js?");

/***/ }),

/***/ "./web/js/apps/injector.js":
/*!*********************************!*\
  !*** ./web/js/apps/injector.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// inject the right bundle depending on whether we're using chrome or electron.\n\nconst {Electron} = __webpack_require__(/*! ../Electron */ \"./web/js/Electron.js\");\nconst {injectScript} = __webpack_require__(/*! ../utils.js */ \"./web/js/utils.js\");\n\nif(Electron.isElectron()) {\n    console.log(\"Injecting electron bundle\");\n    injectScript(\"../../web/js/apps/electron-bundle.js\")\n} else {\n    console.log(\"Injecting chrome bundle\");\n    injectScript(\"../../web/js/apps/chrome-bundle.js\")\n}\n\n\n\n\n//# sourceURL=webpack:///./web/js/apps/injector.js?");

/***/ }),

/***/ "./web/js/utils.js":
/*!*************************!*\
  !*** ./web/js/utils.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {Optional} = __webpack_require__(/*! ./Optional */ \"./web/js/Optional.js\");\n\nmodule.exports.injectScript = function(src,type) {\n\n    let script = document.createElement('script');\n    script.src = src;\n\n    // loading async is ugly but we're going to move to webpack and clean this\n    // up eventually.\n    script.async = false;\n    script.defer = false;\n\n    if(type)\n        script.type = type;\n\n    return new Promise(function (resolve, reject) {\n\n        document.head.appendChild(script);\n\n        script.addEventListener('load', function() {\n            resolve();\n        });\n\n        script.addEventListener('error', function(err) {\n            reject(err);\n        });\n\n    });\n\n};\n\n/**\n * Apply a given function, with arguments, to a list of delegates which have\n * that function name defined.\n */\nmodule.exports.Delegator = class {\n\n    constructor(delegates) {\n        this.delegates = delegates;\n    }\n\n    /**\n     * Apply the given function to all the delegates.\n     */\n    apply(functionName) {\n\n        var args = Array.from(arguments);\n        args.splice(0,1);\n\n        this.delegates.forEach(function (delegate) {\n            var func = delegate[functionName];\n            func.apply(delegate, args);\n        });\n    }\n\n}\n\nmodule.exports.forDict = function(dict, callback) {\n\n    if(!dict) {\n        throw new Error(\"dict required\");\n    }\n\n    if(!callback) {\n        throw new Error(\"callback required\");\n    }\n\n    Object.keys(dict).forEach(function (key) {\n        let value = dict[key];\n        callback(key,value);\n    })\n}\n\n/**\n * Get the bounding box for a list of elements, not just one.  This would be\n * the minimum bounding box for all the elements.\n */\nmodule.exports.getBoundingClientRectFromElements = function(elements) {\n\n    var boundingClientRects = elements.map(Element.getBoundingClientRect);\n    return getBoundingClientRectFromBCRs(boundingClientRects);\n\n}\n\n/**\n * Get the bounding box from a list of BCRs.\n */\nmodule.exports.getBoundingClientRectFromBCRs = function(boundingClientRects) {\n\n    var left = boundingClientRects.map((brc) => brc.left).reduce((a,b) => Math.min(a,b));\n    var top = boundingClientRects.map((brc) => brc.top).reduce((a,b) => Math.min(a,b));\n    var bottom = boundingClientRects.map((brc) => brc.bottom).reduce((a,b) => Math.max(a,b));\n    var right = boundingClientRects.map((brc) => brc.right).reduce((a,b) => Math.max(a,b));\n\n    return {left, top, bottom, right};\n\n}\n\n/**\n * Go over the array-like object and return tuples with prev, curr, and next\n * properties so that we can peek at siblings easily.  If the prev and / or next\n * are not present these values are null.\n *\n */\nmodule.exports.createSiblingTuples = function(arr) {\n\n    let result = [];\n\n    for(var idx = 0; idx < arr.length; ++idx) {\n\n        result.push( {\n            curr: arr[idx],\n            prev: Optional.of(arr[idx-1]).getOrElse(null),\n            next: Optional.of(arr[idx+1]).getOrElse(null)\n        });\n\n    }\n\n    return result;\n\n}\n\n/**\n * @Deprecated use Elements.offset instead.\n */\nmodule.exports.elementOffset = function(element) {\n\n    let result = {\n        left: element.offsetLeft,\n        top: element.offsetTop,\n        width: element.offsetWidth,\n        height: element.offsetHeight\n    };\n\n    result.right = result.left + result.width;\n    result.bottom = result.top + result.height;\n\n    return result\n\n}\n\nmodule.exports.Elements = class {\n\n    static offset(element) {\n\n        let result = {\n            left: element.offsetLeft,\n            top: element.offsetTop,\n            width: element.offsetWidth,\n            height: element.offsetHeight\n        };\n\n        result.right = result.left + result.width;\n        result.bottom = result.top + result.height;\n\n        return result\n\n    }\n\n    /**\n     * Require that the element have the given classname.\n     */\n    static requireClass(element, clazz) {\n\n        var classValue = element.getAttribute(\"class\");\n\n        if( ! classValue || classValue.indexOf(clazz) === -1) {\n\n            // element isn't the proper class we're expecting.\n            throw new Error(\"Element does not have the proper class: \" + clazz)\n\n        }\n\n    }\n\n    static offsetRelative(element, parentElement) {\n\n        var offset = {left: 0, top: 0, bottom: 0, right: 0};\n\n        do {\n\n            if ( !isNaN( elem.offsetLeft ) ) {\n                offsetLeft += elem.offsetLeft;\n            }\n\n        } while(element = elem.offsetParent && element != parentElement);\n\n        return offsetLeft;\n\n    }\n\n    /**\n     * Keep searching parent notes until we find an element matching the selector,\n     * or return null when one was not found.\n     *\n     * @param selector\n     */\n    static untilRoot(element, selector) {\n\n        if (!element)\n            throw new Error(\"element required\");\n\n        if (!selector)\n            throw new Error(\"selector required\");\n\n        if(element.matches(selector)) {\n            return element;\n        }\n\n        if (element.parentElement == null) {\n            // we have hit the root.\n            return null;\n        }\n\n        return this.untilRoot(element.parentElement, selector);\n\n    }\n\n}\n\n/**\n * Support the ability to calculate an offset relative to another element.\n */\nmodule.exports.OffsetCalculator = class {\n\n    // https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document\n    static calculate(element, rootElement) {\n\n        var offset = {left: 0, top: 0, width: 0, height: 0};\n\n        while(true) {\n\n            if(element == null)\n                break;\n\n            // FIXME: log the full offsets of EACH element...\n\n            offset.left += this._toInt(element.offsetLeft)\n            offset.top += this._toInt(element.offsetTop)\n            // offset.width += OffsetCalculator._toInt(element.offsetWidth)\n            // offset.height += OffsetCalculator._toInt(element.offsetHeight)\n            offset.width = this._toInt(element.offsetWidth)\n            offset.height = this._toInt(element.offsetHeight)\n\n            if(element === rootElement)\n                break;\n\n            element = element.offsetParent;\n\n        }\n\n        offset.right = offset.left + offset.width;\n        offset.bottom = offset.top + offset.height;\n\n        return offset;\n\n    }\n\n    static _toInt(value) {\n\n        if ( isNaN( value ) ) {\n            return 0;\n        }\n\n        return value;\n\n    }\n\n}\n\nmodule.exports.Styles = class {\n\n    static parseTransformScaleX(transform) {\n\n        var result = transform;\n\n        if( ! result)\n            return null;\n\n        result = result.replace(\"scaleX(\", \"\");\n        result = result.replace(\")\", \"\");\n\n        return parseFloat(result);\n\n    }\n\n    /**\n     * Take a string of '50px' and return a number of just the pixel count.\n     */\n    static parsePixels(value) {\n\n        value = value.replace(\"px\", \"\");\n        return parseInt(value);\n\n    }\n\n}\n\nmodule.exports.Objects = class {\n\n    static duplicate(obj) {\n          return JSON.parse(JSON.stringify(obj));\n    }\n\n}\n\n\n\n//# sourceURL=webpack:///./web/js/utils.js?");

/***/ })

/******/ });