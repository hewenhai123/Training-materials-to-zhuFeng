(function () {
    var config = function (options) {
        var opt = {
            selector: null,
            duration: 1000,
            interval: 10
        };
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                opt[key] = options[key];
            }
        }
        this.options = opt;
    };

    var scrollModel = function (options) {
        config.call(this, options);
        this.curEle = document.getElementById(this.options.selector);
        this.duration = this.options.duration;
        this.interval = this.options.interval;
    };

    scrollModel.prototype = {
        constructor: scrollModel,
        getWin: function (attr) {
            return document.documentElement[attr] || document.body[attr];
        },
        event: function () {
            var _this = this;
            this.curEle.style.display = "none";
            window.onscroll = null;
            var target = this.getWin("scrollTop"), step = (target / this.duration) * this.interval;
            var timer = window.setInterval(function () {
                if (target <= 0) {
                    window.clearInterval(timer);
                    window.onscroll = function () {
                        _this.scrollMove();
                    };
                    return;
                }
                target -= step;
                document.documentElement.scrollTop = target;
                document.body.scrollTop = target;
            }, this.interval);
        },
        scrollMove: function () {
            var winH = this.getWin("clientHeight"), curT = this.getWin("scrollTop");
            this.curEle.style.display = curT >= (winH / 2) ? "block" : "none";
        },
        init: function () {
            var _this = this;
            this.curEle.onclick = function () {
                _this.event();
            };
            window.onscroll = function () {
                _this.scrollMove();
            };
        }
    };
    window.scrollModel = scrollModel;
})();