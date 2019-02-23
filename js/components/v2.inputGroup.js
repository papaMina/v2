define(function (require) {
    v2.use("input-group", {
        components: {
            input: function () {
                return require('components/v2.input');
            },
            button: function () {
                return require('components/v2.button');
            },
            buttonGroup: function () {
                return require('components/v2.buttonGroup');
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
            this.base.init();
        },
        render: function () {
            this.base.render();
            this.addClass(this.vertical ? 'btn-group-vertical' : 'btn-group');
            if (this.lg || this.sm || this.xs) {
                this.addClass(this.lg ? 'btn-group-lg' : this.sm ? 'btn-group-sm' : 'btn-group-xs');
            }
        },
        resolve: function (data) {
            v2.each(data.controls, function (option) {
                if (v2.isString(option)) {
                    return this.append('<span class="input-group-addon">' + option + '</span>');
                }
                return this.constructor(option.tag, option);
            }, this);
            var elem = this.take('> ul:last-child');
            if (elem && (elem = v2.sibling(elem, 'previousSibling'))) {
                this.css({
                    'border-top-right-radius': '0.25em',
                    'border-bottom-right-radius': '0.25em'
                }, elem);
            }
        }
    });
    return function (options) {
        return v2('button-group', options);
    };
});