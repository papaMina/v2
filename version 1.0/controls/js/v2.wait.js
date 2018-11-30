/*!
 * JavaScript v2 v1.0.1
 * https://github.com/v2kit/v2
 *
 * @author hyly
 * @date 2018-08-01
 * @descript a valuable technology object.
 */
(function ($, v2) {
    v2.register("wait", {
        init: function () {
            this.base.init();
            this.$ = $(this.element);
            this.$.after('<div class="backdrop"></div>');
            this.$.append('<div></div><div></div><div></div>');
            this.$backdrop = this.$.next();
        },
        render: function (variable) {
            this.base.render();
            if (variable.sm) {
                this.addClass("v2-wait-sm");
            }
            if (variable.lg) {
                this.addClass("v2-wait-lg");
            }
            if (variable.fade) {
                this.addClass("fade");
            }
            if (variable.fullScreen) {
                this.addClass("full-screen");
            }
        },
        visible: function (v) {
            if (v) {
                this.animate();
                this.$.addClass("in");
            } else {
                this.stopAnimate();
                this.$.removeClass("in");
            }
            this.variable.visible = !!v;
        },
        animate: function () {
            if (!v2.cssValid("animation")) {
                if (!this.animateState || this.animateState == "stoped") {
                    var
                        width,
                        my = this,
                        interval = 600,
                        intervalAnimate = function (jq) {
                            jq.css("border-color", "#FF6600").animate({ left: -2 * 1.6 * width - 2 * width, borderWidth: 0.85 * width }, interval, "linear", function () {
                                jq.css("border-color", "#FF9900").animate({ left: 0, borderWidth: width }, interval, "linear", function () {
                                    jq.css("border-color", "#FF4400").animate({ left: 2 * 1.6 * width + 4 * width, borderWidth: 0.85 * width }, interval, "linear", function () {
                                        jq.css("border-color", "#FF9900").animate({ left: 0, borderWidth: width }, interval, "linear", function () {
                                            if (my.animateState == "running") {
                                                intervalAnimate(jq);
                                            } else if (my.animateState == "stop") {
                                                my.animateState = "stoped";
                                            }
                                        });
                                    });
                                });
                            });
                        };
                    var context = this.$.children();
                    context.each(function (i) {
                        var jq = context.eq(i);
                        width = width || +jq.css("border-width") || (my.lg ? 15 : my.sm ? 6 : 10);
                        if (i > 0) {
                            setTimeout(function () {
                                intervalAnimate(jq.css({ left: 0, borderWidth: 0.65 * width }))
                            }, i * interval);
                        } else {
                            intervalAnimate(jq.css({ left: 0, borderWidth: 0.65 * width }));
                        }
                    });
                }
                this.animateState = "running";
            }
        },
        stopAnimate: function () {
            if (!v2.cssValid("animation")) {
                this.animateState = "stop";
            }
        },
        commit: function () {
            this.animate();
        }
    });

})(jQuery, v2Kit);