(function () {
    function processThis(fn, context) {
        var outerArg = Array.prototype.slice.call(arguments, 2);
        return function () {
            var innerArg = Array.prototype.slice.call(arguments, 0);
            fn.apply(context, outerArg.concat(innerArg));
        }
    }

    function on(curEle, evenType, evenFn) {
        //->标准浏览器不需要自己创建事件池,它内置的事件池是非常完整的机制,只有IE6~8才需要自己模拟事件池
        if ("addEventListener" in document) {
            curEle.addEventListener(evenType, evenFn, false);
            return;
        }

        //->以下代码其实只是用来处理IE6~8
        if (!curEle["myEvent" + evenType]) {
            //->这里是在判断当前元素上是否存在这个自定义属性,不存在我们创建一个,并且让其初始值是一个数组;第一次执行on方法进来,是不存在的,我们创建,第二次执行on方法已经存在了,这个条件就不成立了 ->条件成立代表第一次执行on,不成立已经不是第一次了
            curEle["myEvent" + evenType] = [];
            curEle.attachEvent("on" + evenType, processThis(run, curEle)); //->只有第一次执行on给当前元素的某个行为绑定了一个run方法,其余以后再执行on不在重新的绑定了
        }
        var ary = curEle["myEvent" + evenType];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] === evenFn) {
                return;
            }
        }
        ary.push(evenFn);

        //bind(curEle, evenType, run); ->给当前的元素的某个行为绑定一个run的方法(this问题和重复问题)
        //curEle.attachEvent("on" + evenType, processThis(run, curEle));//->这样写虽然this解决了,但是没有解决重复问题:每一次执行on方法都会重新的给当前元素的这个行为绑定一次run方法,造成run方法的多次重复绑定
    }

    function off(curEle, evenType, evenFn) {
        //->移除的时候也一样,标准的浏览器不需要自己从创建的事件池中删除
        if ("removeEventListener" in document) {
            curEle.removeEventListener(evenType, evenFn, false);
            return;
        }

        //->以下代码其实只是用来处理IE6~8
        var ary = curEle["myEvent" + evenType];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var cur = ary[i];
                if (cur === evenFn) {
                    ary[i] = null;
                    break;
                }
            }
        }
    }

    function run(e) {
        e = e || window.event;
        var flag = e.target ? true : false;
        if (!flag) {
            e.target = e.srcElement;
            e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
            e.preventDefault = function () {
                e.returnValue = false;
            };
            e.stopPropagation = function () {
                e.cancelBubble = true;
            };
        }

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

    //->on/off是唯一的我们暴露在外面的接口,以后给元素的某个行为绑定方法我们使用on,移除绑定使用off
    window.zhufengEvent = {
        on: on,
        off: off,
        processThis: processThis
    };
})();
