import http from '@/assets/js/http'

/************** 正常API使用http请求
export default  {
  Account: {
    Login: (data) => http.Post("/login", data),
    ChangePassword: (data) => http.Post("/change_password", data),
  },
  Home: {
    List: (data) => http.Get('/home/table', data),
    Echarts: (data) => http.Post('/home/echarts', data),
  },
  User: {
    List: (data) => http.Get('/customer/list', data),
    Create: (data) => http.Post('/customer/create', data),
    Update: (data) => http.Post('/customer/update', data),
    Delete: (data) => http.Post('/customer/delete', data),
  },
  Role: {
    Permission: () => http.Get('/permission/option'),
    List: (data) => http.Get('/role/list', data),
    Create: (data) => http.Post('/role/create', data),
    Update: (data) => http.Post('/role/update', data),
    Delete: (data) => http.Post('/role/delete', data),
  },
}*/



/************** 本地自己填写数据模拟http请求 */

// 模拟请求，{"code": 0, "msg": "", data: {} }
// 模拟请求，{"code": -1, "msg": "不OK", data: {} }
const Fake = async (req, data, time = 100) => {
  return await new Promise(resolve => {
    log("模拟发送api请求, 参数：", req)
    setTimeout(() => {
      if (data.code == 0) {
        if (data.msg) {
          alertSuccess(data.msg)
        }
        // 成功的情况下，只返回 data
        resolve(data.data ?? {})
        return
      }

      alertError(data.msg)
      resolve(null)
    }, time)
  })
}

const loginData = {
  code: 0,
  msg: "",
  data: {
    token: {
      token: '123456',
      expires_at: unix() + 600, // 十分钟后过期
    },
    info: {
      name: '昵称',
      account: '账号',
    },
    menus: [
      {id: 1, name: '首页', path: '/home', icon: 'House'},
      {id: 2, name: '用户管理', path: '', icon: 'User', children: [
        {id: 3, name: '用户1', path: '/user/user1', children: [{id: 4}, {id:5}]}, // 4新增/编辑 5删除
        {id: 7, name: '用户2', path: '/user/user2', children: [{id: 8}, {id: 15}]}, // 8删除 15测试选中
      ]},
      {id: 10, name: '系统设置', path: '', icon: 'Setting', children: [
        {id: 12, name: '参数配置', path: '/system/setting'},
        {id: 11, name: '角色管理', path: '/system/role', children: [{id: 13}, {id:14}]}, // 13新增/编辑 14删除
      ]},
    ]},
}


const userData = {
  code: 0,
  msg: "",
  data: {
    list: [
      {id: 1, name: '赵依依', age: 10, gender: 1, likes: ['音乐', '跳舞']},
      {id: 2, name: '钱尔尔', age: 20, gender: 2, likes: ['打游戏']},
    ],
    total: 2,
  },
}

const failData = {code: -1, msg: '失败', data: {}}

const charts = {
  code: 0,
  data: {
    date: ["2022-01-01", "2022-01-02", "2022-01-03", "2022-01-04", "2022-01-05", "2022-01-06", "2022-01-07"],
    list: [101, 102, 103, 104, 33, 66, 107],
  }
}


const permissions = {
  "code": 0,
  "msg": "",
  "data": [
      {
          "id": 1,
          "name": "首页",
      },
      {
          "id": 2,
          "name": "用户管理",
          "children": [
              {
                  "id": 3,
                  "name": "用户1",
                  "children": [
                    {
                        "id": 4,
                        "name": "新增/编辑"
                    },
                    {
                      "id": 5,
                      "name": "删除"
                    },
                  ] 
              },
              {
                "id": 7,
                "name": "用户2",
                "children": [
                  {
                      "id": 8,
                      "name": "新增/编辑"
                  },
                  {
                    "id": 9,
                    "name": "删除"
                  },
                ] 
            },
          ]
      },
      {
          "id": 10,
          "name": "系统设置",
          "children": [
              {
                  "id": 12,
                  "name": "参数设置",
              },
              {
                "id": 11,
                "name": "角色",
                "children": [
                  {
                      "id": 13,
                      "name": "新增/编辑"
                  },
                  {
                    "id": 14,
                    "name": "删除"
                  },
                ] 
              },
          ]
      }
  ]
}

export default  {
  Account: {
    Login: (data) => Fake(data, loginData),
    ChangePassword: (data) => Fake(data, {code: 0, "msg": "修改成功", data: {}}),
  },
  Home: {
    Echarts: (data) => Fake(data, charts),
  },
  User: {
    List: (data) => Fake(data, userData),
    Create: (data) => Fake(data, failData),
    Update: (data) => Fake(data, failData),
    Delete: (data) => Fake(data, {code: 0, msg: "删除成功"}),
  },
  Setting: {
    Get: (data) => Fake({code: 0, data: [{name: "设置1", value: "设置值1"}, {name: "设置2", value: "设置值2"}]}),
    Save: (data) => Fake(data, {code: 0, msg: "保存成功"}),
  },
  Role: {
    Permission: () => Fake(null, permissions),
    List: (data) => Fake(data, {code: 0, data: {total: 1, list: [{id: 1, name:'测试', permissions: [1,2,3]}]}}),
    Create: (data) => Fake(data, failData),
    Update: (data) => Fake(data, failData),
    Delete: (data) => Fake(data, failData),
  },
}



