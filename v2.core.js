(function (v2, factory) {
    var isReady,
        readyWait = 0,
        loadCache = {},
        readyCache = {},
        readyConfig = {},
        completeCache = {},
        requiredCache = {},
        loadCallbacks = {},
        readyList = v2.Callbacks("stack memory"),
        execCb = function (supports, callback) {
            try {
                return callback.apply(null, v2.map(supports, function (code) {
                    if (code in completeCache) return completeCache[code];
                    if (code in readyCache) return completeCache[code] = readyCache[code]();
                }));
            } catch (e) {
                v2.log(e.message);
                return false;
            }
        },
        makeExecCb = function (supports, factory) {
            var isReady, readyData;
            return function () {
                if (isReady) return readyData;
                return isReady = true, readyData = execCb(supports, factory);
            };
        },
        readyLoadBefore = function (code) {
            requiredCache[code] = true;
            var i = 0, callback, codeArray;
            if (codeArray = loadCallbacks[code]) {
                while (callback = codeArray[i++]) {
                    if (callback(code) < 1) {
                        codeArray.splice(--i, 1);
                    }
                }
            }
        },
        readyLoadAfter = function (code) {
            if (isReady = readyWait === 1) {
                readyList.fire();
            }
            return readyWait -= 1;
        };
    function require(code, supports, callback) {
        var isReady,
            readyCallback,
            readyLoad = function () {
                if (isReady = context.readyWait === 1) {
                    if (readyCallback) readyCallback();
                }
                return context.readyWait -= 1;
            },
            context = factory({
                load: function (code) {
                    readyLoadBefore(code);
                    readyLoad(code);
                    readyLoadAfter(code);
                },
                execCb: execCb,
                require: function (code, supports, callback) {
                    if (code) {
                        context.readyWait += 1;
                        if (code in loadCache) {
                            if (loadCallbacks[code]) {
                                loadCallbacks[code].push(readyLoad);
                            } else {
                                loadCallbacks[code] = [readyLoad];
                            }
                        } else {
                            readyWait += 1;
                            context.load(loadCache[code] = code);
                        }
                    }
                    if (!callback) return !!code;
                    if (supports) {
                        readyCallback = callback = makeExecCb(supports, callback);
                    }
                    if (code) {
                        return readyCache[code] = callback;
                    }
                }
            });
        context.config(readyConfig);
        v2.each(supports, function (code) {
            context.require(code);
        });
        context.require(code, supports, callback);
        return function () {
            return isReady || (isReady = readyCallback() || true);
        };
    }
    /**
     * @param {String} code
     * @param {Array<String>} supports
     * @param {Function} factory
     */
    function run(code, supports, factory) {
        if (arguments.length === 1) {
            factory = code;
            code = undefined;
        } else if (arguments.length === 2) {
            factory = supports;
            if (v2.isArray(code)) {
                supports = code;
                code = undefined;
            } else {
                supports = undefined;
            }
        }
        if (v2.isFunction(factory)) {
            if (!supports || v2.every(supports, function (code) {
                return code in completeCache;
            })) {
                if (code) {
                    return readyCache[code] = supports ? makeExecCb(supports, factory) : factory;
                }
                return supports ? execCb(supports, factory) : readyList.add(factory);
            };
            readyList.addHeadReverse(require(code, supports, factory));
        }
    };

    run.isReady = function (code) {
        return !!(code ? requiredCache[code] : isReady);
    };

    v2.config = function (cfg) {
        v2.extend(true, readyConfig, cfg);
    };

    return v2.run = run;

})(v2Kit, function (rootConfig) {
    rootConfig = rootConfig || {};
    var locationPath = v2.location.path,
        baseElement = v2.jqueryEx('base'),
        head = baseElement ? baseElement.parentNode : document.head || v2.jqueryEx('head'),
        readyRegExp = navigator.platform === 'PLAYSTATION 3'
            ? /^complete$/
            : /^(complete|loaded)$/,
        rrelative = /^(\.?\.\/)/,
        rjs = /^:|#|\?|\.js$/,
        rsplit = /[^\/]+/g,
        rmap = /^[\w-]+(\.[\w-]+)*/,
        rpackageOrPath = /^[\w-]+(\.[\w-]+)*$/,
        rslash = /[\\\\|\/\/]{2,}/g,
        rnative = /^[^{]+\{\s*\[native code/,
        isOpera = !!isOpera && opera.toString() === '[object Opera]',
        context = {
            readyWait: 0,
            load: function (/*code*/) { },
            require: function (/*code, supports, factory*/) { }
        },
        config = {
            version: "1.0.0.0",
            baseUrl: "/",
            map: {},//当前页面路径映射
            paths: {},//路径
            packages: {}//包关系,例如：alter = > dialog
        };

    function load(e) {
        var code, node = e.target || e.currentTarget || e.srcElement;

        if (e.type === "load" || readyRegExp.test(node.readyState)) {

            code = config.xhtml ? node.getAttributeNS("http://www.w3.org/1999/xhtml", "data-code") : node.getAttribute("data-code");

            rootConfig.load(code);

            if (node.detachEvent && !isOpera) {
                node.detachEvent("onreadystatechange", load);
            } else {
                node.removeEventListener("load", load, false);
            }
        }
    }
    var self = {
        nameToUrl: function (code) {
            if (rjs.test(code)) return code;
            var mapUrl, baseUrl = config.baseUrl, baseArr = baseUrl.match(rsplit) || [];
            if (rpackageOrPath.test(code)) {
                code = config.packages[code] || code;//处理包关系

                code = config.paths[code] || code;//处理路径
            }
            while (rrelative.test(code) && baseArr.pop()) {//修复相对路径问题
                code = code.slice(RegExp.$1.length);
            }

            if (baseUrl = baseArr.join("/")) {
                baseUrl = "/" + baseUrl + "/";
            }

            if (rmap.test(code)) {
                if ((mapUrl = config.map[locationPath]) && (mapUrl = mapUrl[code] || mapUrl["*"])
                    || (mapUrl = config.map["*"]) && (mapUrl = mapUrl[code] || mapUrl["*"])) {//处理映射关系
                    code = mapUrl + "/" + code;
                }
            }
            if (rjs.test(code)) return code;
            if (!v2.debug) {
                code += ".min";
            }
            return (baseUrl + code + ".js?version=" + (config.version || "1.0.0.0")).replace(rslash, "/");
        },
        config: function (cfg) {
            var type;
            v2.each(cfg, function (value, key) {
                key = v2.camelCase(key);
                if (key === "baseUrl") {
                    return config[key] = value.charAt(value.length - 1) === "/" ? value : value + "/";
                }
                type = v2.type(value);
                if (type === "string"
                    || type === "boolean"
                    || type === "number") return config[key] = value;
                if (type === "object") return config[key] = v2.extend(config[key], value);
            });
        },
        load: function (code) {
            var node = config.xhtml ?
                document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") :
                document.createElement("script");
            node.type = "text/javascript";
            node.charset = "utf-8";
            node.defer = node.async = true;
            if (config.xhtml) {
                node.setAttributeNS("http://www.w3.org/1999/xhtml", "data-code", code);
            } else {
                node.setAttribute("data-code", code);
            }
            if (node.attachEvent && !isOpera && rnative.test(node.attachEvent)) {
                node.attachEvent("onreadystatechange", load);
            } else {
                node.addEventListener("load", load, false);
            }
            node.src = rootConfig.nameToUrl(code);
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            return node;
        }
    };
    return v2.extend(context, v2.improve(rootConfig, self), self);
});

(function (v2) {
    var controlsPath, v2kitPath,
        core_version = "1.0.2.0",
        core_slice = Array.prototype.slice,
        rv2 = /\/(v2(\.min)?\.js(?:\?.*)?)$/i,
        rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        ajaxLocParts = rurl.exec(v2.location.href) || [],
        isLocal = rlocalProtocol.test(v2.location.protocol);

    (function (scripts) {
        var i = 0, script;
        while (script = scripts[i++]) {
            if (rv2.test(script.src)) {
                return v2kitPath = script.src.slice(0, -RegExp.$1.length), controlsPath = v2kitPath + "controls/";
            }
        }
    })(document.scripts || document.getElementsByTagName("script"));

    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch (_) { }
    }

    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (_) { }
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (_) { }
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (_) { }
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP");
        } catch (_) { }
    }
    var ajax = {
        xhr: window.ActiveXObject ? function () {
            return !isLocal && createStandardXHR() || createActiveXHR();
        } : createStandardXHR,
        done: function (url) {
            var xhr = ajax.xhr();
            var parts = rurl.exec(url.toLowerCase());
            var crossDomain = !!(parts &&
                (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] ||
                    (parts[3] || (parts[1] === "http:" ? 80 : 443)) !=
                    (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443)))
            );
            xhr.open("GET", url, false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var status = xhr.status;
                    if (!status && isLocal && !crossDomain) {
                        status = responses.text ? 200 : 404;
                    } else if (status === 1223) {
                        status = 204;
                    }
                    xhr.onreadystatechange = v2.noop;
                    if ((status >= 200 && status < 300 || status === 304)) {
                        v2.globalEval(xhr.responseText);
                    }
                    if (status == 404) {
                        v2.log("GET " + url);
                    }
                }
            };
            xhr.send();
        }
    };

    var namespaceCache = v2.makeCache(function () {
        return new Object();
    }, function (object, value, key) {
        object[key] = value;
    }, v2.makeCache(function (_, namespace) { return namespace || ""; }, true), true);

    var type, rnamespace = /^([a-z]+(?:-[a-z]+)*\.(?:(?:[a-z]+(?:-[a-z]+)*|\*)\.)*)?([a-z]+(?:-[a-z]+)*|\*)$/i;
    var controls = {
        register: function (namespace, supports) {
            type = v2.type(namespace);
            if (type === "object") {
                return v2.each(namespace, function (value, key) {
                    controls.register(key, value);
                });
            }
            if (type === "array") {
                return v2.each(namespace, function (value) {
                    controls.register(value);
                });
            }
            if (type === "string") {
                var match = rnamespace.exec(namespace);
                if (match && match[2]) {
                    namespaceCache(namespace, supports);
                    var callback = v2[match[2]] = v2[match[2] = v2.camelCase(match[2])] = function () {
                        if (v2.run.isReady(match[2]) || readyControls(match[2])) {
                            return callback === v2[match[2]] ? v2.apply(this, [match[2]].concat(core_slice.call(arguments))) : v2[match[2]].apply(this, core_slice.call(arguments));
                        }
                    };
                }
            }
        },
        map: function (string) {
            return namespaceCache(string);
        }
    };

    var controlsCache = {},
        controlsFileCache = {};
    function readyControls(string, version) {
        version = version || core_version;
        if (controlsCache[string = v2.camelCase(string)] == null) {
            try {
                v2.each(controls.map(string), function (value, key) {
                    key = v2.camelCase(key);
                    if (value) {
                        type = v2.type(value);
                        if (type === "object") {
                            key = value.js || key;
                            type = v2.type(value.supports);
                            if (type === "string") {
                                value.supports = [value.supports];
                            }
                            if (type === "string" || type === "array" || type === "object") {
                                v2.each(value.supports, type === "object" ? readyControls : function (src) {
                                    return readyControls(src, version);
                                });
                            }
                            value = value.css;
                            if (value || value === undefined) {
                                type = v2.type(value = value || key);
                            }
                        }
                        if (type === "string") {
                            value = [value];
                        }
                        if (type === "string" || type === "array") {
                            v2.each(value, function (src) {
                                if (controlsFileCache[src] == null) {
                                    controlsFileCache[src] = true;
                                    var link = document.createElement("link");
                                    link.rel = "stylesheet";
                                    link.type = "text/css";
                                    link.href = controlsPath + "css/" + (src === key ? "v2." + src : src) + ".css?v=" + version;

                                    if (document.head) {
                                        document.head.appendChild(link);
                                    } else {
                                        document.body.appendChild(link);
                                    }
                                }
                            });
                        }
                    }
                    controlsCache[string] = controlsPath + "js/" + "v2." + key;
                    if (!v2.debug) {
                        controlsCache[string] += ".min";
                    }
                    ajax.done(controlsCache[string] += ".js?v=" + version);
                });
            } catch (e) {
                v2.log(e.message);
                return false;
            }
        }
        return true;
    }

    v2.factory = function (tag, callback) {
        if (v2.run.isReady(tag) || readyControls(tag)) {
            return callback();
        }
    };
    var register = v2.register,
        rtagEx = /([a-z]+(?:-[a-z]+)*)Ex/i;
    v2.register = function (tag) {
        if (rtagEx.test(tag)) {
            readyControls(RegExp.$1);
        }
        return register.apply(this, core_slice.call(arguments));
    };
    controls.register(["tabbar", "select", "button"]);
    controls.register({
        "form": "form",
        "wait": "wait",
        "check": "check",
        "input": "input",
        "table": "table",
        "layout": "layout",
        "dialog": "dialog",
        "treeView": "treeView",
        "alert": { css: "dialog", js: "dialog" },
        "confirm": { css: "dialog", js: "dialog" },
        "validate": { css: "dialog", js: "dialog" },
        "tableEdit": { css: "table", supports: "table" },
        "inputSearch": { css: "input", supports: "input" }
    });
})(v2Kit);