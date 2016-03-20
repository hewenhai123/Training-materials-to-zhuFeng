(function () {
    // 为什么防止undefined在低版本ie里被重写？
    // 因为在低版本ie里 undefined是可以被当做变量名的
    // 解决方法1、传入一个没有被赋值的形参2、判断是否等于void 0
    var undefined = void 0;
    // 为了防止重复加载
    // 如果x已经存在，则什么都不执行，直接return
    if (this.x !== undefined) {
        return;
    }
    var x = this.x = {};
    // 默认的参数列表项
    var settings = {
        // ajax请求的路径
        url: '/',
        // ajax的http方法
        type: 'get',
        // 往服务器发送的数据
        data: {},
        // 是否为异步
        async: true,
        // 成功时执行的函数
        success: function () {
        },
        // 失败时执行的函数
        error: function () {
        },
        // 超时毫秒数，过了这么长时间，http事务还没有完成，这就代表超时了。
        timeout: 0,
        // 服务器返回的数据类型
        dataType: 'text',// text  json
        // 默认是不走缓存的
        cache: false,
        username:undefined,
        password:undefined
    };
    x.ajax = function (options) {
        // 判断参数是否为一个对象，如果不是则抛出错误
        if (!tool.isObject(options)) {
            throw new Error('参数错误');
        }
        // 合并用户输入的参数列表到默认参数列表上，用户没传的项都赋值为默认值。
        var __options = {};
        //x.ajax({
        //    url: '/getInfo',
        //    type: 'get'
        //    data:{name:'1你?好23',age:18}
        //});
        // 如果没传就赋值为默认值
        tool.iteration(settings, function (key, value) {
            __options[key] = options[key] || value;
        });
        // ajax的第一步 获取实例
        var xhr = tool.getXHR();
        // 如果data为对象，则把data格式化为一个url的格式
        if (tool.isPureObject(__options.data)) {
            var arr = [];
            tool.iteration(__options.data, function (key, value) {
                arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
            });
            // name=1%E4%BD%A0%3F%E5%A5%BD23&age=18
            __options.data = arr.join('&');
        }
        // 处理缓存
        // 通过往url后面拼接一段随机的内容，让每次的url都不一样来防止被缓存
        if (__options.cache === false) {
            var random = Math.round(Math.random() * 100000000);
            // 只要往url后面拼接参数，一定要先判断有没有问号
            // 为什么要用下划线？
            // 因为没有人用下划线当成参数
            __options.url = tool.hasSearch(__options.url, '_=' + random);
        }
        // 判断是不是get系方法。如果是get系，就把data拼接到url后面
        if (/^(get|head|delete)$/ig.test(__options.type) && __options.data) {
            __options.url = tool.hasSearch(__options.url, __options.data);
            // 拼接完之后 清空data
            __options.data = null;
        }
        // ajax第二步，初始化http request
        xhr.open(__options.type, __options.url, __options.async,__options.username,__options.password);
        // ajax第三步
        xhr.onreadystatechange = function () {
            // 判断ajax对象的事务是否完成
            if (xhr.readyState === 4) {
                var responseText = xhr.responseText;
                // 判断状态码是否为2开头的
                if (/^2\d{2}$/.test(xhr.status)) {
                    // 成功
                    // P判断dataType是否需要转化为json格式
                    if (__options.dataType == 'json') {
                        try {
                            // 如果是错误格式的jsonString，就会出异常，错误这里用try catch包住
                            responseText = tool.JSONParse(responseText);
                        } catch (e) {
                            // 不合法的jsonString，抛出错误
                            __options.error();
                            // 直接return 后续逻辑都不执行
                            return;
                        }
                    }
                    // 执行success方法
                    __options.success(responseText);
                } else if (/^(4|5)\d{2}$/.test(xhr.status)) {
                    // 如果是4或者5开头的 则说明服务器错误，直接执行error
                    // 失败
                    __options.error();
                }
            }
        };
        // 大于0 才执行超时逻辑,如果等于0 说明不执行超时逻辑
        if (__options.timeout > 0) {
            // 如果有这个属性 则支持超时
            if ('ontimeout' in xhr) {
                xhr.timeout = __options.timeout;
                xhr.ontimeout = function () {
                    xhr.error();
                }
            } else {
                setTimeout(function () {
                    // 如果超时之后事务还没有完成，则强制终止该事务
                    if (xhr.readyState !== 4) {
                        // 终止ajax事务
                        xhr.abort();
                        __options.error();
                    }
                }, __options.timeout);
            }
        }
        // ajax第四步 发送http request
        xhr.send(__options.data);
    };


    var tool = {
        // 利用惰性函数，获取当前浏览器最合适的ajax对象
        getXHR: (function () {
            var list = [function () {
                return new XMLHttpRequest();
            }, function () {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }, function () {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }];
            var i = 0, len = list.length, item;
            for (; i < len; i++) {
                try {
                    // 如果这里不报错，则break，item就为当前浏览器最合适的那个ajax对象
                    item = list[i];
                    item();
                    break;
                } catch (e) {
                    item = null;
                    continue;
                }
            }
            // 判断item是否为null，如果为null，这四种对象浏览器都不支持
            if(item===null){
                throw new Error('当前浏览器不支持ajax功能');
            }
            return item;
        })(),
        // 循环帮助函数
        each: (function () {
            // 数组的原型链上是否含有forEach
            if ([].forEach) {
                /**
                 * @param {Object|Array} list  需要循环的数组或类数组
                 * @param {Function} 回调函数
                 * @param {Object} 回调函数的上下文对象
                 */
                return function (list, callback, context) {
                    [].forEach.call(list, callback, context);
                }
            }
            return function (list, callback, context) {
                var l = list.length;
                while (l--) {
                    callback.call(context, list[i], i, list);
                }
            }
        })(),
        // 循环给tool动态添加判断数据类型的方法
        init: function () {
            this.each(['String', 'Array', 'Object'], function (item) {
                this['is' + item] = isType(item);
            }, this);

            //tool['isString'] = isType('String');
            //tool['isArray'] = isType('Array');
            //tool['isObject'] = isType('Object');
        },
        /**
         * 迭代器，可以循环对象也可以循环数组
         * @param collections {Object|Array} 需要循环的对象或数组与类数组
         * @param callback {Function} 回调函数
         * @param context {Object} 回调函数中的上下文对象
         */
        iteration: function (collections, callback, context) {
            // 先判断是否为一个纯正的对象
            if (this.isPureObject(collections)) {
                for (var name in collections) {
                    // 当该字段是原型链上的属性时，跳过本次循环
                    if (!collections.hasOwnProperty(name)) {
                        continue;
                    }
                    callback.call(context, name, collections[name]);
                }
                return;
            }
            this.each(collections, callback, context);
        },
        /**
         * 判断是否为纯正的对象
         * @param obj {Object} 需要判断的参数
         * @returns {*|boolean}
         */
        isPureObject: function (obj) {
            return this.isObject(obj) && obj.constructor === Object;
        },
        /**
         * 判断参数中是否含有问号，并拼接返回
         * @param url {String} url
         * @param padString {String} 需要往url后面拼接的参数
         * @returns {string} 拼接好的url
         */
        hasSearch: function (url, padString) {
            // 拼接url参数 注意什么时候拼接& 什么时候拼接？
            return url + (/\?/.test(url) ? '&' : '?') + padString;
        },
        /**
         * 把json字符串格式化成json对象
         * @param jsonString {String} json字符串
         * @returns {*} 格式化好的JSON对象
         */
        JSONParse: function (jsonString) {
            if (JSON) {
                return JSON.parse(jsonString)
            }
            //return eval('(' + jsonString + ')');
            return (new Function('return ' + jsonString))();
        }
    };
    /**
     * 利用闭包实现一个判断类型的函数
     * @param type {String} 数据类型
     * @returns {Function} 用于判断类型的函数
     */
    var isType = function (type) {
        return function (object) {
            return Object.prototype.toString.call(object) === '[object ' + type + ']';
        }
    };
    /**
     * 开始往tool上动态添加判断数据类型的方法
     */
    tool.init();
})();



/*
var isType = function (type) {
    return function (object) {
        return Object.prototype.toString.call(object) === '[object ' + type + ']';
    }
};

var isString=isType('String');
isString=function (object) {
    return Object.prototype.toString.call(object) === '[object String]';
};
isString('');
function ('') {
    return Object.prototype.toString.call('') === '[object String]';
};*/
