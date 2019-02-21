define(function (require) {
    v2.use('button', function (option) {
        var config = {
            components: {
                select: function () {
                    return require('components/v2.select');
                }
            },
            button: function () {
                /** 按钮类型 */
                this.type = "button";
                /** 按钮名称 */
                this.text = '';
                /** 用于替换按钮的所有子元素 */
                this.html = '';
                /** 超小按钮 */
                this.xs = false;
                /** 小按钮 */
                this.sm = false;
                /** 大按钮 */
                this.lg = false;
                /** 下拉列表 */
                this.dropdown = false;
            },
            commit: function () {
                this.base.commit();
                this.on("keyup", function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 13 || code === 108) {
                        my.invoke("keyboard-enter");
                    }
                });
            }
        };
        if (option.dropdown && (!option.owner || !(option.owner.tag === "button" || option.owner.tag === 'button-group'))) {
            return v2.extend(config, {
                render: function () {
                    this.addClass('btn-group');
                    if (this.lg || this.sm || this.xs) {
                        this.addClass(this.lg ? 'btn-group-lg' : this.sm ? 'btn-group-sm' : 'btn-group-xs');
                    }
                },
                resolve: function () {
                    this.skipOn = true;
                    this.constructor('button', {
                        dropdown: true,
                        text: this.text,
                        html: this.html,
                        events: this.events,
                        methods: this.methods
                    });
                }
            });
        }
        return v2.extend(config, {
            init: function () {
                this.base.init('button');
            },
            render: function () {
                this.base.render();
                this.addClass('btn');
                if (this.lg || this.sm || this.xs) {
                    this.addClass(this.lg ? 'btn-lg' : this.sm ? 'btn-sm' : 'btn-xs');
                }
                if (this.dropdown) {
                    this.addClass('dropdown-toggle');
                    this.append('&ensp;<span class="caret"></span>&ensp;');
                }
            },
            usb: function () {
                this.base.usb();
                this.define('type')
                    .define({
                        text: function (text) {
                            return this.empty().append(document.createTextNode(text)), text;
                        },
                        html: function (html) {
                            return this.empty().append(html), html;
                        }
                    }, true);
                if (this.dropdown) {
                    var my = this;
                    this.define('selectedIndex', {
                        get: function () {
                            return my.$charp.selectedIndex;
                        },
                        set: function (index) {
                            my.$charp.selectedIndex = index;
                        }
                    }, true).define('selectedValue', {
                        get: function () {
                            return my.$charp.selectedValue;
                        }
                    });
                }
            },
            resolve: function (data) {
                if (this.dropdown) {
                    this.$charp = this.constructor('select', { $$: this.$$, $sharp: this.owner, data: data });
                }
            }
        });
    });
    return function (options) {
        return v2('button', options);
    };
});