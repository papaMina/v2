define(function (require) {
    v2.use("popover", {
        popover: function () {
            /*父级id*/
            this.$touch = null;
            /*在父级的哪个方向*/
            this.direction = "bottom";
            /*标题*/
            this.title = "提示";
            /*内容*/
            this.content = null;
            /*弹出框id*/
            this.id = parseInt(Math.random() * 10000, 10) + 1;
        },
        render: function () {
            console.log(this.id);
            this.base.render();
            this.append(v2.htmlSerialize('div#{id}.popover.fade.{direction}.in>div.arrow>h3.popover-title{{title}}+div.popover-content{{content}}'.withCb(this)));            
        },
        resolve: function () {
            //console.log(this.id);
            this.cssAt
            var elem = this.$touch.$ || this.$touch;
            //console.log(elem);
            var pWidth = this.cssAt(elem, "width");
            var pHeight = this.cssAt(elem, "height");
            var pLeft = this.propAt(elem, "offsetLeft");
            var pTop = this.propAt(elem, "offsetTop");
            pTop
            console.log(a);
            //elem
            //var box = document.getElementById(this.patternId);
            //var id = parseInt(Math.random() * 10000, 10) + 1
            //box.setAttribute("aria-describedby", "popover" + this.id);
            //var boxStyle = window.getComputedStyle(box);
            //var popoverH = boxStyle.height;
            //var popoverW = boxStyle.width;
            //var left = box.offsetLeft;
            //var top = box.offsetTop;
            //var popoverH = top + popoverH;//top
            //var popoverH = top + popoverH;

        },
    });
    return function (options) {
        return v2('popover', options);
    };
});