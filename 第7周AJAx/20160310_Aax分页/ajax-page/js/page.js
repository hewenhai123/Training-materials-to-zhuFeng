(function () {
    var count = 10, curPage = 1, totalPage = 1, dataAry = null;

    var pageList = document.getElementById("pageList");
    var pageListLis = pageList.getElementsByTagName("li");

    var list = document.getElementById("list");
    var listLis = list.getElementsByTagName("li");

    var boxPage = document.getElementById("box-page");
    var pageInp = document.getElementById("pageInp");

    //2、在callBack方法中实现我们分页的需求
    var callBack = function (data) {
        dataAry = data;
        totalPage = Math.ceil(data.length / count);

        //1)首先绑定我们的页码
        bindPage();

        //2)把对应页的内容绑定上
        bindList();

        //3)用事件委托给我们所有需要点击的页码绑定点击事件,实现内容的切换
        bindEvent();
    };

    function bindPage() {
        var str = "";
        for (var i = 1; i <= totalPage; i++) {
            str += "<li>" + i + "</li>";
        }
        pageList.innerHTML = str;
        changePage();
    }

    function changePage() {
        for (var i = 0; i < pageListLis.length; i++) {
            pageListLis[i].className = (i + 1) === curPage ? "select" : null;
        }
    }

    function bindList() {
        //第一页 索引0~10(不含10)  第二页 10~20(不含20)  第三页 20~30(不含30) ...
        //我们在数据源中遍历当前页需要的那些数据,开始索引:(当前页-1)*10 结束索引:当前页*10(不包含最后一个)
        var str = "";
        for (var i = (curPage - 1) * count; i < curPage * count; i++) {
            var cur = dataAry[i];
            //->在最后一页的时候,我们获取的索引可能已经超过了总数据条数,这样获取的cur的结果是undefined,如果出现这样的情况我们就结束循环即可
            if (!cur) break;

            str += "<li num='" + cur["num"] + "'>";
            for (var key in cur) {
                str += "<span>" + cur[key] + "</span>";
            }
            str += "</li>";
        }
        list.innerHTML = str;
        changeBg();

        //给每一个li绑定点击事件,实现跳转到详细页
        for (var k = 0; k < listLis.length; k++) {
            listLis[k].onclick = function () {
                window.location.href = "detail.html?num=" + this.getAttribute("num");
            };
        }
    }

    function changeBg() {
        for (var i = 0; i < listLis.length; i++) {
            listLis[i].className = i % 2 === 1 ? "bg" : null;
        }
    }

    function bindEvent() {
        boxPage.onclick = function (e) {
            e = e || window.event;
            var tar = e.target || e.srcElement;
            if (tar.id === "onePage") {//->首页
                curPage = 1;
            } else if (tar.id === "prevPage") {//->上一页
                if (curPage > 1) {
                    curPage--;
                }
            } else if (tar.id === "nextPage") {//->下一页
                if (curPage < totalPage) {
                    curPage++;
                }
            } else if (tar.id === "lastPage") {//->尾页
                curPage = totalPage;
            } else if (tar.tagName.toLowerCase() === "li") {
                curPage = parseFloat(tar.innerHTML);
            } else {
                return;
            }
            bindList();
            changePage();
        };

        pageInp.onkeyup = function (e) {
            e = e || window.event;
            if (e.keyCode !== 13) return;

            var val = this.value.replace(/(^ +| +$)/g, "");
            var reg = /^\d+$/, flag = true;
            if (reg.test(val)) {
                val = Number(val);
                if (val >= 1 && val <= totalPage) {
                    curPage = val;
                    bindList();
                    changePage();
                } else {
                    flag = false;
                }
            } else {
                flag = false;
            }
            if (flag === false) {
                //->不正常做效果
                this.value = "";
            }
        };
    }

    //1、Ajax读取需要绑定的数据
    var xhr = createXHR();
    xhr.open("get", "data.txt?_=" + Math.random(), true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && /^2\d{2}$/.test(this.status)) {
            var data = "JSON" in window ? JSON.parse(this.responseText) : eval("(" + this.responseText + ")");
            typeof callBack === "function" ? callBack(data) : null;
        }
    };
    xhr.send();
})();

function createXHR() {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest;
    } else {
        if (new ActiveXObject("Microsoft.XMLHTTP")) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (new ActiveXObject("Msxml2.XMLHTTP")) {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } else if (new ActiveXObject("Msxml3.XMLHTTP")) {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
    return xhr;
}