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
        zhufengEvent.on(box, "mousemove", move);
        zhufengEvent.on(box, "mouseup", up);
    } else {
        this.MOVE = zhufengEvent.processThis(move, this);
        this.UP = zhufengEvent.processThis(up, this);
        zhufengEvent.on(document, "mousemove", this.MOVE);
        zhufengEvent.on(document, "mouseup", this.UP);
    }

    zhufengEvent.fire.call(this, "zhufengDragStart", e);
}

function move(e) {
    var curL = e.pageX - this.strX + this.strL;
    var curT = e.pageY - this.strY + this.strT;
    var minL = 0, minT = 0, maxL = (document.documentElement.clientWidth || document.body.clientWidth) - this.offsetWidth, maxT = (document.documentElement.clientHeight || document.body.clientHeight) - this.offsetHeight;
    curL = curL <= minL ? minL : (curL >= maxL ? maxL : curL);
    curT = curT <= minT ? minT : (curT >= maxT ? maxT : curT);
    this.style.left = curL + "px";
    this.style.top = curT + "px";

    zhufengEvent.fire.call(this, "zhufengDragMove", e);
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

    zhufengEvent.fire.call(this, "zhufengDragEnd", e);
}