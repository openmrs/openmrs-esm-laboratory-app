var _ugandaemr_esm_laboratory_app;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../node_modules/ansi-html-community/index.js":
/*!*******************************************************!*\
  !*** ../../node_modules/ansi-html-community/index.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";

module.exports = ansiHTML;
// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/;
var _defColors = {
    reset: [
        "fff",
        "000"
    ],
    black: "000",
    red: "ff0000",
    green: "209805",
    yellow: "e8bf03",
    blue: "0000ff",
    magenta: "ff00ff",
    cyan: "00ffee",
    lightgrey: "f0f0f0",
    darkgrey: "888"
};
var _styles = {
    30: "black",
    31: "red",
    32: "green",
    33: "yellow",
    34: "blue",
    35: "magenta",
    36: "cyan",
    37: "lightgrey"
};
var _openTags = {
    "1": "font-weight:bold",
    "2": "opacity:0.5",
    "3": "<i>",
    "4": "<u>",
    "8": "display:none",
    "9": "<del>" // delete
};
var _closeTags = {
    "23": "</i>",
    "24": "</u>",
    "29": "</del>" // reset delete
};
[
    0,
    21,
    22,
    27,
    28,
    39,
    49
].forEach(function(n) {
    _closeTags[n] = "</span>";
});
/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */ function ansiHTML(text) {
    // Returns the text if the string has no ANSI escape code.
    if (!_regANSI.test(text)) {
        return text;
    }
    // Cache opened sequence.
    var ansiCodes = [];
    // Replace with markup.
    var ret = text.replace(/\033\[(\d+)m/g, function(match, seq) {
        var ot = _openTags[seq];
        if (ot) {
            // If current sequence has been opened, close it.
            if (!!~ansiCodes.indexOf(seq)) {
                ansiCodes.pop();
                return "</span>";
            }
            // Open tag.
            ansiCodes.push(seq);
            return ot[0] === "<" ? ot : '<span style="' + ot + ';">';
        }
        var ct = _closeTags[seq];
        if (ct) {
            // Pop sequence
            ansiCodes.pop();
            return ct;
        }
        return "";
    });
    // Make sure tags are closed.
    var l = ansiCodes.length;
    l > 0 && (ret += Array(l + 1).join("</span>"));
    return ret;
}
/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */ ansiHTML.setColors = function(colors) {
    if (typeof colors !== "object") {
        throw new Error("`colors` parameter must be an Object.");
    }
    var _finalColors = {};
    for(var key in _defColors){
        var hex = colors.hasOwnProperty(key) ? colors[key] : null;
        if (!hex) {
            _finalColors[key] = _defColors[key];
            continue;
        }
        if ("reset" === key) {
            if (typeof hex === "string") {
                hex = [
                    hex
                ];
            }
            if (!Array.isArray(hex) || hex.length === 0 || hex.some(function(h) {
                return typeof h !== "string";
            })) {
                throw new Error("The value of `" + key + "` property must be an Array and each item could only be a hex string, e.g.: FF0000");
            }
            var defHexColor = _defColors[key];
            if (!hex[0]) {
                hex[0] = defHexColor[0];
            }
            if (hex.length === 1 || !hex[1]) {
                hex = [
                    hex[0]
                ];
                hex.push(defHexColor[1]);
            }
            hex = hex.slice(0, 2);
        } else if (typeof hex !== "string") {
            throw new Error("The value of `" + key + "` property must be a hex string, e.g.: FF0000");
        }
        _finalColors[key] = hex;
    }
    _setTags(_finalColors);
};
/**
 * Reset colors.
 */ ansiHTML.reset = function() {
    _setTags(_defColors);
};
/**
 * Expose tags, including open and close.
 * @type {Object}
 */ ansiHTML.tags = {};
if (Object.defineProperty) {
    Object.defineProperty(ansiHTML.tags, "open", {
        get: function get() {
            return _openTags;
        }
    });
    Object.defineProperty(ansiHTML.tags, "close", {
        get: function get() {
            return _closeTags;
        }
    });
} else {
    ansiHTML.tags.open = _openTags;
    ansiHTML.tags.close = _closeTags;
}
function _setTags(colors) {
    // reset all
    _openTags["0"] = "font-weight:normal;opacity:1;color:#" + colors.reset[0] + ";background:#" + colors.reset[1];
    // inverse
    _openTags["7"] = "color:#" + colors.reset[1] + ";background:#" + colors.reset[0];
    // dark grey
    _openTags["90"] = "color:#" + colors.darkgrey;
    for(var code in _styles){
        var color = _styles[code];
        var oriColor = colors[color] || "000";
        _openTags[code] = "color:#" + oriColor;
        code = parseInt(code);
        _openTags[(code + 10).toString()] = "background:#" + oriColor;
    }
}
ansiHTML.reset();


/***/ }),

/***/ "../../node_modules/events/events.js":
/*!*******************************************!*\
  !*** ../../node_modules/events/events.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var R = typeof Reflect === "object" ? Reflect : null;
var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;
if (R && typeof R.ownKeys === "function") {
    ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
    ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
    };
} else {
    ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target);
    };
}
function ProcessEmitWarning(warning) {
    if (console && console.warn) console.warn(warning);
}
var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
    return value !== value;
};
function EventEmitter() {
    EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;
// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;
// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;
function checkListener(listener) {
    if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + (typeof listener === "undefined" ? "undefined" : _type_of(listener)));
    }
}
Object.defineProperty(EventEmitter, "defaultMaxListeners", {
    enumerable: true,
    get: function get() {
        return defaultMaxListeners;
    },
    set: function set(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
    }
});
EventEmitter.init = function() {
    if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
        this._events = Object.create(null);
        this._eventsCount = 0;
    }
    this._maxListeners = this._maxListeners || undefined;
};
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
    }
    this._maxListeners = n;
    return this;
};
function _getMaxListeners(that) {
    if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return _getMaxListeners(this);
};
EventEmitter.prototype.emit = function emit(type) {
    var args = [];
    for(var i = 1; i < arguments.length; i++)args.push(arguments[i]);
    var doError = type === "error";
    var events = this._events;
    if (events !== undefined) doError = doError && events.error === undefined;
    else if (!doError) return false;
    // If there is no 'error' event listener then throw.
    if (doError) {
        var er;
        if (args.length > 0) er = args[0];
        if (_instanceof(er, Error)) {
            // Note: The comments on the `throw` lines are intentional, they show
            // up in Node's output if this results in an unhandled exception.
            throw er; // Unhandled 'error' event
        }
        // At least give some kind of context to the user
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        err.context = er;
        throw err; // Unhandled 'error' event
    }
    var handler = events[type];
    if (handler === undefined) return false;
    if (typeof handler === "function") {
        ReflectApply(handler, this, args);
    } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for(var i = 0; i < len; ++i)ReflectApply(listeners[i], this, args);
    }
    return true;
};
function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;
    checkListener(listener);
    events = target._events;
    if (events === undefined) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
    } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener !== undefined) {
            target.emit("newListener", type, listener.listener ? listener.listener : listener);
            // Re-assign `events` because a newListener handler could have caused the
            // this._events to be assigned to a new object
            events = target._events;
        }
        existing = events[type];
    }
    if (existing === undefined) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
    } else {
        if (typeof existing === "function") {
            // Adding the second element, need to change to array.
            existing = events[type] = prepend ? [
                listener,
                existing
            ] : [
                existing,
                listener
            ];
        // If we've already got an array, just append.
        } else if (prepend) {
            existing.unshift(listener);
        } else {
            existing.push(listener);
        }
        // Check for listener leak
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            // No error code for this since it is a Warning
            // eslint-disable-next-line no-restricted-syntax
            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners " + "added. Use emitter.setMaxListeners() to " + "increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            ProcessEmitWarning(w);
        }
    }
    return target;
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this, type, listener, true);
};
function onceWrapper() {
    if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0) return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
    }
}
function _onceWrap(target, type, listener) {
    var state = {
        fired: false,
        wrapFn: undefined,
        target: target,
        type: type,
        listener: listener
    };
    var wrapped = onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
}
EventEmitter.prototype.once = function once(type, listener) {
    checkListener(listener);
    this.on(type, _onceWrap(this, type, listener));
    return this;
};
EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    checkListener(listener);
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
};
// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
    var list, events, position, i, originalListener;
    checkListener(listener);
    events = this._events;
    if (events === undefined) return this;
    list = events[type];
    if (list === undefined) return this;
    if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0) this._events = Object.create(null);
        else {
            delete events[type];
            if (events.removeListener) this.emit("removeListener", type, list.listener || listener);
        }
    } else if (typeof list !== "function") {
        position = -1;
        for(i = list.length - 1; i >= 0; i--){
            if (list[i] === listener || list[i].listener === listener) {
                originalListener = list[i].listener;
                position = i;
                break;
            }
        }
        if (position < 0) return this;
        if (position === 0) list.shift();
        else {
            spliceOne(list, position);
        }
        if (list.length === 1) events[type] = list[0];
        if (events.removeListener !== undefined) this.emit("removeListener", type, originalListener || listener);
    }
    return this;
};
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
    var listeners, events, i;
    events = this._events;
    if (events === undefined) return this;
    // not listening for removeListener, no need to emit
    if (events.removeListener === undefined) {
        if (arguments.length === 0) {
            this._events = Object.create(null);
            this._eventsCount = 0;
        } else if (events[type] !== undefined) {
            if (--this._eventsCount === 0) this._events = Object.create(null);
            else delete events[type];
        }
        return this;
    }
    // emit removeListener for all listeners on all events
    if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for(i = 0; i < keys.length; ++i){
            key = keys[i];
            if (key === "removeListener") continue;
            this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
    }
    listeners = events[type];
    if (typeof listeners === "function") {
        this.removeListener(type, listeners);
    } else if (listeners !== undefined) {
        // LIFO order
        for(i = listeners.length - 1; i >= 0; i--){
            this.removeListener(type, listeners[i]);
        }
    }
    return this;
};
function _listeners(target, type, unwrap) {
    var events = target._events;
    if (events === undefined) return [];
    var evlistener = events[type];
    if (evlistener === undefined) return [];
    if (typeof evlistener === "function") return unwrap ? [
        evlistener.listener || evlistener
    ] : [
        evlistener
    ];
    return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}
EventEmitter.prototype.listeners = function listeners(type) {
    return _listeners(this, type, true);
};
EventEmitter.prototype.rawListeners = function rawListeners(type) {
    return _listeners(this, type, false);
};
EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
    } else {
        return listenerCount.call(emitter, type);
    }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
    var events = this._events;
    if (events !== undefined) {
        var evlistener = events[type];
        if (typeof evlistener === "function") {
            return 1;
        } else if (evlistener !== undefined) {
            return evlistener.length;
        }
    }
    return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};
function arrayClone(arr, n) {
    var copy = new Array(n);
    for(var i = 0; i < n; ++i)copy[i] = arr[i];
    return copy;
}
function spliceOne(list, index) {
    for(; index + 1 < list.length; index++)list[index] = list[index + 1];
    list.pop();
}
function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for(var i = 0; i < ret.length; ++i){
        ret[i] = arr[i].listener || arr[i];
    }
    return ret;
}
function once(emitter, name) {
    return new Promise(function(resolve, reject) {
        var errorListener = function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject(err);
        };
        var resolver = function resolver() {
            if (typeof emitter.removeListener === "function") {
                emitter.removeListener("error", errorListener);
            }
            resolve([].slice.call(arguments));
        };
        ;
        eventTargetAgnosticAddListener(emitter, name, resolver, {
            once: true
        });
        if (name !== "error") {
            addErrorHandlerIfEventEmitter(emitter, errorListener, {
                once: true
            });
        }
    });
}
function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
    if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
    }
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
    if (typeof emitter.on === "function") {
        if (flags.once) {
            emitter.once(name, listener);
        } else {
            emitter.on(name, listener);
        }
    } else if (typeof emitter.addEventListener === "function") {
        // EventTarget does not have `error` event semantics like Node
        // EventEmitters, we do not listen for `error` events here.
        emitter.addEventListener(name, function wrapListener(arg) {
            // IE does not have builtin `{ once: true }` support so we
            // have to do it manually.
            if (flags.once) {
                emitter.removeEventListener(name, wrapListener);
            }
            listener(arg);
        });
    } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + (typeof emitter === "undefined" ? "undefined" : _type_of(emitter)));
    }
}


/***/ }),

/***/ "../../node_modules/html-entities/lib/index.js":
/*!*****************************************************!*\
  !*** ../../node_modules/html-entities/lib/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = this && this.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var named_references_1 = __webpack_require__(/*! ./named-references */ "../../node_modules/html-entities/lib/named-references.js");
var numeric_unicode_map_1 = __webpack_require__(/*! ./numeric-unicode-map */ "../../node_modules/html-entities/lib/numeric-unicode-map.js");
var surrogate_pairs_1 = __webpack_require__(/*! ./surrogate-pairs */ "../../node_modules/html-entities/lib/surrogate-pairs.js");
var allNamedReferences = __assign(__assign({}, named_references_1.namedReferences), {
    all: named_references_1.namedReferences.html5
});
var encodeRegExps = {
    specialChars: /[<>'"&]/g,
    nonAscii: /[<>'"&\u0080-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,
    nonAsciiPrintable: /[<>'"&\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,
    nonAsciiPrintableOnly: /[\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,
    extensive: /[\x01-\x0c\x0e-\x1f\x21-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7d\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g
};
var defaultEncodeOptions = {
    mode: "specialChars",
    level: "all",
    numeric: "decimal"
};
/** Encodes all the necessary (specified by `level`) characters in the text */ function encode(text, _a) {
    var _b = _a === void 0 ? defaultEncodeOptions : _a, _c = _b.mode, mode = _c === void 0 ? "specialChars" : _c, _d = _b.numeric, numeric = _d === void 0 ? "decimal" : _d, _e = _b.level, level = _e === void 0 ? "all" : _e;
    if (!text) {
        return "";
    }
    var encodeRegExp = encodeRegExps[mode];
    var references = allNamedReferences[level].characters;
    var isHex = numeric === "hexadecimal";
    encodeRegExp.lastIndex = 0;
    var _b = encodeRegExp.exec(text);
    var _c;
    if (_b) {
        _c = "";
        var _d = 0;
        do {
            if (_d !== _b.index) {
                _c += text.substring(_d, _b.index);
            }
            var _e = _b[0];
            var result_1 = references[_e];
            if (!result_1) {
                var code_1 = _e.length > 1 ? surrogate_pairs_1.getCodePoint(_e, 0) : _e.charCodeAt(0);
                result_1 = (isHex ? "&#x" + code_1.toString(16) : "&#" + code_1) + ";";
            }
            _c += result_1;
            _d = _b.index + _e.length;
        }while (_b = encodeRegExp.exec(text));
        if (_d !== text.length) {
            _c += text.substring(_d);
        }
    } else {
        _c = text;
    }
    return _c;
}
exports.encode = encode;
var defaultDecodeOptions = {
    scope: "body",
    level: "all"
};
var strict = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g;
var attribute = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g;
var baseDecodeRegExps = {
    xml: {
        strict: strict,
        attribute: attribute,
        body: named_references_1.bodyRegExps.xml
    },
    html4: {
        strict: strict,
        attribute: attribute,
        body: named_references_1.bodyRegExps.html4
    },
    html5: {
        strict: strict,
        attribute: attribute,
        body: named_references_1.bodyRegExps.html5
    }
};
var decodeRegExps = __assign(__assign({}, baseDecodeRegExps), {
    all: baseDecodeRegExps.html5
});
var fromCharCode = String.fromCharCode;
var outOfBoundsChar = fromCharCode(65533);
var defaultDecodeEntityOptions = {
    level: "all"
};
/** Decodes a single entity */ function decodeEntity(entity, _a) {
    var _b = (_a === void 0 ? defaultDecodeEntityOptions : _a).level, level = _b === void 0 ? "all" : _b;
    if (!entity) {
        return "";
    }
    var _b = entity;
    var decodeEntityLastChar_1 = entity[entity.length - 1];
    if (false) {} else if (false) {} else {
        var decodeResultByReference_1 = allNamedReferences[level].entities[entity];
        if (decodeResultByReference_1) {
            _b = decodeResultByReference_1;
        } else if (entity[0] === "&" && entity[1] === "#") {
            var decodeSecondChar_1 = entity[2];
            var decodeCode_1 = decodeSecondChar_1 == "x" || decodeSecondChar_1 == "X" ? parseInt(entity.substr(3), 16) : parseInt(entity.substr(2));
            _b = decodeCode_1 >= 0x10ffff ? outOfBoundsChar : decodeCode_1 > 65535 ? surrogate_pairs_1.fromCodePoint(decodeCode_1) : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_1] || decodeCode_1);
        }
    }
    return _b;
}
exports.decodeEntity = decodeEntity;
/** Decodes all entities in the text */ function decode(text, _a) {
    var decodeSecondChar_1 = _a === void 0 ? defaultDecodeOptions : _a, decodeCode_1 = decodeSecondChar_1.level, level = decodeCode_1 === void 0 ? "all" : decodeCode_1, _b = decodeSecondChar_1.scope, scope = _b === void 0 ? level === "xml" ? "strict" : "body" : _b;
    if (!text) {
        return "";
    }
    var decodeRegExp = decodeRegExps[level][scope];
    var references = allNamedReferences[level].entities;
    var isAttribute = scope === "attribute";
    var isStrict = scope === "strict";
    decodeRegExp.lastIndex = 0;
    var replaceMatch_1 = decodeRegExp.exec(text);
    var replaceResult_1;
    if (replaceMatch_1) {
        replaceResult_1 = "";
        var replaceLastIndex_1 = 0;
        do {
            if (replaceLastIndex_1 !== replaceMatch_1.index) {
                replaceResult_1 += text.substring(replaceLastIndex_1, replaceMatch_1.index);
            }
            var replaceInput_1 = replaceMatch_1[0];
            var decodeResult_1 = replaceInput_1;
            var decodeEntityLastChar_2 = replaceInput_1[replaceInput_1.length - 1];
            if (isAttribute && decodeEntityLastChar_2 === "=") {
                decodeResult_1 = replaceInput_1;
            } else if (isStrict && decodeEntityLastChar_2 !== ";") {
                decodeResult_1 = replaceInput_1;
            } else {
                var decodeResultByReference_2 = references[replaceInput_1];
                if (decodeResultByReference_2) {
                    decodeResult_1 = decodeResultByReference_2;
                } else if (replaceInput_1[0] === "&" && replaceInput_1[1] === "#") {
                    var decodeSecondChar_2 = replaceInput_1[2];
                    var decodeCode_2 = decodeSecondChar_2 == "x" || decodeSecondChar_2 == "X" ? parseInt(replaceInput_1.substr(3), 16) : parseInt(replaceInput_1.substr(2));
                    decodeResult_1 = decodeCode_2 >= 0x10ffff ? outOfBoundsChar : decodeCode_2 > 65535 ? surrogate_pairs_1.fromCodePoint(decodeCode_2) : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_2] || decodeCode_2);
                }
            }
            replaceResult_1 += decodeResult_1;
            replaceLastIndex_1 = replaceMatch_1.index + replaceInput_1.length;
        }while (replaceMatch_1 = decodeRegExp.exec(text));
        if (replaceLastIndex_1 !== text.length) {
            replaceResult_1 += text.substring(replaceLastIndex_1);
        }
    } else {
        replaceResult_1 = text;
    }
    return replaceResult_1;
}
exports.decode = decode;


/***/ }),

/***/ "../../node_modules/html-entities/lib/named-references.js":
/*!****************************************************************!*\
  !*** ../../node_modules/html-entities/lib/named-references.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.bodyRegExps = {
    xml: /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,
    html4: /&notin;|&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,
    html5: /&centerdot;|&copysr;|&divideontimes;|&gtcc;|&gtcir;|&gtdot;|&gtlPar;|&gtquest;|&gtrapprox;|&gtrarr;|&gtrdot;|&gtreqless;|&gtreqqless;|&gtrless;|&gtrsim;|&ltcc;|&ltcir;|&ltdot;|&lthree;|&ltimes;|&ltlarr;|&ltquest;|&ltrPar;|&ltri;|&ltrie;|&ltrif;|&notin;|&notinE;|&notindot;|&notinva;|&notinvb;|&notinvc;|&notni;|&notniva;|&notnivb;|&notnivc;|&parallel;|&timesb;|&timesbar;|&timesd;|&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g
};
exports.namedReferences = {
    xml: {
        entities: {
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"',
            "&apos;": "'",
            "&amp;": "&"
        },
        characters: {
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&apos;",
            "&": "&amp;"
        }
    },
    html4: {
        entities: {
            "&apos;": "'",
            "&nbsp": "\xa0",
            "&nbsp;": "\xa0",
            "&iexcl": "\xa1",
            "&iexcl;": "\xa1",
            "&cent": "\xa2",
            "&cent;": "\xa2",
            "&pound": "\xa3",
            "&pound;": "\xa3",
            "&curren": "\xa4",
            "&curren;": "\xa4",
            "&yen": "\xa5",
            "&yen;": "\xa5",
            "&brvbar": "\xa6",
            "&brvbar;": "\xa6",
            "&sect": "\xa7",
            "&sect;": "\xa7",
            "&uml": "\xa8",
            "&uml;": "\xa8",
            "&copy": "\xa9",
            "&copy;": "\xa9",
            "&ordf": "\xaa",
            "&ordf;": "\xaa",
            "&laquo": "\xab",
            "&laquo;": "\xab",
            "&not": "\xac",
            "&not;": "\xac",
            "&shy": "\xad",
            "&shy;": "\xad",
            "&reg": "\xae",
            "&reg;": "\xae",
            "&macr": "\xaf",
            "&macr;": "\xaf",
            "&deg": "\xb0",
            "&deg;": "\xb0",
            "&plusmn": "\xb1",
            "&plusmn;": "\xb1",
            "&sup2": "\xb2",
            "&sup2;": "\xb2",
            "&sup3": "\xb3",
            "&sup3;": "\xb3",
            "&acute": "\xb4",
            "&acute;": "\xb4",
            "&micro": "\xb5",
            "&micro;": "\xb5",
            "&para": "\xb6",
            "&para;": "\xb6",
            "&middot": "\xb7",
            "&middot;": "\xb7",
            "&cedil": "\xb8",
            "&cedil;": "\xb8",
            "&sup1": "\xb9",
            "&sup1;": "\xb9",
            "&ordm": "\xba",
            "&ordm;": "\xba",
            "&raquo": "\xbb",
            "&raquo;": "\xbb",
            "&frac14": "\xbc",
            "&frac14;": "\xbc",
            "&frac12": "\xbd",
            "&frac12;": "\xbd",
            "&frac34": "\xbe",
            "&frac34;": "\xbe",
            "&iquest": "\xbf",
            "&iquest;": "\xbf",
            "&Agrave": "\xc0",
            "&Agrave;": "\xc0",
            "&Aacute": "\xc1",
            "&Aacute;": "\xc1",
            "&Acirc": "\xc2",
            "&Acirc;": "\xc2",
            "&Atilde": "\xc3",
            "&Atilde;": "\xc3",
            "&Auml": "\xc4",
            "&Auml;": "\xc4",
            "&Aring": "\xc5",
            "&Aring;": "\xc5",
            "&AElig": "\xc6",
            "&AElig;": "\xc6",
            "&Ccedil": "\xc7",
            "&Ccedil;": "\xc7",
            "&Egrave": "\xc8",
            "&Egrave;": "\xc8",
            "&Eacute": "\xc9",
            "&Eacute;": "\xc9",
            "&Ecirc": "\xca",
            "&Ecirc;": "\xca",
            "&Euml": "\xcb",
            "&Euml;": "\xcb",
            "&Igrave": "\xcc",
            "&Igrave;": "\xcc",
            "&Iacute": "\xcd",
            "&Iacute;": "\xcd",
            "&Icirc": "\xce",
            "&Icirc;": "\xce",
            "&Iuml": "\xcf",
            "&Iuml;": "\xcf",
            "&ETH": "\xd0",
            "&ETH;": "\xd0",
            "&Ntilde": "\xd1",
            "&Ntilde;": "\xd1",
            "&Ograve": "\xd2",
            "&Ograve;": "\xd2",
            "&Oacute": "\xd3",
            "&Oacute;": "\xd3",
            "&Ocirc": "\xd4",
            "&Ocirc;": "\xd4",
            "&Otilde": "\xd5",
            "&Otilde;": "\xd5",
            "&Ouml": "\xd6",
            "&Ouml;": "\xd6",
            "&times": "\xd7",
            "&times;": "\xd7",
            "&Oslash": "\xd8",
            "&Oslash;": "\xd8",
            "&Ugrave": "\xd9",
            "&Ugrave;": "\xd9",
            "&Uacute": "\xda",
            "&Uacute;": "\xda",
            "&Ucirc": "\xdb",
            "&Ucirc;": "\xdb",
            "&Uuml": "\xdc",
            "&Uuml;": "\xdc",
            "&Yacute": "\xdd",
            "&Yacute;": "\xdd",
            "&THORN": "\xde",
            "&THORN;": "\xde",
            "&szlig": "\xdf",
            "&szlig;": "\xdf",
            "&agrave": "\xe0",
            "&agrave;": "\xe0",
            "&aacute": "\xe1",
            "&aacute;": "\xe1",
            "&acirc": "\xe2",
            "&acirc;": "\xe2",
            "&atilde": "\xe3",
            "&atilde;": "\xe3",
            "&auml": "\xe4",
            "&auml;": "\xe4",
            "&aring": "\xe5",
            "&aring;": "\xe5",
            "&aelig": "\xe6",
            "&aelig;": "\xe6",
            "&ccedil": "\xe7",
            "&ccedil;": "\xe7",
            "&egrave": "\xe8",
            "&egrave;": "\xe8",
            "&eacute": "\xe9",
            "&eacute;": "\xe9",
            "&ecirc": "\xea",
            "&ecirc;": "\xea",
            "&euml": "\xeb",
            "&euml;": "\xeb",
            "&igrave": "\xec",
            "&igrave;": "\xec",
            "&iacute": "\xed",
            "&iacute;": "\xed",
            "&icirc": "\xee",
            "&icirc;": "\xee",
            "&iuml": "\xef",
            "&iuml;": "\xef",
            "&eth": "\xf0",
            "&eth;": "\xf0",
            "&ntilde": "\xf1",
            "&ntilde;": "\xf1",
            "&ograve": "\xf2",
            "&ograve;": "\xf2",
            "&oacute": "\xf3",
            "&oacute;": "\xf3",
            "&ocirc": "\xf4",
            "&ocirc;": "\xf4",
            "&otilde": "\xf5",
            "&otilde;": "\xf5",
            "&ouml": "\xf6",
            "&ouml;": "\xf6",
            "&divide": "\xf7",
            "&divide;": "\xf7",
            "&oslash": "\xf8",
            "&oslash;": "\xf8",
            "&ugrave": "\xf9",
            "&ugrave;": "\xf9",
            "&uacute": "\xfa",
            "&uacute;": "\xfa",
            "&ucirc": "\xfb",
            "&ucirc;": "\xfb",
            "&uuml": "\xfc",
            "&uuml;": "\xfc",
            "&yacute": "\xfd",
            "&yacute;": "\xfd",
            "&thorn": "\xfe",
            "&thorn;": "\xfe",
            "&yuml": "\xff",
            "&yuml;": "\xff",
            "&quot": '"',
            "&quot;": '"',
            "&amp": "&",
            "&amp;": "&",
            "&lt": "<",
            "&lt;": "<",
            "&gt": ">",
            "&gt;": ">",
            "&OElig;": "Œ",
            "&oelig;": "œ",
            "&Scaron;": "Š",
            "&scaron;": "š",
            "&Yuml;": "Ÿ",
            "&circ;": "ˆ",
            "&tilde;": "˜",
            "&ensp;": " ",
            "&emsp;": " ",
            "&thinsp;": " ",
            "&zwnj;": "‌",
            "&zwj;": "‍",
            "&lrm;": "‎",
            "&rlm;": "‏",
            "&ndash;": "–",
            "&mdash;": "—",
            "&lsquo;": "‘",
            "&rsquo;": "’",
            "&sbquo;": "‚",
            "&ldquo;": "“",
            "&rdquo;": "”",
            "&bdquo;": "„",
            "&dagger;": "†",
            "&Dagger;": "‡",
            "&permil;": "‰",
            "&lsaquo;": "‹",
            "&rsaquo;": "›",
            "&euro;": "€",
            "&fnof;": "ƒ",
            "&Alpha;": "Α",
            "&Beta;": "Β",
            "&Gamma;": "Γ",
            "&Delta;": "Δ",
            "&Epsilon;": "Ε",
            "&Zeta;": "Ζ",
            "&Eta;": "Η",
            "&Theta;": "Θ",
            "&Iota;": "Ι",
            "&Kappa;": "Κ",
            "&Lambda;": "Λ",
            "&Mu;": "Μ",
            "&Nu;": "Ν",
            "&Xi;": "Ξ",
            "&Omicron;": "Ο",
            "&Pi;": "Π",
            "&Rho;": "Ρ",
            "&Sigma;": "Σ",
            "&Tau;": "Τ",
            "&Upsilon;": "Υ",
            "&Phi;": "Φ",
            "&Chi;": "Χ",
            "&Psi;": "Ψ",
            "&Omega;": "Ω",
            "&alpha;": "α",
            "&beta;": "β",
            "&gamma;": "γ",
            "&delta;": "δ",
            "&epsilon;": "ε",
            "&zeta;": "ζ",
            "&eta;": "η",
            "&theta;": "θ",
            "&iota;": "ι",
            "&kappa;": "κ",
            "&lambda;": "λ",
            "&mu;": "μ",
            "&nu;": "ν",
            "&xi;": "ξ",
            "&omicron;": "ο",
            "&pi;": "π",
            "&rho;": "ρ",
            "&sigmaf;": "ς",
            "&sigma;": "σ",
            "&tau;": "τ",
            "&upsilon;": "υ",
            "&phi;": "φ",
            "&chi;": "χ",
            "&psi;": "ψ",
            "&omega;": "ω",
            "&thetasym;": "ϑ",
            "&upsih;": "ϒ",
            "&piv;": "ϖ",
            "&bull;": "•",
            "&hellip;": "…",
            "&prime;": "′",
            "&Prime;": "″",
            "&oline;": "‾",
            "&frasl;": "⁄",
            "&weierp;": "℘",
            "&image;": "ℑ",
            "&real;": "ℜ",
            "&trade;": "™",
            "&alefsym;": "ℵ",
            "&larr;": "←",
            "&uarr;": "↑",
            "&rarr;": "→",
            "&darr;": "↓",
            "&harr;": "↔",
            "&crarr;": "↵",
            "&lArr;": "⇐",
            "&uArr;": "⇑",
            "&rArr;": "⇒",
            "&dArr;": "⇓",
            "&hArr;": "⇔",
            "&forall;": "∀",
            "&part;": "∂",
            "&exist;": "∃",
            "&empty;": "∅",
            "&nabla;": "∇",
            "&isin;": "∈",
            "&notin;": "∉",
            "&ni;": "∋",
            "&prod;": "∏",
            "&sum;": "∑",
            "&minus;": "−",
            "&lowast;": "∗",
            "&radic;": "√",
            "&prop;": "∝",
            "&infin;": "∞",
            "&ang;": "∠",
            "&and;": "∧",
            "&or;": "∨",
            "&cap;": "∩",
            "&cup;": "∪",
            "&int;": "∫",
            "&there4;": "∴",
            "&sim;": "∼",
            "&cong;": "≅",
            "&asymp;": "≈",
            "&ne;": "≠",
            "&equiv;": "≡",
            "&le;": "≤",
            "&ge;": "≥",
            "&sub;": "⊂",
            "&sup;": "⊃",
            "&nsub;": "⊄",
            "&sube;": "⊆",
            "&supe;": "⊇",
            "&oplus;": "⊕",
            "&otimes;": "⊗",
            "&perp;": "⊥",
            "&sdot;": "⋅",
            "&lceil;": "⌈",
            "&rceil;": "⌉",
            "&lfloor;": "⌊",
            "&rfloor;": "⌋",
            "&lang;": "〈",
            "&rang;": "〉",
            "&loz;": "◊",
            "&spades;": "♠",
            "&clubs;": "♣",
            "&hearts;": "♥",
            "&diams;": "♦"
        },
        characters: {
            "'": "&apos;",
            "\xa0": "&nbsp;",
            "\xa1": "&iexcl;",
            "\xa2": "&cent;",
            "\xa3": "&pound;",
            "\xa4": "&curren;",
            "\xa5": "&yen;",
            "\xa6": "&brvbar;",
            "\xa7": "&sect;",
            "\xa8": "&uml;",
            "\xa9": "&copy;",
            "\xaa": "&ordf;",
            "\xab": "&laquo;",
            "\xac": "&not;",
            "\xad": "&shy;",
            "\xae": "&reg;",
            "\xaf": "&macr;",
            "\xb0": "&deg;",
            "\xb1": "&plusmn;",
            "\xb2": "&sup2;",
            "\xb3": "&sup3;",
            "\xb4": "&acute;",
            "\xb5": "&micro;",
            "\xb6": "&para;",
            "\xb7": "&middot;",
            "\xb8": "&cedil;",
            "\xb9": "&sup1;",
            "\xba": "&ordm;",
            "\xbb": "&raquo;",
            "\xbc": "&frac14;",
            "\xbd": "&frac12;",
            "\xbe": "&frac34;",
            "\xbf": "&iquest;",
            "\xc0": "&Agrave;",
            "\xc1": "&Aacute;",
            "\xc2": "&Acirc;",
            "\xc3": "&Atilde;",
            "\xc4": "&Auml;",
            "\xc5": "&Aring;",
            "\xc6": "&AElig;",
            "\xc7": "&Ccedil;",
            "\xc8": "&Egrave;",
            "\xc9": "&Eacute;",
            "\xca": "&Ecirc;",
            "\xcb": "&Euml;",
            "\xcc": "&Igrave;",
            "\xcd": "&Iacute;",
            "\xce": "&Icirc;",
            "\xcf": "&Iuml;",
            "\xd0": "&ETH;",
            "\xd1": "&Ntilde;",
            "\xd2": "&Ograve;",
            "\xd3": "&Oacute;",
            "\xd4": "&Ocirc;",
            "\xd5": "&Otilde;",
            "\xd6": "&Ouml;",
            "\xd7": "&times;",
            "\xd8": "&Oslash;",
            "\xd9": "&Ugrave;",
            "\xda": "&Uacute;",
            "\xdb": "&Ucirc;",
            "\xdc": "&Uuml;",
            "\xdd": "&Yacute;",
            "\xde": "&THORN;",
            "\xdf": "&szlig;",
            "\xe0": "&agrave;",
            "\xe1": "&aacute;",
            "\xe2": "&acirc;",
            "\xe3": "&atilde;",
            "\xe4": "&auml;",
            "\xe5": "&aring;",
            "\xe6": "&aelig;",
            "\xe7": "&ccedil;",
            "\xe8": "&egrave;",
            "\xe9": "&eacute;",
            "\xea": "&ecirc;",
            "\xeb": "&euml;",
            "\xec": "&igrave;",
            "\xed": "&iacute;",
            "\xee": "&icirc;",
            "\xef": "&iuml;",
            "\xf0": "&eth;",
            "\xf1": "&ntilde;",
            "\xf2": "&ograve;",
            "\xf3": "&oacute;",
            "\xf4": "&ocirc;",
            "\xf5": "&otilde;",
            "\xf6": "&ouml;",
            "\xf7": "&divide;",
            "\xf8": "&oslash;",
            "\xf9": "&ugrave;",
            "\xfa": "&uacute;",
            "\xfb": "&ucirc;",
            "\xfc": "&uuml;",
            "\xfd": "&yacute;",
            "\xfe": "&thorn;",
            "\xff": "&yuml;",
            '"': "&quot;",
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "Œ": "&OElig;",
            "œ": "&oelig;",
            "Š": "&Scaron;",
            "š": "&scaron;",
            "Ÿ": "&Yuml;",
            "ˆ": "&circ;",
            "˜": "&tilde;",
            " ": "&ensp;",
            " ": "&emsp;",
            " ": "&thinsp;",
            "‌": "&zwnj;",
            "‍": "&zwj;",
            "‎": "&lrm;",
            "‏": "&rlm;",
            "–": "&ndash;",
            "—": "&mdash;",
            "‘": "&lsquo;",
            "’": "&rsquo;",
            "‚": "&sbquo;",
            "“": "&ldquo;",
            "”": "&rdquo;",
            "„": "&bdquo;",
            "†": "&dagger;",
            "‡": "&Dagger;",
            "‰": "&permil;",
            "‹": "&lsaquo;",
            "›": "&rsaquo;",
            "€": "&euro;",
            "ƒ": "&fnof;",
            "Α": "&Alpha;",
            "Β": "&Beta;",
            "Γ": "&Gamma;",
            "Δ": "&Delta;",
            "Ε": "&Epsilon;",
            "Ζ": "&Zeta;",
            "Η": "&Eta;",
            "Θ": "&Theta;",
            "Ι": "&Iota;",
            "Κ": "&Kappa;",
            "Λ": "&Lambda;",
            "Μ": "&Mu;",
            "Ν": "&Nu;",
            "Ξ": "&Xi;",
            "Ο": "&Omicron;",
            "Π": "&Pi;",
            "Ρ": "&Rho;",
            "Σ": "&Sigma;",
            "Τ": "&Tau;",
            "Υ": "&Upsilon;",
            "Φ": "&Phi;",
            "Χ": "&Chi;",
            "Ψ": "&Psi;",
            "Ω": "&Omega;",
            "α": "&alpha;",
            "β": "&beta;",
            "γ": "&gamma;",
            "δ": "&delta;",
            "ε": "&epsilon;",
            "ζ": "&zeta;",
            "η": "&eta;",
            "θ": "&theta;",
            "ι": "&iota;",
            "κ": "&kappa;",
            "λ": "&lambda;",
            "μ": "&mu;",
            "ν": "&nu;",
            "ξ": "&xi;",
            "ο": "&omicron;",
            "π": "&pi;",
            "ρ": "&rho;",
            "ς": "&sigmaf;",
            "σ": "&sigma;",
            "τ": "&tau;",
            "υ": "&upsilon;",
            "φ": "&phi;",
            "χ": "&chi;",
            "ψ": "&psi;",
            "ω": "&omega;",
            "ϑ": "&thetasym;",
            "ϒ": "&upsih;",
            "ϖ": "&piv;",
            "•": "&bull;",
            "…": "&hellip;",
            "′": "&prime;",
            "″": "&Prime;",
            "‾": "&oline;",
            "⁄": "&frasl;",
            "℘": "&weierp;",
            "ℑ": "&image;",
            "ℜ": "&real;",
            "™": "&trade;",
            "ℵ": "&alefsym;",
            "←": "&larr;",
            "↑": "&uarr;",
            "→": "&rarr;",
            "↓": "&darr;",
            "↔": "&harr;",
            "↵": "&crarr;",
            "⇐": "&lArr;",
            "⇑": "&uArr;",
            "⇒": "&rArr;",
            "⇓": "&dArr;",
            "⇔": "&hArr;",
            "∀": "&forall;",
            "∂": "&part;",
            "∃": "&exist;",
            "∅": "&empty;",
            "∇": "&nabla;",
            "∈": "&isin;",
            "∉": "&notin;",
            "∋": "&ni;",
            "∏": "&prod;",
            "∑": "&sum;",
            "−": "&minus;",
            "∗": "&lowast;",
            "√": "&radic;",
            "∝": "&prop;",
            "∞": "&infin;",
            "∠": "&ang;",
            "∧": "&and;",
            "∨": "&or;",
            "∩": "&cap;",
            "∪": "&cup;",
            "∫": "&int;",
            "∴": "&there4;",
            "∼": "&sim;",
            "≅": "&cong;",
            "≈": "&asymp;",
            "≠": "&ne;",
            "≡": "&equiv;",
            "≤": "&le;",
            "≥": "&ge;",
            "⊂": "&sub;",
            "⊃": "&sup;",
            "⊄": "&nsub;",
            "⊆": "&sube;",
            "⊇": "&supe;",
            "⊕": "&oplus;",
            "⊗": "&otimes;",
            "⊥": "&perp;",
            "⋅": "&sdot;",
            "⌈": "&lceil;",
            "⌉": "&rceil;",
            "⌊": "&lfloor;",
            "⌋": "&rfloor;",
            "〈": "&lang;",
            "〉": "&rang;",
            "◊": "&loz;",
            "♠": "&spades;",
            "♣": "&clubs;",
            "♥": "&hearts;",
            "♦": "&diams;"
        }
    },
    html5: {
        entities: {
            "&AElig": "\xc6",
            "&AElig;": "\xc6",
            "&AMP": "&",
            "&AMP;": "&",
            "&Aacute": "\xc1",
            "&Aacute;": "\xc1",
            "&Abreve;": "Ă",
            "&Acirc": "\xc2",
            "&Acirc;": "\xc2",
            "&Acy;": "А",
            "&Afr;": "\uD835\uDD04",
            "&Agrave": "\xc0",
            "&Agrave;": "\xc0",
            "&Alpha;": "Α",
            "&Amacr;": "Ā",
            "&And;": "⩓",
            "&Aogon;": "Ą",
            "&Aopf;": "\uD835\uDD38",
            "&ApplyFunction;": "⁡",
            "&Aring": "\xc5",
            "&Aring;": "\xc5",
            "&Ascr;": "\uD835\uDC9C",
            "&Assign;": "≔",
            "&Atilde": "\xc3",
            "&Atilde;": "\xc3",
            "&Auml": "\xc4",
            "&Auml;": "\xc4",
            "&Backslash;": "∖",
            "&Barv;": "⫧",
            "&Barwed;": "⌆",
            "&Bcy;": "Б",
            "&Because;": "∵",
            "&Bernoullis;": "ℬ",
            "&Beta;": "Β",
            "&Bfr;": "\uD835\uDD05",
            "&Bopf;": "\uD835\uDD39",
            "&Breve;": "˘",
            "&Bscr;": "ℬ",
            "&Bumpeq;": "≎",
            "&CHcy;": "Ч",
            "&COPY": "\xa9",
            "&COPY;": "\xa9",
            "&Cacute;": "Ć",
            "&Cap;": "⋒",
            "&CapitalDifferentialD;": "ⅅ",
            "&Cayleys;": "ℭ",
            "&Ccaron;": "Č",
            "&Ccedil": "\xc7",
            "&Ccedil;": "\xc7",
            "&Ccirc;": "Ĉ",
            "&Cconint;": "∰",
            "&Cdot;": "Ċ",
            "&Cedilla;": "\xb8",
            "&CenterDot;": "\xb7",
            "&Cfr;": "ℭ",
            "&Chi;": "Χ",
            "&CircleDot;": "⊙",
            "&CircleMinus;": "⊖",
            "&CirclePlus;": "⊕",
            "&CircleTimes;": "⊗",
            "&ClockwiseContourIntegral;": "∲",
            "&CloseCurlyDoubleQuote;": "”",
            "&CloseCurlyQuote;": "’",
            "&Colon;": "∷",
            "&Colone;": "⩴",
            "&Congruent;": "≡",
            "&Conint;": "∯",
            "&ContourIntegral;": "∮",
            "&Copf;": "ℂ",
            "&Coproduct;": "∐",
            "&CounterClockwiseContourIntegral;": "∳",
            "&Cross;": "⨯",
            "&Cscr;": "\uD835\uDC9E",
            "&Cup;": "⋓",
            "&CupCap;": "≍",
            "&DD;": "ⅅ",
            "&DDotrahd;": "⤑",
            "&DJcy;": "Ђ",
            "&DScy;": "Ѕ",
            "&DZcy;": "Џ",
            "&Dagger;": "‡",
            "&Darr;": "↡",
            "&Dashv;": "⫤",
            "&Dcaron;": "Ď",
            "&Dcy;": "Д",
            "&Del;": "∇",
            "&Delta;": "Δ",
            "&Dfr;": "\uD835\uDD07",
            "&DiacriticalAcute;": "\xb4",
            "&DiacriticalDot;": "˙",
            "&DiacriticalDoubleAcute;": "˝",
            "&DiacriticalGrave;": "`",
            "&DiacriticalTilde;": "˜",
            "&Diamond;": "⋄",
            "&DifferentialD;": "ⅆ",
            "&Dopf;": "\uD835\uDD3B",
            "&Dot;": "\xa8",
            "&DotDot;": "⃜",
            "&DotEqual;": "≐",
            "&DoubleContourIntegral;": "∯",
            "&DoubleDot;": "\xa8",
            "&DoubleDownArrow;": "⇓",
            "&DoubleLeftArrow;": "⇐",
            "&DoubleLeftRightArrow;": "⇔",
            "&DoubleLeftTee;": "⫤",
            "&DoubleLongLeftArrow;": "⟸",
            "&DoubleLongLeftRightArrow;": "⟺",
            "&DoubleLongRightArrow;": "⟹",
            "&DoubleRightArrow;": "⇒",
            "&DoubleRightTee;": "⊨",
            "&DoubleUpArrow;": "⇑",
            "&DoubleUpDownArrow;": "⇕",
            "&DoubleVerticalBar;": "∥",
            "&DownArrow;": "↓",
            "&DownArrowBar;": "⤓",
            "&DownArrowUpArrow;": "⇵",
            "&DownBreve;": "̑",
            "&DownLeftRightVector;": "⥐",
            "&DownLeftTeeVector;": "⥞",
            "&DownLeftVector;": "↽",
            "&DownLeftVectorBar;": "⥖",
            "&DownRightTeeVector;": "⥟",
            "&DownRightVector;": "⇁",
            "&DownRightVectorBar;": "⥗",
            "&DownTee;": "⊤",
            "&DownTeeArrow;": "↧",
            "&Downarrow;": "⇓",
            "&Dscr;": "\uD835\uDC9F",
            "&Dstrok;": "Đ",
            "&ENG;": "Ŋ",
            "&ETH": "\xd0",
            "&ETH;": "\xd0",
            "&Eacute": "\xc9",
            "&Eacute;": "\xc9",
            "&Ecaron;": "Ě",
            "&Ecirc": "\xca",
            "&Ecirc;": "\xca",
            "&Ecy;": "Э",
            "&Edot;": "Ė",
            "&Efr;": "\uD835\uDD08",
            "&Egrave": "\xc8",
            "&Egrave;": "\xc8",
            "&Element;": "∈",
            "&Emacr;": "Ē",
            "&EmptySmallSquare;": "◻",
            "&EmptyVerySmallSquare;": "▫",
            "&Eogon;": "Ę",
            "&Eopf;": "\uD835\uDD3C",
            "&Epsilon;": "Ε",
            "&Equal;": "⩵",
            "&EqualTilde;": "≂",
            "&Equilibrium;": "⇌",
            "&Escr;": "ℰ",
            "&Esim;": "⩳",
            "&Eta;": "Η",
            "&Euml": "\xcb",
            "&Euml;": "\xcb",
            "&Exists;": "∃",
            "&ExponentialE;": "ⅇ",
            "&Fcy;": "Ф",
            "&Ffr;": "\uD835\uDD09",
            "&FilledSmallSquare;": "◼",
            "&FilledVerySmallSquare;": "▪",
            "&Fopf;": "\uD835\uDD3D",
            "&ForAll;": "∀",
            "&Fouriertrf;": "ℱ",
            "&Fscr;": "ℱ",
            "&GJcy;": "Ѓ",
            "&GT": ">",
            "&GT;": ">",
            "&Gamma;": "Γ",
            "&Gammad;": "Ϝ",
            "&Gbreve;": "Ğ",
            "&Gcedil;": "Ģ",
            "&Gcirc;": "Ĝ",
            "&Gcy;": "Г",
            "&Gdot;": "Ġ",
            "&Gfr;": "\uD835\uDD0A",
            "&Gg;": "⋙",
            "&Gopf;": "\uD835\uDD3E",
            "&GreaterEqual;": "≥",
            "&GreaterEqualLess;": "⋛",
            "&GreaterFullEqual;": "≧",
            "&GreaterGreater;": "⪢",
            "&GreaterLess;": "≷",
            "&GreaterSlantEqual;": "⩾",
            "&GreaterTilde;": "≳",
            "&Gscr;": "\uD835\uDCA2",
            "&Gt;": "≫",
            "&HARDcy;": "Ъ",
            "&Hacek;": "ˇ",
            "&Hat;": "^",
            "&Hcirc;": "Ĥ",
            "&Hfr;": "ℌ",
            "&HilbertSpace;": "ℋ",
            "&Hopf;": "ℍ",
            "&HorizontalLine;": "─",
            "&Hscr;": "ℋ",
            "&Hstrok;": "Ħ",
            "&HumpDownHump;": "≎",
            "&HumpEqual;": "≏",
            "&IEcy;": "Е",
            "&IJlig;": "Ĳ",
            "&IOcy;": "Ё",
            "&Iacute": "\xcd",
            "&Iacute;": "\xcd",
            "&Icirc": "\xce",
            "&Icirc;": "\xce",
            "&Icy;": "И",
            "&Idot;": "İ",
            "&Ifr;": "ℑ",
            "&Igrave": "\xcc",
            "&Igrave;": "\xcc",
            "&Im;": "ℑ",
            "&Imacr;": "Ī",
            "&ImaginaryI;": "ⅈ",
            "&Implies;": "⇒",
            "&Int;": "∬",
            "&Integral;": "∫",
            "&Intersection;": "⋂",
            "&InvisibleComma;": "⁣",
            "&InvisibleTimes;": "⁢",
            "&Iogon;": "Į",
            "&Iopf;": "\uD835\uDD40",
            "&Iota;": "Ι",
            "&Iscr;": "ℐ",
            "&Itilde;": "Ĩ",
            "&Iukcy;": "І",
            "&Iuml": "\xcf",
            "&Iuml;": "\xcf",
            "&Jcirc;": "Ĵ",
            "&Jcy;": "Й",
            "&Jfr;": "\uD835\uDD0D",
            "&Jopf;": "\uD835\uDD41",
            "&Jscr;": "\uD835\uDCA5",
            "&Jsercy;": "Ј",
            "&Jukcy;": "Є",
            "&KHcy;": "Х",
            "&KJcy;": "Ќ",
            "&Kappa;": "Κ",
            "&Kcedil;": "Ķ",
            "&Kcy;": "К",
            "&Kfr;": "\uD835\uDD0E",
            "&Kopf;": "\uD835\uDD42",
            "&Kscr;": "\uD835\uDCA6",
            "&LJcy;": "Љ",
            "&LT": "<",
            "&LT;": "<",
            "&Lacute;": "Ĺ",
            "&Lambda;": "Λ",
            "&Lang;": "⟪",
            "&Laplacetrf;": "ℒ",
            "&Larr;": "↞",
            "&Lcaron;": "Ľ",
            "&Lcedil;": "Ļ",
            "&Lcy;": "Л",
            "&LeftAngleBracket;": "⟨",
            "&LeftArrow;": "←",
            "&LeftArrowBar;": "⇤",
            "&LeftArrowRightArrow;": "⇆",
            "&LeftCeiling;": "⌈",
            "&LeftDoubleBracket;": "⟦",
            "&LeftDownTeeVector;": "⥡",
            "&LeftDownVector;": "⇃",
            "&LeftDownVectorBar;": "⥙",
            "&LeftFloor;": "⌊",
            "&LeftRightArrow;": "↔",
            "&LeftRightVector;": "⥎",
            "&LeftTee;": "⊣",
            "&LeftTeeArrow;": "↤",
            "&LeftTeeVector;": "⥚",
            "&LeftTriangle;": "⊲",
            "&LeftTriangleBar;": "⧏",
            "&LeftTriangleEqual;": "⊴",
            "&LeftUpDownVector;": "⥑",
            "&LeftUpTeeVector;": "⥠",
            "&LeftUpVector;": "↿",
            "&LeftUpVectorBar;": "⥘",
            "&LeftVector;": "↼",
            "&LeftVectorBar;": "⥒",
            "&Leftarrow;": "⇐",
            "&Leftrightarrow;": "⇔",
            "&LessEqualGreater;": "⋚",
            "&LessFullEqual;": "≦",
            "&LessGreater;": "≶",
            "&LessLess;": "⪡",
            "&LessSlantEqual;": "⩽",
            "&LessTilde;": "≲",
            "&Lfr;": "\uD835\uDD0F",
            "&Ll;": "⋘",
            "&Lleftarrow;": "⇚",
            "&Lmidot;": "Ŀ",
            "&LongLeftArrow;": "⟵",
            "&LongLeftRightArrow;": "⟷",
            "&LongRightArrow;": "⟶",
            "&Longleftarrow;": "⟸",
            "&Longleftrightarrow;": "⟺",
            "&Longrightarrow;": "⟹",
            "&Lopf;": "\uD835\uDD43",
            "&LowerLeftArrow;": "↙",
            "&LowerRightArrow;": "↘",
            "&Lscr;": "ℒ",
            "&Lsh;": "↰",
            "&Lstrok;": "Ł",
            "&Lt;": "≪",
            "&Map;": "⤅",
            "&Mcy;": "М",
            "&MediumSpace;": " ",
            "&Mellintrf;": "ℳ",
            "&Mfr;": "\uD835\uDD10",
            "&MinusPlus;": "∓",
            "&Mopf;": "\uD835\uDD44",
            "&Mscr;": "ℳ",
            "&Mu;": "Μ",
            "&NJcy;": "Њ",
            "&Nacute;": "Ń",
            "&Ncaron;": "Ň",
            "&Ncedil;": "Ņ",
            "&Ncy;": "Н",
            "&NegativeMediumSpace;": "​",
            "&NegativeThickSpace;": "​",
            "&NegativeThinSpace;": "​",
            "&NegativeVeryThinSpace;": "​",
            "&NestedGreaterGreater;": "≫",
            "&NestedLessLess;": "≪",
            "&NewLine;": "\n",
            "&Nfr;": "\uD835\uDD11",
            "&NoBreak;": "⁠",
            "&NonBreakingSpace;": "\xa0",
            "&Nopf;": "ℕ",
            "&Not;": "⫬",
            "&NotCongruent;": "≢",
            "&NotCupCap;": "≭",
            "&NotDoubleVerticalBar;": "∦",
            "&NotElement;": "∉",
            "&NotEqual;": "≠",
            "&NotEqualTilde;": "≂̸",
            "&NotExists;": "∄",
            "&NotGreater;": "≯",
            "&NotGreaterEqual;": "≱",
            "&NotGreaterFullEqual;": "≧̸",
            "&NotGreaterGreater;": "≫̸",
            "&NotGreaterLess;": "≹",
            "&NotGreaterSlantEqual;": "⩾̸",
            "&NotGreaterTilde;": "≵",
            "&NotHumpDownHump;": "≎̸",
            "&NotHumpEqual;": "≏̸",
            "&NotLeftTriangle;": "⋪",
            "&NotLeftTriangleBar;": "⧏̸",
            "&NotLeftTriangleEqual;": "⋬",
            "&NotLess;": "≮",
            "&NotLessEqual;": "≰",
            "&NotLessGreater;": "≸",
            "&NotLessLess;": "≪̸",
            "&NotLessSlantEqual;": "⩽̸",
            "&NotLessTilde;": "≴",
            "&NotNestedGreaterGreater;": "⪢̸",
            "&NotNestedLessLess;": "⪡̸",
            "&NotPrecedes;": "⊀",
            "&NotPrecedesEqual;": "⪯̸",
            "&NotPrecedesSlantEqual;": "⋠",
            "&NotReverseElement;": "∌",
            "&NotRightTriangle;": "⋫",
            "&NotRightTriangleBar;": "⧐̸",
            "&NotRightTriangleEqual;": "⋭",
            "&NotSquareSubset;": "⊏̸",
            "&NotSquareSubsetEqual;": "⋢",
            "&NotSquareSuperset;": "⊐̸",
            "&NotSquareSupersetEqual;": "⋣",
            "&NotSubset;": "⊂⃒",
            "&NotSubsetEqual;": "⊈",
            "&NotSucceeds;": "⊁",
            "&NotSucceedsEqual;": "⪰̸",
            "&NotSucceedsSlantEqual;": "⋡",
            "&NotSucceedsTilde;": "≿̸",
            "&NotSuperset;": "⊃⃒",
            "&NotSupersetEqual;": "⊉",
            "&NotTilde;": "≁",
            "&NotTildeEqual;": "≄",
            "&NotTildeFullEqual;": "≇",
            "&NotTildeTilde;": "≉",
            "&NotVerticalBar;": "∤",
            "&Nscr;": "\uD835\uDCA9",
            "&Ntilde": "\xd1",
            "&Ntilde;": "\xd1",
            "&Nu;": "Ν",
            "&OElig;": "Œ",
            "&Oacute": "\xd3",
            "&Oacute;": "\xd3",
            "&Ocirc": "\xd4",
            "&Ocirc;": "\xd4",
            "&Ocy;": "О",
            "&Odblac;": "Ő",
            "&Ofr;": "\uD835\uDD12",
            "&Ograve": "\xd2",
            "&Ograve;": "\xd2",
            "&Omacr;": "Ō",
            "&Omega;": "Ω",
            "&Omicron;": "Ο",
            "&Oopf;": "\uD835\uDD46",
            "&OpenCurlyDoubleQuote;": "“",
            "&OpenCurlyQuote;": "‘",
            "&Or;": "⩔",
            "&Oscr;": "\uD835\uDCAA",
            "&Oslash": "\xd8",
            "&Oslash;": "\xd8",
            "&Otilde": "\xd5",
            "&Otilde;": "\xd5",
            "&Otimes;": "⨷",
            "&Ouml": "\xd6",
            "&Ouml;": "\xd6",
            "&OverBar;": "‾",
            "&OverBrace;": "⏞",
            "&OverBracket;": "⎴",
            "&OverParenthesis;": "⏜",
            "&PartialD;": "∂",
            "&Pcy;": "П",
            "&Pfr;": "\uD835\uDD13",
            "&Phi;": "Φ",
            "&Pi;": "Π",
            "&PlusMinus;": "\xb1",
            "&Poincareplane;": "ℌ",
            "&Popf;": "ℙ",
            "&Pr;": "⪻",
            "&Precedes;": "≺",
            "&PrecedesEqual;": "⪯",
            "&PrecedesSlantEqual;": "≼",
            "&PrecedesTilde;": "≾",
            "&Prime;": "″",
            "&Product;": "∏",
            "&Proportion;": "∷",
            "&Proportional;": "∝",
            "&Pscr;": "\uD835\uDCAB",
            "&Psi;": "Ψ",
            "&QUOT": '"',
            "&QUOT;": '"',
            "&Qfr;": "\uD835\uDD14",
            "&Qopf;": "ℚ",
            "&Qscr;": "\uD835\uDCAC",
            "&RBarr;": "⤐",
            "&REG": "\xae",
            "&REG;": "\xae",
            "&Racute;": "Ŕ",
            "&Rang;": "⟫",
            "&Rarr;": "↠",
            "&Rarrtl;": "⤖",
            "&Rcaron;": "Ř",
            "&Rcedil;": "Ŗ",
            "&Rcy;": "Р",
            "&Re;": "ℜ",
            "&ReverseElement;": "∋",
            "&ReverseEquilibrium;": "⇋",
            "&ReverseUpEquilibrium;": "⥯",
            "&Rfr;": "ℜ",
            "&Rho;": "Ρ",
            "&RightAngleBracket;": "⟩",
            "&RightArrow;": "→",
            "&RightArrowBar;": "⇥",
            "&RightArrowLeftArrow;": "⇄",
            "&RightCeiling;": "⌉",
            "&RightDoubleBracket;": "⟧",
            "&RightDownTeeVector;": "⥝",
            "&RightDownVector;": "⇂",
            "&RightDownVectorBar;": "⥕",
            "&RightFloor;": "⌋",
            "&RightTee;": "⊢",
            "&RightTeeArrow;": "↦",
            "&RightTeeVector;": "⥛",
            "&RightTriangle;": "⊳",
            "&RightTriangleBar;": "⧐",
            "&RightTriangleEqual;": "⊵",
            "&RightUpDownVector;": "⥏",
            "&RightUpTeeVector;": "⥜",
            "&RightUpVector;": "↾",
            "&RightUpVectorBar;": "⥔",
            "&RightVector;": "⇀",
            "&RightVectorBar;": "⥓",
            "&Rightarrow;": "⇒",
            "&Ropf;": "ℝ",
            "&RoundImplies;": "⥰",
            "&Rrightarrow;": "⇛",
            "&Rscr;": "ℛ",
            "&Rsh;": "↱",
            "&RuleDelayed;": "⧴",
            "&SHCHcy;": "Щ",
            "&SHcy;": "Ш",
            "&SOFTcy;": "Ь",
            "&Sacute;": "Ś",
            "&Sc;": "⪼",
            "&Scaron;": "Š",
            "&Scedil;": "Ş",
            "&Scirc;": "Ŝ",
            "&Scy;": "С",
            "&Sfr;": "\uD835\uDD16",
            "&ShortDownArrow;": "↓",
            "&ShortLeftArrow;": "←",
            "&ShortRightArrow;": "→",
            "&ShortUpArrow;": "↑",
            "&Sigma;": "Σ",
            "&SmallCircle;": "∘",
            "&Sopf;": "\uD835\uDD4A",
            "&Sqrt;": "√",
            "&Square;": "□",
            "&SquareIntersection;": "⊓",
            "&SquareSubset;": "⊏",
            "&SquareSubsetEqual;": "⊑",
            "&SquareSuperset;": "⊐",
            "&SquareSupersetEqual;": "⊒",
            "&SquareUnion;": "⊔",
            "&Sscr;": "\uD835\uDCAE",
            "&Star;": "⋆",
            "&Sub;": "⋐",
            "&Subset;": "⋐",
            "&SubsetEqual;": "⊆",
            "&Succeeds;": "≻",
            "&SucceedsEqual;": "⪰",
            "&SucceedsSlantEqual;": "≽",
            "&SucceedsTilde;": "≿",
            "&SuchThat;": "∋",
            "&Sum;": "∑",
            "&Sup;": "⋑",
            "&Superset;": "⊃",
            "&SupersetEqual;": "⊇",
            "&Supset;": "⋑",
            "&THORN": "\xde",
            "&THORN;": "\xde",
            "&TRADE;": "™",
            "&TSHcy;": "Ћ",
            "&TScy;": "Ц",
            "&Tab;": "	",
            "&Tau;": "Τ",
            "&Tcaron;": "Ť",
            "&Tcedil;": "Ţ",
            "&Tcy;": "Т",
            "&Tfr;": "\uD835\uDD17",
            "&Therefore;": "∴",
            "&Theta;": "Θ",
            "&ThickSpace;": "  ",
            "&ThinSpace;": " ",
            "&Tilde;": "∼",
            "&TildeEqual;": "≃",
            "&TildeFullEqual;": "≅",
            "&TildeTilde;": "≈",
            "&Topf;": "\uD835\uDD4B",
            "&TripleDot;": "⃛",
            "&Tscr;": "\uD835\uDCAF",
            "&Tstrok;": "Ŧ",
            "&Uacute": "\xda",
            "&Uacute;": "\xda",
            "&Uarr;": "↟",
            "&Uarrocir;": "⥉",
            "&Ubrcy;": "Ў",
            "&Ubreve;": "Ŭ",
            "&Ucirc": "\xdb",
            "&Ucirc;": "\xdb",
            "&Ucy;": "У",
            "&Udblac;": "Ű",
            "&Ufr;": "\uD835\uDD18",
            "&Ugrave": "\xd9",
            "&Ugrave;": "\xd9",
            "&Umacr;": "Ū",
            "&UnderBar;": "_",
            "&UnderBrace;": "⏟",
            "&UnderBracket;": "⎵",
            "&UnderParenthesis;": "⏝",
            "&Union;": "⋃",
            "&UnionPlus;": "⊎",
            "&Uogon;": "Ų",
            "&Uopf;": "\uD835\uDD4C",
            "&UpArrow;": "↑",
            "&UpArrowBar;": "⤒",
            "&UpArrowDownArrow;": "⇅",
            "&UpDownArrow;": "↕",
            "&UpEquilibrium;": "⥮",
            "&UpTee;": "⊥",
            "&UpTeeArrow;": "↥",
            "&Uparrow;": "⇑",
            "&Updownarrow;": "⇕",
            "&UpperLeftArrow;": "↖",
            "&UpperRightArrow;": "↗",
            "&Upsi;": "ϒ",
            "&Upsilon;": "Υ",
            "&Uring;": "Ů",
            "&Uscr;": "\uD835\uDCB0",
            "&Utilde;": "Ũ",
            "&Uuml": "\xdc",
            "&Uuml;": "\xdc",
            "&VDash;": "⊫",
            "&Vbar;": "⫫",
            "&Vcy;": "В",
            "&Vdash;": "⊩",
            "&Vdashl;": "⫦",
            "&Vee;": "⋁",
            "&Verbar;": "‖",
            "&Vert;": "‖",
            "&VerticalBar;": "∣",
            "&VerticalLine;": "|",
            "&VerticalSeparator;": "❘",
            "&VerticalTilde;": "≀",
            "&VeryThinSpace;": " ",
            "&Vfr;": "\uD835\uDD19",
            "&Vopf;": "\uD835\uDD4D",
            "&Vscr;": "\uD835\uDCB1",
            "&Vvdash;": "⊪",
            "&Wcirc;": "Ŵ",
            "&Wedge;": "⋀",
            "&Wfr;": "\uD835\uDD1A",
            "&Wopf;": "\uD835\uDD4E",
            "&Wscr;": "\uD835\uDCB2",
            "&Xfr;": "\uD835\uDD1B",
            "&Xi;": "Ξ",
            "&Xopf;": "\uD835\uDD4F",
            "&Xscr;": "\uD835\uDCB3",
            "&YAcy;": "Я",
            "&YIcy;": "Ї",
            "&YUcy;": "Ю",
            "&Yacute": "\xdd",
            "&Yacute;": "\xdd",
            "&Ycirc;": "Ŷ",
            "&Ycy;": "Ы",
            "&Yfr;": "\uD835\uDD1C",
            "&Yopf;": "\uD835\uDD50",
            "&Yscr;": "\uD835\uDCB4",
            "&Yuml;": "Ÿ",
            "&ZHcy;": "Ж",
            "&Zacute;": "Ź",
            "&Zcaron;": "Ž",
            "&Zcy;": "З",
            "&Zdot;": "Ż",
            "&ZeroWidthSpace;": "​",
            "&Zeta;": "Ζ",
            "&Zfr;": "ℨ",
            "&Zopf;": "ℤ",
            "&Zscr;": "\uD835\uDCB5",
            "&aacute": "\xe1",
            "&aacute;": "\xe1",
            "&abreve;": "ă",
            "&ac;": "∾",
            "&acE;": "∾̳",
            "&acd;": "∿",
            "&acirc": "\xe2",
            "&acirc;": "\xe2",
            "&acute": "\xb4",
            "&acute;": "\xb4",
            "&acy;": "а",
            "&aelig": "\xe6",
            "&aelig;": "\xe6",
            "&af;": "⁡",
            "&afr;": "\uD835\uDD1E",
            "&agrave": "\xe0",
            "&agrave;": "\xe0",
            "&alefsym;": "ℵ",
            "&aleph;": "ℵ",
            "&alpha;": "α",
            "&amacr;": "ā",
            "&amalg;": "⨿",
            "&amp": "&",
            "&amp;": "&",
            "&and;": "∧",
            "&andand;": "⩕",
            "&andd;": "⩜",
            "&andslope;": "⩘",
            "&andv;": "⩚",
            "&ang;": "∠",
            "&ange;": "⦤",
            "&angle;": "∠",
            "&angmsd;": "∡",
            "&angmsdaa;": "⦨",
            "&angmsdab;": "⦩",
            "&angmsdac;": "⦪",
            "&angmsdad;": "⦫",
            "&angmsdae;": "⦬",
            "&angmsdaf;": "⦭",
            "&angmsdag;": "⦮",
            "&angmsdah;": "⦯",
            "&angrt;": "∟",
            "&angrtvb;": "⊾",
            "&angrtvbd;": "⦝",
            "&angsph;": "∢",
            "&angst;": "\xc5",
            "&angzarr;": "⍼",
            "&aogon;": "ą",
            "&aopf;": "\uD835\uDD52",
            "&ap;": "≈",
            "&apE;": "⩰",
            "&apacir;": "⩯",
            "&ape;": "≊",
            "&apid;": "≋",
            "&apos;": "'",
            "&approx;": "≈",
            "&approxeq;": "≊",
            "&aring": "\xe5",
            "&aring;": "\xe5",
            "&ascr;": "\uD835\uDCB6",
            "&ast;": "*",
            "&asymp;": "≈",
            "&asympeq;": "≍",
            "&atilde": "\xe3",
            "&atilde;": "\xe3",
            "&auml": "\xe4",
            "&auml;": "\xe4",
            "&awconint;": "∳",
            "&awint;": "⨑",
            "&bNot;": "⫭",
            "&backcong;": "≌",
            "&backepsilon;": "϶",
            "&backprime;": "‵",
            "&backsim;": "∽",
            "&backsimeq;": "⋍",
            "&barvee;": "⊽",
            "&barwed;": "⌅",
            "&barwedge;": "⌅",
            "&bbrk;": "⎵",
            "&bbrktbrk;": "⎶",
            "&bcong;": "≌",
            "&bcy;": "б",
            "&bdquo;": "„",
            "&becaus;": "∵",
            "&because;": "∵",
            "&bemptyv;": "⦰",
            "&bepsi;": "϶",
            "&bernou;": "ℬ",
            "&beta;": "β",
            "&beth;": "ℶ",
            "&between;": "≬",
            "&bfr;": "\uD835\uDD1F",
            "&bigcap;": "⋂",
            "&bigcirc;": "◯",
            "&bigcup;": "⋃",
            "&bigodot;": "⨀",
            "&bigoplus;": "⨁",
            "&bigotimes;": "⨂",
            "&bigsqcup;": "⨆",
            "&bigstar;": "★",
            "&bigtriangledown;": "▽",
            "&bigtriangleup;": "△",
            "&biguplus;": "⨄",
            "&bigvee;": "⋁",
            "&bigwedge;": "⋀",
            "&bkarow;": "⤍",
            "&blacklozenge;": "⧫",
            "&blacksquare;": "▪",
            "&blacktriangle;": "▴",
            "&blacktriangledown;": "▾",
            "&blacktriangleleft;": "◂",
            "&blacktriangleright;": "▸",
            "&blank;": "␣",
            "&blk12;": "▒",
            "&blk14;": "░",
            "&blk34;": "▓",
            "&block;": "█",
            "&bne;": "=⃥",
            "&bnequiv;": "≡⃥",
            "&bnot;": "⌐",
            "&bopf;": "\uD835\uDD53",
            "&bot;": "⊥",
            "&bottom;": "⊥",
            "&bowtie;": "⋈",
            "&boxDL;": "╗",
            "&boxDR;": "╔",
            "&boxDl;": "╖",
            "&boxDr;": "╓",
            "&boxH;": "═",
            "&boxHD;": "╦",
            "&boxHU;": "╩",
            "&boxHd;": "╤",
            "&boxHu;": "╧",
            "&boxUL;": "╝",
            "&boxUR;": "╚",
            "&boxUl;": "╜",
            "&boxUr;": "╙",
            "&boxV;": "║",
            "&boxVH;": "╬",
            "&boxVL;": "╣",
            "&boxVR;": "╠",
            "&boxVh;": "╫",
            "&boxVl;": "╢",
            "&boxVr;": "╟",
            "&boxbox;": "⧉",
            "&boxdL;": "╕",
            "&boxdR;": "╒",
            "&boxdl;": "┐",
            "&boxdr;": "┌",
            "&boxh;": "─",
            "&boxhD;": "╥",
            "&boxhU;": "╨",
            "&boxhd;": "┬",
            "&boxhu;": "┴",
            "&boxminus;": "⊟",
            "&boxplus;": "⊞",
            "&boxtimes;": "⊠",
            "&boxuL;": "╛",
            "&boxuR;": "╘",
            "&boxul;": "┘",
            "&boxur;": "└",
            "&boxv;": "│",
            "&boxvH;": "╪",
            "&boxvL;": "╡",
            "&boxvR;": "╞",
            "&boxvh;": "┼",
            "&boxvl;": "┤",
            "&boxvr;": "├",
            "&bprime;": "‵",
            "&breve;": "˘",
            "&brvbar": "\xa6",
            "&brvbar;": "\xa6",
            "&bscr;": "\uD835\uDCB7",
            "&bsemi;": "⁏",
            "&bsim;": "∽",
            "&bsime;": "⋍",
            "&bsol;": "\\",
            "&bsolb;": "⧅",
            "&bsolhsub;": "⟈",
            "&bull;": "•",
            "&bullet;": "•",
            "&bump;": "≎",
            "&bumpE;": "⪮",
            "&bumpe;": "≏",
            "&bumpeq;": "≏",
            "&cacute;": "ć",
            "&cap;": "∩",
            "&capand;": "⩄",
            "&capbrcup;": "⩉",
            "&capcap;": "⩋",
            "&capcup;": "⩇",
            "&capdot;": "⩀",
            "&caps;": "∩︀",
            "&caret;": "⁁",
            "&caron;": "ˇ",
            "&ccaps;": "⩍",
            "&ccaron;": "č",
            "&ccedil": "\xe7",
            "&ccedil;": "\xe7",
            "&ccirc;": "ĉ",
            "&ccups;": "⩌",
            "&ccupssm;": "⩐",
            "&cdot;": "ċ",
            "&cedil": "\xb8",
            "&cedil;": "\xb8",
            "&cemptyv;": "⦲",
            "&cent": "\xa2",
            "&cent;": "\xa2",
            "&centerdot;": "\xb7",
            "&cfr;": "\uD835\uDD20",
            "&chcy;": "ч",
            "&check;": "✓",
            "&checkmark;": "✓",
            "&chi;": "χ",
            "&cir;": "○",
            "&cirE;": "⧃",
            "&circ;": "ˆ",
            "&circeq;": "≗",
            "&circlearrowleft;": "↺",
            "&circlearrowright;": "↻",
            "&circledR;": "\xae",
            "&circledS;": "Ⓢ",
            "&circledast;": "⊛",
            "&circledcirc;": "⊚",
            "&circleddash;": "⊝",
            "&cire;": "≗",
            "&cirfnint;": "⨐",
            "&cirmid;": "⫯",
            "&cirscir;": "⧂",
            "&clubs;": "♣",
            "&clubsuit;": "♣",
            "&colon;": ":",
            "&colone;": "≔",
            "&coloneq;": "≔",
            "&comma;": ",",
            "&commat;": "@",
            "&comp;": "∁",
            "&compfn;": "∘",
            "&complement;": "∁",
            "&complexes;": "ℂ",
            "&cong;": "≅",
            "&congdot;": "⩭",
            "&conint;": "∮",
            "&copf;": "\uD835\uDD54",
            "&coprod;": "∐",
            "&copy": "\xa9",
            "&copy;": "\xa9",
            "&copysr;": "℗",
            "&crarr;": "↵",
            "&cross;": "✗",
            "&cscr;": "\uD835\uDCB8",
            "&csub;": "⫏",
            "&csube;": "⫑",
            "&csup;": "⫐",
            "&csupe;": "⫒",
            "&ctdot;": "⋯",
            "&cudarrl;": "⤸",
            "&cudarrr;": "⤵",
            "&cuepr;": "⋞",
            "&cuesc;": "⋟",
            "&cularr;": "↶",
            "&cularrp;": "⤽",
            "&cup;": "∪",
            "&cupbrcap;": "⩈",
            "&cupcap;": "⩆",
            "&cupcup;": "⩊",
            "&cupdot;": "⊍",
            "&cupor;": "⩅",
            "&cups;": "∪︀",
            "&curarr;": "↷",
            "&curarrm;": "⤼",
            "&curlyeqprec;": "⋞",
            "&curlyeqsucc;": "⋟",
            "&curlyvee;": "⋎",
            "&curlywedge;": "⋏",
            "&curren": "\xa4",
            "&curren;": "\xa4",
            "&curvearrowleft;": "↶",
            "&curvearrowright;": "↷",
            "&cuvee;": "⋎",
            "&cuwed;": "⋏",
            "&cwconint;": "∲",
            "&cwint;": "∱",
            "&cylcty;": "⌭",
            "&dArr;": "⇓",
            "&dHar;": "⥥",
            "&dagger;": "†",
            "&daleth;": "ℸ",
            "&darr;": "↓",
            "&dash;": "‐",
            "&dashv;": "⊣",
            "&dbkarow;": "⤏",
            "&dblac;": "˝",
            "&dcaron;": "ď",
            "&dcy;": "д",
            "&dd;": "ⅆ",
            "&ddagger;": "‡",
            "&ddarr;": "⇊",
            "&ddotseq;": "⩷",
            "&deg": "\xb0",
            "&deg;": "\xb0",
            "&delta;": "δ",
            "&demptyv;": "⦱",
            "&dfisht;": "⥿",
            "&dfr;": "\uD835\uDD21",
            "&dharl;": "⇃",
            "&dharr;": "⇂",
            "&diam;": "⋄",
            "&diamond;": "⋄",
            "&diamondsuit;": "♦",
            "&diams;": "♦",
            "&die;": "\xa8",
            "&digamma;": "ϝ",
            "&disin;": "⋲",
            "&div;": "\xf7",
            "&divide": "\xf7",
            "&divide;": "\xf7",
            "&divideontimes;": "⋇",
            "&divonx;": "⋇",
            "&djcy;": "ђ",
            "&dlcorn;": "⌞",
            "&dlcrop;": "⌍",
            "&dollar;": "$",
            "&dopf;": "\uD835\uDD55",
            "&dot;": "˙",
            "&doteq;": "≐",
            "&doteqdot;": "≑",
            "&dotminus;": "∸",
            "&dotplus;": "∔",
            "&dotsquare;": "⊡",
            "&doublebarwedge;": "⌆",
            "&downarrow;": "↓",
            "&downdownarrows;": "⇊",
            "&downharpoonleft;": "⇃",
            "&downharpoonright;": "⇂",
            "&drbkarow;": "⤐",
            "&drcorn;": "⌟",
            "&drcrop;": "⌌",
            "&dscr;": "\uD835\uDCB9",
            "&dscy;": "ѕ",
            "&dsol;": "⧶",
            "&dstrok;": "đ",
            "&dtdot;": "⋱",
            "&dtri;": "▿",
            "&dtrif;": "▾",
            "&duarr;": "⇵",
            "&duhar;": "⥯",
            "&dwangle;": "⦦",
            "&dzcy;": "џ",
            "&dzigrarr;": "⟿",
            "&eDDot;": "⩷",
            "&eDot;": "≑",
            "&eacute": "\xe9",
            "&eacute;": "\xe9",
            "&easter;": "⩮",
            "&ecaron;": "ě",
            "&ecir;": "≖",
            "&ecirc": "\xea",
            "&ecirc;": "\xea",
            "&ecolon;": "≕",
            "&ecy;": "э",
            "&edot;": "ė",
            "&ee;": "ⅇ",
            "&efDot;": "≒",
            "&efr;": "\uD835\uDD22",
            "&eg;": "⪚",
            "&egrave": "\xe8",
            "&egrave;": "\xe8",
            "&egs;": "⪖",
            "&egsdot;": "⪘",
            "&el;": "⪙",
            "&elinters;": "⏧",
            "&ell;": "ℓ",
            "&els;": "⪕",
            "&elsdot;": "⪗",
            "&emacr;": "ē",
            "&empty;": "∅",
            "&emptyset;": "∅",
            "&emptyv;": "∅",
            "&emsp13;": " ",
            "&emsp14;": " ",
            "&emsp;": " ",
            "&eng;": "ŋ",
            "&ensp;": " ",
            "&eogon;": "ę",
            "&eopf;": "\uD835\uDD56",
            "&epar;": "⋕",
            "&eparsl;": "⧣",
            "&eplus;": "⩱",
            "&epsi;": "ε",
            "&epsilon;": "ε",
            "&epsiv;": "ϵ",
            "&eqcirc;": "≖",
            "&eqcolon;": "≕",
            "&eqsim;": "≂",
            "&eqslantgtr;": "⪖",
            "&eqslantless;": "⪕",
            "&equals;": "=",
            "&equest;": "≟",
            "&equiv;": "≡",
            "&equivDD;": "⩸",
            "&eqvparsl;": "⧥",
            "&erDot;": "≓",
            "&erarr;": "⥱",
            "&escr;": "ℯ",
            "&esdot;": "≐",
            "&esim;": "≂",
            "&eta;": "η",
            "&eth": "\xf0",
            "&eth;": "\xf0",
            "&euml": "\xeb",
            "&euml;": "\xeb",
            "&euro;": "€",
            "&excl;": "!",
            "&exist;": "∃",
            "&expectation;": "ℰ",
            "&exponentiale;": "ⅇ",
            "&fallingdotseq;": "≒",
            "&fcy;": "ф",
            "&female;": "♀",
            "&ffilig;": "ﬃ",
            "&fflig;": "ﬀ",
            "&ffllig;": "ﬄ",
            "&ffr;": "\uD835\uDD23",
            "&filig;": "ﬁ",
            "&fjlig;": "fj",
            "&flat;": "♭",
            "&fllig;": "ﬂ",
            "&fltns;": "▱",
            "&fnof;": "ƒ",
            "&fopf;": "\uD835\uDD57",
            "&forall;": "∀",
            "&fork;": "⋔",
            "&forkv;": "⫙",
            "&fpartint;": "⨍",
            "&frac12": "\xbd",
            "&frac12;": "\xbd",
            "&frac13;": "⅓",
            "&frac14": "\xbc",
            "&frac14;": "\xbc",
            "&frac15;": "⅕",
            "&frac16;": "⅙",
            "&frac18;": "⅛",
            "&frac23;": "⅔",
            "&frac25;": "⅖",
            "&frac34": "\xbe",
            "&frac34;": "\xbe",
            "&frac35;": "⅗",
            "&frac38;": "⅜",
            "&frac45;": "⅘",
            "&frac56;": "⅚",
            "&frac58;": "⅝",
            "&frac78;": "⅞",
            "&frasl;": "⁄",
            "&frown;": "⌢",
            "&fscr;": "\uD835\uDCBB",
            "&gE;": "≧",
            "&gEl;": "⪌",
            "&gacute;": "ǵ",
            "&gamma;": "γ",
            "&gammad;": "ϝ",
            "&gap;": "⪆",
            "&gbreve;": "ğ",
            "&gcirc;": "ĝ",
            "&gcy;": "г",
            "&gdot;": "ġ",
            "&ge;": "≥",
            "&gel;": "⋛",
            "&geq;": "≥",
            "&geqq;": "≧",
            "&geqslant;": "⩾",
            "&ges;": "⩾",
            "&gescc;": "⪩",
            "&gesdot;": "⪀",
            "&gesdoto;": "⪂",
            "&gesdotol;": "⪄",
            "&gesl;": "⋛︀",
            "&gesles;": "⪔",
            "&gfr;": "\uD835\uDD24",
            "&gg;": "≫",
            "&ggg;": "⋙",
            "&gimel;": "ℷ",
            "&gjcy;": "ѓ",
            "&gl;": "≷",
            "&glE;": "⪒",
            "&gla;": "⪥",
            "&glj;": "⪤",
            "&gnE;": "≩",
            "&gnap;": "⪊",
            "&gnapprox;": "⪊",
            "&gne;": "⪈",
            "&gneq;": "⪈",
            "&gneqq;": "≩",
            "&gnsim;": "⋧",
            "&gopf;": "\uD835\uDD58",
            "&grave;": "`",
            "&gscr;": "ℊ",
            "&gsim;": "≳",
            "&gsime;": "⪎",
            "&gsiml;": "⪐",
            "&gt": ">",
            "&gt;": ">",
            "&gtcc;": "⪧",
            "&gtcir;": "⩺",
            "&gtdot;": "⋗",
            "&gtlPar;": "⦕",
            "&gtquest;": "⩼",
            "&gtrapprox;": "⪆",
            "&gtrarr;": "⥸",
            "&gtrdot;": "⋗",
            "&gtreqless;": "⋛",
            "&gtreqqless;": "⪌",
            "&gtrless;": "≷",
            "&gtrsim;": "≳",
            "&gvertneqq;": "≩︀",
            "&gvnE;": "≩︀",
            "&hArr;": "⇔",
            "&hairsp;": " ",
            "&half;": "\xbd",
            "&hamilt;": "ℋ",
            "&hardcy;": "ъ",
            "&harr;": "↔",
            "&harrcir;": "⥈",
            "&harrw;": "↭",
            "&hbar;": "ℏ",
            "&hcirc;": "ĥ",
            "&hearts;": "♥",
            "&heartsuit;": "♥",
            "&hellip;": "…",
            "&hercon;": "⊹",
            "&hfr;": "\uD835\uDD25",
            "&hksearow;": "⤥",
            "&hkswarow;": "⤦",
            "&hoarr;": "⇿",
            "&homtht;": "∻",
            "&hookleftarrow;": "↩",
            "&hookrightarrow;": "↪",
            "&hopf;": "\uD835\uDD59",
            "&horbar;": "―",
            "&hscr;": "\uD835\uDCBD",
            "&hslash;": "ℏ",
            "&hstrok;": "ħ",
            "&hybull;": "⁃",
            "&hyphen;": "‐",
            "&iacute": "\xed",
            "&iacute;": "\xed",
            "&ic;": "⁣",
            "&icirc": "\xee",
            "&icirc;": "\xee",
            "&icy;": "и",
            "&iecy;": "е",
            "&iexcl": "\xa1",
            "&iexcl;": "\xa1",
            "&iff;": "⇔",
            "&ifr;": "\uD835\uDD26",
            "&igrave": "\xec",
            "&igrave;": "\xec",
            "&ii;": "ⅈ",
            "&iiiint;": "⨌",
            "&iiint;": "∭",
            "&iinfin;": "⧜",
            "&iiota;": "℩",
            "&ijlig;": "ĳ",
            "&imacr;": "ī",
            "&image;": "ℑ",
            "&imagline;": "ℐ",
            "&imagpart;": "ℑ",
            "&imath;": "ı",
            "&imof;": "⊷",
            "&imped;": "Ƶ",
            "&in;": "∈",
            "&incare;": "℅",
            "&infin;": "∞",
            "&infintie;": "⧝",
            "&inodot;": "ı",
            "&int;": "∫",
            "&intcal;": "⊺",
            "&integers;": "ℤ",
            "&intercal;": "⊺",
            "&intlarhk;": "⨗",
            "&intprod;": "⨼",
            "&iocy;": "ё",
            "&iogon;": "į",
            "&iopf;": "\uD835\uDD5A",
            "&iota;": "ι",
            "&iprod;": "⨼",
            "&iquest": "\xbf",
            "&iquest;": "\xbf",
            "&iscr;": "\uD835\uDCBE",
            "&isin;": "∈",
            "&isinE;": "⋹",
            "&isindot;": "⋵",
            "&isins;": "⋴",
            "&isinsv;": "⋳",
            "&isinv;": "∈",
            "&it;": "⁢",
            "&itilde;": "ĩ",
            "&iukcy;": "і",
            "&iuml": "\xef",
            "&iuml;": "\xef",
            "&jcirc;": "ĵ",
            "&jcy;": "й",
            "&jfr;": "\uD835\uDD27",
            "&jmath;": "ȷ",
            "&jopf;": "\uD835\uDD5B",
            "&jscr;": "\uD835\uDCBF",
            "&jsercy;": "ј",
            "&jukcy;": "є",
            "&kappa;": "κ",
            "&kappav;": "ϰ",
            "&kcedil;": "ķ",
            "&kcy;": "к",
            "&kfr;": "\uD835\uDD28",
            "&kgreen;": "ĸ",
            "&khcy;": "х",
            "&kjcy;": "ќ",
            "&kopf;": "\uD835\uDD5C",
            "&kscr;": "\uD835\uDCC0",
            "&lAarr;": "⇚",
            "&lArr;": "⇐",
            "&lAtail;": "⤛",
            "&lBarr;": "⤎",
            "&lE;": "≦",
            "&lEg;": "⪋",
            "&lHar;": "⥢",
            "&lacute;": "ĺ",
            "&laemptyv;": "⦴",
            "&lagran;": "ℒ",
            "&lambda;": "λ",
            "&lang;": "⟨",
            "&langd;": "⦑",
            "&langle;": "⟨",
            "&lap;": "⪅",
            "&laquo": "\xab",
            "&laquo;": "\xab",
            "&larr;": "←",
            "&larrb;": "⇤",
            "&larrbfs;": "⤟",
            "&larrfs;": "⤝",
            "&larrhk;": "↩",
            "&larrlp;": "↫",
            "&larrpl;": "⤹",
            "&larrsim;": "⥳",
            "&larrtl;": "↢",
            "&lat;": "⪫",
            "&latail;": "⤙",
            "&late;": "⪭",
            "&lates;": "⪭︀",
            "&lbarr;": "⤌",
            "&lbbrk;": "❲",
            "&lbrace;": "{",
            "&lbrack;": "[",
            "&lbrke;": "⦋",
            "&lbrksld;": "⦏",
            "&lbrkslu;": "⦍",
            "&lcaron;": "ľ",
            "&lcedil;": "ļ",
            "&lceil;": "⌈",
            "&lcub;": "{",
            "&lcy;": "л",
            "&ldca;": "⤶",
            "&ldquo;": "“",
            "&ldquor;": "„",
            "&ldrdhar;": "⥧",
            "&ldrushar;": "⥋",
            "&ldsh;": "↲",
            "&le;": "≤",
            "&leftarrow;": "←",
            "&leftarrowtail;": "↢",
            "&leftharpoondown;": "↽",
            "&leftharpoonup;": "↼",
            "&leftleftarrows;": "⇇",
            "&leftrightarrow;": "↔",
            "&leftrightarrows;": "⇆",
            "&leftrightharpoons;": "⇋",
            "&leftrightsquigarrow;": "↭",
            "&leftthreetimes;": "⋋",
            "&leg;": "⋚",
            "&leq;": "≤",
            "&leqq;": "≦",
            "&leqslant;": "⩽",
            "&les;": "⩽",
            "&lescc;": "⪨",
            "&lesdot;": "⩿",
            "&lesdoto;": "⪁",
            "&lesdotor;": "⪃",
            "&lesg;": "⋚︀",
            "&lesges;": "⪓",
            "&lessapprox;": "⪅",
            "&lessdot;": "⋖",
            "&lesseqgtr;": "⋚",
            "&lesseqqgtr;": "⪋",
            "&lessgtr;": "≶",
            "&lesssim;": "≲",
            "&lfisht;": "⥼",
            "&lfloor;": "⌊",
            "&lfr;": "\uD835\uDD29",
            "&lg;": "≶",
            "&lgE;": "⪑",
            "&lhard;": "↽",
            "&lharu;": "↼",
            "&lharul;": "⥪",
            "&lhblk;": "▄",
            "&ljcy;": "љ",
            "&ll;": "≪",
            "&llarr;": "⇇",
            "&llcorner;": "⌞",
            "&llhard;": "⥫",
            "&lltri;": "◺",
            "&lmidot;": "ŀ",
            "&lmoust;": "⎰",
            "&lmoustache;": "⎰",
            "&lnE;": "≨",
            "&lnap;": "⪉",
            "&lnapprox;": "⪉",
            "&lne;": "⪇",
            "&lneq;": "⪇",
            "&lneqq;": "≨",
            "&lnsim;": "⋦",
            "&loang;": "⟬",
            "&loarr;": "⇽",
            "&lobrk;": "⟦",
            "&longleftarrow;": "⟵",
            "&longleftrightarrow;": "⟷",
            "&longmapsto;": "⟼",
            "&longrightarrow;": "⟶",
            "&looparrowleft;": "↫",
            "&looparrowright;": "↬",
            "&lopar;": "⦅",
            "&lopf;": "\uD835\uDD5D",
            "&loplus;": "⨭",
            "&lotimes;": "⨴",
            "&lowast;": "∗",
            "&lowbar;": "_",
            "&loz;": "◊",
            "&lozenge;": "◊",
            "&lozf;": "⧫",
            "&lpar;": "(",
            "&lparlt;": "⦓",
            "&lrarr;": "⇆",
            "&lrcorner;": "⌟",
            "&lrhar;": "⇋",
            "&lrhard;": "⥭",
            "&lrm;": "‎",
            "&lrtri;": "⊿",
            "&lsaquo;": "‹",
            "&lscr;": "\uD835\uDCC1",
            "&lsh;": "↰",
            "&lsim;": "≲",
            "&lsime;": "⪍",
            "&lsimg;": "⪏",
            "&lsqb;": "[",
            "&lsquo;": "‘",
            "&lsquor;": "‚",
            "&lstrok;": "ł",
            "&lt": "<",
            "&lt;": "<",
            "&ltcc;": "⪦",
            "&ltcir;": "⩹",
            "&ltdot;": "⋖",
            "&lthree;": "⋋",
            "&ltimes;": "⋉",
            "&ltlarr;": "⥶",
            "&ltquest;": "⩻",
            "&ltrPar;": "⦖",
            "&ltri;": "◃",
            "&ltrie;": "⊴",
            "&ltrif;": "◂",
            "&lurdshar;": "⥊",
            "&luruhar;": "⥦",
            "&lvertneqq;": "≨︀",
            "&lvnE;": "≨︀",
            "&mDDot;": "∺",
            "&macr": "\xaf",
            "&macr;": "\xaf",
            "&male;": "♂",
            "&malt;": "✠",
            "&maltese;": "✠",
            "&map;": "↦",
            "&mapsto;": "↦",
            "&mapstodown;": "↧",
            "&mapstoleft;": "↤",
            "&mapstoup;": "↥",
            "&marker;": "▮",
            "&mcomma;": "⨩",
            "&mcy;": "м",
            "&mdash;": "—",
            "&measuredangle;": "∡",
            "&mfr;": "\uD835\uDD2A",
            "&mho;": "℧",
            "&micro": "\xb5",
            "&micro;": "\xb5",
            "&mid;": "∣",
            "&midast;": "*",
            "&midcir;": "⫰",
            "&middot": "\xb7",
            "&middot;": "\xb7",
            "&minus;": "−",
            "&minusb;": "⊟",
            "&minusd;": "∸",
            "&minusdu;": "⨪",
            "&mlcp;": "⫛",
            "&mldr;": "…",
            "&mnplus;": "∓",
            "&models;": "⊧",
            "&mopf;": "\uD835\uDD5E",
            "&mp;": "∓",
            "&mscr;": "\uD835\uDCC2",
            "&mstpos;": "∾",
            "&mu;": "μ",
            "&multimap;": "⊸",
            "&mumap;": "⊸",
            "&nGg;": "⋙̸",
            "&nGt;": "≫⃒",
            "&nGtv;": "≫̸",
            "&nLeftarrow;": "⇍",
            "&nLeftrightarrow;": "⇎",
            "&nLl;": "⋘̸",
            "&nLt;": "≪⃒",
            "&nLtv;": "≪̸",
            "&nRightarrow;": "⇏",
            "&nVDash;": "⊯",
            "&nVdash;": "⊮",
            "&nabla;": "∇",
            "&nacute;": "ń",
            "&nang;": "∠⃒",
            "&nap;": "≉",
            "&napE;": "⩰̸",
            "&napid;": "≋̸",
            "&napos;": "ŉ",
            "&napprox;": "≉",
            "&natur;": "♮",
            "&natural;": "♮",
            "&naturals;": "ℕ",
            "&nbsp": "\xa0",
            "&nbsp;": "\xa0",
            "&nbump;": "≎̸",
            "&nbumpe;": "≏̸",
            "&ncap;": "⩃",
            "&ncaron;": "ň",
            "&ncedil;": "ņ",
            "&ncong;": "≇",
            "&ncongdot;": "⩭̸",
            "&ncup;": "⩂",
            "&ncy;": "н",
            "&ndash;": "–",
            "&ne;": "≠",
            "&neArr;": "⇗",
            "&nearhk;": "⤤",
            "&nearr;": "↗",
            "&nearrow;": "↗",
            "&nedot;": "≐̸",
            "&nequiv;": "≢",
            "&nesear;": "⤨",
            "&nesim;": "≂̸",
            "&nexist;": "∄",
            "&nexists;": "∄",
            "&nfr;": "\uD835\uDD2B",
            "&ngE;": "≧̸",
            "&nge;": "≱",
            "&ngeq;": "≱",
            "&ngeqq;": "≧̸",
            "&ngeqslant;": "⩾̸",
            "&nges;": "⩾̸",
            "&ngsim;": "≵",
            "&ngt;": "≯",
            "&ngtr;": "≯",
            "&nhArr;": "⇎",
            "&nharr;": "↮",
            "&nhpar;": "⫲",
            "&ni;": "∋",
            "&nis;": "⋼",
            "&nisd;": "⋺",
            "&niv;": "∋",
            "&njcy;": "њ",
            "&nlArr;": "⇍",
            "&nlE;": "≦̸",
            "&nlarr;": "↚",
            "&nldr;": "‥",
            "&nle;": "≰",
            "&nleftarrow;": "↚",
            "&nleftrightarrow;": "↮",
            "&nleq;": "≰",
            "&nleqq;": "≦̸",
            "&nleqslant;": "⩽̸",
            "&nles;": "⩽̸",
            "&nless;": "≮",
            "&nlsim;": "≴",
            "&nlt;": "≮",
            "&nltri;": "⋪",
            "&nltrie;": "⋬",
            "&nmid;": "∤",
            "&nopf;": "\uD835\uDD5F",
            "&not": "\xac",
            "&not;": "\xac",
            "&notin;": "∉",
            "&notinE;": "⋹̸",
            "&notindot;": "⋵̸",
            "&notinva;": "∉",
            "&notinvb;": "⋷",
            "&notinvc;": "⋶",
            "&notni;": "∌",
            "&notniva;": "∌",
            "&notnivb;": "⋾",
            "&notnivc;": "⋽",
            "&npar;": "∦",
            "&nparallel;": "∦",
            "&nparsl;": "⫽⃥",
            "&npart;": "∂̸",
            "&npolint;": "⨔",
            "&npr;": "⊀",
            "&nprcue;": "⋠",
            "&npre;": "⪯̸",
            "&nprec;": "⊀",
            "&npreceq;": "⪯̸",
            "&nrArr;": "⇏",
            "&nrarr;": "↛",
            "&nrarrc;": "⤳̸",
            "&nrarrw;": "↝̸",
            "&nrightarrow;": "↛",
            "&nrtri;": "⋫",
            "&nrtrie;": "⋭",
            "&nsc;": "⊁",
            "&nsccue;": "⋡",
            "&nsce;": "⪰̸",
            "&nscr;": "\uD835\uDCC3",
            "&nshortmid;": "∤",
            "&nshortparallel;": "∦",
            "&nsim;": "≁",
            "&nsime;": "≄",
            "&nsimeq;": "≄",
            "&nsmid;": "∤",
            "&nspar;": "∦",
            "&nsqsube;": "⋢",
            "&nsqsupe;": "⋣",
            "&nsub;": "⊄",
            "&nsubE;": "⫅̸",
            "&nsube;": "⊈",
            "&nsubset;": "⊂⃒",
            "&nsubseteq;": "⊈",
            "&nsubseteqq;": "⫅̸",
            "&nsucc;": "⊁",
            "&nsucceq;": "⪰̸",
            "&nsup;": "⊅",
            "&nsupE;": "⫆̸",
            "&nsupe;": "⊉",
            "&nsupset;": "⊃⃒",
            "&nsupseteq;": "⊉",
            "&nsupseteqq;": "⫆̸",
            "&ntgl;": "≹",
            "&ntilde": "\xf1",
            "&ntilde;": "\xf1",
            "&ntlg;": "≸",
            "&ntriangleleft;": "⋪",
            "&ntrianglelefteq;": "⋬",
            "&ntriangleright;": "⋫",
            "&ntrianglerighteq;": "⋭",
            "&nu;": "ν",
            "&num;": "#",
            "&numero;": "№",
            "&numsp;": " ",
            "&nvDash;": "⊭",
            "&nvHarr;": "⤄",
            "&nvap;": "≍⃒",
            "&nvdash;": "⊬",
            "&nvge;": "≥⃒",
            "&nvgt;": ">⃒",
            "&nvinfin;": "⧞",
            "&nvlArr;": "⤂",
            "&nvle;": "≤⃒",
            "&nvlt;": "<⃒",
            "&nvltrie;": "⊴⃒",
            "&nvrArr;": "⤃",
            "&nvrtrie;": "⊵⃒",
            "&nvsim;": "∼⃒",
            "&nwArr;": "⇖",
            "&nwarhk;": "⤣",
            "&nwarr;": "↖",
            "&nwarrow;": "↖",
            "&nwnear;": "⤧",
            "&oS;": "Ⓢ",
            "&oacute": "\xf3",
            "&oacute;": "\xf3",
            "&oast;": "⊛",
            "&ocir;": "⊚",
            "&ocirc": "\xf4",
            "&ocirc;": "\xf4",
            "&ocy;": "о",
            "&odash;": "⊝",
            "&odblac;": "ő",
            "&odiv;": "⨸",
            "&odot;": "⊙",
            "&odsold;": "⦼",
            "&oelig;": "œ",
            "&ofcir;": "⦿",
            "&ofr;": "\uD835\uDD2C",
            "&ogon;": "˛",
            "&ograve": "\xf2",
            "&ograve;": "\xf2",
            "&ogt;": "⧁",
            "&ohbar;": "⦵",
            "&ohm;": "Ω",
            "&oint;": "∮",
            "&olarr;": "↺",
            "&olcir;": "⦾",
            "&olcross;": "⦻",
            "&oline;": "‾",
            "&olt;": "⧀",
            "&omacr;": "ō",
            "&omega;": "ω",
            "&omicron;": "ο",
            "&omid;": "⦶",
            "&ominus;": "⊖",
            "&oopf;": "\uD835\uDD60",
            "&opar;": "⦷",
            "&operp;": "⦹",
            "&oplus;": "⊕",
            "&or;": "∨",
            "&orarr;": "↻",
            "&ord;": "⩝",
            "&order;": "ℴ",
            "&orderof;": "ℴ",
            "&ordf": "\xaa",
            "&ordf;": "\xaa",
            "&ordm": "\xba",
            "&ordm;": "\xba",
            "&origof;": "⊶",
            "&oror;": "⩖",
            "&orslope;": "⩗",
            "&orv;": "⩛",
            "&oscr;": "ℴ",
            "&oslash": "\xf8",
            "&oslash;": "\xf8",
            "&osol;": "⊘",
            "&otilde": "\xf5",
            "&otilde;": "\xf5",
            "&otimes;": "⊗",
            "&otimesas;": "⨶",
            "&ouml": "\xf6",
            "&ouml;": "\xf6",
            "&ovbar;": "⌽",
            "&par;": "∥",
            "&para": "\xb6",
            "&para;": "\xb6",
            "&parallel;": "∥",
            "&parsim;": "⫳",
            "&parsl;": "⫽",
            "&part;": "∂",
            "&pcy;": "п",
            "&percnt;": "%",
            "&period;": ".",
            "&permil;": "‰",
            "&perp;": "⊥",
            "&pertenk;": "‱",
            "&pfr;": "\uD835\uDD2D",
            "&phi;": "φ",
            "&phiv;": "ϕ",
            "&phmmat;": "ℳ",
            "&phone;": "☎",
            "&pi;": "π",
            "&pitchfork;": "⋔",
            "&piv;": "ϖ",
            "&planck;": "ℏ",
            "&planckh;": "ℎ",
            "&plankv;": "ℏ",
            "&plus;": "+",
            "&plusacir;": "⨣",
            "&plusb;": "⊞",
            "&pluscir;": "⨢",
            "&plusdo;": "∔",
            "&plusdu;": "⨥",
            "&pluse;": "⩲",
            "&plusmn": "\xb1",
            "&plusmn;": "\xb1",
            "&plussim;": "⨦",
            "&plustwo;": "⨧",
            "&pm;": "\xb1",
            "&pointint;": "⨕",
            "&popf;": "\uD835\uDD61",
            "&pound": "\xa3",
            "&pound;": "\xa3",
            "&pr;": "≺",
            "&prE;": "⪳",
            "&prap;": "⪷",
            "&prcue;": "≼",
            "&pre;": "⪯",
            "&prec;": "≺",
            "&precapprox;": "⪷",
            "&preccurlyeq;": "≼",
            "&preceq;": "⪯",
            "&precnapprox;": "⪹",
            "&precneqq;": "⪵",
            "&precnsim;": "⋨",
            "&precsim;": "≾",
            "&prime;": "′",
            "&primes;": "ℙ",
            "&prnE;": "⪵",
            "&prnap;": "⪹",
            "&prnsim;": "⋨",
            "&prod;": "∏",
            "&profalar;": "⌮",
            "&profline;": "⌒",
            "&profsurf;": "⌓",
            "&prop;": "∝",
            "&propto;": "∝",
            "&prsim;": "≾",
            "&prurel;": "⊰",
            "&pscr;": "\uD835\uDCC5",
            "&psi;": "ψ",
            "&puncsp;": " ",
            "&qfr;": "\uD835\uDD2E",
            "&qint;": "⨌",
            "&qopf;": "\uD835\uDD62",
            "&qprime;": "⁗",
            "&qscr;": "\uD835\uDCC6",
            "&quaternions;": "ℍ",
            "&quatint;": "⨖",
            "&quest;": "?",
            "&questeq;": "≟",
            "&quot": '"',
            "&quot;": '"',
            "&rAarr;": "⇛",
            "&rArr;": "⇒",
            "&rAtail;": "⤜",
            "&rBarr;": "⤏",
            "&rHar;": "⥤",
            "&race;": "∽̱",
            "&racute;": "ŕ",
            "&radic;": "√",
            "&raemptyv;": "⦳",
            "&rang;": "⟩",
            "&rangd;": "⦒",
            "&range;": "⦥",
            "&rangle;": "⟩",
            "&raquo": "\xbb",
            "&raquo;": "\xbb",
            "&rarr;": "→",
            "&rarrap;": "⥵",
            "&rarrb;": "⇥",
            "&rarrbfs;": "⤠",
            "&rarrc;": "⤳",
            "&rarrfs;": "⤞",
            "&rarrhk;": "↪",
            "&rarrlp;": "↬",
            "&rarrpl;": "⥅",
            "&rarrsim;": "⥴",
            "&rarrtl;": "↣",
            "&rarrw;": "↝",
            "&ratail;": "⤚",
            "&ratio;": "∶",
            "&rationals;": "ℚ",
            "&rbarr;": "⤍",
            "&rbbrk;": "❳",
            "&rbrace;": "}",
            "&rbrack;": "]",
            "&rbrke;": "⦌",
            "&rbrksld;": "⦎",
            "&rbrkslu;": "⦐",
            "&rcaron;": "ř",
            "&rcedil;": "ŗ",
            "&rceil;": "⌉",
            "&rcub;": "}",
            "&rcy;": "р",
            "&rdca;": "⤷",
            "&rdldhar;": "⥩",
            "&rdquo;": "”",
            "&rdquor;": "”",
            "&rdsh;": "↳",
            "&real;": "ℜ",
            "&realine;": "ℛ",
            "&realpart;": "ℜ",
            "&reals;": "ℝ",
            "&rect;": "▭",
            "&reg": "\xae",
            "&reg;": "\xae",
            "&rfisht;": "⥽",
            "&rfloor;": "⌋",
            "&rfr;": "\uD835\uDD2F",
            "&rhard;": "⇁",
            "&rharu;": "⇀",
            "&rharul;": "⥬",
            "&rho;": "ρ",
            "&rhov;": "ϱ",
            "&rightarrow;": "→",
            "&rightarrowtail;": "↣",
            "&rightharpoondown;": "⇁",
            "&rightharpoonup;": "⇀",
            "&rightleftarrows;": "⇄",
            "&rightleftharpoons;": "⇌",
            "&rightrightarrows;": "⇉",
            "&rightsquigarrow;": "↝",
            "&rightthreetimes;": "⋌",
            "&ring;": "˚",
            "&risingdotseq;": "≓",
            "&rlarr;": "⇄",
            "&rlhar;": "⇌",
            "&rlm;": "‏",
            "&rmoust;": "⎱",
            "&rmoustache;": "⎱",
            "&rnmid;": "⫮",
            "&roang;": "⟭",
            "&roarr;": "⇾",
            "&robrk;": "⟧",
            "&ropar;": "⦆",
            "&ropf;": "\uD835\uDD63",
            "&roplus;": "⨮",
            "&rotimes;": "⨵",
            "&rpar;": ")",
            "&rpargt;": "⦔",
            "&rppolint;": "⨒",
            "&rrarr;": "⇉",
            "&rsaquo;": "›",
            "&rscr;": "\uD835\uDCC7",
            "&rsh;": "↱",
            "&rsqb;": "]",
            "&rsquo;": "’",
            "&rsquor;": "’",
            "&rthree;": "⋌",
            "&rtimes;": "⋊",
            "&rtri;": "▹",
            "&rtrie;": "⊵",
            "&rtrif;": "▸",
            "&rtriltri;": "⧎",
            "&ruluhar;": "⥨",
            "&rx;": "℞",
            "&sacute;": "ś",
            "&sbquo;": "‚",
            "&sc;": "≻",
            "&scE;": "⪴",
            "&scap;": "⪸",
            "&scaron;": "š",
            "&sccue;": "≽",
            "&sce;": "⪰",
            "&scedil;": "ş",
            "&scirc;": "ŝ",
            "&scnE;": "⪶",
            "&scnap;": "⪺",
            "&scnsim;": "⋩",
            "&scpolint;": "⨓",
            "&scsim;": "≿",
            "&scy;": "с",
            "&sdot;": "⋅",
            "&sdotb;": "⊡",
            "&sdote;": "⩦",
            "&seArr;": "⇘",
            "&searhk;": "⤥",
            "&searr;": "↘",
            "&searrow;": "↘",
            "&sect": "\xa7",
            "&sect;": "\xa7",
            "&semi;": ";",
            "&seswar;": "⤩",
            "&setminus;": "∖",
            "&setmn;": "∖",
            "&sext;": "✶",
            "&sfr;": "\uD835\uDD30",
            "&sfrown;": "⌢",
            "&sharp;": "♯",
            "&shchcy;": "щ",
            "&shcy;": "ш",
            "&shortmid;": "∣",
            "&shortparallel;": "∥",
            "&shy": "\xad",
            "&shy;": "\xad",
            "&sigma;": "σ",
            "&sigmaf;": "ς",
            "&sigmav;": "ς",
            "&sim;": "∼",
            "&simdot;": "⩪",
            "&sime;": "≃",
            "&simeq;": "≃",
            "&simg;": "⪞",
            "&simgE;": "⪠",
            "&siml;": "⪝",
            "&simlE;": "⪟",
            "&simne;": "≆",
            "&simplus;": "⨤",
            "&simrarr;": "⥲",
            "&slarr;": "←",
            "&smallsetminus;": "∖",
            "&smashp;": "⨳",
            "&smeparsl;": "⧤",
            "&smid;": "∣",
            "&smile;": "⌣",
            "&smt;": "⪪",
            "&smte;": "⪬",
            "&smtes;": "⪬︀",
            "&softcy;": "ь",
            "&sol;": "/",
            "&solb;": "⧄",
            "&solbar;": "⌿",
            "&sopf;": "\uD835\uDD64",
            "&spades;": "♠",
            "&spadesuit;": "♠",
            "&spar;": "∥",
            "&sqcap;": "⊓",
            "&sqcaps;": "⊓︀",
            "&sqcup;": "⊔",
            "&sqcups;": "⊔︀",
            "&sqsub;": "⊏",
            "&sqsube;": "⊑",
            "&sqsubset;": "⊏",
            "&sqsubseteq;": "⊑",
            "&sqsup;": "⊐",
            "&sqsupe;": "⊒",
            "&sqsupset;": "⊐",
            "&sqsupseteq;": "⊒",
            "&squ;": "□",
            "&square;": "□",
            "&squarf;": "▪",
            "&squf;": "▪",
            "&srarr;": "→",
            "&sscr;": "\uD835\uDCC8",
            "&ssetmn;": "∖",
            "&ssmile;": "⌣",
            "&sstarf;": "⋆",
            "&star;": "☆",
            "&starf;": "★",
            "&straightepsilon;": "ϵ",
            "&straightphi;": "ϕ",
            "&strns;": "\xaf",
            "&sub;": "⊂",
            "&subE;": "⫅",
            "&subdot;": "⪽",
            "&sube;": "⊆",
            "&subedot;": "⫃",
            "&submult;": "⫁",
            "&subnE;": "⫋",
            "&subne;": "⊊",
            "&subplus;": "⪿",
            "&subrarr;": "⥹",
            "&subset;": "⊂",
            "&subseteq;": "⊆",
            "&subseteqq;": "⫅",
            "&subsetneq;": "⊊",
            "&subsetneqq;": "⫋",
            "&subsim;": "⫇",
            "&subsub;": "⫕",
            "&subsup;": "⫓",
            "&succ;": "≻",
            "&succapprox;": "⪸",
            "&succcurlyeq;": "≽",
            "&succeq;": "⪰",
            "&succnapprox;": "⪺",
            "&succneqq;": "⪶",
            "&succnsim;": "⋩",
            "&succsim;": "≿",
            "&sum;": "∑",
            "&sung;": "♪",
            "&sup1": "\xb9",
            "&sup1;": "\xb9",
            "&sup2": "\xb2",
            "&sup2;": "\xb2",
            "&sup3": "\xb3",
            "&sup3;": "\xb3",
            "&sup;": "⊃",
            "&supE;": "⫆",
            "&supdot;": "⪾",
            "&supdsub;": "⫘",
            "&supe;": "⊇",
            "&supedot;": "⫄",
            "&suphsol;": "⟉",
            "&suphsub;": "⫗",
            "&suplarr;": "⥻",
            "&supmult;": "⫂",
            "&supnE;": "⫌",
            "&supne;": "⊋",
            "&supplus;": "⫀",
            "&supset;": "⊃",
            "&supseteq;": "⊇",
            "&supseteqq;": "⫆",
            "&supsetneq;": "⊋",
            "&supsetneqq;": "⫌",
            "&supsim;": "⫈",
            "&supsub;": "⫔",
            "&supsup;": "⫖",
            "&swArr;": "⇙",
            "&swarhk;": "⤦",
            "&swarr;": "↙",
            "&swarrow;": "↙",
            "&swnwar;": "⤪",
            "&szlig": "\xdf",
            "&szlig;": "\xdf",
            "&target;": "⌖",
            "&tau;": "τ",
            "&tbrk;": "⎴",
            "&tcaron;": "ť",
            "&tcedil;": "ţ",
            "&tcy;": "т",
            "&tdot;": "⃛",
            "&telrec;": "⌕",
            "&tfr;": "\uD835\uDD31",
            "&there4;": "∴",
            "&therefore;": "∴",
            "&theta;": "θ",
            "&thetasym;": "ϑ",
            "&thetav;": "ϑ",
            "&thickapprox;": "≈",
            "&thicksim;": "∼",
            "&thinsp;": " ",
            "&thkap;": "≈",
            "&thksim;": "∼",
            "&thorn": "\xfe",
            "&thorn;": "\xfe",
            "&tilde;": "˜",
            "&times": "\xd7",
            "&times;": "\xd7",
            "&timesb;": "⊠",
            "&timesbar;": "⨱",
            "&timesd;": "⨰",
            "&tint;": "∭",
            "&toea;": "⤨",
            "&top;": "⊤",
            "&topbot;": "⌶",
            "&topcir;": "⫱",
            "&topf;": "\uD835\uDD65",
            "&topfork;": "⫚",
            "&tosa;": "⤩",
            "&tprime;": "‴",
            "&trade;": "™",
            "&triangle;": "▵",
            "&triangledown;": "▿",
            "&triangleleft;": "◃",
            "&trianglelefteq;": "⊴",
            "&triangleq;": "≜",
            "&triangleright;": "▹",
            "&trianglerighteq;": "⊵",
            "&tridot;": "◬",
            "&trie;": "≜",
            "&triminus;": "⨺",
            "&triplus;": "⨹",
            "&trisb;": "⧍",
            "&tritime;": "⨻",
            "&trpezium;": "⏢",
            "&tscr;": "\uD835\uDCC9",
            "&tscy;": "ц",
            "&tshcy;": "ћ",
            "&tstrok;": "ŧ",
            "&twixt;": "≬",
            "&twoheadleftarrow;": "↞",
            "&twoheadrightarrow;": "↠",
            "&uArr;": "⇑",
            "&uHar;": "⥣",
            "&uacute": "\xfa",
            "&uacute;": "\xfa",
            "&uarr;": "↑",
            "&ubrcy;": "ў",
            "&ubreve;": "ŭ",
            "&ucirc": "\xfb",
            "&ucirc;": "\xfb",
            "&ucy;": "у",
            "&udarr;": "⇅",
            "&udblac;": "ű",
            "&udhar;": "⥮",
            "&ufisht;": "⥾",
            "&ufr;": "\uD835\uDD32",
            "&ugrave": "\xf9",
            "&ugrave;": "\xf9",
            "&uharl;": "↿",
            "&uharr;": "↾",
            "&uhblk;": "▀",
            "&ulcorn;": "⌜",
            "&ulcorner;": "⌜",
            "&ulcrop;": "⌏",
            "&ultri;": "◸",
            "&umacr;": "ū",
            "&uml": "\xa8",
            "&uml;": "\xa8",
            "&uogon;": "ų",
            "&uopf;": "\uD835\uDD66",
            "&uparrow;": "↑",
            "&updownarrow;": "↕",
            "&upharpoonleft;": "↿",
            "&upharpoonright;": "↾",
            "&uplus;": "⊎",
            "&upsi;": "υ",
            "&upsih;": "ϒ",
            "&upsilon;": "υ",
            "&upuparrows;": "⇈",
            "&urcorn;": "⌝",
            "&urcorner;": "⌝",
            "&urcrop;": "⌎",
            "&uring;": "ů",
            "&urtri;": "◹",
            "&uscr;": "\uD835\uDCCA",
            "&utdot;": "⋰",
            "&utilde;": "ũ",
            "&utri;": "▵",
            "&utrif;": "▴",
            "&uuarr;": "⇈",
            "&uuml": "\xfc",
            "&uuml;": "\xfc",
            "&uwangle;": "⦧",
            "&vArr;": "⇕",
            "&vBar;": "⫨",
            "&vBarv;": "⫩",
            "&vDash;": "⊨",
            "&vangrt;": "⦜",
            "&varepsilon;": "ϵ",
            "&varkappa;": "ϰ",
            "&varnothing;": "∅",
            "&varphi;": "ϕ",
            "&varpi;": "ϖ",
            "&varpropto;": "∝",
            "&varr;": "↕",
            "&varrho;": "ϱ",
            "&varsigma;": "ς",
            "&varsubsetneq;": "⊊︀",
            "&varsubsetneqq;": "⫋︀",
            "&varsupsetneq;": "⊋︀",
            "&varsupsetneqq;": "⫌︀",
            "&vartheta;": "ϑ",
            "&vartriangleleft;": "⊲",
            "&vartriangleright;": "⊳",
            "&vcy;": "в",
            "&vdash;": "⊢",
            "&vee;": "∨",
            "&veebar;": "⊻",
            "&veeeq;": "≚",
            "&vellip;": "⋮",
            "&verbar;": "|",
            "&vert;": "|",
            "&vfr;": "\uD835\uDD33",
            "&vltri;": "⊲",
            "&vnsub;": "⊂⃒",
            "&vnsup;": "⊃⃒",
            "&vopf;": "\uD835\uDD67",
            "&vprop;": "∝",
            "&vrtri;": "⊳",
            "&vscr;": "\uD835\uDCCB",
            "&vsubnE;": "⫋︀",
            "&vsubne;": "⊊︀",
            "&vsupnE;": "⫌︀",
            "&vsupne;": "⊋︀",
            "&vzigzag;": "⦚",
            "&wcirc;": "ŵ",
            "&wedbar;": "⩟",
            "&wedge;": "∧",
            "&wedgeq;": "≙",
            "&weierp;": "℘",
            "&wfr;": "\uD835\uDD34",
            "&wopf;": "\uD835\uDD68",
            "&wp;": "℘",
            "&wr;": "≀",
            "&wreath;": "≀",
            "&wscr;": "\uD835\uDCCC",
            "&xcap;": "⋂",
            "&xcirc;": "◯",
            "&xcup;": "⋃",
            "&xdtri;": "▽",
            "&xfr;": "\uD835\uDD35",
            "&xhArr;": "⟺",
            "&xharr;": "⟷",
            "&xi;": "ξ",
            "&xlArr;": "⟸",
            "&xlarr;": "⟵",
            "&xmap;": "⟼",
            "&xnis;": "⋻",
            "&xodot;": "⨀",
            "&xopf;": "\uD835\uDD69",
            "&xoplus;": "⨁",
            "&xotime;": "⨂",
            "&xrArr;": "⟹",
            "&xrarr;": "⟶",
            "&xscr;": "\uD835\uDCCD",
            "&xsqcup;": "⨆",
            "&xuplus;": "⨄",
            "&xutri;": "△",
            "&xvee;": "⋁",
            "&xwedge;": "⋀",
            "&yacute": "\xfd",
            "&yacute;": "\xfd",
            "&yacy;": "я",
            "&ycirc;": "ŷ",
            "&ycy;": "ы",
            "&yen": "\xa5",
            "&yen;": "\xa5",
            "&yfr;": "\uD835\uDD36",
            "&yicy;": "ї",
            "&yopf;": "\uD835\uDD6A",
            "&yscr;": "\uD835\uDCCE",
            "&yucy;": "ю",
            "&yuml": "\xff",
            "&yuml;": "\xff",
            "&zacute;": "ź",
            "&zcaron;": "ž",
            "&zcy;": "з",
            "&zdot;": "ż",
            "&zeetrf;": "ℨ",
            "&zeta;": "ζ",
            "&zfr;": "\uD835\uDD37",
            "&zhcy;": "ж",
            "&zigrarr;": "⇝",
            "&zopf;": "\uD835\uDD6B",
            "&zscr;": "\uD835\uDCCF",
            "&zwj;": "‍",
            "&zwnj;": "‌"
        },
        characters: {
            "\xc6": "&AElig;",
            "&": "&amp;",
            "\xc1": "&Aacute;",
            "Ă": "&Abreve;",
            "\xc2": "&Acirc;",
            "А": "&Acy;",
            "\uD835\uDD04": "&Afr;",
            "\xc0": "&Agrave;",
            "Α": "&Alpha;",
            "Ā": "&Amacr;",
            "⩓": "&And;",
            "Ą": "&Aogon;",
            "\uD835\uDD38": "&Aopf;",
            "⁡": "&af;",
            "\xc5": "&angst;",
            "\uD835\uDC9C": "&Ascr;",
            "≔": "&coloneq;",
            "\xc3": "&Atilde;",
            "\xc4": "&Auml;",
            "∖": "&ssetmn;",
            "⫧": "&Barv;",
            "⌆": "&doublebarwedge;",
            "Б": "&Bcy;",
            "∵": "&because;",
            "ℬ": "&bernou;",
            "Β": "&Beta;",
            "\uD835\uDD05": "&Bfr;",
            "\uD835\uDD39": "&Bopf;",
            "˘": "&breve;",
            "≎": "&bump;",
            "Ч": "&CHcy;",
            "\xa9": "&copy;",
            "Ć": "&Cacute;",
            "⋒": "&Cap;",
            "ⅅ": "&DD;",
            "ℭ": "&Cfr;",
            "Č": "&Ccaron;",
            "\xc7": "&Ccedil;",
            "Ĉ": "&Ccirc;",
            "∰": "&Cconint;",
            "Ċ": "&Cdot;",
            "\xb8": "&cedil;",
            "\xb7": "&middot;",
            "Χ": "&Chi;",
            "⊙": "&odot;",
            "⊖": "&ominus;",
            "⊕": "&oplus;",
            "⊗": "&otimes;",
            "∲": "&cwconint;",
            "”": "&rdquor;",
            "’": "&rsquor;",
            "∷": "&Proportion;",
            "⩴": "&Colone;",
            "≡": "&equiv;",
            "∯": "&DoubleContourIntegral;",
            "∮": "&oint;",
            "ℂ": "&complexes;",
            "∐": "&coprod;",
            "∳": "&awconint;",
            "⨯": "&Cross;",
            "\uD835\uDC9E": "&Cscr;",
            "⋓": "&Cup;",
            "≍": "&asympeq;",
            "⤑": "&DDotrahd;",
            "Ђ": "&DJcy;",
            "Ѕ": "&DScy;",
            "Џ": "&DZcy;",
            "‡": "&ddagger;",
            "↡": "&Darr;",
            "⫤": "&DoubleLeftTee;",
            "Ď": "&Dcaron;",
            "Д": "&Dcy;",
            "∇": "&nabla;",
            "Δ": "&Delta;",
            "\uD835\uDD07": "&Dfr;",
            "\xb4": "&acute;",
            "˙": "&dot;",
            "˝": "&dblac;",
            "`": "&grave;",
            "˜": "&tilde;",
            "⋄": "&diamond;",
            "ⅆ": "&dd;",
            "\uD835\uDD3B": "&Dopf;",
            "\xa8": "&uml;",
            "⃜": "&DotDot;",
            "≐": "&esdot;",
            "⇓": "&dArr;",
            "⇐": "&lArr;",
            "⇔": "&iff;",
            "⟸": "&xlArr;",
            "⟺": "&xhArr;",
            "⟹": "&xrArr;",
            "⇒": "&rArr;",
            "⊨": "&vDash;",
            "⇑": "&uArr;",
            "⇕": "&vArr;",
            "∥": "&spar;",
            "↓": "&downarrow;",
            "⤓": "&DownArrowBar;",
            "⇵": "&duarr;",
            "̑": "&DownBreve;",
            "⥐": "&DownLeftRightVector;",
            "⥞": "&DownLeftTeeVector;",
            "↽": "&lhard;",
            "⥖": "&DownLeftVectorBar;",
            "⥟": "&DownRightTeeVector;",
            "⇁": "&rightharpoondown;",
            "⥗": "&DownRightVectorBar;",
            "⊤": "&top;",
            "↧": "&mapstodown;",
            "\uD835\uDC9F": "&Dscr;",
            "Đ": "&Dstrok;",
            "Ŋ": "&ENG;",
            "\xd0": "&ETH;",
            "\xc9": "&Eacute;",
            "Ě": "&Ecaron;",
            "\xca": "&Ecirc;",
            "Э": "&Ecy;",
            "Ė": "&Edot;",
            "\uD835\uDD08": "&Efr;",
            "\xc8": "&Egrave;",
            "∈": "&isinv;",
            "Ē": "&Emacr;",
            "◻": "&EmptySmallSquare;",
            "▫": "&EmptyVerySmallSquare;",
            "Ę": "&Eogon;",
            "\uD835\uDD3C": "&Eopf;",
            "Ε": "&Epsilon;",
            "⩵": "&Equal;",
            "≂": "&esim;",
            "⇌": "&rlhar;",
            "ℰ": "&expectation;",
            "⩳": "&Esim;",
            "Η": "&Eta;",
            "\xcb": "&Euml;",
            "∃": "&exist;",
            "ⅇ": "&exponentiale;",
            "Ф": "&Fcy;",
            "\uD835\uDD09": "&Ffr;",
            "◼": "&FilledSmallSquare;",
            "▪": "&squf;",
            "\uD835\uDD3D": "&Fopf;",
            "∀": "&forall;",
            "ℱ": "&Fscr;",
            "Ѓ": "&GJcy;",
            ">": "&gt;",
            "Γ": "&Gamma;",
            "Ϝ": "&Gammad;",
            "Ğ": "&Gbreve;",
            "Ģ": "&Gcedil;",
            "Ĝ": "&Gcirc;",
            "Г": "&Gcy;",
            "Ġ": "&Gdot;",
            "\uD835\uDD0A": "&Gfr;",
            "⋙": "&ggg;",
            "\uD835\uDD3E": "&Gopf;",
            "≥": "&geq;",
            "⋛": "&gtreqless;",
            "≧": "&geqq;",
            "⪢": "&GreaterGreater;",
            "≷": "&gtrless;",
            "⩾": "&ges;",
            "≳": "&gtrsim;",
            "\uD835\uDCA2": "&Gscr;",
            "≫": "&gg;",
            "Ъ": "&HARDcy;",
            "ˇ": "&caron;",
            "^": "&Hat;",
            "Ĥ": "&Hcirc;",
            "ℌ": "&Poincareplane;",
            "ℋ": "&hamilt;",
            "ℍ": "&quaternions;",
            "─": "&boxh;",
            "Ħ": "&Hstrok;",
            "≏": "&bumpeq;",
            "Е": "&IEcy;",
            "Ĳ": "&IJlig;",
            "Ё": "&IOcy;",
            "\xcd": "&Iacute;",
            "\xce": "&Icirc;",
            "И": "&Icy;",
            "İ": "&Idot;",
            "ℑ": "&imagpart;",
            "\xcc": "&Igrave;",
            "Ī": "&Imacr;",
            "ⅈ": "&ii;",
            "∬": "&Int;",
            "∫": "&int;",
            "⋂": "&xcap;",
            "⁣": "&ic;",
            "⁢": "&it;",
            "Į": "&Iogon;",
            "\uD835\uDD40": "&Iopf;",
            "Ι": "&Iota;",
            "ℐ": "&imagline;",
            "Ĩ": "&Itilde;",
            "І": "&Iukcy;",
            "\xcf": "&Iuml;",
            "Ĵ": "&Jcirc;",
            "Й": "&Jcy;",
            "\uD835\uDD0D": "&Jfr;",
            "\uD835\uDD41": "&Jopf;",
            "\uD835\uDCA5": "&Jscr;",
            "Ј": "&Jsercy;",
            "Є": "&Jukcy;",
            "Х": "&KHcy;",
            "Ќ": "&KJcy;",
            "Κ": "&Kappa;",
            "Ķ": "&Kcedil;",
            "К": "&Kcy;",
            "\uD835\uDD0E": "&Kfr;",
            "\uD835\uDD42": "&Kopf;",
            "\uD835\uDCA6": "&Kscr;",
            "Љ": "&LJcy;",
            "<": "&lt;",
            "Ĺ": "&Lacute;",
            "Λ": "&Lambda;",
            "⟪": "&Lang;",
            "ℒ": "&lagran;",
            "↞": "&twoheadleftarrow;",
            "Ľ": "&Lcaron;",
            "Ļ": "&Lcedil;",
            "Л": "&Lcy;",
            "⟨": "&langle;",
            "←": "&slarr;",
            "⇤": "&larrb;",
            "⇆": "&lrarr;",
            "⌈": "&lceil;",
            "⟦": "&lobrk;",
            "⥡": "&LeftDownTeeVector;",
            "⇃": "&downharpoonleft;",
            "⥙": "&LeftDownVectorBar;",
            "⌊": "&lfloor;",
            "↔": "&leftrightarrow;",
            "⥎": "&LeftRightVector;",
            "⊣": "&dashv;",
            "↤": "&mapstoleft;",
            "⥚": "&LeftTeeVector;",
            "⊲": "&vltri;",
            "⧏": "&LeftTriangleBar;",
            "⊴": "&trianglelefteq;",
            "⥑": "&LeftUpDownVector;",
            "⥠": "&LeftUpTeeVector;",
            "↿": "&upharpoonleft;",
            "⥘": "&LeftUpVectorBar;",
            "↼": "&lharu;",
            "⥒": "&LeftVectorBar;",
            "⋚": "&lesseqgtr;",
            "≦": "&leqq;",
            "≶": "&lg;",
            "⪡": "&LessLess;",
            "⩽": "&les;",
            "≲": "&lsim;",
            "\uD835\uDD0F": "&Lfr;",
            "⋘": "&Ll;",
            "⇚": "&lAarr;",
            "Ŀ": "&Lmidot;",
            "⟵": "&xlarr;",
            "⟷": "&xharr;",
            "⟶": "&xrarr;",
            "\uD835\uDD43": "&Lopf;",
            "↙": "&swarrow;",
            "↘": "&searrow;",
            "↰": "&lsh;",
            "Ł": "&Lstrok;",
            "≪": "&ll;",
            "⤅": "&Map;",
            "М": "&Mcy;",
            " ": "&MediumSpace;",
            "ℳ": "&phmmat;",
            "\uD835\uDD10": "&Mfr;",
            "∓": "&mp;",
            "\uD835\uDD44": "&Mopf;",
            "Μ": "&Mu;",
            "Њ": "&NJcy;",
            "Ń": "&Nacute;",
            "Ň": "&Ncaron;",
            "Ņ": "&Ncedil;",
            "Н": "&Ncy;",
            "​": "&ZeroWidthSpace;",
            "\n": "&NewLine;",
            "\uD835\uDD11": "&Nfr;",
            "⁠": "&NoBreak;",
            "\xa0": "&nbsp;",
            "ℕ": "&naturals;",
            "⫬": "&Not;",
            "≢": "&nequiv;",
            "≭": "&NotCupCap;",
            "∦": "&nspar;",
            "∉": "&notinva;",
            "≠": "&ne;",
            "≂̸": "&nesim;",
            "∄": "&nexists;",
            "≯": "&ngtr;",
            "≱": "&ngeq;",
            "≧̸": "&ngeqq;",
            "≫̸": "&nGtv;",
            "≹": "&ntgl;",
            "⩾̸": "&nges;",
            "≵": "&ngsim;",
            "≎̸": "&nbump;",
            "≏̸": "&nbumpe;",
            "⋪": "&ntriangleleft;",
            "⧏̸": "&NotLeftTriangleBar;",
            "⋬": "&ntrianglelefteq;",
            "≮": "&nlt;",
            "≰": "&nleq;",
            "≸": "&ntlg;",
            "≪̸": "&nLtv;",
            "⩽̸": "&nles;",
            "≴": "&nlsim;",
            "⪢̸": "&NotNestedGreaterGreater;",
            "⪡̸": "&NotNestedLessLess;",
            "⊀": "&nprec;",
            "⪯̸": "&npreceq;",
            "⋠": "&nprcue;",
            "∌": "&notniva;",
            "⋫": "&ntriangleright;",
            "⧐̸": "&NotRightTriangleBar;",
            "⋭": "&ntrianglerighteq;",
            "⊏̸": "&NotSquareSubset;",
            "⋢": "&nsqsube;",
            "⊐̸": "&NotSquareSuperset;",
            "⋣": "&nsqsupe;",
            "⊂⃒": "&vnsub;",
            "⊈": "&nsubseteq;",
            "⊁": "&nsucc;",
            "⪰̸": "&nsucceq;",
            "⋡": "&nsccue;",
            "≿̸": "&NotSucceedsTilde;",
            "⊃⃒": "&vnsup;",
            "⊉": "&nsupseteq;",
            "≁": "&nsim;",
            "≄": "&nsimeq;",
            "≇": "&ncong;",
            "≉": "&napprox;",
            "∤": "&nsmid;",
            "\uD835\uDCA9": "&Nscr;",
            "\xd1": "&Ntilde;",
            "Ν": "&Nu;",
            "Œ": "&OElig;",
            "\xd3": "&Oacute;",
            "\xd4": "&Ocirc;",
            "О": "&Ocy;",
            "Ő": "&Odblac;",
            "\uD835\uDD12": "&Ofr;",
            "\xd2": "&Ograve;",
            "Ō": "&Omacr;",
            "Ω": "&ohm;",
            "Ο": "&Omicron;",
            "\uD835\uDD46": "&Oopf;",
            "“": "&ldquo;",
            "‘": "&lsquo;",
            "⩔": "&Or;",
            "\uD835\uDCAA": "&Oscr;",
            "\xd8": "&Oslash;",
            "\xd5": "&Otilde;",
            "⨷": "&Otimes;",
            "\xd6": "&Ouml;",
            "‾": "&oline;",
            "⏞": "&OverBrace;",
            "⎴": "&tbrk;",
            "⏜": "&OverParenthesis;",
            "∂": "&part;",
            "П": "&Pcy;",
            "\uD835\uDD13": "&Pfr;",
            "Φ": "&Phi;",
            "Π": "&Pi;",
            "\xb1": "&pm;",
            "ℙ": "&primes;",
            "⪻": "&Pr;",
            "≺": "&prec;",
            "⪯": "&preceq;",
            "≼": "&preccurlyeq;",
            "≾": "&prsim;",
            "″": "&Prime;",
            "∏": "&prod;",
            "∝": "&vprop;",
            "\uD835\uDCAB": "&Pscr;",
            "Ψ": "&Psi;",
            '"': "&quot;",
            "\uD835\uDD14": "&Qfr;",
            "ℚ": "&rationals;",
            "\uD835\uDCAC": "&Qscr;",
            "⤐": "&drbkarow;",
            "\xae": "&reg;",
            "Ŕ": "&Racute;",
            "⟫": "&Rang;",
            "↠": "&twoheadrightarrow;",
            "⤖": "&Rarrtl;",
            "Ř": "&Rcaron;",
            "Ŗ": "&Rcedil;",
            "Р": "&Rcy;",
            "ℜ": "&realpart;",
            "∋": "&niv;",
            "⇋": "&lrhar;",
            "⥯": "&duhar;",
            "Ρ": "&Rho;",
            "⟩": "&rangle;",
            "→": "&srarr;",
            "⇥": "&rarrb;",
            "⇄": "&rlarr;",
            "⌉": "&rceil;",
            "⟧": "&robrk;",
            "⥝": "&RightDownTeeVector;",
            "⇂": "&downharpoonright;",
            "⥕": "&RightDownVectorBar;",
            "⌋": "&rfloor;",
            "⊢": "&vdash;",
            "↦": "&mapsto;",
            "⥛": "&RightTeeVector;",
            "⊳": "&vrtri;",
            "⧐": "&RightTriangleBar;",
            "⊵": "&trianglerighteq;",
            "⥏": "&RightUpDownVector;",
            "⥜": "&RightUpTeeVector;",
            "↾": "&upharpoonright;",
            "⥔": "&RightUpVectorBar;",
            "⇀": "&rightharpoonup;",
            "⥓": "&RightVectorBar;",
            "ℝ": "&reals;",
            "⥰": "&RoundImplies;",
            "⇛": "&rAarr;",
            "ℛ": "&realine;",
            "↱": "&rsh;",
            "⧴": "&RuleDelayed;",
            "Щ": "&SHCHcy;",
            "Ш": "&SHcy;",
            "Ь": "&SOFTcy;",
            "Ś": "&Sacute;",
            "⪼": "&Sc;",
            "Š": "&Scaron;",
            "Ş": "&Scedil;",
            "Ŝ": "&Scirc;",
            "С": "&Scy;",
            "\uD835\uDD16": "&Sfr;",
            "↑": "&uparrow;",
            "Σ": "&Sigma;",
            "∘": "&compfn;",
            "\uD835\uDD4A": "&Sopf;",
            "√": "&radic;",
            "□": "&square;",
            "⊓": "&sqcap;",
            "⊏": "&sqsubset;",
            "⊑": "&sqsubseteq;",
            "⊐": "&sqsupset;",
            "⊒": "&sqsupseteq;",
            "⊔": "&sqcup;",
            "\uD835\uDCAE": "&Sscr;",
            "⋆": "&sstarf;",
            "⋐": "&Subset;",
            "⊆": "&subseteq;",
            "≻": "&succ;",
            "⪰": "&succeq;",
            "≽": "&succcurlyeq;",
            "≿": "&succsim;",
            "∑": "&sum;",
            "⋑": "&Supset;",
            "⊃": "&supset;",
            "⊇": "&supseteq;",
            "\xde": "&THORN;",
            "™": "&trade;",
            "Ћ": "&TSHcy;",
            "Ц": "&TScy;",
            "	": "&Tab;",
            "Τ": "&Tau;",
            "Ť": "&Tcaron;",
            "Ţ": "&Tcedil;",
            "Т": "&Tcy;",
            "\uD835\uDD17": "&Tfr;",
            "∴": "&therefore;",
            "Θ": "&Theta;",
            "  ": "&ThickSpace;",
            " ": "&thinsp;",
            "∼": "&thksim;",
            "≃": "&simeq;",
            "≅": "&cong;",
            "≈": "&thkap;",
            "\uD835\uDD4B": "&Topf;",
            "⃛": "&tdot;",
            "\uD835\uDCAF": "&Tscr;",
            "Ŧ": "&Tstrok;",
            "\xda": "&Uacute;",
            "↟": "&Uarr;",
            "⥉": "&Uarrocir;",
            "Ў": "&Ubrcy;",
            "Ŭ": "&Ubreve;",
            "\xdb": "&Ucirc;",
            "У": "&Ucy;",
            "Ű": "&Udblac;",
            "\uD835\uDD18": "&Ufr;",
            "\xd9": "&Ugrave;",
            "Ū": "&Umacr;",
            _: "&lowbar;",
            "⏟": "&UnderBrace;",
            "⎵": "&bbrk;",
            "⏝": "&UnderParenthesis;",
            "⋃": "&xcup;",
            "⊎": "&uplus;",
            "Ų": "&Uogon;",
            "\uD835\uDD4C": "&Uopf;",
            "⤒": "&UpArrowBar;",
            "⇅": "&udarr;",
            "↕": "&varr;",
            "⥮": "&udhar;",
            "⊥": "&perp;",
            "↥": "&mapstoup;",
            "↖": "&nwarrow;",
            "↗": "&nearrow;",
            "ϒ": "&upsih;",
            "Υ": "&Upsilon;",
            "Ů": "&Uring;",
            "\uD835\uDCB0": "&Uscr;",
            "Ũ": "&Utilde;",
            "\xdc": "&Uuml;",
            "⊫": "&VDash;",
            "⫫": "&Vbar;",
            "В": "&Vcy;",
            "⊩": "&Vdash;",
            "⫦": "&Vdashl;",
            "⋁": "&xvee;",
            "‖": "&Vert;",
            "∣": "&smid;",
            "|": "&vert;",
            "❘": "&VerticalSeparator;",
            "≀": "&wreath;",
            " ": "&hairsp;",
            "\uD835\uDD19": "&Vfr;",
            "\uD835\uDD4D": "&Vopf;",
            "\uD835\uDCB1": "&Vscr;",
            "⊪": "&Vvdash;",
            "Ŵ": "&Wcirc;",
            "⋀": "&xwedge;",
            "\uD835\uDD1A": "&Wfr;",
            "\uD835\uDD4E": "&Wopf;",
            "\uD835\uDCB2": "&Wscr;",
            "\uD835\uDD1B": "&Xfr;",
            "Ξ": "&Xi;",
            "\uD835\uDD4F": "&Xopf;",
            "\uD835\uDCB3": "&Xscr;",
            "Я": "&YAcy;",
            "Ї": "&YIcy;",
            "Ю": "&YUcy;",
            "\xdd": "&Yacute;",
            "Ŷ": "&Ycirc;",
            "Ы": "&Ycy;",
            "\uD835\uDD1C": "&Yfr;",
            "\uD835\uDD50": "&Yopf;",
            "\uD835\uDCB4": "&Yscr;",
            "Ÿ": "&Yuml;",
            "Ж": "&ZHcy;",
            "Ź": "&Zacute;",
            "Ž": "&Zcaron;",
            "З": "&Zcy;",
            "Ż": "&Zdot;",
            "Ζ": "&Zeta;",
            "ℨ": "&zeetrf;",
            "ℤ": "&integers;",
            "\uD835\uDCB5": "&Zscr;",
            "\xe1": "&aacute;",
            "ă": "&abreve;",
            "∾": "&mstpos;",
            "∾̳": "&acE;",
            "∿": "&acd;",
            "\xe2": "&acirc;",
            "а": "&acy;",
            "\xe6": "&aelig;",
            "\uD835\uDD1E": "&afr;",
            "\xe0": "&agrave;",
            "ℵ": "&aleph;",
            "α": "&alpha;",
            "ā": "&amacr;",
            "⨿": "&amalg;",
            "∧": "&wedge;",
            "⩕": "&andand;",
            "⩜": "&andd;",
            "⩘": "&andslope;",
            "⩚": "&andv;",
            "∠": "&angle;",
            "⦤": "&ange;",
            "∡": "&measuredangle;",
            "⦨": "&angmsdaa;",
            "⦩": "&angmsdab;",
            "⦪": "&angmsdac;",
            "⦫": "&angmsdad;",
            "⦬": "&angmsdae;",
            "⦭": "&angmsdaf;",
            "⦮": "&angmsdag;",
            "⦯": "&angmsdah;",
            "∟": "&angrt;",
            "⊾": "&angrtvb;",
            "⦝": "&angrtvbd;",
            "∢": "&angsph;",
            "⍼": "&angzarr;",
            "ą": "&aogon;",
            "\uD835\uDD52": "&aopf;",
            "⩰": "&apE;",
            "⩯": "&apacir;",
            "≊": "&approxeq;",
            "≋": "&apid;",
            "'": "&apos;",
            "\xe5": "&aring;",
            "\uD835\uDCB6": "&ascr;",
            "*": "&midast;",
            "\xe3": "&atilde;",
            "\xe4": "&auml;",
            "⨑": "&awint;",
            "⫭": "&bNot;",
            "≌": "&bcong;",
            "϶": "&bepsi;",
            "‵": "&bprime;",
            "∽": "&bsim;",
            "⋍": "&bsime;",
            "⊽": "&barvee;",
            "⌅": "&barwedge;",
            "⎶": "&bbrktbrk;",
            "б": "&bcy;",
            "„": "&ldquor;",
            "⦰": "&bemptyv;",
            "β": "&beta;",
            "ℶ": "&beth;",
            "≬": "&twixt;",
            "\uD835\uDD1F": "&bfr;",
            "◯": "&xcirc;",
            "⨀": "&xodot;",
            "⨁": "&xoplus;",
            "⨂": "&xotime;",
            "⨆": "&xsqcup;",
            "★": "&starf;",
            "▽": "&xdtri;",
            "△": "&xutri;",
            "⨄": "&xuplus;",
            "⤍": "&rbarr;",
            "⧫": "&lozf;",
            "▴": "&utrif;",
            "▾": "&dtrif;",
            "◂": "&ltrif;",
            "▸": "&rtrif;",
            "␣": "&blank;",
            "▒": "&blk12;",
            "░": "&blk14;",
            "▓": "&blk34;",
            "█": "&block;",
            "=⃥": "&bne;",
            "≡⃥": "&bnequiv;",
            "⌐": "&bnot;",
            "\uD835\uDD53": "&bopf;",
            "⋈": "&bowtie;",
            "╗": "&boxDL;",
            "╔": "&boxDR;",
            "╖": "&boxDl;",
            "╓": "&boxDr;",
            "═": "&boxH;",
            "╦": "&boxHD;",
            "╩": "&boxHU;",
            "╤": "&boxHd;",
            "╧": "&boxHu;",
            "╝": "&boxUL;",
            "╚": "&boxUR;",
            "╜": "&boxUl;",
            "╙": "&boxUr;",
            "║": "&boxV;",
            "╬": "&boxVH;",
            "╣": "&boxVL;",
            "╠": "&boxVR;",
            "╫": "&boxVh;",
            "╢": "&boxVl;",
            "╟": "&boxVr;",
            "⧉": "&boxbox;",
            "╕": "&boxdL;",
            "╒": "&boxdR;",
            "┐": "&boxdl;",
            "┌": "&boxdr;",
            "╥": "&boxhD;",
            "╨": "&boxhU;",
            "┬": "&boxhd;",
            "┴": "&boxhu;",
            "⊟": "&minusb;",
            "⊞": "&plusb;",
            "⊠": "&timesb;",
            "╛": "&boxuL;",
            "╘": "&boxuR;",
            "┘": "&boxul;",
            "└": "&boxur;",
            "│": "&boxv;",
            "╪": "&boxvH;",
            "╡": "&boxvL;",
            "╞": "&boxvR;",
            "┼": "&boxvh;",
            "┤": "&boxvl;",
            "├": "&boxvr;",
            "\xa6": "&brvbar;",
            "\uD835\uDCB7": "&bscr;",
            "⁏": "&bsemi;",
            "\\": "&bsol;",
            "⧅": "&bsolb;",
            "⟈": "&bsolhsub;",
            "•": "&bullet;",
            "⪮": "&bumpE;",
            "ć": "&cacute;",
            "∩": "&cap;",
            "⩄": "&capand;",
            "⩉": "&capbrcup;",
            "⩋": "&capcap;",
            "⩇": "&capcup;",
            "⩀": "&capdot;",
            "∩︀": "&caps;",
            "⁁": "&caret;",
            "⩍": "&ccaps;",
            "č": "&ccaron;",
            "\xe7": "&ccedil;",
            "ĉ": "&ccirc;",
            "⩌": "&ccups;",
            "⩐": "&ccupssm;",
            "ċ": "&cdot;",
            "⦲": "&cemptyv;",
            "\xa2": "&cent;",
            "\uD835\uDD20": "&cfr;",
            "ч": "&chcy;",
            "✓": "&checkmark;",
            "χ": "&chi;",
            "○": "&cir;",
            "⧃": "&cirE;",
            "ˆ": "&circ;",
            "≗": "&cire;",
            "↺": "&olarr;",
            "↻": "&orarr;",
            "Ⓢ": "&oS;",
            "⊛": "&oast;",
            "⊚": "&ocir;",
            "⊝": "&odash;",
            "⨐": "&cirfnint;",
            "⫯": "&cirmid;",
            "⧂": "&cirscir;",
            "♣": "&clubsuit;",
            ":": "&colon;",
            ",": "&comma;",
            "@": "&commat;",
            "∁": "&complement;",
            "⩭": "&congdot;",
            "\uD835\uDD54": "&copf;",
            "℗": "&copysr;",
            "↵": "&crarr;",
            "✗": "&cross;",
            "\uD835\uDCB8": "&cscr;",
            "⫏": "&csub;",
            "⫑": "&csube;",
            "⫐": "&csup;",
            "⫒": "&csupe;",
            "⋯": "&ctdot;",
            "⤸": "&cudarrl;",
            "⤵": "&cudarrr;",
            "⋞": "&curlyeqprec;",
            "⋟": "&curlyeqsucc;",
            "↶": "&curvearrowleft;",
            "⤽": "&cularrp;",
            "∪": "&cup;",
            "⩈": "&cupbrcap;",
            "⩆": "&cupcap;",
            "⩊": "&cupcup;",
            "⊍": "&cupdot;",
            "⩅": "&cupor;",
            "∪︀": "&cups;",
            "↷": "&curvearrowright;",
            "⤼": "&curarrm;",
            "⋎": "&cuvee;",
            "⋏": "&cuwed;",
            "\xa4": "&curren;",
            "∱": "&cwint;",
            "⌭": "&cylcty;",
            "⥥": "&dHar;",
            "†": "&dagger;",
            "ℸ": "&daleth;",
            "‐": "&hyphen;",
            "⤏": "&rBarr;",
            "ď": "&dcaron;",
            "д": "&dcy;",
            "⇊": "&downdownarrows;",
            "⩷": "&eDDot;",
            "\xb0": "&deg;",
            "δ": "&delta;",
            "⦱": "&demptyv;",
            "⥿": "&dfisht;",
            "\uD835\uDD21": "&dfr;",
            "♦": "&diams;",
            "ϝ": "&gammad;",
            "⋲": "&disin;",
            "\xf7": "&divide;",
            "⋇": "&divonx;",
            "ђ": "&djcy;",
            "⌞": "&llcorner;",
            "⌍": "&dlcrop;",
            $: "&dollar;",
            "\uD835\uDD55": "&dopf;",
            "≑": "&eDot;",
            "∸": "&minusd;",
            "∔": "&plusdo;",
            "⊡": "&sdotb;",
            "⌟": "&lrcorner;",
            "⌌": "&drcrop;",
            "\uD835\uDCB9": "&dscr;",
            "ѕ": "&dscy;",
            "⧶": "&dsol;",
            "đ": "&dstrok;",
            "⋱": "&dtdot;",
            "▿": "&triangledown;",
            "⦦": "&dwangle;",
            "џ": "&dzcy;",
            "⟿": "&dzigrarr;",
            "\xe9": "&eacute;",
            "⩮": "&easter;",
            "ě": "&ecaron;",
            "≖": "&eqcirc;",
            "\xea": "&ecirc;",
            "≕": "&eqcolon;",
            "э": "&ecy;",
            "ė": "&edot;",
            "≒": "&fallingdotseq;",
            "\uD835\uDD22": "&efr;",
            "⪚": "&eg;",
            "\xe8": "&egrave;",
            "⪖": "&eqslantgtr;",
            "⪘": "&egsdot;",
            "⪙": "&el;",
            "⏧": "&elinters;",
            "ℓ": "&ell;",
            "⪕": "&eqslantless;",
            "⪗": "&elsdot;",
            "ē": "&emacr;",
            "∅": "&varnothing;",
            " ": "&emsp13;",
            " ": "&emsp14;",
            " ": "&emsp;",
            "ŋ": "&eng;",
            " ": "&ensp;",
            "ę": "&eogon;",
            "\uD835\uDD56": "&eopf;",
            "⋕": "&epar;",
            "⧣": "&eparsl;",
            "⩱": "&eplus;",
            "ε": "&epsilon;",
            "ϵ": "&varepsilon;",
            "=": "&equals;",
            "≟": "&questeq;",
            "⩸": "&equivDD;",
            "⧥": "&eqvparsl;",
            "≓": "&risingdotseq;",
            "⥱": "&erarr;",
            "ℯ": "&escr;",
            "η": "&eta;",
            "\xf0": "&eth;",
            "\xeb": "&euml;",
            "€": "&euro;",
            "!": "&excl;",
            "ф": "&fcy;",
            "♀": "&female;",
            "ﬃ": "&ffilig;",
            "ﬀ": "&fflig;",
            "ﬄ": "&ffllig;",
            "\uD835\uDD23": "&ffr;",
            "ﬁ": "&filig;",
            fj: "&fjlig;",
            "♭": "&flat;",
            "ﬂ": "&fllig;",
            "▱": "&fltns;",
            "ƒ": "&fnof;",
            "\uD835\uDD57": "&fopf;",
            "⋔": "&pitchfork;",
            "⫙": "&forkv;",
            "⨍": "&fpartint;",
            "\xbd": "&half;",
            "⅓": "&frac13;",
            "\xbc": "&frac14;",
            "⅕": "&frac15;",
            "⅙": "&frac16;",
            "⅛": "&frac18;",
            "⅔": "&frac23;",
            "⅖": "&frac25;",
            "\xbe": "&frac34;",
            "⅗": "&frac35;",
            "⅜": "&frac38;",
            "⅘": "&frac45;",
            "⅚": "&frac56;",
            "⅝": "&frac58;",
            "⅞": "&frac78;",
            "⁄": "&frasl;",
            "⌢": "&sfrown;",
            "\uD835\uDCBB": "&fscr;",
            "⪌": "&gtreqqless;",
            "ǵ": "&gacute;",
            "γ": "&gamma;",
            "⪆": "&gtrapprox;",
            "ğ": "&gbreve;",
            "ĝ": "&gcirc;",
            "г": "&gcy;",
            "ġ": "&gdot;",
            "⪩": "&gescc;",
            "⪀": "&gesdot;",
            "⪂": "&gesdoto;",
            "⪄": "&gesdotol;",
            "⋛︀": "&gesl;",
            "⪔": "&gesles;",
            "\uD835\uDD24": "&gfr;",
            "ℷ": "&gimel;",
            "ѓ": "&gjcy;",
            "⪒": "&glE;",
            "⪥": "&gla;",
            "⪤": "&glj;",
            "≩": "&gneqq;",
            "⪊": "&gnapprox;",
            "⪈": "&gneq;",
            "⋧": "&gnsim;",
            "\uD835\uDD58": "&gopf;",
            "ℊ": "&gscr;",
            "⪎": "&gsime;",
            "⪐": "&gsiml;",
            "⪧": "&gtcc;",
            "⩺": "&gtcir;",
            "⋗": "&gtrdot;",
            "⦕": "&gtlPar;",
            "⩼": "&gtquest;",
            "⥸": "&gtrarr;",
            "≩︀": "&gvnE;",
            "ъ": "&hardcy;",
            "⥈": "&harrcir;",
            "↭": "&leftrightsquigarrow;",
            "ℏ": "&plankv;",
            "ĥ": "&hcirc;",
            "♥": "&heartsuit;",
            "…": "&mldr;",
            "⊹": "&hercon;",
            "\uD835\uDD25": "&hfr;",
            "⤥": "&searhk;",
            "⤦": "&swarhk;",
            "⇿": "&hoarr;",
            "∻": "&homtht;",
            "↩": "&larrhk;",
            "↪": "&rarrhk;",
            "\uD835\uDD59": "&hopf;",
            "―": "&horbar;",
            "\uD835\uDCBD": "&hscr;",
            "ħ": "&hstrok;",
            "⁃": "&hybull;",
            "\xed": "&iacute;",
            "\xee": "&icirc;",
            "и": "&icy;",
            "е": "&iecy;",
            "\xa1": "&iexcl;",
            "\uD835\uDD26": "&ifr;",
            "\xec": "&igrave;",
            "⨌": "&qint;",
            "∭": "&tint;",
            "⧜": "&iinfin;",
            "℩": "&iiota;",
            "ĳ": "&ijlig;",
            "ī": "&imacr;",
            "ı": "&inodot;",
            "⊷": "&imof;",
            "Ƶ": "&imped;",
            "℅": "&incare;",
            "∞": "&infin;",
            "⧝": "&infintie;",
            "⊺": "&intercal;",
            "⨗": "&intlarhk;",
            "⨼": "&iprod;",
            "ё": "&iocy;",
            "į": "&iogon;",
            "\uD835\uDD5A": "&iopf;",
            "ι": "&iota;",
            "\xbf": "&iquest;",
            "\uD835\uDCBE": "&iscr;",
            "⋹": "&isinE;",
            "⋵": "&isindot;",
            "⋴": "&isins;",
            "⋳": "&isinsv;",
            "ĩ": "&itilde;",
            "і": "&iukcy;",
            "\xef": "&iuml;",
            "ĵ": "&jcirc;",
            "й": "&jcy;",
            "\uD835\uDD27": "&jfr;",
            "ȷ": "&jmath;",
            "\uD835\uDD5B": "&jopf;",
            "\uD835\uDCBF": "&jscr;",
            "ј": "&jsercy;",
            "є": "&jukcy;",
            "κ": "&kappa;",
            "ϰ": "&varkappa;",
            "ķ": "&kcedil;",
            "к": "&kcy;",
            "\uD835\uDD28": "&kfr;",
            "ĸ": "&kgreen;",
            "х": "&khcy;",
            "ќ": "&kjcy;",
            "\uD835\uDD5C": "&kopf;",
            "\uD835\uDCC0": "&kscr;",
            "⤛": "&lAtail;",
            "⤎": "&lBarr;",
            "⪋": "&lesseqqgtr;",
            "⥢": "&lHar;",
            "ĺ": "&lacute;",
            "⦴": "&laemptyv;",
            "λ": "&lambda;",
            "⦑": "&langd;",
            "⪅": "&lessapprox;",
            "\xab": "&laquo;",
            "⤟": "&larrbfs;",
            "⤝": "&larrfs;",
            "↫": "&looparrowleft;",
            "⤹": "&larrpl;",
            "⥳": "&larrsim;",
            "↢": "&leftarrowtail;",
            "⪫": "&lat;",
            "⤙": "&latail;",
            "⪭": "&late;",
            "⪭︀": "&lates;",
            "⤌": "&lbarr;",
            "❲": "&lbbrk;",
            "{": "&lcub;",
            "[": "&lsqb;",
            "⦋": "&lbrke;",
            "⦏": "&lbrksld;",
            "⦍": "&lbrkslu;",
            "ľ": "&lcaron;",
            "ļ": "&lcedil;",
            "л": "&lcy;",
            "⤶": "&ldca;",
            "⥧": "&ldrdhar;",
            "⥋": "&ldrushar;",
            "↲": "&ldsh;",
            "≤": "&leq;",
            "⇇": "&llarr;",
            "⋋": "&lthree;",
            "⪨": "&lescc;",
            "⩿": "&lesdot;",
            "⪁": "&lesdoto;",
            "⪃": "&lesdotor;",
            "⋚︀": "&lesg;",
            "⪓": "&lesges;",
            "⋖": "&ltdot;",
            "⥼": "&lfisht;",
            "\uD835\uDD29": "&lfr;",
            "⪑": "&lgE;",
            "⥪": "&lharul;",
            "▄": "&lhblk;",
            "љ": "&ljcy;",
            "⥫": "&llhard;",
            "◺": "&lltri;",
            "ŀ": "&lmidot;",
            "⎰": "&lmoustache;",
            "≨": "&lneqq;",
            "⪉": "&lnapprox;",
            "⪇": "&lneq;",
            "⋦": "&lnsim;",
            "⟬": "&loang;",
            "⇽": "&loarr;",
            "⟼": "&xmap;",
            "↬": "&rarrlp;",
            "⦅": "&lopar;",
            "\uD835\uDD5D": "&lopf;",
            "⨭": "&loplus;",
            "⨴": "&lotimes;",
            "∗": "&lowast;",
            "◊": "&lozenge;",
            "(": "&lpar;",
            "⦓": "&lparlt;",
            "⥭": "&lrhard;",
            "‎": "&lrm;",
            "⊿": "&lrtri;",
            "‹": "&lsaquo;",
            "\uD835\uDCC1": "&lscr;",
            "⪍": "&lsime;",
            "⪏": "&lsimg;",
            "‚": "&sbquo;",
            "ł": "&lstrok;",
            "⪦": "&ltcc;",
            "⩹": "&ltcir;",
            "⋉": "&ltimes;",
            "⥶": "&ltlarr;",
            "⩻": "&ltquest;",
            "⦖": "&ltrPar;",
            "◃": "&triangleleft;",
            "⥊": "&lurdshar;",
            "⥦": "&luruhar;",
            "≨︀": "&lvnE;",
            "∺": "&mDDot;",
            "\xaf": "&strns;",
            "♂": "&male;",
            "✠": "&maltese;",
            "▮": "&marker;",
            "⨩": "&mcomma;",
            "м": "&mcy;",
            "—": "&mdash;",
            "\uD835\uDD2A": "&mfr;",
            "℧": "&mho;",
            "\xb5": "&micro;",
            "⫰": "&midcir;",
            "−": "&minus;",
            "⨪": "&minusdu;",
            "⫛": "&mlcp;",
            "⊧": "&models;",
            "\uD835\uDD5E": "&mopf;",
            "\uD835\uDCC2": "&mscr;",
            "μ": "&mu;",
            "⊸": "&mumap;",
            "⋙̸": "&nGg;",
            "≫⃒": "&nGt;",
            "⇍": "&nlArr;",
            "⇎": "&nhArr;",
            "⋘̸": "&nLl;",
            "≪⃒": "&nLt;",
            "⇏": "&nrArr;",
            "⊯": "&nVDash;",
            "⊮": "&nVdash;",
            "ń": "&nacute;",
            "∠⃒": "&nang;",
            "⩰̸": "&napE;",
            "≋̸": "&napid;",
            "ŉ": "&napos;",
            "♮": "&natural;",
            "⩃": "&ncap;",
            "ň": "&ncaron;",
            "ņ": "&ncedil;",
            "⩭̸": "&ncongdot;",
            "⩂": "&ncup;",
            "н": "&ncy;",
            "–": "&ndash;",
            "⇗": "&neArr;",
            "⤤": "&nearhk;",
            "≐̸": "&nedot;",
            "⤨": "&toea;",
            "\uD835\uDD2B": "&nfr;",
            "↮": "&nleftrightarrow;",
            "⫲": "&nhpar;",
            "⋼": "&nis;",
            "⋺": "&nisd;",
            "њ": "&njcy;",
            "≦̸": "&nleqq;",
            "↚": "&nleftarrow;",
            "‥": "&nldr;",
            "\uD835\uDD5F": "&nopf;",
            "\xac": "&not;",
            "⋹̸": "&notinE;",
            "⋵̸": "&notindot;",
            "⋷": "&notinvb;",
            "⋶": "&notinvc;",
            "⋾": "&notnivb;",
            "⋽": "&notnivc;",
            "⫽⃥": "&nparsl;",
            "∂̸": "&npart;",
            "⨔": "&npolint;",
            "↛": "&nrightarrow;",
            "⤳̸": "&nrarrc;",
            "↝̸": "&nrarrw;",
            "\uD835\uDCC3": "&nscr;",
            "⊄": "&nsub;",
            "⫅̸": "&nsubseteqq;",
            "⊅": "&nsup;",
            "⫆̸": "&nsupseteqq;",
            "\xf1": "&ntilde;",
            "ν": "&nu;",
            "#": "&num;",
            "№": "&numero;",
            " ": "&numsp;",
            "⊭": "&nvDash;",
            "⤄": "&nvHarr;",
            "≍⃒": "&nvap;",
            "⊬": "&nvdash;",
            "≥⃒": "&nvge;",
            ">⃒": "&nvgt;",
            "⧞": "&nvinfin;",
            "⤂": "&nvlArr;",
            "≤⃒": "&nvle;",
            "<⃒": "&nvlt;",
            "⊴⃒": "&nvltrie;",
            "⤃": "&nvrArr;",
            "⊵⃒": "&nvrtrie;",
            "∼⃒": "&nvsim;",
            "⇖": "&nwArr;",
            "⤣": "&nwarhk;",
            "⤧": "&nwnear;",
            "\xf3": "&oacute;",
            "\xf4": "&ocirc;",
            "о": "&ocy;",
            "ő": "&odblac;",
            "⨸": "&odiv;",
            "⦼": "&odsold;",
            "œ": "&oelig;",
            "⦿": "&ofcir;",
            "\uD835\uDD2C": "&ofr;",
            "˛": "&ogon;",
            "\xf2": "&ograve;",
            "⧁": "&ogt;",
            "⦵": "&ohbar;",
            "⦾": "&olcir;",
            "⦻": "&olcross;",
            "⧀": "&olt;",
            "ō": "&omacr;",
            "ω": "&omega;",
            "ο": "&omicron;",
            "⦶": "&omid;",
            "\uD835\uDD60": "&oopf;",
            "⦷": "&opar;",
            "⦹": "&operp;",
            "∨": "&vee;",
            "⩝": "&ord;",
            "ℴ": "&oscr;",
            "\xaa": "&ordf;",
            "\xba": "&ordm;",
            "⊶": "&origof;",
            "⩖": "&oror;",
            "⩗": "&orslope;",
            "⩛": "&orv;",
            "\xf8": "&oslash;",
            "⊘": "&osol;",
            "\xf5": "&otilde;",
            "⨶": "&otimesas;",
            "\xf6": "&ouml;",
            "⌽": "&ovbar;",
            "\xb6": "&para;",
            "⫳": "&parsim;",
            "⫽": "&parsl;",
            "п": "&pcy;",
            "%": "&percnt;",
            ".": "&period;",
            "‰": "&permil;",
            "‱": "&pertenk;",
            "\uD835\uDD2D": "&pfr;",
            "φ": "&phi;",
            "ϕ": "&varphi;",
            "☎": "&phone;",
            "π": "&pi;",
            "ϖ": "&varpi;",
            "ℎ": "&planckh;",
            "+": "&plus;",
            "⨣": "&plusacir;",
            "⨢": "&pluscir;",
            "⨥": "&plusdu;",
            "⩲": "&pluse;",
            "⨦": "&plussim;",
            "⨧": "&plustwo;",
            "⨕": "&pointint;",
            "\uD835\uDD61": "&popf;",
            "\xa3": "&pound;",
            "⪳": "&prE;",
            "⪷": "&precapprox;",
            "⪹": "&prnap;",
            "⪵": "&prnE;",
            "⋨": "&prnsim;",
            "′": "&prime;",
            "⌮": "&profalar;",
            "⌒": "&profline;",
            "⌓": "&profsurf;",
            "⊰": "&prurel;",
            "\uD835\uDCC5": "&pscr;",
            "ψ": "&psi;",
            " ": "&puncsp;",
            "\uD835\uDD2E": "&qfr;",
            "\uD835\uDD62": "&qopf;",
            "⁗": "&qprime;",
            "\uD835\uDCC6": "&qscr;",
            "⨖": "&quatint;",
            "?": "&quest;",
            "⤜": "&rAtail;",
            "⥤": "&rHar;",
            "∽̱": "&race;",
            "ŕ": "&racute;",
            "⦳": "&raemptyv;",
            "⦒": "&rangd;",
            "⦥": "&range;",
            "\xbb": "&raquo;",
            "⥵": "&rarrap;",
            "⤠": "&rarrbfs;",
            "⤳": "&rarrc;",
            "⤞": "&rarrfs;",
            "⥅": "&rarrpl;",
            "⥴": "&rarrsim;",
            "↣": "&rightarrowtail;",
            "↝": "&rightsquigarrow;",
            "⤚": "&ratail;",
            "∶": "&ratio;",
            "❳": "&rbbrk;",
            "}": "&rcub;",
            "]": "&rsqb;",
            "⦌": "&rbrke;",
            "⦎": "&rbrksld;",
            "⦐": "&rbrkslu;",
            "ř": "&rcaron;",
            "ŗ": "&rcedil;",
            "р": "&rcy;",
            "⤷": "&rdca;",
            "⥩": "&rdldhar;",
            "↳": "&rdsh;",
            "▭": "&rect;",
            "⥽": "&rfisht;",
            "\uD835\uDD2F": "&rfr;",
            "⥬": "&rharul;",
            "ρ": "&rho;",
            "ϱ": "&varrho;",
            "⇉": "&rrarr;",
            "⋌": "&rthree;",
            "˚": "&ring;",
            "‏": "&rlm;",
            "⎱": "&rmoustache;",
            "⫮": "&rnmid;",
            "⟭": "&roang;",
            "⇾": "&roarr;",
            "⦆": "&ropar;",
            "\uD835\uDD63": "&ropf;",
            "⨮": "&roplus;",
            "⨵": "&rotimes;",
            ")": "&rpar;",
            "⦔": "&rpargt;",
            "⨒": "&rppolint;",
            "›": "&rsaquo;",
            "\uD835\uDCC7": "&rscr;",
            "⋊": "&rtimes;",
            "▹": "&triangleright;",
            "⧎": "&rtriltri;",
            "⥨": "&ruluhar;",
            "℞": "&rx;",
            "ś": "&sacute;",
            "⪴": "&scE;",
            "⪸": "&succapprox;",
            "š": "&scaron;",
            "ş": "&scedil;",
            "ŝ": "&scirc;",
            "⪶": "&succneqq;",
            "⪺": "&succnapprox;",
            "⋩": "&succnsim;",
            "⨓": "&scpolint;",
            "с": "&scy;",
            "⋅": "&sdot;",
            "⩦": "&sdote;",
            "⇘": "&seArr;",
            "\xa7": "&sect;",
            ";": "&semi;",
            "⤩": "&tosa;",
            "✶": "&sext;",
            "\uD835\uDD30": "&sfr;",
            "♯": "&sharp;",
            "щ": "&shchcy;",
            "ш": "&shcy;",
            "\xad": "&shy;",
            "σ": "&sigma;",
            "ς": "&varsigma;",
            "⩪": "&simdot;",
            "⪞": "&simg;",
            "⪠": "&simgE;",
            "⪝": "&siml;",
            "⪟": "&simlE;",
            "≆": "&simne;",
            "⨤": "&simplus;",
            "⥲": "&simrarr;",
            "⨳": "&smashp;",
            "⧤": "&smeparsl;",
            "⌣": "&ssmile;",
            "⪪": "&smt;",
            "⪬": "&smte;",
            "⪬︀": "&smtes;",
            "ь": "&softcy;",
            "/": "&sol;",
            "⧄": "&solb;",
            "⌿": "&solbar;",
            "\uD835\uDD64": "&sopf;",
            "♠": "&spadesuit;",
            "⊓︀": "&sqcaps;",
            "⊔︀": "&sqcups;",
            "\uD835\uDCC8": "&sscr;",
            "☆": "&star;",
            "⊂": "&subset;",
            "⫅": "&subseteqq;",
            "⪽": "&subdot;",
            "⫃": "&subedot;",
            "⫁": "&submult;",
            "⫋": "&subsetneqq;",
            "⊊": "&subsetneq;",
            "⪿": "&subplus;",
            "⥹": "&subrarr;",
            "⫇": "&subsim;",
            "⫕": "&subsub;",
            "⫓": "&subsup;",
            "♪": "&sung;",
            "\xb9": "&sup1;",
            "\xb2": "&sup2;",
            "\xb3": "&sup3;",
            "⫆": "&supseteqq;",
            "⪾": "&supdot;",
            "⫘": "&supdsub;",
            "⫄": "&supedot;",
            "⟉": "&suphsol;",
            "⫗": "&suphsub;",
            "⥻": "&suplarr;",
            "⫂": "&supmult;",
            "⫌": "&supsetneqq;",
            "⊋": "&supsetneq;",
            "⫀": "&supplus;",
            "⫈": "&supsim;",
            "⫔": "&supsub;",
            "⫖": "&supsup;",
            "⇙": "&swArr;",
            "⤪": "&swnwar;",
            "\xdf": "&szlig;",
            "⌖": "&target;",
            "τ": "&tau;",
            "ť": "&tcaron;",
            "ţ": "&tcedil;",
            "т": "&tcy;",
            "⌕": "&telrec;",
            "\uD835\uDD31": "&tfr;",
            "θ": "&theta;",
            "ϑ": "&vartheta;",
            "\xfe": "&thorn;",
            "\xd7": "&times;",
            "⨱": "&timesbar;",
            "⨰": "&timesd;",
            "⌶": "&topbot;",
            "⫱": "&topcir;",
            "\uD835\uDD65": "&topf;",
            "⫚": "&topfork;",
            "‴": "&tprime;",
            "▵": "&utri;",
            "≜": "&trie;",
            "◬": "&tridot;",
            "⨺": "&triminus;",
            "⨹": "&triplus;",
            "⧍": "&trisb;",
            "⨻": "&tritime;",
            "⏢": "&trpezium;",
            "\uD835\uDCC9": "&tscr;",
            "ц": "&tscy;",
            "ћ": "&tshcy;",
            "ŧ": "&tstrok;",
            "⥣": "&uHar;",
            "\xfa": "&uacute;",
            "ў": "&ubrcy;",
            "ŭ": "&ubreve;",
            "\xfb": "&ucirc;",
            "у": "&ucy;",
            "ű": "&udblac;",
            "⥾": "&ufisht;",
            "\uD835\uDD32": "&ufr;",
            "\xf9": "&ugrave;",
            "▀": "&uhblk;",
            "⌜": "&ulcorner;",
            "⌏": "&ulcrop;",
            "◸": "&ultri;",
            "ū": "&umacr;",
            "ų": "&uogon;",
            "\uD835\uDD66": "&uopf;",
            "υ": "&upsilon;",
            "⇈": "&uuarr;",
            "⌝": "&urcorner;",
            "⌎": "&urcrop;",
            "ů": "&uring;",
            "◹": "&urtri;",
            "\uD835\uDCCA": "&uscr;",
            "⋰": "&utdot;",
            "ũ": "&utilde;",
            "\xfc": "&uuml;",
            "⦧": "&uwangle;",
            "⫨": "&vBar;",
            "⫩": "&vBarv;",
            "⦜": "&vangrt;",
            "⊊︀": "&vsubne;",
            "⫋︀": "&vsubnE;",
            "⊋︀": "&vsupne;",
            "⫌︀": "&vsupnE;",
            "в": "&vcy;",
            "⊻": "&veebar;",
            "≚": "&veeeq;",
            "⋮": "&vellip;",
            "\uD835\uDD33": "&vfr;",
            "\uD835\uDD67": "&vopf;",
            "\uD835\uDCCB": "&vscr;",
            "⦚": "&vzigzag;",
            "ŵ": "&wcirc;",
            "⩟": "&wedbar;",
            "≙": "&wedgeq;",
            "℘": "&wp;",
            "\uD835\uDD34": "&wfr;",
            "\uD835\uDD68": "&wopf;",
            "\uD835\uDCCC": "&wscr;",
            "\uD835\uDD35": "&xfr;",
            "ξ": "&xi;",
            "⋻": "&xnis;",
            "\uD835\uDD69": "&xopf;",
            "\uD835\uDCCD": "&xscr;",
            "\xfd": "&yacute;",
            "я": "&yacy;",
            "ŷ": "&ycirc;",
            "ы": "&ycy;",
            "\xa5": "&yen;",
            "\uD835\uDD36": "&yfr;",
            "ї": "&yicy;",
            "\uD835\uDD6A": "&yopf;",
            "\uD835\uDCCE": "&yscr;",
            "ю": "&yucy;",
            "\xff": "&yuml;",
            "ź": "&zacute;",
            "ž": "&zcaron;",
            "з": "&zcy;",
            "ż": "&zdot;",
            "ζ": "&zeta;",
            "\uD835\uDD37": "&zfr;",
            "ж": "&zhcy;",
            "⇝": "&zigrarr;",
            "\uD835\uDD6B": "&zopf;",
            "\uD835\uDCCF": "&zscr;",
            "‍": "&zwj;",
            "‌": "&zwnj;"
        }
    }
};


/***/ }),

/***/ "../../node_modules/html-entities/lib/numeric-unicode-map.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/html-entities/lib/numeric-unicode-map.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.numericUnicodeMap = {
    0: 65533,
    128: 8364,
    130: 8218,
    131: 402,
    132: 8222,
    133: 8230,
    134: 8224,
    135: 8225,
    136: 710,
    137: 8240,
    138: 352,
    139: 8249,
    140: 338,
    142: 381,
    145: 8216,
    146: 8217,
    147: 8220,
    148: 8221,
    149: 8226,
    150: 8211,
    151: 8212,
    152: 732,
    153: 8482,
    154: 353,
    155: 8250,
    156: 339,
    158: 382,
    159: 376
};


/***/ }),

/***/ "../../node_modules/html-entities/lib/surrogate-pairs.js":
/*!***************************************************************!*\
  !*** ../../node_modules/html-entities/lib/surrogate-pairs.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fromCodePoint = String.fromCodePoint || function(astralCodePoint) {
    return String.fromCharCode(Math.floor((astralCodePoint - 65536) / 1024) + 55296, (astralCodePoint - 65536) % 1024 + 56320);
};
exports.getCodePoint = String.prototype.codePointAt ? function(input, position) {
    return input.codePointAt(position);
} : function(input, position) {
    return (input.charCodeAt(position) - 55296) * 1024 + input.charCodeAt(position + 1) - 56320 + 65536;
};
exports.highSurrogateFrom = 55296;
exports.highSurrogateTo = 56319;


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/clients/WebSocketClient.js":
/*!*******************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/clients/WebSocketClient.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WebSocketClient)
/* harmony export */ });
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/log.js */ "../../node_modules/webpack-dev-server/client/utils/log.js");
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
        writable: false
    });
    return Constructor;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return (typeof key === "undefined" ? "undefined" : _type_of(key)) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}

var WebSocketClient = /*#__PURE__*/ function() {
    /**
   * @param {string} url
   */ function WebSocketClient(url) {
        _classCallCheck(this, WebSocketClient);
        this.client = new WebSocket(url);
        this.client.onerror = function(error) {
            _utils_log_js__WEBPACK_IMPORTED_MODULE_0__.log.error(error);
        };
    }
    /**
   * @param {(...args: any[]) => void} f
   */ _createClass(WebSocketClient, [
        {
            key: "onOpen",
            value: function onOpen(f) {
                this.client.onopen = f;
            }
        },
        {
            key: "onClose",
            value: function onClose(f) {
                this.client.onclose = f;
            }
        },
        {
            key: "onMessage",
            value: function onMessage(f) {
                this.client.onmessage = function(e) {
                    f(e.data);
                };
            }
        }
    ]);
    return WebSocketClient;
}();



/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=6084&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true":
/*!***************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=6084&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true ***!
  \***************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
var __resourceQuery = "?protocol=ws%3A&hostname=0.0.0.0&port=6084&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webpack/hot/log.js */ "../../node_modules/webpack/hot/log.js");
/* harmony import */ var webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_stripAnsi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/stripAnsi.js */ "../../node_modules/webpack-dev-server/client/utils/stripAnsi.js");
/* harmony import */ var _utils_parseURL_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/parseURL.js */ "../../node_modules/webpack-dev-server/client/utils/parseURL.js");
/* harmony import */ var _socket_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./socket.js */ "../../node_modules/webpack-dev-server/client/socket.js");
/* harmony import */ var _overlay_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./overlay.js */ "../../node_modules/webpack-dev-server/client/overlay.js");
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/log.js */ "../../node_modules/webpack-dev-server/client/utils/log.js");
/* harmony import */ var _utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/sendMessage.js */ "../../node_modules/webpack-dev-server/client/utils/sendMessage.js");
/* harmony import */ var _utils_reloadApp_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/reloadApp.js */ "../../node_modules/webpack-dev-server/client/utils/reloadApp.js");
/* harmony import */ var _utils_createSocketURL_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/createSocketURL.js */ "../../node_modules/webpack-dev-server/client/utils/createSocketURL.js");
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return (typeof key === "undefined" ? "undefined" : _type_of(key)) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
/* global __resourceQuery, __webpack_hash__ */ /// <reference types="webpack/module" />









/**
 * @typedef {Object} OverlayOptions
 * @property {boolean | (error: Error) => boolean} [warnings]
 * @property {boolean | (error: Error) => boolean} [errors]
 * @property {boolean | (error: Error) => boolean} [runtimeErrors]
 * @property {string} [trustedTypesPolicyName]
 */ /**
 * @typedef {Object} Options
 * @property {boolean} hot
 * @property {boolean} liveReload
 * @property {boolean} progress
 * @property {boolean | OverlayOptions} overlay
 * @property {string} [logging]
 * @property {number} [reconnect]
 */ /**
 * @typedef {Object} Status
 * @property {boolean} isUnloading
 * @property {string} currentHash
 * @property {string} [previousHash]
 */ /**
 * @param {boolean | { warnings?: boolean | string; errors?: boolean | string; runtimeErrors?: boolean | string; }} overlayOptions
 */ var decodeOverlayOptions = function decodeOverlayOptions(overlayOptions) {
    if (typeof overlayOptions === "object") {
        [
            "warnings",
            "errors",
            "runtimeErrors"
        ].forEach(function(property) {
            if (typeof overlayOptions[property] === "string") {
                var overlayFilterFunctionString = decodeURIComponent(overlayOptions[property]);
                // eslint-disable-next-line no-new-func
                var overlayFilterFunction = new Function("message", "var callback = ".concat(overlayFilterFunctionString, "\n        return callback(message)"));
                overlayOptions[property] = overlayFilterFunction;
            }
        });
    }
};
/**
 * @type {Status}
 */ var status = {
    isUnloading: false,
    // TODO Workaround for webpack v4, `__webpack_hash__` is not replaced without HotModuleReplacement
    // eslint-disable-next-line camelcase
    currentHash:  true ? __webpack_require__.h() : 0
};
/** @type {Options} */ var options = {
    hot: false,
    liveReload: false,
    progress: false,
    overlay: false
};
var parsedResourceQuery = (0,_utils_parseURL_js__WEBPACK_IMPORTED_MODULE_2__["default"])(__resourceQuery);
var enabledFeatures = {
    "Hot Module Replacement": false,
    "Live Reloading": false,
    Progress: false,
    Overlay: false
};
if (parsedResourceQuery.hot === "true") {
    options.hot = true;
    enabledFeatures["Hot Module Replacement"] = true;
}
if (parsedResourceQuery["live-reload"] === "true") {
    options.liveReload = true;
    enabledFeatures["Live Reloading"] = true;
}
if (parsedResourceQuery.progress === "true") {
    options.progress = true;
    enabledFeatures.Progress = true;
}
if (parsedResourceQuery.overlay) {
    try {
        options.overlay = JSON.parse(parsedResourceQuery.overlay);
    } catch (e) {
        _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error("Error parsing overlay options from resource query:", e);
    }
    // Fill in default "true" params for partially-specified objects.
    if (typeof options.overlay === "object") {
        options.overlay = _objectSpread({
            errors: true,
            warnings: true,
            runtimeErrors: true
        }, options.overlay);
        decodeOverlayOptions(options.overlay);
    }
    enabledFeatures.Overlay = true;
}
if (parsedResourceQuery.logging) {
    options.logging = parsedResourceQuery.logging;
}
if (typeof parsedResourceQuery.reconnect !== "undefined") {
    options.reconnect = Number(parsedResourceQuery.reconnect);
}
/**
 * @param {string} level
 */ function setAllLogLevel(level) {
    // This is needed because the HMR logger operate separately from dev server logger
    webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0___default().setLogLevel(level === "verbose" || level === "log" ? "info" : level);
    (0,_utils_log_js__WEBPACK_IMPORTED_MODULE_5__.setLogLevel)(level);
}
if (options.logging) {
    setAllLogLevel(options.logging);
}
(0,_utils_log_js__WEBPACK_IMPORTED_MODULE_5__.logEnabledFeatures)(enabledFeatures);
self.addEventListener("beforeunload", function() {
    status.isUnloading = true;
});
var overlay = typeof window !== "undefined" ? (0,_overlay_js__WEBPACK_IMPORTED_MODULE_4__.createOverlay)(typeof options.overlay === "object" ? {
    trustedTypesPolicyName: options.overlay.trustedTypesPolicyName,
    catchRuntimeError: options.overlay.runtimeErrors
} : {
    trustedTypesPolicyName: false,
    catchRuntimeError: options.overlay
}) : {
    send: function send() {}
};
var onSocketMessage = {
    hot: function hot() {
        if (parsedResourceQuery.hot === "false") {
            return;
        }
        options.hot = true;
    },
    liveReload: function liveReload() {
        if (parsedResourceQuery["live-reload"] === "false") {
            return;
        }
        options.liveReload = true;
    },
    invalid: function invalid() {
        _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("App updated. Recompiling...");
        // Fixes #1042. overlay doesn't clear if errors are fixed but warnings remain.
        if (options.overlay) {
            overlay.send({
                type: "DISMISS"
            });
        }
        (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Invalid");
    },
    /**
   * @param {string} hash
   */ hash: function hash(_hash) {
        status.previousHash = status.currentHash;
        status.currentHash = _hash;
    },
    logging: setAllLogLevel,
    /**
   * @param {boolean} value
   */ overlay: function overlay(value) {
        if (typeof document === "undefined") {
            return;
        }
        options.overlay = value;
        decodeOverlayOptions(options.overlay);
    },
    /**
   * @param {number} value
   */ reconnect: function reconnect(value) {
        if (parsedResourceQuery.reconnect === "false") {
            return;
        }
        options.reconnect = value;
    },
    /**
   * @param {boolean} value
   */ progress: function progress(value) {
        options.progress = value;
    },
    /**
   * @param {{ pluginName?: string, percent: number, msg: string }} data
   */ "progress-update": function progressUpdate(data) {
        if (options.progress) {
            _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("".concat(data.pluginName ? "[".concat(data.pluginName, "] ") : "").concat(data.percent, "% - ").concat(data.msg, "."));
        }
        (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Progress", data);
    },
    "still-ok": function stillOk() {
        _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("Nothing changed.");
        if (options.overlay) {
            overlay.send({
                type: "DISMISS"
            });
        }
        (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("StillOk");
    },
    ok: function ok() {
        (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Ok");
        if (options.overlay) {
            overlay.send({
                type: "DISMISS"
            });
        }
        (0,_utils_reloadApp_js__WEBPACK_IMPORTED_MODULE_7__["default"])(options, status);
    },
    // TODO: remove in v5 in favor of 'static-changed'
    /**
   * @param {string} file
   */ "content-changed": function contentChanged(file) {
        _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("".concat(file ? '"'.concat(file, '"') : "Content", " from static directory was changed. Reloading..."));
        self.location.reload();
    },
    /**
   * @param {string} file
   */ "static-changed": function staticChanged(file) {
        _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("".concat(file ? '"'.concat(file, '"') : "Content", " from static directory was changed. Reloading..."));
        self.location.reload();
    },
    /**
   * @param {Error[]} warnings
   * @param {any} params
   */ warnings: function warnings(_warnings, params) {
        _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.warn("Warnings while compiling.");
        var printableWarnings = _warnings.map(function(error) {
            var _formatProblem = (0,_overlay_js__WEBPACK_IMPORTED_MODULE_4__.formatProblem)("warning", error), header = _formatProblem.header, body = _formatProblem.body;
            return "".concat(header, "\n").concat((0,_utils_stripAnsi_js__WEBPACK_IMPORTED_MODULE_1__["default"])(body));
        });
        (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Warnings", printableWarnings);
        for(var i = 0; i < printableWarnings.length; i++){
            _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.warn(printableWarnings[i]);
        }
        var overlayWarningsSetting = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.warnings;
        if (overlayWarningsSetting) {
            var warningsToDisplay = typeof overlayWarningsSetting === "function" ? _warnings.filter(overlayWarningsSetting) : _warnings;
            if (warningsToDisplay.length) {
                overlay.send({
                    type: "BUILD_ERROR",
                    level: "warning",
                    messages: _warnings
                });
            }
        }
        if (params && params.preventReloading) {
            return;
        }
        (0,_utils_reloadApp_js__WEBPACK_IMPORTED_MODULE_7__["default"])(options, status);
    },
    /**
   * @param {Error[]} errors
   */ errors: function errors(_errors) {
        _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error("Errors while compiling. Reload prevented.");
        var printableErrors = _errors.map(function(error) {
            var _formatProblem2 = (0,_overlay_js__WEBPACK_IMPORTED_MODULE_4__.formatProblem)("error", error), header = _formatProblem2.header, body = _formatProblem2.body;
            return "".concat(header, "\n").concat((0,_utils_stripAnsi_js__WEBPACK_IMPORTED_MODULE_1__["default"])(body));
        });
        (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Errors", printableErrors);
        for(var i = 0; i < printableErrors.length; i++){
            _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error(printableErrors[i]);
        }
        var overlayErrorsSettings = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.errors;
        if (overlayErrorsSettings) {
            var errorsToDisplay = typeof overlayErrorsSettings === "function" ? _errors.filter(overlayErrorsSettings) : _errors;
            if (errorsToDisplay.length) {
                overlay.send({
                    type: "BUILD_ERROR",
                    level: "error",
                    messages: _errors
                });
            }
        }
    },
    /**
   * @param {Error} error
   */ error: function error(_error) {
        _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error(_error);
    },
    close: function close() {
        _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("Disconnected!");
        if (options.overlay) {
            overlay.send({
                type: "DISMISS"
            });
        }
        (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Close");
    }
};
var socketURL = (0,_utils_createSocketURL_js__WEBPACK_IMPORTED_MODULE_8__["default"])(parsedResourceQuery);
(0,_socket_js__WEBPACK_IMPORTED_MODULE_3__["default"])(socketURL, onSocketMessage, options.reconnect);


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/modules/logger/index.js":
/*!****************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/modules/logger/index.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
/******/ (function() {
    /******/ "use strict";
    /******/ var __webpack_modules__ = {
        /***/ "./client-src/modules/logger/SyncBailHookFake.js": /*!*******************************************************!*\
  !*** ./client-src/modules/logger/SyncBailHookFake.js ***!
  \*******************************************************/ /***/ function(module) {
            /**
 * Client stub for tapable SyncBailHook
 */ module.exports = function clientTapableSyncBailHook() {
                return {
                    call: function call() {}
                };
            };
        /***/ },
        /***/ "./node_modules/webpack/lib/logging/Logger.js": /*!****************************************************!*\
  !*** ./node_modules/webpack/lib/logging/Logger.js ***!
  \****************************************************/ /***/ function(__unused_webpack_module, exports1) {
            var _toConsumableArray = /*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ function _toConsumableArray(arr) {
                return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
            };
            var _nonIterableSpread = function _nonIterableSpread() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            };
            var _unsupportedIterableToArray = function _unsupportedIterableToArray(o, minLen) {
                if (!o) return;
                if (typeof o === "string") return _arrayLikeToArray(o, minLen);
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === "Object" && o.constructor) n = o.constructor.name;
                if (n === "Map" || n === "Set") return Array.from(o);
                if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
            };
            var _iterableToArray = function _iterableToArray(iter) {
                if (typeof (typeof Symbol !== "undefined" ? Symbol : function(i) {
                    return i;
                }) !== "undefined" && iter[(typeof Symbol !== "undefined" ? Symbol : function(i) {
                    return i;
                }).iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
            };
            var _arrayWithoutHoles = function _arrayWithoutHoles(arr) {
                if (Array.isArray(arr)) return _arrayLikeToArray(arr);
            };
            var _arrayLikeToArray = function _arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
                for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
                return arr2;
            };
            var _classCallCheck = function _classCallCheck(instance, Constructor) {
                if (!_instanceof(instance, Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            };
            var _defineProperties = function _defineProperties(target, props) {
                for(var i = 0; i < props.length; i++){
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
                }
            };
            var _createClass = function _createClass(Constructor, protoProps, staticProps) {
                if (protoProps) _defineProperties(Constructor.prototype, protoProps);
                if (staticProps) _defineProperties(Constructor, staticProps);
                Object.defineProperty(Constructor, "prototype", {
                    writable: false
                });
                return Constructor;
            };
            var _toPropertyKey = function _toPropertyKey(arg) {
                var key = _toPrimitive(arg, "string");
                return (typeof key === "undefined" ? "undefined" : _type_of(key)) === "symbol" ? key : String(key);
            };
            var _toPrimitive = function _toPrimitive(input, hint) {
                if (typeof input !== "object" || input === null) return input;
                var prim = input[(typeof Symbol !== "undefined" ? Symbol : function prim(i) {
                    return i;
                }).toPrimitive];
                if (prim !== undefined) {
                    var res = prim.call(input, hint || "default");
                    if (typeof res !== "object") return res;
                    throw new TypeError("@@toPrimitive must return a primitive value.");
                }
                return (hint === "string" ? String : Number)(input);
            };
            var LogType = Object.freeze({
                error: /** @type {"error"} */ "error",
                // message, c style arguments
                warn: /** @type {"warn"} */ "warn",
                // message, c style arguments
                info: /** @type {"info"} */ "info",
                // message, c style arguments
                log: /** @type {"log"} */ "log",
                // message, c style arguments
                debug: /** @type {"debug"} */ "debug",
                // message, c style arguments
                trace: /** @type {"trace"} */ "trace",
                // no arguments
                group: /** @type {"group"} */ "group",
                // [label]
                groupCollapsed: /** @type {"groupCollapsed"} */ "groupCollapsed",
                // [label]
                groupEnd: /** @type {"groupEnd"} */ "groupEnd",
                // [label]
                profile: /** @type {"profile"} */ "profile",
                // [profileName]
                profileEnd: /** @type {"profileEnd"} */ "profileEnd",
                // [profileName]
                time: /** @type {"time"} */ "time",
                // name, time as [seconds, nanoseconds]
                clear: /** @type {"clear"} */ "clear",
                // no arguments
                status: /** @type {"status"} */ "status" // message, arguments
            });
            exports1.LogType = LogType;
            /** @typedef {typeof LogType[keyof typeof LogType]} LogTypeEnum */ var LOG_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function(i) {
                return i;
            })("webpack logger raw log method");
            var TIMERS_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function(i) {
                return i;
            })("webpack logger times");
            var TIMERS_AGGREGATES_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function(i) {
                return i;
            })("webpack logger aggregated times");
            var WebpackLogger = /*#__PURE__*/ function() {
                /**
   * @param {function(LogTypeEnum, any[]=): void} log log function
   * @param {function(string | function(): string): WebpackLogger} getChildLogger function to create child logger
   */ function WebpackLogger(log, getChildLogger) {
                    _classCallCheck(this, WebpackLogger);
                    this[LOG_SYMBOL] = log;
                    this.getChildLogger = getChildLogger;
                }
                _createClass(WebpackLogger, [
                    {
                        key: "error",
                        value: function error() {
                            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                                args[_key] = arguments[_key];
                            }
                            this[LOG_SYMBOL](LogType.error, args);
                        }
                    },
                    {
                        key: "warn",
                        value: function warn() {
                            for(var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++){
                                args[_key2] = arguments[_key2];
                            }
                            this[LOG_SYMBOL](LogType.warn, args);
                        }
                    },
                    {
                        key: "info",
                        value: function info() {
                            for(var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++){
                                args[_key3] = arguments[_key3];
                            }
                            this[LOG_SYMBOL](LogType.info, args);
                        }
                    },
                    {
                        key: "log",
                        value: function log() {
                            for(var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++){
                                args[_key4] = arguments[_key4];
                            }
                            this[LOG_SYMBOL](LogType.log, args);
                        }
                    },
                    {
                        key: "debug",
                        value: function debug() {
                            for(var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++){
                                args[_key5] = arguments[_key5];
                            }
                            this[LOG_SYMBOL](LogType.debug, args);
                        }
                    },
                    {
                        key: "assert",
                        value: function assert(assertion) {
                            if (!assertion) {
                                for(var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++){
                                    args[_key6 - 1] = arguments[_key6];
                                }
                                this[LOG_SYMBOL](LogType.error, args);
                            }
                        }
                    },
                    {
                        key: "trace",
                        value: function trace() {
                            this[LOG_SYMBOL](LogType.trace, [
                                "Trace"
                            ]);
                        }
                    },
                    {
                        key: "clear",
                        value: function clear() {
                            this[LOG_SYMBOL](LogType.clear);
                        }
                    },
                    {
                        key: "status",
                        value: function status() {
                            for(var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++){
                                args[_key7] = arguments[_key7];
                            }
                            this[LOG_SYMBOL](LogType.status, args);
                        }
                    },
                    {
                        key: "group",
                        value: function group() {
                            for(var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++){
                                args[_key8] = arguments[_key8];
                            }
                            this[LOG_SYMBOL](LogType.group, args);
                        }
                    },
                    {
                        key: "groupCollapsed",
                        value: function groupCollapsed() {
                            for(var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++){
                                args[_key9] = arguments[_key9];
                            }
                            this[LOG_SYMBOL](LogType.groupCollapsed, args);
                        }
                    },
                    {
                        key: "groupEnd",
                        value: function groupEnd() {
                            for(var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++){
                                args[_key10] = arguments[_key10];
                            }
                            this[LOG_SYMBOL](LogType.groupEnd, args);
                        }
                    },
                    {
                        key: "profile",
                        value: function profile(label) {
                            this[LOG_SYMBOL](LogType.profile, [
                                label
                            ]);
                        }
                    },
                    {
                        key: "profileEnd",
                        value: function profileEnd(label) {
                            this[LOG_SYMBOL](LogType.profileEnd, [
                                label
                            ]);
                        }
                    },
                    {
                        key: "time",
                        value: function time(label) {
                            this[TIMERS_SYMBOL] = this[TIMERS_SYMBOL] || new Map();
                            this[TIMERS_SYMBOL].set(label, process.hrtime());
                        }
                    },
                    {
                        key: "timeLog",
                        value: function timeLog(label) {
                            var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
                            if (!prev) {
                                throw new Error("No such label '".concat(label, "' for WebpackLogger.timeLog()"));
                            }
                            var time = process.hrtime(prev);
                            this[LOG_SYMBOL](LogType.time, [
                                label
                            ].concat(_toConsumableArray(time)));
                        }
                    },
                    {
                        key: "timeEnd",
                        value: function timeEnd(label) {
                            var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
                            if (!prev) {
                                throw new Error("No such label '".concat(label, "' for WebpackLogger.timeEnd()"));
                            }
                            var time = process.hrtime(prev);
                            this[TIMERS_SYMBOL].delete(label);
                            this[LOG_SYMBOL](LogType.time, [
                                label
                            ].concat(_toConsumableArray(time)));
                        }
                    },
                    {
                        key: "timeAggregate",
                        value: function timeAggregate(label) {
                            var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
                            if (!prev) {
                                throw new Error("No such label '".concat(label, "' for WebpackLogger.timeAggregate()"));
                            }
                            var time = process.hrtime(prev);
                            this[TIMERS_SYMBOL].delete(label);
                            this[TIMERS_AGGREGATES_SYMBOL] = this[TIMERS_AGGREGATES_SYMBOL] || new Map();
                            var current = this[TIMERS_AGGREGATES_SYMBOL].get(label);
                            if (current !== undefined) {
                                if (time[1] + current[1] > 1e9) {
                                    time[0] += current[0] + 1;
                                    time[1] = time[1] - 1e9 + current[1];
                                } else {
                                    time[0] += current[0];
                                    time[1] += current[1];
                                }
                            }
                            this[TIMERS_AGGREGATES_SYMBOL].set(label, time);
                        }
                    },
                    {
                        key: "timeAggregateEnd",
                        value: function timeAggregateEnd(label) {
                            if (this[TIMERS_AGGREGATES_SYMBOL] === undefined) return;
                            var time = this[TIMERS_AGGREGATES_SYMBOL].get(label);
                            if (time === undefined) return;
                            this[TIMERS_AGGREGATES_SYMBOL].delete(label);
                            this[LOG_SYMBOL](LogType.time, [
                                label
                            ].concat(_toConsumableArray(time)));
                        }
                    }
                ]);
                return WebpackLogger;
            }();
            exports1.Logger = WebpackLogger;
        /***/ },
        /***/ "./node_modules/webpack/lib/logging/createConsoleLogger.js": /*!*****************************************************************!*\
  !*** ./node_modules/webpack/lib/logging/createConsoleLogger.js ***!
  \*****************************************************************/ /***/ function(module, __unused_webpack_exports, __nested_webpack_require_17823__) {
            var _toConsumableArray = /*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ function _toConsumableArray(arr) {
                return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
            };
            var _nonIterableSpread = function _nonIterableSpread() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            };
            var _unsupportedIterableToArray = function _unsupportedIterableToArray(o, minLen) {
                if (!o) return;
                if (typeof o === "string") return _arrayLikeToArray(o, minLen);
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === "Object" && o.constructor) n = o.constructor.name;
                if (n === "Map" || n === "Set") return Array.from(o);
                if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
            };
            var _iterableToArray = function _iterableToArray(iter) {
                if (typeof (typeof Symbol !== "undefined" ? Symbol : function(i) {
                    return i;
                }) !== "undefined" && iter[(typeof Symbol !== "undefined" ? Symbol : function(i) {
                    return i;
                }).iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
            };
            var _arrayWithoutHoles = function _arrayWithoutHoles(arr) {
                if (Array.isArray(arr)) return _arrayLikeToArray(arr);
            };
            var _arrayLikeToArray = function _arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
                for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
                return arr2;
            };
            var _require = __nested_webpack_require_17823__(/*! ./Logger */ "./node_modules/webpack/lib/logging/Logger.js"), LogType = _require.LogType;
            /** @typedef {import("../../declarations/WebpackOptions").FilterItemTypes} FilterItemTypes */ /** @typedef {import("../../declarations/WebpackOptions").FilterTypes} FilterTypes */ /** @typedef {import("./Logger").LogTypeEnum} LogTypeEnum */ /** @typedef {function(string): boolean} FilterFunction */ /**
 * @typedef {Object} LoggerConsole
 * @property {function(): void} clear
 * @property {function(): void} trace
 * @property {(...args: any[]) => void} info
 * @property {(...args: any[]) => void} log
 * @property {(...args: any[]) => void} warn
 * @property {(...args: any[]) => void} error
 * @property {(...args: any[]) => void=} debug
 * @property {(...args: any[]) => void=} group
 * @property {(...args: any[]) => void=} groupCollapsed
 * @property {(...args: any[]) => void=} groupEnd
 * @property {(...args: any[]) => void=} status
 * @property {(...args: any[]) => void=} profile
 * @property {(...args: any[]) => void=} profileEnd
 * @property {(...args: any[]) => void=} logTime
 */ /**
 * @typedef {Object} LoggerOptions
 * @property {false|true|"none"|"error"|"warn"|"info"|"log"|"verbose"} level loglevel
 * @property {FilterTypes|boolean} debug filter for debug logging
 * @property {LoggerConsole} console the console to log to
 */ /**
 * @param {FilterItemTypes} item an input item
 * @returns {FilterFunction} filter function
 */ var filterToFunction = function filterToFunction(item) {
                if (typeof item === "string") {
                    var regExp = new RegExp("[\\\\/]".concat(item.replace(// eslint-disable-next-line no-useless-escape
                    /[-[\]{}()*+?.\\^$|]/g, "\\$&"), "([\\\\/]|$|!|\\?)"));
                    return function(ident) {
                        return regExp.test(ident);
                    };
                }
                if (item && typeof item === "object" && typeof item.test === "function") {
                    return function(ident) {
                        return item.test(ident);
                    };
                }
                if (typeof item === "function") {
                    return item;
                }
                if (typeof item === "boolean") {
                    return function() {
                        return item;
                    };
                }
            };
            /**
 * @enum {number}
 */ var LogLevel = {
                none: 6,
                false: 6,
                error: 5,
                warn: 4,
                info: 3,
                log: 2,
                true: 2,
                verbose: 1
            };
            /**
 * @param {LoggerOptions} options options object
 * @returns {function(string, LogTypeEnum, any[]): void} logging function
 */ module.exports = function(_ref) {
                var _ref$level = _ref.level, level = _ref$level === void 0 ? "info" : _ref$level, _ref$debug = _ref.debug, debug = _ref$debug === void 0 ? false : _ref$debug, console1 = _ref.console;
                var debugFilters = typeof debug === "boolean" ? [
                    function() {
                        return debug;
                    }
                ] : /** @type {FilterItemTypes[]} */ [].concat(debug).map(filterToFunction);
                /** @type {number} */ var loglevel = LogLevel["".concat(level)] || 0;
                /**
   * @param {string} name name of the logger
   * @param {LogTypeEnum} type type of the log entry
   * @param {any[]} args arguments of the log entry
   * @returns {void}
   */ var logger = function logger(name, type, args) {
                    var labeledArgs = function labeledArgs() {
                        if (Array.isArray(args)) {
                            if (args.length > 0 && typeof args[0] === "string") {
                                return [
                                    "[".concat(name, "] ").concat(args[0])
                                ].concat(_toConsumableArray(args.slice(1)));
                            } else {
                                return [
                                    "[".concat(name, "]")
                                ].concat(_toConsumableArray(args));
                            }
                        } else {
                            return [];
                        }
                    };
                    var debug = debugFilters.some(function(f) {
                        return f(name);
                    });
                    switch(type){
                        case LogType.debug:
                            if (!debug) return;
                            // eslint-disable-next-line node/no-unsupported-features/node-builtins
                            if (typeof console1.debug === "function") {
                                // eslint-disable-next-line node/no-unsupported-features/node-builtins
                                console1.debug.apply(console1, _toConsumableArray(labeledArgs()));
                            } else {
                                console1.log.apply(console1, _toConsumableArray(labeledArgs()));
                            }
                            break;
                        case LogType.log:
                            if (!debug && loglevel > LogLevel.log) return;
                            console1.log.apply(console1, _toConsumableArray(labeledArgs()));
                            break;
                        case LogType.info:
                            if (!debug && loglevel > LogLevel.info) return;
                            console1.info.apply(console1, _toConsumableArray(labeledArgs()));
                            break;
                        case LogType.warn:
                            if (!debug && loglevel > LogLevel.warn) return;
                            console1.warn.apply(console1, _toConsumableArray(labeledArgs()));
                            break;
                        case LogType.error:
                            if (!debug && loglevel > LogLevel.error) return;
                            console1.error.apply(console1, _toConsumableArray(labeledArgs()));
                            break;
                        case LogType.trace:
                            if (!debug) return;
                            console1.trace();
                            break;
                        case LogType.groupCollapsed:
                            if (!debug && loglevel > LogLevel.log) return;
                            if (!debug && loglevel > LogLevel.verbose) {
                                // eslint-disable-next-line node/no-unsupported-features/node-builtins
                                if (typeof console1.groupCollapsed === "function") {
                                    // eslint-disable-next-line node/no-unsupported-features/node-builtins
                                    console1.groupCollapsed.apply(console1, _toConsumableArray(labeledArgs()));
                                } else {
                                    console1.log.apply(console1, _toConsumableArray(labeledArgs()));
                                }
                                break;
                            }
                        // falls through
                        case LogType.group:
                            if (!debug && loglevel > LogLevel.log) return;
                            // eslint-disable-next-line node/no-unsupported-features/node-builtins
                            if (typeof console1.group === "function") {
                                // eslint-disable-next-line node/no-unsupported-features/node-builtins
                                console1.group.apply(console1, _toConsumableArray(labeledArgs()));
                            } else {
                                console1.log.apply(console1, _toConsumableArray(labeledArgs()));
                            }
                            break;
                        case LogType.groupEnd:
                            if (!debug && loglevel > LogLevel.log) return;
                            // eslint-disable-next-line node/no-unsupported-features/node-builtins
                            if (typeof console1.groupEnd === "function") {
                                // eslint-disable-next-line node/no-unsupported-features/node-builtins
                                console1.groupEnd();
                            }
                            break;
                        case LogType.time:
                            {
                                if (!debug && loglevel > LogLevel.log) return;
                                var ms = args[1] * 1000 + args[2] / 1000000;
                                var msg = "[".concat(name, "] ").concat(args[0], ": ").concat(ms, " ms");
                                if (typeof console1.logTime === "function") {
                                    console1.logTime(msg);
                                } else {
                                    console1.log(msg);
                                }
                                break;
                            }
                        case LogType.profile:
                            // eslint-disable-next-line node/no-unsupported-features/node-builtins
                            if (typeof console1.profile === "function") {
                                // eslint-disable-next-line node/no-unsupported-features/node-builtins
                                console1.profile.apply(console1, _toConsumableArray(labeledArgs()));
                            }
                            break;
                        case LogType.profileEnd:
                            // eslint-disable-next-line node/no-unsupported-features/node-builtins
                            if (typeof console1.profileEnd === "function") {
                                // eslint-disable-next-line node/no-unsupported-features/node-builtins
                                console1.profileEnd.apply(console1, _toConsumableArray(labeledArgs()));
                            }
                            break;
                        case LogType.clear:
                            if (!debug && loglevel > LogLevel.log) return;
                            // eslint-disable-next-line node/no-unsupported-features/node-builtins
                            if (typeof console1.clear === "function") {
                                // eslint-disable-next-line node/no-unsupported-features/node-builtins
                                console1.clear();
                            }
                            break;
                        case LogType.status:
                            if (!debug && loglevel > LogLevel.info) return;
                            if (typeof console1.status === "function") {
                                if (args.length === 0) {
                                    console1.status();
                                } else {
                                    console1.status.apply(console1, _toConsumableArray(labeledArgs()));
                                }
                            } else {
                                if (args.length !== 0) {
                                    console1.info.apply(console1, _toConsumableArray(labeledArgs()));
                                }
                            }
                            break;
                        default:
                            throw new Error("Unexpected LogType ".concat(type));
                    }
                };
                return logger;
            };
        /***/ },
        /***/ "./node_modules/webpack/lib/logging/runtime.js": /*!*****************************************************!*\
  !*** ./node_modules/webpack/lib/logging/runtime.js ***!
  \*****************************************************/ /***/ function(__unused_webpack_module, exports1, __nested_webpack_require_31819__) {
            /*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ function _extends() {
                _extends = Object.assign ? Object.assign.bind() : function _extends(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source){
                            if (Object.prototype.hasOwnProperty.call(source, key)) {
                                target[key] = source[key];
                            }
                        }
                    }
                    return target;
                };
                return _extends.apply(this, arguments);
            }
            var SyncBailHook = __nested_webpack_require_31819__(/*! tapable/lib/SyncBailHook */ "./client-src/modules/logger/SyncBailHookFake.js");
            var _require = __nested_webpack_require_31819__(/*! ./Logger */ "./node_modules/webpack/lib/logging/Logger.js"), Logger = _require.Logger;
            var createConsoleLogger = __nested_webpack_require_31819__(/*! ./createConsoleLogger */ "./node_modules/webpack/lib/logging/createConsoleLogger.js");
            /** @type {createConsoleLogger.LoggerOptions} */ var currentDefaultLoggerOptions = {
                level: "info",
                debug: false,
                console: console
            };
            var currentDefaultLogger = createConsoleLogger(currentDefaultLoggerOptions);
            /**
 * @param {string} name name of the logger
 * @returns {Logger} a logger
 */ exports1.getLogger = function(name) {
                return new Logger(function(type, args) {
                    if (exports1.hooks.log.call(name, type, args) === undefined) {
                        currentDefaultLogger(name, type, args);
                    }
                }, function(childName) {
                    return exports1.getLogger("".concat(name, "/").concat(childName));
                });
            };
            /**
 * @param {createConsoleLogger.LoggerOptions} options new options, merge with old options
 * @returns {void}
 */ exports1.configureDefaultLogger = function(options) {
                _extends(currentDefaultLoggerOptions, options);
                currentDefaultLogger = createConsoleLogger(currentDefaultLoggerOptions);
            };
            exports1.hooks = {
                log: new SyncBailHook([
                    "origin",
                    "type",
                    "args"
                ])
            };
        /***/ }
    };
    /************************************************************************/ /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/ /******/ // The require function
    /******/ function __nested_webpack_require_34594__(moduleId) {
        /******/ // Check if module is in cache
        /******/ var cachedModule = __webpack_module_cache__[moduleId];
        /******/ if (cachedModule !== undefined) {
            /******/ return cachedModule.exports;
        /******/ }
        /******/ // Create a new module (and put it into the cache)
        /******/ var module = __webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {}
        };
        /******/ /******/ // Execute the module function
        /******/ __webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_34594__);
        /******/ /******/ // Return the exports of the module
        /******/ return module.exports;
    /******/ }
    /******/ /************************************************************************/ /******/ /* webpack/runtime/define property getters */ /******/ !function() {
        /******/ // define getter functions for harmony exports
        /******/ __nested_webpack_require_34594__.d = function(exports1, definition) {
            /******/ for(var key in definition){
                /******/ if (__nested_webpack_require_34594__.o(definition, key) && !__nested_webpack_require_34594__.o(exports1, key)) {
                    /******/ Object.defineProperty(exports1, key, {
                        enumerable: true,
                        get: definition[key]
                    });
                /******/ }
            /******/ }
        /******/ };
    /******/ }();
    /******/ /******/ /* webpack/runtime/hasOwnProperty shorthand */ /******/ !function() {
        /******/ __nested_webpack_require_34594__.o = function(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        };
    /******/ }();
    /******/ /******/ /* webpack/runtime/make namespace object */ /******/ !function() {
        /******/ // define __esModule on exports
        /******/ __nested_webpack_require_34594__.r = function(exports1) {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(exports1, Symbol.toStringTag, {
                    value: "Module"
                });
            /******/ }
            /******/ Object.defineProperty(exports1, "__esModule", {
                value: true
            });
        /******/ };
    /******/ }();
    /******/ /************************************************************************/ var __nested_webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
    !function() {
        /*!********************************************!*\
  !*** ./client-src/modules/logger/index.js ***!
  \********************************************/ __nested_webpack_require_34594__.r(__nested_webpack_exports__);
        /* harmony export */ __nested_webpack_require_34594__.d(__nested_webpack_exports__, {
            /* harmony export */ "default": function() {
                return /* reexport default export from named module */ webpack_lib_logging_runtime_js__WEBPACK_IMPORTED_MODULE_0__;
            }
        });
        /* harmony import */ var webpack_lib_logging_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_34594__(/*! webpack/lib/logging/runtime.js */ "./node_modules/webpack/lib/logging/runtime.js");
    }();
    var __webpack_export_target__ = exports;
    for(var i in __nested_webpack_exports__)__webpack_export_target__[i] = __nested_webpack_exports__[i];
    if (__nested_webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", {
        value: true
    });
/******/ })();


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/overlay.js":
/*!***************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/overlay.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createOverlay: () => (/* binding */ createOverlay),
/* harmony export */   formatProblem: () => (/* binding */ formatProblem)
/* harmony export */ });
/* harmony import */ var ansi_html_community__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ansi-html-community */ "../../node_modules/ansi-html-community/index.js");
/* harmony import */ var ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ansi_html_community__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! html-entities */ "../../node_modules/html-entities/lib/index.js");
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(html_entities__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./overlay/runtime-error.js */ "../../node_modules/webpack-dev-server/client/overlay/runtime-error.js");
/* harmony import */ var _overlay_state_machine_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./overlay/state-machine.js */ "../../node_modules/webpack-dev-server/client/overlay/state-machine.js");
/* harmony import */ var _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./overlay/styles.js */ "../../node_modules/webpack-dev-server/client/overlay/styles.js");
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return (typeof key === "undefined" ? "undefined" : _type_of(key)) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
// The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).





var colors = {
    reset: [
        "transparent",
        "transparent"
    ],
    black: "181818",
    red: "E36049",
    green: "B3CB74",
    yellow: "FFD080",
    blue: "7CAFC2",
    magenta: "7FACCA",
    cyan: "C3C2EF",
    lightgrey: "EBE7E3",
    darkgrey: "6D7891"
};
ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default().setColors(colors);
/**
 * @param {string} type
 * @param {string  | { file?: string, moduleName?: string, loc?: string, message?: string; stack?: string[] }} item
 * @returns {{ header: string, body: string }}
 */ function formatProblem(type, item) {
    var header = type === "warning" ? "WARNING" : "ERROR";
    var body = "";
    if (typeof item === "string") {
        body += item;
    } else {
        var file = item.file || "";
        // eslint-disable-next-line no-nested-ternary
        var moduleName = item.moduleName ? item.moduleName.indexOf("!") !== -1 ? "".concat(item.moduleName.replace(/^(\s|\S)*!/, ""), " (").concat(item.moduleName, ")") : "".concat(item.moduleName) : "";
        var loc = item.loc;
        header += "".concat(moduleName || file ? " in ".concat(moduleName ? "".concat(moduleName).concat(file ? " (".concat(file, ")") : "") : file).concat(loc ? " ".concat(loc) : "") : "");
        body += item.message || "";
    }
    if (Array.isArray(item.stack)) {
        item.stack.forEach(function(stack) {
            if (typeof stack === "string") {
                body += "\r\n".concat(stack);
            }
        });
    }
    return {
        header: header,
        body: body
    };
}
/**
 * @typedef {Object} CreateOverlayOptions
 * @property {string | null} trustedTypesPolicyName
 * @property {boolean | (error: Error) => void} [catchRuntimeError]
 */ /**
 *
 * @param {CreateOverlayOptions} options
 */ var createOverlay = function createOverlay(options) {
    var applyStyle = /**
   *
   * @param {HTMLElement} element
   * @param {CSSStyleDeclaration} style
   */ function applyStyle(element, style) {
        Object.keys(style).forEach(function(prop) {
            element.style[prop] = style[prop];
        });
    };
    var createContainer = /**
   * @param {string | null} trustedTypesPolicyName
   */ function createContainer(trustedTypesPolicyName) {
        // Enable Trusted Types if they are available in the current browser.
        if (window.trustedTypes) {
            overlayTrustedTypesPolicy = window.trustedTypes.createPolicy(trustedTypesPolicyName || "webpack-dev-server#overlay", {
                createHTML: function createHTML(value) {
                    return value;
                }
            });
        }
        iframeContainerElement = document.createElement("iframe");
        iframeContainerElement.id = "webpack-dev-server-client-overlay";
        iframeContainerElement.src = "about:blank";
        applyStyle(iframeContainerElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.iframeStyle);
        iframeContainerElement.onload = function() {
            var contentElement = /** @type {Document} */ /** @type {HTMLIFrameElement} */ iframeContainerElement.contentDocument.createElement("div");
            containerElement = /** @type {Document} */ /** @type {HTMLIFrameElement} */ iframeContainerElement.contentDocument.createElement("div");
            contentElement.id = "webpack-dev-server-client-overlay-div";
            applyStyle(contentElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.containerStyle);
            headerElement = document.createElement("div");
            headerElement.innerText = "Compiled with problems:";
            applyStyle(headerElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.headerStyle);
            var closeButtonElement = document.createElement("button");
            applyStyle(closeButtonElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.dismissButtonStyle);
            closeButtonElement.innerText = "\xd7";
            closeButtonElement.ariaLabel = "Dismiss";
            closeButtonElement.addEventListener("click", function() {
                // eslint-disable-next-line no-use-before-define
                overlayService.send({
                    type: "DISMISS"
                });
            });
            contentElement.appendChild(headerElement);
            contentElement.appendChild(closeButtonElement);
            contentElement.appendChild(containerElement);
            /** @type {Document} */ /** @type {HTMLIFrameElement} */ iframeContainerElement.contentDocument.body.appendChild(contentElement);
            onLoadQueue.forEach(function(onLoad) {
                onLoad(/** @type {HTMLDivElement} */ contentElement);
            });
            onLoadQueue = [];
            /** @type {HTMLIFrameElement} */ iframeContainerElement.onload = null;
        };
        document.body.appendChild(iframeContainerElement);
    };
    var ensureOverlayExists = /**
   * @param {(element: HTMLDivElement) => void} callback
   * @param {string | null} trustedTypesPolicyName
   */ function ensureOverlayExists(callback, trustedTypesPolicyName) {
        if (containerElement) {
            containerElement.innerHTML = "";
            // Everything is ready, call the callback right away.
            callback(containerElement);
            return;
        }
        onLoadQueue.push(callback);
        if (iframeContainerElement) {
            return;
        }
        createContainer(trustedTypesPolicyName);
    };
    var hide = // Successful compilation.
    function hide() {
        if (!iframeContainerElement) {
            return;
        }
        // Clean up and reset internal state.
        document.body.removeChild(iframeContainerElement);
        iframeContainerElement = null;
        containerElement = null;
    };
    var show = // Compilation with errors (e.g. syntax error or missing modules).
    /**
   * @param {string} type
   * @param {Array<string  | { moduleIdentifier?: string, moduleName?: string, loc?: string, message?: string }>} messages
   * @param {string | null} trustedTypesPolicyName
   * @param {'build' | 'runtime'} messageSource
   */ function show(type, messages, trustedTypesPolicyName, messageSource) {
        ensureOverlayExists(function() {
            headerElement.innerText = messageSource === "runtime" ? "Uncaught runtime errors:" : "Compiled with problems:";
            messages.forEach(function(message) {
                var entryElement = document.createElement("div");
                var msgStyle = type === "warning" ? _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgStyles.warning : _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgStyles.error;
                applyStyle(entryElement, _objectSpread(_objectSpread({}, msgStyle), {}, {
                    padding: "1rem 1rem 1.5rem 1rem"
                }));
                var typeElement = document.createElement("div");
                var _formatProblem = formatProblem(type, message), header = _formatProblem.header, body = _formatProblem.body;
                typeElement.innerText = header;
                applyStyle(typeElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgTypeStyle);
                if (message.moduleIdentifier) {
                    applyStyle(typeElement, {
                        cursor: "pointer"
                    });
                    // element.dataset not supported in IE
                    typeElement.setAttribute("data-can-open", true);
                    typeElement.addEventListener("click", function() {
                        fetch("/webpack-dev-server/open-editor?fileName=".concat(message.moduleIdentifier));
                    });
                }
                // Make it look similar to our terminal.
                var text = ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default()((0,html_entities__WEBPACK_IMPORTED_MODULE_4__.encode)(body));
                var messageTextNode = document.createElement("div");
                applyStyle(messageTextNode, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgTextStyle);
                messageTextNode.innerHTML = overlayTrustedTypesPolicy ? overlayTrustedTypesPolicy.createHTML(text) : text;
                entryElement.appendChild(typeElement);
                entryElement.appendChild(messageTextNode);
                /** @type {HTMLDivElement} */ containerElement.appendChild(entryElement);
            });
        }, trustedTypesPolicyName);
    };
    /** @type {HTMLIFrameElement | null | undefined} */ var iframeContainerElement;
    /** @type {HTMLDivElement | null | undefined} */ var containerElement;
    /** @type {HTMLDivElement | null | undefined} */ var headerElement;
    /** @type {Array<(element: HTMLDivElement) => void>} */ var onLoadQueue = [];
    /** @type {TrustedTypePolicy | undefined} */ var overlayTrustedTypesPolicy;
    var overlayService = (0,_overlay_state_machine_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
        showOverlay: function showOverlay(_ref) {
            var _ref$level = _ref.level, level = _ref$level === void 0 ? "error" : _ref$level, messages = _ref.messages, messageSource = _ref.messageSource;
            return show(level, messages, options.trustedTypesPolicyName, messageSource);
        },
        hideOverlay: hide
    });
    if (options.catchRuntimeError) {
        /**
     * @param {Error | undefined} error
     * @param {string} fallbackMessage
     */ var handleError = function handleError(error, fallbackMessage) {
            var errorObject = _instanceof(error, Error) ? error : new Error(error || fallbackMessage);
            var shouldDisplay = typeof options.catchRuntimeError === "function" ? options.catchRuntimeError(errorObject) : true;
            if (shouldDisplay) {
                overlayService.send({
                    type: "RUNTIME_ERROR",
                    messages: [
                        {
                            message: errorObject.message,
                            stack: (0,_overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__.parseErrorToStacks)(errorObject)
                        }
                    ]
                });
            }
        };
        (0,_overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__.listenToRuntimeError)(function(errorEvent) {
            // error property may be empty in older browser like IE
            var error = errorEvent.error, message = errorEvent.message;
            if (!error && !message) {
                return;
            }
            handleError(error, message);
        });
        (0,_overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__.listenToUnhandledRejection)(function(promiseRejectionEvent) {
            var reason = promiseRejectionEvent.reason;
            handleError(reason, "Unknown promise rejection reason");
        });
    }
    return overlayService;
};



/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/overlay/fsm.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/overlay/fsm.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return (typeof key === "undefined" ? "undefined" : _type_of(key)) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
/**
 * @typedef {Object} StateDefinitions
 * @property {{[event: string]: { target: string; actions?: Array<string> }}} [on]
 */ /**
 * @typedef {Object} Options
 * @property {{[state: string]: StateDefinitions}} states
 * @property {object} context;
 * @property {string} initial
 */ /**
 * @typedef {Object} Implementation
 * @property {{[actionName: string]: (ctx: object, event: any) => object}} actions
 */ /**
 * A simplified `createMachine` from `@xstate/fsm` with the following differences:
 *
 *  - the returned machine is technically a "service". No `interpret(machine).start()` is needed.
 *  - the state definition only support `on` and target must be declared with { target: 'nextState', actions: [] } explicitly.
 *  - event passed to `send` must be an object with `type` property.
 *  - actions implementation will be [assign action](https://xstate.js.org/docs/guides/context.html#assign-action) if you return any value.
 *  Do not return anything if you just want to invoke side effect.
 *
 * The goal of this custom function is to avoid installing the entire `'xstate/fsm'` package, while enabling modeling using
 * state machine. You can copy the first parameter into the editor at https://stately.ai/viz to visualize the state machine.
 *
 * @param {Options} options
 * @param {Implementation} implementation
 */ function createMachine(_ref, _ref2) {
    var states = _ref.states, context = _ref.context, initial = _ref.initial;
    var actions = _ref2.actions;
    var currentState = initial;
    var currentContext = context;
    return {
        send: function send(event) {
            var currentStateOn = states[currentState].on;
            var transitionConfig = currentStateOn && currentStateOn[event.type];
            if (transitionConfig) {
                currentState = transitionConfig.target;
                if (transitionConfig.actions) {
                    transitionConfig.actions.forEach(function(actName) {
                        var actionImpl = actions[actName];
                        var nextContextValue = actionImpl && actionImpl(currentContext, event);
                        if (nextContextValue) {
                            currentContext = _objectSpread(_objectSpread({}, currentContext), nextContextValue);
                        }
                    });
                }
            }
        }
    };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createMachine);


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/overlay/runtime-error.js":
/*!*****************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/overlay/runtime-error.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   listenToRuntimeError: () => (/* binding */ listenToRuntimeError),
/* harmony export */   listenToUnhandledRejection: () => (/* binding */ listenToUnhandledRejection),
/* harmony export */   parseErrorToStacks: () => (/* binding */ parseErrorToStacks)
/* harmony export */ });
/**
 *
 * @param {Error} error
 */ function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function parseErrorToStacks(error) {
    if (!error || !_instanceof(error, Error)) {
        throw new Error("parseErrorToStacks expects Error object");
    }
    if (typeof error.stack === "string") {
        return error.stack.split("\n").filter(function(stack) {
            return stack !== "Error: ".concat(error.message);
        });
    }
}
/**
 * @callback ErrorCallback
 * @param {ErrorEvent} error
 * @returns {void}
 */ /**
 * @param {ErrorCallback} callback
 */ function listenToRuntimeError(callback) {
    window.addEventListener("error", callback);
    return function cleanup() {
        window.removeEventListener("error", callback);
    };
}
/**
 * @callback UnhandledRejectionCallback
 * @param {PromiseRejectionEvent} rejectionEvent
 * @returns {void}
 */ /**
 * @param {UnhandledRejectionCallback} callback
 */ function listenToUnhandledRejection(callback) {
    window.addEventListener("unhandledrejection", callback);
    return function cleanup() {
        window.removeEventListener("unhandledrejection", callback);
    };
}



/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/overlay/state-machine.js":
/*!*****************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/overlay/state-machine.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _fsm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fsm.js */ "../../node_modules/webpack-dev-server/client/overlay/fsm.js");

/**
 * @typedef {Object} ShowOverlayData
 * @property {'warning' | 'error'} level
 * @property {Array<string  | { moduleIdentifier?: string, moduleName?: string, loc?: string, message?: string }>} messages
 * @property {'build' | 'runtime'} messageSource
 */ /**
 * @typedef {Object} CreateOverlayMachineOptions
 * @property {(data: ShowOverlayData) => void} showOverlay
 * @property {() => void} hideOverlay
 */ /**
 * @param {CreateOverlayMachineOptions} options
 */ var createOverlayMachine = function createOverlayMachine(options) {
    var hideOverlay = options.hideOverlay, showOverlay = options.showOverlay;
    var overlayMachine = (0,_fsm_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
        initial: "hidden",
        context: {
            level: "error",
            messages: [],
            messageSource: "build"
        },
        states: {
            hidden: {
                on: {
                    BUILD_ERROR: {
                        target: "displayBuildError",
                        actions: [
                            "setMessages",
                            "showOverlay"
                        ]
                    },
                    RUNTIME_ERROR: {
                        target: "displayRuntimeError",
                        actions: [
                            "setMessages",
                            "showOverlay"
                        ]
                    }
                }
            },
            displayBuildError: {
                on: {
                    DISMISS: {
                        target: "hidden",
                        actions: [
                            "dismissMessages",
                            "hideOverlay"
                        ]
                    },
                    BUILD_ERROR: {
                        target: "displayBuildError",
                        actions: [
                            "appendMessages",
                            "showOverlay"
                        ]
                    }
                }
            },
            displayRuntimeError: {
                on: {
                    DISMISS: {
                        target: "hidden",
                        actions: [
                            "dismissMessages",
                            "hideOverlay"
                        ]
                    },
                    RUNTIME_ERROR: {
                        target: "displayRuntimeError",
                        actions: [
                            "appendMessages",
                            "showOverlay"
                        ]
                    },
                    BUILD_ERROR: {
                        target: "displayBuildError",
                        actions: [
                            "setMessages",
                            "showOverlay"
                        ]
                    }
                }
            }
        }
    }, {
        actions: {
            dismissMessages: function dismissMessages() {
                return {
                    messages: [],
                    level: "error",
                    messageSource: "build"
                };
            },
            appendMessages: function appendMessages(context, event) {
                return {
                    messages: context.messages.concat(event.messages),
                    level: event.level || context.level,
                    messageSource: event.type === "RUNTIME_ERROR" ? "runtime" : "build"
                };
            },
            setMessages: function setMessages(context, event) {
                return {
                    messages: event.messages,
                    level: event.level || context.level,
                    messageSource: event.type === "RUNTIME_ERROR" ? "runtime" : "build"
                };
            },
            hideOverlay: hideOverlay,
            showOverlay: showOverlay
        }
    });
    return overlayMachine;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createOverlayMachine);


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/overlay/styles.js":
/*!**********************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/overlay/styles.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   containerStyle: () => (/* binding */ containerStyle),
/* harmony export */   dismissButtonStyle: () => (/* binding */ dismissButtonStyle),
/* harmony export */   headerStyle: () => (/* binding */ headerStyle),
/* harmony export */   iframeStyle: () => (/* binding */ iframeStyle),
/* harmony export */   msgStyles: () => (/* binding */ msgStyles),
/* harmony export */   msgTextStyle: () => (/* binding */ msgTextStyle),
/* harmony export */   msgTypeStyle: () => (/* binding */ msgTypeStyle)
/* harmony export */ });
// styles are inspired by `react-error-overlay`
var msgStyles = {
    error: {
        backgroundColor: "rgba(206, 17, 38, 0.1)",
        color: "#fccfcf"
    },
    warning: {
        backgroundColor: "rgba(251, 245, 180, 0.1)",
        color: "#fbf5b4"
    }
};
var iframeStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    border: "none",
    "z-index": 9999999999
};
var containerStyle = {
    position: "fixed",
    boxSizing: "border-box",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    fontSize: "large",
    padding: "2rem 2rem 4rem 2rem",
    lineHeight: "1.2",
    whiteSpace: "pre-wrap",
    overflow: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    color: "white"
};
var headerStyle = {
    color: "#e83b46",
    fontSize: "2em",
    whiteSpace: "pre-wrap",
    fontFamily: "sans-serif",
    margin: "0 2rem 2rem 0",
    flex: "0 0 auto",
    maxHeight: "50%",
    overflow: "auto"
};
var dismissButtonStyle = {
    color: "#ffffff",
    lineHeight: "1rem",
    fontSize: "1.5rem",
    padding: "1rem",
    cursor: "pointer",
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "transparent",
    border: "none"
};
var msgTypeStyle = {
    color: "#e83b46",
    fontSize: "1.2em",
    marginBottom: "1rem",
    fontFamily: "sans-serif"
};
var msgTextStyle = {
    lineHeight: "1.5",
    fontSize: "1rem",
    fontFamily: "Menlo, Consolas, monospace"
};



/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/socket.js":
/*!**************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/socket.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   client: () => (/* binding */ client),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _clients_WebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clients/WebSocketClient.js */ "../../node_modules/webpack-dev-server/client/clients/WebSocketClient.js");
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/log.js */ "../../node_modules/webpack-dev-server/client/utils/log.js");
/* provided dependency */ var __webpack_dev_server_client__ = __webpack_require__(/*! ../../node_modules/webpack-dev-server/client/clients/WebSocketClient.js */ "../../node_modules/webpack-dev-server/client/clients/WebSocketClient.js");
/* global __webpack_dev_server_client__ */ 

// this WebsocketClient is here as a default fallback, in case the client is not injected
/* eslint-disable camelcase */ var Client = // eslint-disable-next-line no-nested-ternary
typeof __webpack_dev_server_client__ !== "undefined" ? typeof __webpack_dev_server_client__.default !== "undefined" ? __webpack_dev_server_client__.default : __webpack_dev_server_client__ : _clients_WebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__["default"];
/* eslint-enable camelcase */ var retries = 0;
var maxRetries = 10;
// Initialized client is exported so external consumers can utilize the same instance
// It is mutable to enforce singleton
// eslint-disable-next-line import/no-mutable-exports
var client = null;
/**
 * @param {string} url
 * @param {{ [handler: string]: (data?: any, params?: any) => any }} handlers
 * @param {number} [reconnect]
 */ var socket = function initSocket(url, handlers, reconnect) {
    client = new Client(url);
    client.onOpen(function() {
        retries = 0;
        if (typeof reconnect !== "undefined") {
            maxRetries = reconnect;
        }
    });
    client.onClose(function() {
        if (retries === 0) {
            handlers.close();
        }
        // Try to reconnect.
        client = null;
        // After 10 retries stop trying, to prevent logspam.
        if (retries < maxRetries) {
            // Exponentially increase timeout to reconnect.
            // Respectfully copied from the package `got`.
            // eslint-disable-next-line no-restricted-properties
            var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
            retries += 1;
            _utils_log_js__WEBPACK_IMPORTED_MODULE_1__.log.info("Trying to reconnect...");
            setTimeout(function() {
                socket(url, handlers, reconnect);
            }, retryInMs);
        }
    });
    client.onMessage(/**
   * @param {any} data
   */ function(data) {
        var message = JSON.parse(data);
        if (handlers[message.type]) {
            handlers[message.type](message.data, message.params);
        }
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (socket);


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/createSocketURL.js":
/*!*****************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/createSocketURL.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @param {{ protocol?: string, auth?: string, hostname?: string, port?: string, pathname?: string, search?: string, hash?: string, slashes?: boolean }} objURL
 * @returns {string}
 */ function format(objURL) {
    var protocol = objURL.protocol || "";
    if (protocol && protocol.substr(-1) !== ":") {
        protocol += ":";
    }
    var auth = objURL.auth || "";
    if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ":");
        auth += "@";
    }
    var host = "";
    if (objURL.hostname) {
        host = auth + (objURL.hostname.indexOf(":") === -1 ? objURL.hostname : "[".concat(objURL.hostname, "]"));
        if (objURL.port) {
            host += ":".concat(objURL.port);
        }
    }
    var pathname = objURL.pathname || "";
    if (objURL.slashes) {
        host = "//".concat(host || "");
        if (pathname && pathname.charAt(0) !== "/") {
            pathname = "/".concat(pathname);
        }
    } else if (!host) {
        host = "";
    }
    var search = objURL.search || "";
    if (search && search.charAt(0) !== "?") {
        search = "?".concat(search);
    }
    var hash = objURL.hash || "";
    if (hash && hash.charAt(0) !== "#") {
        hash = "#".concat(hash);
    }
    pathname = pathname.replace(/[?#]/g, /**
   * @param {string} match
   * @returns {string}
   */ function(match) {
        return encodeURIComponent(match);
    });
    search = search.replace("#", "%23");
    return "".concat(protocol).concat(host).concat(pathname).concat(search).concat(hash);
}
/**
 * @param {URL & { fromCurrentScript?: boolean }} parsedURL
 * @returns {string}
 */ function createSocketURL(parsedURL) {
    var hostname = parsedURL.hostname;
    // Node.js module parses it as `::`
    // `new URL(urlString, [baseURLString])` parses it as '[::]'
    var isInAddrAny = hostname === "0.0.0.0" || hostname === "::" || hostname === "[::]";
    // why do we need this check?
    // hostname n/a for file protocol (example, when using electron, ionic)
    // see: https://github.com/webpack/webpack-dev-server/pull/384
    if (isInAddrAny && self.location.hostname && self.location.protocol.indexOf("http") === 0) {
        hostname = self.location.hostname;
    }
    var socketURLProtocol = parsedURL.protocol || self.location.protocol;
    // When https is used in the app, secure web sockets are always necessary because the browser doesn't accept non-secure web sockets.
    if (socketURLProtocol === "auto:" || hostname && isInAddrAny && self.location.protocol === "https:") {
        socketURLProtocol = self.location.protocol;
    }
    socketURLProtocol = socketURLProtocol.replace(/^(?:http|.+-extension|file)/i, "ws");
    var socketURLAuth = "";
    // `new URL(urlString, [baseURLstring])` doesn't have `auth` property
    // Parse authentication credentials in case we need them
    if (parsedURL.username) {
        socketURLAuth = parsedURL.username;
        // Since HTTP basic authentication does not allow empty username,
        // we only include password if the username is not empty.
        if (parsedURL.password) {
            // Result: <username>:<password>
            socketURLAuth = socketURLAuth.concat(":", parsedURL.password);
        }
    }
    // In case the host is a raw IPv6 address, it can be enclosed in
    // the brackets as the brackets are needed in the final URL string.
    // Need to remove those as url.format blindly adds its own set of brackets
    // if the host string contains colons. That would lead to non-working
    // double brackets (e.g. [[::]]) host
    //
    // All of these web socket url params are optionally passed in through resourceQuery,
    // so we need to fall back to the default if they are not provided
    var socketURLHostname = (hostname || self.location.hostname || "localhost").replace(/^\[(.*)\]$/, "$1");
    var socketURLPort = parsedURL.port;
    if (!socketURLPort || socketURLPort === "0") {
        socketURLPort = self.location.port;
    }
    // If path is provided it'll be passed in via the resourceQuery as a
    // query param so it has to be parsed out of the querystring in order for the
    // client to open the socket to the correct location.
    var socketURLPathname = "/ws";
    if (parsedURL.pathname && !parsedURL.fromCurrentScript) {
        socketURLPathname = parsedURL.pathname;
    }
    return format({
        protocol: socketURLProtocol,
        auth: socketURLAuth,
        hostname: socketURLHostname,
        port: socketURLPort,
        pathname: socketURLPathname,
        slashes: true
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createSocketURL);


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js":
/*!************************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @returns {string}
 */ function getCurrentScriptSource() {
    // `document.currentScript` is the most accurate way to find the current script,
    // but is not supported in all browsers.
    if (document.currentScript) {
        return document.currentScript.getAttribute("src");
    }
    // Fallback to getting all scripts running in the document.
    var scriptElements = document.scripts || [];
    var scriptElementsWithSrc = Array.prototype.filter.call(scriptElements, function(element) {
        return element.getAttribute("src");
    });
    if (scriptElementsWithSrc.length > 0) {
        var currentScript = scriptElementsWithSrc[scriptElementsWithSrc.length - 1];
        return currentScript.getAttribute("src");
    }
    // Fail as there was no script to use.
    throw new Error("[webpack-dev-server] Failed to get current script source.");
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getCurrentScriptSource);


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/log.js":
/*!*****************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/log.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   logEnabledFeatures: () => (/* binding */ logEnabledFeatures),
/* harmony export */   setLogLevel: () => (/* binding */ setLogLevel)
/* harmony export */ });
/* harmony import */ var _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/logger/index.js */ "../../node_modules/webpack-dev-server/client/modules/logger/index.js");
/* harmony import */ var _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0__);

var name = "webpack-dev-server";
// default level is set on the client side, so it does not need
// to be set by the CLI or API
var defaultLevel = "info";
// options new options, merge with old options
/**
 * @param {false | true | "none" | "error" | "warn" | "info" | "log" | "verbose"} level
 * @returns {void}
 */ function setLogLevel(level) {
    _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default().configureDefaultLogger({
        level: level
    });
}
setLogLevel(defaultLevel);
var log = _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default().getLogger(name);
var logEnabledFeatures = function logEnabledFeatures(features) {
    var enabledFeatures = Object.keys(features);
    if (!features || enabledFeatures.length === 0) {
        return;
    }
    var logString = "Server started:";
    // Server started: Hot Module Replacement enabled, Live Reloading enabled, Overlay disabled.
    for(var i = 0; i < enabledFeatures.length; i++){
        var key = enabledFeatures[i];
        logString += " ".concat(key, " ").concat(features[key] ? "enabled" : "disabled", ",");
    }
    // replace last comma with a period
    logString = logString.slice(0, -1).concat(".");
    log.info(logString);
};



/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/parseURL.js":
/*!**********************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/parseURL.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getCurrentScriptSource_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getCurrentScriptSource.js */ "../../node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js");

/**
 * @param {string} resourceQuery
 * @returns {{ [key: string]: string | boolean }}
 */ function parseURL(resourceQuery) {
    /** @type {{ [key: string]: string }} */ var options = {};
    if (typeof resourceQuery === "string" && resourceQuery !== "") {
        var searchParams = resourceQuery.slice(1).split("&");
        for(var i = 0; i < searchParams.length; i++){
            var pair = searchParams[i].split("=");
            options[pair[0]] = decodeURIComponent(pair[1]);
        }
    } else {
        // Else, get the url from the <script> this file was called with.
        var scriptSource = (0,_getCurrentScriptSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
        var scriptSourceURL;
        try {
            // The placeholder `baseURL` with `window.location.href`,
            // is to allow parsing of path-relative or protocol-relative URLs,
            // and will have no effect if `scriptSource` is a fully valid URL.
            scriptSourceURL = new URL(scriptSource, self.location.href);
        } catch (error) {
        // URL parsing failed, do nothing.
        // We will still proceed to see if we can recover using `resourceQuery`
        }
        if (scriptSourceURL) {
            options = scriptSourceURL;
            options.fromCurrentScript = true;
        }
    }
    return options;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parseURL);


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/reloadApp.js":
/*!***********************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/reloadApp.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webpack/hot/emitter.js */ "../../node_modules/webpack/hot/emitter.js");
/* harmony import */ var webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log.js */ "../../node_modules/webpack-dev-server/client/utils/log.js");


/** @typedef {import("../index").Options} Options
/** @typedef {import("../index").Status} Status

/**
 * @param {Options} options
 * @param {Status} status
 */ function reloadApp(_ref, status) {
    var applyReload = /**
   * @param {Window} rootWindow
   * @param {number} intervalId
   */ function applyReload(rootWindow, intervalId) {
        clearInterval(intervalId);
        _log_js__WEBPACK_IMPORTED_MODULE_1__.log.info("App updated. Reloading...");
        rootWindow.location.reload();
    };
    var hot = _ref.hot, liveReload = _ref.liveReload;
    if (status.isUnloading) {
        return;
    }
    var currentHash = status.currentHash, previousHash = status.previousHash;
    var isInitial = currentHash.indexOf(/** @type {string} */ previousHash) >= 0;
    if (isInitial) {
        return;
    }
    var search = self.location.search.toLowerCase();
    var allowToHot = search.indexOf("webpack-dev-server-hot=false") === -1;
    var allowToLiveReload = search.indexOf("webpack-dev-server-live-reload=false") === -1;
    if (hot && allowToHot) {
        _log_js__WEBPACK_IMPORTED_MODULE_1__.log.info("App hot update...");
        webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0___default().emit("webpackHotUpdate", status.currentHash);
        if (typeof self !== "undefined" && self.window) {
            // broadcast update to window
            self.postMessage("webpackHotUpdate".concat(status.currentHash), "*");
        }
    } else if (liveReload && allowToLiveReload) {
        var rootWindow = self;
        // use parent window for reload (in case we're in an iframe with no valid src)
        var intervalId = self.setInterval(function() {
            if (rootWindow.location.protocol !== "about:") {
                // reload immediately if protocol is valid
                applyReload(rootWindow, intervalId);
            } else {
                rootWindow = rootWindow.parent;
                if (rootWindow.parent === rootWindow) {
                    // if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways
                    applyReload(rootWindow, intervalId);
                }
            }
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reloadApp);


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/sendMessage.js":
/*!*************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/sendMessage.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* global __resourceQuery WorkerGlobalScope */ // Send messages to the outside, so plugins can consume it.
/**
 * @param {string} type
 * @param {any} [data]
 */ function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function sendMsg(type, data) {
    if (typeof self !== "undefined" && (typeof WorkerGlobalScope === "undefined" || !_instanceof(self, WorkerGlobalScope))) {
        self.postMessage({
            type: "webpack".concat(type),
            data: data
        }, "*");
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sendMsg);


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/stripAnsi.js":
/*!***********************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/stripAnsi.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var ansiRegex = new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"
].join("|"), "g");
/**
 *
 * Strip [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) from a string.
 * Adapted from code originally released by Sindre Sorhus
 * Licensed the MIT License
 *
 * @param {string} string
 * @return {string}
 */ function stripAnsi(string) {
    if (typeof string !== "string") {
        throw new TypeError("Expected a `string`, got `".concat(typeof string === "undefined" ? "undefined" : _type_of(string), "`"));
    }
    return string.replace(ansiRegex, "");
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stripAnsi);


/***/ }),

/***/ "../../node_modules/webpack/hot/dev-server.js":
/*!****************************************************!*\
  !*** ../../node_modules/webpack/hot/dev-server.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /* globals __webpack_hash__ */ if (true) {
    /** @type {undefined|string} */ var lastHash;
    var upToDate = function upToDate() {
        return /** @type {string} */ lastHash.indexOf(__webpack_require__.h()) >= 0;
    };
    var log = __webpack_require__(/*! ./log */ "../../node_modules/webpack/hot/log.js");
    var check = function check() {
        module.hot.check(true).then(function(updatedModules) {
            if (!updatedModules) {
                log("warning", "[HMR] Cannot find update. " + (typeof window !== "undefined" ? "Need to do a full reload!" : "Please reload manually!"));
                log("warning", "[HMR] (Probably because of restarting the webpack-dev-server)");
                if (typeof window !== "undefined") {
                    window.location.reload();
                }
                return;
            }
            if (!upToDate()) {
                check();
            }
            __webpack_require__(/*! ./log-apply-result */ "../../node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
            if (upToDate()) {
                log("info", "[HMR] App is up to date.");
            }
        }).catch(function(err) {
            var status = module.hot.status();
            if ([
                "abort",
                "fail"
            ].indexOf(status) >= 0) {
                log("warning", "[HMR] Cannot apply update. " + (typeof window !== "undefined" ? "Need to do a full reload!" : "Please reload manually!"));
                log("warning", "[HMR] " + log.formatError(err));
                if (typeof window !== "undefined") {
                    window.location.reload();
                }
            } else {
                log("warning", "[HMR] Update failed: " + log.formatError(err));
            }
        });
    };
    var hotEmitter = __webpack_require__(/*! ./emitter */ "../../node_modules/webpack/hot/emitter.js");
    hotEmitter.on("webpackHotUpdate", function(currentHash) {
        lastHash = currentHash;
        if (!upToDate() && module.hot.status() === "idle") {
            log("info", "[HMR] Checking for updates on the server...");
            check();
        }
    });
    log("info", "[HMR] Waiting for update signal from WDS...");
} else {}


/***/ }),

/***/ "../../node_modules/webpack/hot/emitter.js":
/*!*************************************************!*\
  !*** ../../node_modules/webpack/hot/emitter.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var EventEmitter = __webpack_require__(/*! events */ "../../node_modules/events/events.js");
module.exports = new EventEmitter();


/***/ }),

/***/ "../../node_modules/webpack/hot/log-apply-result.js":
/*!**********************************************************!*\
  !*** ../../node_modules/webpack/hot/log-apply-result.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /**
 * @param {(string | number)[]} updatedModules updated modules
 * @param {(string | number)[] | null} renewedModules renewed modules
 */ module.exports = function(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
        return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });
    var log = __webpack_require__(/*! ./log */ "../../node_modules/webpack/hot/log.js");
    if (unacceptedModules.length > 0) {
        log("warning", "[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
        unacceptedModules.forEach(function(moduleId) {
            log("warning", "[HMR]  - " + moduleId);
        });
    }
    if (!renewedModules || renewedModules.length === 0) {
        log("info", "[HMR] Nothing hot updated.");
    } else {
        log("info", "[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
            if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
                var parts = moduleId.split("!");
                log.groupCollapsed("info", "[HMR]  - " + parts.pop());
                log("info", "[HMR]  - " + moduleId);
                log.groupEnd("info");
            } else {
                log("info", "[HMR]  - " + moduleId);
            }
        });
        var numberIds = renewedModules.every(function(moduleId) {
            return typeof moduleId === "number";
        });
        if (numberIds) log("info", '[HMR] Consider using the optimization.moduleIds: "named" for module names.');
    }
};


/***/ }),

/***/ "../../node_modules/webpack/hot/log.js":
/*!*********************************************!*\
  !*** ../../node_modules/webpack/hot/log.js ***!
  \*********************************************/
/***/ ((module) => {

/** @typedef {"info" | "warning" | "error"} LogLevel */ /** @type {LogLevel} */ var logLevel = "info";
function dummy() {}
/**
 * @param {LogLevel} level log level
 * @returns {boolean} true, if should log
 */ function shouldLog(level) {
    var shouldLog = logLevel === "info" && level === "info" || [
        "info",
        "warning"
    ].indexOf(logLevel) >= 0 && level === "warning" || [
        "info",
        "warning",
        "error"
    ].indexOf(logLevel) >= 0 && level === "error";
    return shouldLog;
}
/**
 * @param {(msg?: string) => void} logFn log function
 * @returns {(level: LogLevel, msg?: string) => void} function that logs when log level is sufficient
 */ function logGroup(logFn) {
    return function(level, msg) {
        if (shouldLog(level)) {
            logFn(msg);
        }
    };
}
/**
 * @param {LogLevel} level log level
 * @param {string|Error} msg message
 */ module.exports = function(level, msg) {
    if (shouldLog(level)) {
        if (level === "info") {
            console.log(msg);
        } else if (level === "warning") {
            console.warn(msg);
        } else if (level === "error") {
            console.error(msg);
        }
    }
};
/* eslint-disable node/no-unsupported-features/node-builtins */ var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */ module.exports.group = logGroup(group);
module.exports.groupCollapsed = logGroup(groupCollapsed);
module.exports.groupEnd = logGroup(groupEnd);
/**
 * @param {LogLevel} level log level
 */ module.exports.setLogLevel = function(level) {
    logLevel = level;
};
/**
 * @param {Error} err error
 * @returns {string} formatted error
 */ module.exports.formatError = function(err) {
    var message = err.message;
    var stack = err.stack;
    if (!stack) {
        return message;
    } else if (stack.indexOf(message) < 0) {
        return message + "\n" + stack;
    } else {
        return stack;
    }
};


/***/ }),

/***/ "webpack/container/entry/@ugandaemr/esm-laboratory-app":
/*!***********************!*\
  !*** container entry ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var moduleMap = {
	"./start": () => {
		return Promise.all([__webpack_require__.e("vendors-node_modules_openmrs_esm-patient-common-lib_src_index_ts"), __webpack_require__.e("webpack_sharing_consume_default_react_react"), __webpack_require__.e("src_index_ts-webpack_sharing_consume_default_openmrs_esm-framework_src_internal_openmrs_esm-f-d0ff54")]).then(() => (() => ((__webpack_require__(/*! ./src/index.ts */ "./src/index.ts")))));
	}
};
var get = (module, getScope) => {
	__webpack_require__.R = getScope;
	getScope = (
		__webpack_require__.o(moduleMap, module)
			? moduleMap[module]()
			: Promise.resolve().then(() => {
				throw new Error('Module "' + module + '" does not exist in container.');
			})
	);
	__webpack_require__.R = undefined;
	return getScope;
};
var init = (shareScope, initScope) => {
	if (!__webpack_require__.S) return;
	var name = "default"
	var oldScope = __webpack_require__.S[name];
	if(oldScope && oldScope !== shareScope) throw new Error("Container initialization failed as it has already been initialized with a different share scope");
	__webpack_require__.S[name] = shareScope;
	return __webpack_require__.I(name, initScope);
};

// This exports getters to disallow modifications
__webpack_require__.d(exports, {
	get: () => (get),
	init: () => (init)
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("_ugandaemr_esm-laboratory-app." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("f2532c73ca9a7f84")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "@ugandaemr/esm-laboratory-app:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/sharing */
/******/ 	(() => {
/******/ 		__webpack_require__.S = {};
/******/ 		var initPromises = {};
/******/ 		var initTokens = {};
/******/ 		__webpack_require__.I = (name, initScope) => {
/******/ 			if(!initScope) initScope = [];
/******/ 			// handling circular init calls
/******/ 			var initToken = initTokens[name];
/******/ 			if(!initToken) initToken = initTokens[name] = {};
/******/ 			if(initScope.indexOf(initToken) >= 0) return;
/******/ 			initScope.push(initToken);
/******/ 			// only runs once
/******/ 			if(initPromises[name]) return initPromises[name];
/******/ 			// creates a new share scope if needed
/******/ 			if(!__webpack_require__.o(__webpack_require__.S, name)) __webpack_require__.S[name] = {};
/******/ 			// runs all init snippets from all modules reachable
/******/ 			var scope = __webpack_require__.S[name];
/******/ 			var warn = (msg) => {
/******/ 				if (typeof console !== "undefined" && console.warn) console.warn(msg);
/******/ 			};
/******/ 			var uniqueName = "@ugandaemr/esm-laboratory-app";
/******/ 			var register = (name, version, factory, eager) => {
/******/ 				var versions = scope[name] = scope[name] || {};
/******/ 				var activeVersion = versions[version];
/******/ 				if(!activeVersion || (!activeVersion.loaded && (!eager != !activeVersion.eager ? eager : uniqueName > activeVersion.from))) versions[version] = { get: factory, from: uniqueName, eager: !!eager };
/******/ 			};
/******/ 			var initExternal = (id) => {
/******/ 				var handleError = (err) => (warn("Initialization of sharing external failed: " + err));
/******/ 				try {
/******/ 					var module = __webpack_require__(id);
/******/ 					if(!module) return;
/******/ 					var initFn = (module) => (module && module.init && module.init(__webpack_require__.S[name], initScope))
/******/ 					if(module.then) return promises.push(module.then(initFn, handleError));
/******/ 					var initResult = initFn(module);
/******/ 					if(initResult && initResult.then) return promises.push(initResult['catch'](handleError));
/******/ 				} catch(err) { handleError(err); }
/******/ 			}
/******/ 			var promises = [];
/******/ 			switch(name) {
/******/ 				case "default": {
/******/ 					register("@openmrs/esm-framework", "5.1.1-pre.986", () => (Promise.all([__webpack_require__.e("vendors-node_modules_openmrs_esm-framework_src_internal_ts"), __webpack_require__.e("webpack_sharing_consume_default_react_react")]).then(() => (() => (__webpack_require__(/*! ../../node_modules/@openmrs/esm-framework/src/internal.ts */ "../../node_modules/@openmrs/esm-framework/src/internal.ts"))))));
/******/ 					register("dayjs", "1.11.9", () => (__webpack_require__.e("vendors-node_modules_dayjs_dayjs_min_js").then(() => (() => (__webpack_require__(/*! ../../node_modules/dayjs/dayjs.min.js */ "../../node_modules/dayjs/dayjs.min.js"))))));
/******/ 					register("react-i18next", "11.18.6", () => (Promise.all([__webpack_require__.e("vendors-node_modules_react-i18next_dist_es_index_js"), __webpack_require__.e("webpack_sharing_consume_default_react_react"), __webpack_require__.e("node_modules_babel_runtime_helpers_esm_objectWithoutPropertiesLoose_js")]).then(() => (() => (__webpack_require__(/*! ../../node_modules/react-i18next/dist/es/index.js */ "../../node_modules/react-i18next/dist/es/index.js"))))));
/******/ 					register("react-router-dom", "6.15.0", () => (Promise.all([__webpack_require__.e("vendors-node_modules_react-router-dom_dist_index_js"), __webpack_require__.e("webpack_sharing_consume_default_react_react")]).then(() => (() => (__webpack_require__(/*! ../../node_modules/react-router-dom/dist/index.js */ "../../node_modules/react-router-dom/dist/index.js"))))));
/******/ 					register("react", "18.2.0", () => (__webpack_require__.e("vendors-node_modules_react_index_js").then(() => (() => (__webpack_require__(/*! ../../node_modules/react/index.js */ "../../node_modules/react/index.js"))))));
/******/ 					register("rxjs", "6.6.7", () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs__esm5_internal_operators_map_js"), __webpack_require__.e("vendors-node_modules_rxjs__esm5_index_js")]).then(() => (() => (__webpack_require__(/*! ../../node_modules/rxjs/_esm5/index.js */ "../../node_modules/rxjs/_esm5/index.js"))))));
/******/ 				}
/******/ 				break;
/******/ 			}
/******/ 			if(!promises.length) return initPromises[name] = 1;
/******/ 			return initPromises[name] = Promise.all(promises).then(() => (initPromises[name] = 1));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/consumes */
/******/ 	(() => {
/******/ 		var parseVersion = (str) => {
/******/ 			// see webpack/lib/util/semver.js for original code
/******/ 			var p=p=>{return p.split(".").map((p=>{return+p==p?+p:p}))},n=/^([^-+]+)?(?:-([^+]+))?(?:\+(.+))?$/.exec(str),r=n[1]?p(n[1]):[];return n[2]&&(r.length++,r.push.apply(r,p(n[2]))),n[3]&&(r.push([]),r.push.apply(r,p(n[3]))),r;
/******/ 		}
/******/ 		var versionLt = (a, b) => {
/******/ 			// see webpack/lib/util/semver.js for original code
/******/ 			a=parseVersion(a),b=parseVersion(b);for(var r=0;;){if(r>=a.length)return r<b.length&&"u"!=(typeof b[r])[0];var e=a[r],n=(typeof e)[0];if(r>=b.length)return"u"==n;var t=b[r],f=(typeof t)[0];if(n!=f)return"o"==n&&"n"==f||("s"==f||"u"==n);if("o"!=n&&"u"!=n&&e!=t)return e<t;r++}
/******/ 		}
/******/ 		var rangeToString = (range) => {
/******/ 			// see webpack/lib/util/semver.js for original code
/******/ 			var r=range[0],n="";if(1===range.length)return"*";if(r+.5){n+=0==r?">=":-1==r?"<":1==r?"^":2==r?"~":r>0?"=":"!=";for(var e=1,a=1;a<range.length;a++){e--,n+="u"==(typeof(t=range[a]))[0]?"-":(e>0?".":"")+(e=2,t)}return n}var g=[];for(a=1;a<range.length;a++){var t=range[a];g.push(0===t?"not("+o()+")":1===t?"("+o()+" || "+o()+")":2===t?g.pop()+" "+g.pop():rangeToString(t))}return o();function o(){return g.pop().replace(/^\((.+)\)$/,"$1")}
/******/ 		}
/******/ 		var satisfy = (range, version) => {
/******/ 			// see webpack/lib/util/semver.js for original code
/******/ 			if(0 in range){version=parseVersion(version);var e=range[0],r=e<0;r&&(e=-e-1);for(var n=0,i=1,a=!0;;i++,n++){var f,s,g=i<range.length?(typeof range[i])[0]:"";if(n>=version.length||"o"==(s=(typeof(f=version[n]))[0]))return!a||("u"==g?i>e&&!r:""==g!=r);if("u"==s){if(!a||"u"!=g)return!1}else if(a)if(g==s)if(i<=e){if(f!=range[i])return!1}else{if(r?f>range[i]:f<range[i])return!1;f!=range[i]&&(a=!1)}else if("s"!=g&&"n"!=g){if(r||i<=e)return!1;a=!1,i--}else{if(i<=e||s<g!=r)return!1;a=!1}else"s"!=g&&"n"!=g&&(a=!1,i--)}}var t=[],o=t.pop.bind(t);for(n=1;n<range.length;n++){var u=range[n];t.push(1==u?o()|o():2==u?o()&o():u?satisfy(u,version):!o())}return!!o();
/******/ 		}
/******/ 		var ensureExistence = (scopeName, key) => {
/******/ 			var scope = __webpack_require__.S[scopeName];
/******/ 			if(!scope || !__webpack_require__.o(scope, key)) throw new Error("Shared module " + key + " doesn't exist in shared scope " + scopeName);
/******/ 			return scope;
/******/ 		};
/******/ 		var findVersion = (scope, key) => {
/******/ 			var versions = scope[key];
/******/ 			var key = Object.keys(versions).reduce((a, b) => {
/******/ 				return !a || versionLt(a, b) ? b : a;
/******/ 			}, 0);
/******/ 			return key && versions[key]
/******/ 		};
/******/ 		var findSingletonVersionKey = (scope, key) => {
/******/ 			var versions = scope[key];
/******/ 			return Object.keys(versions).reduce((a, b) => {
/******/ 				return !a || (!versions[a].loaded && versionLt(a, b)) ? b : a;
/******/ 			}, 0);
/******/ 		};
/******/ 		var getInvalidSingletonVersionMessage = (scope, key, version, requiredVersion) => {
/******/ 			return "Unsatisfied version " + version + " from " + (version && scope[key][version].from) + " of shared singleton module " + key + " (required " + rangeToString(requiredVersion) + ")"
/******/ 		};
/******/ 		var getSingleton = (scope, scopeName, key, requiredVersion) => {
/******/ 			var version = findSingletonVersionKey(scope, key);
/******/ 			return get(scope[key][version]);
/******/ 		};
/******/ 		var getSingletonVersion = (scope, scopeName, key, requiredVersion) => {
/******/ 			var version = findSingletonVersionKey(scope, key);
/******/ 			if (!satisfy(requiredVersion, version)) warn(getInvalidSingletonVersionMessage(scope, key, version, requiredVersion));
/******/ 			return get(scope[key][version]);
/******/ 		};
/******/ 		var getStrictSingletonVersion = (scope, scopeName, key, requiredVersion) => {
/******/ 			var version = findSingletonVersionKey(scope, key);
/******/ 			if (!satisfy(requiredVersion, version)) throw new Error(getInvalidSingletonVersionMessage(scope, key, version, requiredVersion));
/******/ 			return get(scope[key][version]);
/******/ 		};
/******/ 		var findValidVersion = (scope, key, requiredVersion) => {
/******/ 			var versions = scope[key];
/******/ 			var key = Object.keys(versions).reduce((a, b) => {
/******/ 				if (!satisfy(requiredVersion, b)) return a;
/******/ 				return !a || versionLt(a, b) ? b : a;
/******/ 			}, 0);
/******/ 			return key && versions[key]
/******/ 		};
/******/ 		var getInvalidVersionMessage = (scope, scopeName, key, requiredVersion) => {
/******/ 			var versions = scope[key];
/******/ 			return "No satisfying version (" + rangeToString(requiredVersion) + ") of shared module " + key + " found in shared scope " + scopeName + ".\n" +
/******/ 				"Available versions: " + Object.keys(versions).map((key) => {
/******/ 				return key + " from " + versions[key].from;
/******/ 			}).join(", ");
/******/ 		};
/******/ 		var getValidVersion = (scope, scopeName, key, requiredVersion) => {
/******/ 			var entry = findValidVersion(scope, key, requiredVersion);
/******/ 			if(entry) return get(entry);
/******/ 			throw new Error(getInvalidVersionMessage(scope, scopeName, key, requiredVersion));
/******/ 		};
/******/ 		var warn = (msg) => {
/******/ 			if (typeof console !== "undefined" && console.warn) console.warn(msg);
/******/ 		};
/******/ 		var warnInvalidVersion = (scope, scopeName, key, requiredVersion) => {
/******/ 			warn(getInvalidVersionMessage(scope, scopeName, key, requiredVersion));
/******/ 		};
/******/ 		var get = (entry) => {
/******/ 			entry.loaded = 1;
/******/ 			return entry.get()
/******/ 		};
/******/ 		var init = (fn) => (function(scopeName, a, b, c) {
/******/ 			var promise = __webpack_require__.I(scopeName);
/******/ 			if (promise && promise.then) return promise.then(fn.bind(fn, scopeName, __webpack_require__.S[scopeName], a, b, c));
/******/ 			return fn(scopeName, __webpack_require__.S[scopeName], a, b, c);
/******/ 		});
/******/ 		
/******/ 		var load = /*#__PURE__*/ init((scopeName, scope, key) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return get(findVersion(scope, key));
/******/ 		});
/******/ 		var loadFallback = /*#__PURE__*/ init((scopeName, scope, key, fallback) => {
/******/ 			return scope && __webpack_require__.o(scope, key) ? get(findVersion(scope, key)) : fallback();
/******/ 		});
/******/ 		var loadVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return get(findValidVersion(scope, key, version) || warnInvalidVersion(scope, scopeName, key, version) || findVersion(scope, key));
/******/ 		});
/******/ 		var loadSingleton = /*#__PURE__*/ init((scopeName, scope, key) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return getSingleton(scope, scopeName, key);
/******/ 		});
/******/ 		var loadSingletonVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return getSingletonVersion(scope, scopeName, key, version);
/******/ 		});
/******/ 		var loadStrictVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return getValidVersion(scope, scopeName, key, version);
/******/ 		});
/******/ 		var loadStrictSingletonVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return getStrictSingletonVersion(scope, scopeName, key, version);
/******/ 		});
/******/ 		var loadVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
/******/ 			if(!scope || !__webpack_require__.o(scope, key)) return fallback();
/******/ 			return get(findValidVersion(scope, key, version) || warnInvalidVersion(scope, scopeName, key, version) || findVersion(scope, key));
/******/ 		});
/******/ 		var loadSingletonFallback = /*#__PURE__*/ init((scopeName, scope, key, fallback) => {
/******/ 			if(!scope || !__webpack_require__.o(scope, key)) return fallback();
/******/ 			return getSingleton(scope, scopeName, key);
/******/ 		});
/******/ 		var loadSingletonVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
/******/ 			if(!scope || !__webpack_require__.o(scope, key)) return fallback();
/******/ 			return getSingletonVersion(scope, scopeName, key, version);
/******/ 		});
/******/ 		var loadStrictVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
/******/ 			var entry = scope && __webpack_require__.o(scope, key) && findValidVersion(scope, key, version);
/******/ 			return entry ? get(entry) : fallback();
/******/ 		});
/******/ 		var loadStrictSingletonVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
/******/ 			if(!scope || !__webpack_require__.o(scope, key)) return fallback();
/******/ 			return getStrictSingletonVersion(scope, scopeName, key, version);
/******/ 		});
/******/ 		var installedModules = {};
/******/ 		var moduleToHandlerMapping = {
/******/ 			"webpack/sharing/consume/default/react/react": () => (loadSingletonVersionCheckFallback("default", "react", [1,18], () => (__webpack_require__.e("vendors-node_modules_react_index_js").then(() => (() => (__webpack_require__(/*! react */ "../../node_modules/react/index.js"))))))),
/******/ 			"webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework": () => (loadSingletonVersionCheckFallback("default", "@openmrs/esm-framework", [0], () => (__webpack_require__.e("vendors-node_modules_openmrs_esm-framework_src_internal_ts").then(() => (() => (__webpack_require__(/*! @openmrs/esm-framework */ "../../node_modules/@openmrs/esm-framework/src/internal.ts"))))))),
/******/ 			"webpack/sharing/consume/default/react-router-dom/react-router-dom": () => (loadSingletonVersionCheckFallback("default", "react-router-dom", [1,6], () => (__webpack_require__.e("vendors-node_modules_react-router-dom_dist_index_js").then(() => (() => (__webpack_require__(/*! react-router-dom */ "../../node_modules/react-router-dom/dist/index.js"))))))),
/******/ 			"webpack/sharing/consume/default/react-i18next/react-i18next": () => (loadSingletonVersionCheckFallback("default", "react-i18next", [1,11], () => (__webpack_require__.e("vendors-node_modules_react-i18next_dist_es_index_js").then(() => (() => (__webpack_require__(/*! react-i18next */ "../../node_modules/react-i18next/dist/es/index.js"))))))),
/******/ 			"webpack/sharing/consume/default/rxjs/rxjs": () => (loadSingletonVersionCheckFallback("default", "rxjs", [1,6], () => (Promise.all([__webpack_require__.e("vendors-node_modules_rxjs__esm5_internal_operators_map_js"), __webpack_require__.e("vendors-node_modules_rxjs__esm5_index_js")]).then(() => (() => (__webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js"))))))),
/******/ 			"webpack/sharing/consume/default/@openmrs/esm-framework/src/internal/@openmrs/esm-framework/src/internal": () => (loadSingletonFallback("default", "@openmrs/esm-framework/src/internal", () => (__webpack_require__.e("vendors-node_modules_openmrs_esm-framework_src_internal_ts").then(() => (() => (__webpack_require__(/*! @openmrs/esm-framework/src/internal */ "../../node_modules/@openmrs/esm-framework/src/internal.ts"))))))),
/******/ 			"webpack/sharing/consume/default/dayjs/dayjs": () => (loadSingletonVersionCheckFallback("default", "dayjs", [1,1], () => (__webpack_require__.e("vendors-node_modules_dayjs_dayjs_min_js").then(() => (() => (__webpack_require__(/*! dayjs */ "../../node_modules/dayjs/dayjs.min.js")))))))
/******/ 		};
/******/ 		// no consumes in initial chunks
/******/ 		var chunkMapping = {
/******/ 			"webpack_sharing_consume_default_react_react": [
/******/ 				"webpack/sharing/consume/default/react/react"
/******/ 			],
/******/ 			"src_index_ts-webpack_sharing_consume_default_openmrs_esm-framework_src_internal_openmrs_esm-f-d0ff54": [
/******/ 				"webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework",
/******/ 				"webpack/sharing/consume/default/react-router-dom/react-router-dom",
/******/ 				"webpack/sharing/consume/default/react-i18next/react-i18next",
/******/ 				"webpack/sharing/consume/default/rxjs/rxjs",
/******/ 				"webpack/sharing/consume/default/@openmrs/esm-framework/src/internal/@openmrs/esm-framework/src/internal"
/******/ 			],
/******/ 			"node_modules_moment_locale_sync_recursive_-src_patient-chart_laboratory-order_component_tsx-w-87a496": [
/******/ 				"webpack/sharing/consume/default/dayjs/dayjs"
/******/ 			]
/******/ 		};
/******/ 		__webpack_require__.f.consumes = (chunkId, promises) => {
/******/ 			if(__webpack_require__.o(chunkMapping, chunkId)) {
/******/ 				chunkMapping[chunkId].forEach((id) => {
/******/ 					if(__webpack_require__.o(installedModules, id)) return promises.push(installedModules[id]);
/******/ 					var onFactory = (factory) => {
/******/ 						installedModules[id] = 0;
/******/ 						__webpack_require__.m[id] = (module) => {
/******/ 							delete __webpack_require__.c[id];
/******/ 							module.exports = factory();
/******/ 						}
/******/ 					};
/******/ 					var onError = (error) => {
/******/ 						delete installedModules[id];
/******/ 						__webpack_require__.m[id] = (module) => {
/******/ 							delete __webpack_require__.c[id];
/******/ 							throw error;
/******/ 						}
/******/ 					};
/******/ 					try {
/******/ 						var promise = moduleToHandlerMapping[id]();
/******/ 						if(promise.then) {
/******/ 							promises.push(installedModules[id] = promise.then(onFactory)['catch'](onError));
/******/ 						} else onFactory(promise);
/******/ 					} catch(e) { onError(e); }
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"@ugandaemr/esm-laboratory-app": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if("webpack_sharing_consume_default_react_react" != chunkId) {
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		globalThis["webpackHotUpdate_ugandaemr_esm_laboratory_app"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunk_ugandaemr_esm_laboratory_app"] = globalThis["webpackChunk_ugandaemr_esm_laboratory_app"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("../../node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=6084&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true");
/******/ 	__webpack_require__("../../node_modules/webpack/hot/dev-server.js");
/******/ 	var __webpack_exports__ = __webpack_require__("webpack/container/entry/@ugandaemr/esm-laboratory-app");
/******/ 	_ugandaemr_esm_laboratory_app = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=esm-laboratory-app.js.map