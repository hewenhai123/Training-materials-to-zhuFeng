//1、获取我们接下来要操作的元素
var oTab = document.getElementById("tab");//->获取的table
var tHead = oTab.tHead;//->表格自带的属性，获取table下的thead
var tBody = oTab.tBodies[0];//->获取table下所有tbody中的第一个
var oRows = tBody.rows;//->获取tBody下所有的行(tr)
var oThs = tHead.rows[0].cells;//->获取tHead下所有行中的第一行下的所有的列(th)

//2、实现数据绑定->把json-sort.js中的jsonAry中的数据绑定到tBody中
function bindData() {
    var frg = document.createDocumentFragment();
    for (var i = 0; i < jsonAry.length; i++) {
        var cur = jsonAry[i];
        cur.sex = (cur.sex === 0 ? "男" : "女");//->处理性别

        //每一次循环都创建一个tr
        var oTr = document.createElement("tr");

        for (var key in cur) {
            //每一个tr中在放四个td
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