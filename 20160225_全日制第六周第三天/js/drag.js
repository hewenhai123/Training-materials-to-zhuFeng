function on(curEle, type, fn) {
    if (!curEle["book" + type]) {
        curEle["book" + type] = [];
    }
    var ary = curEle["book" + type];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] === fn) {
            return;
        }
    }
    ary.push(fn);
}

function fire(type, e) {
    //->this需要是当前操作的这个元素
    var ary = this["book" + type];
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

function off(curEle, type, fn) {
    var ary = curEle["book" + type];
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

//----------------------------------------------

function down(e) {
    this["strX"] = e.pageX;
    this["strY"] = e.pageY;
    this["strL"] = parseFloat(this.style.left);
    this["strT"] = parseFloat(this.style.top);

    if (this.setCapture) {
        this.setCapture();
        zhufengEvent.on(this, "mousemove", move);
        zhufengEvent.on(this, "mouseup", up);
    } else {
        this.MOVE = zhufengEvent.processThis(move, this);
        zhufengEvent.on(document, "mousemove", this.MOVE);

        this.UP = zhufengEvent.processThis(up, this);
        zhufengEvent.on(document, "mouseup", this.UP);
    }

    //->在down方法中我们发布一个叫做“zhufengDragStart”这个自定义行为的事件(一个接口)
    fire.call(this, "zhufengDragStart", e);
}

function move(e) {
    var curL = e.pageX - this["strX"] + this["strL"];
    var curT = e.pageY - this["strY"] + this["strT"];
    var minL = 0, minT = 0, maxL = (document.documentElement.clientWidth || document.body.clientWidth) - this.offsetWidth, maxT = (document.documentElement.clientHeight || document.body.clientHeight) - this.offsetHeight;
    curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
    curT = curT < minT ? minT : (curT > maxT ? maxT : curT);
    this.style.top = curT + "px";
    this.style.left = curL + "px";

    //->在move方法中我们发布一个叫做“zhufengDragMove”这个自定义行为的事件(一个接口)
    fire.call(this, "zhufengDragMove", e);
}

function up(e) {
    if (this.releaseCapture) {
        this.releaseCapture();
        zhufengEvent.off(this, "mousemove", move);
        zhufengEvent.off(this, "mouseup", up);
    } else {
        zhufengEvent.off(document, "mousemove", this.MOVE);
        zhufengEvent.off(document, "mouseup", this.UP);
    }

    //->在up方法中我们发布一个叫做“zhufengDragEnd”这个自定义行为的事件(一个接口)
    fire.call(this, "zhufengDragEnd", e);
}