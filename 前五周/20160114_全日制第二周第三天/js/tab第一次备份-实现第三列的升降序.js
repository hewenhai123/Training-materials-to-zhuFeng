//1、获取当前操作所需要的元素
var oTab = document.getElementById("tab");
var tHead = oTab.tHead;//->表格独有的属性,获取指定table下的thead
var tBody = oTab.tBodies[0];//->获取指定table下的所有的tbody中的第一个
var oThs = tHead.rows[0].cells;//->获取tHead下所有行中的第一行下的所有的列 rows获取所有行 cells获取所有的列
var oTrs = tBody.rows;//->获取tBody下的所有的行

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
function sortList() {
    oThs[2].flag *= -1;

    //1)将所有行的类数组转换为数组
    var ary = utils.listToArray(oTrs);

    //2)实现排序->根据每一行的第三列中的内容(分数)进行排序
    ary.sort(function (a, b) {
        var curIn = a.cells[2].innerHTML;
        var nexIn = b.cells[2].innerHTML;
        var curInNum = parseFloat(curIn);
        var nexInNum = parseFloat(nexIn);
        return (curInNum - nexInNum) * oThs[2].flag;
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

//5、当点击分数的时候实现我们的排序
oThs[2].flag = -1;//->开始给当前列加一个自定义属性flag,默认值是-1;并且在每一次执行sortList方法的时候,都让flag*=-1;例如：当我第一次点击的时候,flag变为了1,实现升序;第二次点击的时候,*=-1,此时flag变为-1了,实现降序....
oThs[2].onclick = function () {
    sortList();
};