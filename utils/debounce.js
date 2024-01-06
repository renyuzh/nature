// // 防抖函数
let timer;
function debounce(fun, delay = 1000) {
    return function () {
      let ctx = this
      let args = arguments
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        timer = null
        fun.apply(ctx, args)
      }, delay)
    }
  }
  
  module.exports = debounce