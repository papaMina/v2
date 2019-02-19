var string = '{name.v2 +"和"+ name?.vue}都是{level?["very"]}实用的{type.slice(2)}，包含很多有趣的功能。'.compile({ name: { v2: "v2", vue: "vue" }, level: { very: "【非常】" }, type: "前端轻量级框架" });
console.log(string); // => v2和vue都是【非常】实用的轻量级框架，包含很多有趣的功能。
var string = '{name.v2 + "和" + name.vue}都是{level?.very}实用的{type.slice(2)}，包含很多有趣的功能。'.compile({ name: { v2: "v2", vue: "vue" }, type: "前端轻量级框架" });
console.log(string); // => v2和vue都是实用的轻量级框架，包含很多有趣的功能。

var string = "{.?.name}是一个优秀的前端框架？".map(null);
console.log(string); // => 是一个优秀的前端框架？
var string = "{.?.name}是一个优秀的前端框架？".map({});
console.log(string); // => 是一个优秀的前端框架？
var string = "{.?.name}是一个优秀的前端框架？".map({ name: "v2" });
console.log(string); // => v2是一个优秀的前端框架？

var string = '问：v2是一个优秀的前端框架么？答：`${if(isGood) { ^"appraise+"(票数："+ votes * platform +")"" } else if (isCommon) { "一般" } else { "否" } }`。'.if({ isGood: true, isCommon: true, appraise: "非常棒的", votes: 1024, platform: 5 });
console.log(string); // => 问：v2是一个优秀的前端框架么？答：非常棒的(票数：5120)。

var string = '<ul>`${for (var v in .) { $"<li>{v}</li>" } }`</ul>'.each(["Vue", "V2", "Jquery", "Bootstrap"]);
console.log(string); // => <ul><li>Vue</li><li>V2</li><li>Jquery</li><li>Bootstrap</li></ul>

var string = '<ul>`${for (var v<k> in .){$"<li data-index="{k}">{v}</li>" } }`</ul>'.each(["Vue", "V2", "Jquery", "Bootstrap"]);
console.log(string); // => <ul><li data-index="0">Vue</li><li data-index="1">V2</li><li data-index="2">Jquery</li><li data-index="3">Bootstrap</li></ul>

var string = '<ul>`${for(var v in .){ if(v.show) { $"<li>{v.name}</li>" } else { $"<li><s>{v.name}<s></li>" } } }`</ul>'.each([{ show: true, name: "Vue" }, { show: true, name: "V2" }, { show: false, name: "Jquery" }, { show: true, name: "Bootstrap" }]);
console.log(string); // => <ul><li>Vue</li><li>V2</li><li><s>Jquery<s></li><li>Bootstrap</li></ul>
console.log(v2.StringCb(13, "{a}+{b}+【`${for(var v<k> in .){ if(v>1){ $'参数“{k}”的值({v})大于1;' } else { ^'v+1024' } } }`】+【`${if(a>b){ ^'b'} else { ^'a' } }`】", { a: 2, b: 2.5, c: 3, d: 1 }));

var timestamp = +new Date();
v2.use({
    "@text": "请输入{name}",
    "&show": function (show) {
        this.hide(show);
        console.log(this.text);
    },
    hide: function (show) {
        console.log(show);
    }
});
//var i = "a + b".compile({ a: 1, b: 2 }) // => 3;
v2.use("input", {
    input: function () {
        console.log("input 构造函数");
    },
    init: function () {
        console.log("input");
        this.base.init("input");
    }
});
v2.use("input.inputEdit", {
    init: function () {
        console.log("inputEdit");
        this.base.init();
    },
    input: function () {
        console.log("input inputEdit 构造函数");
    },
    inputEdit: function () {
        console.log("inputEdit 构造函数");
    }
});

v2.use("input.*.inputEditV2", {
    init: function () {
        console.log("inputEditV2");
        this.base.init();
    },
    input: function () {
        console.log("input * inputEdit 构造函数");
    },
    inputEdit: function () {
        console.log("inputEdit inputEditV2 构造函数");
    },
    inputEditV2: function () {
        console.log("inputEditV2 构造函数");
    }
});

var x = v2("inputEditV2", {
    name: "单位名称1",
    show: true,
    access: true,
    ajax: function () {
        //this.base.commit();
    },
    "hide(access,limit)": function (access, limit) {
        this.base.hide();
    },
    commit: function () {
        console.log("commit");
    }
});

define(function (require) {
    timestamp = +new Date();
    var button = require('components/v2.buttonGroup');
    //console.log(+new Date() - timestamp);
    //var button = require('packages/v2.button');
    console.log(+new Date() - timestamp);
    console.log(button({
        $: '#test-group',
        data: {
            buttons: [{
                text: '确定',
                width: 120,
                addClass: 'btn-primary',
                events: {
                    click: 'click'
                }
            }, {
                text: '确定',
                width: 120,
                //disabled: true,
                dropdown: true,
                addClass: 'btn-primary',
                events: {
                    click: 'click'
                }
            }]
        },
        methods: {
            click: function () {
                console.log('click');
            }
        }
    }));
    console.log(+new Date() - timestamp);
    //var x = require('components/yep-button');
    //var x = require('components/yep-button-group');
    //new Vue({
    //    el: '#app',
    //    data: {
    //        buttons: [{ message: "测试1" }, { message: "测试2" }]
    //    }
    //});
});
console.log(+new Date() - timestamp);

var html = v2.htmlSerialize("#content_views[name='test'] > ((h1{H1测试}*5>span{$})+h2{H2测试}*2>.nav*5{nav$})+ul>li{$}*10");

console.log(html);