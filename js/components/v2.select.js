define(function () {
    v2.use("select", {
        select: function () {
            /** 涉及到的控件 */
            this.$touch = null;
            /** 当前选中的元素 */
            this.selectedIndex = -1;
        },
        init: function () {
            this.base.init('ul');
        },
        render: function () {
            this.base.render();
            this.addClass('dropdown-menu');
        },
        usb: function () {
            this.base.usb();
            this.define('selectedIndex', function (index) {
                this.when()
                    .then(function (elem) {
                        v2.removeClass(elem, 'active');
                    })
                    .nth(index)
                    .done(function (elem) {
                        v2.addClass(elem, 'active');
                    });
            }, true).define('selectedValue', {
                get: function () {
                    return this.data ? this.data[this.selectedIndex] : null;
                }
            }, true);
        },
        resolve: function (data) {
            var divider = '"<li role="separator" class="divider"></li>"',
                fmt = '$"<li data-index="{index}" class="{item.disabled?"disabled"}"><a data-id="{item.id}" href="{item.url??"#"}">{item.name??item.text??"匿名"}</a></li>"';
            if (v2.isPlainObject(data)) {
                divider = data.divider || data.separator || divider;
                fmt = data.format || data.fmt || fmt;
                data = data.data;
            }
            if (!data || !data.length) {
                data = [{ disabled: true, name: '暂无数据!' }];
            }
            var htmls = ['`${for(var item<index> in .){',
                '   if(item === "separator" || item === "divider"){',
                divider,
                '   }else{',
                fmt,
                '   }',
                '}}`'];
            this.append(htmls.join('').forCb(this.data = data));
        },
        commit: function () {
            var my = this;
            this.base.commit();
            this.on('click', '[data-index]:not(.disabled)', function () {
                my.selectedIndex = +v2.attr(this, 'data-index');
            });
            this.$master.on('click', function () {
                my.$touch.toggleClass('open');
                return false;
            });
            v2.on(document, 'click', function () {
                my.$touch.removeClass('open');
            });
        }
    });
    return function (options) {
        return v2('select', options);
    };
});