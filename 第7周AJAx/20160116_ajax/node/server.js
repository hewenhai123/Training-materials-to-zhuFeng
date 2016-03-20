// 指定的端口
var PORT = 3000;

// 加载需要依赖的模块
var http = require('http');
var url = require('url');
var fs = require('fs');
var mine = require('./mime').types;
var path = require('path');
var info = require('./getInfo');
var curd = require('./curd');
var querystring = require('querystring');
// 创建http服务器
var server = http.createServer(function (request, response) {
    // 得到url信息
    var urlObject = url.parse(request.url, true);
    // 拿到请求的虚拟路径
    var pathname = urlObject.pathname;
    if (pathname === '/getInfo') {
        return info(urlObject.query.type, response);
    }
    if (pathname === '/getStudentsInfo') {

        if (/(get|delete)/ig.test(request.method)) {
            curd(request.method, urlObject.query, payload, response);
        } else {
            var chunk = '', payload = null;
            request.on('data', function (data) {
                chunk += data;
            });
            request.on('end', function () {
                payload = chunk;
                console.log(chunk);
                curd(request.method, urlObject.query,querystring.parse(payload) , response);
            });
        }

        return;
    }
    // 拿到请求文件的真实路径
    var realPath = path.join("../", pathname);
    // 拿到请求资源的后缀名
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    // 判断请求的文件在服务器上存在不存在
    fs.exists(realPath, function (exists) {
        // 如果不存在就返回404
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            // 如果存在，则读取文件
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    // 读取文件失败，服务器内部错误
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    // 文件读取成功
                    // 判断有没有指定的后缀名，如果没有就设置为ascii文本
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    // 发送response主体
                    response.end();
                }
            });
        }
    });
});
// 本机监听指定端口
server.listen(PORT);
// 如果监听成功就会打印日志
console.log("Server runing at port: " + PORT + ".");


