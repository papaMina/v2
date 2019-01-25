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

    var whitespace = "[\\x20\\t\\r\\n\\f]";
    var formatCache = v2.makeCache(function (i) {
        return new RegExp("\\{" + (i - 1) + "\\}", "gm");
    });
    function format(string) {
        if (!string) return string;
        if (arguments.length < 2) return string;
        if (arguments.length === 2 && v2.isArraylike(arguments[1])) {
            for (var i = 0, args = arguments[1], len = args.length; i < len; i++) {
                string = string.replace(formatCache(i + 1), args[i]);
            }
            return string;
        }
        for (var i = 1, len = arguments.length; i < len; i++) {
            string = string.replace(formatCache(i), arguments[i]);
        }
        return string;
    }
    var keywords = "break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var" +
        "|void|while|with|abstract|boolean|byte|char|class|const|debugger|double|enum|export|extends|final|float|goto|implements|import|int|interface|long" +
        "|native|package|private|protected|public|short|static|super|synchronized|throws|transient|volatile|true|false";
    var letter = "[_a-z]",
        not_letter = "[^_a-z]",
        word = letter + "[_a-z0-9]*",
        word_ex_keywords = "(?:(?!\\b(?:" + keywords + ")\\b)" + word + ")",
        brackets = "\\[[^\\[\\]]+\\]",
        parenthesis = "\\([^\\(\\)]*\\)",
        simple_tail = "(?:(?:\\??(?:\\." + word + "|" + brackets + ")(?:" + parenthesis + ")?)+)",
        simple = word_ex_keywords + simple_tail;

    var rnot_letter = new RegExp(not_letter, "img"),
        rword = new RegExp("^" + word + "$", "i"),
        rif_word = new RegExp("^((" + word + ")\\??)((?=[.\\[])|$)", "i"),
        rbrackets = new RegExp("^(\\[([^\\[\\]]+)\\]\\??)", "gm"),
        rsimple = new RegExp("^" + simple + "?$", "i"),
        rreturn = new RegExp("^(" + whitespace + "*return" + whitespace + "+)"),
        rlamda_main = new RegExp("^(" + word + ")(\\.|\\?|\\[|$)"),
        rif_simple = new RegExp("(^|[^.?_)a-z0-9]|" + whitespace + "+|\\b)(" + simple + "+)(" + whitespace + "+|[^.?_(a-z0-9]|$)", "img"),
        rif_simple_word = new RegExp("(^|[^.?_)a-z0-9]|" + whitespace + "+|\\b)(" + simple + "?)(" + whitespace + "+|[^.?_(a-z0-9]|$)", "img");

    var rformat_code = /\\([1-9][0-9]*)/g;
    var makeCode = v2.makeCache(function (string) {
        var callback, keys = [];
        string = _makeCode(string, keys);
        callback = keys.length > 1 ? new Function(
            "keys",
            format("\tvar callback = function({0}){\n{1}\n};" +
                "\nreturn function(object, main){" +
                "\n\tif(main) return callback.call(object, object);" +
                "\n\tvar args = [];" +
                "\n\tv2.each(keys, function(arg){ args.push(object[arg]); });" +
                "\n\treturn callback.apply(object, args);" +
                "\n}",
                keys.join(','),
                string
            )
        ) : new Function(
            "key",
            format("\tvar callback = function({0}){\n{1}\n};" +
                "\nreturn function(object, main){" +
                "\n\treturn callback.call(object, main ? object : object[key]);" +
                "\n}",
                keys[0],
                string
            )
        );
        return callback = callback(keys.length > 1 ? keys : keys.pop());
    });
    function formatCode(string, indent) {
        return string.replace(rformat_code, function (_, index) {
            return "\\" + (~~index + indent);
        });
    };
    function tryCode(value, main, name) {
        return value + " = " + main + " == null ? " + main + " : " + main + name;
    }
    function matchCode(string, rmatch, callback) {
        if (!string || !rmatch || !callback) return string;
        var matched, match, context = {}, isArray = v2.isArraylike(rmatch);
        while (match = string && (isArray ? v2.any(rmatch, function (r) { return r.exec(string); }) : rmatch.exec(string))) {
            context.matched = matched = match.shift();
            context.matches = match;
            context.string = string = match.index > 0 ?
                (match.index + matched.length) < string.length ?
                    string.slice(0, match.index) + string.slice(match.index + matched.length)
                    :
                    string.slice(0, match.index)
                :
                string.slice(matched.length);
            if (callback.apply(context, match) === false) {
                break;
            }
        }
        context = undefined;
        return string;
    }
    function nameCode(string) {
        return string.replace(rnot_letter, function (letter) {
            return "_" + letter.charCodeAt(0);
        });
    }
    function lamdaCode(string, vars, mains) {
        if (!mains && string.indexOf("?") === -1) return string;
        var match = rlamda_main.exec(string);
        if (!match) v2.syntaxError(string);
        if (mains[0] === string) return mains ? mains[match[1]] = match[1] : match[1];
        vars = vars || {};
        var name,
            value,
            i = 0,
            code = [],
            main = match[1],
            main_if = match[2] === "?",
            arr = string.slice(match[0].length).split("?");
        if (mains && !mains[main]) mains[main] = main;
        if (!main_if && arr.length === 1) return string;
        while (name = arr[i++]) {
            if (vars[value = "_" + main + "__" + nameCode(name)]) {
                main = value;
                continue;
            }
            vars[value] = value;
            if (code.length > 0) { code.push(", "); }
            if (main_if || i > 1) {
                code.push(tryCode(value, main, name));
            } else {
                code.push(value, " = ", main + name);
            }
            main = value;
        }
        if (code.length < 1) {
            string = value;
        } else {
            string = "(" + code.join("") + ")";
        }
        return string;
    }
    function _makeCode(string, keys) {
        var vars = {}, mains = keys && {};
        string = string.replace(mains ? rif_simple_word : rif_simple, function (_, pre, lamda, next) {
            return pre + lamdaCode(lamda, vars, mains) + next;
        });
        if (!rreturn.test(string)) {
            string = "return " + string + ";";
        }
        var arr = v2.map(vars, function (_) { return _; });
        if (arr.length) {
            string = "\tvar " + arr.join(",") + ";\n\t" + string;
        }
        if (!keys) return string;
        v2.each(mains, function (main) {
            if (!v2.any(keys, function (key) { return key === main; })) {
                keys.push(main);
            }
        });
        return string;
    }
    function returnthrowsCode(object, key, first) {
        if (key[first ? 0 : key.length - 1] === "?") {
            return object;
        }
        v2.error("TypeError:" + key + " is undefined");
    }
    function isValidObject(object) {
        return object || object === 0;
    }
    function linqSimpleCode(object, string) {
        var arg, key, match, arr = string.split("."),
            checkCode = function (prop) {
                if (!isValidObject(object)) return false;
                if (prop[0] === "'" && prop[prop.length - 1] === "'" || prop[0] === '"' && prop[prop.length - 1] === '"') {
                    prop = prop.slice(1, -1);
                }
                object = object[prop];
                return true;
            };
        while (key = arr.shift()) {
            while (match = (rif_word.exec(key) || rbrackets.exec(key))) {
                if (checkCode(match[2])) {
                    if (key === (arg = match[1])) break;
                    key = key.slice(arg.length);
                    continue;
                }
                return returnthrowsCode(object, arg);
            }
            if (!match) break;
        }
        if (!key) return object;
        if (!isValidObject(object)) {
            return returnthrowsCode(object, arg);
        }
        arr.unshift(key);
        arr.unshift(arg || "object");
        return makeCode(arr.join("."))(object, true);
    }

    var char = "(?:\\\\.|[^\\\\])",//字符
        chars = char + "*?",//多字符
        quotes_chars = "(['\"])(" + chars + ")\\1",//引号内的字符
        number = "(0|[1-9][0-9]*)(\\.[0-9]+)?",
        simple_next_tail = whitespace + "*([*^<%>+/-])" + whitespace + "*" + "(" + number + "|" + formatCode(quotes_chars, 4) + "|(" + word + "|\\.)(" + simple_tail + ")?)",
        simple_pro_tail = "(" + simple_tail + "?)?((" + formatCode(simple_next_tail, 4) + ")+)?" + whitespace + "*",
        simple_pro = whitespace + "*(" + word + "|\\.)" + simple_pro_tail;

    var rnumber = new RegExp("^" + number + "$"),
        rsimple_pro_next = new RegExp("^" + simple_next_tail),
        rsimple_pro = new RegExp("^" + simple_pro + "$"),
        rsimple_pro_rep = new RegExp("\\{" + simple_pro + "\\}", "img");
    function linqNextCode(object, value, next) {
        var agent, callback;
        matchCode(next, rsimple_pro_next, function (operator, val, _interger, _digits, quotes, string, key, descendant) {
            if (quotes) {
                val = string;
            }
            if (key || descendant) {
                val = linqCode(object, descendant, key, true);
            }
            if (operator === "+" || operator === "-") {
                if (callback) {
                    value = callback(value, agent);
                }
                agent = val;
                callback = v2.operators[operator];
            } else {
                agent = agent == null ? val : v2.operators[operator](agent, val);
            }
        });
        if (callback) {
            value = callback(value, agent);
        }
        return value;
    }
    function linqCode(object, string, key, simple) {
        var newString = string;
        if (!key && string && rword.test(string)) {
            key = string;
            string = undefined;
        }
        if (key === ".") {
            key = undefined;
            if (string) {
                while (string[0] === "?" || string[0] === ".") {
                    string = string.slice(1);
                }
            }
        }
        if (string && !isValidObject(object)) {
            return returnthrowsCode(object, newString, true);
        }
        if (!string) return key ? object[key] : object;
        string = key ? key + string : string;
        if (simple || rsimple.test(string)) {
            return linqSimpleCode(object, string);
        }
        if (rsimple_pro.test(string)) {
            return linqNextCode(object, linqCode(object, RegExp.$2, RegExp.$1, true), RegExp.$3);
        }
        return makeCode(string)(object, !key);
    };

    function compileResult(string) {
        return string == null ? "" : string;
    }
    function compile(string, json, showMatchStr) {
        return string.replace(rsimple_pro_rep, function (matchStr, key, descendant, next) {
            if (key === "." || key in json) {
                return compileResult(linqNextCode(json, linqCode(json, descendant, key, true), next));
            }
            return showMatchStr ? matchStr : "";
        });
    }
    var rcore_match = /\{(?![0-9]+)([\w-]+)((?:\.[\w-]+)+)?\}/g;
    function replace(json, showMatchStr) {
        return string.replace(rcore_match, function (matchStr, key, descendant) {
            if (key in json) {
                key = linqCode(json, descendant, key, true);
                return (key || key === 0) ? key : '';
            }
            return showMatchStr ? matchStr : "";
        });
    }
    var area = "\\{" + whitespace + "*([$^])?" + formatCode(quotes_chars, 1) + whitespace + "*\\}";//执行域

    var bag = "(?:[^\\(\\)]+?)";
    var condition_current, condition_ultimate;
    for (var i = 0; i < 3; i++) {//最多套三层括号
        condition_current = condition_current ? "(?:(?:" + condition_ultimate + ")?\\(" + condition_current + "\\)(?:" + condition_ultimate + ")?)" : bag;
        condition_ultimate = condition_ultimate ? condition_ultimate + "|" + condition_current : condition_current;
    }

    var condition = "(?:" + whitespace + "*(" + condition_ultimate + ")" + whitespace + "*)";//条件
    var if_condition = "if" + whitespace + "*\\(" + condition + "\\)" + whitespace + "*" + formatCode(area, 1) + whitespace + "*";//if条件
    var rif = new RegExp("(^|" + whitespace + "+)" + formatCode(if_condition, 1));
    var rjudgment = new RegExp(
        "`\\$\\{" + whitespace + "*" + if_condition +//if
        "((?:" + whitespace + "*else" + whitespace + "+" + formatCode(if_condition, 5) + whitespace + "*)+)?" + //else if
        "(" + whitespace + "*else" + whitespace + "*" + formatCode(area, 10) + whitespace + "*)?" +//else
        whitespace + "*\\}`", "gm");
    function compileCode(json, model, string, showMatchStr) {
        if (string && model in v2.compilers) {
            return v2.compilers[model](json, string, showMatchStr);
        }
        return compileResult(string);
    }
    function judge(string, json, showMatchStr) {
        return string.replace(rjudgment, function (_, condition, model) {
            var match;
            if (linqCode(json, condition)) {
                return compileCode(json, model, arguments[4], showMatchStr);
            }
            if (condition = arguments[5]) {// else if
                while (match = rif.exec(condition)) {
                    if (linqCode(json, match[2])) {
                        return compileCode(json, match[3], match[5], showMatchStr);
                    }
                    condition = condition.slice(match.index + match[0].length);
                }
            }
            return compileCode(json, arguments[11], arguments[13], showMatchStr);//else
        });
    }

    var forin = "for" + whitespace + "*\\(" + whitespace + "*(?:var" + whitespace + "+)?(" + word + ")(?:<(" + word + ")>)?" + whitespace + "+in" + whitespace + "+" +
        formatCode(simple_pro, 2) + whitespace + "*\\)";
    var rforin = new RegExp("`\\$\\{" + whitespace + "*" + forin + whitespace +
        "*(?:" + formatCode(area, 14) + "|\\{" + whitespace + "*" +
        formatCode(if_condition, 17) +
        "(" + whitespace + "*else" + whitespace + "*" + formatCode(area, 22) + whitespace + "*)?" +
        whitespace + "*\\})" + whitespace + "*\\}`", "gm");

    function forEach(string, json, showMatchStr) {
        return string.replace(rforin, function (matchStr, value, key, object, descendant) {//for
            var data = linqCode(json, descendant, object, true);
            if (!data) return showMatchStr ? matchStr : "";
            var html = "", map = {},
                model = arguments[15],
                content = arguments[17],
                condition = arguments[18],
                trueModel = arguments[19],
                trueContent = arguments[21],
                falseModel = arguments[23],
                falseContent = arguments[25];
            if (condition) {
                condition = key ?
                    new Function(value, key, object === "." ? "_" : object, _makeCode(condition))
                    :
                    new Function(value, object === "." ? "_" : object, _makeCode(condition));
            }
            v2.each(data, function (v, k) {
                map[value] = v;
                if (key) map[key] = k;
                if (condition) {
                    if (key ? condition(v, k, data) : condition(v, data)) {
                        html += compileCode(map, trueModel, trueContent, matchStr);
                    } else {
                        html += compileCode(map, falseModel, falseContent, matchStr);
                    }
                } else {
                    html += compileCode(map, model, content, matchStr);
                }
            });
            return html;
        });
    }
    v2.extend({
        compilers: {
            "$": function (json, string, showMatchStr) {
                return replace(string, json, !!showMatchStr);
            },
            "^": function (json, string) {
                return linqCode(json, string);
            }
        },
        operators: {
            "+": function (a, b) {
                return rnumber.test(a) && rnumber.test(b) ? +a + +b : a ? b ? a + b : a : b;
            },
            "-": function (a, b) {
                return a - b;
            },
            "*": function (a, b) {
                return a * b;
            },
            "/": function (a, b) {
                return a / b;
            },
            "%": function (a, b) {
                return a % b;
            },
            "^": function (a, b) {
                return Math.pow(a, b);
            },
            ">": function (a, b) {
                return a > b;
            },
            "<": function (a, b) {
                return a < b;
            }
        }
    });
    v2.extend(String.prototype, {
        toCode: function () {
            return makeCode(this);
        },
        format: function (/*..args*/) {
            if (arguments.length === 1) {
                return format(this, arguments[0]);
            }
            return format(this, arguments);
        },
        eval: function (json) {
            return linqCode(json, this);
        },
        map: function (json, showMatchStr) {
            return replace(json, showMatchStr);
        },
        compile: function (json, showMatchStr) {
            return compile(this, json, showMatchStr);
        },
        if: function (json, showMatchStr) {
            return judge(this, json, showMatchStr);
        },
        each: function (json, showMatchStr) {
            return forEach(this, json, showMatchStr); 
        }
    });
    var typeCb = {
        each: 4,
        if: 2,
        replace: 1
    };
    v2.extend(v2.wildCards, {
        "^": {
            type: "string",
            exec: function (control, value) {
                if (value) return linqCode(control.variable, value);
            }
        },
        "@": {
            type: "string",
            exec: function (control, value) {
                if (value) return replace(value, control.variable);
            }
        },
        "$": {
            type: "string",
            exec: function (control, value) {
                if (value) return compile(value, control.variable);
            }
        }
    });
    v2.StringCb = function (type, string, json, showMatchStr) {
        v2.typeCb(typeCb, type, function (type) {
            string = string[type](json, showMatchStr);
        });
        return string;
    };
}));