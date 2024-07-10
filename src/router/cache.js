// 路由缓存
import { ref } from 'vue'

export default {
  Cache: [],
  AddCache (componentName) {
    if (componentName && !this.Cache.includes(componentName)) {
      this.Cache.push(componentName)
    }
  },
  RemoveCache (componentName) {
    let index = this.Cache.indexOf(componentName)
    if (index > -1) {
      this.Cache.splice(index, 1)
    }
  }
}
