/*!
 * JavaScript v2 v1.0.1
 * https://github.com/v2kit/v2
 *
 * @author hyly
 * @date 2018-08-01
 * @descript a valuable technology object.
 */
(function ($, v2) {
    v2.register("tabbar", {
        init: function () {
            this.base.init();
            this.$ = $(this.element);
        },
        render: function () {
            this.base.render();
            var htmls = [
                '<div class="lyt-tabbar-region">',
                '	<div class="lyt-tabbar-region-scroll">',
                '		<ul></ul>',
                '	</div>',
                '</div>',
                '<div class="lyt-tabbar-roll">',
                '	<button type="button">',
                '		<i class="glyphicons glyphicons-chevron-left"></i>',
                '	</button>',
                '	<button type="button">',
                '		<i class="glyphicons glyphicons-chevron-right"></i>',
                '	</button>',
                '</div>'];
            this.$.append(htmls.join(''));
            this.R = this.$.children(".lyt-tabbar-region");
            this.U = this.R.find("ul");
        },
        remove: function (v) {
            if (v) {
                v = v.value || v;
                v2.each(this.data, function (item, i) {
                    if (item.value == v) {
                        this.data.splice(i, 1);
                        this.U.children().eq(i).remove();
                        return false;
                    }
                }, this);
            }
        },
        format: function (v) {
            return v2.expression('<a href="{value}" class="{if(active) "active" ^}">{text}{if(showRemove) "<i class=\\"halflings halflings-remove\\"></i>" ^}</a>', v);
        },
        push: function (v) {
            if (v && !v2.has(this.data, function (item) { return item.value == v.value; })) {
                this.data.push(v);
                this.U.append(v2.format('<li>{0}</li>', this.format(v)));
            }
        },
        resolve: function () {
            var htmls = [];
            v2.each(this.data = this.data || [], function (v) {
                htmls.push('<li>');
                htmls.push(this.format(v));
                htmls.push('</li>');
            }, this);
            this.U.append(htmls.join(''));
        },
        commit: function () {
            var elem = this.R.children().get(0);
            this.R.next().children("button:first-child").click(function () {
                $(elem).animate({ scrollLeft: elem.scrollLeft - 120 }, 120);
            }).next().click(function () {
                $(elem).animate({ scrollLeft: elem.scrollLeft + 120 }, 120);
            });
        }
    });
})(jQuery, v2Kit);