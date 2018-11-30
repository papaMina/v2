(function () {
    v2.register("table.tableEdit", {
        pending: function () {
            $.extend(this.format, {
                edit: function (value, rowIndex, row) {
                    return v2.format('<div data-name="' + this.field + '"  data-value="{0}" data-role="edit" style="width:' + this.width +';min-height:23px">{0}</div>', value||"");
                }
            });
        },
        ajaxEdit: function () {
            var my = this;
            var ajax = {
                url: null,
                type: "GET",
                params: my.data[0] //当前行的数据
            };                 
            ajax.params["" + my.fieldEdit + ""] = my.valueEdit;
            if (this.invoke("ajax-edit-ready", ajax) !== false) {
                this.wait(true);
                $.ajax(ajax.url, {
                    type: ajax.type,
                    dataType: "json",
                    data: ajax.params,
                    success: function (json) {
                        if (my.invoke("ajax-edit-success", json) !== false) {
                            if (json.status) {
                                my.invoke("ajax-edit-load", json);
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
                        my.invoke("ajax-edit-error", xhr.status, xhr);
                        my.wait(false);
                    }
                });
            }
        },
        ajaxEditLoad: function (json) {
            this.data = json.data;
            this.pageTotal = json.total;
            if (this.refresh = !!json.columns) {
                this.columns = json.columns;
            }
        },
        editLoad: function () {
            if (this.refresh) {
                this.header();
            }
            this.container();
            this.initPagination();
        },
        commit: function () {
            this.base.commit();
            var my = this;
            this.$.on("click", 'td', function () {
                var dataDiv=$(this).children('div');
                if ($(this).find("input").length == 0) {
                    dataDiv.html('<input type="text" name="' + dataDiv.attr('data-name') + '" value="' + dataDiv.attr('data-value') + '" style="width: ' + dataDiv.css("width") + '"/>');
                    return false;
                };
            });
            this.$.on("blur", '[data-role]>input', function () {
                my.valueEdit = $(this).val();
                my.fieldEdit = $(this).attr("name");
                my.ajaxEdit();
                return false;
            });
        }
    });
})();