(function () {
    var Drag = function (curEle) {
        //this->当前类的实例(并不是当前要操作的那个元素,curEle才是当前要实现拖拽的那个元素)
        this.strX = null;
        this.strY = null;
        this.strL = null;
        this.strT = null;
        this.curEle = curEle;
        this.MOVE = null;
        this.UP = null;

        zhufengEvent.on(this.curEle, "mousedown", zhufengEvent.processThis(this.down, this));//->一定要把down中的this预先处理为当前的实例
    };

    //->在类的原型上,定义的公有的属性和方法,一般情况下里面的this也是当前的实例
    Drag.prototype = {
        constructor: Drag,
        down: function (e) {
            this.strX = e.pageX;
            this.strY = e.pageY;
            this.strL = this.curEle.offsetLeft;//->记录盒子的起始位置,但是此时的this已经不是当前的盒子了,而是Drag这个类的一个实例
            this.strT = this.curEle.offsetTop;

            //->同样也需要把move、up方法中的this预先处理为当前的实例
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

            zhufengEvent.fire.call(this.curEle, "zhufengDragStart", e);
        },
        move: function (e) {
            var curL = e.pageX - this.strX + this.strL;
            var curT = e.pageY - this.strY + this.strT;
            this.curEle.style.left = curL + "px";
            this.curEle.style.top = curT + "px";

            zhufengEvent.fire.call(this.curEle, "zhufengDragMove", e);
        },
        up: function (e) {
            if (this.curEle.releaseCapture) {
                this.curEle.releaseCapture();
                zhufengEvent.off(this.curEle, "mousemove", this.MOVE);
                zhufengEvent.off(this.curEle, "mouseup", this.UP);
            } else {
                zhufengEvent.off(document, "mousemove", this.MOVE);
                zhufengEvent.off(document, "mouseup", this.UP);
            }

            zhufengEvent.fire.call(this.curEle, "zhufengDragEnd", e);
        }
    };

    window.Drag = Drag;
})();

//->想要实现面向对象风格的拖拽,需要让每一个方法down、move、up中的this都是当前Drag这个类的实例才可以
//->把down、move、up作为每一个实例共有的公共方法调用，把strX、strY、strL、strT...都作为每一个实例单独的私有的属性->每一次拖拽记录的信息都是实例私有的,不同的实例之间互不影响

//->zhufengEvent.on(this.curEle, "mousedown", this.down); 使用我们封装好的事件库给当前需要拖拽的元素的mousedown行为绑定一个Drag.prototype.down方法 ->此时down方法中的this是当前元素，而不是我们之前预先规划的Drag的实例