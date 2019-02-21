/*!
 * JavaScript v2 v1.0.1
 * https://github.com/yepsharp/v2
 *
 ** @author hyly
 ** @date 2018-12-01
 ** @descript a valuable technology object.
 */
(function (global, factory) {
    return typeof exports === 'object' && typeof module === "object" ?
        module.exports = global.document ?
            factory(global)
            :
            function (window) {
                if (window.document == null) throw new Error("v2 requires a window with a document");
                return factory(window);
            } : factory(global);
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
        if (object.yep === version) {
            if ((elem = object.$) && elem.jquery) {
                elem = elem.get(0);
            }
        }
        var i, value;
        for (i in object) {
            value = object[i];
            if (value && deep && value !== object) {
                if (value.destroy && value.yep === version) {
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
            option = tag;
            tag = option.tag;
        }
        return new v2.fn.init(tag, option);
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
    var deleteSurport = true;
    v2.delete = function (obj, value) {
        if (!obj || !value) return;
        var i = 0, name;
        value = value.match(rnotwhite);
        while (name = value[i++]) {
            if (!(name in obj)) return;
            if (!deleteSurport) {
                return obj[name] = undefined;
            }
            try {
                delete obj[name];
            } catch (_) {
                obj[name] = undefined;
                deleteSurport = false;
            }
        }
    };
    function defineFix(obj, name, attributes) {
        var _value = attributes.value,
            descriptor = {
                get: attributes.get || function () {
                    return _value;
                }
            };
        if (!attributes.writable || 'set' in attributes) {
            descriptor.set = attributes.set || function (value) {
                _value = value;
            };
        }
        Object.defineProperty(obj, name, descriptor);
    }
    v2.define = function (obj, name, attributes) {
        if (!obj || !name || !attributes) return obj;
        if (v2.isPlainObject(name)) {
            return v2.each(name, function (attributes, name) {
                return v2.define(obj, name, attributes);
            }), obj;
        }
        var value = obj[name], callback = (value || value === 0 || value === false) && ('set' in attributes || !attributes.writable && !('get' in attributes)) && function () {
            try {
                obj[name] = value;
            } catch (_) {
                console.log(obj);
                console.log(name);
                console.log(value);
            }
        };
        v2.delete(obj, name);
        try {
            Object.defineProperty(obj, name, attributes);
        } catch (_) {
            if (!('value' in attributes || 'writable' in attributes || 'configurable' in attributes || 'enumerable' in attributes)) throw _;
            defineFix(obj, name, attributes);
        };
        if (callback) callback();
        value = callback = null;
        return obj;
    };

    v2.defineReadonly = function (obj, name, value) {
        v2.define(obj, name, {
            get: function () {
                return value;
            }
        });
    };

    var typeCache = makeCache(function (type) {
        var pattern = new RegExp("(^|\\|)" + type + "(\\||$)");
        return function (type) {
            return pattern.test(type);
        };
    });
    function initWildCards(wildCards, key, type, value) {
        if (!wildCards || !key) return key;
        var item, arr;
        while (item = v2.wildCards[key[0]]) {
            key = key.slice(1);
            if (item.type === "*" || typeCache(type = type || v2.type(value))(item.type)) {
                arr = arr || [];
                arr.push(type === item.type ?
                    item :
                    v2.improve({ type: type }, item)
                );
            }
        }
        if (arr) {
            wildCards[key.indexOf('set') === 0 && key.length > 4 ? key[3].toLowerCase() + key.slice(4) : key] = arr.length > 1 ? arr : arr[0];
        }
        return key;
    }
    function typeWildCard(wildCards, type, callback) {
        var isFunction = v2.isFunction(type);
        v2.each(wildCards, function (value, key) {
            if (isFunction ? type(value.type) : value.type === type) {
                callback(value, key);
            }
        });
    }
    function renderWildCard(context, variable) {
        var val, callback = function (value, key) {
            val = value.exec(context, value.type === "function" ? variable[key] : context[key], key);
            if (val !== undefined) {
                if (value.type === "function") {
                    variable[key] = val;
                } else {
                    context[key] = val;
                }
            }
        }, fix = function (value, key) {
            if (!(key in context.enumState)) {
                if (v2.isArray(value)) {
                    return v2.each(value, function (value) {
                        callback(value, key);
                    });
                }
                return callback(value, key);
            }
        };
        typeWildCard(context.wildCards, function (type) {
            return type !== 'function';
        }, fix);

        typeWildCard(context.wildCards, 'function', fix);
    }
    var whitespace = "[\\x20\\t\\r\\n\\f]",
        word = "[_a-z][_a-z0-9]*";
    var rword = new RegExp(word, "gi"),
        rxhtmlTag = /^<([\w-]+)|<\/([\w-]+)>$/g,
        rinject = new RegExp("^" + whitespace + "*(" + word + ")\\(((" + whitespace + "*" + word + whitespace + "*,)*" + whitespace + "*" + word + ")?" + whitespace + "*\\)" + whitespace + "*$", "i");
    function dependencyInjection(context, key, inject, value) {
        if (!inject) return value;
        var callback, baseArgs, args = [], injections = inject.match(rword);
        if (callback = context[key]) {
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
    function ArrayThen(arr) {
        v2.merge(this, arr);
    }
    ArrayThen.prototype = {
        length: 0,
        when: function (callback) {
            return new ArrayThen(v2.map(this, function (elem, i, arr) {
                if (callback(elem, i, arr)) {
                    return elem;
                }
            }));
        },
        then: function (callback) {
            return v2.each(this, callback);
        },
        eq: function (i) {
            return new ArrayThen(i in this ? [this[i]] : []);
        },
        done: function (callback) {
            return v2.each(this, callback), core_splice.call(this, 0, this.length);
        }
    };
    ArrayThen.prototype.nth = ArrayThen.prototype.eq;

    var identity = 0,
        CurrentV2Control = null;
    var xhtmlNode = document.createElement('div');
    v2.fn = v2.prototype = {
        constructor: function (tag, options) {
            options = options || {};
            options.owner = options.owner || this;
            options.$$ = options.$$ || options.owner.$;

            this.$components = this.$components || {};

            var component = this.components[tag = v2.camelCase(tag)];

            if (v2.isFunction(component)) {
                return (this.$components[tag] || (this.$components[tag] = component(tag)))(options, tag);
            }
            return v2(tag, component ? v2.improve(options, component) : options);
        },
        tag: "*",
        yep: version,
        identity: 0,
        limit: false,
        access: false,
        $: null,
        $$: null,
        data: null,
        owner: null,
        events: {},
        methods: {},
        wildCards: {},
        components: {},
        enumState: {
            pending: 0.5,
            init: 1,
            render: 2,
            usb: 3,
            resolve: 4,
            commit: 8
        },
        define: function (name, extra, userDefined) {
            var my = this, contains;
            if (v2.isPlainObject(name)) {
                return v2.each(name, function (attributes, name) {
                    my.define(name, attributes, userDefined);
                }), this;
            }
            if (v2.isFunction(extra)) {
                contains = name in this.$;
                return v2.define(this, name, {
                    get: (contains || userDefined) ? function () {
                        return my.$[name];
                    } : function () {
                        return my.$.getAttribute(name);
                    },
                    set: contains ?
                        function (value) {
                            extra.call(my, my.$[name] = value || my.$[name]);
                        } :
                        userDefined ?
                            function (value) {
                                my.$[name] = extra.call(my, value) || value;
                            } : function (value) {
                                my.$.setAttribute(name, value + '');
                                extra.call(my, my.$.getAttribute(name));
                            }
                });
            }
            if (v2.isPlainObject(extra)) {
                return v2.define(this, name, extra);
            }
            v2.each(name.match(rnotwhite), function (name) {
                contains = userDefined || name in my.$;
                var attributes = {
                    get: contains ? function () {
                        return my.$[name];
                    } : function () {
                        return my.$.getAttribute(name);
                    }
                };
                if (extra !== false) {
                    attributes.set = contains ? function (value) {
                        my.$[name] = value;
                    } : function (value) {
                        my.$.setAttribute(name, value + '');
                    };
                }
                v2.define(my, name, attributes);
            });
            return this;
        },
        take: function (selector, context) {
            context = context || this.$;
            if (v2.take) {
                return v2.take(selector, context);
            }
            if (v2.isString(selector)) {
                return context.querySelector(selector);
            }
            return selector;
        },
        children: function () {
            return new ArrayThen(v2.siblings(this.$.firstChild));
        },
        baseConfigs: function (option) {
            this.base = this.base || {};
            this.init = function (tag) {
                tag = tag || "div";
                var n, node, context;
                if (!option || !(node = option.$) && !(context = option.$$)) {
                    return this.$$ = document.body, this.$ = this.$$.appendChild(document.createElement(tag));
                }
                if (context) {
                    context = this.take(context, document);
                }
                context = context || document.body;
                if (node) {
                    node = this.take(node, context);
                }
                if (isArraylike(context)) context = context[0];
                if (!node) {
                    n = document.createElement(tag);
                    if (context.nodeType) {// DOM
                        context.appendChild(node = n);
                    }
                } else {
                    if (isArraylike(node)) node = node[0];
                    if (node.nodeType) {// DOM
                        context = node.parentNode;
                    }
                }
                if (!v2.nodeName(node, tag)) {
                    var html = node.outerHTML;
                    v2.append(xhtmlNode, [html.replace(rxhtmlTag, function (_all, tag_pre, tag_next) {
                        return _all.replace(tag_pre || tag_next, tag);
                    })]);
                    var next = node.nextSibling;
                    context.removeChild(node);
                    context.insertBefore(node = xhtmlNode.lastChild, next);
                }
                return this.$$ = context, this.$ = node;
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
                errorCallback = function (condition, not) {
                    if (not ? !condition : condition) {
                        v2.error('Type mismatch.An extended type is different from a base type.');
                    }
                },
                wildCards = this.wildCards || (this.wildCards = {}),
                makeCallback = function (callback, key) {
                    if (callback.control === context) return callback;
                    var _base, _value, _callback = function () {
                        _base = context.base;
                        context.base = _base.base;
                        _value = context.enumState[key];

                        _value = (!_value || _value <= 1 || _value >= 16) ?
                            applyCallback(callback, arguments, context) :
                            _value < 4 ? callback.call(context, variable) :
                                _value < 8 ?
                                    callback.call(context, context.data) :
                                    callback.call(context, variable, context.data);

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
                initControls = function (option, isArrayPro) {
                    if (!option) return option;
                    type = v2.type(option);
                    if (isArrayPro === true && type === "array") return v2.each(option, initControls);
                    tag = option.tag;
                    if (isFunction = type === "function") {
                        namespace += "." + tag;
                        option = option(context.option || {}, context);
                    }
                    tag = option.tag || tag;
                    if (tag && (fn = option[v2.camelCase(tag)]) && v2.isFunction(fn)) {
                        fn.call(context, option);
                    }
                    var _key, _value, _contains;
                    v2.each(option, function (value, key) {
                        if (key === tag || value == null) return;

                        _key = key;

                        type = v2.type(value);

                        _contains = key in context;

                        _value = _contains ? context[key] : variable[key = initWildCards(wildCards, key, type)];

                        switch (type) {
                            case "function":
                                if (match = rinject.exec(key)) {
                                    value = dependencyInjection(context, key = match[1], match[2], value);
                                }

                                if (_value = context[key]) {
                                    errorCallback(key in options ? options[key] : options[key] = v2.isFunction(_value), true);

                                    defaults[key] = value;
                                    extendsCallback(context.base, key, _value);
                                }
                                options[key] = true;
                                context[key] = value;
                                break;
                            case "array":
                            case "object":
                                if (_contains) {
                                    errorCallback(!_value || value.nodeType || v2.type(_value) === type, true);
                                    context[key] = (!_value || value.nodeType) ?
                                        value :
                                        type === "array" ?
                                            v2.merge(value, _value) :
                                            v2.improve(true, value, _value);

                                } else {
                                    variable[key] = (isFunction && !_value || value.nodeType) ?
                                        value :
                                        type === "array" ?
                                            v2.merge(_value, value) :
                                            v2.extend(true, _value, value);
                                }
                                break;
                            case "string":
                                if (key === "tag") {
                                    namespace += "." + value;
                                }
                            default:
                                if (_contains && !(key in options ? options[key] : options[key] = v2.isFunction(_value))) {
                                    context[key] = value;
                                }
                                variable[key] = value;
                                break;
                        }
                        if (isFunction) option[_key] = undefined;
                    });
                    if (isFunction) option = undefined;
                };
            v2.each(v2.use(this.tag), function (option) {
                initControls(option, true);
            });

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

            v2.defineReadonly(this, "tag", this.tag);
            v2.defineReadonly(this, "namespace", namespace);

            v2.defineReadonly(this, 'variable', variable);
            v2.defineReadonly(this, "identity", ++identity);

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
        usb: function () {
            this.define('disabled', function (value) {
                this.toggleClass('disabled', !!value);
            });
        },
        render: function (variable) {
            v2.each(this.namespace.split("."), function (tag) {
                if (rtag.test(tag)) {
                    var name = v2.camelCase(tag);
                    v2.merge(v2[name + "s"] || (v2[name + "s"] = HTMLColection(name)), [this]);
                }
            }, this);
            renderWildCard(this, variable);
        },
        commit: function () {
            if (!this.skipOn) {
                this.on(this.events);
            }
        },
        invoke: function (callbak) {
            if (v2.isString(callbak)) {
                callbak = this[callbak] || this[v2.camelCase(callbak)];
            }
            if (v2.isFunction(callbak)) {
                return callbak.apply(this, core_slice.call(arguments, 1));
            }
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
                        value = (value <= 1 | value >= 16) ?
                            this[state]() :
                            value < 4 ?
                                this[state](this.variable) :
                                value < 8 ?
                                    this[state](this.data) :
                                    this[state](this.variable, this.data);
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
        if (target && !(typeof target === 'object' || v2.isFunction(target))) {
            target = null;
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
            if (typeof option === "boolean") {
                deep = option;
                continue;
            }
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
            results = results || [];
            if (!arr) return results;
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
            return object - parseFloat(object) >= 0;
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
            "&": { //true
                type: "function",
                exec: function (control, value, key) {
                    if (value) {
                        control[key](value);
                    }
                }
            },
            "!": { //false
                type: "function",
                exec: function (control, value, key) {
                    if (!value) {
                        control[key](value);
                    }
                }
            },
            '{': { // object
                type: 'function',
                exec: function (control, value, key) {
                    if (v2.isPlainObject(value)) {
                        control[key](value);
                    }
                }
            },
            '.': { // any
                type: 'function',
                exec: function (control, value, key) {
                    if (value != null) {
                        control[key](value);
                    }
                }
            }
        }
    });

    v2.each({
        '?': 'boolean',
        '%': 'number',
        '"': 'string',
        "'": 'string',
        '<': 'date',
        '[': 'array',
        '/': 'regexp',
        ':': 'function'
    }, function (type, name) {
        v2.wildCards[name] = {
            type: 'function',
            exec: function (control, value, key) {
                if (v2.type(value) === type) {
                    control[key](value);
                }
            }
        };
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
            var fn = tag instanceof v2 ? tag : v2.fn,
                wildCards = fn.wildCards || (fn.wildCards = {});
            v2.each(option || tag, function (value, key) {
                if (key === "init") {
                    var baseConfigs = fn.baseConfigs;
                    fn.baseConfigs = function () {
                        value = applyCallback(baseConfigs, arguments, this);
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

    v2.use({
        '&focus': function () {
            try {
                this.$.focus();
            } catch (e) { }
        },
        '&show': function () {
            this.visible(true);
        },
        '&hide': function () {
            this.visible(false);
        },
        '?toggle': function (toggle) {
            if (typeof toggle === "boolean") {
                return toggle ? this.show() : this.hide();
            }
            return this.variable.visible ? this.hide() : this.show();
        },
        '?visible': function (visible) {
            this.variable.visible = !(!visible || visible === 'none');
            this.$.style.display = visible ?
                v2.isString(visible) ?
                    visible :
                    'block' :
                'none';
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
            return xhr_abort.call(this);
        }
    });

    if (typeof define === "function") {
        define("v2", [], function () { return v2; });
    }

    window.v2kit = window.v2 = v2;
});
/*!
 * JavaScript v2 v1.0.1
 * https://github.com/yepsharp/v2
 *
 ** @author hyly
 ** @date 2018-12-01
 ** @descript a valuable technology object.
 */
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = function (root, v2kit) {
            if (typeof v2kit === 'undefined') {
                if (typeof window !== 'undefined') {
                    v2kit = require('v2');
                }
                else {
                    v2kit = require('v2')(root);
                }
            }
            factory(v2kit);
            return v2kit;
        };
    } else {
        factory(v2kit);
    }
}(function (v2) {
    'use strict';
    function assert(callback) {
        var div = document.createElement("div");
        try {
            return !!callback(div);
        } catch (_) {
            return false;
        } finally {
            div = null;
        }
    };
    var whitespace = "[\\x20\\t\\r\\n\\f]";
    var matches, disconnectedMatch, querySelector, matchesSelector, outermostContext;
    var rbuggyMatches = [], rbuggyQSA = [":focus"];
    var
        runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
        funescape = function (_, letter) {
            var high = "0x" + letter - 0x10000;
            return high === high ?
                high < 0 ?
                    String.fromCharCode(high + 0x10000) :
                    String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00) :
                letter;
        };
    var rescape = /'|\\/g,
        rheader = /^h\d$/i,
        rinputs = /^(?:input|select|textarea|button)$/i,
        rsibling = /[\x20\t\r\n\f]*[+~]/,
        rnative = /^[^{]+\{\s*\[native code/,
        rquickExpr = /^((#|\.)?([\w-]*))$/,
        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        identifier = characterEncoding.replace("w", "w#"),
        operators = "([*^$|!~]?=)",
        attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
            "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

        pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace(3, 8) + ")*)|.*)\\)|)",
        rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
        rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
        rcombinators = new RegExp("^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*"),
        rpseudo = new RegExp(pseudos),
        htmlSerializeExpr = {
            "ID": new RegExp("^#(" + characterEncoding + ")"),
            "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
            "TAG": new RegExp("^(" + characterEncoding + ")"),
            "ATTR": new RegExp("^" + attributes.replace(operators, "=").replace(3, 2))
        },
        matchExpr = v2.improve({
            "ATTR": new RegExp("^" + attributes),
            "PSEUDO": new RegExp("^" + pseudos),
            "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                "*(\\d+)|))" + whitespace + "*\\)|)", "i")
        }, htmlSerializeExpr);
    v2.extend(htmlSerializeExpr, {
        "MULTI": new RegExp("^" + whitespace + "*\\*([1-9][0-9]*)"),
        "TEXT": new RegExp("^\\{(.*?)\\}" + whitespace + "*(?=[+>]|\\*|$)")
    });
    if (querySelector = rnative.test(document.querySelector)) {
        assert(function (div) {
            div.innerHTML = "<select><option selected=''></option></select>";
            if (!div.querySelector("[selected]")) {
                rbuggyQSA.push("\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)");
            }
            if (!div.querySelector(":checked")) {
                rbuggyQSA.push(":checked");
            }
        });
        assert(function (div) {
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
    var docElem = document.documentElement;
    if (matchesSelector = rnative.test(matches = docElem.matchesSelector ||
        docElem.mozMatchesSelector ||
        docElem.webkitMatchesSelector ||
        docElem.oMatchesSelector ||
        docElem.msMatchesSelector)) {
        assert(function (div) {
            disconnectedMatch = matches.call(div, "div");
            matches.call(div, "[s!='']:x");
            rbuggyMatches.push("!=", pseudos);
        });
    }
    rbuggyQSA = new RegExp(rbuggyQSA.join("|"));
    rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

    function select(selector, context) {
        if (!selector) return null;
        if (typeof selector === "string") {
            var match = rquickExpr.exec(selector);
            if (match) {
                return select.find[match[2] ? match[2] === "#" ? "ID" : "CLASS" : "TAG"](match[3], context || document);
            }
            return select.query(selector, context || document);
        }
        if (selector.nodeType === 1) return selector;
        if (isArraylike(selector)) return selector[0];
        if (selector.yep === version) return selector.$;
    };
    var
        classCache = v2.makeCache(function (string) {
            return new RegExp("(^|" + whitespace + ")" + string + "(" + whitespace + "|$)");
        }),
        ftokenCache = function (selector, parseOnly) {
            var type, match, tokens, matched, groups = [], string = selector, ready = select.ready, filter = select.filter;
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
                        value: v2.trim(matched),
                        type: match[0].replace(rtrim, " ")
                    });
                    string = string.slice(matched.length);
                }
                for (type in filter) {
                    if ((match = matchExpr[type].exec(string)) && (!ready[type] || (match = ready[type](match)))) {
                        matched = match.shift();
                        tokens.push({
                            value: v2.trim(matched),
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
            if (parseOnly) return string.length;
            return string ? v2.syntaxError(selector) : groups;
        },
        tokenCache = v2.makeCache(ftokenCache),
        fcompileCache = function (selector) {
            var matchers = v2.map(tokenize(selector), matcherFromTokens);
            return matcherFromGroupMatchers(elementMatcher(matchers, true));
        },
        compileCache = v2.makeCache(fcompileCache);

    function toSelector(tokens) {
        var
            token,
            i = 0,
            selector = "";
        while (token = tokens[i++]) {
            selector += token.value;
        }
        return selector;
    }
    function tokenize(selector) {
        return v2.map(tokenCache(selector), function (tokens) {
            return Array.prototype.slice.call(tokens);
        });
    }
    function makeFunction(callback) {
        return function () {
            return callback;
        };
    }

    v2.extend(select, {
        relative: {
            ">": { dir: "parentNode", first: true },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: true },
            "~": { dir: "previousSibling" }
        },
        find: {
            "ID": function (id, context) {
                var node, elem;
                if (context.getElementById) {
                    elem = context.getElementById(id);
                    if (elem && elem.parentNode) return elem;
                } else {
                    node = elem = document.getElementById(id);
                    while (node = node && node.parentNode) {
                        if (node === context) return elem;
                    }
                }
            },
            "TAG": function (tag, context) {
                if (tag) {
                    tag = tag.toLowerCase();
                }
                for (var node, elem = context.firstChild; elem; elem = elem.nextSibling) {
                    if (elem.nodeType === 1 && v2.nodeName(elem, tag)) {
                        return elem;
                    }
                    if (elem.childNodes && elem.childNodes.length > 0) {
                        if (node = select.find["TAG"](tag, elem)) {
                            return node;
                        }
                    }
                }
            },
            "CLASS": function (className, context) {
                var pattern = classCache(className);
                for (var node, elem = context.firstChild; elem; elem = elem.nextSibling) {
                    if (elem.nodeType === 1 && pattern.test(elem.className)) {
                        return elem;
                    }
                    if (elem.childNodes && elem.childNodes.length > 0) {
                        if (node = select.find["CLASS"](className, elem)) {
                            return node;
                        }
                    }
                }
            }
        },
        ready: {
            "ATTR": function (match) {
                match[1] = match[1].replace(runescape, funescape);
                match[3] = (match[4] || match[5] || "").replace(runescape, funescape);

                if (match[2] === "~=") {
                    match[3] = " " + match[3] + " ";
                }
                return match.slice(0, 4);
            },
            "CHILD": function (match) {
                /* matches from matchExpr["CHILD"]
                    1 type (only|nth|...)
                    2 what (child|of-type)
                    3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                    4 xn-component of xn+y argument ([+-]?\d*n|)
                    5 sign of xn-component
                    6 x of xn-component
                    7 sign of y-component
                    8 y of y-component
                */
                match[1] = match[1].toLowerCase();

                if (match[1].slice(0, 3) === "nth") {
                    if (!match[3]) {
                        Sizzle.error(match[0]);
                    }
                    match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                    match[5] = +((match[7] + match[8]) || match[3] === "odd");
                } else if (match[3]) {
                    v2.syntaxError(match[0]);
                }

                return match;
            },
            "PSEUDO": function (match) {
                var excess,
                    unquoted = !match[5] && match[2];

                if (matchExpr["CHILD"].test(match[0])) {
                    return null;
                }

                if (match[4]) {
                    match[2] = match[4];
                } else if (unquoted && rpseudo.test(unquoted) &&
                    (excess = ftokenCache(unquoted, true)) &&
                    (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                    match[0] = match[0].slice(0, excess);
                    match[2] = unquoted.slice(0, excess);
                }

                return match.slice(0, 3);
            }
        },
        filter: {
            "ID": function (id) {
                id = id.replace(runescape, unescape);
                return function (elem) {
                    if (elem.id == null) return elem.getAttribute("id") === id
                    return elem.id === id;
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
                    if (elem.className == null) return pattern.test(elem.getAttribute("class"));
                    return pattern.test(elem.className);
                }
            },
            "ATTR": function (name, operator, check) {
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
                                                false;
                };
            },
            "CHILD": function (type, what, _argument, first, last) {
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
                var callback = select.pseudos[pseudo];
                if (callback) return callback(selector);
                throw new Error();
            }
        },
        pseudos: {
            "focus": makeFunction(function (elem) {
                return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
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
                var matcher = compileCache(selector.replace(rtrim, "$1"));
                return function (elem) {
                    return !!matcher(elem, false, elem);
                };
            },
            "not": function (selector) {
                var matcher = compileCache(selector.replace(rtrim, "$1"));
                return function (elem) {
                    return !matcher(elem, false, elem);
                };
            },
            "has": function (selector) {
                return function (elem) {
                    return select(selector, elem) != null;
                };
            },
            "contains": function (text) {
                return function (elem) {
                    return (elem.textContent || elem.innerText || v2.text(elem)).indexOf(text) > -1;
                };
            },
            "selected": makeFunction(function (elem) {
                if (elem.parentNode) {
                    elem.parentNode.selectedIndex;
                }

                return elem.selected === true;
            }),
            "parent": makeFunction(function (elem) {
                return !select.pseudos["empty"](elem);
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
        query: function (selector, context) {
            var i, old, nid, groups, newSelector, newContext, nodeType = context.nodeType;
            if (!(nodeType === 1 || nodeType === 9)) return null;
            if (querySelector && !rbuggyQSA.test(selector)) {
                old = true;
                newContext = context;
                newSelector = nodeType === 9 && selector;
                if (nodeType === 1 && !v2.nodeName(context, "object")) {
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
            return compileCache(selector.replace(rtrim, "$1"))(context, rsibling.test(selector));
        }
    });

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

    function elementMatcher(matchers, sample) {
        sample = !!sample;
        return matchers.length == 1 ? matchers[0] : function (elem, context) {
            var i = matchers.length;
            while (i--) {
                if (!!matchers[i](elem, context) === sample) {
                    return sample;
                }
            }
            return !sample;
        };
    };

    function matcherFromTokens(tokens) {
        var token, checkContext, matcher,
            leadingRelative = select.relative[tokens[0].type],
            implicitRelative = leadingRelative || select.relative[" "],
            i = leadingRelative ? 1 : 0,
            matchContext = addCombinator(function (elem) {
                return elem === checkContext;
            }, implicitRelative, true),
            matchAnyContext = addCombinator(function (elem) {
                return core_indexOf.call(checkContext, elem) > -1;
            }, implicitRelative, true),
            matchers = [function (elem, context) {
                return (!leadingRelative && context !== outermostContext) || (
                    (checkContext = context).nodeType ?
                        matchContext(elem, context) :
                        matchAnyContext(elem, context));
            }];
        while (token = tokens[i++]) {
            if (matcher = select.relative[token.type]) {
                matchers = [addCombinator(elementMatcher(matchers), matcher)];
            } else {
                matchers.push(select.filter[token.type].apply(null, token.matches));
            }
        }
        return elementMatcher(matchers);
    }

    function matcherFromGroupMatchers(matcher) {
        return function (context, expandContext, matches) {
            var elem,
                i = 0,
                contextBackup = outermostContext,
                elems = !matches && (expandContext && context.parentNode || context).getElementsByTagName("*");
            if (expandContext) {
                outermostContext = context !== document && context;
            }
            if (matches) {
                elem = matcher(matches, context);
            } else {
                while ((elem = elems[i++]) != null) {
                    if (elem.nodeType == 1 && matcher(elem, context)) break;
                }
            }
            if (expandContext) {
                outermostContext = contextBackup;
            }
            contextBackup = null;
            return elem;
        };
    }

    var support_tbody, support_htmlSerialize, support_leadingWhitespace;

    assert(function (div) {
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        support_tbody = !div.getElementsByTagName("tbody").length;
        support_htmlSerialize = !!div.getElementsByTagName("link").length;
        support_leadingWhitespace = div.firstChild.nodeType === 3;
    });

    var
        rhtml = /<|&#?\w+;/,
        rtbody = /<tbody/i,
        rtagName = /<([\w:]+)/,
        rleadingWhitespace = /^\s+/,
        rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        wrapMap = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: support_htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
        "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video";
    function createSafeFragment(document) {
        var list = nodeNames.split("|"),
            safeFrag = document.createDocumentFragment();

        if (safeFrag.createElement) {
            while (list.length) {
                safeFrag.createElement(
                    list.pop()
                );
            }
        }
        return safeFrag;
    }

    function buildFragment(elems, context, selection) {
        var l, tag, wrap, node, elem,
            i = 0,
            nodes = [],
            length = elems.length,
            safe = createSafeFragment(context);
        for (; i < length; i++) {
            elem = elems[i];
            if (elem || elem === 0) {
                if (v2.type(elem) === "object") {
                    v2.merge(nodes, elem.nodeType ? [elem] : elem);
                } else if (!rhtml.test(elem)) {
                    nodes.push(context.createTextNode(elem));
                } else {
                    node = node || safe.appendChild(context.createElement("div"));
                    tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                    wrap = wrapMap[tag] || wrapMap._default;
                    node.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
                    l = wrap[0];
                    while (l--) { node = node.lastChild; }
                    if (!support_leadingWhitespace && rleadingWhitespace.test(elem)) {
                        nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]));
                    }
                    if (!support_tbody) {
                        elem = tag === "table" && !rtbody.test(elem) ?
                            node.firstChild :
                            wrap[1] === "<table>" && !rtbody.test(elem) ?
                                node :
                                0;

                        l = elem && elem.childNodes.length;
                        while (l--) {
                            if (v2.nodeName((tbody = elem.childNodes[j]), "tbody") && !tbody.childNodes.length) {
                                elem.removeChild(tbody);
                            }
                        }
                    }
                    v2.merge(nodes, node.childNodes);

                    node.textContent = "";

                    while (node.firstChild) {
                        node.removeChild(node.firstChild);
                    }

                    node = safe.lastChild;
                }
            }
        }
        if (node) {
            safe.removeChild(node);
        }
        i = 0;
        while (elem = nodes[i++]) {
            if (selection && elem === selection) {
                continue;
            }
            safe.appendChild(elem);
        }
        node = null;
        return safe;
    }
    function findOrAppend(elem, tag) {
        return elem.getElementsByTagName(tag)[0] || elem.appendChild(elem.ownerDocument.createElement(tag));
    }
    v2.matches = function (elem, expr) {
        expr = expr.replace(rattributeQuotes, "='$1']");
        if (matchesSelector && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr)) {
            try {
                var r = matches.call(elem, expr);
                if (r || disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
                    return r;
                }
            } catch (e) { }
        }
        return compileCache(expr)(document, rsibling.test(expr), elem);
    };

    function returnFalse() {
        return false;
    }
    function makeFn(selector, fn) {
        var r, callback;
        if (!selector || !v2.isString(selector)) return fn.propagation || (fn.propagation = function (e) {
            if ((r = fn.call(this, e)) === false) {
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
            }
            return r;
        });
        if (fn[selector]) return fn[selector];
        callback = function (e) {
            var elem = e.target || e.srcElement;
            if (elem.nodeType && (!e.button || e.type !== "click")) {
                for (; elem != this; elem = elem.parentNode || this) {
                    if (elem.nodeType === 1 && (elem.disabled !== true || e.type !== "click") && v2.matches(elem, selector)) {
                        if ((r = fn.call(elem, e)) === false) {
                            if (e.preventDefault) e.preventDefault();
                            if (e.stopPropagation) e.stopPropagation();
                        }
                        return r;
                    }
                }
            }
        };
        fn[selector] = callback;
        return callback;
    }
    var rnotwhite = /\S+/g;
    var getStyles, opacity_surpport, cssFloat_surpport, clearCloneStyle_surpport,
        ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity\s*=\s*([^)]*)/,
        numberSource = '[+-]?(?:\\d*\\.|)\\d+(?:[eE][+-]?\\d+|)',
        rnumnonpx = new RegExp("^(" + numberSource + ")(?!px)[a-z%]+$", "i"),
        rcssNum = new RegExp("^(?:([+-])=|)(" + numberSource + ")([a-z%]*)$", "i"),

        cssNormalTransform = {
            letterSpacing: 0,
            fontWeight: 400
        },
        cssPrefixes = ["Webkit", "O", "Moz", "ms"];
    assert(function (div) {
        var style = div.style;
        style.cssText = "background-clip:content-box;float:left;opacity:.5";
        opacity_surpport = style.opacity === "0.5";
        cssFloat_surpport = !!style.cssFloat;
        div.cloneNode(true).style.backgroundClip = "";
        clearCloneStyle_surpport = div.style.backgroundClip === "content-box";
    });
    var getStyles = function (elem) {
        var view = elem.ownerDocument.defaultView;

        if (!view || !view.opener) {
            view = window;
        }

        return view.getComputedStyle(elem);
    };

    function curCSS(elem, name, computed) {
        var width, minWidth, maxWidth, r, style = elem.style;

        computed = computed || getStyles(elem);
        if (computed) {
            r = computed.getPropertyValue(name) || computed[name];

            if (r === "" && !v2.contains(elem.ownerDocument, elem)) {
                r = v2.style(elem, name);
            }
            if (rnumnonpx.test(r) && rboxStyle.test(name)) {

                width = style.width;
                minWidth = style.minWidth;
                maxWidth = style.maxWidth;

                style.minWidth = style.maxWidth = style.width = r;
                r = computed.width;

                style.width = width;
                style.minWidth = minWidth;
                style.maxWidth = maxWidth;
            }
        }

        return r === undefined ? r : r + "";
    }

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
    function adjustCSS(elem, prop, valueParts) {
        var adjusted, scale,
            maxIterations = 20,
            initial = v2.css(elem, prop, ""),
            unit = valueParts && valueParts[3] || (v2.cssNumber[prop] ? "" : "px"),
            initialInUnit = (v2.cssNumber[prop] || unit !== "px" && +initial) &&
                rcssNum.exec(v2.css(elem, prop));

        if (initialInUnit && initialInUnit[3] !== unit) {

            initial = initial / 2;

            unit = unit || initialInUnit[3];

            initialInUnit = +initial || 1;

            while (maxIterations--) {
                v2.style(elem, prop, initialInUnit + unit);
                if ((1 - scale) * (1 - (scale = v2.css(elem, prop, "") / initial || 0.5)) <= 0) {
                    maxIterations = 0;
                }
                initialInUnit = initialInUnit / scale;
            }

            initialInUnit = initialInUnit * 2;
            v2.style(elem, prop, initialInUnit + unit);
            valueParts = valueParts || [];
        }

        if (valueParts) {
            initialInUnit = +initialInUnit || +initial || 0;
            adjusted = valueParts[1] ?
                initialInUnit + (valueParts[1] + 1) * valueParts[2] :
                +valueParts[2];
        }
        return adjusted;
    }
    v2.extend({
        propFix: {
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
        },
        cssHooks: {
            opacity: {
                get: function (elem, computed) {
                    if (computed) {
                        var ret = curCSS(elem, "opacity");
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },
        cssNumber: {
            "columnCount": true,
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },
        cssProps: {
            "float": cssFloat_surpport ? "cssFloat" : "styleFloat"
        },
        contains: rnative.test(docElem.compareDocumentPosition) || rnative.test(docElem.contains) ?
            function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                    bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (
                    adown.contains ?
                        adown.contains(bup) :
                        a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
                ));
            } :
            function (a, b) {
                if (b) {
                    while ((b = b.parentNode)) {
                        if (b === a) {
                            return true;
                        }
                    }
                }
                return false;
            },
        on: function (elem, types, fn, selector) {
            if (fn === false) {
                fn = returnFalse;
            }
            if (!elem || !types || !fn) return;
            var i = 0, type;
            fn = makeFn(selector, fn);
            types = types.match(rnotwhite) || [];
            while (type = types[i++]) {
                if (elem.addEventListener) {
                    elem.addEventListener(type, fn, false);
                } else if (elem.attachEvent) {
                    elem.attachEvent("on" + type, fn);
                }
            }
        },
        off: function (elem, types, fn, selector) {
            if (fn === false) {
                fn = returnFalse;
            }
            if (!elem || !types || !fn || !(selector && v2.isString(selector) ? fn = fn[selector] : fn = fn.propagation)) return;
            var i = 0, type;
            types = types.match(rnotwhite) || [];
            while (type = types[i++]) {
                if (elem.removeEventListener) {
                    elem.removeEventListener(type, fn, false);
                } else if (elem.detachEvent) {
                    elem.detachEvent("on" + type, fn);
                }
            }
        },
        addClass: function (elem, value) {
            var i = 0, pattern, type = v2.type(value), clazz = elem.className;
            if (type === "function") {
                return v2.addClass(elem, value.call(elem, clazz));
            }
            if (type === "string") {
                value = value.match(rnotwhite);
                while (type = value[i++]) {
                    pattern = classCache(type);
                    if (!pattern.test(clazz)) {
                        clazz += " " + type;
                    }
                }
                elem.className = v2.trim(clazz.replace(rclass, " "));
            }
        },
        removeClass: function (elem, value) {
            var i = 0, pattern, type = v2.type(value), clazz = elem.className;
            if (type === "function") {
                return v2.removeClass(elem, value.call(elem, clazz));
            }
            if (type === "string") {
                value = value.match(rnotwhite);
                while (type = value[i++]) {
                    pattern = classCache(type);
                    if (pattern.test(clazz)) {
                        clazz = clazz.replace(pattern, " ");
                    }
                }
                elem.className = v2.trim(clazz.replace(rclass, " "));
            }
        },
        toggleClass: function (elem, value, toggle) {
            if (typeof toggle === 'boolean') {
                return toggle ? v2.addClass(elem, value) : v2.removeClass(elem, value);
            }
            return v2.hasClass(elem, value) ? v2.removeClass(elem, value) : v2.addClass(elem, value);
        },
        hasClass: function (elem, value) {
            return classCache(value).test(elem.className);
        },
        attr: function (elem, name, value) {
            if (value === undefined) {
                return elem.getAttribute(name);
            }
            if (value === null) {
                return v2.removeAttr(elem, name);
            }
            elem.setAttribute(name, value + "");
        },
        removeAttr: function (elem, value) {
            var i = 0, name;
            value = value.match(rnotwhite);
            while (name = value[i++]) {
                elem.removeAttribute(name);
            }
        },
        prop: function (elem, name, value) {
            name = v2.propFix[name] || name;
            if (value === undefined) {
                return elem[name];
            }
            if (value === null) {
                return v2.removeProp(elem, name);
            }
            elem[name] = value;
        },
        removeProp: function (elem, value) {
            var i = 0, name;
            value = value.match(rnotwhite);
            while (name = value[i++]) {
                name = v2.propFix[name] || name;
                try {
                    delete elem[name];
                } catch (_) {
                    elem[name] = undefined;
                }
            }
        },
        swap: function (elem, options, callback, args) {
            var r, name, map = {};

            for (name in options) {
                map[name] = elem.style[name];
                elem.style[name] = options[name];
            }

            r = callback.apply(elem, args || []);

            for (name in options) {
                elem.style[name] = map[name];
            }

            return r;
        },
        style: function (elem, name, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }
            var r, type, hooks,
                origName = v2.camelCase(name),
                style = elem.style;
            name = v2.cssProps[name] || (v2.cssProps[name] = vendorPropName(style, name) || name);
            hooks = v2.cssHooks[name] || v2.cssHooks[origName];
            if (value !== undefined) {
                type = typeof value;
                if (type === "string" && (r = rcssNum.exec(value)) && r[1]) {
                    value = adjustCSS(elem, name, r);
                    type = "number";
                }
                if (value == null || value !== value) {
                    return;
                }

                if (type === "number") {
                    value += r && r[3] || (v2.cssNumber[origName] ? "" : "px");
                }

                if (!clearCloneStyle_surpport && value === "" && name.indexOf("background") === 0) {
                    style[name] = "inherit";
                }

                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
                    style[name] = value;
                }

            } else {
                if (hooks && "get" in hooks && (r = hooks.get(elem, false, extra)) !== undefined) {
                    return r;
                }
                return style[name];
            }
        },
        css: function (elem, name, extra, styles) {
            var num, val, hooks,
                origName = v2.camelCase(name);
            name = v2.cssProps[origName] || (v2.cssProps[origName] = vendorPropName(elem.style, origName));

            hooks = v2.cssHooks[name] || v2.cssHooks[origName];

            if (hooks && "get" in hooks) {
                val = hooks.get(elem, true, extra);
            }

            if (val === undefined) {
                val = curCSS(elem, name, styles);
            }

            if (val === "normal" && name in cssNormalTransform) {
                val = cssNormalTransform[name];
            }

            if (extra === "" || extra) {
                num = parseFloat(val);
                return extra === true || v2.isNumber(num) ? num || 0 : val;
            }
            return val;
        }
    });

    if (!opacity_surpport) {
        v2.cssHooks.opacity = {
            get: function (elem, computed) {
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
                    (0.01 * parseFloat(RegExp.$1)) + "" :
                    computed ? "1" : "";
            },

            set: function (elem, value) {
                var style = elem.style,
                    currentStyle = elem.currentStyle,
                    opacity = v2.isNumber(value) ? "alpha(opacity=" + value * 100 + ")" : "",
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

    v2.extend({
        siblings: function (elem, node) {
            var r = [];
            for (; elem; elem = elem.nextSibling) {
                if (elem.nodeType === 1 && elem !== node) {
                    r.push(elem);
                }
            }
            return r;
        },
        sibling: function (elem, dir) {
            do {
                elem = elem[dir];
            } while (elem && elem.nodeType !== 1);
            return elem;
        },
        dir: function (elem, dir) {
            var r = [],
                n = elem[dir];

            while (n && n.nodeType !== 9) {
                if (n.nodeType === 1) {
                    r.push(n);
                }
                n = n[dir];
            }
            return r;
        },
        domManip: function (elem, args, table, callback) {
            var first, fragment;
            fragment = buildFragment(args, elem.ownerDocument, elem);
            first = fragment.firstChild;
            if (fragment.childNodes.length === 1) {
                fragment = first;
            }
            if (first) {
                table = table && v2.nodeName(first, "tr");
                r = callback.call(
                    table ?
                        findOrAppend(elem, "tbody") :
                        elem,
                    fragment
                );
            }
            fragment = first = null;
        },
        append: function (elem, args) {
            return v2.domManip(elem, args, true, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    this.appendChild(elem);
                }
            });
        },
        prepend: function (elem, args) {
            return v2.domManip(elem, args, true, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    this.insertBefore(elem, this.firstChild);
                }
            });
        },
        before: function (elem, args) {
            return v2.domManip(elem, args, false, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this);
                }
            });
        },
        after: function (elem, args) {
            return v2.domManip(elem, args, false, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                }
            });
        },
        replaceWith: function (elem, value) {
            return v2.domManip(elem, [value], true, function (elem) {
                var next = this.nextSibling,
                    parent = this.parentNode;
                if (parent) {
                    parent.removeChild(this);
                    parent.insertBefore(elem, next);
                }
            });
        },
        empty: function (elem) {
            var node;
            if (elem && (node = elem.firstChild)) {
                do {
                    elem.removeChild(node);
                } while (node = node.nextSibling);
            }
            return elem;
        },
        text: function (elem) {
            var r = "",
                nodeType = elem.nodeType;
            if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                if (typeof elem.textContent === "string") {
                    return elem.textContent;
                } else if (typeof elem.innerText === 'string') {
                    return elem.innerText;
                } else {
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        r += v2.text(elem);
                    }
                }
            } else if (nodeType === 3 || nodeType === 4) {
                return elem.nodeValue;
            }
            return r;
        }
    });

    v2.each('append prepend before after empty'.split(' '), function (name) {
        v2.fn[name] = function () {
            return v2[name](this.$, arguments), this;
        };
    });
    function access(vm, fn, key, value, elem, chainable, raw) {
        elem = elem || vm.$;

        var i = 0, bulk = key == null;

        if (v2.type(key) === "object") {
            chainable = true;
            elem = value || vm.$;
            for (i in key) {
                access(vm, fn, i, key[i], elem, true, raw);
            }
        } else if (value !== undefined) {
            chainable = true;

            if (!v2.isFunction(value)) {
                raw = true;
            }

            if (bulk) {
                if (raw) {
                    fn(elem, value);
                    fn = null;
                } else {
                    bulk = fn;
                    fn = function (elem, _key, value) {
                        return bulk(elem, value);
                    };
                }
            }

            if (fn) {
                fn(elem, key, raw ? value : value.call(elem, i, fn(elem, key)));
            }
        }

        return chainable ?
            vm :
            bulk ?
                fn(elem) :
                fn(elem, key);
    }
    var rclass = /[\t\r\n]/g,
        rcssText = /^([+-/*]=)?([+-]?(?:[0-9]+\.)?[0-9]+)/i;
    v2.use({
        hasClass: function (value) {
            return v2.hasClass(this.$, value);
        },
        '"addClass': function (value) {
            return v2.addClass(this.$, value), this;
        },
        toggleClass: function (value, toggle) {
            return v2.toggleClass(this.$, value, toggle), this;
        },
        '.width': function (width) {
            var match = rcssText.exec(width);
            if (match) {
                if (match[1]) {
                    try {
                        this.variable.width = (new Function("v", "return v" + match[1] + match[2]))(this.variable.width || v2.css(this.limitVerticalElement || this.$, "width") >> 0);
                    } catch (_) {
                        return false;
                    }
                } else {
                    this.variable.width = +match[2];
                }
                v2.style(this.limitHorizontalElement || this.$, this.limit ? "max-width" : "width", this.variable.width);
                return true;
            }
        },
        '.height': function (height) {
            var match = rcssText.exec(height);
            if (match) {
                if (match[1]) {
                    try {
                        this.variable.height = (new Function("v", "return v" + match[1] + match[2]))(this.variable.height || v2.css(this.limitVerticalElement || this.$, "height") >> 0);
                    } catch (_) {
                        return false;
                    }
                } else {
                    this.variable.height = +match[2];
                }
                v2.style(this.limitVerticalElement || this.$, this.limit ? "max-height" : "height", this.variable.height);
                return true;
            }
        },
        empty: function () {
            return v2.empty(this.$), this;
        },
        domManip: function (args, table, callback) {
            return v2.domManip(this.$, args, table, callback);
        },
        '{css': function (name, value, elem) {
            return access(this, function (elem, name, value) {
                var i = 0, len, map, styles;
                if (v2.isArray(name)) {
                    styles = getStyles(elem);
                    len = name.length;
                    map = {};
                    for (; i < len; i++) {
                        map[name[i]] = v2.css(elem, name[i], false, styles);
                    }
                    return map;
                }

                return value === undefined ?
                    v2.css(elem, name) :
                    v2.style(elem, name, value);
            }, name, value, elem, arguments.length > 1);
        },
        '{attr': function (name, value, elem) {
            return access(this, function (elem, name, value) {
                var i = 0, len, map;
                if (v2.isArray(name)) {
                    len = name.length;
                    map = {};
                    for (; i < len; i++) {
                        map[name[i]] = v2.attr(elem, name[i]);
                    }
                    return map;
                }
                return v2.attr(elem, name, value);
            }, name, value, elem, arguments.length > 1);
        },
        '{prop': function (name, value, elem) {
            return access(this, function (elem, name, value) {
                var i = 0, len, map;
                if (v2.isArray(name)) {
                    len = name.length;
                    map = {};
                    for (; i < len; i++) {
                        map[name[i]] = v2.prop(elem, name[i]);
                    }
                    return map;
                }
                return v2.prop(elem, name, value);
            }, name, value, elem, arguments.length > 1);
        }
    });

    v2.each("on off".split(' '), function (name) {
        v2.fn[name] = function (type, selector, fn) {
            if (arguments.length < 3) {
                fn = selector;
                selector = undefined;
            }
            if (v2.isPlainObject(type)) {
                return v2.each(type, function (callback, type) {
                    this[name](type, selector, callback);
                }, this), this;
            }
            if (v2.isString(fn)) {
                var control = this;
                if (fn in control) {
                    fn = control[fn];
                } else {
                    do {
                        if (fn in control.methods) {
                            fn = control.methods[fn];
                            break;
                        }
                    } while (control = control.owner);
                }
                control = null;
            }
            if (type[0] === '$') {
                type = type.slice(1);
                fn = fn[this.identity] || (fn[this.identity] = (function (context, callback) {
                    return function (e) {
                        return callback.call(context, e);
                    };
                })(this, fn));
            }
            return v2[name](this.$, type, fn, selector), this;
        };
    });
    v2.each("removeClass removeAttr removeProp".split(' '), function (name) {
        v2.fn[name] = function (value) {
            return v2[name](this.$, value), this;
        };
    });

    v2.take = select;

    var
        rchild = new RegExp("^" + whitespace + "*>"),
        rgroup = new RegExp("^" + whitespace + "*\\("),
        rcombinators2 = new RegExp("^" + whitespace + "*([>+])" + whitespace + "*"),
        rsingleTag = /area|br|col|embed|hr|img|input|link|meta|param/i,
        fhtmlSerializeCache = function (selector) {
            var i, charAt, counter, token, type, match, matched, groups = [], string = selector, serialize = htmlSerialize.serialize;
            while (string) {
                if (!matched || (match = rcombinators2.exec(string))) {
                    groups.unshift(token = {});
                    if (match) {
                        token.type = v2.trim(matched = match.shift());
                        string = string.slice(matched.length);
                    }
                    if (match = rgroup.exec(string)) {
                        i = 0;
                        counter = 1;
                        matched = match.shift();
                        string = string.slice(matched.length);
                        while (charAt = string[i++]) {
                            if (charAt === "(") {
                                counter++;
                            } else if (charAt === ")") {
                                if (counter === 1) break;
                                counter--;
                            }
                        }
                        token.groups = htmlSerializeCache(string.slice(0, i - 1));
                        if (rchild.test(string = string.slice(i))) break;
                        continue;
                    }
                }
                matched = false;
                for (type in htmlSerializeExpr) {
                    if (match = htmlSerializeExpr[type].exec(string)) {
                        matched = match.shift();
                        if (type in serialize) {
                            token[type] = token[type] || [];
                            token[type].push(serialize[type](match));
                        } else {
                            token[type] = match[0];
                        }
                        string = string.slice(matched.length);
                    }
                }
                if (!matched) break;
            }
            return string ? v2.syntaxError(selector) : groups;
        },
        htmlSerializeCache = v2.makeCache(fhtmlSerializeCache),
        htmlDeserialize = function (groups) {
            var i = 0, html, token, next;
            while (token = groups[i++]) {
                if (!html) {
                    html = token.groups ? htmlDeserialize(token.groups) : htmlDeserializeToken(token);
                }
                if (next = groups[i]) {
                    if (next.groups) {
                        html = htmlDeserialize(next.groups) + html;
                    } else {
                        html = htmlDeserializeToken(next, token.type, html);
                    }
                }
            }
            return html;
        },
        htmlDeserializeToken = function (token, relative, xhtml) {
            var type,
                htmls,
                multi = +token["MULTI"],
                tag = token["TAG"] || "div",
                html = ['<' + tag],
                content = token["TEXT"] || "",
                deserialize = htmlSerialize.deserialize;
            for (type in deserialize) {
                if (type in token) {
                    html.push(' ');
                    html.push(deserialize[type](token[type]));
                }
            }
            if (rsingleTag.test(tag)) {
                html.push('/>');
            } else {
                html.push('>');
                html.push(content);
                if (relative === ">") html.push(xhtml);
                html.push('</' + tag + '>');
            }
            html = html.join('');
            if (multi > 0) {
                htmls = [];
                while (multi--) {
                    htmls.unshift(html.replace("$", multi + 1));
                }
                html = htmls.join('');
            }
            if (relative === "+") html += xhtml;
            return html;
        };

    function htmlSerialize(selector) {
        return htmlDeserialize(htmlSerializeCache(selector));
    };
    function Attr(name, value) {
        this.name = name;
        this.value = value;
    }
    Attr.prototype.toString = function () {
        return this.name + '="' + this.value + '"';
    };
    v2.extend(htmlSerialize, {
        serialize: {
            "CLASS": function (match) {
                return match[0];
            },
            "ATTR": function (match) {
                return new Attr(match[0].replace(runescape, funescape), (match[2] || match[3] || "").replace(runescape, funescape));
            }
        },
        deserialize: {
            "ID": function (id) {
                return 'id="' + id + '"';
            },
            "CLASS": function (arr) {
                return 'class="' + arr.join(' ') + '"';
            },
            "ATTR": function (arr) {
                return arr.join(' ');
            }
        }
    });
    v2.htmlSerialize = htmlSerialize;

    v2.extend(v2.wildCards, {
        "#": { // html
            type: "string",
            exec: function (_control, value) {
                if (v2.isString(value)) return v2.htmlSerialize(value);
            }
        }
    });
}));