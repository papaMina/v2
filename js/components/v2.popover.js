define(function (require) {
    v2.use("popover", {
        popover: function () {
            /*父级id*/
            this.$touch = null;
            /*在父级的哪个方向*/
            this.direction = "bottom";
            /*标题*/
            this.title = null;
            /*内容*/
            this.content = null;
        },
        render: function () {
            this.base.render();
            this.addClass("popover");
            this.addClass("fade");
            this.addClass(this.direction);
            this.addClass("in");
            if (this.title) {
                this.append(v2.htmlSerialize('h3.popover-title{{title}}'.withCb(this)));
            }
            this.append(v2.htmlSerialize('.arrow+.popover-content{{content}}'.withCb(this)));

        },
        resolve: function () {
            this.cssAt
            var elem = this.$touch.$ || this.$touch;//父级
            var pWidth = this.propAt(elem, "offsetWidth"),//父级 宽
                pHeight = this.propAt(elem, "offsetHeight"),//父级 高
                pLeft = this.propAt(elem, "offsetLeft"),//父级 左偏移
                pTop = this.propAt(elem, "offsetTop"), //父级 上偏移
                cWidth = this.prop("offsetWidth"),//提示框 宽
                cHeight = this.prop("offsetHeight"),//提示框 高
                top, left;//设置上，左偏移
            switch (this.direction) {
                case 'bottom':
                    top = pHeight + pTop;
                    left = pLeft + pWidth / 2 - cWidth / 2;
                    break;
                case 'top':
                    top = pTop - cHeight;
                    left = pLeft + pWidth / 2 - cWidth / 2;
                    break;
                case 'left':
                    left = pLeft - cWidth;
                    top = pTop + pHeight / 2 - cHeight / 2;
                    break;
                case 'right':
                    left = pLeft + pWidth;
                    top = pTop + pHeight / 2 - cHeight / 2;
                    break;
                default:
                    this.addClass('bottom');
                    top = pHeight + pTop;
                    left = pLeft + pWidth / 2 - cWidth / 2;
                    break;
            }
            this.css({ top: top, left: left });
        },
    });
    return function (options) {
        return v2('popover', options);
    };
});