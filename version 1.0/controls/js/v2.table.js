/*!
 * JavaScript v2 v1.0.1
 * https://github.com/v2kit/v2
 *
 * @author hyly
 * @date 2018-08-01
 * @descript a valuable technology object.
 */
(function ($, v2) {
    var type,
        rvalign = /^(top|bottom|both)/,
        ralign = /^(left|right|center|justify)$/i;

    var rclass_active = /(^|\s+)active(\s+|$)/i;
    var rclass_disabled = /(^|\s+)disabled(\s+|$)/i;

    var default_col = '<col/>';
    function ischeck(value) {
        return value == true || value == 1 || value && value.checked;
    }
    function table_check(my, index, checked, field) {
        checked = !!checked;
        index = ~~index % my.pageSize;
        field = field || my.stateField;
        var site = my.siteCache[field];
        if (site || site === 0) {
            var target = my.$thead.find(v2.format('input[data-field="{0}"]', field)),
                context = my.$tbody.find(v2.format('input[data-field="{0}"]', field));
            var jq = context.eq(index), type = jq.attr("type");

            if (type === "checkbox") {
                jq.prop("checked", checked);
                if (!checked || v2.every(context, function (e) { return e.checked; })) {
                    target.prop("checked", checked);
                }
            } else {
                if (target.prop("checked")) {
                    target.prop("checked", !checked);
                    v2.each(my.data, function (data, i) {
                        data[site] = !checked;
                    });
                }
                context.prop("checked", !checked);
                jq.prop("checked", checked);
            }
            my.data[index][site] = checked;
        }
    }
    function table_checkAll(my, checked, field) {
        checked = !!checked;
        field = field || my.stateField;
        var site = my.siteCache[field];
        if (site || site === 0) {
            var context = my.$table.find(v2.format('input[data-field="{0}"]', field));
            context.prop("checked", checked);
            v2.each(my.data, function (data, i) {
                data[site] = checked;
            });
        }
    }
    var core_htmls = [
        '<div class="table-horizontal">',
        '	<div class="table-vertical">',
        '		<div class="table-core">',
        '			<table class="table"><colgroup></colgroup><thead></thead><tbody></tbody></table>',
        '		</div>',
        '       <div class="table-screen"></div>',
        '	</div>',
        '</div>'];
    var core_fixed_head_htmls = [
        '<div class="table-fixed-head">',
        '   <div class="table-fixed-group">',
        '       <div class="table-cell">',
        '	        <table class="table{if(border) " table-bordered"^}{if(hover) " table-hover"^}"></table>',
        '       </div>',
        '   </div>',
        '</div>'];
    var core_fixed_column_htmls = [
        '<div class="table-fixed-column">',
        '	<table class="table{if(border) " table-bordered"^}{if(hover) " table-hover"^}"><thead></thead><tbody></tbody></table>',
        '</div>'];
    var core_fixed_head_column_htmls = [
        '<div class="table-fixed table-fixed-head table-fixed-column">',
        '	<table class="table{if(border) " table-bordered"^}{if(hover) " table-hover"^}"><thead></thead></table>',
        '</div>'];
    var core_pagination_htmls = [
        '<div class="table-pagination">',
        '	<div class="pull-{return paginationHAlign == "left" ? "right" : "left"^} pagination-detail hidden-xs hidden-sm">',
        '		<span class="pagination-info">显示第<var>{return pageSize * (pageIndex - 1) + 1^}</var>到第<var>{return Math.min(pageSize * pageIndex, pageTotal)^}</var>条记录，总共<strong><var>{pageTotal}</var></strong>条记录</span>',
        '		<div class="pagination-list">',
        '			每页显示',
        '			<div class="btn-group">',
        '				<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">',
        '					<span class="page-size">{pageSize}</span> <span class="caret"></span>',
        '				</button>',
        '				<ul class="dropdown-menu" role="menu"></ul>',
        '			</div> 条记录',
        '		</div>',
        '	</div>',
        '	<div class="pull-{return paginationHAlign == "left" ? "left" : "right"^}" aria-label="page navigation">',
        '		<ul class="pagination">',
        '			<li aria-label="previous">',
        '				<a href="javascript:void(0)">',
        '					<span aria-hidden="true">&laquo;</span>',
        '				</a>',
        '			</li>',
        '			<li aria-label="next">',
        '				<a href="javascript:void(0)">',
        '					<span aria-hidden="true">&raquo;</span>',
        '				</a>',
        '			</li>',
        '		</ul>',
        '	</div>',
        '	<div class="clearfix"></div>',
        '</div>'];
    function table(my, variable) {     
        var format = {}, fn = function (type) {
            format[type] = function (value, rowIndex) {
                var htmls = ['<label><input data-role="', type, '" type="', type, '" data-field="{field}" data-row-index="', rowIndex, '"'];
                if (ischeck(value)) htmls.push(' checked="checked"');
                htmls.push('/></label>');
                return htmls.join('');
            };
        };
        var pageTotal, cacheParams = {};
        v2.each(["checkbox", "radio"], fn);
        return new Object({
            ctor: function () {
                this.data = [];
                this.columns = [];
                this.format = format;

                this.pageIndex = 1;
                this.pageSize = 10;
                this.pageTotal = 0;
            },
            init: function () {
                this.base.init();
                this.$ = $(this.element);
                this.$.append(core_htmls.join(''));
                this.$tableHorizontal = this.$.children().last();
                this.$tableVertical = this.$tableHorizontal.children();
                this.$tableCore = this.$tableVertical.children();
                this.$tableScreen = this.$tableCore.next();
                this.$table = this.$tableCore.children();
                this.$colgroup = this.$table.find("colgroup");
                this.$thead = this.$colgroup.next();
                this.$tbody = this.$thead.next();
                this.$tfoot = this.$tbody.next();

                this.limitVerticalElement = this.$tableHorizontal.get(0);
            },
            render: function (variable) {
                this.base.render();

                if (variable.responsive) {
                    this.$tableHorizontal.addClass("table-responsive");
                }
                if (variable.border) {
                    this.$table.addClass("table-bordered");
                }
                if (variable.hover) {
                    this.$table.addClass("table-hover");
                }
                if (variable.compact) {
                    this.$table.addClass("table-condensed");
                }
                if (variable.headFixed || variable.columnFixed) {
                    this.$.addClass("table-fixed");
                }
                if (variable.headFixed) {
                    this.$tableHorizontal.prepend(v2.expression(core_fixed_head_htmls.join(''), variable));
                    this.$headFixed = this.$tableHorizontal.find(".table-fixed-head");
                    this.$headFixedTable = this.$headFixed.find(".table");
                }

                if (variable.columnFixed) {
                    this.$tableHorizontal.prepend(v2.expression(core_fixed_column_htmls.join(''), variable));
                    this.$columnFixed = this.$tableHorizontal.find(".table-fixed-column");
                    this.$columnFixedTable = this.$columnFixed.find(".table");
                    this.$columnFixedHead = this.$columnFixedTable.find("thead");
                    this.$columnFixedBody = this.$columnFixedHead.next();
                    if (variable.headFixed) {
                        this.$tableHorizontal.append(v2.expression(core_fixed_head_column_htmls.join(''), variable));
                        this.$headColumnFixed = this.$tableHorizontal.find(".table-fixed-column.table-fixed-head");
                        this.$headColumnFixedHead = this.$headColumnFixed.find('thead');
                    }
                }

                if (variable.pagination = variable.pagination && rvalign.test(variable.paginationVAlign)) {
                    this.pagination();
                }
            },
            pagination: function () {
                if (variable.paginationVAlign === "top" || variable.paginationVAlign == "both") {
                    this.$tableHorizontal.before(v2.expression(core_pagination_htmls.join(''), this));
                }
                if (variable.paginationVAlign === "bottom" || variable.paginationVAlign == "both") {
                    this.$tableHorizontal.after(v2.expression(core_pagination_htmls.join(''), this));
                }
                this.paginationEl = this.$.find(".table-pagination");
                this.paginationInfo = this.paginationEl.find('.pagination-info');
                this.paginationSize = this.paginationEl.find(".page-size");
                this.paginationDropdown = this.paginationEl.find(".dropdown-menu");
                this.navigationEl = this.paginationEl.find(".pagination");

                if (variable.paginationVAlign === "bottom" || variable.paginationVAlign == "both") {
                    this.paginationDropdown.eq(-1).parent().addClass("dropup");
                }

                this.navigationPre = this.navigationEl.find('[aria-label="previous"]');

                this.navigationNext = this.navigationEl.find('[aria-label="next"]');

                this.updatePaginationList();
                this.initPagination();
            },
            initPagination: function () {
                if (!variable.pagination) { return; }
                var from, to, offset,
                    htmls = [],
                    index = this.pageIndex,
                    total = Math.ceil(this.pageTotal / this.pageSize),
                    callback = function (i, len) {
                        for (; i <= len; i++) {
                            htmls.push('<li ');
                            if (index === i) {
                                htmls.push('class="active" ');
                            }
                            htmls.push('data-role="pagination"><a href="javascript:void(0)">' + i + '</a></li>');
                        }
                    };

                this.totalPages = total;

                if (this.pageTotal < 1) {
                    return this.paginationEl.addClass("hidden");
                }

                this.paginationEl.removeClass("hidden");

                from = 1; to = index < 6 ? Math.min(total, 5) : ~~(index > total - 4) + 2;
                callback(from, to);
                if (total > 10) {
                    if (index > 5) {
                        htmls.push('<li class="disabled" data-role="pagination"><a href="javascript:void(0)">...</a></li>');
                    }
                    offset = ~~(index < 5 || index == total - 4);
                    from = index > (total - 5) ? total - offset - 4 : Math.max(to + 1, index - 1);
                    callback(from, to = Math.min(index + 1, total - 1));
                    if (index < (total - 4)) {
                        htmls.push('<li class="disabled" data-role="pagination"><a href="javascript:void(0)">...</a></li>');
                    }
                    to = Math.max(to, total - offset - 2);
                }
                callback(to + 1, total);

                this.navigationEl.children('[data-role="pagination"]').remove();
                this.navigationPre.after(htmls.join(''));

                this.navigationPre.toggleClass('disabled', variable.paginationLoop ? this.totalPages === 1 : this.pageIndex === 1);
                this.navigationNext.toggleClass('disabled', variable.paginationLoop ? this.totalPages === 1 : this.totalPages === this.pageIndex);

                this.updatePaginationText();
                this.paginationSize.text(this.pageSize);
            },
            updatePagination: function (index, size) {
                if (!variable.pagination) { return; }

                index = index == null ? this.pageIndex : ~~index;

                //交换数值
                index = this.pageIndex + index;
                this.pageIndex = index - this.pageIndex;
                index = index - this.pageIndex;

                size = ~~size || (size = this.pageSize);

                //交换数值
                size = size + this.pageSize;
                this.pageSize = size - this.pageSize;
                size = size - this.pageSize;

                if (variable.paginationLoop) {
                    if (this.pageIndex < 1) {
                        this.pageIndex = this.totalPages;
                    } else if (this.pageIndex > this.totalPages) {
                        this.pageIndex = 1;
                    }
                } else {
                    this.navigationPre.toggleClass('disabled', this.pageIndex === 1);
                    this.navigationNext.toggleClass('disabled', this.totalPages === this.pageIndex);
                }

                if (this.pageIndex != index || this.pageSize != size) {
                    this.ajax();
                }

                this.updatePaginationText();
                if (this.totalPages > 7 || this.pageSize != size) {
                    this.initPagination();
                } else {
                    this.navigationEl.children('[data-role="pagination"]').eq(this.pageIndex - 1)
                        .addClass("active").siblings().removeClass("active");
                }
            },
            updatePaginationText: function (total, index, size) {
                total = this.pageTotal = ~~total || this.pageTotal;
                size = this.pageSize = ~~size || this.pageSize;
                index = this.pageIndex = ~~index || this.pageIndex;
                this.paginationInfo.find("var").text(function (i) {
                    return (i = i % 3) ? i > 1 ? total : Math.min(total, size * index) : size * (index - 1) + 1;
                });
            },
            updatePaginationList: function (paginationList) {
                if (!variable.pagination) { return; }
                var htmls = [];
                v2.each(variable.paginationList = paginationList || variable.paginationList || [10, 25, 50, 100], function (size) {
                    htmls.push('<li role="menuitem"');
                    if (my.pageSize == size) {
                        htmls.push('<li role="menuitem" class="active"');
                    }
                    htmls.push('><a href="javascript:void(0)">' + size + '</a></li>');
                });
                this.paginationDropdown.empty().append(htmls.join('')).children();
            },
            update: function (data, rowIndex) {
                rowIndex = ~~rowIndex;

                rowIndex = rowIndex - this.pageSize * (this.pageIndex - 1) - 1;

                v2.removeAt(this.data, rowIndex);

                v2.insertAt(this.data, rowIndex, data);

                this.load();
            },
            removeAt: function (rowIndex) {
                rowIndex = ~~rowIndex;
                var
                    index = this.pageTotal % this.pageSize,
                    pageIndex = Math.ceil(rowIndex / this.pageSize);

                if (index === 1) {
                    this.totalPages -= 1;
                }
                this.pageTotal -= 1;

                if (index > 1 && pageIndex === this.pageIndex && pageIndex === this.totalPages) {

                    rowIndex = rowIndex - this.pageSize * (this.pageIndex - 1) - 1;

                    v2.removeAt(this.data, rowIndex);

                    this.load();
                } else {
                    this.pageIndex = Math.min(pageIndex, this.totalPages);
                    this.ajax();
                }
            },
            insert: function (data, rowIndex) {
                rowIndex = ~~rowIndex;
                var index = this.pageTotal % this.pageSize,
                    pageIndex = Math.ceil(rowIndex / this.pageSize);

                if (index === 0) {
                    this.totalPages += 1;
                }

                this.pageTotal += 1;

                if (pageIndex === this.pageIndex) {

                    this.data = this.data || [];

                    rowIndex = rowIndex - this.pageSize * (pageIndex - 1) - 1;

                    if (index === 0 || pageIndex < this.totalPages) {
                        this.data.pop();
                    }

                    this.data.splice(rowIndex, 0, data);

                    this.load();
                } else {
                    this.pageIndex = pageIndex;
                    this.ajax();
                }
            },
            append: function (data) {
                var index = this.pageTotal % this.pageSize;

                if (index === 0) {
                    this.totalPages += 1;
                }

                this.pageTotal += 1;

                if (this.pageIndex < this.totalPages) {
                    this.pageIndex = this.totalPages;
                    return this.ajax();
                }

                this.data = this.data || [];

                if (index > 0) {
                    this.data.push(data);
                    this.updatePaginationText();
                    this.$tbody.append(this.tr(data, index, v2.type(data)));
                } else {
                    this.refresh = false;
                    this.pageIndex += 1;
                    this.data = new Array(data);
                    this.load();
                }
            },
            wait: function (showOrHide) {
                if (this.__wait_ == null) {
                    this.__wait_ = this.constructor("wait", {
                        sm: true,
                        fade: true,
                        context: this.element
                    });
                }
                this.__wait_.toggle(showOrHide);
            },
            ajax: function () {
                var ajax = {
                    url: null,
                    type: "GET",
                    params: {
                        page: this.pageIndex,
                        size: this.pageSize
                    }
                };

                if (this.invoke("ajax-ready", ajax) !== false) {

                    this.wait(true);

                    if (!v2.every(ajax.params, function (value, key) {
                        return key === "Page" || key === "Size" || !value === !cacheParams[key];
                    })) {
                        if (this.isReady) this.updatePagination(1);
                        v2.extend(cacheParams, v2.extend(ajax.params, {
                            page: this.pageIndex,
                            size: this.pageSize
                        }));
                    }
                    $.ajax(ajax.url, {
                        type: ajax.type,
                        dataType: "json",
                        data: ajax.params,
                        success: function (json) {
                            if (my.invoke("ajax-success", json) !== false) {
                                if (json.status) {
                                    my.invoke("ajax-load", json);
                                    if (my.sleep(false)) {
                                        my.load();
                                    }
                                } else {
                                    v2.validate("<strong>错误&ensp;:</strong>&ensp;&ensp;" + json.message + "", "danger");
                                }
                            }
                            my.wait(false);
                        },
                        error: function (xhr) {
                            my.invoke("ajax-error", xhr.status, xhr);
                            my.wait(false);
                        }
                    });
                }
            },
            ajaxLoad: function (json) {
                this.data = json.data;
                this.pageTotal = json.total;
                if (this.refresh = !!json.columns) {
                    this.columns = json.columns;
                }
            },
            load: function () {
                if (this.refresh) {
                    this.header();
                }
                this.container();
                this.initPagination();
            },
            colgroup: function () {
                var htmls = v2.map(this.columns, this.col, this);
                this.$colgroup.empty().append(htmls.join(''));
            },
            col: function (column) {
                return column.width ? v2.format('<col width="{0}"/>', column.width) : default_col;
            },
            thead: function () {
                var htmls = v2.map(this.columns, this.th, this);
                if (variable.columnFixed) {
                    var fixed_htmls = htmls.slice(0, this.fixedCount);
                    fixed_htmls.unshift('<tr>');
                    fixed_htmls.push('</tr>');
                    this.$columnFixedHead.empty().append(fixed_htmls.join(''));
                    if (variable.headFixed) {
                        this.$headColumnFixedHead.empty().append(fixed_htmls.join(''));
                    }
                }
                htmls.unshift('<tr>');
                htmls.push('</tr>');
                this.$thead.empty().append(htmls.join(''));
            },
            th: function (column) {
                var type, html = ['<th'];
                if (column.titleTooltip) {
                    html.push(' title="{titleTooltip}"');
                }
                html.push('><div class="th-nowrap');
                if (column.format) {
                    type = v2.type(column.format);
                    if (type === "string") {
                        column[column.format] = true;
                        type = v2.type(column.format = this.format[column.format]);
                    }
                    column.format = type === "function" && column.format;
                }
                if (column.checkbox || column.radio) {
                    html.push(column.checkbox ? "checkbox" : "radio");
                }
                if (column.align && ralign.test(column.align)) {
                    html.push(" text-{align}");
                }
                html.push('">');
                if (column.checkbox || column.radio) {
                    html.push(v2.format('<label><input type="{0}" data-field="{1}"/></label>', column.checkbox ? "checkbox" : "radio", column.field));
                } else {
                    html.push('{title}');
                }
                html.push('</div></th>');
                return v2.replace(html.join(''), column);
            },
            header: function () {
                var context, offset = 0;
                if (variable.caption) {
                    this.$table.find("caption").remove()
                        .prevObject.prepend('<caption>' + variable.caption + '</caption>');
                }
                this.fixedCount = 0;
                this.siteCache = {};
                v2.each(this.columns, function (column, i) {
                    if (column.field === "#") {
                        offset -= 1;
                        this.hasSharp = true;
                        if (v2.isFunction(column.format)) {
                            this.hasSharpFormat = true;
                        }
                    }
                    column.offset = i + offset;
                    if (column.checkbox || column.radio) {
                        this.siteCache[column.field] = i + offset;
                        this.stateField = this.stateField || column.field;
                    }
                    if (variable.columnFixed) {
                        if (column.fixed) {
                            this.columns.splice(i, 1);
                            this.columns.splice(this.fixedCount++, 0, column);
                        }
                    }
                }, this);

                this.colgroup(this.columns);

                this.thead(this.columns);
            },
            tbody: function () {
                var type,
                    htmls = [],
                    fixed_htmls = [],
                    data = this.data || [],
                    columns = this.columns || [];

                if (data.length) {
                    v2.each(data, function (data, rowIndex) {
                        type = type || v2.type(data);
                        htmls.push(my.tr(data, rowIndex, type));
                        if (variable.columnFixed) {
                            fixed_htmls.push(my.tr(data, rowIndex, type, my.fixedCount));
                        }
                    });
                } else {
                    var columnCount = 0;
                    var context = this.$thead.children().eq(0).children();
                    context.each(function (i) {
                        columnCount += ~~context.eq(i).attr("colspan") || 1;
                    });
                    htmls.push(v2.format('<tr><td class="text-center" colspan="{0}">没有找到匹配的记录</td></tr>', columnCount));
                }

                if (type === "object") {
                    for (var i in this.siteCache) {
                        this.siteCache[i] = i;
                    }
                }

                this.$tbody.empty().append(htmls.join(''));

                if (variable.headFixed) {
                    this.$headFixedTable
                        .empty()
                        .append(this.$thead.clone());
                }
                if (variable.columnFixed) {
                    this.$columnFixedBody
                        .empty()
                        .append(fixed_htmls.join(''));
                }

                setTimeout(this.proxy(this.restore), 10);
            },
            tr: function (data, rowIndex, type, limit) {
                var column,
                    htmls = ['<tr'],
                    columns = this.columns || [],
                    attributes = variable.attributes;

                htmls.push(' data-row-index="', rowIndex = this.pageSize * (this.pageIndex - 1) + (rowIndex >>> 0) + 1, '"');
                if (attributes) {
                    if (v2.isFunction(attributes)) {
                        attributes = attributes.call(my, rowIndex, data);
                    }
                    if (attributes && v2.isPlainObject(attributes)) {
                        v2.each(attributes, function () {
                            htmls.push(v2.format(' {1}="{0}"', arguments));
                        });
                    }
                }
                htmls.push('>');
                for (var i = 0, len = ~~limit || columns.length; i < len; i++) {
                    column = columns[i];
                    htmls.push(my.td(column, column.field === "#" ? rowIndex : type === "object" ? data[column.field] : data[column.offset], rowIndex, data, column.offset));
                }
                htmls.push('</tr>');
                return htmls.join('');
            },
            td: function (column, value, rowIndex, data, colIndex) {
                var attributes, htmls = ['<td'];

                if (column.checkbox || column.radio) {
                    htmls.push(v2.format(' class="{0}"', column.checkbox ? "checkbox" : "radio"));
                }

                if (column.height) {
                    htmls.push(' height="{height}"');
                }

                if (column.align && ralign.test(column.align)) {
                    htmls.push(' align="{align}"');
                }

                if (column.field === "#") {
                    htmls.push(' data-sharp="#"');
                }

                if (attributes = column.attributes) {
                    if (v2.isFunction(attributes)) {
                        attributes = attributes.call(my, value, rowIndex, data, colIndex);
                    }
                    if (attributes && v2.isPlainObject(attributes)) {
                        v2.each(attributes, function () {
                            htmls.push(v2.format(' {1}="{0}"', arguments));
                        });
                    }
                }
                htmls.push('>');

                if (column.nowrap || variable.nowrap && (column.nowrap !== false)) {
                    htmls.push('<div class="td-nowrap">');
                }

                if (column.format) {
                    value = column.format(value, rowIndex, data, colIndex);
                }

                htmls.push(value);

                if (column.nowrap || variable.nowrap && (column.nowrap !== false)) {
                    htmls.push('</div>');
                }

                htmls.push('</td>');

                return v2.replace(htmls.join(''), column);
            },
            check: function (index, field) {
                table_check(this, index, true, field);
            },
            uncheck: function (index, field) {
                table_check(this, index, false, field);
            },
            checkAll: function (field) {
                table_checkAll(this, true, field);
            },
            uncheckAll: function (field) {
                table_checkAll(this, false, field);
            },
            getSelections: function (field) {
                field = field || my.stateField;
                var site = this.siteCache[field];
                if (site || site === 0) {
                    return v2.find(this.data, function (data) {
                        return ischeck(data[field]);
                    });
                }
            },
            getAllSelections: function (field) {
                field = field || my.stateField;
                var site = this.siteCache[field];
                if (site || site === 0) {
                    return v2.filter(this.data, function (data) {
                        return ischeck(data[field]);
                    });
                }
                return new Array();
            },
            container: function () {
                var context;

                this.tbody();

                v2.each(this.columns, function (column, i) {
                    if (column.radio || column.checkbox) {
                        var site = my.siteCache[column.field],
                            selector = v2.format('input[data-field="{0}"]', column.field);
                        my.$thead.find(selector).prop("checked", v2.every(my.data, function (data) {
                            return ischeck(data[site]);
                        }));
                    }
                });
            },
            footer: function () {
                this.$table.find("tfoot")
            },
            resolve: function () {
                this.header();
                this.container();
                this.footer();
            },
            restore: function () {
                var width, core_width, context, context_target;
                if (variable.headFixed) {
                    context = this.$thead.find("th");
                    context_target = this.$headFixedTable.find("th");
                    context_target.each(function (i) {
                        context_target.eq(i).width(context.eq(i).width());
                    });
                    width = this.$table.width();
                    this.$headFixed.width(this.$tableScreen.width());
                    this.$headFixedTable.css({ width: width, "min-width": width });
                }

                if (variable.columnFixed) {
                    core_width = 0;
                    context = this.$thead.find("tr:first-child th");
                    context_target = this.$columnFixedHead.find("tr:first-child th");
                    context_target.each(function (i) {
                        core_width += (width = context.eq(i).outerWidth());
                        context_target.eq(i).outerWidth(width);
                    });
                    this.$columnFixed.width(core_width - 1);
                    this.$columnFixed.height(this.$tableScreen.height());

                    if (variable.headFixed) {
                        core_width = 0;
                        context = this.$columnFixedHead.find("th");
                        context_target = this.$headColumnFixedHead.find("th");
                        context_target.each(function (i) {
                            core_width += (width = context.eq(i).outerWidth());
                            context_target.eq(i).outerWidth(width);
                        });
                        this.$headColumnFixed.width(core_width - 1);
                    }
                    context = this.$tbody.find("td:first-child");
                    context_target = this.$columnFixedBody.find("td:first-child");
                    context_target.each(function (i) {
                        context_target.eq(i).height(context.eq(i).height());
                    });

                }
            },
            commit: function () {
                if (variable.headFixed || variable.columnFixed) {
                    $(window).resize(function () {
                        my.restore();
                    });
                }
                if (variable.headFixed) {
                    this.$tableVertical.on("scroll", function () {
                        my.$headFixed.prop("scrollLeft", this.scrollLeft);
                    });
                }
                if (variable.columnFixed) {
                    var timer;
                    this.$tableVertical.on("scroll", function () {
                        if (timer) clearTimeout(timer);
                        timer = setTimeout(function () {
                            my.$columnFixed.removeClass("shadow");
                        }, 1000);
                        my.$columnFixed.addClass("shadow");
                        my.$columnFixed.prop("scrollTop", this.scrollTop);
                    });
                    this.$.find("tbody").on("mouseenter", "tr", function () {
                        my.$.find(v2.format('[data-row-index="{0}"]', $(this).attr("data-row-index")))
                            .addClass("hover").siblings().removeClass("hover");
                    }).on("mouseleave", "tr", function () {
                        my.$.find(v2.format('[data-row-index="{0}"]', $(this).attr("data-row-index")))
                            .removeClass("hover");
                    });
                }
                this.$.on("click", 'input[type="checkbox"],input[type="radio"]', function () {
                    my[this.checked ? "checkAll" : "uncheckAll"]($(this).attr("data-field"));
                });
                this.$.on("click", 'input[type="checkbox"],input[type="radio"]', function () {
                    var jq = $(this);
                    my[this.checked ? "check" : "uncheck"](~~jq.attr("data-row-index") - 1, jq.attr("data-field"));
                });
                this.$.on("click", '[aria-label="previous"]', function () {
                    if (!rclass_disabled.test(this.className)) {
                        my.updatePagination(my.pageIndex - 1, my.pageSize, my.pageTotal);
                    }
                    return false;
                });
                this.$.on("click", '[aria-label="next"]', function () {
                    if (!rclass_disabled.test(this.className)) {
                        my.updatePagination(my.pageIndex + 1, my.pageSize, my.pageTotal);
                    }
                    return false;
                });
                this.$.on("click", '[data-role="pagination"]', function () {
                    if (!rclass_active.test(this.className)) {
                        my.updatePagination(+$(this).text());
                    }
                    return false;
                });
                $(document).on("click", function (e) {
                    if (my.paginationDropdown && (!e.target || !v2.contains(my.$.get(0), e.target))) {
                        my.paginationDropdown.parent().removeClass("open");
                    }
                });
                this.$.on("click", '[data-toggle="dropdown"]', function () {
                    $(this).parent().toggleClass("open");
                });
                this.$.on("click", '[role="menuitem"]', function () {
                    if (!rclass_active.test(this.className)) {
                        var jq = $(this);
                        var size = +jq.children().text();
                        jq.parent().parent().removeClass("open");
                        jq.addClass("active").siblings().removeClass("active");
                        my.updatePagination(1, size);
                    }
                    return false;
                });
            }
        });
    }

    v2.register("table", table);

})(jQuery, v2Kit);