/*!
 * JavaScript v2.cookie v1.0.1
 * https://github.com/v2kit/v2
 *
 * @author hyly
 * @date 2018-08-01
 * @descript a valuable technology object.
 */
+(function (global, factory) {
    return typeof exports === 'object' && typeof module === "object" ?
        module.exports = global.document ? factory(global) : function (window) {
            if (window.document == null) throw new Error("Cookie requires a window with a document");
            return factory(window);
        } :
        typeof define === 'function' && define.amd ? define(function (window) {
            if (window.document == null) throw new Error("Cookie requires a window with a document");
            return factory(window);
        }) : factory(global);
}(this, function (window) {
    var v2 = window.v2,
        document = window.document;

    if (typeof v2 !== "function") {
        throw new Error('Cookie\'s JavaScript requires v2.')
    }
    var rjsonlike = /[\{\[\]\}]/;
    var rcookie = /(^|[\x20\t\r\n\f]+)([^=]+)=([^;]*)(;|$)/g;
    var cookieCache = v2.makeCache(function (string) {
        return new RegExp("(^|[\\x20\\t\\r\\n\\f]+)" + string + "=([^;]*)(;|$)");
    });
    var decode = function (s) {
        return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
    };
    var isFunction = v2.isFunction((JSON || {}).parse);
    function init(converter) {
        function cookieRead(key) {
            var cookie, rcookie = cookieCache(decode(key));
            if (cookie = rcookie.exec(document.cookie)) {
                return (converter.read || converter)(cookie[2], key) || decode(cookie[2]);
            }
        }
        function cookiecookieReadToJSON(toJson) {
            var json = {}, cookie = document.cookie;
            cookie.replace(rcookie, function (all, _, key, value) {
                key = decode(key);
                value = (converter.read || converter)(value, key) || decode(value);
                if (toJson && rjsonlike.test(value)) {
                    try {
                        if (isFunction) {
                            value = JSON.parse(value);
                        } else {
                            value = (new Function("return " + value))();
                        }
                    } catch (_) { }
                }
                json[key] = value;
                return '';
            });
            return json;
        }
        function cookieWrite(key, value, attributes) {
            attributes = v2.extend({
                path: '/'
            }, api.defaults, attributes);

            if (typeof attributes.expires === 'number') {
                attributes.expires = new Date(+new Date() + attributes.expires * 864e+5);/*86400000=24 * 60 * 60 * 1000*/
            }
            attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';
            if (isFunction) {
                try {
                    var type = v2.type(value);
                    if (type === "object" || type === "function" || type === "array") {
                        value = JSON.stringify(value);
                    }
                } catch (e) { }
            }
            value = converter.write ?
                converter.write(value, key) :
                encodeURIComponent(String(value))
                    .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

            key = encodeURIComponent(String(key))
                .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
                .replace(/[\(\)]/g, escape);

            var stringifiedAttributes = '';
            for (var attributeName in attributes) {
                if (!attributes[attributeName]) {
                    continue;
                }
                stringifiedAttributes += '; ' + attributeName;
                if (attributes[attributeName] === true) {
                    continue;
                }
                stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
            }

            return (window.document.cookie = key + '=' + value + stringifiedAttributes);
        }
        function api(key, value, attributes) {

            // Write
            if (arguments.length > 1) {
                var type, expires, rcookie = cookieCache(key);
                if (rcookie.test(document.cookie) && (!attributes || !(expires = attributes.expires) || (type = v2.type(expires)) && (type === "number" && expires > -1 || type === "date" && +expires > +new Date()))) {
                    cookieWrite(key, '', { expires: -1 });
                }
                return cookieWrite(key, value, attributes);
            }

            // Read
            return key ? cookieRead(key) : cookiecookieReadToJSON(this.json);
        }

        api.set = function (key, value, attributes) {
            if (arguments.length > 1) {
                return api.apply(this, arguments);
            }
        };
        api.get = function (key) {
            return api.call(api, key);
        };
        api.getJSON = function () {
            return api.apply({
                json: true
            }, arguments);
        };
        api.remove = function (key, attributes) {
            api(key, '', v2.extend(attributes, {
                expires: -1
            }));
        };

        api.defaults = {};

        api.withConverter = init;

        return api;
    }
    var OldCookie = window.v2.cookie,
        cookie = window.v2.cookie = init(function () { });
    cookie.noConflict = function () {
        window.v2.cookie = OldCookie;
        return cookie;
    };
    return window.cookie;
}));