/*!
 * JavaScript v2 v1.0.1
 * https://github.com/v2kit/v2
 *
 * @author hyly
 * @date 2018-08-01
 * @descript a valuable technology object.
 */
(function ($, v2) {
    var rdot = /(^\.+|\.+$)/g;
    var patternCache = v2.makeCache(function (pattern) {
        if (pattern[0] != "^") pattern = "^" + pattern;
        if (pattern[pattern.length - 1] != "$") pattern += "$";
        try {
            return new RegExp(pattern);
        } catch (_) { }
    });
    function labelsCall(value) {
        return '<span class="input-group-addon">' + (value || "") + '</span>';
    }
    function buttonsCall(value) {
        if (v2.isString(value)) {
            value = { text: value };
        }
        return v2.expression(v2.format('<div class="input-group-btn"><button type="{return type || "button"^}" class="btn btn-{return style || "default"^}"{for(value<key> in [attributes]) "{key}="{value}""^}>{text}</button>{0}</div>', value.dropdown ? '<ul class="dropdown-menu">{for(value<key> in [dropdown]) { if(key==="divider" && value === "divider"){ "<li role="separator" class="divider"></li>" } else { "<li data-val="{key}"><a href="javascript:void(0)">{value}</a></li>"} }^}</ul>' : ''), value);
    }
    function inputValidity(control) {
        var pattern;
        function ValidityState() {
            this.valid = true;//是否有效
            this.badInput = false;//无效内容
            this.patternMismatch = false;//正则表达式验证失败
            this.rangeOverflow = false;//输入值超过max的限定
            this.rangeUnderflow = false;//输入值小于min的限定
            this.tooLong = false;//输入的字符数超过maxlength
            this.tooShort = false;//输入的字符数小于minlength
            this.typeMismatch = false;//输入值不符合email、url的验证
            this.valueMissing = false;//未输入值，违反了required要求
            this.customError = false;//是否存在自定义错误
        }
        ValidityState.prototype = {
            isValid: function (value) {
                var type = control.type;
                value = value == null ? control.value : value;
                if (value) {
                    if (type === "number") {
                        if (v2.jreg.number.test(value)) {
                            this.rangeOverflow = ~~value > control.max;
                            this.rangeUnderflow = ~~value < control.min;
                        } else {
                            this.badInput = true;
                        }
                    }
                    if (type === "tel") {
                        this.badInput = !v2.jreg.tel.test(value);
                    }
                    if (type === "email") {
                        this.typeMismatch = !v2.jreg.mail.test(value);
                    }
                    if (type === "url") {
                        this.typeMismatch = !v2.jreg.url.test(value);
                    }
                    this.tooLong = value.length > control.maxlength;
                    this.tooShort = value.length < control.minlength;
                    if (pattern = control.pattern) {
                        if (pattern = patternCache(pattern)) {
                            this.patternMismatch = !pattern.test(value);
                        }
                    }
                }
                this.valueMissing = control.required && !value;
                return this.valid = !(this.valueMissing || this.typeMismatch || this.badInput || this.patternMismatch || this.rangeOverflow || this.rangeUnderflow || this.tooLong || this.tooShort);
            },
            validError: function () {
                if (this.customError) {
                    return control.ValidityError;
                }
                if (this.valueMissing) {
                    return control.title ? "请填写“" + control.title + "”字段。" : "请填写此字段。";
                }
                if (this.patternMismatch) {
                    return "请与所请求的格式保持一致。";
                }
                if (this.badInput) {
                    if (control.type === "number") {
                        return "请输入一个数字。";
                    }
                    if (control.type === "tel") {
                        return "请输入一个电话号码。";
                    }
                }
                if (control.type === "number") {
                    if (this.rangeUnderflow) {
                        return v2.format("值必须大于或等于{0}。", control.min);
                    }
                    if (this.rangeOverflow) {
                        return v2.format("值必须小于或等于{0}。", control.max);
                    }
                }
                var value = control.value;
                if (this.typeMismatch) {
                    if (control.type === "email") {
                        var index = value.indexOf("@");
                        return v2.format(index > -1 ? "请在“@”内容" + (index > 0 ? "后面" : "前面") + "输入内容。{0}内容不完整。" : "请在邮箱地址中包含“@”。{0}缺少“@”。", value);
                    }
                }
                if (this.tooShort) {
                    return v2.format("值必须大于或等于{0}个字符。", control.minlength);
                }
                if (this.tooLong) {
                    return v2.format("值必须小于或等于{0}个字符。", control.maxlength);
                }
            }
        };
        return new ValidityState();
    };
    function inputValidityError(control) {
        var timer;
        function ValidityStateError() { }
        ValidityStateError.prototype = {
            Massage: function (massage) {
                massage = massage || control.validity.validError();
                if (massage) {
                    var my = this;
                    if (!this.isReady) {
                        this.$ = this.$ || control.$.prepend('<div class="input-validity"><div class="validity-status">!</div><span class="validity-massage"></span></div>').children().eq(0);
                    }
                    this.$.find(".validity-massage").text(massage);
                    this.$.removeClass("hidden");
                    if (timer) clearTimeout(timer);
                    timer = setTimeout(function () {
                        my.$.addClass("hidden");
                        timer = null;
                    }, 3000);
                    this.isReady = true;
                }
            },
            hide: function () {
                if (this.isReady) {
                    if (timer) clearTimeout(timer);
                    this.$.addClass("hidden");
                    timer = null;
                }
            }
        };
        return new ValidityStateError();
    }
    function input(my) {
        return new Object({
            ctor: function () {

                this.timelyValid = false;//实时校验

                this.min = -Infinity;
                this.max = Infinity;

                this.minlength = -1;
                this.maxlength = Infinity;

                this.multiple = false;

                this.type = "text";//[text|number|tel|email|url|search|date|datetime|time]
                this.id = "";
                this.name = "";
                this.title = "";
                this.value = "";
                this.pattern = "";
                this.required = false;
                this.readonly = false;
                this.placeholder = "";
                this.validity = inputValidity(this);
                this.validityError = inputValidityError(this);
            },
            init: function () {
                this.base.init();
                this.$ = $(this.element);
                var type = this.type;
                if (type === "date" || type === "time" || type === "datetime") {
                    this.type = "text";
                }
                if (!this.placeholder && this.title) {
                    this.placeholder = "请输入" + this.title + "~";
                }
                this.$.append(v2.expression('<{return multiple ? "textarea" : "input"^}{if(id) " id="{id}""^} class="form-control"{if(type) " type="{type}""^}{if(name) " name="{name}""^} value="{value}"{if(type) " placeholder="{placeholder}""^}/>', this));
                this.$input = this.$.children().last();
                this.type = type;
            },
            render: function (variable) {
                this.base.render();
                if (this.readonly) {
                    this.setReadonly(this.readonly);
                }
                this.addClass("input-group");
                if (variable.sm) {
                    this.addClass("input-group-sm");
                }
                if (variable.lg) {
                    this.addClass("input-group-lg");
                }
                if (variable.labelsPre || variable.labelsNext || variable.buttonsPre || variable.buttonsNext) {
                    var labelsPre = v2.map(v2.makeArray(variable.labelsPre), labelsCall);
                    var buttonsPre = v2.map(v2.makeArray(variable.buttonsPre), buttonsCall);
                    this.$.prepend(buttonsPre.join(''), labelsPre.join(''));

                    var labelsNext = v2.map(v2.makeArray(variable.labelsNext), labelsCall);
                    var buttonsNext = v2.map(v2.makeArray(variable.buttonsNext), buttonsCall);
                    this.$.append(labelsNext.join(''), buttonsNext.join(''));
                }
            },
            setReadonly: function (v) {
                this.$input.prop("readonly", !!v);
            },
            isValid: function () {
                return this.timelyValid ? this.validity.valid : this.validity.isValid();
            },
            val: function (value, invoke) {
                if (value == null) return this.isValid() ? this.value : "";
                if (this.validity.isValid(value = value == null ? "" : value)) {
                    this.$input.val(this.value = value);
                    if (invoke) {
                        my.invoke("valid-success");
                    }
                } else {
                    if (invoke) {
                        my.invoke("valid-error", my.validity);
                    }
                    if (this.validityError) {
                        this.validityError.Massage();
                    }
                }
            },
            setCustomValidity: function (massage) {
                if (this.ValidityError = massage && (typeof massage === "string") && massage) {
                    this.validity.customError = true;
                }
            },
            commit: function () {
                var type = this.type;
                if (type === "date" || type === "time" || type === "datetime") {
                    if (window.laydate == null) {
                        window.laydate = false;
                        var script = document.createElement("script");
                        script.defer = script.async = true;
                        script.src = "/lib/laydate/laydate" + (v2.debug ? ".min.js" : ".js");
                        document.body.appendChild(script);
                    }
                    var format = type === "date" ? "yyyy-MM-dd" : "yyyy-MM-dd HH:mm:ss";
                    this.$input.on("click", function () {
                        if (!window.laydate) return my.validityError.Massage("正在初始化日期控件！");
                        laydate({
                            keepYmd: type === "time", onchange: function (value) {
                                my.$input.val(my.value = value);
                            }, format: format, min: my.invoke("date-min"), max: my.invoke("date-max")
                        });
                    });
                }
                this.$input.on("click", function () {
                    my.invoke("event-click");
                });
                this.$input.on("keydown", function (e) {
                    var value = this.value;
                    var code = e.keyCode || e.which;
                    if (value.length === my.maxlength && !(code === 8 || code === 46)) {
                        return false;
                    }
                    if (my.type === "number") {
                        value = v2.trim(value);
                        if (code === 107 || code === 109 || code === 187 || code === 189) {
                            value = value.replace(/[+-]+/g, "");
                            if (code === 109 || code === 189) {
                                value = "-" + value;
                            }
                            if (this.value !== value) this.value = value;
                            return false;
                        }
                        if (code === 102) {
                            value = value && (value.replace(rdot, "") + ".");
                            if (this.value !== value) this.value = value;
                            return false;
                        }
                        if (code >= 48 && code <= 57 || code >= 96 && code <= 105) {
                            this.value = value += Math.max(code - 48, code - 96);
                            return false;
                        }
                    }
                    if (my.invoke("keyboard-keyCode", code) === false) {
                        return false;
                    }
                });
                var isChinese = false;
                this.$input.on("compositionstart", function () {
                    isChinese = true;
                });
                this.$input.on("compositionend", function () {
                    isChinese = false;
                });
                var valueChangeTimer, isValidCallback = function () {
                    var value = my.value = this.value;
                    if (my.validity.isValid(value)) {
                        my.invoke("valid-success");
                        if (my.validityError) {
                            my.validityError.hide();
                        }
                    } else {
                        my.invoke("valid-error", my.validity);
                        if (my.validityError) {
                            my.validityError.Massage();
                        }
                    }
                    if (value !== my.value) this.value = my.value;
                }, valueChangeCallback = function (elem) {
                    var value = elem.value;
                    if (my.type === "number") {
                        value = value.replace(/[^-+.0-9]/g, "");
                        if (elem.value !== value) elem.value = value;
                    }
                    if (isChinese || my.value === value) return;
                    var value = my.value = elem.value;
                    my.invoke("value-change", value);
                    if (my.value !== value) value = elem.value = my.value;
                    if (my.timelyValid) {
                        isValidCallback.call(elem, value);
                    }
                    if (my.value !== value) elem.value = my.value;
                }, valueChangeProxyCallback = function (elem) {
                    if (v2.bro.isMsie || v2.bro.isChrome || v2.isFirefox && v2.isFirefox >= 9) {
                        return valueChangeCallback(elem);
                    }
                    if (valueChangeTimer) clearTimeout(valueChangeTimer);
                    valueChangeTimer = setTimeout(function () {
                        valueChangeTimer = null;
                        valueChangeCallback(elem);
                    }, 50);
                };
                this.$input.on("keyup", function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 13 || code === 108) {
                        my.invoke("keyboard-enter");
                    }
                    valueChangeProxyCallback(this);
                });
                this.$input.on("input propertychange", function () {
                    valueChangeProxyCallback(this);
                });
                this.$input.on("blur", isValidCallback);
            }
        });
    }
    v2.register("input", input);

})(jQuery, v2Kit);