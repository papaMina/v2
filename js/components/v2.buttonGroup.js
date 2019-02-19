define(function (require) {
    v2.use("button-group", {
        components: {
            button: function () {
                return require('components/v2.button');
            }
        },
        buttonGroup: function () {
            /** 超小按钮 */
            this.xs = false;
            /** 小按钮 */
            this.sm = false;
            /** 大按钮 */
            this.lg = false;
            /** 纵向排列 */
            this.vertical = false;
        },
        init: function () {
            this.base.init('div');
        },
        render: function () {
            this.base.render();
            this.addClass(this.vertical ? 'btn-group-vertical' : 'btn-group');
            if (this.lg || this.sm || this.xs) {
                this.addClass(this.lg ? 'btn-lg' : this.sm ? 'btn-sm' : 'btn-xs');
            }
        },
        resolve: function (data) {
            v2.each(data.buttons, function (options) {
                return this.constructor('button', options);
            }, this);
        }
    });
    return function (options) {
        return v2('button-group', options);
    };
});