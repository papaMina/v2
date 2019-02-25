define(function (require) {
    var date = require('v2.tool');
    var takeObj = {
        $hour: '.date-hour',
        $minute: '.date-minute',
        $sec: '.date-sec',
        $clear: '.date-clear',
        $now: '.date-now',
        $ok: '.date-ok'
    };
    var rinputTag = /textarea|input/i;
    v2.use("date-picker", {
        datePicker: function () {
            /** 涉及到的控件 */
            this.$touch = null;

            /** 最小值 */
            this.minGb = "1900-01-01 00:00:00";
            /** 最大值 */
            this.maxGb = "2099-12-31 23:59:59";

            /** 最小时间限制 */
            this.min = date.format();
            /** 最大时间限制 */
            this.max = '';

            /** 时间名称 */
            this.timeExplain = "时间";
            /** 清除按钮名称 */
            this.clearExplain = "清除";
            /** 当前时间按钮名称 */
            this.nowExplain = "今天";
            /** 确定按钮名称 */
            this.okExplain = "确定";

            /** 星期 */
            this.week = ["日", "一", "二", "三", "四", "五", "六"];

            /** 格式化字符串 */
            this.format = 'yyyy-MM-dd';
        },
        render: function () {
            this.base.render();
            this.addClass('date-picker');

            if (this.showYmd = /y|M|d/.test(this.format)) {
                var ym = '(a.laydate_choose.laydate_chprev.laydate_tab>cite)+input[readonly]+label+(a.laydate_choose.laydate_chnext.laydate_tab>cite)';
                this.append(v2.htmlSerialize('.date-picker-header>(.date-y>' + ym + '+.laydate_yms>(a.laydate_tab.laydate_chtop>cite)+(ul.laydate_ys.hidden>li*14)+(a.laydate_tab.laydate_chdown>cite))+.date_m>' + ym + '+.laydate_yms.hidden>span[m="$"]{$=>{$>9?$:"0$"}}*12'))
                    .append(v2.htmlSerialize('table.laydate_table>(thead>tr>`${for(var item<index> in week){ if(index>0){ @"+th{{item}}" }else{ @"th{{item}}" }}}`)+tbody>(tr>td*7)*6'.forCb(this)));
                this.$year = this.take('.date-y>input');
                this.$month = this.take('.date_m>input');

                this.$years = this.when('ul.laydate_ys');

                this.$days = this.when('tbody')
                    .map(function (tr) {
                        return tr.childNodes;
                    });
            }

            this.showHms = /H|h|m|s/.test(this.format);

            this.append(v2.htmlSerialize('.laydate_bottom>(ul.laydate_hms{showHms!".hidden"}>li.laydate_sj{{timeExplain}}+(li>input.date-hour[readonly]+span{:})+(li>input.date-minute[readonly]+span{:})+(li>input.date-sec[readonly]))+.date-time+date-btn>a.date-clear{{clearExplain}}+a.date-now{{nowExplain}}+a.date-ok{{okExplain}}'.compileCb(this)));

            for (var i in takeObj) {
                this[i] = this.take(takeObj[i]);
            }

            this.mins = (this.min || this.minGb).match(/\d+/g);
            this.maxs = (this.max || this.maxGb).match(/\d+/g);
        },
        checkVoid: function (y, m, d, check) {
            var e;
            return y = 0 | y,
                m = 0 | m,
                d = 0 | d,
                y < this.mins[0] ?
                    e = ["y"] :
                    y > this.maxs[0] ?
                        e = ["y", 1] :
                        y >= this.mins[0] && y <= this.maxs[0] && (
                            y == this.mins[0] && (m < this.mins[1] ?
                                e = ["m"] :
                                m == this.mins[1] && d < this.mins[2] && (e = ["d"])), y == this.maxs[0] && (
                                    m > this.maxs[1] ?
                                        e = ["m", 1] :
                                        m == this.maxs[1] && d > this.maxs[2] && (e = ["d", 1])
                                )
                        ),
                (e || check) ? e : [];
        },
        timeVoid: function () {

        },
        dayRender: function () {
            var ymd = this.value.match(/\d+/g);
            if (!ymd || ymd.length < 3) {
                ymd = this.min.match(/\d+/g);
            }
            if (!ymd || ymd.length < 3) {
                var date = new Date();
                ymd = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
            }
            this.ymd = ymd;
            this.day(ymd[0], ymd[1] - 1, ymd[2]);
        },
        day: function (y, m, d) {

            y < (0 | this.mins[0]) && (y = 0 | this.mins[0]);
            y > (0 | this.maxs[0]) && (y = 0 | this.maxs[0]);
            var my = this, g = new Date(y, m, d), gb = {};
            gb.ymd = [g.getFullYear(), g.getMonth(), g.getDate()];
            g.setFullYear(gb.ymd[0], gb.ymd[1], 1);
            gb.FDay = g.getDay() - 1;
            gb.PDays = date.dayCount(y, m);
            gb.PDay = gb.PDays - gb.FDay + 1;
            gb.NDays = date.dayCount(y, m + 1);
            gb.NDay = 1;
            this.$days.then(function (n, i) {
                var y = gb.ymd[0], m = gb.ymd[1] + 1, d;
                if (i < gb.FDay) {
                    n.className = 'pre-date';
                    n.innerHTML = d = gb.PDay + i;
                    if (m === 1) {
                        y -= 1;
                        m = 12;
                    } else {
                        m -= 1;
                    }
                } else if (i >= (gb.FDay + gb.NDays)) {
                    n.className = 'next-date';
                    n.innerHTML = d = gb.NDay++;
                    if (m === 12) {
                        m = 1;
                        y += 1;
                    } else {
                        m += 1;
                    }
                } else {
                    n.innerHTML = d = i - gb.FDay + 1;
                    if (d === gb.ymd[2]) {
                        gb.day = n;
                        n.className = 'active';
                    } else {
                        n.className = '';
                    }
                }
                if (my.checkVoid(y, m, d, true)) {
                    v2.addClass(n, 'disabled');
                }
                n.setAttribute('y', y);
                n.setAttribute('m', m);
                n.setAttribute('d', d);
            });
            this.valid = !v2.hasClass(gb.day, 'disabled');
        },
        usb: function () {
            this.base.usb();
            this.define('value', {
                get: function () {
                    if ('value' in this.$touch) {
                        return this.$touch.value;
                    }
                    var elem = this.$touch.$ || this.$touch;
                    return rinputTag.test(elem.tagName) ? elem.value : elem.innerHTML;
                },
                set: function (value) {
                    value = date.format(value, this.format);
                    if ('value' in this.$touch) {
                        return this.$touch.value = value;
                    }
                    var elem = this.$touch.$ || this.$touch;
                    return rinputTag.test(elem.tagName) ? elem.value = value : elem.innerHTML = value;
                }
            });
        },
        resolve: function () {
            this.dayRender();
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
        return v2('date-picker', options);
    };
});