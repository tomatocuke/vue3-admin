
import { createRouter,createWebHistory } from 'vue-router'
import auth from '@/config/auth';

const routes = [
  // 未知页面跳转到主页
  // {
  //   path: '/:pathMatch(.*)',
  //   redirect: 
  // }

];

// 自动扫描文件夹加载路由
const modules = import.meta.glob(`@/view/**/*.vue`);

// 组件命名
const len = ("/src/view").length

Object.keys(modules).forEach(key => {
  let filename = key.slice(len, -4).toLowerCase()

  // 禁止index起名
  if (VITE_DEBUG && filename === "index") {
    alert("禁止文件起名index")
  }

  routes.push({
    path: filename,
    name: filename,
    component: () => {
      return modules[key]().then(res => {
        res.default.name = filename
        return res
      })
    },
    // meta: {}
  })

})


log("加载路由", routes)

const router =  createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    // 未登录
    if (!auth.GetToken()) {
      location.href = '/login'
      return
    }
    // 重定向
    if (to.path == '/') {
      next(auth.mainpage)
      return
    }
    // 非法拦截
    if (!auth.allow[to.path] && !to.path.endsWith('detail') ) {
      VITE_DEBUG && log("拦截非法路由", to.path)
      next(auth.mainpage)
      return
    }
  }

  next()
})

export default router
