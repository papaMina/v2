(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['v2'], factory);
    } else if (typeof module === 'object' && module.exports) {
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
    var r20 = /%20/g;
    function buildParams(prefix, obj, add) {
        if (!(obj || obj === 0)) return;
        if (v2.isArray(obj)) {
            v2.each(obj, function (v, i) {
                buildParams(prefix + "[" + i + "]", v, add);
            });
        } else if (typeof obj === "object") {
            for (var name in obj) {
                buildParams(prefix + "_" + name, obj[name], add);
            }
        } else {
            add(prefix, obj);
        }
    }
    v2.extend({
        toQueryString: function (object, eq, spl) {
            eq = eq || "=";
            var s = [], add = function (key, value) {
                value = v2.isFunction(value) ? value() : value;
                s[s.length] = encodeURIComponent(key) + eq + encodeURIComponent(value);
            };
            for (var prefix in object) {
                buildParams(prefix, object[prefix], add);
            }
            return s.join(spl || "&").replace(r20, "+");
        }
    });

    var core_url,
        rnumber = /^(0|[1-9][0-9]*)(\.[0-9]+)?$/,
        rboolean = /^(true|false)$/i,
        rjson = /^(\[.*\]|\{.*\})$/,
        rurl = /^(([\w-]+:)\/\/(([^\/?#:]*)(?::(\d+))?))?((?:((?:\/[^\/?#]+)+\/)|\/)?(([\w-]+)(\.\w+)?)?)(\?[^#]*)?(#.*)?/;
    try {
        core_url = location.href;
    } catch (e) {
        var a = document.createElement("a");
        a.href = "";
        core_url = a.href;
    }
    var MAX_INTEGER = Math.pow(2, 53),
        MAX_INTEGER_STRING = String(MAX_INTEGER),
        MIN_INTEGER_STRING = String(MAX_INTEGER - 1),//转正
        INTEGER_MAX_LENGTH = MAX_INTEGER_STRING.length;
    function tryParseNumber(string) {
        var sign, index, string2, compare;
        if (string.length < INTEGER_MAX_LENGTH ||
            string.length < (INTEGER_MAX_LENGTH + (sign = string[0] === "+" || string[0] === "-") + ((index = string.indexOf(".")) > -1))) {
            return +string;
        }
        if (string.length > (INTEGER_MAX_LENGTH + sign + (index > -1))) {
            return string;
        }
        if (index > -1) {
            string2 = string.slice(~~sign, index) + string.slice(index + 1);
        } else {
            string2 = sign ? string.slice(1) : string;
        }
        compare = sign && string[0] === "-" ? MIN_INTEGER_STRING : MAX_INTEGER_STRING;
        for (var i = 0, len = INTEGER_MAX_LENGTH; i < len; i++) {
            if (string2[i] < compare[i]) return +string;
            if (string2[i] > compare[i]) return string;
        }
        return +string;
    }
    var uri = v2.uri = function (url) {
        return uriCache(url || core_url);
    };
    var uriCache = v2.makeCache(function (url) {
        return new uri.fn.init(url);
    });
    var nameCache = v2.makeCache(function (name) {
        return new RegExp("(^|&|\\?)" + encodeURIComponent(name) + "=([^&#]*)(&|#|$)", "i");
    });
    var uriProps = {
        href: "",
        origin: "",
        protocol: "",
        host: "",
        hostname: "",
        port: "",
        pathname: "/",
        path: "/",
        file: "",
        filename: "",
        extension: "",
        search: "",
        hash: ""
    };
    uri.fn = {
        take: function (name, same) {
            var r = nameCache(name);
            var v = r.exec(this.href);
            if (!v || !(v = v[2])) return "";
            if (same) return v;
            if (rboolean.test(v)) {
                return v === "true" || v.toLowerCase() === "true";
            }
            if (rnumber.test(v)) {
                return tryParseNumber(v);
            }
            v = decodeURIComponent(v);
            if (rjson.test(v)) {
                try {
                    return window.JSON && v2.isFunction(window.JSON.parse) ? window.JSON.parse(v) : (new Function("return " + v))();
                } catch (_) {
                    return v;
                }
            }
            return v;
        },
        init: function (url) {
            var match;
            if (match = rurl.exec(url)) {
                for (var i in uriProps) {
                    this[i] = match.shift() || uriProps[i];
                }
            }
            match = undefined;
        },
        toQueryString: function (object) {
            if (!object) return this.href;
            return this.href + (this.search ? "&" : "?") + v2.toQueryString(object);
        },
        toString: function () {
            return this.href;
        }
    };
    uri.fn.init.prototype = uri.fn;

    window.Uri = uri();

    v2.date = function (date) {
        if (!date) return new Date();
        var type = v2.type(date);
        if (type === "date") return date;
        if (type === "string") {
            type = "number";
            date = Date.parse(date.replace(/[\u0391-\uFFE5-]+/g, "/")
                .replace(/([0-9])[a-zA-Z](?=[0-9])/g, function (_, letter) {
                    return letter + " ";
                }));
        }
        if (type === "number") {
            return isNaN(date) ? new Date() : new Date(date);
        }
        return new Date();
    }
    v2.extend({
        isDate: function (date) {
            return v2.type(date) === "date";
        }
    });
    var datePart = {
        Y: /(y+)/, //年
        M: /(M+)/, //月份
        D: /(d+)/, //日
        H: /(H+)/, //小时（24小时制）
        h: /(h+)/, //小时（12小时制）
        m: /(m+)/, //分
        s: /(s+)/, //秒
        f: /(f+)/ //毫秒
    };
    return v2.extend(v2.date, {
        isLeapYear: function (year) {
            return (year % 400 == 0) || (year % 4 == 0) && (year % 100 > 0);
        },
        day: function (date) {
            return v2.date(date).getDate();
        },
        dayWeek: function (date) {
            return v2.date(date).getDay();
        },
        dayYear: function (date) {
            date = v2.date(date);
            return Math.ceil((date - new Date(date.getFullYear(), 1, 1)) / (24 * 60 * 60 * 1000)) + 1;
        },
        dayCount: function (year, month) {
            if (arguments.length < 2) {
                if (!v2.isDate(year)) return -1;
                month = year.getMonth() + 1;
                year = year.getFullYear();
            }
            if (month == 2) {
                return v2.date.isLeapYear(year) ? 29 : 28;
            }
            return (month % 2 == 0 ? month < 7 : month > 8) ? 30 : 31;
        },
        week: function (date) {
            date = v2.date(date);
            return Math.ceil((date.getDate() + 6 - date.getDay()) / 7);
        },
        weekYear: function (date) {
            date = v2.date(date);
            var date2 = new Date(date.getFullYear(), 0, 1);
            var day = Math.round((date.valueOf() - date2.valueOf()) / 86400000); //24 * 60 * 60 * 1000
            return Math.ceil((day + date2.getDay()) / 7);
        },
        month: function (date) {
            return v2.date(date).getMonth() + 1;
        },
        year: function (date) {
            return v2.date(date).getFullYear();
        },
        format: function (date, fmt) {
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
            if (datePart.Y.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, ('' + date.getFullYear()).substring(4 - RegExp.$1.length));
            }
            if (datePart.f.test(fmt)) {
                C.f = date.getMilliseconds();
                fmt = fmt.replace(RegExp.$1, (('000' + C.f).substr(('' + C.f).length, RegExp.$1.length) + '00').slice(0, 3));
            }
            for (var A in C) {
                if (datePart[A].test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? C[A] : ('00' + C[A]).slice(-2));
            }
            return fmt;
        }
    });
}));