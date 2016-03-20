//分析原理和实现的思路:
//1)默认让第一个li个第一个div有选中的样式 class='select'
//2)当我们点击某一个li
//  a:首先让三个li个对应的三个的div都没有选中的样式
//  b:在让当前点击的那一个li和对应的div有选中的样式

//1、想要操作谁就先获取谁:我们想要操作的是#tab下的三个li个三个div
var oTab = document.getElementById("tab");
var oLis = oTab.getElementsByTagName("li");
var oDivs = oTab.getElementsByTagName("div");

//2、制定一个功能方法实现我们的选项卡切换
function tabChange(curIndex) {
    //1)首先把三个li和对应的div的class都清空
    for (var i = 0; i < oLis.length; i++) {
        oLis[i].className = null;
        oDivs[i].className = null;
    }

    //2)在让当前点击的这个li和对应的div有选中的样式
    //但是此时制定方法,我们并不知道当前用户点击的是哪一个li,我们需要定义一个形参变量来设置入口,用户点击的时候告诉我们点击的是哪一个li
    //->curIndex:存储的是我们当前点击的这个li的索引
    oLis[curIndex].className = "select";
    oDivs[curIndex].className = "select";
}

//3、执行这个方法,当我们用户点击li的时候执行我们的方法:给每一个li绑定点击事件

//1)手动一个个的绑定点击事件(可以实现)
//oLis[0].onclick = function () {
//    tabChange(0);
//};
//oLis[1].onclick = function () {
//    tabChange(1);
//};
//oLis[2].onclick = function () {
//    tabChange(2);
//};

//2)循环给每一个li绑定点击事件(不可以实现)
//for (var i = 0; i < oLis.length; i++) {
//    oLis[i].onclick = function () {
//        alert(i);
//        //tabChange(i);
//    };
//}
//为什么不可以实现?
//->我们通过调整发现,上述代码当我点击每一个li的时候,获取的索引(i)并不是0-2,而是变为了3

//i=0 第一次循环
//oLis[0].onclick = function () {
//   alert(i);
//};-->我们是把一个函数定义的部分赋值给元素的click事件,因为定义一个函数的时候里面存储的都是一堆字符串,也就是此时函数中的i不是变量而是一个"i"而已
//
//i=1 第二次循环
//oLis[1].onclick = function () {
//   alert(i);
//};
//...
//最后循环结束后i变为了3
//
//当用户点击的时候,我们的页面已经加载完成了(HTML、CSS、JS代码都执行完成)，此时我们JS中的for循环也执行完成了,当我们点击的时候在用到i，发现i已经变为了3


//如何的来解决？
//我们需要把当前的索引传递进去,但是还不能用i了,拿我们就换一种方式->"自定义属性的方式"(自己给每一个元素对象增加一些之前没有的属性)
for (var i = 0; i < oLis.length; i++) {
    oLis[i].zhuFeng = i;//->每一次循环给每一个li增加一个叫做zhuFeng的自定义的属性名,属性值存储的是当前li的索引
    oLis[i].onclick = function () {
        //this->当前点击的这个li,你点击的是第二个li,那么这个this就是我们的第二个li
        tabChange(this.zhuFeng);//->把我们之前存储到每一个li的zhuFeng自定义属性上的索引的值获取到传递给tabChange,实现我们选项卡的切换
    };
}

//使用闭包的方式解决
//for (var i = 0; i < oLis.length; i++) {
//    ~function (i) {
//        oLis[i].onclick = function () {
//            tabChange(i);
//        };
//    }(i);
//}

//for (var i = 0; i < oLis.length; i++) {
//    oLis[i].onclick = (function (i) {
//        return function () {
//            tabChange(i);
//        };
//    })(i);
//}

//关于函数的定义
//function fn(){
//    var total=1+1;
//    console.log(total);
//}
//1)开空间:定义一个函数,首先浏览器会开辟一个新的内存空间
//2)分地址:并且浏览器会给这个空间分配一个16进制的地址
//3)存内容:函数数据类型是把函数体中的代码当做"字符串"存储进去的
//4)赋值:把内存空间的地址赋值给我们的函数名