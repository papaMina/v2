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
    var querySelector, outermostContext;
    var rbuggyQSA = [":focus"];
    var
        runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
        funescape = function (all, letter) {
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

        matchExpr = {
            "ID": new RegExp("^#(" + characterEncoding + ")"),
            "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
            "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
            "ATTR": new RegExp("^" + attributes),
            "PSEUDO": new RegExp("^" + pseudos),
            "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                "*(\\d+)|))" + whitespace + "*\\)|)", "i")
        };
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
    rbuggyQSA = new RegExp(rbuggyQSA.join("|"));

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
        if (selector.jquery) return selector.get(0);
        if (selector.v2 === version) return selector.element;
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
                        value: core_trim.call(matched),
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
            return core_slice.call(tokens);
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
                return compileCache(selector.replace(rtrim, "$1"));
            },
            "not": function (selector) {
                var matcher = compileCache(selector.replace(rtrim, "$1"));
                return function (elem) {
                    return !matcher(elem);
                };
            },
            "has": function (selector) {
                return function (elem) {
                    return select(selector, elem) != null;
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
        return function (context, expandContext) {
            var elem,
                i = 0,
                contextBackup = outermostContext,
                outermost = expandContext != null,
                elems = (expandContext && context.parentNode || context).getElementsByTagName("*");
            if (outermost) {
                outermostContext = context !== document && context;
            }
            while ((elem = elems[i++]) != null) {
                if (elem.nodeType == 1 && matcher(elem, context)) break;
            }
            if (outermost) {
                outermostContext = contextBackup;
            }
            return elem;
        };
    }

    return v2.take = select;
}));