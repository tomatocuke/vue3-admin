
export default {
  // 拷贝到粘贴板
  Clipboard(content) {
    navigator.clipboard.writeText(content).then(_=>{
      alertSuccess('已复制')
    })
  },

  // 带保留小数的除法
  Div(a, b, decimal = 0) {
    if (b == 0) {
      return 0
    }
    let v = a / b 
    return v.toFixed(decimal);
  },

}

