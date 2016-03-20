//module_mode 模块模式
var zhufengDrag = (function () {
    var strX = null, strY = null, strL = null, strT = null;
    var MOVE = null, UP = null;
    var n = 0;

    function down(e) {
        strX = e.pageX;
        strY = e.pageY;
        strL = this.offsetLeft;
        strT = this.offsetTop;
        if (this.setCapture) {
            this.setCapture();
            zhufengEvent.on(this, "mousemove", move);
            zhufengEvent.on(this, "mouseup", up);
        } else {
            MOVE = zhufengEvent.processThis(move, this);
            UP = zhufengEvent.processThis(up, this);
            zhufengEvent.on(document, "mousemove", MOVE);
            zhufengEvent.on(document, "mouseup", UP);
        }
        zhufengEvent.fire.call(this, "zhufengDragStart", e);

        n++;
        this.innerHTML = n;
    }

    function move(e) {
        var curL = e.pageX - strX + strL;
        var curT = e.pageY - strY + strT;
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
            zhufengEvent.off(document, "mousemove", MOVE);
            zhufengEvent.off(document, "mouseup", UP);
        }
        zhufengEvent.fire.call(this, "zhufengDragEnd", e);
    }

    return {
        down: down,
        move: move,
        up: up
    };
})();

//->当开始加载这个JS文件的时候,执行一个自执行函数形成一个不销毁的私有的作用域A,在A中有六个私有的变量和三个私有的函数

//->当我给第一个盒子拖拽的时候,首先执行A中的down方法,并且分别的给私有变量 strX、strY、strL、 strT赋值(这些变量也是A自己的)....

//->当我给第二个盒子拖拽的时候,依然是执行A中的down方法,其实我们用到的strX、strY、strL、 strT这几个变量和上一次这几个变量是相同的，都是A中的

//->闭包中的私有资源的共享

var obj={
    fn:function(){

    },
    db:function(){

    }
};
