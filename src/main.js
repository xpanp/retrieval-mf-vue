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


// 引入组件
import CommentImage from './components/CommentImage.vue'
import BarPrecess from './components/BarPrecess.vue'
import VueCropper from 'vue-cropper'
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
app.use(VueCropper)
app.use(ElementPlus)
app.mount('#app')