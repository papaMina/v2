/*!
 * JavaScript v2 v1.0.1
 * https://github.com/v2kit/v2
 *
 * @author hyly
 * @date 2018-08-01
 * @descript a valuable technology object.
 */
(function ($, v2) {
    var rtitle = /^<(?!area|br|col|embed|hr|img|input|link|meta|param)(\w+).*?>.*?<\/\1>$/;
    var rpath = /(?:\/?(?:\w+\.)?\w+\/)*\w+(\.\w+|\/)([?#].*)?$/;
    var rimg = /^\.[bmp|jpe?g|png|svg|gif|ico|tiff|pcx|tga|exif|fpx|psd|cdr|pcd|dxf|ufo|eps|ai|raw|wmf|webp|flic|emf]$/i;
    var enumObj = {
        question: '<span class="dialog-status text-warning"><i class="glyphicons glyphicons-question-sign"></i></span>',
        info: '<span class="dialog-status text-info"><i class="glyphicons glyphicons-info-sign"></i></span>',
        exclamation: '<span class="dialog-status text-danger"><i class="glyphicons glyphicons-exclamation-sign"></i></span>'
    };
    var core_width, core_height, docElem = document.documentElement;
    $(document).ready(function () {
        core_width = Math.max(docElem.offsetWidth, docElem.clientWidth);
        core_height = Math.max(docElem.offsetHeight, docElem.clientHeight);
    });
    $(window).resize(function () {
        core_width = Math.max(docElem.offsetWidth, docElem.clientWidth);
        core_height = Math.max(docElem.offsetHeight, docElem.clientHeight);
    });
    function dialog(my, variable) {
        var responsive = true;
        return new Object({
            isClose: true,
            init: function () {
                this.base.init();
                this.$ = $(this.element);
                this.$context = $(this.context);

                this.$dialog = this.$.append('<div class="dialog"></div>')
                    .children().last();

                this.header();
                this.footer();
                this.container();
                this.footer();
            },
            render: function (variable) {
                this.base.render();

                if (variable.fade) {
                    this.addClass("fade");
                }
                if (variable.backdrop) {
                    this.$.after('<div class="backdrop"></div>');
                    this.$backdrop = this.$.next();
                }
                if (variable.max) {
                    this.max();
                }
                if (variable.min) {
                    this.min();
                }
            },
            header: function () {
                if (variable.header) {
                    var htmls = ['<div class="dialog-header">'];
                    if (rtitle.test(variable.title)) {
                        htmls.push(variable.title);
                    } else {
                        htmls.push('<h5 class="dialog-title">');
                        if (variable.status) {
                            htmls.push(enumObj[variable.status]);
                        }
                        htmls.push(variable.title);
                        htmls.push('</h5>');
                    }
                    if (variable.showMin || variable.showMax || variable.showClose) {
                        htmls.push('<div class="dialog-menu">');
                        if (variable.showMin) {
                            htmls.push('<button data-invoke="min" class="dialog-item"><i class="glyphicons glyphicons-minus"></i></button>');
                        }
                        if (variable.showMax) {
                            htmls.push('<button data-invoke="max" class="dialog-item"><i class="glyphicons glyphicons-unchecked"></i></button>');
                            htmls.push('<button data-invoke="restore" class="dialog-item"><i class="glyphicons glyphicons-more-windows"></i></button>');
                        }
                        if (variable.showClose) {
                            htmls.push('<button data-invoke="close" class="dialog-item"><i class="glyphicons glyphicons-remove"></i></button>');
                        }
                        htmls.push('</div>');
                    }
                    this.$dialog.append(htmls.join(''));
                    this.$header = this.$dialog.children().eq(-1);
                }
            },
            container: function () {
                var match, content = variable.content;

                this.$dialog.append('<div class="dialog-container"></div>');

                this.$container = this.$dialog.children().eq(-1);

                if (content) {
                    if (match = rpath.exec(content)) {
                        if (match[1] && rimg.test(match[1])) {
                            this.$container.append(v2.format('<div class="text-center"><a href="#" class="thumbnail"><img src="{0}" alt="" /></a></div>', content));
                        } else {
                            this.$container.append(v2.format('<iframe src="{0}" height="100%" frameborder="0"></iframe>', content));
                            this.$container.css({ padding: 0, "overflow-y": "hidden" });
                        }
                    } else {
                        this.$container.append(content);
                    }
                    if (responsive) {
                        this.$dialog.find("iframe").on("load readystatechange", function () {
                            if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                                var jq = $(this),
                                    fixObj = { height: "100%" },
                                    initObj = { height: "auto" },
                                    windowDoc = this.contentWindow,
                                    documentDoc = this.contentDocument || windowDoc.document,
                                    context = $(documentDoc.documentElement),
                                    context_body = $(documentDoc.body),
                                    context_all = context.add(context_body),
                                    callback = function () {
                                        if (responsive) {
                                            context_all.css(initObj);
                                            my.$container.height(Math.max(context_body.height(), context.height()));
                                            context_all.css(fixObj);
                                        }
                                    };
                                $(window).resize(callback() || callback);
                            };
                        });
                    }
                }
                this.$container = this.$dialog.children().eq(-1);
            },
            footer: function () {
                if (variable.footer) {
                    this.$dialog.append('<div class="dialog-footer"></div>');
                    this.$footer = this.$dialog.children().eq(-1);
                    return true;
                }
            },
            visible: function (v) {
                this.$.toggleClass("in", variable.visible = !!v);
                this.$context.toggleClass("dialog-open", variable.visible);
                return true;
            },
            min: function () {
                if (variable.showMin) {
                    this.addClass("min");
                    this.modalStatus = "min";
                    if (variable.backdrop) {
                        this.$context.removeClass("dialog-open");
                    }
                }
            },
            max: function () {
                if (variable.showMax) {
                    this.addClass("max");
                    this.modalStatus = "max";
                    if (variable.backdrop) {
                        this.$context.addClass("dialog-open");
                    }
                }
            },
            visible: function (v) {
                if (this.base.visible(v)) {
                    if (variable.visible) {
                        this.$.addClass("in");
                        if (variable.backdrop) {
                            this.$context.addClass("dialog-open");
                        }
                        if (!this.compile) {
                            this.compile = true;
                            if (variable.height) {
                                this.height(variable.height);
                            }
                        }
                    } else {
                        this.$.removeClass("in");
                        if (variable.backdrop) {
                            this.$context.removeClass("dialog-open");
                        }
                    }
                    return true;
                }
            },
            restore: function () {
                if (variable.showMax) {
                    this.$.removeClass(this.modalStatus);
                    if (this.modalStatus == "min") {
                        this.modalStatus = "max";
                    }
                    if (variable.backdrop) {
                        this.$context.addClass("dialog-open");
                    }
                }
            },
            height: function (v) {
                if (this.base.height(v)) {
                    var height = 0;
                    if (variable.header || variable.footer) {
                        if (variable.header) {
                            height = this.$header.outerHeight();
                        }
                        if (variable.footer) {
                            var context = this.$.find(".dialog-footer");
                            context.each(function (i) {
                                height += context.eq(i).outerHeight();
                            });
                        }
                    }
                    responsive = false;
                    this.$container.css("height", variable.height - height);
                    return true;
                }
            },
            close: function () {
                this.hide();
                if (variable.isClose) {
                    this.destroy();
                }
            },
            commit: function () {
                this.$.click(function (e) {
                    if (e.target === my.element) {
                        my.close();
                    }
                });

                if (variable.backdrop && variable.backhidden) {
                    this.$backdrop.click(function () {
                        my.close();
                    });
                }

                this.$context.keyup(function (e) {
                    if (e.keyCode == 27 || e.keyCode == 96) {
                        my.close();
                    }
                });

                var fix_screen = function () {
                    var height = core_height;
                    if (variable.header) {
                        height -= my.$header.outerHeight();
                    }
                    if (variable.footer) {
                        my.$footer.each(function (i) {
                            height -= Math.max(0, my.$footer.eq(i).outerHeight());
                        });
                    }
                    my.$.css({
                        "max-width": core_width,
                        "max-height": core_height
                    });
                    my.$container.css("max-height", height - 20);
                };
                $(window).resize(fix_screen() || fix_screen);

                this.$.on("click", '[data-invoke]', function (e) {
                    my.invoke($(this).attr("data-invoke"));
                });
            }
        });
    }

    v2.register("dialog", dialog);

    v2.dialog = function (options) {
        return v2("dialog", v2.improve(options, { width: 880 }));
    };

    v2.register("dialog.alert", {
        fade: true,
        header: true,
        footer: true,
        visible: true,
        status: "info",
        showClose: true,
        cancel: function () {
            if (this.invoke("invoke-cancel") !== false) {
                this.close();
            }
        },
        footer: function () {
            if (this.base.footer()) {
                this.$footer.append('<button type="button" class="btn btn-default" data-invoke="cancel">' + (this.variable.CancelWorks || "取消") + '</button>');
                return true;
            }
        }
    });

    v2.alert = function (message, title, callback) {
        if (v2.isFunction(title)) {
            callback = title;
            title = undefined;
        }
        return v2("alert", {
            title: title || "温馨提示",
            content: message,
            invokeCancel: callback
        });
    };

    v2.register("dialog.alert.confirm", {
        status: "question",
        ok: function () {
            if (this.invoke("invoke-ok") !== false) {
                this.close();
            }
        },
        footer: function () {
            if (this.base.footer()) {
                this.$footer.append('<button type="button" class="btn btn-primary" data-invoke="ok">' + (this.variable.OkWords || "确定") + '</button>');
                return true;
            }
        }
    });

    v2.confirm = function (message, title, okCallback, cancelCallback) {
        if (v2.isFunction(title)) {
            cancelCallback = okCallback;
            okCallback = title;
            title = undefined;
        }
        return v2("confirm", {
            title: title || "温馨提示",
            content: message,
            invokeOk: okCallback,
            invokeCancel: cancelCallback
        });
    }

    v2.register("dialog.validate", {
        fade: true,
        timeout: 2500,
        visible: true,
        status: "warning",
        container: function () {
            this.variable.content = v2.replace('<div class="alert alert-{status} alert-dismissible" role="alert"><button type="button" class="close" data-invoke="close"><span>&times;</span></button>{content}</div>', this.variable);
            this.base.container();
        },
        commit: function () {
            this.base.commit();
            if (this.variable.timeout > 0) {
                var my = this;
                setTimeout(function () {
                    my.close();
                }, ~~this.variable.timeout);
            }
        }
    });

    v2.validate = function (message, status, timeout) {
        if (typeof status === "number") {
            timeout = status;
            status = undefined;
        }
        return v2("validate", {
            status: status,
            timeout: timeout,
            content: message
        });
    }

})(jQuery, v2Kit);