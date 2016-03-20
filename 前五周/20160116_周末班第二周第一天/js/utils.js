//采用单例模式来封装我们常用的方法库,我们只需要把所有的常用的方法都放在utils这个命名空间下即可
var utils = {
    //listToArray:实现将类数组转换为数组
    listToArray: function (likeAry) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeAry);
        } catch (e) {
            for (var i = 0; i < likeAry.length; i++) {
                ary[ary.length] = likeAry[i];
            }
        }
        return ary;
    },
    //toJSON:把JSON格式的字符串转换为JSON格式的对象
    toJSON: function (str) {
        return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
    }
};