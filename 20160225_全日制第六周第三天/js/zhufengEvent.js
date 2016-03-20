(function () {

    //->processThis:使用柯理化函数思想把当前函数的this关键字和参数值进行预先处理,从而灵活的改变一个函数中的this指向问题->等价于Function.prototype.bind
    function processThis(fn, context) {
        var outerArg = Array.prototype.slice.call(arguments, 2);
        return function () {
            var innerArg = Array.prototype.slice.call(arguments, 0);
            fn.apply(context, outerArg.concat(innerArg));
        }
    }

    //->on:给当前元素的某一个行为绑定方法
    function on(curEle, evenType, evenFn) {
        if ("addEventListener" in document) {
            curEle.addEventListener(evenType, evenFn, false);
            return;
        }
        if (!curEle["myEvent" + evenType]) {
            curEle["myEvent" + evenType] = [];
            curEle.attachEvent("on" + evenType, processThis(run, curEle));
        }
        var ary = curEle["myEvent" + evenType];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] === evenFn) {
                return;
            }
        }
        ary.push(evenFn);
    }

    //->run:把我们存储在自己创建的事件池中的方法依次的执行
    function run(e) {
        //->能够执行run已经说明了走的是自己创建事件池这套机制,已经代表它是IE6~8浏览器了
        e = e || window.event;
        e.target = e.srcElement;
        e.pageX = (document.documentElement.scrollLeft || document.body.scrollLeft) + e.clientX;
        e.pageY = (document.documentElement.scrollTop || document.body.scrollTop) + e.clientY;
        e.preventDefault = function () {
            e.returnValue = false;
        };
        e.stopPropagation = function () {
            e.cancelBubble = true;
        };

        var ary = this["myEvent" + e.type];
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

    //->off:给当前元素的某个行为移除方法
    function off(curEle, evenType, evenFn) {
        if ("removeEventListener" in document) {
            curEle.removeEventListener(evenType, evenFn, false);
            return;
        }
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

    window.zhufengEvent = {
        on: on,
        off: off,
        processThis: processThis
    };
})();