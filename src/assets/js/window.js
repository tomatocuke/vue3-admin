// ##### 定义全局方法 ######
import { reactive, toRaw } from 'vue'
import { ElMessage } from 'element-plus'


// 声明为全局的
window.reactive = reactive

// 调试
window.log = (...args) => {
  let arr = []
  args.forEach(arg => {
    if (typeof arg === 'object') {
      arr.push(toRaw(arg))
    } else {
      arr.push(arg)
    }
  })
  console.log(...arr)
}

// 时间戳
window.unix = () => {
  return parseInt(Date.now() / 1000)
}

// 拷贝
window.copy = (src) => {
  if (Array.isArray(src)) {
    return Array.from(src)
  }
  if (typeof src === 'object') {
    return JSON.parse(JSON.stringify(src))
  }
  return src
}

// 解析参数
window.parseURL = () => {
  let urlParams = new URLSearchParams(window.location.search);
  let params = {};
  for (let [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  return params;
}

window.alertError = (msg) => {
  ElMessage.error(msg)
}

window.alertSuccess = (msg) => {
  ElMessage.success(msg)
}

window.alertWarning = (msg) => {
  ElMessage.warning(msg)
}