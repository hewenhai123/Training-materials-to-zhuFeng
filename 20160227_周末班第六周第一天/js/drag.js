//使用发布订阅模式,创建了自定义行为类型(创建了API接口),并且给自定义的行为类型订阅多个方法,当行为触发的时候通知订阅的那些方法执行
//->订阅
function on(curEle, evenType, evenFn) {
    if (!curEle["myBook" + evenType]) {
        curEle["myBook" + evenType] = [];
    }
    var ary = curEle["myBook" + evenType];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] === evenFn) {
            return;
        }
    }
    ary.push(evenFn);
}

//->发布、通知
function fire(evenType, e) {
    //this->curEle
    var ary = this["myBook" + evenType];
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

//->移除
function off(curEle, evenType, evenFn) {
    var ary = curEle["myBook" + evenType];
    if (ary && ary instanceof Array) {
        for (var i = 0; i < ary.length; i++) {
            var tempFn = ary[i];
            if (tempFn === evenFn) {
                ary[i] = null;//->ary.splice(i,1) ->和之前写的on/run/off中一样,防止数组塌陷问题
                return;
            }
        }
    }
}


/*
 * 实现我们元素的当前拖拽功能(张静怡写的)
 */
function down(e) {
    this.strX = e.pageX;
    this.strY = e.pageY;
    this.strL = this.offsetLeft;
    this.strT = this.offsetTop;
    if (this.setCapture) {
        this.setCapture();
        $event.on(box, "mousemove", move);
        $event.on(box, "mouseup", up);
    } else {
        this.MOVE = zhufengEvent.processThis(move, this);
        this.UP = zhufengEvent.processThis(up, this);
        $event.on(document, "mousemove", this.MOVE);
        $event.on(document, "mouseup", this.UP);
    }

    //->发布一个自定义的行为计划(接口)
    fire.call(this, "zhufengDragStart", e);
}

function move(e) {
    var curL = e.pageX - this.strX + this.strL;
    var curT = e.pageY - this.strY + this.strT;
    var minL = 0, minT = 0, maxL = (document.documentElement.clientWidth || document.body.clientWidth) - this.offsetWidth, maxT = (document.documentElement.clientHeight || document.body.clientHeight) - this.offsetHeight;
    curL = curL <= minL ? minL : (curL >= maxL ? maxL : curL);
    curT = curT <= minT ? minT : (curT >= maxT ? maxT : curT);
    this.style.left = curL + "px";
    this.style.top = curT + "px";

    //->发布一个自定义的行为计划(接口)
    fire.call(this, "zhufengDragMove", e);
}

function up(e) {
    if (this.releaseCapture) {
        this.releaseCapture();
        $event.off(box, "mousemove", move);
        $event.off(box, "mouseup", up);
    } else {
        $event.off(document, "mousemove", this.MOVE);
        $event.off(document, "mouseup", this.UP);
    }

    //->发布一个自定义的行为计划(接口)
    fire.call(this, "zhufengDragEnd", e);
}