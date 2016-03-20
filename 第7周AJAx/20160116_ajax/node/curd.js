/**
 * Created by 银鹏 on 2016/1/16.
 */
var tool = {
    getItem: function (id) {
        return studentsList.filter(function (item) {
            return item.id == id;
        })[0];
    },
    getIndex: function (id) {
        var item=this.getItem(id);
        return studentsList.indexOf(item);
    },
    obtainId: (function () {
        var id = 1;
        return function () {
            return id++;
        }
    })()
};

var studentsList = [];
var restful = function (httpMethod, data,payload, response) {
    httpMethod = httpMethod.toLowerCase();
    var result = {errno: 0, items: []};
    switch (httpMethod) {
        case 'delete':
            var d, index = tool.getIndex(data.id);
            if (index > -1) {
                d = studentsList.splice(index, 1);
            }
            if (!d) {
                result.errno = 1;
            }
            break;
        case 'put':
            payload.id = tool.obtainId();
            var origin = studentsList.length;
            studentsList.push(payload);
            if (studentsList.length != origin + 1) {
                result.errno = 1;
            }
            result.items=payload.id;
            break;
        case 'post':
            console.log(data.id);
            var item = tool.getItem(data.id);
            if (item) {
                for (var n in payload) {
                    item[n] = payload[n] || item[n];
                }
            }
            console.log('item',item);
            break;
        default :
            var item = null;
            if (data.id && (item = tool.getItem(data.id))) {
                result.items = [item]
            } else {
                result.items = studentsList;
            }
            break;
    }

    response.writeHead(200, {'content-type': 'application/json'});
    response.end(JSON.stringify(result));
};

module.exports = restful;