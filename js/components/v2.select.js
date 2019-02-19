define(function () {
    v2.use("select", {
        select: function () {
            /** 最近一个触发控件 */
            this.$sharp = null;
        },
        init: function () {
            this.base.init('ul');
        },
        render: function () {
            this.base.render();
            this.addClass('dropdown-menu');
        },
        resolve: function (data) {
            var divider = '"<li role="separator" class="divider"></li>"',
                fmt = '$"<li data-index="{index}"><a data-id="{item.id}" href="{item.url|"#"}">{item.name|item.text|"匿名"}</a></li>"';
            if (v2.isPlainObject(data)) {
                divider = data.divider || data.separator || divider;
                fmt = data.format || data.fmt || fmt;
                data = data.data;
            }
            if (!data || !data.length) {
                data = [{ name: '暂无数据!' }];
            }
            var htmls = ['`${for(var item<index> in .){',
                '   if(item === "separator" || item === "divider"){',
                divider,
                '   }else{',
                fmt,
                '   }',
                '}}`'];
            this.append(htmls.join('').each(this.data = data));
        },
        commit: function () {
            var my = this;
            this.on('click', '[data-index]', function () {
                my.owner.val(my.data[v2.attr(this, 'data-index')]);
            });
            this.owner.on('click', function () {
                my.$sharp.toggleClass('open');
                return false;
            });
            v2.on(document, 'click', function () {
                my.$sharp.removeClass('open');
            });
        }
    });
    return function (options) {
        return v2('select', options);
    };
});