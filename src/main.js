import { createApp } from 'vue'
import './assets/base.scss'
import App from './App.vue'
//引入element plus
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入cookies
import VueCookies from 'vue-cookies'
import store from './store/index.js'
//引入图标
import './assets/icon/iconfont.css'
// 引入路由
import router from './router/index.js'
// 引入utils
import Verify from './utils/Verify.js'
import Message from './utils/Message.js'
import Request from './utils/Request.js'
// 引入指令
import { lazyLoad } from './directives/lazyLoad'
// 引入组件
import CommentImage from './components/CommentImage.vue'
import BarPrecess from './components/BarPrecess.vue'
const app = createApp(App)
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.Verify = Verify
app.config.globalProperties.Message = Message
app.config.globalProperties.Request = Request
app.config.globalProperties.globalInfo={
  imageUrl: '/api/file/getImage/'
}
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.component("CommentImage",CommentImage)
app.component("BarPrecess",BarPrecess)

app.use(router)
app.use(store)
app.use(ElementPlus)

// 防抖
app.directive('debounce', {
  mounted(el, binding) {
    // 至少需要回调函数以及监听事件类型
    if (typeof binding.value.fn !== 'function' || !binding.value.event) return;
    let delay = 1000; // 默认延迟时间
    el.timer = null;
    el.handler = function() {
      if (el.timer) {
        clearTimeout(el.timer);
        el.timer = null;
      };
      el.timer = setTimeout(() => {
        binding.value.fn.apply(this, arguments)
        el.timer = null;
      }, binding.value.delay || delay);
    }
    el.addEventListener(binding.value.event, el.handler)
  },
  // 元素卸载前也记得清理定时器并且移除监听事件
  beforeUnmount(el, binding) {
    if (el.timer) {
      clearTimeout(el.timer);
      el.timer = null;
    }
    el.removeEventListener(binding.value.event, el.handler)
  }
})

// 节流
app.directive('throttle', {
  mounted(el, binding) {
    // 至少需要回调函数以及监听事件类型
    if (typeof binding.value.fn !== 'function' || !binding.value.event) return;
    let delay = 200;
    el.timer = null;
    el.handler = function() {
      if (el.timer) return;
      el.timer = setTimeout(() => {
        binding.value.fn.apply(this, arguments)
        el.timer = null;
      }, binding.value.delay || delay);
    }
    el.addEventListener(binding.value.event, el.handler)
  },
  // 元素卸载前也记得清理定时器并且移除监听事件
  beforeUnmount(el, binding) {
    if (el.timer) {
      clearTimeout(el.timer);
      el.timer = null;
    }
    el.removeEventListener(binding.value.event, el.handler)
  }
})
// 图片懒加载
app.directive('lazyLoad',lazyLoad)
app.mount('#app')