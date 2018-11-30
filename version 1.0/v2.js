/*!
 * JavaScript v2 v1.0.1
 * https://github.com/v2kit/v2
 *
 ** @author hyly
 ** @date 2018-08-01
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
        version = "1.0.1",
        rtrim = /^[\x20\t\r\n\f]+|[\x20\t\r\n\f]+$/g,
        core_trim = version.trim || function () {
            if (this == null) {
                throw new Error("Uncaught TypeError:String.prototype.trim called on null or undefined at trim.");
            }
            return String(this).replace(rtrim, "");
        };

    var
        core_arr = [],
        core_concat = core_arr.concat,
        core_push = core_arr.push,
        core_slice = core_arr.slice,
        core_splice = core_arr.splice,
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
    var
        support = {},
        class2type = {},
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty;

    var
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([a-z])/gi,
        fcamelCase = function (all, letter) {
            return letter.toUpperCase();
        };

    var
        rnotwhite = /\S+/g,
        makeMap = function (string, expectsLowerCase) {
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
                }
        };

    function noop() { }

    function cached(fn, expectsLowerCase) {
        var value, cache = {};
        return expectsLowerCase ? function (string) {
            value = cache[string.toLowerCase()];
            return value == null ? (cache[string.toLowerCase()] = fn.apply(cache, core_slice.call(arguments))) : value;
        } : function (string) {
            value = cache[string];
            return value == null ? (cache[string] = fn.apply(cache, core_slice.call(arguments))) : value;
        }
    }

    function initCached(initFn, fixFn, expectsLowerCase) {
        var value, cache = {};
        return expectsLowerCase ? function (string) {
            value = cache[string.toLowerCase()];
            var args = core_slice.call(arguments);
            return cache[string.toLowerCase()] = (value ? fixFn.apply(cache, core_concat.call([value], args)) : initFn.apply(cache, args));
        } : function (string) {
            value = cache[string.toLowerCase()];
            var args = core_slice.call(arguments);
            return cache[string] = (value ? fixFn.apply(cache, core_concat.call([value], args)) : initFn.apply(cache, args));
        };
    }
    function namespaceCached(objectCreate, objectCallback, namespaceCached, expectsLowerCase) {
        var cache = {},
            rtagEx = /^(?:[a-z]+(?:-[a-z]+)*)(-?Ex)$/i,
            rnamespace = /^([a-z]+(?:-[a-z]+)*\.(?:(?:[a-z]+(?:-[a-z]+)*|\*)\.)*)?([a-z]+(?:-[a-z]+)*|\*)$/i,
            namespaceRegExpCached = cached(expectsLowerCase ? function (string) {
                return new RegExp("^" + string.replace(/\./g, "\\.").replace(/\*/g, "([a-z]+(?:-[a-z]+)*|\\*)") + "$", "i");
            } : function (string) {
                return new RegExp("^" + string.replace(/\./g, "\\.").replace(/\*/g, "([a-z]+(?:-[a-z]+)*|\\*)") + "$");
            }, expectsLowerCase),
            cacheSetFn = function (namespace, string, options) {
                if (expectsLowerCase) {
                    namespace = namespace && namespace.toLowerCase();
                    string = string.toLowerCase();
                }
                if (!namespace && rtagEx.test(string)) {
                    namespace = namespaceCached(string.slice(0, -RegExp.$1.length));
                }
                namespaceCached(string, namespace = namespace ? namespace + "." + string : string);
                var cached = cache[namespace] || (cache[namespace] = {});
                return cached[string] ?
                    v2.isFunction(options) || v2.isFunction(cached[string]) ?
                        options :
                        v2.extend(cached[string], options) :
                    (cached[string] = options);
            },
            cacheGetFn = function (namespace, string) {
                var i, reg, match, cached;
                string = string || "*";
                if (string === "*" && namespace !== "*") {
                    reg = namespaceRegExpCached(namespace);
                    for (i in cache) {
                        if (reg.test(i)) {
                            return { string: i };
                        }
                    }
                }
                cached = cache[namespace] || {};
                if (cached[string]) {
                    return { string: string, value: cached[string] };
                }
                reg = namespaceRegExpCached(namespace);
                for (i in cached) {
                    if (reg.test(i)) {
                        return { string: i, value: cached[i] };
                    }
                }
            };
        return function (string, options) {
            var match;
            string = (string + "").replace(/[A-Z]/g, function (letter) {
                return '-' + letter.toLowerCase();
            });
            if (arguments.length < 2) {
                if (expectsLowerCase) string = string.toLowerCase();
                var namespace, results = objectCreate(string, options);
                while (match = rnamespace.exec(namespace = namespace || namespaceCached(string))) {
                    if (options = cacheGetFn(namespace, string = match[2])) {
                        if (string.toLowerCase() === options.string) {
                            namespace = match[1] && match[1].slice(0, -1);
                            objectCallback(results, options = options.value, string);
                        } else {
                            namespace = options.string;
                        }
                    }
                    if (!options || !namespace) {
                        string = namespace || string;
                        namespace = "*";
                    }
                    if (string === "*" && namespace === "*") break;
                }
                return results;
            }
            match = rnamespace.exec(string);
            if (match) {
                return cacheSetFn(match[1] && match[1].slice(0, -1), match[2], options);
            }
            throw new Error("string:" + string + ",Invalid class name space.");
        };
    }

    function isArraylike(obj) {
        if (obj == null) return false;
        var length = obj.length,
            type = v2.type(obj);

        if (type === "function" || type === "string" || v2.isWindow(obj)) {
            return false;
        }
        if (obj.nodeType === 1 && length) {
            return true;
        }
        try {
            return type === "array" || length === 0 || length > 0 && typeof length === "number" && (length - 1) in obj;
        } catch (_) {
            return false;
        }
    }
    /**
     * 控件入口
     * @param {String} tag
     * @param {JSON|Document} options
     * @returns {Object}
     */
    function v2(tag, options) {
        if (arguments.length === 1 && v2.isPlainObject(tag)) {
            options = tag;
            tag = options.tag;
        }
        if (options && options.nodeType) {
            options = { element: options };
        }
        return v2.factory(tag || "*", function (configs) {
            return new v2.fn.init(tag || "*", configs ? v2.improve(options, configs) : options);
        });
    }
    /**
     * 工厂
     * @param {String} tag
     * @param {Function} callback
     */
    v2.factory = function (tag, callback) {
        return callback();
    };
    var namespaceCache = namespaceCached(function () {
        return new Array();
    }, function (results, value, tag) {
        if (value) value.tag = tag;
        results.unshift(value);
    }, cached(function (_, namespace) { return namespace || ""; }, true), true);
    /**
     * 注册控件
     * @param {String} tag
     * @param {JSON} options
     */
    v2.register = function (tag, options) {
        if (arguments.length === 1 && v2.isPlainObject(tag)) {
            options = options || tag;
            tag = "*";
        }
        return namespaceCache(tag || "*", options);
    };
    var rquickExpr = /^((#|\.)?([\w-]*))$/;

    function destroyObject(obj, deep) {
        if (obj) {
            var key, value;
            for (key in obj) {
                value = obj[key];
                if (deep && value && (value !== obj)) {
                    if (value.destroy && value.version === version) {
                        value.destroy(deep);
                    } else if (v2.isPlainObject(value)) {
                        destroyObject(value, deep);
                    }
                }
                value = null;
            }
        }
    }
    function extendsObject(context) {
        var type,
            ctor,
            option,
            isFunction,
            options = {},
            variable = {},
            core_collect = {},
            namespace = "*",
            makeCallback = function (fn, key) {
                if (fn.context === context) return fn;
                var _base, _value, _fn = key in context.enumState ? function () {
                    _base = context.base;
                    context.base = _base.base;
                    if (context.enumState[key] > 1 && context.enumState[key] < 4) {
                        _value = fn.call(context, variable);
                    } else {
                        _value = fn.apply(context, arguments);
                    }
                    context.base = _base;
                    return _value;
                } : function () {
                    _base = context.base;
                    context.base = _base.base;
                    _value = fn.apply(context, arguments);
                    context.base = _base;
                    return _value;
                };
                _fn.context = context;
                return _fn;
            },
            extendsCallback = function (base, key, value) {
                if (base[key]) {
                    extendsCallback(base.base = base.base || {}, key, base[key]);
                }
                base[key] = makeCallback(value, key);
            },
            initControls = function (option) {
                if (option) {
                    type = v2.type(option);
                    if (type === "array") {
                        return v2.each(option, initControls);
                    }
                    if (isFunction = type === "function") {
                        namespace += "." + option.tag;
                        option = option(context, variable);
                    }
                    if (option && option.ctor && v2.isFunction(ctor = option.ctor)) {
                        ctor.call(context);
                    }
                    v2.each(option, function (value, key) {
                        if (key === "ctor") return;
                        type = v2.type(value);
                        if (type === "function") {
                            if (context[key]) {
                                core_collect[key] = value;
                                extendsCallback(context.base, key, context[key]);
                            }
                            options[key] = true;
                            context[key] = value;
                            if (key === "reflect") {
                                reflect = value;
                            }
                        } else if (type === "object" || type === "array") {
                            if (key in context) {
                                context[key] = (!context[key] || type === "array") ? value : v2.extend(true, value, context[key]);
                            } else if (value.nodeType) {
                                variable[key] = value;
                            } else {
                                variable[key] = variable[key] ?
                                    v2.improve(true, value, variable[key])
                                    :
                                    isFunction ?
                                        value :
                                        v2.extend(true, null, value);
                            }
                        } else if (type !== "undefined") {
                            if (key in context) {
                                if (key === "tag" && type === "string") {
                                    namespace += "." + value;
                                }
                                if (!context[key] || !(key in options ? options[key] : options[key] = v2.isFunction(context[key]))) {
                                    context[key] = value;
                                }
                            }
                            variable[key] = value;
                        }
                        if (isFunction) option[key] = undefined;
                    });
                    if (isFunction) option = undefined;
                }
            };
        v2.each(core_slice.call(arguments, 1), initControls);

        var base, value, core_base = context.base;
        v2.each(core_collect, function (fn, key) {
            context[key] = function () {
                base = context.base;
                context.base = core_base;
                value = fn.apply(context, core_slice.call(arguments));
                context.base = base;
                return value;
            };
        });
        try {
            Object.defineProperty(context, "limit", {
                writable: false,
                value: !!context.limit
            });
            Object.defineProperty(context, "namespace", {
                writable: false,
                value: namespace
            });
            Object.defineProperty(context, "variable", {
                value: variable,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (_) {
            context.variable = variable;
            context.namespace = namespace;
        }
        v2.removeAll(options);
        v2.removeAll(core_collect);
        options = core_collect = undefined;
        makeCallback = extendsCallback = initControls = undefined;
    }

    var enumState = {
        pending: 0.5,
        init: 1,
        render: 2,
        resolve: 4,
        commit: 8
    };
    function HTMLColection(tag) {
        var name = v2.camelCase(tag);
        var colection = (new Function(v2.format('return function {0}Colection(tag){ this.tag = tag; }', name.charAt(0).toUpperCase() + name.slice(1))))();
        colection.prototype = {
            constructor: colection,
            length: 0
        };
        return new colection(tag);
    };
    /**
     * 控件模型集合
     * @param {String} tag
     * @param {String} keyword
     */
    v2.GDir = function (tag, keyword) {
        tag = v2.camelCase(tag + "s");
        if (arguments.length < 2) return v2.GDir[tag];
        if (v2.isFunction(keyword)) {
            return v2.find(v2.GDir[tag], keyword);
        }
        return v2.find(v2.GDir[tag], function (control) {
            return control.keyword === keyword;
        });
    };
    var ajaxReady;
    var rtag = /^([a-z]+(-[a-z]+)*)$/i,
        rnative = /^[^{]+\{\s*\[native code/,
        rcssText = /^([+-/*]=)?([+-]?(?:[0-9]+\.)?[0-9]+)/i;
    v2.fn = v2.prototype = {
        constructor: v2,
        tag: "*",
        v2: version,
        limit: false,
        access: false,
        element: null,
        context: null,
        keyword: null,
        enumState: enumState,
        /**
         * 释放控件
         * @param {Boolean} deep
         */
        destroy: function (deep) {
            if (this.tag && rtag.test(this.tag)) {
                var collect = v2.GDir[v2.camelCase(this.tag + "s")],
                    index = v2.indexOf(collect, this);
                if (index > -1) {
                    core_splice.call(collect, index, 1);
                }
            }
            destroyObject(this.base, deep);
            destroyObject(this, deep);
        },
        /**
         * 显示控件
         */
        show: function () {
            return this.visible(true);
        },
        /**
         * 隐藏控件
         */
        hide: function () {
            return this.visible(false);
        },
        /**
         * 根据条件显示或隐藏控件。
         * @param {Boolean} toggle
         */
        toggle: function (toggle) {
            if (typeof toggle === "boolean") {
                return this.visible(toggle);
            }
            return this.visible(!this.variable.visible);
        },
        /**
         * 根据状态继续执行控件。
         * @param {String} state 控件状态
         * @param {Boolean} falseStop 方法返回false是停止。
         */
        whenThen: function (state, falseStop) {
            if (typeof state === "boolean") {
                falseStop = state;
                state = undefined;
            }
            var returnVal, isReady = true;
            falseStop = falseStop == null ? true : falseStop;
            for (state in this.enumState) {
                if (this.enumState[state] > this.enumState[this.state] >>> 0) {
                    i = this.enumState[state];
                    if (this[this.state = state] && v2.isFunction(this[state])) {
                        returnVal = this.enumState[state] > 1 && this.enumState[state] < 4 ? this[state](this.variable) : this[state]();
                        if (falseStop && (returnVal === false || this.sleep())) {
                            isReady = false; break;
                        }
                    }
                }
            }
            this.isReady = isReady;
        },
        /**
         * 禁用控件
         * @param {Boolean} disabled
         * @returns {Boolean}
         */
        disabled: function (disabled) {
            if (disabled != null) {
                v2.attr(this.disableElemet || this.element, "disabled", this.variable.disabled = !!disabled);
                return true;
            }
        },
        /**
        * 显示或隐藏控件
        * @param {Boolean} visible
        * @returns {Boolean}
        */
        visible: function (visible) {
            if (visible != null) {
                if (v2.isString(visible)) {
                    this.variable.visible = !(visible === "none");
                    v2.style(this.element, "display", visible);
                } else {
                    this.variable.visible = !!visible;
                    v2.style(this.element, "display", visible ? "block" : "none");
                }
                return true;
            }
        },
        /**
         * 设置控件宽度
         * @param {Number|String} width
         * @returns {Boolean}
         */
        width: function (width) {
            var match = rcssText.exec(width);
            if (match) {
                if (match[1]) {
                    try {
                        this.variable.width = (new Function("v", "return v" + match[1] + match[2]))(this.variable.width || this.element.css("width") >> 0);
                    } catch (_) {
                        return false;
                    }
                } else {
                    this.variable.width = +match[2];
                }
                v2.style(this.limitHorizontalElement || this.element, this.limit ? "max-width" : "width", this.variable.width);
                return true;
            }
        },
        /**
         * 设置控件宽度
         * @param {Number|String} height
         * @returns {Boolean}
         */
        height: function (height) {
            var match = rcssText.exec(height);
            if (match) {
                if (match[1]) {
                    try {
                        this.variable.height = (new Function("v", "return v" + match[1] + match[2]))(this.variable.height || v2.css(this.element, "height") >> 0);
                    } catch (_) {
                        return false;
                    }
                } else {
                    this.variable.height = +match[2];
                }
                v2.style(this.limitVerticalElement || this.element, this.limit ? "max-height" : "height", this.variable.height);
                return true;
            }
        },
        /**
         * 为控件主DOM对象class属性添加名为“value”的class。
         * @param {String} value
         */
        addClass: function (value) {
            v2.addClass(this.element, value);
        },
        /**
         * 删除控件主DOM对象class属性名为“value”的class。
         * @param {String} value
         */
        removeClass: function (value) {
            v2.removeClass(this.element, value);
        },
        /**
         * 控件主DOM对象class属性添加或删除名为“value”的class。
         * @param {String} value
         * @param {Boolean} toggle
         */
        toggleClass: function (value, toggle) {
            v2.toggleClass(this.element, value, toggle);
        },
        /**
         * 使控件主DOM对象获取焦点。 
         */
        focus: function () {
            try {
                this.element.focus();
            } catch (e) { }
        },
        /**
         * 调用控件方法
         * @param {Function|String} fn
         */
        invoke: function (fn) {
            var args, callbak;
            if (v2.isString(fn)) {
                callbak = this[fn];
                fn = this[v2.camelCase(fn)];
            }
            if (v2.isFunction(callbak || (callbak = fn))) {
                args = core_slice.call(arguments, 1);
                if (!fn || callbak === fn) {
                    return callbak.apply(this, args);
                }
                if (v2.isFunction(fn)) {
                    fn.apply(this, args);
                }
                return callbak.apply(this, args);
            }
        },
        /**
         * 函数代理
         * @param {Object} context callback方法的this对象。
         * @param {Function} callback
         */
        proxy: function (context, callback) {
            if (arguments.length === 1) {
                callback = context;
                context = null;
            }
            return v2.proxy(context || this, callback);
        },
        baseConfigs: function (object, context) {
            object = object || this;
            context = context || this;
            object.base = object.base || {};
            object.init = function (tag) {
                if (context.context) {
                    context.context = this.jqueryEx(context.context, window.document);
                }
                context.context = context.context || window.document.body;
                if (context.element) {
                    context.element = this.jqueryEx(context.element, context.context);
                }
                if (context.element) {
                    if (!v2.nodeName(context.element, tag)) {
                        context.context = context.element;
                        context.element = null;
                    }
                }
                if (!context.element) {
                    context.element = this.jqueryEx(context.context.appendChild(window.document.createElement(tag || "div")));
                } else {
                    context.context = context.element.parentNode;
                }
                return context.element;
            };
        },
        init: function (tag, options) {
            this.tag = tag;
            this.baseConfigs();
            var baseConfig = namespaceCache(tag);
            extendsObject(this, baseConfig, options);
            var type, timer, isAsync, sleep = false, my = this, ajax = this.ajax, render = this.render, callbacks = [];
            if (ajax) {
                if (this.access) {
                    if (!ajaxReady && v2.isFunction(jQuery)) {
                        ajaxReady = jQuery.ajax;
                        jQuery.ajax = function (url, options) {
                            type = v2.type(url);
                            if (type === "object") {
                                options = url;
                                url = options.url;
                            }
                            isAsync = !options || options.async || options.async === undefined;
                            return ajaxReady.call(this, url, options);
                        };
                    }
                    this.render = function () {
                        var value = render.apply(this, core_slice.call(arguments));
                        this.sleep(function () {
                            my.ajax();
                            if (isAsync) {
                                this.sleep(true);
                            }
                        });
                        return value;
                    };
                }
            }
            /**
             * 控件沉睡
             * @param {Number|Boolean|Function} v
             */
            this.sleep = function (v) {
                if (arguments.length > 0) {
                    type = v2.type(v);
                    if (type === "boolean") {

                        v = ~~sleep + ~~v;
                        sleep = !!(v - ~~sleep);
                        v = !!(v - ~~sleep);

                        if (v && !sleep) {
                            my.whenThen();
                            while (v = callbacks.shift()) {
                                v.call(my, my);
                            }
                        }
                        return v === sleep;
                    }
                    if (type === "function") {
                        if (sleep) {
                            callbacks.push(v);
                        } else {
                            v.call(my, my);
                        }
                    }
                    if (type === "number") {
                        sleep = true;
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            sleep = false;
                            my.whenThen();
                            while (v = callbacks.shift()) {
                                v.call(my, my);
                            }
                        }, v);
                    }
                }
                return sleep;
            }
            this.whenThen();
        },
        /**
         * 控件相关属性设置
         * @param {JSON} variable 非构造函数属性或方法集合。
         */
        render: function (variable) {
            if (this.tag && rtag.test(this.tag)) {
                var tag = v2.camelCase(this.tag);
                this.element[tag] = this;
                v2.GDir[tag + "s"] = v2.merge(v2.GDir[tag + "s"] || HTMLColection(this.tag), [this]);
            }
            v2.each(this.namespace.match(/[^\.]+/g), function (tag) {
                if (rtag.test(tag)) {
                    this.addClass("v2-" + tag);
                }
            }, this);

            if (variable.addClass) {
                this.addClass(variable.addClass);
            }
            this.disabled(variable.disabled);

            this.visible(variable.visible);

            if (variable.width) {
                this.width(variable.width);
            }
            if (variable.border) {
                var border = variable.border, type = v2.type(variable.border);
                switch (type) {
                    case "boolean": border = this.tag + "-bordered";
                    case "string":
                        this.addClass(border);
                        break;
                    case "number": border = [border, "solid", "#ccc"];
                    case "array":
                    case "object":
                        v2.each(border, type === "object" ? function (value, key) {
                            v2.style(this.element, "border-" + key, value);
                        } : function (value) {
                            if (rtag.test(value)) {
                                v2.style(this.element, "border-style", value);
                            } else if (rcssText.test(value)) {
                                v2.style(this.element, "border-width", value);
                            } else {
                                v2.style(this.element, "border-color", value);
                            }
                        });
                        break;
                }
            }
            if (variable.height) {
                this.height(variable.height);
            }

            if (variable.focus) {
                this.focus();
            }
        }
    };
    v2.fn.init.prototype = v2.fn;
    /**
     * 获取对象数据类型
     * @param {any} obj
     * @param {String}
     */
    v2.type = function (obj) {
        return obj == null ? String(obj) : (typeof obj === "object" || typeof obj === "function") ? class2type[core_toString.call(obj)] || "object" : typeof obj;
    };
    /**
     * 继承关系
     * @param {Function} fn
     * @param {Array<Function>|Array<JSON>|Array<Array>} args
     * @returns {Function|JSON|Array}
     */
    v2.extension = function (fn, args) {
        if (arguments.length === 1) {
            args = fn;
            fn = undefined;
        }
        var isArray, k, type, value, deep = false,
            configs, options, i = 1,
            len = args.length,
            target = args[0];
        if (typeof target === "boolean") {
            deep = target;
            target = args[i++];
        }
        if (i === len) {
            i--; target = this;
        }
        var setConfigs = function (key) {
            value = options[key];
            configs = target[key];
            if (!(value === configs || value === undefined)) {
                if (value && deep && ((isArray = v2.isArray(value)) || v2.isPlainObject(value))) {
                    target[key] = v2.extension(fn, [deep, configs || (isArray ? [] : {}), value]);
                } else {
                    if (!fn || (value = fn(value, key, target)) !== undefined) {
                        target[key] = value;
                    }
                }
            }
        };
        for (; i < len; i++) {
            if ((options = args[i]) != null) {
                type = v2.type(options);
                if (type === "boolean") {
                    deep = options;
                    continue;
                }
                if (target == null) {
                    target = type === "array" ? [] : {};
                }
                for (k in options) {
                    setConfigs(k);
                }
            }
        }
        return target;
    };
    var improveCallbak = function (value, key, options) {
        if (options[key] == null) {
            return value;
        }
    };
    /**
     * 强继承
     * @example v2.extend({a:1,b:2},{a:2})  => {a:2,b:2}
     */
    v2.extend = v2.fn.extend = function () {
        return v2.extension.call(this, arguments);
    };
    /**
     * 弱继承
     * @example v2.improve({a:1,b:2},{a:2}) => {a:1,b:2}
     */
    v2.improve = v2.fn.improve = function () {
        return v2.extension.call(this, improveCallbak, arguments);
    };
    v2.extend({
        debug: true,
        /**
         * 调试模式控制台打印消息
         * @param {String} msg
         */
        log: function (msg) {
            if (v2.debug) {
                (console.error || console.log)(msg);
            }
        },
        /**
         * 函数代理
         * @param {Object} context fn方法的this对象。
         * @param {Function} fn
         */
        proxy: function (context, fn) {
            if (arguments.length === 1) {
                fn = context;
                context = null;
            }
            return function () {
                return fn.apply(context || this, core_slice.call(arguments));
            };
        },
        hasOwn: core_hasOwn,
        /**
         * 判断对象或数组中是否包含满足iterator的值。
         * @param {JSON|Array|ArrayLike} data
         * @param {Function|Object} iterator
         * @param {Object} context iterator为函数时的上下文。
         * @returns {Boolean}
         * @example v2.has([1,2,3],1) => true
         * @example v2.has([1,2,3],function(item){ return item > 2; }) => true
         */
        has: function (data, iterator, context) {
            if (!data) return false;
            var i = 0, isFunction = v2.isFunction(iterator);
            if (isArraylike(data)) {
                for (var len = data.length; i < len; i++) {
                    if (isFunction ? iterator.call(context || data, data[i], i, data) : data[i] === iterator) {
                        return true;
                    }
                }
            } else {
                for (i in data) {
                    if (isFunction ? iterator.call(context || data, data[i], i, data) : data[i] === iterator) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * 在对象或数组中查找满足iterator的值。
         * @param {JSON|Array|ArrayLike} data
         * @param {Function|Object} iterator
         * @param {Object} context iterator为函数时的上下文。
         * @returns {any}
         * @example v2.find([1,2,3],function(item){ return item > 2; }) => 3
         */
        find: function (data, iterator, context) {
            if (!data || !iterator) return null;
            var i = 0;
            if (isArraylike(data)) {
                for (var len = data.length; i < len; i++) {
                    if (iterator.call(context || data, data[i], i, data)) {
                        return data[i];
                    }
                }
            } else {
                for (i in data) {
                    if (iterator.call(context || data, data[i], i, data)) {
                        return data[i];
                    }
                }
            }
        },
        /**
         * 判断对象或数组，是否所有值都满足iterator。
         * @param {JSON|Array|ArrayLike} data
         * @param {Function} iterator
         * @param {Object} context iterator为函数时的上下文。
         * @returns {Boolean}
         * @example v2.every([1,2,3],function(item){ return item > 0; }) => true
         */
        every: function (data, iterator, context) {
            if (!data || !iterator) return false;
            var i = 0;
            if (isArraylike(data)) {
                for (var len = data.length; i < len; i++) {
                    if (!iterator.call(context || data, data[i], i, data)) {
                        return false;
                    }
                }
            } else {
                for (i in data) {
                    if (!iterator.call(context || data, data[i], i, data)) {
                        return false;
                    }
                }
            }
            return true;
        },
        /**
         * 在对象或数组中查找满足iterator的所有值。
         * @param {JSON|Array|ArrayLike} data
         * @param {Function} iterator
         * @param {Object} context iterator为函数时的上下文。
         * @returns {Array}
         * @example v2.filter([1,2,3],function(item){ return item > 1; }) => [2,3]
         */
        filter: function (data, iterator, context) {
            if (!data || !iterator) return data;
            var i = 0;
            if (isArraylike(data)) {
                var arr = [];
                for (var len = data.length; i < len; i++) {
                    if (iterator.call(context || data, data[i], i, data)) {
                        arr.push(data[i]);
                    }
                }
                return arr;
            }
            var obj = {};
            for (i in data) {
                if (iterator.call(context || data, data[i], i, data)) {
                    obj[i] = data[i];
                }
            }
            return obj;
        },
        /**
         * 将arr的值合并到results中。
         * @param {Array|ArrayLike} results
         * @param {Array|ArrayLike} arr
         * @returns {Array|ArrayLike}
         * @example v2.merge([1,2,3],[1,2]) => [1,2,3,1,2]
         */
        merge: function (results, arr) {
            var l = arr.length,
                i = results.length,
                j = 0;

            if (typeof l === "number") {
                for (; j < l; j++) {
                    results[i++] = arr[j];
                }
            } else {
                while (second[j] !== undefined) {
                    results[i++] = arr[j++];
                }
            }

            results.length = i;

            return results;
        },
        /**
         * 向数组的指定位置插入数据。
         * @param {Array|ArrayLike} array
         * @param {Number} index
         * @param {any} data
         * @example v2.insertAt([0,2,3],1,1) => data => [0,1,2,3]
         */
        insertAt: function (array, index, data) {
            core_splice.call(array, index, 0, data);
        },
        /**
         * 删除对象或数组指定位置或属性的值。
         * @param {JSON|Array|ArrayLike} data
         * @param {Number|String} index
         * @example v2.removeAt([0,1,2,1],3) => data => [0,1,2]
         * @example v2.removeAt({a:1,b:2},"a") => data => {b:2}
         */
        removeAt: function (data, index) {
            if (!data) return data;
            if (isArraylike(data)) {
                core_splice.call(data, index, 1);
            } else {
                if (support.deleteEx) {
                    delete data[index];
                } else {
                    data[index] = undefined;
                }
            }
        },
        /**
         * 删除对象或数组满足条件的位置或属性的值。
         * @param {JSON|Array|ArrayLike} data
         * @param {Function} iterator 为设置时删除所有。
         * @param {any} context
         * @example v2.removeAll([0,1,2,1],function(item){ return item < 2;}) => data => [2]
         * @example v2.removeAt({a:1,b:2}) => data => {}
         */
        removeAll: function (data, iterator, context) {
            if (!data) return null;
            var i = 0;
            if (isArraylike(data)) {
                for (var len = data.length; i < len; i++) {
                    if (!iterator || iterator.call(context || data, data[i], i, data)) {
                        core_splice.call(data, i, 1);
                    }
                }
            } else {
                for (i in data) {
                    if (!iterator || iterator.call(context || data, data[i], i, data)) {
                        if (support.deleteEx) {
                            delete data[i];
                        } else {
                            data[i] = undefined;
                        }
                    }
                }
            }
        },
        /**
         * 装置数组
         * @param {any} arr
         * @param {Array|ArrayLike} results
         * @returns {Array|ArrayLike}
         * @example v2.makeArray("1") => ["1"]
         * @example v2.makeArray("1",["0","1","2"]) => ["0","1","2","1"]
         * @example v2.makeArray(["1","2"],["0","1","2"]) => ["0","1","2","1","2"]
         */
        makeArray: function (arr, results) {
            results = results || [];
            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    v2.merge(results, arr);
                } else {
                    core_push.call(results, arr);
                }
            }
            return results;
        },
        /**
         * 指定项在对象中的位置。
         * @param {Array|JSON} data
         * @param {Number} item
         * @param {Number} from
         * @example v2.indexOf([1,2,3,2,4],2) => 1
         * @example v2.indexOf([1,2,3,2,4],2,2) => 3
         * @example v2.indexOf({a:1,b:2},2) => "b"
         */
        indexOf: function (data, item, from) {
            if (!data) return -1;
            if (isArraylike(data)) {
                return core_indexOf.apply(data, item, from);
            }
            for (var i in data) {
                if (data[i] === item) return i;
            }
        },
        /**
         * 遍历数组或对象。
         * @param {Array|JSON} data
         * @param {Function} iterator
         * @param context
         * @returns {Array|JSON}
         */
        each: function (data, iterator, context) {
            if (!data || !iterator) return data;
            var i = 0;
            if (isArraylike(data)) {
                for (var len = data.length; i < len; i++) {
                    if (iterator.call(context || data, data[i], i, data) === false) {
                        break;
                    }
                }
            } else {
                for (i in data) {
                    if (iterator.call(context || data, data[i], i, data) === false) {
                        break;
                    }
                }
            }
            return data;
        },
        /**
         * 遍历对象，返回函数返回值的所有非Null项。
         * @param {Array|JSON} data
         * @param {Function} iterator
         * @returns {Array}
         */
        map: function (data, iterator, context) {
            var arr = [];
            if (!data || !iterator) return arr;
            var value, i = 0;
            if (isArraylike(data)) {
                for (var len = data.length; i < len; i++) {
                    value = iterator.call(context || data, data[i], i, data);
                    if (value != null) {
                        arr.push(value);
                    }
                }
            } else {
                for (i in data) {
                    value = iterator.call(context || data, data[i], i, data);
                    if (value != null) {
                        arr.push(value);
                    }
                }
            }
            return arr;
        }
    });
    v2.extend({
        noop: noop,
        /**
         * 异常
         * @param {String} msg
         */
        error: function (msg) {
            throw new Error(msg);
        },
        /**
         * 语法异常
         * @param {String} msg
         */
        syntaxError: window.SyntaxError ? function (msg) {
            throw new SyntaxError("Unrecognized expression: " + msg);
        } : function (msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        },
        /**
         * 去除字符串首尾的空格
         * @param {String} string
         * @returns {String}
         * @example v2.trim(" I love you. ") => "I love you."
         */
        trim: function (string) {
            return string == null ? "" : core_trim.call(string);
        },
        /**
         * 执行javascript代码。
         * @param {String} code
         */
        globalEval: function (code) {
            var script;
            if (code = v2.trim(code)) {
                if (code.indexOf("use strict") === 1) {
                    script = document.createElement("script");
                    script.text = code;
                    document.head.appendChild(script).parentNode.removeChild(script);
                } else {
                    (window.execScript || function (code) {
                        window["eval"].call(window, code);
                    })(code);
                }
            }
        },
        /**
         * 判断DOM对象的nodeName是否和tag匹配，不区分大小写。
         * @param {Document} elem 
         * @param {String} tag 
         * @returns {Boolean}
         */
        nodeName: function (elem, tag) {
            return !!elem && !!elem.nodeName && (!tag || tag === "*" || elem.nodeName.toLowerCase() === tag.toLowerCase());
        },
        /**
         * 小驼峰
         * @param {String} string
         * @returns {String}
         * @example v2.camelCase("border-left-width") => "borderLeftWidth"
         * @example v2.camelCase("-ms-box-shadow") => "msBoxShadow"
         */
        camelCase: cached(function (string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        })
    });
    v2.extend({
        /**
         * 排断字符串是否为空
         * @param {String} string
         * @returns {Boolean}
         */
        isEmpty: function (string) {
            return !string;
        },
        /**
         * 判断对象是不是window对象
         * @returns {Boolean}
         */
        isWindow: function (obj) {
            return obj != null && obj.window == obj;
        },
        /**
         * 判断对象是不是数字
         * @returns {Boolean}
         */
        isNumber: function (obj) {
            return !!obj && (obj - parseFloat(obj) >= 0);
        },
        /**
         * 判断对象是不是字符串
         * @returns {Boolean}
         */
        isString: function (obj) {
            return v2.type(obj) === "string";
        },
        /**
         * 判断对象是不是方法
         * @returns {Boolean}
         */
        isFunction: function (obj) {
            return v2.type(obj) === "function";
        },
        /**
         * 判断对象是不是空对象
         * @returns {Boolean}
         * true=》该对象为空，false=》该对象非空；
         */
        isEmptyObject: function (obj) {
            for (var i in obj) {
                return false;
            }
            return true;
        },
        /**
         * 判断对象是否满足ArrayLike
         * @returns {Boolean}
         */
        isArraylike: isArraylike,
        /**
         * 判断对象是不是数组
         * @returns {Boolean}
         */
        isArray: Array.isArray || function (obj) {
            return v2.type(obj) === "array";
        },
        /**
         * 判断对象是不是简单对象
         * @returns {Boolean}
         */
        isPlainObject: function (obj) {
            if (!obj || v2.type(obj) !== "object" || obj.nodeType || v2.isWindow(obj)) {
                return false;
            }
            try {
                if (obj.constructor &&
                    !core_hasOwn.call(obj, "constructor") &&
                    !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            var key;
            for (key in obj) { }
            return key === undefined || core_hasOwn.call(obj, key);
        }
    });
    v2.extend({
        /**
         * 制作Map函数
         * @param {String} string
         * @returns {Function}
         * @example var typeMap = v2.makeMap("isValid isCommon") => typeMap("isValid") => true
         */
        makeMap: makeMap,
        /**
         * 制作缓存
         * @param {Function} fn 
         * @param {Function|Boolean} fn2 
         * @param {Function|Boolean} fn3 
         * @param {Boolean} expectsLowerCase 
         */
        makeCache: function (fn, fn2, fn3, expectsLowerCase) {
            if (fn3 && v2.isFunction(fn3)) {
                return namespaceCached(fn, fn2, fn3, expectsLowerCase);
            }
            if (fn2 && v2.isFunction(fn2)) {
                return initCached(fn, fn2, expectsLowerCase);
            }
            return cached(fn, expectsLowerCase || fn2);
        }
    });
    /**
     * 回调函数集合
     * @param {String} string
     * @returns {JSON}
     */
    v2.Callbacks = function (string) {
        var check = v2.makeMap(string + "");
        var
            firing,
            memory,
            fired,
            current,
            list = [],
            backCount = 0,
            headCount = 0,
            stack = check("stack") && [],
            fire = function (data) {
                memory = check("memory") && data;
                fired = firing = true;
                while (list && (current = list.shift())) {
                    if (current.apply(data[0], data[1]) === false && check("stopOnFalse")) {
                        break;
                    }
                }
                firing = false;
                if (list) {
                    if (stack) {
                        if (stack.length) {
                            fire(stack.shift());
                        }
                    } else if (memory) {
                        list = [];
                    } else {
                        self.disable();
                    }
                }
            },
            add = function (arg, context, modal) {
                if (list) {
                    (function add(args) {
                        v2.each(args, function (arg) {
                            var type = v2.type(arg);
                            if (type === "function") {
                                if (!check("unique") || !self.has(arg)) {
                                    if (modal === "head" || modal === "head-reverse") {
                                        list.splice(modal === "head" ? headCount : 0, 0, function () {
                                            headCount -= 1;
                                            arg.apply(this, core_slice.call(args));
                                        });
                                        headCount += 1;
                                    } else if (modal === "back" || modal === "back-reverse") {
                                        var callback = function () {
                                            backCount -= 1;
                                            arg.apply(this, core_slice.call(args));
                                        };
                                        if (modal === "back") {
                                            list.push(callback);
                                        } else {
                                            list.splice(list.length - backCount, 0, callback);
                                        }
                                        backCount += 1;
                                    } else {
                                        if (backCount) {
                                            list.splice(list.length - backCount, 0, arg);
                                        } else {
                                            list.push(arg);
                                        }
                                    }
                                }
                            } else if (arg && arg.length && type !== "string") {
                                add(arg);
                            }
                        });
                    })(arguments);
                    if (!firing && memory) {
                        fire(memory);
                    }
                }
                return context;
            },
            self = {
                add: function () {//介于head和back之间，顺序添加
                    return add(arguments, this);
                },
                addBack: function () {//始终添加到back的最后一个
                    return add(arguments, this, "back");
                },
                addBackReverse: function () {//始终添加到back的第一个
                    return add(arguments, this, "back-reverse");
                },
                addHead: function () {//始终添加到head的第一个
                    return add(arguments, this, "head");
                },
                addHeadReverse: function () {//始终添加到head的最后一个
                    return add(arguments, this, "head-reverse");
                },
                remove: function () {
                    if (list) {
                        v2.each(arguments, function (arg) {
                            var index;
                            while ((index = v2.indexOf(list, arg, index)) > -1) {
                                list.splice(index, 1);
                            }
                        });
                    }
                    return this;
                },
                has: function (fn) {
                    return fn ? v2.has(list, fn) : !!(list && list.length);
                },
                empty: function () {
                    list = [];
                    return this;
                },
                disable: function () {
                    list = stack = memory = undefined;
                    return this;
                },
                disabled: function () {
                    return !list;
                },
                lock: function () {
                    stack = undefined;
                    if (!memory) {
                        self.disable();
                    }
                    return this;
                },
                locked: function () {
                    return !stack;
                },
                go: function () {
                    self.add(arguments);
                },
                fireWith: function (context, args) {
                    args = args || [];
                    args = [context, args.slice ? args.slice() : args];
                    if (list && (!fired || stack)) {
                        if (firing) {
                            stack.push(args);
                        } else {
                            fire(args);
                        }
                    }
                    return this;
                },
                fire: function () {
                    self.fireWith(this, arguments);
                    return this;
                },
                fired: function () {
                    return !!fired;
                }
            };

        return self;
    };

    var docElem = window.document.documentElement;
    /**
     * 判断context对象是否包含node对象
     * @param {Document} context
     * @param {Document} node
     * @returns {Boolean}
     */
    v2.contains = (docElem.contains || docElem.compareDocumentPosition) ? function (context, node) {
        var adown = context.nodeType === 9 ? context.documentElement : context,
            bup = node && node.parentNode;
        return context === bup || !!(bup && bup.nodeType === 1 && (
            adown.contains ?
                adown.contains(bup) :
                context.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
        ));
    } : function (context, node) {
        if (node) {
            while (node = node.parentNode) {
                if (node === context) {
                    return true;
                }
            }
        }
        return false;
    };
    v2.each(["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error"], function (item) {
        class2type["[object " + item + "]"] = item.toLowerCase();
    });

    var rformat = /\{([0-9]+)\}/gm;
    var replaceCache = cached(function (i) {
        return roperation.test(i) ? function (_, v) {
            return (new Function("return " + v + i))();
        } : function (_, v) {
            return (~~v + i);
        };
    });
    var roperation = /^[+-/*]/;
    var replaceCacheBrace = cached(function (i) {
        var fn = replaceCache(i);
        return function () {
            return "{" + (fn.apply(this, core_slice.call(arguments))) + "}";
        };
    });

    var
        runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
        funescape = function (_, escaped) {
            var high = "0x" + escaped - 0x10000;
            return high === high ?
                high < 0 ?
                    String.fromCharCode(high + 0x10000) :
                    String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00) :
                escaped;
        };
    var
        whitespace = "[\\x20\\t\\r\\n\\f]",
        classCache = cached(function (className) {
            return new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)");
        });
    var
        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        identifier = characterEncoding.replace("w", "w#"),
        rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
        rcombinators = new RegExp("^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*"),
        attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
            "*(?:([*^$|!~%]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\{3}|(" + identifier + ")|)|)" + whitespace + "*\\]",
        pseudos = ":(focus|root|empty|target|enabled|disabled|checked|lang(?:\\(([\\w-]+)\\))|(is|not|has)(?:\\(" + whitespace + "*([#|\\.]?(" + characterEncoding + ")|" + attributes.replace(rformat, replaceCache(5)) + ")" + whitespace + "*\\)))",
        matchExpr = {
            "ID": new RegExp("^#(" + characterEncoding + ")"),
            "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
            "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
            "ATTR": new RegExp("^" + attributes.replace(rformat, replaceCache(0))),
            "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            "PSEUDO": new RegExp("^" + pseudos)
        },
        tokenCache = cached(function (selector) {
            var type, match, tokens, matched, groups = [], string = selector, preFilter = jqueryEx.preFilter;
            while (string) {
                if (!matched || (match = rcomma.exec(string))) {
                    if (match) {
                        string = string.slice(match[0].length) || string;
                    }
                    groups.push(tokens = []);
                }
                matched = false;
                if ((match = rcombinators.exec(string))) {
                    matched = match.shift();
                    tokens.push({
                        value: core_trim.call(matched),
                        type: match[0].replace(rtrim, " ")
                    });
                    string = string.slice(matched.length);
                }
                for (type in jqueryEx.filter) {
                    if ((match = matchExpr[type].exec(string)) && (!preFilter[type] || (match = preFilter[type](match)))) {
                        matched = match.shift();
                        tokens.push({
                            value: core_trim.call(matched),
                            type: type,
                            matches: match
                        });
                        string = string.slice(matched.length);
                    }
                }
                if (!matched) {
                    break;
                }
            }
            return string ? v2.syntaxError(string) : groups;
        });
    function tokenize(selector) {
        return v2.map(tokenCache(selector), function (tokens) {
            return core_slice.call(tokens, 0);
        });
    }
    var elementMatcher = function (matchers) {
        return matchers.length > 1 ? function (elem, context) {
            var i = matchers.length;
            while (i--) {
                if (!matchers[i](elem, context)) {
                    return false;
                }
            }
            return true;
        } : matchers[0];
    };

    function addCombinator(matcher, combinator, base) {
        var dir = combinator.dir,
            checkNonElements = base && dir === "parentNode";

        return combinator.first ?
            function (elem, context) {
                while ((elem = elem[dir])) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        return matcher(elem, context);
                    }
                }
            } :
            function (elem, context) {
                while ((elem = elem[dir])) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        if (matcher(elem, context)) {
                            return true;
                        }
                    }
                }
            };
    }

    function matcherFromTokens(tokens) {
        var checkContext, matcher,
            len = tokens.length,
            leadingRelative = jqueryEx.relative[tokens[0].type],
            implicitRelative = leadingRelative || jqueryEx.relative[" "],
            i = leadingRelative ? 1 : 0,
            matchContext = addCombinator(function (elem) {
                return elem === checkContext;
            }, implicitRelative, true),
            matchAnyContext = addCombinator(function (elem) {
                return core_indexOf.call(checkContext, elem) > -1;
            }, implicitRelative, true),
            matchers = [function (elem, context) {
                return (checkContext = context).nodeType ?
                    matchContext(elem, context) :
                    matchAnyContext(elem, context);
            }];
        for (; i < len; i++) {
            if ((matcher = jqueryEx.relative[tokens[i].type])) {
                matchers = [addCombinator(elementMatcher(matchers), matcher)];
            } else {
                matchers.push(jqueryEx.filter[tokens[i].type].apply(null, tokens[i].matches));
            }
        }
        return elementMatcher(matchers);
    }

    function matcherFromGroupMatchers(matcher, matcherAll) {
        return function (context, target) {
            var elem, results = target ?
                [target]
                : matcherAll ?
                    matcherAll(context)
                    : context.getElementsByTagName("*");
            for (var i = 0; elem = results[i]; i++) {
                if (elem.nodeType === 1 && matcher(elem, context)) {
                    return !!target || elem;
                }
            }
        }
    }

    function returnTrue() {
        return true;
    }

    function toSelector(tokens) {
        var
            i = 0,
            selector = "",
            len = tokens.length;
        for (; i < len; i++) {
            selector += tokens[i].value;
        }
        return selector;
    }
    var elementMatcherFilter = function (matchers) {
        return matchers.length > 1 ? function (elem, context) {
            var i = matchers.length;
            while (i--) {
                if (matchers[i](elem, context)) {
                    return true;
                }
            }
            return false;
        } : matchers[0];
    };
    var queryCache = cached(function (selector) {
        var matchers = [],
            groups = tokenize(selector),
            i = groups.length;
        if (i === 1) {
            var token, matcher, tokens = groups[0];
            if (matcher = jqueryEx.find[tokens[0].type]) {
                token = tokens.shift();
            }
            var all = tokens.length > 0;
            return matcherFromGroupMatchers(all ? matcherFromTokens(tokens) : returnTrue, matcher && function (context) {
                return matcher(token.value, context, all);
            });
        }
        while (i--) {
            matchers.push(matcherFromTokens(groups[i]));
        }
        return matcherFromGroupMatchers(elementMatcherFilter(matchers));
    });

    function makeFunction(fn) {
        return function () {
            return fn;
        };
    }

    var jqueryEx = function (selector, context) {
        if (!selector) return null;
        if (typeof selector === "string") {
            if (context && !context.nodeType) {
                if (context.v2 === version) {
                    context = context.element;
                }
                if (context.jquery) {
                    context = context.get(0);
                }
            }
            context = context || window.document;
            var match = rquickExpr.exec(selector);
            if (match) {
                return jqueryEx.find[match[2] ? match[2] === "#" ? "ID" : "CLASS" : "TAG"](match[3], context);
            }
            return jqueryEx.query(selector, context);
        }
        if (selector) {
            if (selector.nodeType === 1) return selector;
            if (selector.jquery) return selector.get(0);
            if (selector.v2 === version) return selector.element;
        }
    };
    var check = function (callback, tag) {
        var elem = document.createElement(tag || "div");
        try {
            return !!callback(elem);
        } catch (_) {
            return false;
        } finally {
            if (elem && elem.parentNode) {
                elem.parentNode.removeChild(elem);
            }
        }
    };
    var rescape = /'|\\/g;
    var rsibling = /[\x20\t\r\n\f]*[+~]/;
    var rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g;
    var matches, matchesSelector, querySelector, disconnectedMatch, rbuggyMatches = [], rbuggyQSA = [":focus"];
    if (querySelector = rnative.test(document.querySelector)) {
        check(function (div) {
            div.innerHTML = "<select><option selected=''></option></select>";
            if (!div.querySelector("[selected]")) {
                rbuggyQSA.push("\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)");
            }
            if (!div.querySelector(":checked")) {
                rbuggyQSA.push(":checked");
            }
        });
        check(function (div) {
            div.innerHTML = "<input type='hidden' i=''/>";
            if (div.querySelectorAll("[i^='']").length) {
                rbuggyQSA.push("[*^$]=" + whitespace + "*(?:\"\"|'')");
            }
            if (!div.querySelectorAll(":enabled").length) {
                rbuggyQSA.push(":enabled", ":disabled");
            }
            div.querySelector("*,:x");
            rbuggyQSA.push(",.*:");
        });
    }
    if (matchesSelector = rnative.test(matches = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
        check(function (div) {
            disconnectedMatch = matches.call(div, "div");
            matches.call(div, "[s!='']:x");
            rbuggyMatches.push("!=", pseudos);
        });
    }
    rbuggyQSA = new RegExp(rbuggyQSA.join("|"));
    rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

    var expando = "v2_" + (+new Date());
    v2.extend(jqueryEx, {
        relative: {
            ">": {
                dir: "parentNode",
                first: true
            },
            " ": {
                dir: "parentNode"
            },
            "+": {
                dir: "previousSibling",
                first: true
            },
            "~": {
                dir: "previousSibling"
            }
        },
        find: {
            "ID": function (id, context, all) {
                var node, elem;
                if (all) {
                    var i = 0,
                        results = [],
                        filter = jqueryEx.filter["ID"](id),
                        nodes = jqueryEx.find["TAG"]("*", context, all);
                    while (node = nodes[i++]) {
                        if (filter(node)) {
                            results.push(node);
                        }
                    }
                    return results;
                }
                if (context.getElementById) {
                    elem = context.getElementById(id);
                    if (elem && elem.parentNode) return elem;
                } else {
                    node = elem = window.document.getElementById(id);
                    while (node = node && node.parentNode) {
                        if (node === context) return elem;
                    }
                }
            },
            "TAG": function (tag, context, all) {
                if (tag) {
                    tag = tag.toLowerCase();
                }
                var results = all && [];
                if (all && context.getElementsByTagName) {
                    var node, i = 0,
                        tmp = context.getElementsByTagName(tag);
                    if (tag === "*") {
                        while (node = tmp[i++]) {
                            if (node.nodeType === 1) {
                                results.push(node);
                            }
                        }
                        return results;
                    }
                    return v2.merge([], tmp);
                }
                for (var node, elem = context.firstChild; elem; elem = elem.nextSibling) {
                    if (elem.nodeType === 1 && v2.nodeName(elem, tag)) {
                        if (all) {
                            results.push(elem);
                        } else {
                            return elem;
                        }
                    }
                    if (elem.childNodes && elem.childNodes.length > 0) {
                        if (node = jqueryEx.find["TAG"](tag, elem, all)) {
                            if (all) {
                                core_concat.apply(results, node);
                            } else {
                                return node;
                            }
                        }
                    }
                }
                return results;
            },
            "CLASS": function (className, context, all) {
                var results = all && [];
                if (all && context.getElementsByClassName) {
                    try {
                        return core_concat.apply(results, core_slice.call(context.getElementsByClassName(core_trim.call(className)), 0)), results;
                    } catch (_) { }
                }
                var pattern = classCache(className);
                for (var node, elem = context.firstChild; elem; elem = elem.nextSibling) {
                    if (elem.nodeType === 1 && pattern.test(elem.className)) {
                        if (all) {
                            results.push(elem);
                        } else {
                            return elem;
                        }
                    }
                    if (elem.childNodes && elem.childNodes.length > 0) {
                        if (node = jqueryEx.find["CLASS"](className, elem, all)) {
                            if (all) {
                                core_concat.apply(results, node);
                            } else {
                                return node;
                            }
                        }
                    }
                }
                return results;
            }
        },
        filter: {
            "ID": function (id) {
                id = id.replace(runescape, unescape);
                return function (elem) {
                    return elem.id === id || elem.getAttribute("id") === id;
                }
            },
            "TAG": function (tag) {
                if (tag === "*") {
                    return function () {
                        return true;
                    };
                }
                tag = tag.replace(runescape, funescape).toLowerCase();
                return function (elem) {
                    return elem.nodeName && elem.nodeName.toLowerCase() === tag;
                };
            },
            "CLASS": function (className) {
                var pattern = classCache(className);
                return function (elem) {
                    return pattern.test(elem.className || elem.getAttribute("class"));
                }
            },
            "ATTR": function (name, operator, check) {
                if (operator === "%=") {
                    try {
                        check = new RegExp(check);
                    } catch (_) { v2.error("Syntax error! pattern:" + check + ", expression invalid."); }
                }
                return function (elem) {
                    var result = elem.getAttribute(name);
                    if (result == null) {
                        return operator === "!=";
                    }
                    if (!operator) {
                        return true;
                    }

                    result += "";

                    return operator === "=" ? result === check :
                        operator === "!=" ? result !== check :
                            operator === "^=" ? check && result.indexOf(check) === 0 :
                                operator === "*=" ? check && result.indexOf(check) > -1 :
                                    operator === "$=" ? check && result.slice(-check.length) === check :
                                        operator === "~=" ? (" " + result + " ").indexOf(check) > -1 :
                                            operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
                                                operator === "%=" ? check.test(result) :
                                                    operator === ">=" ? ~~result >= ~~check :
                                                        operator === "<=" ? ~~result <= ~~check :
                                                            false;
                };
            },
            "CHILD": function (type, what, argument, first, last) {
                var simple = type.slice(0, 3) !== "nth",
                    forward = type.slice(-4) !== "last",
                    ofType = what === "of-type";

                return first === 1 && last === 0 ?
                    function (elem) {
                        return !!elem.parentNode;
                    } :
                    function (elem) {
                        var node, diff, nodeIndex, start,
                            dir = simple === forward ? "previousSibling" : "nextSibling",
                            parent = elem.parentNode,
                            name = ofType && elem.nodeName.toLowerCase();

                        if (parent) {
                            if (simple) {
                                while (dir) {
                                    node = elem;
                                    while ((node = node[dir])) {
                                        if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                                            return false;
                                        }
                                    }
                                    start = dir = type === "only" && !start && "nextSibling";
                                }
                                return true;
                            }
                            start = [forward ? parent.firstChild : parent.lastChild];
                            while ((node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop())) {
                                if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff && node === elem) {
                                    break;
                                }
                            }
                            diff -= last;
                            return diff === first || (diff % first === 0 && diff / first >= 0);
                        }
                    };
            },
            "PSEUDO": function (pseudo, selector) {
                var fn = jqueryEx.pseudos[pseudo];
                if (fn) return fn(selector);
                throw new Error();
            }
        },
        pseudos: {
            "focus": makeFunction(function (elem) {
                return elem === window.document.activeElement && (!window.document.hasFocus || window.document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
            }),
            "root": makeFunction(function (elem) {
                return elem === docElem;
            }),
            "empty": makeFunction(function (elem) {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    if (elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4) {
                        return false;
                    }
                }
                return true;
            }),
            "target": makeFunction(function (elem) {
                var hash = window.location && window.location.hash;
                return hash && hash.slice(1) === elem.id;
            }),
            "enabled": makeFunction(function (elem) {
                return elem.disabled === false;
            }),
            "disabled": makeFunction(function (elem) {
                return elem.disabled === true;
            }),
            "checked": makeFunction(function (elem) {
                var nodeName = elem.nodeName.toLowerCase();
                return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
            }),
            "lang": function (lang) {
                lang = lang.replace(runescape, funescape).toLowerCase();
                return function (elem) {
                    var elemLang;
                    do {
                        if (elemLang = elem.lang) {
                            elemLang = elemLang.toLowerCase();
                            return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                        }
                    } while ((elem = elem.parentNode) && elem.nodeType === 1);
                    return false;
                };
            },
            "is": function (selector) {
                return queryCache(selector.replace(rtrim, "$1"));
            },
            "not": function (selector) {
                var matcher = queryCache(selector.replace(rtrim, "$1"));
                return function (elem) {
                    return !matcher(elem);
                };
            },
            "has": function (selector) {
                return function (elem) {
                    return jqueryEx(selector, elem) != null;
                };
            },
            "contains": function (text) {
                return function (elem) {
                    return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                };
            },
            "selected": makeFunction(function (elem) {
                if (elem.parentNode) {
                    elem.parentNode.selectedIndex;
                }

                return elem.selected === true;
            }),
            "parent": makeFunction(function (elem) {
                return !Expr.pseudos["empty"](elem);
            }),
            "header": makeFunction(function (elem) {
                return rheader.test(elem.nodeName);
            }),
            "input": makeFunction(function (elem) {
                return rinputs.test(elem.nodeName);
            }),
            "button": makeFunction(function (elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "button" || name === "input" && elem.type === "button";
            }),
            "text": makeFunction(function (elem) {
                var attr;
                return elem.nodeName.toLowerCase() === "input" &&
                    elem.type === "text" &&
                    ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type);
            })
        },
        preFilter: {
            "ATTR": function (match) {
                match[1] = match[1].replace(runescape, funescape);
                match[3] = (match[4] || match[5] || "").replace(runescape, funescape);
                if (match[2] === "~=") {
                    match[3] = " " + match[3] + " ";
                }

                return match.slice(0, 4);
            },
            "CHILD": function (match) {
                match[1] = match[1].toLowerCase();
                if (match[1].slice(0, 3) === "nth") {
                    if (!match[3]) {
                        v2.syntaxError(match[0]);
                    }
                    match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                    match[5] = +((match[7] + match[8]) || match[3] === "odd");
                } else if (match[3]) {
                    v2.syntaxError(match[0]);
                }
                return match;
            },
            "PSEUDO": function (match) {
                var i;
                if (!match[2]) {
                    match[2] = match[4];
                }
                if (match[2] && (i = match[1].indexOf("(")) > -1) {
                    match[1] = match[1].slice(0, i);
                }
                return match.slice(0, 2);
            }
        },
        matches: function (elem, expr) {
            expr = expr.replace(rattributeQuotes, "='$1']");
            if (matchesSelector && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr)) {
                try {
                    var result = matches.call(elem, expr);
                    if (result || disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
                        return result;
                    }
                } catch (e) { }
            }
            return queryCache(v2.trim(expr))(context, elem);
        },
        query: function (selector, context) {
            var match, elem, m, nodeType,
                i, groups, old, nid, newContext, newSelector;

            if (!selector || typeof selector !== "string" || (nodeType = context.nodeType) !== 1 && nodeType !== 9) {
                return null;
            }
            if (querySelector && !rbuggyQSA.test(selector)) {
                old = true;
                nid = expando;
                newContext = context;
                newSelector = nodeType === 9 && selector;
                if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                    groups = tokenize(selector);
                    if ((old = context.getAttribute("id"))) {
                        nid = old.replace(rescape, "\\$&");
                    } else {
                        context.setAttribute("id", nid);
                    }
                    nid = "[id='" + nid + "'] ";

                    i = groups.length;
                    while (i--) {
                        groups[i] = nid + toSelector(groups[i]);
                    }
                    newContext = rsibling.test(selector) && context.parentNode || context;
                    newSelector = groups.join(",");
                }

                if (newSelector) {
                    try {
                        return newContext.querySelector(newSelector);
                    } catch (qsaError) {
                    } finally {
                        if (!old) {
                            context.removeAttribute("id");
                        }
                    }
                }
            }
            return queryCache(v2.trim(selector))(context);
        }
    });

    check(function (select) {
        var option = select.appendChild(document.createElement("option"));
        support.optionSelected = option.selected;
        select.disabled = true;
        support.optionDisabled = !option.disabled;
    }, "select");
    check(function (div) {
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        var a = div.getElementsByTagName("a")[0],
            input = div.getElementsByTagName("input")[0];
        a.style.cssText = "top:1px;float:left;opacity:.5";

        support.checkOn = !!input.value;
        support.style = /top/.test(a.getAttribute("style"));
        support.cssFloat = !!a.style.cssFloat;
        support.opacity = /^0.5/.test(a.style.opacity);
        support.hrefNormalized = a.getAttribute("href") === "/a";
        support.tbody = !div.getElementsByTagName("tbody").length;
        support.leadingWhitespace = div.firstChild.nodeType === 3;
        support.htmlSerialize = !!div.getElementsByTagName("link").length;
    });
    check(function (div) {
        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";
    });
    var ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity\s*=\s*([^)]*)/,
        rfocusable = /^(?:input|select|textarea|button|object)$/i,
        rclickable = /^(?:a|area)$/i;
    var attrHooks = {
        type: {
            set: function (elem, value) {
                if (value === "radio" && v2.nodeName(elem, "input")) {
                    var val = elem.value;
                    elem.setAttribute("type", value);
                    if (val) {
                        elem.value = val;
                    }
                    return value;
                }
            }
        }
    }, propHooks = {
        tabIndex: {
            get: function (elem) {
                var attributeNode = elem.getAttributeNode("tabindex");
                return attributeNode && attributeNode.specified ?
                    parseInt(attributeNode.value, 10) :
                    rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
                        0 :
                        undefined;
            }
        }
    }, cssHooks = {
        opacity: {
            get: function (elem, computed) {
                if (computed) {
                    var result = currentCSS(elem, "opacity");
                    return result === "" ? "1" : result;
                }
            }
        }
    }, cssProps = {
        "float": support.cssFloat ? "cssFloat" : "styleFloat"
    }, cssNumber = {
        "columnCount": true,
        "fillOpacity": true,
        "fontWeight": true,
        "lineHeight": true,
        "opacity": true,
        "orphans": true,
        "widows": true,
        "zIndex": true,
        "zoom": true
    };
    if (!support.style) {
        attrHooks.style = {
            get: function (elem) {
                return elem.style.cssText || undefined;
            },
            set: function (elem, value) {
                return (elem.style.cssText = value + "");
            }
        };
    }
    if (!support.hrefNormalized) {
        v2.each(["href", "src", "width", "height"], function (name) {
            attrHooks[name] = v2.extend(attrHooks[name], {
                get: function (elem) {
                    var result = elem.getAttribute(name, 2);
                    return result == null ? undefined : result;
                }
            });
        });
        v2.each(["href", "src"], function (name) {
            propHooks[name] = {
                get: function (elem) {
                    return elem.getAttribute(name, 4);
                }
            };
        });
    }
    if (!support.optionSelected) {
        propHooks.selected = {
            get: function (elem) {
                var parent = elem.parentNode;
                if (parent) {
                    parent.selectedIndex;
                    if (parent.parentNode) {
                        parent.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        };
    }
    var boolHook = {
        get: function (elem, name) {
            var attr, prop = v2.prop(elem, name);
            if (typeof prop === "boolean") {
                attr = elem.getAttribute(name);
                if (attr = (attr == null)) {
                    attr = elem.getAttributeNode(name);
                    attr = attr.value;
                }
                if (attr !== false) {
                    return name.toLowerCase();
                }
            }
        },
        set: function (elem, value, name) {
            if (value === false) {
                v2.removeAttr(elem, name);
            } else {
                elem.setAttribute(propFix[name] || name, value);
            }
            return name;
        }
    };
    if (!support.opacity) {
        cssHooks.opacity = {
            get: function (elem, computed) {
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? (0.01 * parseFloat(RegExp.$1)) + "" : computed ? "1" : "";
            },
            set: function (elem, value) {
                var style = elem.style,
                    currentStyle = elem.currentStyle,
                    opacity = rnumberlike.test(value) ? "alpha(opacity=" + value * 100 + ")" : "",
                    filter = currentStyle && currentStyle.filter || style.filter || "";
                style.zoom = 1;
                if ((value >= 1 || value === "") &&
                    v2.trim(filter.replace(ralpha, "")) === "" &&
                    style.removeAttribute) {
                    style.removeAttribute("filter");
                    if (value === "" || currentStyle && !currentStyle.filter) {
                        return;
                    }
                }
                style.filter = ralpha.test(filter) ?
                    filter.replace(ralpha, opacity) :
                    filter + " " + opacity;
            }
        };
    }
    var propFix = {
        tabindex: "tabIndex",
        readonly: "readOnly",
        "for": "htmlFor",
        "class": "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable"
    };
    var deleteSupport = support.deleteEx = check(function (div) {
        delete div.test;
        return true;
    });
    var rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i;
    var cssPrefixes = ["Webkit", "O", "Moz", "ms"];
    var cssNormalTransform = {
        letterSpacing: 0,
        fontWeight: 400
    };
    var rmargin = /^margin/i,
        rbackground = /^background/i,
        rnumnonpx = /^[+-]?(\d+\.)?\d+(?!px)[a-z%]+$/i;
    var getStyles = function (elem) {
        var view = elem.ownerDocument.defaultView;
        if (!view || !view.opener) {
            view = window;
        }
        return view.getComputedStyle(elem);
    };
    var currentCSS = function (elem, computed) {
        var width, minWidth, maxWidth, result, computed = computed || getStyles(elem);
        if (computed) {
            result = computed.getPropertyValue(name) || computed[name];
            if (result === "" && !v2.contains(elem.ownerDocument, elem)) {
                result = v2.style(elem, name);
            }
            if (rnumnonpx.test(result) && rmargin.test(name)) {
                var style = elem.style;
                width = style.width;
                minWidth = style.minWidth;
                maxWidth = style.maxWidth;
                style.minWidth = style.maxWidth = style.width = result;
                result = computed.width;
                style.width = width;
                style.minWidth = minWidth;
                style.maxWidth = maxWidth;
            }
            if (result != null) return String(result);
        }
    };
    function vendorPropName(style, name) {
        if (name in style) {
            return name;
        }
        var capName = name.charAt(0).toUpperCase() + name.slice(1),
            origName = name,
            i = cssPrefixes.length;
        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in style) {
                return name;
            }
        }
        return origName;
    }
    var rclass = new RegExp(whitespace + "{2,}", "g"),
        rnumberlike = /^[+-]?(\d+\.)?\d+/,
        rcssRealText = /^([+-/*])=([+-]?(?:[0-9]+\.)?[0-9]+)/i;
    v2.extend({
        /**
         * DOM对象添加属性(prototype)“name”，并为“name”属性设置属性值为“value”。
         * @param {Document} elem
         * @param {String} name
         * @param {any} value
         * @description value 为 null 时，删除“name”属性。为设置value参数时，获取DOM的“name”属性的属性值。
         */
        prop: function (elem, name, value) {
            if (elem && elem.nodeType === 1) {
                name = propFix[name] || name;
                var result, hooks = propHooks[name];
                if (arguments.length < 3) {
                    if (hooks && "get" in hooks && (result = hooks.get(elem, name)) !== null) {
                        return result;
                    } else {
                        return elem[name];
                    }
                }
                if (hooks && "set" in hooks && (result = hooks.set(elem, value, name)) !== undefined) {
                    return result;
                } else {
                    return (elem[name] = value);
                }
            }
        },
        /**
         * 删除DOM对象中名为“value”的属性(prototype)。
         * @param {Document} elem
         * @param {String} value
         * @description 多个属性时，value以空格分割。
         */
        removeProp: function (elem, value) {
            var name,
                i = 0,
                attrNames = value && value.match(rnotwhite);
            if (attrNames && elem.nodeType === 1) {
                while ((name = attrNames[i++])) {
                    if (rboolean.test(name)) {
                        elem[propFix[name] || name] = false;
                    } else if (deleteSupport) {
                        delete elem[name];
                    } else {
                        elem[name] = undefined;
                    }
                }
            }
        },
        /**
         * DOM对象添加属性(attibute)“name”，并为“name”属性设置属性值为“value”。
         * @param {Document} elem
         * @param {String} name
         * @param {any} value
         * @description value 为 null 时，删除“name”属性。为设置value参数时，获取DOM的“name”属性的属性值。
         */
        attr: function (elem, name, value) {
            if (elem && elem.nodeType === 1) {
                name = name.toLowerCase();
                var result, hooks = attrHooks[name] || rboolean.test(name) && boolHook;
                if (arguments.length < 3) {
                    if (hooks && "get" in hooks && (result = hooks.get(elem, name)) !== null) {
                        return result;
                    }
                    return elem.getAttribute(name);
                }
                if (value === null) {
                    return v2.removeAttr(elem, name);
                }
                if (hooks && "set" in hooks && (result = hooks.set(elem, value, name)) !== undefined) {
                    return result;

                } else {
                    elem.setAttribute(name, value + "");
                    return value;
                }
            }
        },
        /**
         * 删除DOM对象中名为“value”的属性(attibute)。
         * @param {Document} elem
         * @param {String} value
         * @description 多个属性时，value以空格分割。
         */
        removeAttr: function (elem, value) {
            var name, propName,
                i = 0,
                attrNames = value && value.match(rnotwhite);
            if (attrNames && elem.nodeType === 1) {
                while ((name = attrNames[i++])) {
                    propName = propFix[name] || name;
                    if (rboolean.test(name)) {
                        elem[propName] = false;
                    }
                    elem.removeAttribute(propName);
                }
            }
        },
        /**
         * 判断DOM对象的class属性是否包含名为“value”的class。
         * @param {Document} elem
         * @param {String} value
         * @returns {Boolean}
         */
        hasClass: function (elem, value) {
            return !!elem && elem.nodeType === 1 && v2.isString(value) && classCache(value).test(elem.className);
        },
        /**
         * 为DOM对象class属性添加名为“value”的class。
         * @param {Document} elem
         * @param {String} value
         */
        addClass: function (elem, value) {
            if (elem && elem.nodeType === 1 && v2.isString(value)) {
                var pattern, i = 0, classes = value.match(rnotwhite), myclass = elem.className;
                while (value = classes[i++]) {
                    pattern = classCache(value);
                    if (!pattern.test(myclass)) {
                        myclass += " " + value;
                    }
                }
                elem.className = v2.trim(myclass.replace(rclass, " "));
            }
        },
        /**
         * 去除DOM对象class属性中名为“value”的class。
         * @param {Document} elem
         * @param {String} value
         */
        removeClass: function (elem, value) {
            if (elem && elem.nodeType === 1 && v2.isString(value)) {
                var i = 0, classes = value.match(rnotwhite), myclass = elem.className;
                while (value = classes[i++]) {
                    myclass = myclass.replace(classCache(value), " ");
                }
                elem.className = v2.trim(myclass.replace(rclass, " "));
            }
        },
        /**
         * 根据条件添加或去除DOM对象class属性中名为“value”的class。
         * @param {Document} elem
         * @param {String} value
         * @param {Boolean} toggle
         * @description 为设置toggle或者toggle类型不符时，DOM的class属性包含“value”时，去除“value”，否则添加“value”。
         */
        toggleClass: function (elem, value, toggle) {
            if (typeof toggle === "boolean") {
                return v2[toggle ? "addClass" : "removeClass"](elem, value);
            }
            if (elem && elem.nodeType === 1 && v2.isString(value)) {
                var pattern, i = 0, classes = value.match(rnotwhite), myclass = elem.className;
                while (value = classes[i++]) {
                    pattern = classCache(value);
                    if (pattern.test(value)) {
                        myclass = myclass.replace(pattern, " ");
                    } else {
                        myclass += " " + value;
                    }
                }
                elem.className = v2.trim(myclass.replace(rclass, " "));
            }
        }
    });
    var core_elem = document.createElement('div');
    v2.extend({
        /**
         * 判断DOM对象的style是否支持“name”属性.
         * @param {String} name
         * @param {Document} elem
         * @returns {Boolean}
         */
        cssValid: function (name, elem) {
            var style = elem && elem.style || core_elem.style;
            if (name in style) {
                return true;
            }
            var capName = name.charAt(0).toUpperCase() + name.slice(1),
                i = cssPrefixes.length;
            while (i--) {
                name = cssPrefixes[i] + capName;
                if (name in style) {
                    return true;
                }
            }
            return false;
        },
        /**
         * 设置或获取DOM对象style的“name”属性。
         * @param {Document} elem
         * @param {String} name 
         * @param {String} value
         * @description 无value参数时为获取。
         * @returns elem.style[name]
         */
        style: function (elem, name, value) {
            if (elem && elem.nodeType === 1) {
                var val, type, hooks,
                    origName = v2.camelCase(name),
                    style = elem.style;

                name = cssProps[origName] || (cssProps[origName] = vendorPropName(style, origName));
                hooks = cssHooks[name] || cssHooks[origName];
                if (arguments.length < 3) {
                    if (hooks && "get" in hooks && (val = hooks.get(elem, false)) !== undefined) {
                        return val;
                    }
                    return style[name];
                }
                type = v2.type(value);
                if (type === "string" && (val = rcssRealText.exec(value))) {
                    if (/[+-]/.test(val[1])) {
                        value = (val[1] + 1) * val[2] + parseFloat(v2.css(elem, name));
                    } else {
                        value = (new Function("v", "return v" + val[1] + val[2]))(parseFloat(v2.css(elem, name)));
                    }
                    type = "number";
                }
                if (value == null || type === "number" && isNaN(value)) {
                    return;
                }
                if (type === "number" && !cssNumber[origName]) {
                    value += "px";
                }
                if (value === "" && !support.clearCloneStyle && rbackground.test(name)) {
                    style[name] = "inherit";
                }
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value)) !== undefined) {
                    try {
                        return style[name] = value;
                    } catch (e) { }
                }
            }
        },
        /**
         * 获取DOM的style对象的“name”属性。
         * @param {Document} elem
         * @param {String} name
         * @returns {Number|String}
         */
        css: function (elem, name, styles) {
            var val, hooks,
                origName = v2.camelCase(name);
            name = cssProps[origName] || (cssProps[origName] = vendorPropName(elem.style, origName));
            hooks = cssHooks[name] || cssHooks[origName];
            if (hooks && "get" in hooks) {
                val = hooks.get(elem, true);
            }
            if (val === undefined) {
                val = currentCSS(elem, name, styles);
            }
            if (val === "normal" && name in cssNormalTransform) {
                val = cssNormalTransform[name];
            }
            return rnumberlike.test(val) ? parseFloat(val) : val;
        }
    });

    /**
     * 查找满足选择器的第一个DOM对象。
     * @param {String|Document} selector
     * @param {Document} context
     * @returns {Document}
     * @example v2.jqueryEx("body") => document.body
     */
    v2.jqueryEx = function (selector, context) {
        return jqueryEx(selector, context);
    };
    /**
     * 判断DOM对象是不是符合表达式。
     * @param {Document} elem
     * @param {String} expr
     * @returns {Boolean}
     * <script src=/v2kit/v2.js></script> => elem
     * v2.is(elem,'[src%="(^|\\/)v2.js"]') => true
     */
    v2.is = function (elem, expr) {
        return jqueryEx.matches(elem, expr);
    };
    /**
    * 查找满足选择器的第一个DOM对象。
    * @param {String|Document} selector
    * @param {Document} context
    * @returns {Document}
    */
    v2.fn.jqueryEx = function (selector, context) {
        return v2.jqueryEx(selector, context || this.element);
    };
    /**
     * @param {Document} elem
     * @param {String} expr
     * @returns {Boolean}
     */
    v2.fn.is = function (expr, elem) {
        return v2.is(expr, elem || this.element);
    };

    //#region string
    var _location = window.location || window.document.location;
    var _locationUrl = location.href;
    var _locationSearch = function (urlStr) {
        if (urlStr == null) urlStr = _location.href;
        var index = urlStr.indexOf("?");
        return index > -1 ? urlStr.slice(index + 1) : '';
    };
    var locationSearch = _location.search == null ? function (urlStr) {
        if (urlStr == null || _locationUrl === urlStr) return _location.search;
        return _locationSearch(urlStr);
    } : _locationSearch;
    var formatCache = cached(function (i) {
        return new RegExp("\\{" + (i - 1) + "\\}", "gm");
    });
    var whitespace = "[\\x20\\t\\r\\n\\f]";
    var keywords = "Array|Date|Infinity|Math|NaN|Number|Object|String|abstract|alert|all|anchor|anchors|area|arguments|assign|blur|" +
        "boolean|break|button|byte|case|catch|char|class|clearInterval|clearTimeout|close|closed|confirm|const|continue|debugger|decodeURI|" +
        "decodeURIComponent|default|defaultStatus|delete|do|document|double|element|elements|else|embed|embeds|encodeURI|encodeURIComponent|" +
        "enum|escape|eval|eval|event|false|fileUpload|final|finally|float|for|function|function|goto|hidden|history|if|in|instanceof|int|interface|" +
        "isFinite|isNaN|isPrototypeOf|layer|layers|length|let|location|long|native|navigate|navigator|new|null|offscreenBuffering|open|opener|package|" +
        "parent|parseFloat|parseInt|plugin|private|prompt|protected|public|return|secure|select|self|setInterval|setTimeout|short|static|super|" +
        "switch|synchronized|this|throw|throws|top|transient|true|try|typeof|undefined|unescape|var|void|volatile|while|window|with|yield";
    var code = "([a-zA-Z]\\w*)(\\[([^\\]]+)\\])?";
    var rcode = new RegExp("(^|return" + whitespace + "+|[<>+/\\-=*?!,(:^|&~])" + whitespace + "*((?!\\b(?:" + keywords + ")\\b)" + code + ")(\\." + code + ")*" + "(?![\\w]+)", "g");
    var rcore_match = /\{(?![0-9]+)([\w-]+)((?:\.[\w-]+)+)?\}/gm;

    var char = "(?:\\\\.|[^\\\\])";//字符
    var chars = char + "*?";//多字符
    var quotes = "(['\"])" + chars + "\\{1}";//引号
    var quotes_chars = "(['\"])(" + chars + ")\\{1}";//引号内的字符
    var rquotes = new RegExp(quotes_chars.replace(rformat, replaceCache(0)), "g");

    var area = "(?:" + quotes_chars + "|\\{" + whitespace + "*" + quotes_chars.replace(rformat, replaceCacheBrace(2)) + whitespace + "*\\})";//执行域

    var bag = "(?:[^\\(\\)]+?)";
    var condition_current, condition_ultimate;
    for (var i = 0; i < 3; i++) {//最多套三层括号
        condition_current = condition_current ? "(?:(?:" + condition_ultimate + ")?\\(" + condition_current + "\\)(?:" + condition_ultimate + ")?)" : bag;
        condition_ultimate = condition_ultimate ? condition_ultimate + "|" + condition_current : condition_current;
    }

    var condition = "(?:" + whitespace + "*(" + condition_ultimate + ")" + whitespace + "*)";//条件
    var if_condition = "if" + whitespace + "*\\(" + condition + "\\)" + whitespace + "*" + area.replace(rformat, replaceCacheBrace(1)) + whitespace + "*";//if条件
    var rif = new RegExp(if_condition.replace(rformat, replaceCache(0)));
    var rjudgment = new RegExp(
        "\\{" + whitespace + "*" + if_condition.replace(rformat, replaceCache(0)) +//if
        "((?:" + whitespace + "*else" + whitespace + "+" + if_condition.replace(rformat, replaceCache(6)) + whitespace + "*)+)?" + //else if
        "(" + whitespace + "*else" + whitespace + "*" + area.replace(rformat, replaceCache(12)) + whitespace + "*)?" +//else
        whitespace + "*\\^\\}", "gm");

    var parameter = "(?:(?:" + quotes + ")|[0-9]+|true|false|null)";
    var parameters = "(?:" + parameter + whitespace + "*," + whitespace + "*)*" + parameter.replace(rformat, replaceCacheBrace(1));
    var lamda = "([a-zA-Z]\\w*|\\[[a-zA-Z]\\w*\\])(?:((?:\\.\\w+(?:\\((?:" + parameters.replace(rformat, replaceCacheBrace(2)) + ")?\\))?)*)?)";
    var forin = "for" + whitespace + "*\\(" + whitespace + "*(?:var" + whitespace + "+)?([a-zA-Z]\\w*)(?:<([a-zA-Z]\\w*)>)?" + whitespace + "+in" + whitespace + "+" + lamda.replace(rformat, replaceCacheBrace(2)) + whitespace + "*\\)";
    var rforin = new RegExp("\\{" + whitespace + "*" + forin.replace(rformat, replaceCache(0)) + whitespace +
        "*(?:" + area.replace(rformat, replaceCache(6)) + "|(?:" + whitespace + "*" +
        if_condition.replace(rformat, replaceCache(10)) +
        "(" + whitespace + "*else" + whitespace + "*" + area.replace(rformat, replaceCache(16)) + whitespace + "*)?" +
        whitespace + "*)|(?:\\{" + whitespace + "*" +
        if_condition.replace(rformat, replaceCache(20)) +
        "(" + whitespace + "*else" + whitespace + "*" + area.replace(rformat, replaceCache(26)) + whitespace + "*)?" +
        whitespace + "*\\}))" + whitespace + "*\\^\\}", "gm");

    var rexpression = new RegExp("\\{(" + whitespace + "*return" + whitespace + "+" + char + "+?)\\^\\}", 'gm');

    var expressionReady = function (obj, express, type) {
        type = type || v2.type(obj);
        if (type === "object") {
            var cache = {}, result = [[], []];
            express.replace(rquotes, "").replace(rcode, function (all, symbol, keyWrap, key) {
                if (!cache[key] && (cache[key] = true)) {
                    result[0].push(obj[key]);
                    result[1].push(key);
                }
            });
            v2.removeAll(cache);
            return result;
        }
    };
    var rreturn = new RegExp("^" + whitespace + "*return" + whitespace + "+");
    var expressionInvoke = function (obj, condition, type) {
        var fn, arr;
        type = type || v2.type(obj);
        if (!rreturn.test(condition)) {
            condition = "return " + condition;
        }
        if (arr = expressionReady(obj, condition, type)) {// if
            fn = (new Function(v2.format("return function({0}){ {1} }", arr.pop().toString(), condition)))();
        } else {
            fn = new Function(condition);
        }
        return arr ? fn.apply(obj, arr.pop()) : fn.call(obj);
    };
    var expressionCache = cached(function (string) {
        return new RegExp("\\{(" + string + ")((?:\\.[\\w-]+)+)?\\}", "gm");
    });
    var keyDescendant = function (obj, key, descendant, original) {
        if (!original) {
            obj = obj[key];
        }
        if (descendant && (obj || obj === 0)) {
            try {
                return (new Function(key, "return " + key + descendant))(obj);
            } catch (_) { obj = ''; }
        }
        return obj;
    };

    var rbrackets = /^\[([^\[\]]+)\]/;
    var MAX_INTEGER = Math.pow(2, 53);
    var MAX_INTEGER_STRING = String(MAX_INTEGER);
    var MIN_INTEGER_STRING = String(MAX_INTEGER - 1);//转正
    var INTEGER_MAX_LENGTH = MAX_INTEGER_STRING.length;
    var tryParseNumber = function (string) {
        if (!v2.jreg.number.test(string)) return string;
        if (string.length < INTEGER_MAX_LENGTH) return +string;
        var string2 = string.replace(/[+-]/g, '');
        if (string2.length < INTEGER_MAX_LENGTH) return +string;
        var index = string.indexOf('.');
        if (index === -1 && string2.length > INTEGER_MAX_LENGTH) return string;
        var string3 = string2.replace(/0+$/g, '');
        if (string3.length < string2.length) return tryParseNumber(string3);
        var string4 = index > -1 ? string3.slice(0, index) + string3.slice(index + 1) : string3;//去除“.”
        if (string4.length > INTEGER_MAX_LENGTH) return string;
        if (string4.length < INTEGER_MAX_LENGTH) return +string;
        var compare = string.charAt(0) === "-" ? MIN_INTEGER_STRING : MAX_INTEGER_STRING;
        for (var i = 0, len = string4.length; i < len; i++) {
            if (string4[i] < compare[i]) return +string;
            if (string4[i] > compare[i]) return string;
        }
        return +string;
    };
    v2.extend({
        /**
         * 使用“{\d+}”格式化字符串。
         * @param {String} string
         * @returns {String}
         * @example v2.format("我是{0}，来自{3}，毕业于{1}，在{2}担任{4}一职。","HyLy","阿坝师范学院","优易票","四川成都","项目经理")
         *      => "我是HyLy，来自四川成都，毕业于阿坝师范学院，在优易票担任项目经理一职。"
         * @example v2.format("我是{0}，来自{3}，毕业于{1}，在{2}担任{4}一职。",["HyLy","阿坝师范学院","优易票","四川成都","项目经理"])
         *      => "我是HyLy，来自四川成都，毕业于阿坝师范学院，在优易票担任项目经理一职。"
         */
        format: function (string) {
            if (arguments.length < 2) return string;
            if (arguments.length === 2 && isArraylike(arguments[1])) {
                for (var i = 0, arr = arguments[1]; i < arr.length; i++) {
                    string = string.replace(formatCache(i + 1), arr[i]);
                }
                return string;
            }
            for (var i = 1; i < arguments.length; i++) {
                string = string.replace(formatCache(i), arguments[i]);
            }
            return string;
        },
        /**
         * 使用“{\w+(\.\w+)*}”格式化符串。
         * @param {String} string
         * @param {JSON} json
         * @param {RegExp} rmatch
         * @param {Boolean} showMatchStr
         * @returns {String}
         * @example v2.replace("我是{name}，来自{address}，毕业于{school}，在{company}担任{job}一职。",{name:"HyLy",school:"阿坝师范学院",company:"优易票",address:"四川成都",job:"项目经理"}) 
         *      => "我是HyLy，来自四川成都，毕业于阿坝师范学院，在优易票担任项目经理一职。"
         * @example v2.replace("我是{name}，擅长{skill.skillOne}、{skill.skillTwo}、{skill.skillThree}等。",{name:"HyLy",skill:{skillOne:"Web前端",skillTwo:"ASP.NET",skillThree:"WinForm"}}) 
         *      => "我是HyLy，擅长Web前端、ASP.NET、WinForm等。"
         */
        replace: function (string, json, rmatch, showMatchStr) {
            return string.replace((rmatch || rcore_match), function (matchStr, key, descendant) {
                if (key in json) {
                    key = keyDescendant(json, key, descendant);
                    return (key || key === 0) ? key : '';
                }
                return showMatchStr ? matchStr : "";
            });
        },
        /**
         * 使用指定命令的表达式，替换字符串内容。
         * @param {String} string
         * @param {JSON|Array|ArrayLike|String} json
         * @param {RegExp} rmatch
         * @param {Boolean} showMatchStr
         * @returns {String}
         * @example v2.expression('状态：{return isValid ? "√": "×"^}。',{isValid:true}) 
         *      => "状态：√。"
         * @example v2.expression('状态：{if(status==1) "成功" else if(status==0) "失败" else "未知"^}。',{status:0}) 
         *      => "状态：失败。"
         * @example v2.expression('<ul>{for(var value in [data]) if(value) "<li>{value}</li>" ^}</ul>',{data:["I","love","You!"]}) 
         *      => "<ul><li>I</li><li>love</li><li>You!</li></ul>"
         * @example v2.expression('<ul>{for(var value<key> in data.split(",")) if(value) "<li data-key="{key}">{value}</li>" ^}</ul>',"I,love,You!")
         *      => "<ul><li data-key="0">I</li><li data-key="1">love</li><li data-key="2">You!</li></ul>"
         */
        expression: function (string, json, rmatch, showMatchStr) { //{return (返回结果的表达式)^}
            var type;
            string = string.replace(rforin, function (matchStr, value, key, object, descendant) {//for
                var arrayObject;
                if (rbrackets.test(object)) {
                    arrayObject = keyDescendant(json, object = RegExp.$1, descendant);
                } else {
                    arrayObject = keyDescendant(json, object, descendant, true);
                }
                if (arrayObject) {
                    var html = "", map = {},
                        rmatch = expressionCache(key ? value + "|" + key : value),
                        content = arguments[8] || arguments[10],
                        condition = arguments[11] || arguments[21],
                        trueContent = arguments[13] || arguments[15] || arguments[23] || arguments[25],
                        falseConten = arguments[18] || arguments[20] || arguments[28] || arguments[30];
                    if (condition) {
                        condition = new Function(value, key || "_", object, v2.format("try{ return {0}; }catch(_){ return false;}", condition));
                    }
                    v2.each(arrayObject, function (v, k) {
                        map[value] = v;
                        if (key) map[key] = k;
                        if (content == null) {
                            if (condition) {
                                if (condition(v, k, arrayObject)) {
                                    if (trueContent) {
                                        html += v2.replace(trueContent, map, rmatch);
                                    }
                                } else {
                                    if (falseConten) {
                                        html += v2.replace(falseConten, map, rmatch);
                                    }
                                }
                            }
                        } else {
                            if (content) {
                                html += v2.replace(content, map, rmatch);
                            }
                        }
                    });
                    v2.removeAll(map);
                    return html;
                }
                return showMatchStr ? matchStr : "";
            }).replace(rexpression, function (matchStr, express) {//return expression ? string : string 
                var r;
                try {
                    if (r = expressionInvoke(json, express, type = type || v2.type(json))) {
                        while (v2.isFunction(r)) { r = r(); }
                    }
                    return r == null ? "" : r;
                } catch (_) { }
                return showMatchStr ? matchStr : "";
            }).replace(rjudgment, function (matchStr, condition) {//if (else if)* (else)?
                type = type || v2.type(json);
                var match, content = arguments[3] || arguments[5];
                try {
                    if (expressionInvoke(json, condition, type)) {// if
                        return v2.replace(content || "", json);
                    }
                    if (condition = arguments[6]) {// else if
                        while (match = rif.exec(condition)) {
                            if (expressionInvoke(json, match[1], type)) {
                                return v2.replace(match[3] || match[5] || "", json);
                            }
                            condition = condition.slice(match[0].length);
                        }
                    }
                    if (content = (arguments[14] || arguments[16])) {// else
                        return v2.replace(content, json);
                    }
                } catch (_) { }
                return showMatchStr ? matchStr : "";
            });
            if (v2.type(json) === "object") {
                return v2.replace(string, json, rmatch, showMatchStr);
            }
            return string;
        },
        /**
         * 将urlStr的参数转成对象
         * @param {URL} urlStr @default location.href
         * @param {String} eq @default "="
         * @param {String} spl @default "&"
         * @returns {JSON}
         * @example v2.queryObject("http://www.baidu.com?s=s&ssh=1&cn=true") => {s:"s","ssh":1,"cn":true}
         */
        queryObject: function (urlStr, eq, spl) { //[urlStr, eq, spl] ==>{string}
            var search = locationSearch(urlStr);
            if (!search) return {};
            eq = eq || "=";
            var k, i = 0,
                r = {},
                urlParams = search.split(spl || "&");
            for (var len = urlParams.length; i < len; i++) {
                k = urlParams[i].split(eq);
                k[1] = unescape(unescape(unescape(k[1])));
                if (k.length > 2) {
                    k[1] = core_slice.call(k, 1).join(eq);
                } else if (v2.jreg.boolean.test(k[1])) {
                    k[1] = k[1] === "true";
                }
                r[k[0]] = tryParseNumber(k[1]);
            }
            return r;
        },
        /**
         * 将object的属性和属性值用“eq”拼接为“组合符”，多个“组合符”用“spl”拼接。
         * @param {JSON} object
         * @param {String} eq @default "="
         * @param {String} spl @default "&"
         * @returns {String}
         * @example v2.toQueryString({a:1,b:2}) => "a=1&b=2"
         */
        toQueryString: function (object, eq, spl) {
            var results = [];
            spl = spl || "&";
            eq = eq || "=";
            if (object) {
                for (var property in object) {
                    if (core_hasOwn.call(object, property)) {
                        if (object[property] || object[property] === 0) {
                            results.push(property + eq + v2.trim(escape(object[property])));
                        }
                    }
                }
            }
            return results.join(spl);
        }
    });
    //#endregion

    //#region v2.jreg
    /**
     * 生成正则表达式
     * @param {String|RegExp} pattern
     * @param {String} attributes "img" i:不区分大小写，m:多行匹配，g:全局匹配
     * @returns {RegExp}
     * @example v2.jreg("[0-9]+","g") => /[0-9]+/g
     */
    v2.jreg = function (pattern, attributes) {
        var type = v2.type(pattern);
        if (type === "regexp") {
            if (pattern.flags === attributes) {
                return pattern;
            }
            type = "string";
            pattern = pattern.source;
        }
        if (type === "string") {
            return attributes ? new RegExp(pattern, attributes) : new RegExp(pattern);
        }
        throw new Error("Invalid pattern:" + pattern);
    };
    v2.extend(v2.jreg, {
        version: version,
        trim: rtrim,
        /**
         * 判断是不是布尔型
         * @example v2.jreg.boolean.test(true) => true 或 v2.jreg.boolean.test("false") => true
         */
        boolean: {
            /**
             * 判断为不为真
             * @example v2.jreg.boolean.really.test(true) => true 或 v2.jreg.boolean.really.test("false") => false
             */
            really: /^(true)$/i,
            /**
             * 判断为不为假
             * @example v2.jreg.boolean.fake.test(true) => false 或 v2.jreg.boolean.fake.test("false") => true
             */
            fake: /^(false)$/i
        },
        /**
         * 判断是不是数字
         * @example v2.jreg.number.test(7) => true 或 v2.jreg.number.test("+7.2") => true 
         *  或 v2.jreg.number.test(-7) => true 或 v2.jreg.number.test("-7.2") => true
         */
        number: {
            /**
             * 判断是不是整数
             * @example v2.jreg.number.test(7) => true 或 v2.jreg.number.test(-7) => true
             *  或 v2.jreg.number.test("+7.2") => fasle 或 v2.jreg.number.test("-7.2") => fasle
             */
            integer: {
                /**
                 * 判断是不是正整数
                 * @example v2.jreg.number.integer.positive.test(7) => true 或 v2.jreg.number.integer.positive.test("+7") => true 
                 *  或 v2.jreg.number.integer.positive.test("+7.2") => false 或 v2.jreg.number.integer.positive.test(-7) => false 或 v2.jreg.number.integer.positive.test("-7.2") => fasle
                 */
                positive: /^[+]?(0|[1-9][0-9]*)$/,
                /**
                 * 判断是不是负整数
                 * @example v2.jreg.v2.jreg.number.integer.negative.test(-7) => true 或 v2.jreg.v2.jreg.number.integer.negative.test("-7") => true 
                 *  或 v2.jreg.v2.jreg.number.integer.negative.test(7) => false 或 v2.jreg.v2.jreg.number.integer.negative.test("-7.2") => fasle
                 */
                negative: /^-(0|[1-9][0-9]*)$/
            },
            /**
             * 判断是不是分数
             * @example v2.jreg.number.fraction.test(7) => false 或 v2.jreg.number.fraction.test(-7) => false
             *  或 v2.jreg.fraction.number.test("+7.2") => true 或 v2.jreg.number.fraction.test("-7.2") => true
             */
            fraction: {
                /**
                 * 判断是不是正分数
                 * @example v2.jreg.number.fraction.positive.test(7) => false 或 v2.jreg.number.fraction.positive.test("+7") => false 
                 *  或 v2.jreg.number.fraction.positive.test("+7.2") => true 或 v2.jreg.number.fraction.positive.test(-7) => false 或 v2.jreg.number.fraction.positive.test("-7.2") => false
                 */
                positive: /^[+]?(0|[1-9][0-9]*)(?:\.([0-9]+))$/,
                /**
                 * 判断是不是负分数
                 * @example v2.jreg..number.fraction.negative.test(7) => false 或 v2.jreg..number.fraction.negative.test("+7") => false 
                 *  或 v2.jreg..number.fraction.negative.test("+7.2") => false 或 v2.jreg..number.fraction.negative.test(-7) => false 或 v2.jreg..number.fraction.negative.test("-7.2") => true
                 */
                negative: /^-(0|[1-9][0-9]*)(?:\.([0-9]+))$/
            }
        },
        /**
         * 判断是不是网络或项目路径
         * @example v2.jreg.url.test("http://v2kit.cnblogs.com") => true 或 v2.jreg.url.test("../v2.js") => true 
         *  或 v2.jreg.url.test("~/v2.js") => true 或 v2.jreg.url.test("/v2.js") => true
         */
        url: {
            /**
             * 判断是不是网络路径
             * @example v2.jreg.url.network.test("http://v2kit.cnblogs.com") => true
             */
            network: /^[a-z]+:\/\//,
            /**
             * 判断是不是项目路径
             * @example v2.jreg.url.project.test("../v2.js") => true 
             *  或 v2.jreg.url.project.test("~/v2.js") => true 或 v2.jreg.url.project.test("/v2.js") => true
             */
            project: {
                /**
                 * 判断是不是相对路径
                 * @example v2.jreg.url.project.relative.test("../v2.js") => true
                 */
                relative: /^..\//,
                /**
                 * 判断是不是绝对路径
                 * @example v2.jreg.url.project.absolute.test("~/v2.js") => true 
                 *  或 v2.jreg.url.project.absolute.test("/v2.js") => true
                 */
                absolute: /^~?\//
            }
        },
        /**
         * 判断是不是电话号码(座机号或手机号)
         * @example v2.jreg.tel.test("18980861011") => true 或 v2.jreg.tel.test("0830-7620228") => true
         */
        tel: {
            /**
             * 判断是不是手机号
             * @example v2.jreg.tel.mobile.test("18980861011") => true
             */
            mobile: /^(\+86\s+)?(1[3-9][0-9]{9})$/,
            /**
             * 判断是不是座机号
             * @example v2.jreg.tel.telephone.test("0830-7620228") => true
             */
            telephone: /^(0[0-9]{2,3}-?)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/
        },
        /**
         * 判断是不是邮箱地址
         * @example v2.jreg.mail.test("v2kit@foxmail.com") => true
         */
        mail: /^\w[-\w.+]* @([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
        date: {
            Y: /(y+)/, //年
            M: /(M+)/, //月份
            D: /(d+)/, //日
            H: /(H+)/, //小时（24小时制）
            h: /(h+)/, //小时（12小时制）
            m: /(m+)/, //分
            s: /(s+)/, //秒
            f: /(f+)/ //毫秒
        }
    });

    function makeRegExp(reg) {
        return function (key) {
            return v2.isFunction(reg[key]) ? function (string) {
                return reg[key](string);
            } : reg[key];
        }
    }

    var booleanExp = makeRegExp(/^(true|false)$/i);

    var telExp = makeRegExp(/^(0[0-9]{2,3}-?)?(\+86\s+)?((1[3-9][0-9]{3}|[2-9])[0-9]{6,7})+(-[0-9]{1,4})?$/);

    var urlExp = makeRegExp(/^(([a-z]+:\/\/)|~?\/|..\/)/i);
    var projectExp = makeRegExp(/^(~?\/|..\/)/i);

    var integerExp = makeRegExp(/^[+-]?(0|[1-9][0-9]*)$/);
    var fractionExp = makeRegExp(/^[+-]?(0|[1-9][0-9]*)(?:\.([0-9]+))$/);
    var numberExp = makeRegExp(/^[+-]?(0|[1-9][0-9]*)(?:\.([0-9]+))?$/);
    for (var i in {
        source: null,
        test: null,
        exec: null,
        compile: null
    }) {
        v2.jreg.boolean[i] = booleanExp(i);

        v2.jreg.tel[i] = telExp(i);

        v2.jreg.url[i] = urlExp(i);
        v2.jreg.url.project[i] = projectExp(i);

        v2.jreg.number[i] = numberExp(i);
        v2.jreg.number.integer[i] = integerExp(i);
        v2.jreg.number.fraction[i] = fractionExp(i);
    }
    //#endregion

    //#region v2.date
    /**
     * 将date参数转为日期型，转失败时返回当前日期。
     * @param {Number|String|Date} date
     * @returns {Date}
     */
    v2.date = function (date) {
        if (!date) return new Date();
        var type = v2.type(date);
        if (type === "date") return date;
        if (type === "string") {
            type = "number";
            date = Date.parse(date.replace(/[\u0391-\uFFE5-]+/g, "/")
                .replace(/[0-9]([a-zA-Z])[0-9]/g, function (all, letter) {
                    return all.replace(letter, " ");
                }));
        }
        if (type === "number") {
            return isNaN(date) ? new Date() : new Date(date);
        }
        return new Date();
    };
    v2.extend(v2.date, {
        /**
         * 判断对象是不是日期对象
         * @param {any} date
         * @returns {Boolean}
         */
        isDate: function (date) {
            return v2.type(date) === "date";
        },
        /**
         * 判断是不是闰年
         * @param {Number} year
         * @returns {Boolean}
         */
        isLeapYear: function (year) {
            return (year % 400 == 0) || (year % 4 == 0) && (year % 100 > 0);
        },
        /**
         * 获取日期是该月的第几天
         * @param {Number|String|Date} date
         * @returns {Number}
         */
        day: function (date) {
            return v2.date(date).getDate();
        },
        /**
         * 获取日期是该月的第几周
         * @param {Number|String|Date} date
         * @returns {Number}
         */
        week: function (date) {
            date = v2.date(date);
            return Math.ceil((date.getDate() + 6 - date.getDay()) / 7);
        },
        /**
         * 获取日期是该年的第几周
         * @param {Number|String|Date} date
         * @returns {Number}
         */
        weekYear: function (date) {
            date = v2.date(date);
            var date2 = new Date(date.getFullYear(), 0, 1);
            var day = Math.round((date.valueOf() - date2.valueOf()) / 86400000); //24 * 60 * 60 * 1000
            return Math.ceil((day + date2.getDay()) / 7);
        },
        /**
         * 获取日期的月份
         * @param {Number|String|Date} date
         * @returns {Number}
         */
        month: function (date) {
            return v2.date(date).getMonth() + 1;
        },
        /**
         * 获取日期的年份
         * @param {Number|String|Date} date
         * @returns {Number}
         */
        year: function (date) {
            return v2.date(date).getFullYear();
        },
        /**
         * 获取该年该月有多少天
         * @param {Number} month
         * @param {Number} year
         * @returns {Number}
         */
        dayCount: function (month, year) {
            if (arguments.length < 2) {
                var date = v2.date.isDate(month) ? month : new Date();
                month = v2.isNumber(month) ? month : date.getMonth() + 1;
                year = date.getFullYear();
            }
            if (month == 2) {
                return v2.date.isLeapYear(year) ? 29 : 28;
            }
            return (month % 2 == 0 ? month < 7 : month > 8) ? 30 : 31;
        },
        /**
         * 格式化日期
         * @param {Number|String|Date} date
         * @param {String} fmt @default "yyyy-MM-dd"
         * @returns {String}
         * @example v2.date.format("Fri Aug 31 2018 09:29:40 GMT+0800 (中国标准时间)","yyyy-MM-dd") => "2018-08-31"
         * @example v2.date.format("2018年8月31日,9:31:50.129","yyyy-MM-dd HH:mm:ss.fff")
         */
        format: function (date, fmt) {
            if (arguments.length < 2) {
                if (/(y|M|d|H|m|s|f)/.test(date)) {
                    fmt = date;
                    date = null;
                }
            }
            date = v2.date(date);
            fmt = fmt || "yyyy-MM-dd";
            var C = {
                M: date.getMonth() + 1,
                D: date.getDate(),
                H: date.getHours(),
                m: date.getMinutes(),
                s: date.getSeconds()
            };
            C.h = C.H % 12 || 12;
            if (v2.jreg.date.Y.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, ('' + date.getFullYear()).substring(4 - RegExp.$1.length));
            }
            if (v2.jreg.date.f.test(fmt)) {
                C.f = date.getMilliseconds();
                fmt = fmt.replace(RegExp.$1, (('000' + C.f).substr(('' + C.f).length, RegExp.$1.length) + '00').slice(0, 3));
            }
            for (var A in C) {
                if (v2.jreg.date[A].test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? C[A] : ('00' + C[A]).slice(-2));
            }
            return fmt;
        }
    });
    //#endregion

    //#region v2.location
    var locationUrl, locationParts,
        rurl = /^(([\w-]+:)\/\/(([^\/?#:]*)(?::(\d+))?))((\/(?:[^\/?#]+\/)+)?(([\w-]+)(\.\w+)?)?)(\?[^#]*)?(#.*)?/;
    try {
        locationUrl = location.href;
    } catch (e) {
        locationUrl = document.createElement("a");
        locationUrl.href = "";
        locationUrl = locationUrl.href;
    }
    v2.location = {};
    if (locationParts = rurl.exec(locationUrl)) {
        v2.extend(v2.location, {
            href: locationParts[0],
            origin: locationParts[1],
            protocol: locationParts[2],
            host: locationParts[3],
            domain: locationParts[4],
            port: locationParts[5] || "",
            path: locationParts[7] || "/",
            pathname: locationParts[6] || "/",
            fullname: locationParts[8] || "",
            name: locationParts[9] || "",
            extension: locationParts[10] || "",
            search: locationParts[11] || "",
            hash: locationParts[12] || ""
        });
        var hashchange = function () {
            v2.location.hash = location.hash;
        };
        if (document.addEventListener) {
            document.addEventListener("hashchange", hashchange, false);
            window.addEventListener("hashchange", hashchange, false);
        } else {
            document.attachEvent("onhashchange", hashchange);
            window.attachEvent("onhashchange", hashchange);
        }
    }
    //#endregion

    //#region v2.bro、v2.sys、v2.kern 
    v2.bro = {};//浏览器(版本取：9.1，9)
    v2.sys = {};//系统
    v2.kern = {};//浏览器内核
    var ua = navigator.userAgent.toLowerCase();
    var rsys = /\b(windows|win32|macintosh|mac os x|adobeair|linux|unix)\b/i;
    var rkernel = /\b(opera|chrome|webkit|safari|msie|firefox|gecko|trident)\b(\s*(version|rv:|\/)*(\d+(\.\d+)?))?/ig;
    ua.replace(rsys, function (_, value) {
        var object = {
            isWindow: "win",
            isMac: "mac",
            isAir: "air",
            isUnix: "unix",
            isLinux: "linux"
        };
        for (var i in object) {
            v2.sys[i] = value.indexOf(object[i]) > -1;
        }
    });
    ua.replace(rkernel, function (_, type, all, rv, version) { //_:匹配内容,type:内核类型,all:匹配符以及版本号,rv:匹配符,version:版本号
        v2.kern["is" + type.charAt(0).toUpperCase() + type.slice(1)] =
            v2.bro["is" + type.charAt(0).toUpperCase() + type.slice(1)] = ~~version || true;
    });
    if (v2.kern.isSafari) {
        if (/applewebkit\/4/.test(ua)) {
            v2.kern["isSafari"] = 2;
        }
    }
    if (!v2.bro.isMsie && v2.bro.isTrident) {
        if (/rv:(\d+(\.\d+)?)/.test(ua)) {
            v2.bro.isMsie = ~~RegExp.$1;
        }
    }
    if (v2.bro.isChrome) {
        v2.bro.isSafari = false;
    }

    if (v2.bro.isChrome || v2.bro.isSafari || v2.bro.isMsie) {
        v2.bro.isFirefox = false;
    }

    v2.bro.isWebkit = v2.bro.isGecko = v2.bro.isTrident = false; //修复

    v2.bro.isBrowse32Bit = navigator.platform == "Win32"; //是否为32位浏览器

    v2.bro.isCompatMode = document.compatMode == "CSS1Compat"; //是否处于兼容性模式

    //#endregion
    return window.v2Kit = window.v2 = v2;
});
