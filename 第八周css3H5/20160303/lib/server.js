var http = require("http");
var url = require("url");
var fs = require("fs");

var point = "1001";
var server = http.createServer(function (request, response) {
    //->request.url获取的是客户端向服务器端请求的地址,包含了问号传递进来的参数
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname;
    var content = null;

    //->如果客户端请求的是http://localhost:1001/index.html,我们把服务器的index.html文件返回给前端进行渲染
    if (pathname === "/index.html") {
        content = fs.readFileSync("." + pathname, "utf8");
        response.writeHead(200, {'content-type': 'text/html'});
        response.end(content);
        return;
    }

    //->写我们数据请求的接口

    //1)获取用户列表的接口
    if (pathname === "/getInfo") {
        content = fs.readFileSync("./userList.json", "utf8");
        response.writeHead(200, {'content-type': 'application/json'});
        response.end(content);
        return;
    }

    //2)增加先的用户信息
    if (pathname === "/addInfo") {
        //->先把客户端发送给服务器的参数获取到
        var userName = urlObj.query.userName;
        var userAge = urlObj.query.userAge;

        //->把数据存储到userList.json中
        content = fs.readFileSync("./userList.json", "utf8");
        content = JSON.parse(content);

        content.count++;
        var userId = content.count;
        content.list.push({
            id: userId,//->新增加用户的ID和总数量是一致的
            userName: userName,
            userAge: userAge
        });

        content = JSON.stringify(content);
        fs.writeFileSync("./userList.json", content, "utf8");

        //->把当前用户的详细信息返回给前端
        response.writeHead(200, {'content-type': 'application/json'});
        response.end(JSON.stringify({
            "id": userId,
            "userName": userName,
            "userAge": userAge
        }));
        return;
    }

    //3)删除的接口
    if (pathname === "/delInfo") {
        userId = urlObj.query.id;
        content = fs.readFileSync("./userList.json", "utf8");
        content = JSON.parse(content);

        content.count--;
        var ary = content.list;
        for (var i = 0; i < ary.length; i++) {
            if (ary[i].id == userId) {
                ary.splice(i, 1);
                break;
            }
        }

        content = JSON.stringify(content);
        fs.writeFileSync("./userList.json", content, "utf8");

        response.writeHead(200, {'content-type': 'application/json'});
        response.end(JSON.stringify({
            "code": 0,
            "message": "删除成功"
        }));
        return;
    }

    //->如果不是以上的地址访问,让浏览器渲染404页面
    response.writeHead(404, {'content-type': 'text/html'});
    response.end(fs.readFileSync("./error.html", "utf8"));
});
server.listen(point, function () {
    console.log("当前 [ " + point + " ] 端口已经开启!");
});

