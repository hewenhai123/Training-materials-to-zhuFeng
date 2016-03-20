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
    oThs[2].flag *= -1;//->每一次执行sortList都让flag*=-1
    //第一次  flag=-1  flag*=-1=1  sort*1  升序
    //第二次  flag=1   flag*=-1=-1 sort*-1 降序
    //第三次  flag=-1  flag*=-1=1  sort*1  升序
    //....


    //1)把存储所有行的雷类数组转换为数组
    var ary = utils.listToArray(oRows);

    //2)给数组进行排序
    ary.sort(function (a, b) {
        var curIn = a.cells[2].innerHTML, nexIn = b.cells[2].innerHTML;
        var curInNum = parseFloat(curIn), nexInNum = parseFloat(nexIn);
        return (curInNum - nexInNum) * oThs[2].flag;
    });

    //3)在按照最新的顺序重新的放回到页面中
    var frg = document.createDocumentFragment();
    for (var i = 0; i < ary.length; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg = null;

    //4)按照最新的奇数偶数行实现变色
    changeBg();
}

//5、点击第三列的时候实现排序
oThs[2].flag = -1;//->给第三列绑定一个自定义属性flag,初始值是-1 ->我们接下来通过flag实现升降序
oThs[2].onclick = function () {
    sortList();
};