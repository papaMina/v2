(function ($, v2) {
    var textModel = {
        submit: "提交",
        reset: "重置",
        _default: "确认"
    };
    var rhtmlTag = /<(\w+).*?\/?>.*(?:<\/\1>|)/;
    v2.register("button", {
        ctor: function () {
            this.type = "button";//[button|submit|reset]
            this.text = null;//按钮显示文字（未设置时，由type对应的textModel决定）
            this.style = "default";//[default|primary|success|info|warning|danger|link]按钮风格（字体大小，颜色等）默认是【btn btn-default】
            //this.lg = false;
            //this.sm = false;
        },
        init: function () {
            this.base.init('button');
            this.$ = $(this.element);
            this.$.attr("type", this.type);
        },
        render: function (variable) {
            this.base.render();
            this.$.addClass("btn");
            if (variable.lg) {
                this.addClass("btn-lg");
            }
            if (variable.sm) {
                this.addClass("btn-sm");
            }
            this.addClass("btn-" + (this.style || "default"));
            this.setText(this.text || textModel[this.type] || textModel._default);
        },
        setText: function (string) {
            if (rhtmlTag.test(string)) {
                this.$.html(string);
            } else {
                this.$.text(this.text = string);
            }
        },
        commit: function () {
            this.$.on("click", this.click);
        }
    });
})(jQuery, v2Kit);