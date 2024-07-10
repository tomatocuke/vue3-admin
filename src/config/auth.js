import storage from "@/assets/js/storage";


let admin = storage.GetJson("admin")

let ok = Object.keys(admin).length > 0
let allow = {}
if (ok) {
  getpath(allow, {children: admin.menus}, 0)
  VITE_DEBUG && log("允许的页面和按钮权限", allow)
}

function getpath(obj, menu, level) {
  if (menu.path) { // 菜单权限
    obj[menu.path] = true
  } else if (menu.id) { // 按钮权限
    obj[menu.id] = true
  }

  if (menu.children && menu.children.length > 0) {
     menu.children.map(item => {
      getpath(obj, item, level + 1)
    })
  }
}


export default {
  // 是否登录
  isLogin: ok,
  // 信息
  info: ok ? admin.info : {},
  // 菜单
  menus: ok ? admin.menus : [],
  mainpage: ok && admin.menus.length > 0 ? admin.menus[0].path : "/home",
  // 登录者
  admin: admin,
  // 允许的页面和按钮权限
  allow: allow,
  // 获取token
  GetToken: () => { 
    if (ok && admin.token.expires_at > unix()) {
      return admin.token.token
    }
    return ""
  },
}