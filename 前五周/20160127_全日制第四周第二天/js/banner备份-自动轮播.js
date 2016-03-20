(function () {
    //->数据源
    var ary = ["img/banner1.jpg", "img/banner2.jpg", "img/banner3.jpg", "img/banner4.jpg"];

    //->定义几个初始的变量(autoTimer->存储自动轮播的定时器 step->当前展示图片的索引 count->一共有多少张图片)
    var autoTimer = null, step = 0, count = ary.length;
    var inner = document.getElementById("inner"), imgList = inner.getElementsByTagName("img");

    //->数据绑定
    bindData();
    function bindData() {
        var str = "";
        for (var i = 0; i < ary.length; i++) {
            str += "<div><img src='' trueImg='" + ary[i] + "'/></div>";
        }
        str += "<div><img src='' trueImg='" + ary[0] + "'/></div>";//->把第一张图片复制一份一模一样的到最后一张
        inner.innerHTML = str;
        inner.style.width = (count + 1) * 1000 + "px";
    }

    //->图片延迟加载
    window.setTimeout(lazyImg, 500);
    function lazyImg() {
        for (var i = 0; i < imgList.length; i++) {
            ~function (i) {
                var curImg = imgList[i];
                var oImg = new Image;
                oImg.src = curImg.getAttribute("trueImg");
                oImg.onload = function () {
                    curImg.src = this.src;
                    curImg.style.display = "block";
                    animate(curImg, {opacity: 1}, 500);
                }
            }(i);
        }
    }

    //->实现自动轮播:实现无缝轮播滚动,当滚动到最后一张的时候,我们让其直接回到第一张
    //原理思路:首先把第一张复制一份一模一样的到最后位置,当前例子中一共有四张图片,我们把第一张放末尾一份,此时有五张;step=3的时候,我们1s后运动到第四张图片;step=4的时候,我们运动到第五张图片(其实也是第一张);step=5的时候,我们首先让inner.left值直接变为0,直接变到第一张(由于刚才第五张看到的也是第一张图片,所以给用户形成了视觉差效果,用户分辨不出来变了),不仅如此,接下来需要显示第二张了,所以我们让step=1...
    function autoMove() {
        step++;
        if (step > count) {
            step = 1;
            inner.style.left = 0;
        }
        animate(inner, {left: -step * 1000}, 1000);
    }

    autoTimer = window.setInterval(autoMove, 4000);//->第一次三秒,但是图片切换完成需要一秒,此时定时器autoTimer一直走着时间呢,所以下一次我们看到的是两秒后就切换了...,->我们可以把第一次的时间设置为4000,第一次四秒,其余以后都是三秒
})();