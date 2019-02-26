define(function (require) {
    var takeObj = {
        $hour: '.date-hour',
        $minute: '.date-minute',
        $sec: '.date-sec',
        $timePicker: '.date-picker-hms-c',
        $clear: '.date-clear',
        $now: '.date-now',
        $ok: '.date-ok'
    };
    function isLeapYear(y) {
        return (y % 400 == 0) || (y % 4 == 0) && (y % 100 > 0);
    }
    function dayCount(y, m) {
        if (m === 2) return isLeapYear(y) ? 29 : 28;
        return (m % 2 == 0 ? m < 7 : m > 8) ? 30 : 31;
    }
    function zoreFill(a) {
        return a ? a > 9 ? a : '0' + a : '00';
    }
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
            this.min = '';
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
            this.format = 'yyyy-MM-dd HH:mm:ss';
        },
        render: function () {
            this.base.render();
            this.addClass('date-picker');

            if (this.showYmd = /y|M|d/.test(this.format)) {
                var ym = '(a.date-picker-choose.date-picker-chprev.date-picker-tab>cite)+input[readonly]+label+(a.date-picker-choose.date-picker-chnext.date-picker-tab>cite)';
                this.append(v2.htmlSerialize('.date-picker-header>(.date-picker-y.date-picker-ym>' + ym + '+.date-picker-yms.hidden>(a.date-picker-tab.date-picker-chtop>cite)+(ul.date-picker-ys>li*14)+(a.date-picker-tab.date-picker-chdown>cite))+.date-picker-ym.date-picker-m>' + ym + '+.date-picker-yms.hidden>span[m="$"]{$=>{$>9?$:"0$"}}*12'))
                    .append(v2.htmlSerialize('table.date-picker-container>(thead>tr>`${for(var item<index> in week){ if(index>0){ @"+th{{item}}" }else{ @"th{{item}}" }}}`)+tbody>(tr>td*7)*6'.forCb(this)));

                this.$year = this.take('.date-picker-y>input');
                this.$month = this.take('.date-picker-m>input');

                this.$yearPicker = this.take('.date-picker-y>.date-picker-yms');

                this.$monthPicker = this.take('.date-picker-m>.date-picker-yms');

                this.$years = this.when('ul.date-picker-ys');

                this.$days = this.when('tbody')
                    .map(function (tr) {
                        return tr.childNodes;
                    });
            }

            this.showHour = /H|h/.test(this.format);

            this.showMinute = /m/.test(this.format);

            this.showSec = /s/.test(this.format);

            this.showHms = this.showHour || this.showMinute || this.showSec;

            this.append(v2.htmlSerialize('.date-picker-footer>(ul.date-picker-hms{showHms!".hidden"}>li.date-picker-sj{{timeExplain}}+(li>input.date-hour{showHour!".hidden"}[readonly]+span{:})+(li>input.date-minute{showMinute!".hidden"}[readonly]+span{:})+(li>input.date-sec{showSec!".hidden"}[readonly]))+.date-picker-hms-c.hidden+.date-picker-btn>a.date-clear{{clearExplain}}+a.date-now{{nowExplain}}+a.date-ok{{okExplain}}'.compileCb(this)));

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
        timeVoid: function (value, hms/*0:时,1:分，2:秒*/) {
            return this.ymd[0] == this.mins[0] && this.ymd[1] + 1 == this.mins[1] && this.ymd[2] == this.mins[2] && this.mins[3 + hms] > value ||
                this.ymd[0] == this.maxs[0] && this.ymd[1] + 1 == this.maxs[1] && this.ymd[2] == this.maxs[2] && value > this.maxs[3 + hms] ||
                value > (hms ? 59 : 23)
        },
        dayRender: function () {
            var date, ymd = this.value.match(/\d+/g);
            if (!ymd || this.showYmd && ymd.length < 3) {
                ymd = this.min.match(/\d+/g);
            }
            if (!ymd || this.showYmd && ymd.length < 3) {
                date = new Date();
                ymd = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
            }
            if (this.showYmd) {
                this.day(ymd[0], ymd[1] - 1, ymd[2]);
                this.time(ymd[3], ymd[4], ymd[5]);
            } else if (this.showHms) {
                if (!ymd) {
                    date = new Date();
                    ymd = [date.getHours(), date.getMinutes(), date.getSeconds()];
                }
                this.time(ymd[0], ymd[1], ymd[2]);
            }
        },
        time: function (h, m, s) {
            if (this.showHms) {
                this.$hour.value = zoreFill(h);
                this.$minute.value = zoreFill(m);
                this.$sec.value = zoreFill(s);
            }
        },
        day: function (y, m, d) {
            y < (0 | this.mins[0]) && (y = 0 | this.mins[0]);
            y > (0 | this.maxs[0]) && (y = 0 | this.maxs[0]);
            var my = this, g = new Date(y, m, d), gb = {};
            gb.ymd = [g.getFullYear(), g.getMonth(), g.getDate()];
            g.setFullYear(gb.ymd[0], gb.ymd[1], 1);
            gb.FDay = g.getDay();
            gb.PDays = dayCount(y, m);
            gb.PDay = gb.PDays - gb.FDay + 1;
            gb.NDays = dayCount(y, m + 1);
            gb.NDay = 1;
            this.$days.then(function (n, i) {
                var y = gb.ymd[0], m = gb.ymd[1] + 1, d;
                if (i < gb.FDay) {
                    n.className = 'besides';
                    n.innerHTML = d = gb.PDay + i;
                    if (m === 1) {
                        y -= 1;
                        m = 12;
                    } else {
                        m -= 1;
                    }
                } else if (i >= (gb.FDay + gb.NDays)) {
                    n.className = 'besides';
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
            this.$year.value = y;
            this.$month.value = m + 1;
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
                    var ymd = value.match(/d+/g);
                    value = this.format.replace(/yyyy|MM|dd|HH|mm|ss/g,
                        function () {
                            return ymd.index = 0 | ++ymd.index, zoreFill(ymd[ymd.index]);
                        });
                    if ('value' in this.$touch) {
                        return this.$touch.value = value;
                    }
                    var elem = this.$touch.$ || this.$touch;
                    return rinputTag.test(elem.tagName) ? elem.value = value : elem.innerHTML = value;
                }
            });
        },
        show: function () {
            if (this.variable.visible)
                this.resolve();
            this.base.show();
        },
        resolve: function () {
            this.dayRender();
        },
        commit: function () {
            var my = this;
            if (this.showYmd) {
                this.onAt(this.$year, '$click', function () {
                    this.addClassAt(this.$monthPicker, 'hidden')
                        .removeClassAt(this.$yearPicker, 'hidden');
                    return false;
                }).onAt(this.$month, '$click', function () {
                    this.addClassAt(this.$yearPicker, 'hidden')
                        .removeClassAt(this.$monthPicker, 'hidden');
                    return false;
                });
            }
            if (this.showHms) {
                this.onAt(this.$hour, '$click', function () {
                    v2.removeClass(this.$timePicker, 'hidden');
                }).onAt(this.$minute, '$click', function () {
                    v2.removeClass(this.$timePicker, 'hidden');
                }).onAt(this.$sec, '$click', function () {
                    v2.removeClass(this.$timePicker, 'hidden');
                });
            }
            this.on('$click', function () {
                this.addClassAt(my.$yearPicker, 'hidden')
                    .addClassAt(my.$monthPicker, 'hidden');
            });
        }
    });
    return function (options) {
        return v2('date-picker', options);
    };
});