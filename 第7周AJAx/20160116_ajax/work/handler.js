/**
 * Created by 银鹏 on 2016/1/16.
 */
window.onload = function () {
    // 注册查询的逻辑
    infoQuery();
    // 注册添加的逻辑
    infoAdd();
    // 注册删除的逻辑
    infoDelete();
    // 注册修改的逻辑
    infoUpdate();
};

// ajax执行逻辑
function handle(method, data, callback, id) {
    var url = '/getStudentsInfo';
    if (id) {
        url += '?id=' + id;
    }
    ajax({
        url: url,
        method: method,
        data: data,
        cache: false,
        async: true,
        success: function (datas) {
            callback(datas);
        }, error: function () {
            callback({errno: 1});
        },
        dataType: 'json'
    })
}

var Restful = {
    /**
     * 添加
     * @param data {Object} 添加的数据
     * @param callback {Function} 回调函数
     */
    add: function (data, callback) {
        handle('put', data, callback);
    },
    /**
     * 删除
     * @param id {string} 删除的id
     * @param callback {Function} 回调函数
     */
    del: function (id, callback) {
        handle('delete', {id: id}, callback)
    },
    /**
     * 修改
     * @param id {string} 需要修改的id
     * @param data {Object} 需要修改的内容
     * @param callback {Function} 回调函数
     */
    update: function (id, data, callback) {
        handle('post', data, callback, id)
    },
    /**
     * 查询
     * @param id {string} 如果有值就是查询指定的。如果没有值就查询所有的内容
     * @param callback {Function} 回调函数
     */
    query: function (id, callback) {
        handle('get', {id: id}, callback)
    }
};

function infoAdd() {
    // 先拿到添加按钮
    var addBtn = document.querySelector('#C button');
    addBtn.onclick = function () {
        // 拿到3个内容input
        var name = document.querySelector('#C input[name="name"]');
        var age = document.querySelector('#C input[name="age"]');
        var _class = document.querySelector('#C input[name="class"]');
        // 3个input必须都有值,否则alert错误
        if (name.value && age.value && _class.value) {
            Restful.add({
                name: name.value || "",
                age: age.value || "",
                class: _class.value || ""
            }, function (data) {
                if (data.errno === 1) {
                    alert('add error')
                } else {
                    // 若成功，就清空dom内容
                    name.value = '';
                    age.value = '';
                    _class.value = '';
                }
            })
        } else {
            alert('请填写完整')
        }

    }
}

function infoQuery() {
    // 拿到查询按钮
    var queryBtn = document.querySelector('#S button');
    // 为了拼接内容，所以得拿到tbody
    var tbody = document.querySelector('#S tbody');
    queryBtn.onclick = function () {
        Restful.query('', function (data) {
            // data的errno为0则代表成功1为失败
            if (data.errno === 1) {
                alert('查询失败')
            } else {
                var fragement = document.createDocumentFragment();
                for (var i = 0; i < data.items.length; i++) {
                    var temp = data.items[i];
                    var tr = document.createElement('tr');
                    for (var n in temp) {
                        var td = document.createElement('td');
                        td.innerHTML = temp[n];
                        tr.appendChild(td);
                    }
                    fragement.appendChild(tr);
                }
                tbody.innerHTML = '';
                tbody.appendChild(fragement);
            }
        })
    }
}

function infoDelete() {
    // 先拿到dom结构
    var delBtn = document.querySelector('#D button');
    var id = document.querySelector('#D input');
    delBtn.onclick = function () {
        // 先判断有没有删除的id
        if (id.value) {
            Restful.del(id.value, function (data) {
                if (data.errno === 1) {
                    alert('删除失败')
                } else {
                    // 删除成功则清空dom内容
                    id.value = '';
                }
            })
        } else {
            alert('请填写要删除的学号')
        }

    }
}
/**
 * 最复杂的。
 * 涉及到两步。
 * 一）根据id拉取内容
 * 二）修改
 */
function infoUpdate() {
    // 拿到dom结构
    var queryBtn = document.querySelector('#U #select');
    var select = document.querySelector('#U #number-select');
    var _name = document.querySelector('#U input[name="name"]');
    var _age = document.querySelector('#U input[name="age"]');
    var _class = document.querySelector('#U input[name="class"]');
    var modified = document.querySelector('#U #modified');

    queryBtn.onclick = function () {
        // 这是第一步，如果有查询的id则执行query方法
        if (select.value) {
            Restful.query(select.value, function (data) {
                if (data.erron == 1) {
                    alert('查询信息失败')
                } else {
                    // 修改dom内容为服务器返回的数据
                    var ii = data.items[0];
                    if(ii){
                        _name.value = ii.name;
                        _age.value = ii.age;
                        _class.value = ii.class;
                    }else{
                        _name.value ='';
                        _age.value = '';
                        _class.value = '';
                    }

                }
            })
        } else {
            alert('请填写查询学号')
        }
    }
    modified.onclick = function () {
        // 这是第二步，修改内容
        // 先判断dom里有没有内容
        if (select.value && _name.value && _age.value && _class.value) {
            // 更新
            Restful.update(select.value, {
                name: _name.value,
                age: _age.value,
                class: _class.value
            }, function (data) {
                if (data.errno == 1) {
                    alert('修改失败')
                } else {
                    // 更新成功，就清空dom
                    _name.value = '';
                    _age.value = '';
                    _class.value = '';
                }
            })
        } else {
            alert('信息不完整，无法修改')
        }
    }
}