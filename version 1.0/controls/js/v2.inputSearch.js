/*!
 * JavaScript v2 v1.0.1
 * https://github.com/v2kit/v2
 *
 * @author hyly
 * @date 2018-08-01
 * @descript a valuable technology object.
 */
(function ($, v2) {
    function inputSearch(my) {
        return new Object({
            ctor: function () {
                this.timely = false;//实时的

                this.data = [];

                this.showButton = true;//是否显示按钮

                this.pageIndex = 1;
                this.pageSize = 10;
                this.pageTotal = 0;
            },
            init: function () {
                this.base.init();
                this.$dropdown = this.$.prepend('<ul class="input-dropdown dropdown-menu"></ul>').children().eq(0);
            },
            render: function (variable) {
                if (this.showButton) {
                    var buttonsNext = {
                        attributes: {
                            "data-submit": "ajax"
                        },
                        text: '<i class="glyphicons glyphicons-search"></i>'
                    };
                    variable.buttonsNext = variable.buttonsNext ? v2.makeArray(buttonsNext, v2.makeArray(variable.buttonsNext)) : buttonsNext;
                }
                this.base.render();
            },
            ajax: function () {
                var ajax = {
                    url: null,
                    type: "GET",
                    params: {
                        keywords: this.value,
                        page: this.pageIndex,
                        size: this.pageSize
                    }
                };
                if (this.invoke("ajax-ready", ajax) !== false) {
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
                                }
                            }
                        },
                        error: function (xhr) {
                            my.invoke("ajax-error", xhr.status, xhr);
                        }
                    });
                }
            },
            ajaxLoad: function (json) {
                this.data = json.data;
                this.pageTotal = json.total;
            },
            load: function () {
                if (!this.data || this.data.length === 0) {
                    this.$dropdown.empty().append('<li><a href="#">没有找到匹配的记录</a></li>');
                } else {
                    this.$dropdown.empty().append(v2.expression('{for(item in data) {"<li data-key="{item.id}"><a href="javascript:void(0)">{item.name}</a></li>"}^}', this.data));
                    if (this.timely) {
                        this.$dropdown.children().eq(0).addClass("active");
                    }
                }
                this.$dropdown.addClass("show");
            },
            val: function (key, value) {
                if (key == null) return this.key || "";
                this.key = key;
                this.base.val(value == null ? key : value);
            },
            keyboardEnter: function () {
                var jq;
                if (this.$dropdown.hasClass("show") && (jq = this.$dropdown.find(".active")).length > 0) {
                    this.val(jq.attr("data-key"), jq.text());
                    this.$dropdown.removeClass("show");
                } else {
                    this.$dropdown.removeClass("show").empty();
                    this.ajax();
                }
            },
            valueChange: function () {
                this.key = "";
                if (this.timely) {
                    this.$dropdown.removeClass("show").empty();
                    this.ajax();
                }
            },
            commit: function () {
                var my = this;
                this.base.commit();
                this.$.on("click", '[data-submit="ajax"]', function () {
                    if (my.isValid()) {
                        my.$dropdown.empty();
                        my.ajax();
                    }
                });
                this.$input.on("click", function () {
                    if (my.data && my.data.length) {
                        my.$dropdown.addClass("show");
                    }
                });
                this.$.on("keydown", function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 27) {
                        my.$dropdown.removeClass("show");
                    }
                    if (my.data && my.data.length) {
                        if (code === 38 || code === 40) {
                            var context = my.$dropdown.children();
                            var jq = context.filter(".active");
                            if (code === 40) {
                                jq = jq.next().add(context.eq(0)).eq(-1);
                            } else {
                                jq = jq.prev().add(context.eq(-1)).eq(0);
                            }
                            jq.addClass("active")
                                .siblings().removeClass("active");
                        }
                    }
                });
                this.$dropdown.on("click", '[data-key]', function () {
                    var jq = $(this);
                    my.val(jq.attr("data-key"), jq.text());
                    jq.addClass("active").siblings().removeClass("active");
                    my.$dropdown.removeClass("show");
                });
                $(document).on("click", function (e) {
                    if (!v2.contains(my.element, e.target)) {
                        my.$dropdown.removeClass("show");
                    }
                });
            }
        });
    }
    v2.register("input.input-search", inputSearch);

})(jQuery, v2Kit);