//1、获取我们当前需求中所需要的所有的元素
var oTab = document.getElementById("tab");
var tHead = oTab.tHead;
var tBody = oTab.tBodies[0];
var oRows = tBody.rows;
var oThs = tHead.rows[0].cells;

//2、数据绑定
function bindData() {
    var frg = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
        var cur = data[i];
        //数据分析->对于不正常的数据赋值默认值,对于一些内容进行特殊的处理
        cur.name = cur.name || "--";
        cur.age = cur.age || 25;
        cur.score = cur.score || 60;
        cur.sex = cur.sex === 0 ? "男" : "女";

        //每一次循环创建一个TR
        var oTr = document.createElement("tr");
        for (var key in cur) {
            //每一个TR中都创建四个TD
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

//3、实现奇偶行变色
function changeBg() {
    for (var i = 0; i < oRows.length; i++) {
        oRows[i].className = i % 2 === 1 ? "even" : null;
    }
}
changeBg();

//4、实现表格排序
function sortList(n) {
    //n:当前点击那一列的索引
    //this->当前点击的那一列 每一次点击的时候都让当前列的flag*=-1
    var _this = this;//->sortList中的this是当前点击的那一列
    for (var k = 0; k < oThs.length; k++) {
        k !== n ? oThs[k].flag = -1 : null;
    }
    _this.flag *= -1;

    //A、把tbody下的所有行的类数组转换为数组
    var rowsAry = utils.listToArray(oRows);

    //B、给rowsAry进行排序
    rowsAry.sort(function (a, b) {
        //this->window
        var curIn = a.cells[n].innerHTML, nexIn = b.cells[n].innerHTML, curInNum = parseFloat(curIn), nexInNum = parseFloat(nexIn);
        var num = isNaN(curInNum) ? curIn.localeCompare(nexIn) : curInNum - nexInNum;
        return num * _this.flag;
    });

    //C、按照最新的顺序把每一行重新的添加到页面中
    var frg = document.createDocumentFragment();
    for (var i = 0; i < rowsAry.length; i++) {
        frg.appendChild(rowsAry[i]);
    }
    tBody.appendChild(frg);
    frg = null;

    //D、现有的顺序已经发生改变,我们重新的计算隔行变色
    changeBg();
}

//5、给对应的列绑定点是事件,点击的实现排序
for (var i = 0; i < oThs.length; i++) {
    var oTh = oThs[i];
    if (oTh.className === "cursor") {
        oTh.index = i;
        oTh.flag = -1;
        oTh.onclick = function () {
            sortList.call(this, this.index);
        };
    }
}











