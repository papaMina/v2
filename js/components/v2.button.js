define(function (require) {
    v2.use("button", {
        components: {
            select: function () {
                return require('components/v2.select');
            }
        },
        button: function () {
            /** 按钮类型 */
            this.type = "button";
            /** 按钮名称 */
            this.text = "确定";
            /** 用于替换按钮的所有子元素 */
            this.html = "";
            /** 超小按钮 */
            this.xs = false;
            /** 小按钮 */
            this.sm = false;
            /** 大按钮 */
            this.lg = false;
            /** 下拉列表 */
            this.dropdown = false;
        },
        init: function () {
            this.base.init('button');
        },
        render: function () {
            this.base.render();
            this.addClass('btn');
            if (this.lg || this.sm || this.xs) {
                this.addClass(this.lg ? 'btn-lg' : this.sm ? 'btn-sm' : 'btn-xs');
            }
            this.attr('type', this.type || 'button');
            this.empty()
                .append(this.html || document.createTextNode(this.text));
        },
        resolve: function (data) {
            if (this.dropdown) {
                this.constructor('select', { $$: this.$$, $sharp: this.owner, data: data });
            }
        }
    });
    return function (options) {
        return v2('button', options);
    };
});