/*
 使用NODEJS技术给前端要做的分页效果提供接口,前端告诉我当前每一页展示多少条信息,在告诉我当前是第几页,后台就在data.json中把需要的数据返回给前端
 1)提供一个数据获取的接口
 2)获取前端传递给后台的参数:每页多少条数据,当前是第几页
 3)后台到data.json中把对应的那些条数据返回给前端,前端接收到数据后实现绑定即可
 4)后台还需要告诉前端一共有多少页
 */

var http = require("http");
var url = require("url");
var fs = require("fs");

var server = http.createServer(function (request, response) {
    //->request.url获取前端请求的地址
    //->url.parse URL这个方法库中提供了一个parse的方法,把我们的URL地址进行解析
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname;
    var pathquery = urlObj.query;

    //->说明是请求数据的那个接口
    if (pathname === "/getInfo") {
        var count = pathquery.count;//->每页显示多少条
        var page = pathquery.page;//->当前是第几页

        var data = fs.readFileSync("./data.json", "utf8");//->把data.json中存储的所有的数据当做一个JSON字符串获取到
        data = JSON.parse(data);

        //->计算一共有多少页
        var totalPage = Math.ceil(data.length / count);

        //->根据传递的条数和页数,获取到具体需要的那些数据
        //count=10;  page=1;  索引0~9
        //count=10;  page=2;  索引10~19
        //count=10;  page=3;  索引20~29   (page-1)*count ~ page*count-1
        //count=10;  page=5;  索引40~49
        var ary = [];
        for (var i = (page - 1) * count; i <= page * count - 1; i++) {
            var cur = data[i];
            if (i > (data.length - 1)) {//->最后一页数据可能不到10条,如果我们获取的i的值已经比最大的索引还要大了,我们就让循环结束即可
                break;
            }
            ary.push(cur);
        }

        //->NODEJS服务器端开始向前端响应需要的数据
        var res = {
            "totalPage": totalPage,
            "list": ary
        };
        response.writeHead(200, {'content-type': 'application/json'});
        response.end(JSON.stringify(res));
        return;
    }


});
server.listen(8888);
//http://localhost:8888/getInfo?count=10&page=1