(function ($, v2) {
    v2.register("check", {
        ctor: function () {
            this.text = "";//文字
            this.name = "";
            this.value = "on";//值
            this.checked = false;//是否选中
            this.type = "checkbox";//[checkbox|radio]
        },
        init: function () {
            this.base.init();
            this.$ = $(this.element);
            this.$.append(v2.replace('<label role="{type}"><input type="{type}" name="{name}" value="{value}"><span>{text}</span></label>', this));
            this.$input = this.$.find('input');
        },
        render: function () {
            this.base.render();
            if (this.checked) {
                this.setChecked(this.checked);
            }
        },
        setChecked: function (checked) {
            this.$.prop("checked", this.checked = !!checked);
        },
        setText: function (text) {
            this.$.find("span").text(this.text = text == null ? "" : text);
        },
        val: function (value) {
            if (value == null) return this.checked ? this.value : ""
            this.checked = this.$input.val(value);
        },
        disabled: function (disabled) {
            if (this.base.disabled(disabled)) {
                this.$.toggleClass("disabled", !!disabled);
            }
        },
        commit: function () {
            var my = this, elem = this.$input.get(0);
            this.$.on("click", function () {
                my.$.children().toggleClass("checked", my.checked = elem.checked);
            });
        }
    });
})(jQuery, v2Kit);