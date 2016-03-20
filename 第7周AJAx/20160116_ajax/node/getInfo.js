/**
 * Created by 银鹏 on 2016/1/16.
 */
var food = require('./food.json');
var use = require('./use.json');
var all = {errno: 0, items: food.items.concat(use.items)};
var getInfo = function (type, response) {
    response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
    if (type == 1) {
        response.end(JSON.stringify(food))
    } else if (type == 2) {
        response.end(JSON.stringify(use))
    } else {
        response.end(JSON.stringify(all));
    }
};
module.exports = getInfo;