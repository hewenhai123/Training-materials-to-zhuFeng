(function () {
    var curEle = null;

    function getWin(attr) {
        return document.documentElement[attr] || document.body[attr];
    }

    function scrollMove() {
        var winH = getWin("clientHeight"), curT = getWin("scrollTop");
        curEle.style.display = curT >= (winH / 2) ? "block" : "none";
    }

    window.onscroll = scrollMove;

    function scrollInit(selector, duration) {
        duration = duration || 1000;
        curEle = document.getElementById(selector);
        curEle.onclick = function () {
            curEle.style.display = "none";
            window.onscroll = null;

            var target = getWin("scrollTop"), interval = 10, step = (target / duration) * interval;
            var timer = window.setInterval(function () {
                if (target <= 0) {
                    window.clearInterval(timer);
                    window.onscroll = scrollMove;
                    return;
                }
                target -= step;
                document.documentElement.scrollTop = target;
                document.body.scrollTop = target;
            }, interval);
        };
    }

    window.scrollInit = scrollInit;
})();