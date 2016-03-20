var main = document.querySelector("#main");
var oLis = document.querySelectorAll("#list>li");
var winW = document.documentElement.clientWidth;
var winH = document.documentElement.clientHeight;
var desW = 640;
var desH = 960;
if(winW/winH<desW/desH){//按照高度比例去缩放
    main.style.webkitTransform = "scale("+winH/desH+")";
}else{//按照宽度比例去缩放
    main.style.webkitTransform = "scale("+winW/desW+")";
}

[].forEach.call(oLis,function(){
    var oLi = arguments[0];
    oLi.index = arguments[1];
    oLi.addEventListener("touchstart",start,false);
    oLi.addEventListener("touchmove",move,false);
    oLi.addEventListener("touchend",end,false);
})

function start(e){
    this.startX = e.changedTouches[0].pageY;
}
function move(e){
    this.flag = true;
    var moveTouch = e.changedTouches[0].pageY;
    var movePos = moveTouch-this.startX;
    var index = this.index;
    [].forEach.call(oLis,function(){
        arguments[0].className = "";
        if(arguments[1]!=index){
            arguments[0].style.display = "none"
        }
        arguments[0].firstElementChild.id="";

    })
    if(movePos>0){/*↓   movePos是正的值*/
        this.prevSIndex = (index == 0?oLis.length-1:index-1);
        //oLis[this.prevSIndex].style.webkitTransform = "translate(0,"+(-winH+movePos)+"px)";
        var duration = -winH+movePos;
    }else if(movePos<0){/*↑*/
        this.prevSIndex = (index == oLis.length-1?0:index+1);
        //oLis[this.prevSIndex].style.webkitTransform = "translate(0,"+(winH+movePos)+"px)";
        var duration = winH+movePos;
    }
    this.style.webkitTransform = "scale("+(1-Math.abs(movePos)/winH*1/2)+")  translate(0,"+movePos+"px)";
    oLis[this.prevSIndex].style.webkitTransform = "translate(0,"+duration+"px)"
    oLis[this.prevSIndex].className = 'zIndex';
    oLis[this.prevSIndex].style.display ="block";
}
function end(e){
    if(this.flag){ //为了区分是点击事件还是触摸事件
        oLis[this.prevSIndex].style.webkitTransform = "translate(0,0)";
        oLis[this.prevSIndex].style.webkitTransition = "0.5s ease-out";
        oLis[this.prevSIndex].addEventListener("webkitTransitionEnd",function(e){
            if(e.target.tagName =="LI"){
                this.style.webkitTransition = "";
            }
            this.firstElementChild.id="a"+(this.index+1);
        },false)
    }

}