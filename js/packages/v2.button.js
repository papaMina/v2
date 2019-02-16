define(function () {
    v2.use("button", {
        button: function () {
            /** 按钮类型 */
            this.type = "button";
            /** 按钮名称 */
            this.text = "确定";
            /** 用于替换按钮的所有子元素 */
            this.template = "";
        },
        init: function () {
            this.base.init('button');
        },
        disabled: function (disabled) {
            if (this.base.disabled(disabled)) {
                this.toggleClass('disabled', this.variable.disabled);
            }
        },
        render: function () {
            this.base.render();
            this.addClass('btn');
            this.attr('type', this.type || 'button');
            this.empty()
                .append(this.template || document.createTextNode(this.text));
        },
        commit: function () {
            this.on(this.methods);
        }
    });
    return function (options) {
        return v2('button', options);
    };
});