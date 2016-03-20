//基于内置类String.prototype扩展一些我们自己常用的方法
(function (pro) {
    pro.myTrim = function myTrim() {
        return this.replace(/(^ +| +$)/g, "");
    };
    pro.mySub = function mySub() {
        var len = arguments[0] || 10, isD = arguments[1] || false, str = "", n = 0;
        for (var i = 0; i < this.length; i++) {
            var s = this.charAt(i);
            /[\u4e00-\u9fa5]/.test(s) ? n += 2 : n++;
            if (n > len) {
                isD ? str += "..." : void 0;
                break;
            }
            str += s;
        }
        return str;
    };
    pro.myFormatTime = function myFormatTime() {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:\s+)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?$/g, ary = [];
        this.replace(reg, function () {
            ary = [].slice.call(arguments, 1, 7);
        });
        var format = arguments[0] || "{0}-{1}-{2} {3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            var val = ary[arguments[1]];
            return val && val.length === 1 ? "0" + val : val;
        });
    };
    pro.queryURLParameter = function queryURLParameter() {
        var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    };
})(String.prototype);

var $urlHost = "http://matchweb.sports.qq.com";
var $index = 0;
var timeModel = {
    timeUl: $(".time-list>ul"),
    bind: function (ary) {
        var str = "";
        for (var i = 0; i < ary.length; i++) {
            var cur = ary[i];
            cur["weekday"] = cur["weekday"] || "--";
            cur["date"] = cur["date"] || "2015-01-01";

            str += "<li class='cursor left' time='" + cur["date"] + "'>";
            str += "<span class='list-top'>" + cur["weekday"] + "</span>";
            str += "<span class='list-bot'>" + cur["date"].myFormatTime("{1}-{2}") + "</span>";
            str += "</li>";
        }
        this.timeUl.html(str).css("width", ary.length * 105);
    },
    selectCur: function (today) {
        this.timeUl.children("li").mouseover(function () {
            $(this).addClass("hover");
        }).mouseout(function () {
            $(this).removeClass("hover");
        }).each(function () {
            var $time = $(this).attr("time");
            //如果当前的li的日期和今天的日志一直,那么有选中样式
            $time === today ? $(this).addClass("select") : $(this).removeClass("select");
            $time === today ? $index = $(this).index() : null;
        });

        //->让UL滚动到当前日期的位置
        $index = $index - 3;
        this.timeUl.css({left: -$index * 105});

        //->绑定对应的数据
        listModel.init(today);
    },
    clickBtn: function () {
        var _this = this;
        $(".time-left,.time-right").click(function (e) {
            e = e || window.event;
            e.target = e.target || e.srcElement;
            var n = 1;
            if (e.target.className.indexOf("time-left") > -1) {
                n *= -1;
            }
            $index += n;
            _this.timeUl.stop().animate({left: -$index * 105}, 300, function () {
                //还要让当前的这个选中的向左或者向右移动一个选中
                var $curItem = _this.timeUl.children("li").eq($index + 3);
                $curItem.addClass("select").siblings().removeClass("select");
                //切换完成后绑定数据
                listModel.init($curItem.attr("time"));
            });
        });
    },
    callback: function (jsonData) {
        if (jsonData.code !== 0) {
            //->只有code===0才是正常的返回我们需要的数据
            return;
        }
        jsonData = jsonData["data"];
        var today = jsonData["today"];

        //->绑定数据
        this.bind(jsonData["data"]);

        //->让当前的这个时间默认被选中
        this.selectCur(today);

        //->给左右按钮绑定点击事件
        this.clickBtn();

        //->点击每一个li实现切换
        var _this = this;
        this.timeUl.children("li").click(function () {
            $(this).addClass("select").siblings().removeClass("select");
            listModel.init($(this).attr("time"));

            $index = $(this).index() - 3;
            _this.timeUl.animate({left: -$index * 105}, 500);
        });
    },
    init: function () {
        var _this = this;
        $.ajax({
            url: $urlHost + "/kbs/calendar?columnId=100000&_=" + Math.random(),
            type: "get",
            dataType: "jsonp",
            jsonpCallback: "calendar",
            success: function () {
                _this.callback(arguments[0]);
            }
        });
    }
};
var listModel = {
    callback: function (jsonData, time) {
        if (jsonData["code"] !== 0) {
            return;
        }
        jsonData = jsonData["data"][time];
        var str = "<h2 class='content-title'>" + time.myFormatTime("{1}月{2}日") + "</h2>";
        str += "<ul class='content-list bg-white'>";
        for (var i = 0; i < jsonData.length; i++) {
            var cur = jsonData[i];
            cur["leftGoal"] = cur["leftGoal"] == 0 ? "" : cur["leftGoal"];
            cur["rightGoal"] = cur["rightGoal"] == 0 ? "" : cur["rightGoal"];

            str += "<li>";
            str += "<div class='conList-left left'><span class='w80 left'>" + cur["startTime"].myFormatTime("{3}:{4}") + "</span><span class='w140 left'>" + cur["matchDesc"] + "</span></div>";
            str += "<div class='conList-center left'>";
            str += "<img src='" + cur["leftBadge"] + "' class='home left'/>";
            str += "<span class='home left'>" + cur["leftName"] + "</span>";
            str += "<span class='w92 left'>" + cur["leftGoal"] + "-" + cur["rightGoal"] + "</span>";
            str += "<img src='" + cur["rightBadge"] + "' class='away right'/>";
            str += "<span class='away right'>" + cur["rightName"] + "</span>";
            str += "</div>";
            str += "<div class='conList-right left'><span>视频集锦</span></div>";
            str += "</li>";
        }
        str += "</ul>";
        $(".box-content").html(str).animate({opacity: 1}, 500);
    },
    init: function (time) {
        var _this = this;
        $(".box-content").css("opacity", "0");
        $.ajax({
            url: $urlHost + "/kbs/list?columnId=100000&startTime=" + time + "&endTime=" + time + "&_=" + Math.random(),
            type: "get",
            dataType: "jsonp",
            jsonpCallback: "gameList",
            success: function () {
                _this.callback(arguments[0], time);
            }
        });
    }
};
timeModel.init();