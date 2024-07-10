
// 本地浏览器数据存储
const storage = {
  Set(key, value) {
    localStorage.setItem(key, value)
  },
  Get(key) {
    return localStorage.getItem(key) ?? ""
  },
  SetJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  GetJson(key) {
    let val = this.Get(key)
    if (val == "") {
      return {}
    }
    try {
      return JSON.parse(val)
    } catch (e) {
      console.error("JSON解析出错", e, val)
      return {}
    }
  },
  Remove(key) {
    localStorage.removeItem(key);
  }
}

export default storage