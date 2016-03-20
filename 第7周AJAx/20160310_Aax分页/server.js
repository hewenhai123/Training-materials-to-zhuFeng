var http = require("http");
var url = require("url");
var fs = require("fs");

var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname;
    var pathquery = urlObj.query;

    //->说明是请求数据的那个接口
    if (pathname === "/getInfo") {
        var count = pathquery.count;
        var page = pathquery.page;

        var data = fs.readFileSync("./data.json", "utf8");
        data = JSON.parse(data);
        var totalPage = Math.ceil(data.length / count);
        var ary = [];
        for (var i = (page - 1) * count; i <= page * count - 1; i++) {
            var cur = data[i];
            if (i > (data.length - 1)) {
                break;
            }
            ary.push(cur);
        }

        response.writeHead(200, {'content-type': 'application/json'});
        response.end(JSON.stringify(res));
        return;
    }

    //->为了保证前端的页面和后台的接口在同一个源下,我们前端的页面也让后台来进行渲染
    if (pathname === "/index.html") {
        var con = fs.readFileSync("./index.html", "utf8");
        response.writeHead(200, {'content-type': 'text/html'});
        response.end(con);
        return;
    }

    //->把详细页也进行渲染
    if (pathname === "/detail.html") {
        var con = fs.readFileSync("./detail.html", "utf8");
        response.writeHead(200, {'content-type': 'text/html'});
        response.end(con);
        return;
    }

    //->接口:告诉我num的值,我到data.json中把num对应的这条数据返回给客户端
    if (pathname === "/detailInfo") {
        var num = pathquery.num;
        con = fs.readFileSync("./data.json", "utf8");
        con = JSON.parse(con);

        var obj = null;
        for (var i = 0; i < con.length; i++) {
            var cur = con[i];
            if (cur.num == num) {
                obj = cur;
                break;
            }
        }

        response.writeHead(200, {'content-type': 'application/json'});
        response.end(JSON.stringify(obj));
        return;
    }
});
server.listen(8888);










