import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementIcons from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // 和日期组件的汉化有关
import 'element-plus/dist/index.css'

import {} from '@/assets/js/window'
import App from '@/components/framework/App.vue'
import router from '@/router/index'
import '@/assets/css/common.css' // 全局样式

const app = createApp(App)

// 错误捕捉
app.config.errorHandler = (err) => {
  console.error(err)
}

// 挂载到vue
// app.config.globalProperties.xxx = xxx

// 注册icon
for (const [key, component] of Object.entries(ElementIcons)) {
  app.component(key, component)
}

app.use(ElementPlus, {locale: zhCn, size: 'large'})
app.use(router)
app.mount('#app')
