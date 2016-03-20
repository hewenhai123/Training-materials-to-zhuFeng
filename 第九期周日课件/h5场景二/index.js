function getEle(ele) {
    return document.querySelector(ele);
}
var main = getEle("#main");
var winW = document.documentElement.clientWidth;
/*�豸�Ŀ�*/
var winH = document.documentElement.clientHeight;
/*�豸�ĸ�*/
var desW = 640;
var desH = 1008;
if (winW / winH <= desW / desH) {
    main.style.webkitTransform = "scale(" + winH / desH + ")";
} else {
    main.style.webkitTransform = "scale(" + winW / desW + ")";
}

var bell = getEle("#bell");
var say = getEle("#say");
var music = getEle("#music");

var num = 0;
function fnLoad() {
    var progress = getEle(".progress");
    var loading = getEle("#loading");
    var arr = ['phoneBg.jpg', 'cubeBg.jpg', 'cubeImg1.png', 'cubeImg2.png', 'cubeImg3.png', 'cubeImg4.png', 'cubeImg5.png', 'cubeImg6.png', 'phoneBtn.png', 'phoneKey.png', 'messageHead1.png', 'messageHead2.png', 'messageText.png', 'phoneHeadName.png'];
    for (var i = 0; i < arr.length; i++) {
        var oImg = new Image();//����һ��ͼƬʵ��
        oImg.src = "images/" + arr[i];
        oImg.onload = function () {
            num++;
            //���سɹ���ͼƬ�ĸ���ռ����ͼƬ�İٷֱȾ���progress�Ŀ��
            progress.style.width = num / arr.length * 100 + "%";
            //����ִ�����ʱ�򶼻ᴥ��webkitTransitionEnd����¼�
            if (num == arr.length && loading) {
                progress.addEventListener("webkitTransitionEnd", function () {
                    //���һ��ͼƬ������֮�������loading���divȫɾ��
                    main.removeChild(loading);
                    loading = null;//�Ѷ����loading�������Ҳ�ͷŵ�
                    fnPhone.init();
                }, false)
            }
        }
    }
}
fnLoad();

var fnPhone = {
    init: function () {
        bell.play();
        this.phone = getEle("#phone");
        this.speaker = getEle(".speaker");
        //���ƶ��˲���ֱ����click�¼�,Ҳ������touchstart��ģ��click�¼�,��tap�������ʾclick(click����300ms���ӳ�)
        this.phone.addEventListener("click", this.touch, false);
    },
    touch: function (e) {
        var target = e.target;
        if (target.className == "listenTouch") {//�����绰
            bell.pause();
            say.play();
            target.parentNode.style.display = "none";//answer���div����
            fnPhone.speaker.style.webkitTransform = "translate(0,0)";//������ص�һ��ʼ��λ��
        } else if (target.className == "hangUp") {//�Ҷ�
            say.pause();
            fnPhone.closePhone()
        }
    },
    closePhone: function () {//��phone���div�Ƶ�������,Ȼ��ɾ��
        this.phone.style.webkitTransform = "translate(0," + desH + "px)";
        var that = this;
        window.setTimeout(function () {
            main.removeChild(that.phone);
            fnMessage();
        }, 1000)
    }
}


function fnMessage() {
    //1.һ��ʼÿ��li�����ص�,Ȼ��ÿ��1�����һ��,����ÿ���ƶ���û��ƫ�Ƶ�λ��
    //2.���ֳ�������li֮��,ul���������ƶ�(�Ѿ���ʾ��li)���ܵĸ߶�
    //3.���е�li�����ֺ�����messageɾ����,��ʱ�������,����ħ��ҳ��
    music.play();
    var message = getEle("#message");
    var oLis = document.querySelectorAll("#message>ul>li");
    var oUl = getEle("#message>ul");
    var num = 0;
    /*��ʼ������*/
    var h = null;
    /*�ۻ�li�ĸ߶�*/
    var timer = window.setInterval(function () {
        if (num == oLis.length) {
            window.clearInterval(timer);
            window.setTimeout(function () {
                main.removeChild(message);
                fnCube();
            }, 1000);
            return;
        }
        var oLi = oLis[num];
        oLi.style.opacity = 1;
        /*��li��ʾ*/
        oLi.style.webkitTransform = "translate(0,0)";
        /*�ص�û��ƫ�Ƶ�λ��*/
        h += oLi.offsetHeight - 30;
        if (num >= 3) {
            oUl.style.webkitTransform = "translate(0,-" + h + "px)";
        }
        num++;
    }, 1000)
}


function fnCube() {
    var cubeBox = getEle("#cubeBox");
    cubeBox.style.webkitTransform = "scale(0.7) rotateY(-45deg) rotateX(135deg)";
    //rotateY()�ĽǶ���ˮƽ���򻬶��ľ���
    //rotateX()�ĽǶ��Ǵ�ֱ���򻬶��ľ���
    var startX = -45;
    var startY = 135;
    var x = 0;
    /*��ʾˮƽ�����ľ���*/
    var y = 0;
    /*��ʾ��ֱ�����ľ���*/
    document.addEventListener("touchstart", start, false);
    document.addEventListener("touchmove", move, false);
    document.addEventListener("touchend", end, false)
    function start(e) {
        var touch = e.changedTouches[0];
        this.startTouch = {x: touch.pageX, y: touch.pageY};
        this.flag = false;
    }

    function move(e) {
        e.preventDefault();/*��ֹĬ�Ϲ�������Ϊ*/
        this.flag = true;//�ǵ�����ǻ���
        var touch = e.changedTouches[0];
        var moveTouch = {x: touch.pageX, y: touch.pageY};
        x = moveTouch.x - this.startTouch.x;
        y = moveTouch.y - this.startTouch.y;
        //startX+x ��ʼ�ĽǶ�+�����ľ���
        cubeBox.style.webkitTransform = "scale(0.7) rotateY(" + (startX + x) + "deg) rotateX(" + (startY + y) + "deg)";
    }

    function end(e) {
        if(this.flag){
            //����λ����ľ�����Ϊ��һ�λ�����ʼ�ĽǶ�
            startX += x;
            startY += y
        }

    }


}
