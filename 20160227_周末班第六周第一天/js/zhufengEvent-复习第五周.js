(function () {
    function processThis(fn, context) {
        var outerArg = Array.prototype.slice.call(arguments, 2);
        return function () {
            var innerArg = Array.prototype.slice.call(arguments, 0);
            fn.apply(context, outerArg.concat(innerArg));
        }
    }

    function bind(curEle, evenType, evenFn) {
        if ("addEventListener" in window) {
            curEle.addEventListener(evenType, evenFn, false);
            return;
        }
        var tempFn = processThis(evenFn, curEle);
        tempFn.photo = evenFn;
        if (!curEle["myBind" + evenType]) {
            curEle["myBind" + evenType] = [];
        }
        var ary = curEle["myBind" + evenType];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i].photo === evenFn) {
                return;
            }
        }
        ary.push(tempFn);
        curEle.attachEvent("on" + evenType, tempFn);
    }

    function unbind(curEle, evenType, evenFn) {
        if ("removeEventListener" in window) {
            curEle.removeEventListener(evenType, evenFn, false);
            return;
        }
        var ary = curEle["myBind" + evenType];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var tempFn = ary[i];
                if (tempFn.photo === evenFn) {
                    curEle.detachEvent("on" + evenType, tempFn);
                    ary.splice(i, 1);
                    return;
                }
            }
        }
    }

    //->on:每一次执行on方法,我们都把给当前元素某个行为要绑定的方法放在自己模拟的事件中,并且给我们当前元素的这个行为绑定一个run方法(run存储进浏览器内置的事件池中了)
    function on(curEle, evenType, evenFn) {
        if (!curEle["myEvent" + evenType]) {
            curEle["myEvent" + evenType] = [];
        }
        var ary = curEle["myEvent" + evenType];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] === evenFn) {
                return;
            }
        }
        ary.push(evenFn);

        bind(curEle, evenType, run);//->解决了this和重复问题
    }

    //->run:是给当前元素的某一个行为唯一绑定的方法,当行为触发的时候执行run方法,在run执行的时候,我们把之前通过on存放在自己模拟的事件池中的所有的方法按照顺序依次执行
    function run(e) {
        e = e || window.event;
        if (!e.target) {//->IE6~8 把不兼容的鼠标对象中的属性重写,以后都用一套就兼容所有浏览器了,例如：我们以后使用e.target获取事件源,标准兼容,IE6~8虽然之前不兼容,但是我们已经把它重写成兼容的了,所有直接用e.target是不存在任何的兼容了
            e.target = e.srcElement;
            e.pageX = (document.documentElement.scrollLeft || document.body.scrollLeft) + e.clientX;
            e.pageY = (document.documentElement.scrollTop || document.body.scrollTop) + e.clientY;
            e.preventDefault = function () {
                e.returnValue = false;
            };
            e.stopPropagation = function () {
                e.cancelBubble = true;
            };
        }

        //this->curEle
        var ary = this["myEvent" + e.type];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var tempFn = ary[i];
                if (typeof tempFn === "function") {
                    tempFn.call(this, e);
                } else {
                    ary.splice(i, 1);
                    i--;
                }
            }
        }
    }

    function off(curEle, evenType, evenFn) {
        var ary = curEle["myEvent" + evenType];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var tempFn = ary[i];
                if (tempFn === evenFn) {
                    ary[i] = null;
                    return;
                }
            }
        }
    }

    window.zhufengEvent = window.$event = {
        processThis: processThis,
        on: on,
        off: off
    };
})();
