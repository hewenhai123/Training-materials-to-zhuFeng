//1、获取当前操作所需要的元素
var oTab = document.getElementById("tab");
var tHead = oTab.tHead;
var tBody = oTab.tBodies[0];
var oThs = tHead.rows[0].cells;
var oTrs = tBody.rows;

//2、实现数据绑定
function bindData() {
    var frg = document.createDocumentFragment();
    for (var i = 0; i < jsonAry.length; i++) {

        //事先进行数据的初始化处理
        var cur = jsonAry[i];
        cur.sex = cur.sex === 0 ? "男" : "女";

        //每一次循环都创建一个新的tr(创建一行)
        var oTr = document.createElement("tr");
        //oTr.className = "bg" + (i % 2);

        //每一行中还需要创建4个td
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
    for (var i = 0; i < oTrs.length; i++) {
        oTrs[i].className = "bg" + (i % 2);
    }
}
changeBg();

//4、实现表格排序
function sortList(n) {
    var _this = this;
    _this.flag *= -1;

    //1)将所有行的类数组转换为数组
    var ary = utils.listToArray(oTrs);

    //2)实现排序->根据当前点击的这一列(索引是n)中的内容进行排序
    ary.sort(function (a, b) {
        var curIn = a.cells[n].innerHTML;
        var nexIn = b.cells[n].innerHTML;
        var curInNum = parseFloat(curIn);
        var nexInNum = parseFloat(nexIn);
        //我们是给当前点击的这一列进行排序,对于数字的我们可以用相减来计算,对于非有效数字的,只能用localeCompare来进行比较
        if (isNaN(curInNum) || isNaN(nexInNum)) {
            return (curIn.localeCompare(nexIn)) * _this.flag;
        }
        return (curInNum - nexInNum) * _this.flag;
    });

    //3)从新按照ary中的最新的顺序把我们的每一行重新的添加到页面中
    var frg = document.createDocumentFragment();
    for (var i = 0; i < ary.length; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg = null;

    //4)排完序后的奇数偶数行和之前的不一样了,需要重新的计算隔行变色
    changeBg();
}

//5、给所有表头中的列(具有class="cursor"这个样式的列)绑定点击事件
for (var i = 0; i < oThs.length; i++) {
    var curTh = oThs[i];
    if (curTh.className === "cursor") {
        curTh.flag = -1;
        curTh.index = i;
        curTh.onclick = function () {
            sortList.call(this, this.index);
        };
    }
}