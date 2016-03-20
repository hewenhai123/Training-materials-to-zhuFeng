(function () {
    var MyEvent = function () {

    };
    MyEvent.prototype = {
        constructor: MyEvent,
        on: function (type, fn) {
            !this["myBook" + type] ? this["myBook" + type] = [] : null;
            var ary = this["myBook" + type];
            for (var i = 0; i < ary.length; i++) {
                if (ary[i] === fn) {
                    return;
                }
            }
            ary.push(fn);
        },
        fire: function (type, e) {
            var ary = this["myBook" + type];
            if (ary && ary instanceof Array) {
                for (var i = 0; i < ary.length; i++) {
                    var tempFn = ary[i];
                    if (typeof tempFn === "function") {
                        tempFn.call(this.curEle, e);
                    } else {
                        ary.splice(i, 1);
                        i--;
                    }
                }
            }
        },
        off: function (type, fn) {
            var ary = this["myBook" + type];
            if (ary && ary instanceof Array) {
                for (var i = 0; i < ary.length; i++) {
                    var tempFn = ary[i];
                    if (tempFn === fn) {
                        ary[i] = null;
                        return;
                    }
                }
            }
        }
    };
    window.MyEvent = MyEvent;
})();


(function () {
    var Drag = function (curEle) {
        this.strX = null;
        this.strY = null;
        this.strL = null;
        this.strT = null;
        this.curEle = curEle;
        this.MOVE = null;
        this.UP = null;
        zhufengEvent.on(this.curEle, "mousedown", zhufengEvent.processThis(this.down, this));
    };
    Drag.prototype = new MyEvent;//->原型继承:Drag的实例就可以使用MyEvent中所有的属性和方法了 Drag的实例this,this.fire就是调用的MyEvent原型上的fire方法

    Drag.prototype.down = function (e) {
        this.strX = e.pageX;
        this.strY = e.pageY;
        this.strL = this.curEle.offsetLeft;
        this.strT = this.curEle.offsetTop;

        this.MOVE = zhufengEvent.processThis(this.move, this);
        this.UP = zhufengEvent.processThis(this.up, this);
        if (this.curEle.setCapture) {
            this.curEle.setCapture();
            zhufengEvent.on(this.curEle, "mousemove", this.MOVE);
            zhufengEvent.on(this.curEle, "mouseup", this.UP);
        } else {
            zhufengEvent.on(document, "mousemove", this.MOVE);
            zhufengEvent.on(document, "mouseup", this.UP);
        }

        this.fire("zhufengDragStart", e);
    };
    Drag.prototype.move = function (e) {
        var curL = e.pageX - this.strX + this.strL;
        var curT = e.pageY - this.strY + this.strT;
        this.curEle.style.left = curL + "px";
        this.curEle.style.top = curT + "px";

        this.fire("zhufengDragMove", e);
    };
    Drag.prototype.up = function (e) {
        if (this.curEle.releaseCapture) {
            this.curEle.releaseCapture();
            zhufengEvent.off(this.curEle, "mousemove", this.MOVE);
            zhufengEvent.off(this.curEle, "mouseup", this.UP);
        } else {
            zhufengEvent.off(document, "mousemove", this.MOVE);
            zhufengEvent.off(document, "mouseup", this.UP);
        }

        this.fire("zhufengDragEnd", e);
    };

    window.Drag = Drag;
})();