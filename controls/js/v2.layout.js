/*!
 * JavaScript v2 v1.0.1
 * https://github.com/v2kit/v2
 *
 * @author hyly
 * @date 2018-08-01
 * @descript a valuable technology object.
 */
(function ($, v2) {
    var rhash = /^#(\/\w+)+/;
    var rlocation = /^(https?|ftp):\/\/((\w+\.)*\w+)(\?[^#]*)?(#.*)?/;
    var rimg = /\.(jpe?g|png|gif|bmp|ico|svg)\b/i;
    function layout(context) {
        return {
            ctor: function () {
                this.stack = true;//启用堆栈，每个页面独占一个iframe
                this.element = document.body;
                this.context = document;
            },
            init: function () {
                this.base.init();
                this.$ = $(this.element);
            },
            render: function () {
                this.base.render();
                this.addClass("lyt");
            },
            header: function () {
                var data = this.data || {};
                data.logo = data.logo || "成都优易票信息管理系统";
                if (rimg.test(data.logo)) {
                    data.logo = '<img src="' + data.logo + '" alt=""/>';
                }
                data.userAvatar = data.userAvatar || data.userName && data.userName[0] || "测";
                if (rimg.test(data.userAvatar)) {
                    data.userAvatar = '<img src="' + data.userAvatar + '" alt=""/>';
                }
                var htmls = [
                    '<div class="lyt-header">',
                    '	<div class="lyt-brand">',
                    '		<button type="button" id="lyt-navbar-toggle" class="lyt-navbar-toggle">',
                    '			<span class="icon-bar"></span>',
                    '			<span class="icon-bar"></span>',
                    '			<span class="icon-bar"></span>',
                    '		</button>',
                    '		{logo}',
                    '	</div>',
                    '	<ul class="lyt-collapse">',
                    '		<li>',
                    '		<button class="btn btn-primary">',
                    '			<i class="glyphicons glyphicons-bell"></i>',
                    '			&ensp;{return msgTitle || "消息管理"^}',
                    '			<span class="badge">{return msgCount >>> 0^}</span>',
                    '		</button>',
                    '		</li>',
                    '		<li class="lyt-keyboard">{for(var item in [keyboard]) "<a href="{item.href}" title="{item.title}">{item.text}</a>"^}</li>',
                    '		<li class="lyt-search">',
                    '			<div class="input-group">',
                    '				<div class="input-group-btn">',
                    '					<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                    '						<span>全部</span>',
                    '						<i class="caret"></i>',
                    '					</button>',
                    '					<ul class="dropdown-menu">',
                    '                       {for(var item<i> in [navbar]) "<li data-eq="{i}"><a href="#">{item.text}</a></li>"^}',
                    '						<li role="separator" class="divider"></li>',
                    '						<li class="active"><a href="#">全部</a></li>',
                    '					</ul>',
                    '				</div><!-- /btn-group -->',
                    '				<input type="text" class="form-control" aria-label="...">',
                    '               <div class="lyt-search-layer hidden"></div>',
                    '				<span class="input-group-btn">',
                    '					<button class="btn btn-default" type="button">',
                    '						<i class="glyphicons glyphicons-search"></i>',
                    '					</button>',
                    '				</span>',
                    '			</div>',
                    '		</li > ',
                    '		<li class="lyt-user">',
                    '			<a href="#">',
                    '				<div class="lyt-user-avatar">{userAvatar}</div>',
                    '			</a>',
                    '			<div class="lyt-user-main">',
                    '				<div class="lyt-user-info">',
                    '					<div class="lyt-user-avatar">{userAvatar}</div>',
                    '					<p class="text-center">{return userMail || userName || "AI"^}</p>',
                    '				</div>',
                    '				<ul class="lyt-user-menu">',
                    '					<li>',
                    '						<a href="#">',
                    '							<i class="glyphicons glyphicons-address-book"></i>',
                    '							<span>基本资料</span>',
                    '						</a>',
                    '					</li>',
                    '					<li>',
                    '						<a href="#">',
                    '							<i class="glyphicons glyphicons-book-open"></i>',
                    '							<span>详细资料</span>',
                    '						</a>',
                    '					</li>',
                    '					<li>',
                    '						<a href="#/views/changePwd">',
                    '							<i class="glyphicons glyphicons-shield"></i>',
                    '							<span>安全中心</span>',
                    '						</a>',
                    '					</li>',
                    '				</ul>',
                    '				<a href="#" class="lyt-user-logout text-center">',
                    '					<i class="glyphicons glyphicons-power"></i>',
                    '				</a>',
                    '			</div>',
                    '		</li>',
                    '	</ul>',
                    '</div>'];
                this.$.append(v2.expression(htmls.join(''), data));
            },
            navbar: function () {
                var data = this.data || {};
                var htmls = v2.map(data.navbar, function (group) {
                    if (group.menu) {
                        var html = [v2.replace('<li><p><i class="{flag}"></i><span>{text}</span><em class="halflings"></em></p>', group)];
                        html.push('<div class="lyt-navbar-thumbnail"><ul>');
                        v2.each(group.menu, function (menu) {
                            html.push(v2.replace('<li><a href="{href}">{text}</a></li>', menu));
                        });
                        html.push('</ul></div>');
                        html.push('</li>');
                    }
                    return html.join('');
                });
                htmls = ['<div class="lyt-navbar">',
                    '	<div class="lyt-navbar-header text-center">',
                    '		<i class="glyphicons glyphicons-calendar"></i><span class="lyt-navbar-calendar">', v2.date.format(new Date(), 'yyyy年MM月dd日'), '</span>',
                    '	</div>',
                    '	<ul class="lyt-navbar-menu">', htmls.join(''), '</ul>',
                    '</div>'];
                this.$.append(htmls.join(''));
            },
            container: function () {
                this.tabbar = [{ text: "首页", value: "#/views/index" }];
                var htmls = [
                    '<div class="lyt-container">',
                    '   <div class="lyt-tabbar">',
                    '		<div class="lyt-tabbar-region">',
                    '			<div class="lyt-tabbar-region-scroll">',
                    '				<ul><li><a href="#/views/index" class="active">首页</a></li></ul>',
                    '			</div>',
                    '		</div>',
                    '		<div class="lyt-tabbar-roll">',
                    '			<button type="button">',
                    '				<i class="glyphicons glyphicons-chevron-left"></i>',
                    '			</button>',
                    '			<button type="button">',
                    '				<i class="glyphicons glyphicons-chevron-right"></i>',
                    '			</button>',
                    '		</div>',
                    '	</div>',
                    '   <div class="container">',
                    '       <ul>',
                    '           <li data-domain="#/views/index"><iframe class="ifr" src="views/index.html" height="100%" frameborder="0"></iframe></li>',
                    '       </ul>',
                    '   </div>',
                    '</div>'];
                this.$.append(htmls.join(''));
                this.$region = this.$.find('.lyt-tabbar-region');
                this.$regionContent = this.$region.find("ul");
                this.$containerContent = this.$.find(".container").children();
            },
            ajax: function (my) {
                this.data = {
                    keyboard: [{
                        text: "系统设置",
                        href: "#/views/setting",
                        title: "系统设置"
                    }],
                    navbar: [{
                        text: "商品管理",
                        flag: "halflings halflings-flag",
                        menu: [{
                            text: "商品列表",
                            href: "#/views/goods/index"
                        }, {
                            text: "商品分类",
                            href: "#/views/goods/categorize"
                        }]
                    }, {
                        text: "税盘管理",
                        flag: "halflings halflings-hdd",
                        menu: [{
                            text: "税盘信息",
                            href: "#/views/board/index"
                        }, {
                            text: "税盘设置",
                            href: "#/views/board/setting"
                        }]
                    }]
                };
            },
            remove: function (v) {
                if (v) {
                    v = v.value || v;
                    v2.each(this.tabbar, function (item, i) {
                        if (item.value == v) {
                            v2.removeAt(this.tabbar, i);
                            location.href = this.$regionContent.children().eq(i).remove()
                                .prevObject.eq(i - 1).children().attr("href");
                            if (this.stack) {
                                this.$containerContent.find('[data-domain="' + v + '"]').remove();
                            }
                            return false;
                        }
                    }, this);
                }
            },
            format: function (v) {
                return v2.expression('<a href="{value}" class="{if(active) "active" ^}">{text}{if(showRemove) "<i class="halflings halflings-remove"></i>" ^}</a>', v);
            },
            push: function (v) {
                if (!v) return false;
                if (v2.has(this.tabbar, function (item) { return item.value == v.value; })) {
                    if (this.stack) {
                        this.$containerContent.find('[data-domain="' + v.value + '"]').removeClass("hidden").siblings().addClass("hidden");
                    }
                } else {
                    this.tabbar.push(v);
                    this.$regionContent.append(v2.format('<li>{0}</li>', this.format(v)));
                    if (this.stack) {
                        this.$containerContent.children().addClass("hidden");
                        this.$containerContent.append(v2.format('<li data-domain="{0}"><iframe class="ifr" src="{1}.html" height="100%" frameborder="0"></iframe></li>', v.value, v.value.slice(1)));
                    }
                }
                if (!this.stack) {
                    this.$containerContent.children().children().attr("src", hash.slice(1) + ".html");
                }
            },
            resolve: function () {
                this.header();
                this.navbar();
                this.container();
            },
            commit: function () {
                //导航
                var navbar = this.$.find(".lyt-navbar");
                this.$.find(".lyt-navbar-toggle").click(function () {
                    navbar.toggleClass("lyt-navbar-min");
                });
                var navbar_context = navbar.find(".lyt-navbar-menu > li");
                navbar_context.children("p").click(function (e) {
                    var jq = $(this).parent();
                    if (jq.hasClass("active")) {
                        jq.removeClass("active");
                    } else {
                        jq.addClass("active").siblings().removeClass("active");
                    }
                });
                //搜索
                var my = this;
                var scope = null;
                var data = this.data || {};
                var data_navbar = data.navbar || [];
                var search_context = this.$.find(".lyt-search");
                var search_group_btn = search_context.find(".input-group-btn");
                var search_context_txt = search_group_btn.find("button span");
                var search_context_dropdown = search_group_btn.find(".dropdown-menu li");
                var search_scope_change = function () {
                    search_context_layer.empty().append(scope ? search_navbar_menu_context.eq(+scope).clone(true) : search_navbar_context.clone(true));
                }
                var search_value_change = function () {
                    var value = search_context_input.val();
                    var data = scope ? data_navbar[scope] : data_navbar;
                    v2.each(data.menu || data, function (item, i) {
                        var context = search_context_layer.children().children();
                        if (item.menu) {
                            if (item.text.indexOf(value) > -1) {
                                context.eq(i).removeClass("hidden");
                                return;
                            }
                            var active_sub = false;
                            var context_sub = context.eq(i).find("li");
                            v2.each(item.menu, function (subitem, k) {
                                if (subitem.text.indexOf(value) > -1) {
                                    active_sub = true;
                                    context_sub.eq(k).removeClass("hidden");
                                } else {
                                    context_sub.eq(k).addClass("hidden");
                                }
                            });
                            context.eq(i).toggleClass("hidden", !active_sub);
                        } else {
                            context.eq(i).toggleClass("hidden", item.text.indexOf(value) === -1);
                        }
                    });
                }
                search_context_dropdown.click(function () {
                    search_group_btn.removeClass("open");
                    search_context_dropdown.removeClass("active");
                    scope = $(this).addClass("active").attr("data-eq");
                    search_context_txt.text($(this).children().text());
                    search_scope_change();
                    search_value_change();
                });
                var search_context_input = search_context.find("input");
                var search_context_layer = search_context.find(".lyt-search-layer");
                var search_navbar_context = navbar.find(".lyt-navbar-menu");
                var search_navbar_menu_context = navbar.find(".lyt-navbar-menu ul");
                search_context_input.on("click", function () {
                    search_value_change();
                    search_context_layer.removeClass("hidden");
                });
                search_context_input.on("input propertychange", search_value_change);
                search_context.mouseleave(function () {
                    search_context_layer.addClass("hidden");
                });
                search_context_layer.on("click", "a", function () {
                    search_context_layer.addClass("hidden");
                });
                search_scope_change();
                var jq,
                    context = this.$.find(".lyt-keyboard a,.lyt-user-menu a"),
                    context_thumbnail = navbar_context.find(".lyt-navbar-thumbnail a");
                context = context.add(context_thumbnail);
                $(".lyt-tabbar").on("click", ".halflings-remove", function (e) {
                    my.remove($(this).parent().attr("href"));
                    return false;
                });
                var elem = this.$region.first();
                this.$region.next().find("button:first-child").click(function () {
                    $(elem).animate({ scrollLeft: elem.scrollLeft - 120 }, 120);
                }).next().click(function () {
                    $(elem).animate({ scrollLeft: elem.scrollLeft + 120 }, 120);
                });
                $(document).on("click", function (e) {
                    if ((!e.target || !v2.contains(search_group_btn.get(0), e.target))) {
                        search_group_btn.removeClass("open");
                    }
                });
                search_group_btn.on("click", '[data-toggle="dropdown"]', function () {
                    search_group_btn.toggleClass("open");
                });
                var isEquals = function (url, hash) {
                    return url === hash || url.slice(-hash.lenght) === hash;
                };
                var onhashchange = function () {
                    var hash = location.hash;
                    if (hash == null) {
                        if (hash = rlocation.exec(location.href)) {
                            hash = hash[5];
                        }
                    }
                    if (rhash.test(hash)) {
                        context.removeClass("active")
                            .each(function (i) {
                                jq = context.eq(i);
                                if (isEquals(jq.attr("href"), hash)) {
                                    my.push({
                                        text: jq.text(),
                                        active: true,
                                        showRemove: true,
                                        value: hash
                                    });
                                    jq.addClass("active");
                                }
                            });
                        context_thumbnail.each(function (i) {
                            jq = context_thumbnail.eq(i);
                            if (isEquals(jq.attr("href"), hash)) {
                                jq.parentsUntil("ul.lyt-navbar-menu")
                                    .eq(-1).addClass("active")
                                    .siblings().removeClass("active");
                            }
                        });
                        my.$.find(".lyt-tabbar a")
                            .removeClass("active")
                            .each(function () {
                                jq = $(this);
                                if (isEquals(jq.attr("href"), hash)) {
                                    jq.addClass("active");
                                    if (my.stack) {
                                        my.$containerContent.find('[data-domain="' + hash + '"]').removeClass("hidden").siblings().addClass("hidden");
                                    } else {
                                        my.$containerContent.children().children().attr("src", hash.slice(1) + ".html");
                                    }
                                }
                            });
                    }
                };
                window.onhashchange = document.body.onhashchange = onhashchange() || onhashchange;
            }
        };
    }

    v2.register("layout", layout);

})(jQuery, v2Kit);