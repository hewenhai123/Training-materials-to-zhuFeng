//1、获取我们接下来要操作的元素
var oTab = document.getElementById("tab");
var tHead = oTab.tHead;
var tBody = oTab.tBodies[0];
var oRows = tBody.rows;
var oThs = tHead.rows[0].cells;

//2、实现数据绑定
function bindData() {
    var frg = document.createDocumentFragment();
    for (var i = 0; i < jsonAry.length; i++) {
        var cur = jsonAry[i];
        cur.sex = (cur.sex === 0 ? "男" : "女");
        var oTr = document.createElement("tr");
        for (var key in cur) {
            var oTd = document.createElement("td");
            oTd.innerHTML = cur[key];
            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);
    }
    tBody.appendChild(frg);
    frg = null;
}
bindData();

//3、实现隔行变色
function changeBg() {
    for (var i = 0; i < oRows.length; i++) {
        oRows[i].className = i % 2 === 1 ? "bg" : null;
    }
}
changeBg();

//4、按照武力值从小到大进行排序
function sortList() {
    //this->oThs[2]
    var zhuFeng = this;
    zhuFeng.flag *= -1;

    var ary = utils.listToArray(oRows);
    ary.sort(function (a, b) {
        //sort传递的匿名函数这个参数中的this->window
        var curIn = a.cells[2].innerHTML, nexIn = b.cells[2].innerHTML;
        var curInNum = parseFloat(curIn), nexInNum = parseFloat(nexIn);
        return (curInNum - nexInNum) * zhuFeng.flag;
    });

    var frg = document.createDocumentFragment();
    for (var i = 0; i < ary.length; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg = null;

    changeBg();
}

//5、点击第三列的时候实现排序
oThs[2].flag = -1;
oThs[2].onclick = function () {
    //匿名方法中的 this->oThs[2]

    sortList.call(this);//->执行sortList方法,让sortList中的this关键字变为oThs[2]
    //sum(this);//->执行sum方法,把this代表的值oThs[2]当做参数值传递给sum
};
















