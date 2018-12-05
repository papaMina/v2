﻿/*!
 * JavaScript v2 v1.0.1
 * https://github.com/vbton/v2
 *
 ** @author hyly
 ** @date 2018-12-01
 ** @descript a valuable technology object.
 */
(function (global, factory) {
    return typeof exports === 'object' && typeof module === "object" ?
        module.exports = global.document ? factory(global) : function (window) {
            if (window.document == null) throw new Error("v2 requires a window with a document");
            return factory(window);
        } :
        typeof define === 'function' && define.amd ? define(function (window) {
            if (window.document == null) throw new Error("v2 requires a window with a document");
            return factory(window);
        }) : factory(global);
})(this, function (window) {
    'use strict';

    var
        version = "2.0.1.0",
        rtrim = /^[\x20\t\r\n\f]+|[\x20\t\r\n\f]+$/g,
        core_trim = version.trim || function () {
            if (this == null) {
                throw new Error("Uncaught TypeError:String.prototype.trim called on null or undefined at trim.");
            }
            return String(this).replace(rtrim, "");
        };
    var rdashAlpha = /-([a-z])/img,
        fcamelCase = function (_, letter) {
            return letter.toUpperCase();
        };
    var rcapitalAlpha = /([A-Z])/gm,
        furlCase = function (_, letter) {
            return "-" + letter.toLowerCase();
        };

    var class2type = {},
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty;
    var core_arr = [],
        core_slice = core_arr.slice,
        core_splice = core_arr.splice,
        core_concat = core_arr.concat,
        core_indexOf = core_arr.indexOf || function (item, from) {
            if (this == null) {
                throw new Error("Uncaught TypeError: Array.prototype.indexOf called on null or undefined at indexOf.");
            }
            from = from >> 0;
            var len = this.length >>> 0;
            for (var i = Math.max(from > -1 ? from : len + from, 0); i < len; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };

    var rnotwhite = /\S+/g;

    var document = window.document;

    function makeMap(string, expectsLowerCase) {
        var map = {};
        var list = string.match(rnotwhite) || [];
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;
        }
        return expectsLowerCase ?
            function (val) {
                return map[val.toLowerCase()];
            } :
            function (val) {
                return map[val];
            };
    };

    function makeCache(callback, expectsLowerCase) {
        var value, cache = {};
        return expectsLowerCase ? function (string) {
            value = cache[string.toLowerCase()];
            if (value != null) return value;
            return cache[string.toLowerCase()] = applyCallback(callback, arguments);
        } : function (string) {
            value = cache[string];
            if (value != null) return value;
            return cache[string] = applyCallback(callback, arguments);
        }
    }

    function isArraylike(object) {
        if (object == null) return false;
        var length = object.length,
            type = v2.type(object);

        if (type === "function" || type === "string" || v2.isWindow(object)) {
            return false;
        }
        if (object.nodeType === 1 && length) {
            return true;
        }
        try {
            return type === "array" || length === 0 || length > 0 && typeof length === "number" && (length - 1) in object;
        } catch (_) {
            return false;
        }
    }

    function check_destroy(elem, callback) {
        if (!elem) return false;
        if (callback(elem)) return true;
        return v2.any(elem.parentNode.childNodes, function (node) {
            return callback(node);
        });
    }

    function destroyObject(object, deep) {
        if (!object) return null;
        var elem;
        if (object.v2 === version) {
            if ((elem = object.$) && elem.jquery) {
                elem = elem.get(0);
            }
        }
        var i, value;
        for (i in object) {
            value = object[i];
            if (value && deep && value !== object) {
                if (value.destroy && value.v2 === version) {
                    value.destroy(deep);
                } else if (value.jquery) {
                    if (check_destroy(elem, function (node) { return value.is(node); })) {
                        value.remove();
                    }
                } else if (value.nodeType) {
                    if (check_destroy(elem, function (node) { return value === node; })) {
                        value.parentNode.removeChild(value);
                    }
                } else if (v2.isPlainObject(value)) {
                    destroyObject(value, deep);
                }
            }
            value = null;
        }
        return object = null;
    }

    function v2(tag, option) {
        if (arguments.length == 1 && typeof tag === "object") {
            options = tag;
            tag = options.tag;
        }
        return v2.ready(tag, function (tag, configs) {
            return new v2.fn.init(tag, configs ? v2.improve(option, configs) : option);
        });
    }
    var tag = "[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*";
    var rany = /\*/g,
        rtag = new RegExp("^" + tag + "$", "i"),
        rnamespace = new RegExp("^(?:(" + tag + "(?:\\.(?:" + tag + "|\\*))*" + ")\\.)?(" + tag + ")$", "i"),
        rnamespaceGet = new RegExp("^(?:(" + tag + "(?:\\.(?:" + tag + "|\\*))*" + ")\\.)?(\\*|" + tag + ")$", "i");
    function namespaceCached(objectCreate, objectCallback) {
        var cache = {},
            matchCache = makeCache(function (namespace) {
                return new RegExp("^" + namespace.replace(/\./g, "\\.").replace(rany, "[^\\.]+") + "$", "i");
            }, true),
            namespaceCache = makeCache(function (string, namespace) {
                return namespace === "*" ? string : namespace + "." + string;
            }),
            fnGet = function (namespace, string) {
                string = string || "*";
                namespace = namespace || "*";
                var data, cached = cache[namespace];
                if (!cached) {
                    if (namespace.indexOf("*") > 1) {
                        var rmatch = matchCache(namespace);
                        for (data in cache) {
                            if (rmatch.test(data)) {
                                return fnGet(data, string);
                            }
                        }
                    }
                    return false;
                }
                if (string === "*") {
                    string = namespace.split(".").pop();
                }
                return cached[string];
            },
            fnSet = function (namespace, string, option) {
                option.tag = string;
                namespace = namespaceCache(string, namespace || "*");
                var data, cached = cache[namespace] || (cache[namespace] = {});
                if (!(data = cached[string]) || v2.isFunction(option)) {
                    return cached[string] = option;
                }
                if (v2.isFunction(data)) {
                    throw new Error("The cache has been assigned as a function by an object named “" + string + "”.");
                }
                return cached[string] = v2.extend(true, data, option);
            };
        return function (string, option) {
            var match, namespace;
            string = v2.urlCase(string);
            if (option === undefined) {
                var results = objectCreate(string);
                while (match = rnamespaceGet.exec(namespace = namespace || namespaceCache(string))) {
                    if (option = fnGet(namespace, string = match[2])) {
                        objectCallback(results, option);
                    }
                    namespace = match[1];
                    if (!namespace || namespace === "*") break;
                }
                return results;
            }
            if (match = rnamespace.exec(string)) {
                return fnSet(match[1], match[2], option);
            }
            v2.error("string:" + string + ",Invalid class name space.");
        };
    };
    function readonlyProperty(context, name, value) {
        try {
            delete context[name];
            Object.defineProperty(context, name, {
                get: function () {
                    return value;
                }
            });
        } catch (_) {
            context[name] = value;
        }
    };
    function initWildCards(wildCards, key, type, value) {
        if (!wildCards || !key) return key;
        var wildcard, char = key[0];
        if (wildcard = v2.wildCards[char]) {
            key = key.slice(1);
            if (wildcard.type === "*" || wildcard.type === (type = type || v2.type(value)) || wildcard.type.indexOf(type + "|") > -1 || wildcard.type.indexOf("|" + type) > -1) {
                wildCards[key] = wildcard;
            }
        }
        return key;
    }
    function renderWildCard(context, variable) {
        var val;
        v2.each(context.wildCards, function (value, key) {
            if (!(key in context.enumState)) {
                val = value.exec(context, value.type === "function" ? variable[key] : context[key], key);
                if (val !== undefined) {
                    if (value.type === "function") {
                        variable[key] = val;
                    } else {
                        context[key] = val;
                    }
                }
            }
        });
    }
    var whitespace = "[\\x20\\t\\r\\n\\f]",
        word = "[_a-z][_a-z0-9]*";
    var rword = new RegExp(word, "gi"),
        rinject = new RegExp("^" + whitespace + "*(" + word + ")\\(((" + whitespace + "*" + word + whitespace + "*,)*" + whitespace + "*" + word + ")?" + whitespace + "*\\)" + whitespace + "*$", "i");
    function dependencyInjection(context, key, inject, value) {
        if (!inject) return value;
        var args = [], baseArgs, injections = inject.match(rword);
        var callback = context[key];
        if (callback) {
            context[key] = function () {
                return applyCallback(callback, baseArgs, context, true);
            };
            return function () {
                for (key in injections) {
                    args[key] = (key = injections[key]) in context.variable ? context.variable[key] : context[key];
                }
                baseArgs = core_slice.call(arguments);
                return applyCallback(value, core_concat.call(args, baseArgs), context, true);
            };
        }
        return function () {
            for (key in injections) {
                args[key] = (key = injections[key]) in context.variable ? context.variable[key] : context[key];
            }
            return applyCallback(value, args, context, true);
        };
    }
    function applyCallback(callback, args, context, sliced) {
        if (!args || args.length === 0) return callback.call(context);
        if (args.length === 1) return callback.call(context, args[0]);
        if (args.length === 2) return callback.call(context, args[0], args[1]);
        if (args.length === 3) return callback.call(context, args[0], args[1], args[2]);
        return callback.apply(context, sliced ? args : core_slice.call(args));
    }
    function HTMLColection(tag) {
        var tagColection = (new Function('return function ' + tag.charAt(0).toUpperCase() + tag.slice(1) + 'Colection(tag){ this.tag = tag; }'))();
        tagColection.prototype = {
            constructor: tagColection,
            length: 0
        };
        return new tagColection(tag);
    };

    var identity = 0,
        CurrentV2Control = null;
    v2.fn = v2.prototype = {
        constructor: v2,
        tag: "*",
        v2: version,
        identity: 0,
        limit: false,
        access: false,
        $: null,
        $$: null,
        wildCards: {},
        enumState: {
            pending: 0.5,
            init: 1,
            render: 2,
            resolve: 4,
            commit: 8
        },
        take: function (selector, context) {
            if (v2.take) {
                return v2.take(selector, context);
            }
            return context.querySelector(selector);
        },
        baseConfigs: function (option) {
            this.base = this.base || {};
            this.init = function (tag) {
                var element = option.element;
                var context = option.context || document.body;
                if (context) {
                    context = this.take(context, document);
                }
                if (element) {
                    element = this.take(element, context);
                }
                if (!v2.nodeName(element, tag)) {
                    context = element || context;
                    element = null;
                }
                if (!element) {
                    var node = document.createElement(tag || "div");
                    if (context.jquery) {// jQuery
                        element = context.append(node).children().eq(-1);
                    } else if (context.nodeType) {// DOM
                        context.appendChild(element = node);
                    }
                } else {
                    if (element.jquery) { // jQuery
                        context = element.parent();
                    } else if (element.nodeType) {// DOM
                        context = element.parentNode;
                    }
                }
                return this.$$ = context, this.$ = element;
            };
        },
        build: function () {
            var context = this;
            var fn,
                tag,
                type,
                match,
                isFunction,
                namespace = "*",
                defaults = {},
                options = {},
                variable = {},
                wildCards = this.wildCards || (this.wildCards = {}),
                makeCallback = function (callback, key) {
                    if (callback.control === context) return callback;
                    var _base, _value, _callback = function () {
                        _base = context.base;
                        context.base = _base.base;
                        _value = context.enumState[key];
                        if (_value && _value > 1 && _value < 4) {
                            _value = callback.call(context, variable);
                        } else {
                            _value = applyCallback(callback, arguments, context);
                        }
                        context.base = _base;
                        return _value;
                    };
                    _callback.control = context;
                    return _callback;
                },
                extendsCallback = function (base, key, value) {
                    if (base[key]) {
                        extendsCallback(base.base = base.base || {}, key, base[key]);
                    }
                    base[key] = makeCallback(value, key);
                },
                initControls = function (option) {
                    if (!option) return option;
                    type = v2.type(option);
                    if (type === "array") return v2.each(option, initControls);
                    tag = option.tag;
                    if (isFunction = type === "function") {
                        namespace += "." + tag;
                        option = option(context, variable) || {};
                    }
                    tag = option.tag || tag;
                    if (tag && (fn = option[v2.camelCase(tag)]) && v2.isFunction(fn)) {
                        fn.call(context, option);
                    }
                    var orgKey;
                    v2.each(option, function (value, key) {
                        if (key === tag || value == null) return;
                        key = initWildCards(wildCards, orgKey = key, type = v2.type(value));
                        if (key === tag) return;
                        switch (type) {
                            case "function":
                                if (match = rinject.exec(key)) {
                                    value = dependencyInjection(context, key = match[1], match[2], value);
                                }
                                if (fn = context[key]) {
                                    defaults[key] = value;
                                    extendsCallback(context.base, key, fn);
                                }
                                options[key] = true;
                                context[key] = value;
                                break;
                            case "array":
                            case "object":
                                if (key in context) {
                                    context[key] = (!context[key] || type === "array") ? value : v2.improve(true, value, context[key]);
                                } else if (value.nodeType) {
                                    variable[key] = value;
                                } else {
                                    variable[key] = isFunction && !variable[key] ?
                                        value :
                                        v2.extend(true, variable[key], value);
                                }
                                break;
                            case "string":
                                if (key === "tag") {
                                    namespace += "." + value;
                                }
                            default:
                                if (key in context && !(key in options ? options[key] : options[key] = v2.isFunction(context[key]))) {
                                    context[key] = value;
                                }
                                variable[key] = value;
                                break;
                        }
                        if (isFunction) option[orgKey] = undefined;
                    });
                    if (isFunction) option = undefined;
                };
            v2.each(v2.use(this.tag), initControls);
            initControls(this.option);
            var base, value, core_base = context.base;
            v2.each(defaults, function (fn, key) {
                defaults[key] = undefined;
                context[key] = function () {
                    base = context.base;
                    context.base = core_base;
                    value = applyCallback(fn, arguments, context);
                    context.base = base;
                    return value;
                };
            });
            readonlyProperty(this, "v2", version);
            readonlyProperty(this, "tag", this.tag);
            readonlyProperty(this, "identity", ++identity);
            readonlyProperty(this, "variable", variable);
            readonlyProperty(this, "wildCards", wildCards);
            readonlyProperty(this, "namespace", namespace);
            initControls = (extendsCallback = (makeCallback = undefined));
        },
        init: function (tag, option) {
            var type, render;
            this.tag = tag;
            this.option = option;
            this.baseConfigs(option);
            this.build();
            if (this.ajax && this.access) {
                render = this.render;
                this.render = function () {
                    var value = applyCallback(render, arguments, this);
                    this.sleep(function () {
                        this.ajax();
                    });
                    return value;
                };
            }
            var timer, sleep = false, my = this, callbacks = [];
            this.sleep = function (i) {
                if (arguments.length < 1) return sleep;
                type = v2.type(i);
                if (type === "boolean") {
                    i = ~~sleep + ~~i;
                    sleep = !!(i - ~~sleep);
                    i = !!(i - ~~sleep);

                    if (i && !sleep) {
                        my.whenThen();
                        while (i = callbacks.shift()) {
                            i.call(my, my);
                        }
                    }
                    return i === sleep;
                }
                if (type === "function") {
                    if (sleep) {
                        callbacks.push(i);
                    } else {
                        i.call(my, my);
                    }
                }
                if (type === "number") {
                    sleep = true;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        sleep = false;
                        my.whenThen();
                        while (i = callbacks.shift()) {
                            i.call(my, my);
                        }
                    }, i);
                }
                return sleep;
            };
            this.whenThen();
        },
        render: function (variable) {
            v2.each(this.namespace.split("."), function (tag) {
                if (rtag.test(tag)) {
                    var name = v2.camelCase(tag);
                    v2.merge(v2[name + "s"] || (v2[name + "s"] = HTMLColection(name)), this);
                }
            }, this);
            renderWildCard(this, variable);
        },
        whenThen: function (state, falseStop) {
            if (typeof state === "boolean") {
                falseStop = state;
                state = undefined;
            }
            var v2Control = CurrentV2Control;
            CurrentV2Control = this;
            var value, isReady = true;
            falseStop = falseStop == null ? true : falseStop;
            for (state in this.enumState) {
                value = this.enumState[state];
                if (value > this.enumState[this.state] >>> 0) {
                    if (this[this.state = state] && v2.isFunction(this[state])) {
                        value = value > 1 && value < 4 ? this[state](this.variable) : this[state]();
                        if (falseStop && (value === false || this.sleep())) {
                            isReady = false;
                            break;
                        }
                    }
                }
            }
            this.isReady = isReady;
            CurrentV2Control = v2Control;
        },
        destroy: function (deep) {
            v2.each(this.namespace.split("."), function (tag) {
                if (rtag.test(tag)) {
                    var name = v2.camelCase(tag);
                    var collect = v2[name + "s"];
                    if (collect && (index = core_indexOf.call(collect, this)) > -1) {
                        core_splice.call(collect, index, 1);
                    }
                }
            }, this);
            destroyObject(this.base, true);//基础对象始终深度释放。
            destroyObject(this, deep);
        }
    };
    v2.fn.init.prototype = v2.fn;

    v2.type = function (object) {
        return object == null ? String(object) : (typeof object === "object" || typeof object === "function") ? class2type[core_toString.call(object)] || "object" : typeof object;
    };

    v2.extension = function (callback, array) {
        if (arguments.length === 1) {
            array = callback;
            callback = undefined;
        }
        var isArray, key, deep, option;
        var i = 1, len = array.length, target = array[0];
        if (typeof target === "boolean") {
            deep = target;
            target = array[i++];
        }
        if (i === len) {
            i -= 1;
            target = this;
        }
        var extension = function (value, option) {
            if (value === option || option === undefined) return value;
            if (value && deep && ((isArray = isArraylike(value)) || v2.isPlainObject(value))) {
                return v2.extension(callback, [deep, value || (isArray ? [] : {}), value]);
            }
            return callback ? callback(value, option) : option;
        };
        while ((option = array[i++]) != null) {
            if (typeof option === "boolean") { deep = option; continue; }
            if (target == null) {
                target = isArraylike(option) ? [] : {};
            }
            for (key in option) {
                target[key] = extension(target[key], option[key]);
            }
        }
        return target;
    };

    var improveCallbak = function (value, option) {
        return option == null ? value : option;
    };

    v2.extend = function () {
        return v2.extension.call(this, arguments);
    };

    v2.improve = function () {
        return v2.extension.call(this, improveCallbak, arguments);
    };

    v2.extend({
        merge: function (results, arr) {
            var len = arr.length,
                i = results.length,
                j = 0;

            if (typeof len === "number") {
                for (; j < len; j++) {
                    results[i++] = arr[j];
                }
            } else {
                while (arr[j] !== undefined) {
                    results[i++] = arr[j++];
                }
            }

            results.length = i;

            return results;
        },
        each: function (object, callback, context) {
            if (!object || !callback) return object;
            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    if (callback.call(context || object, object[i], i, object) === false) break;
                }
            }
            else {
                for (i in object) {
                    if (callback.call(context || object, object[i], i, object) === false) break;
                }
            }
            return object;
        },
        map: function (object, callback, context) {
            var value, arr = [];
            if (!object || !callback) return arr;
            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    value = callback.call(context || object, object[i], i, object);
                    if (value != null) arr.push(value);
                }
            } else {
                for (i in object) {
                    value = callback.call(context || object, object[i], i, object);
                    if (value != null) arr.push(value);
                }
            }
            return arr;
        },
        any: function (object, callback, context) {
            if (!object || !callback) return false;
            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    if (callback.call(context || object, object[i], i, object)) return true;
                }
            } else {
                for (i in object) {
                    if (callback.call(context || object, object[i], i, object)) return true;
                }
            }
            return false;
        }
    });

    v2.extend({
        error: function (msg) {
            throw new Error(msg);
        },
        syntaxError: window.SyntaxError ? function (msg) {
            throw new SyntaxError("Unrecognized expression: " + msg);
        } : function (msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        }
    });

    v2.extend({
        trim: function (string) {
            return string == null ? "" : core_trim.call(string);
        },
        urlCase: function (string) {
            return string.replace(rcapitalAlpha, furlCase);
        },
        camelCase: function (string) {
            return string.replace(rdashAlpha, fcamelCase);
        }
    });

    v2.extend({
        isEmpty: function (object) {
            return !object || object.length === 0;
        },
        isWindow: function (object) {
            return object != null && object.window == object;
        },
        isNumber: function (object) {
            return !!object && (object - parseFloat(object) >= 0);
        },
        isString: function (object) {
            return v2.type(object) === "string";
        },
        isFunction: function (object) {
            return v2.type(object) === "function";
        },
        isEmptyObject: function (object) {
            for (var i in object) {
                return false;
            }
            return true;
        },
        isArraylike: isArraylike,
        isArray: Array.isArray || function (object) {
            return v2.type(object) === "array";
        },
        isPlainObject: function (object) {
            if (!object || v2.type(object) !== "object" || object.nodeType || v2.isWindow(object)) {
                return false;
            }
            try {
                if (object.constructor &&
                    !core_hasOwn.call(object, "constructor") &&
                    !core_hasOwn.call(object.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            var key;
            for (key in object) { }
            return key === undefined || core_hasOwn.call(object, key);
        }
    });

    v2.each(["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error"], function (item) {
        class2type["[object " + item + "]"] = item.toLowerCase();
    });

    v2.extend({
        wildCards: {
            "&": {
                type: "function",
                exec: function (control, value, key) {
                    if (value) {
                        control[key](value);
                    }
                }
            },
            "!": {
                type: "function",
                exec: function (control, value, key) {
                    if (!value) {
                        control[key](value);
                    }
                }
            },
            "?": {
                type: "function",
                exec: function (control, value, key) {
                    if (typeof value === "boolean") {
                        control[key](value);
                    }
                }
            }
        },
        ready: function (tag, callback) {
            return callback(tag);
        }
    });

    v2.extend({
        makeMap: makeMap,
        makeCache: makeCache,
        makeNamespaceCache: namespaceCached
    });

    v2.extend({
        nodeName: function (elem, nodeName) {
            return elem && elem.nodeName && (!nodeName || nodeName === "*" || elem.nodeName.toLowerCase() === nodeName.toLowerCase());
        }
    });
    var logCb = {
        debug: 16,
        error: 8,
        warn: 4,
        info: 2,
        log: 1
    };
    var use = namespaceCached(function () {
        return new Array();
    }, function (results, value) {
        results.unshift(value);
    });
    v2.extend({
        use: function (tag, option) {
            if (v2.isString(tag)) return use(tag, option);
            var fn = v2.fn,
                wildCards = fn.wildCards || (fn.wildCards = {});
            v2.each(tag, function (value, key) {
                if (key === "init") {
                    var baseConfigs = fn.baseConfigs;
                    fn.baseConfigs = function () {
                        value = applyCallback(baseConfigs, arguments);
                        this.init = value;
                        return value;
                    }
                    return;
                }
                fn[initWildCards(wildCards, key, null, value)] = value;
            });
        },
        typeCb: function (typeCb, type, callback) {
            if (!type || !typeCb || !callback || !(type = type >>> 0)) return;
            v2.each(typeCb, function (typeCb, key) {
                if ((typeCb & type) === typeCb) {
                    return callback(key, typeCb);
                }
            });
        },
        log: function (message, type, logAll) {
            return v2.typeCb(logCb, type || 1, function (log) {
                if (log in console) {
                    console[log](message);
                    return !!logAll;
                }
            });
        }
    });

    function noop() { }

    var xhrCb = window.XMLHttpRequest,
        xhr = new xhrCb(),
        xhrId = 0,
        xhrWait = {},
        xhrCallbacks = {},
        xhr_send = xhr.send,
        xhr_open = xhr.open,
        xhr_abort = xhr.abort;
    v2.extend(xhrCb.prototype, {
        open: function (_method, _url, async) {
            if (async && CurrentV2Control) {
                var status, xhr = this,
                    v2Control = CurrentV2Control,
                    identity = v2Control.identity;
                v2Control.sleep(true);
                if (xhrWait[identity]) {
                    xhrWait[identity] += 1;
                } else {
                    xhrWait[identity] = 1;
                }
                xhrCallbacks[xhr.xhrId = ++xhrId] = function () {
                    if (xhr.readyState === 4) {
                        status = xhr.status;
                        xhr.onreadystatechange = noop;
                        if (status >= 200 && status < 300 || status === 304 || status === 1223) {
                            if (!(xhrWait[identity] -= 1)) {
                                v2Control.sleep(false);
                            }
                        }
                        delete xhrCallbacks[xhr.xhrId];
                    }
                };
            }
            return applyCallback(xhr_open, arguments, this);
        },
        send: function (data) {
            var xhr = this, xhr_id = xhr.xhrId;
            if (xhr_id && xhr_id > 0) {
                setTimeout(function () {
                    if (xhr.readyState === 4) {
                        if (xhr_id in xhrCallbacks) {
                            xhrCallbacks[xhr_id]();
                        }
                        return;
                    }
                    var onchange, callback = xhr.onreadystatechange;
                    xhr.onreadystatechange = callback ? (onchange = function () {
                        applyCallback(callback, arguments, this);
                        if (xhr_id in xhrCallbacks) {
                            xhrCallbacks[xhr_id]();
                        }
                        if (xhr_id in xhrCallbacks && onchange != xhr.onreadystatechange) {
                            callback = xhr.onreadystatechange || noop;
                            xhr.onreadystatechange = onchange;
                        }
                    }) : xhrCallbacks[xhr_id];
                });
            }
            return data ? xhr_send.call(this, data) : xhr_send.call(this);
        },
        abort: function () {
            if (this.xhrId) {
                delete xhrCallbacks[this.xhrId];
            }
            xhr_abort.call(this);
        }
    });

    return window.v2kit = window.v2 = v2;
});
