/*!
 * JavaScript v2 v1.0.1
 * https://github.com/v2kit/v2
 *
 * @author hyly
 * @date 2018-08-01
 * @descript a valuable technology object.
 */
(function ($, v2) {
    function form(my) {
        var valueObject = {};
        return new Object({
            ctor: function () {
                this.rows = [];//菜单列表
                this.data = {};//数据
                this.submitEnter = true;//回车提交表单(有其他回车事件时，记得屏蔽)
                this.buttons = [];
            },
            init: function () {
                this.base.init();
                this.$ = $(this.element);
            },
            render: function (variable) {
                this.base.render();
                if (variable.inline) {
                    this.addClass("form-inline");
                }
                if (variable.horizontal) {
                    this.addClass("form-horizontal");
                }
            },
            wait: function (showOrHide) {
                if (this.__wait_ == null) {
                    this.__wait_ = this.constructor("wait", {
                        sm: true,
                        fade: true,
                        context: this.element
                    });
                }
                this.__wait_.toggle(showOrHide);
            },
            ajax: function () {
                var ajax = {
                    url: null,
                    type: "GET",
                    params: {}
                };

                if (this.invoke("ajax-ready", ajax) !== false) {

                    this.wait(true);

                    $.ajax(ajax.url, {
                        type: ajax.type,
                        dataType: "json",
                        data: ajax.params,
                        success: function (json) {
                            if (my.invoke("ajax-success", json) !== false) {
                                if (json.status) {
                                    my.invoke("ajax-load", json);
                                    if (my.sleep(false)) {
                                        my.load();
                                    }
                                } else {
                                    v2.validate("<strong>错误&ensp;:</strong>&ensp;&ensp;" + json.message + "", "danger");
                                }
                            }
                            my.wait(false);
                        },
                        error: function (xhr) {
                            my.invoke("ajax-error", xhr.status, xhr);
                            my.wait(false);
                        }
                    });
                }
            },
            ajaxLoad: function (json) {
                this.data = json.data;
            },
            load: function () {
                this.val(this.data);
            },
            val: function (data) {
                if (arguments.length > 0) {
                    return v2.each(data, function (value, key) {
                        var control = valueObject[key];
                        if (v2.isArray(control)) {
                            return v2.each(control, function (item) {
                                item.val(value);
                            });
                        }
                        return control.val(value);
                    });
                }
                var value, json = {};
                v2.each(valueObject, function (control, name) {
                    if (control.group) {
                        var join = control.join, isFunction = v2.isFunction(join);
                        return v2.each(control.group, function (item) {
                            if (value = item.val()) {
                                if (isFunction) {
                                    json[name] = join.call(item, json[name], value);
                                } else {
                                    json[name] = json[name] ? json[name] + "," + value : value;
                                }
                            }
                        });
                    }
                    if (value = control.val()) {
                        json[name] = value;
                    }
                });
                return json;
            },
            isValid: function () {
                return v2.every(valueObject, function (control) {
                    if (control.tag === "input" || control.tag === "input-search" || control.tag === "inputSearch") {
                        if (control.isValid()) return true;
                        if (control.validityError) control.validityError.Massage();
                        return control.focus(), false;
                    }
                    return true;
                });
            },
            submit: function () {
                if (this.isValid() === false) return false;

                var ajax = {
                    url: null,
                    type: "POST",
                    params: this.val()
                };

                if (this.invoke("submit-ready", ajax) === false) return false;

                this.wait(true);

                $.ajax(ajax.url, {
                    type: ajax.type,
                    dataType: "json",
                    data: ajax.type.toUpperCase() === "GET" ? ajax.params : JSON.stringify(ajax.params),
                    contentType: 'application/json;charset=UTF-8',
                    success: function (json) {
                        if (my.invoke("submit-success", json) !== false) {
                            if (json.status) {
                                my.invoke("submit-load", json);
                            } else {
                                v2.validate("<strong>错误&ensp;:</strong>&ensp;&ensp;" + json.message + "", "danger");
                            }
                        }
                        my.wait(false);
                    },
                    error: function (xhr) {
                        my.invoke("submit-error", xhr.status, xhr);
                        my.wait(false);
                    }
                });
            },
            reset: function () {
                this.val(this.data);
            },
            resolve: function () {
                var jq, context, control, html = '<div class="form-group"><label for="form-{field}">{title}：</label></div>';
                v2.each(this.rows = this.rows || [], function (row) {
                    my.$.append((row.type === "checkbox" || row.type === "radio")
                        ? v2.format('<div class="form-group"><label>{0}：</label></div>', row.title)
                        : v2.replace(html, row));
                    context = jq ? jq = jq.next() : jq = my.$.children().eq(-1);
                    row.options = v2.extend(row.options, {
                        id: "form-" + row.field,
                        name: row.field,
                        title: row.title,
                        context: context
                    });

                    v2.improve(row.options, { type: row.type });
                    var relationControl = function (next) {
                        if (control) {
                            control.nextControl = next;
                            next.previousControl = control;
                        }
                        return control = next;
                    };
                    var tag = row.type === "search"
                        ? "inputSearch" :
                        row.type === "select"
                            ? "select"
                            : (row.type === "checkbox" || row.type === "radio")
                                ? "check"
                                : "input";
                    if (tag === "check") {
                        if (row.group) {
                            return valueObject[row.field] = {
                                join: row.join || ",",
                                group: v2.map(row.group, function (options) {
                                    return relationControl(v2(tag, v2.improve(true, options, row.options)));
                                })
                            };
                        }
                        return valueObject[row.field] = relationControl(v2(tag, row.options));
                    }
                    if (row.group) {
                        return v2.each(row.group, function (options) {
                            if (v2.isString(options)) {
                                context.append(options);
                            } else {
                                valueObject[options.field || row.field] = relationControl(v2(tag, v2.improve(true, {
                                    id: "form-" + options.field,
                                    name: options.field
                                }, options, row.options)));
                            }
                        });
                    }
                    return valueObject[row.field] = relationControl(v2(tag, row.options));
                });

                this.$.append('<div class="form-group"></div>');
                context = jq ? jq.next() : this.$.children().eq(-1);
                v2.each(v2.makeArray(this.buttons), function (button) {
                    if (button.type === "submit") {
                        var submit = button.click;
                        button.click = my.proxy(my, submit ? function () {
                            debugger;
                            if (submit.apply(this, arguments) !== false) {
                                my.submit();
                            }
                        } : my.submit);
                    }
                    if (button.type === "reset") {
                        var reset = button.click;
                        button.click = my.proxy(my, reset ? function () {
                            debugger;
                            if (reset.apply(this, arguments) !== false) {
                                my.reset();
                            }
                        } : my.reset);
                    }
                    return v2("button", v2.extend(button, { context: context }));
                });

                this.val(this.data);
            },
            commit: function () {
                this.$.on("keyup", function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 13 || code === 108) {
                        if (my.submitEnter) my.submit();
                    }
                });
            }
        });
    }
    v2.register("form", form);
})(jQuery, v2Kit);
