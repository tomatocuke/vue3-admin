import { ElMessage } from 'element-plus'

const base = '/api'

const Get = (url, params = null, headers = {}) => {
  if (params) {
    url += '?' + Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&')
  }

  return Request("GET", url, null, headers)
}

const Post = (url, data, headers = {}) => {
  headers = Object.assign({"Content-Type": "application/json"}, headers)
  return Request("POST", url, JSON.stringify(data), headers)
}

const Put = (url, data, headers = {}) => {
  headers = Object.assign({"Content-Type": "application/json"}, headers)
  return Request("PUT", url, JSON.stringify(data), headers)
}

const Delete = (url, data, headers = {}) => {
  headers = Object.assign({"Content-Type": "application/json"}, headers)
  return Request("DELETE", url, JSON.stringify(data), headers)
}

const Request = async (method, url, body, headers, args) => {

  const token = localStorage.getItem("token")
  if (token) {
    headers["token"] = token
  }

  // const controller = new AbortController()

  let req = {
    method: method,
    headers: headers,
    body: body,
    // signal: controller.signal,
    ...args,
  }

  let response = await fetch(base + url, req)

  // http状态码
  if (response.status !== 200) {
    if (response.status == 401) {
      setTimeout(_=>{
        location.href = "/login"
      }, 1000)
    } else if (response.status == 404) {
      ElMessage.error("接口不存在")
    } else {
      ElMessage.error("接口服务出错：" + response.status)
    }
    return null
  }

  if (response.headers.get("Content-Length") == "0") {
    ElMessage.error("接口未返回数据")
    return null
  }

  if (!response.headers.get("Content-Type").startsWith("application/json")) {
    return response.data
  }

  try {
    let data = await response.json()

    // 成功返回数据段
    if (data.code === 0 || data.success === true) {
      if (data.msg != "") {
        ElMessage.success(data.msg)
      }
      return json.data ?? {} // 返回有效值
    }

    ElMessage.warning(data.msg)
  } catch (e) {
    ElMessage.error("接口返回数据非JSON格式")
  }

  return null
}

export default {
  Get,
  Post,
  Put,
  Delete,
}