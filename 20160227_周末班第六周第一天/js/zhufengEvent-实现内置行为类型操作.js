//->在外面我们能使用的方法只有$event.on/$event.off/$event.processThis,在作用域里面我们写了很多的其它的方法,有些是有用的,有些是没用的
//->我们需要把没用的删除掉

//1)unbind定义后一次都没用过,所以直接的删除
//2)不管当前是哪一个浏览器,我们执行的on的时候都是先创建一个自己的事件池,把需要绑定的方法依次存放进去...但是,标准浏览器人家内置的事件池机制已经很完善了,根本不需要我们自己来操作 ->我们需要在on/off方法中进行标准和IE6~8浏览器的区分
//3)在IE6~8中执行on,在on方法中我们使用bind给当前元素的某个行为绑定了一个叫做run的方法,现在我不想使用bind了,使用curEle.attachEvent("on" + evenType, run),这样做的话还存在两个问题：run中的this是window，每当执行一次on方法,都会重复绑定一次run

(function () {
    function processThis(fn, context) {
        var outerArg = Array.prototype.slice.call(arguments, 2);
        return function () {
            var innerArg = Array.prototype.slice.call(arguments, 0);
            fn.apply(context, outerArg.concat(innerArg));
        }
    }

    function on(curEle, evenType, evenFn) {
        if ("addEventListener" in window) {
            curEle.addEventListener(evenType, evenFn, false);
            return;
        }
        //---上面是标准浏览器我们用自己内置的事件池即可,下面是IE6~8浏览器中我们才自己写事件池处理---
        if (!curEle["myEvent" + evenType]) {
            curEle["myEvent" + evenType] = [];
            //->只有第一次执行on这个条件才成立,以后在执行on,这个条件不成立,应用这个原理,我们把绑定run方法,放在这里,这样的话只给当前元素绑定一次run,也就不会存在所谓的重复问题了
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

    function run(e) {
        //->只要能执行run肯定是IE6~8浏览器
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
        if ("removeEventListener" in window) {
            curEle.removeEventListener(evenType, evenFn, false);
            return;
        }
        //---能够执行下面的代码,说明已经是IE6~8浏览器了
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
