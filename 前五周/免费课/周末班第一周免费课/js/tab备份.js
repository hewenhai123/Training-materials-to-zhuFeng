//分析需求:
//1)默认第一个li和第一个div被选中 class='select'
//2)当我点击某一个li的时候,我们让所有的li个div都没有选中的样式;然后在让我们当前点击的这个li和div有选中的样式;

//1、想要操作哪些元素就先把他们都获取到:
//->#tab下的三个li和三个div
var oTab = document.getElementById("tab");
var oLis = oTab.getElementsByTagName("li");
var oDivs = oTab.getElementsByTagName("div");

//2、编写一个方法实现我们的选项卡需求
function tabChange(nIndex) {
    //1)不管点击的是哪一个,首先让所有的li和div都没有选中的样式
    for (var i = 0; i < oLis.length; i++) {
        oLis[i].className = null;
        oDivs[i].className = null;
    }
    //2)让当前点击的这个li和对应的div有选中的样式
    //制定方法的时候并不知道当前点击的是哪一个,那么我们定义一个形参,存储当前点击这个li的索引->nIndex:传递进来的当前点击的这个li的索引
    oLis[nIndex].className = "select";
    oDivs[nIndex].className = "select";
}

//3、当用户点击每一个li的时候,我们执行tabChange方法
//1)一个个的绑定点击事件
//oLis[0].onclick = function () {
//    tabChange(0);
//};
//oLis[1].onclick = function () {
//    tabChange(1);
//};
//oLis[2].onclick = function () {
//    tabChange(2);
//};

//2)循环给每一个li绑定点击事件
//for (var i = 0; i < oLis.length; i++) {
//    oLis[i].onclick = function () {
//        alert(i);
//        //tabChange(i);
//    };
//}
//Uncaught TypeError: Cannot set property 'className' of undefined 不能设置className这个属性->大部分情况下都是操作它的元素是错误的
//通过分析我们发现点击哪一个li我们传递给tabChange这个方法的索引都是3

//详细的分析步骤:
//i=0 第一次循环 给第一个li绑定点击事件
//oLis[0].onclick = function () {
//    alert(i);
//};
////我们给第一个li的onclick行为绑定了一个方法(此时只是把方法定义的部分赋值给onclick)，只有当点击第一个li的时候才会执行
////因为绑定的时候,方法没有执行,函数中存储的是代码字符串 “alert(i)”;这里的i不是变量,只是一个没有任何意义的字符而已
//
//i=1 第二次循环 给第二个li绑定点击事件
//oLis[1].onclick=function(){
//    alert(i);
//};
//
//i=2 第三次循环 给第三个li绑定点击事件
//oLis[2].onclick=function(){
//    alert(i);
//};
//
//i=3 循环结束
//
//接下来用户开始点击li,比如点击第三个li,执行对应的方法,把开始存储的字符串变为JS代码执行 alert(i); 此时的i已经等于3了


//3)如何解决上述的问题
//A、自定义义属性:我们给元素对象增加的自己定义的属性
for (var i = 0; i < oLis.length; i++) {
    oLis[i].zhuFeng = i;//->每一次循环都给每一个li增加一个自定义的属性zhuFeng,目的是存储自己的索引

    oLis[i].onclick = function () {
        //tabChange(i); ->我们的目的是执行tabChange把当前点击的这个li的索引传递进去,但是不能用i,因为i已经变为了3了
        //this->代表的就是当前点击的这个li this.zhuFeng->代表的就是当前点击的这个li的索引
        tabChange(this.zhuFeng);
    };
}
//自定义属性是我们整个JS中最常用、好用、伟大的编程思想