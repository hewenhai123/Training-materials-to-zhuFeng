(function () {

    //->getCss:获取当前元素的某一个样式信息值
    function getCss(curEle, attr) {
        var val = reg = null;
        if ("getComputedStyle" in window) {
            val = window.getComputedStyle(curEle, null)[attr];
        } else {
            if (attr === "opacity") {
                val = curEle.currentStyle["filter"];
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = curEle.currentStyle[attr];
            }
        }
        reg = /^-?\d+(\.\d+)?(px|pt|em|rem)?$/;
        return reg.test(val) ? parseFloat(val) : val;
    }

    //->getCss:设置当前元素的某一个样式的属性值
    function setCss(curEle, attr, value) {
        if (attr === "float") {
            curEle["style"]["cssFloat"] = value;
            curEle["style"]["styleFloat"] = value;
            return;
        }

        if (attr === "opacity") {
            value < 0 ? value = 0 : null;
            value > 1 ? value = 1 : null;
            curEle["style"]["opacity"] = value;
            curEle["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            return;
        }

        var reg = /^(width|height|left|top|bottom|right|(padding|margin(Top|Left|Right|Bottom)?))$/;
        if (reg.test(attr)) {
            reg = /^-?\d+(\.\d+)?$/;
            if (reg.test(value)) {
                curEle["style"][attr] = value + "px";
                return;
            }
        }
        curEle["style"][attr] = value;
    }


    //->zhufengEffect:设定运动的方式
    var zhufengEffect = {
        //->匀速
        //->t:已经走的时间 b:起始的位置 c:总距离(目标位置-起始位置) d:总时间
        Linear: function (t, b, c, d) {
            return c * t / d + b;
        }
    };

    //->tarObj:存储的是当前元素运动的目标位置的样式集合->{left:1000,width:200,opacity:1...}
    //->duration:当前运动的总时间
    //->effect:运动的效果(匀速、加速、减速...)
    //->callBack:回调函数,当动画运动完成后需要做的事情都写在这个函数中
    function animate(curEle, tarObj, duration, effect, callBack) {
        var tempEffect = zhufengEffect.Linear;

        //->根据传递进来的目标值，分别获取每一个方向的起始值和总距离
        var beginObj = {}, changeObj = {};
        for (var key in tarObj) {
            if (tarObj.hasOwnProperty(key)) {
                beginObj[key] = getCss(curEle, key);
                changeObj[key] = tarObj[key] - beginObj[key];
            }
        }

        //->开启我们的动画
        var time = 0, interval = 13;
        var timer = window.setInterval(function () {
            time += interval;

            //->我们走的时间已经大于等于总时间,说明到达目标位置了,我们让当前元素的样式等于目标位置的值,并且执行回调函数
            if (time >= duration) {
                for (var key in tarObj) {
                    if (tarObj.hasOwnProperty(key)) {
                        setCss(curEle, key, tarObj[key]);
                    }
                }
                typeof callBack === "function" ? callBack.call(curEle) : null;
                window.clearInterval(timer);
                return;
            }

            //->还没有到达目标位置,我们随时设置元素的最新样式值,最新样式通过effect存储的公式获取到
            for (key in changeObj) {
                if (changeObj.hasOwnProperty(key)) {
                    var curVal = tempEffect(time, beginObj[key], changeObj[key], duration);
                    setCss(curEle, key, curVal);
                }
            }
        }, interval);
    }

    window.zhufengAnimate = animate;
})();