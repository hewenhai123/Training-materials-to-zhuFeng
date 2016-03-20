function down(e) {
    this.strX = e.pageX;
    this.strY = e.pageY;
    this.strL = this.offsetLeft;
    this.strT = this.offsetTop;
    if (this.setCapture) {
        this.setCapture();
        zhufengEvent.on(this, "mousemove", move);
        zhufengEvent.on(this, "mouseup", up);
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
    this.style.left = curL + "px";
    this.style.top = curT + "px";

    zhufengEvent.fire.call(this, "zhufengDragMove", e);
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

    zhufengEvent.fire.call(this, "zhufengDragEnd", e);
}