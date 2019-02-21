define(function (require) {
    var matchExpr = {
        number: /^[+-]?(0|[1-9][0-9]*)(?:\.([0-9]+))?$/,
        tel: /^(0[0-9]{2,3}-?)?(\+86\s+)?((1[3-9][0-9]{3}|[2-9])[0-9]{6,7})+(-[0-9]{1,4})?$/,
        email: /^\w[-\w.+]* @([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
        url: /^(([a-z]+:\/\/)|~?\/|\.?\.\/)/i
    };
    var patternCache = v2.makeCache(function (pattern) {
        if (pattern[0] != "^") pattern = "^" + pattern;
        if (pattern[pattern.length - 1] != "$") pattern += "$";
        try {
            return new RegExp(pattern);
        } catch (_) { }
    });
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
                        this.rangeOverflow = ~~value > control.max;
                        this.rangeUnderflow = ~~value < control.min;
                    }
                    if (type in matchExpr) {
                        this.badInput = this.typeMismatch = !matchExpr[type].test(value);
                    }
                    this.tooLong = value.length > control.maxlength;
                    this.tooShort = value.length < control.minlength;
                    if ((pattern = control.pattern) && (pattern = patternCache(pattern))) {
                        this.patternMismatch = !pattern.test(value);
                    }
                }
                this.valueMissing = control.required && !value;
                return this.valid = !(this.valueMissing || this.typeMismatch || this.badInput || this.patternMismatch || this.rangeOverflow || this.rangeUnderflow || this.tooLong || this.tooShort);
            }
        };
        return new ValidityState();
    };
    function inputValidityError(control) {
        var timer, validity = control.validity;
        function ValidityStateError() { }
        ValidityStateError.prototype = {
            validError: function () {
                if (validity.customError) {
                    return control.ValidityError;
                }
                if (validity.valueMissing) {
                    return control.title ? "请填写“" + control.title + "”字段。" : "请填写此字段。";
                }
                if (validity.patternMismatch) {
                    return "请与所请求的格式保持一致。";
                }
                if (validity.badInput) {
                    if (control.type === "number") {
                        return "请输入一个数字。";
                    }
                    if (control.type === "tel") {
                        return "请输入一个电话号码。";
                    }
                }
                if (control.type === "number") {
                    if (validity.rangeUnderflow) {
                        return v2.format("值必须大于或等于{0}。", control.min);
                    }
                    if (validity.rangeOverflow) {
                        return v2.format("值必须小于或等于{0}。", control.max);
                    }
                }
                var value = control.value;
                if (validity.typeMismatch) {
                    if (control.type === "email") {
                        var index = value.indexOf("@");
                        return v2.format(index > -1 ? "请在“@”内容" + (index > 0 ? "后面" : "前面") + "输入内容。{0}内容不完整。" : "请在邮箱地址中包含“@”。{0}缺少“@”。", value);
                    }
                }
                if (validity.tooShort) {
                    return v2.format("值必须大于或等于{0}个字符。", control.minlength);
                }
                if (validity.tooLong) {
                    return v2.format("值必须小于或等于{0}个字符。", control.maxlength);
                }
            },
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

    v2.use('input', {
        input: function () {
            /** 最小值 */
            this.min = -Infinity;
            /** 最大值 */
            this.max = Infinity;
            /** 最小长度 */
            this.minlength = -1;
            /** 最大长度 */
            this.maxlength = Infinity;

            /** 多行（textarea|input） */
            this.multiple = false;

            /** 名称 */
            this.name = "";
            /** 按钮类型 */
            this.type = "text";//[text|number|tel|email|url|search|date|datetime|time]
            /** 按钮名称 */
            this.value = "";
            /** 超小按钮 */
            this.xs = false;
            /** 小按钮 */
            this.sm = false;
            /** 大按钮 */
            this.lg = false;
            /** 默认提示 */
            this.placeholder = '';
            /** 是否必填 */
            this.required = false;
            /** 只读 */
            this.readonly = false;
            /** 正则验证 */
            this.pattern = '';
            /** 验证实体 */
            this.validity = null;
            /** 验证错误 */
            this.validityError = null;
        },
        init: function () {
            this.base.init(this.multiple ? 'textarea' : 'input');
        },
        checkValidity: function () {
            return this.validitySurppot ? this.$.checkValidity() : this.validity.isValid();
        },
        setCustomValidity: function (massage) {
            if (this.validitySurppot) {
                this.$.setCustomValidity(message);
            } else if (this.validity.customError = !!massage && v2.isString(massage)) {
                this.ValidityError = massage;
            }
        },
        render: function () {
            this.base.render();
            this.addClass('form-control');
            if (this.lg || this.sm || this.xs) {
                this.addClass(this.lg ? 'input-lg' : this.sm ? 'input-sm' : 'input-xs');
            }
            this.attr('type', this.type || 'text');

            var validity = this.$.validity;
            this.validitySurppot = !!validity;
            this.validity = validity || this.validity || inputValidity(this);
            this.validityError = this.validityError || inputValidityError(this);
        },
        usb: function () {
            this.base.usb();
            this.define('value pattern required min max minlength maxlength placeholder validationMessage')
                .define({
                    required: function (value) {
                        this.toggleClass('required', !!value);
                    },
                    readonly: function (value) {
                        this.toggleClass('readonly', !!value);
                    }
                });
        },
        commit: function () {
            var my = this;
            this.base.commit();
            if (this.validitySurppot) {
                this.on("keyup", function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 13 || code === 108) {
                        my.invoke("keyboard-enter");
                    }
                });
                return;
            }
            this.$.on("keydown", function (e) {
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
                        if (this.value !== value) my.val(value);
                        return false;
                    }
                    if (code === 102) {
                        value = value && (value.replace(rdot, "") + ".");
                        if (this.value !== value) my.val(value);
                        return false;
                    }
                    if (code >= 48 && code <= 57 || code >= 96 && code <= 105) {
                        my.val(value += Math.max(code - 48, code - 96));
                        return false;
                    }
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
                if (my.checkValidity()) {
                    if (my.validityError) {
                        my.validityError.hide();
                    }
                } else {
                    if (my.validityError) {
                        my.validityError.Massage();
                    }
                }
                if (value !== my.value) this.value = my.value;
            }, valueChangeCallback = function (elem) {
                var value = elem.value;
                if (my.type === "number") {
                    value = value.replace(/[^-+.0-9]/g, "");
                }
                if (isChinese || my.value === value) return;
                var value = my.val(elem.value);
                if (my.timelyValid) {
                    isValidCallback.call(elem, value);
                }
                if (my.value !== value) my.val(my.value);
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
    return function (options) {
        return v2('input', options);
    };
});