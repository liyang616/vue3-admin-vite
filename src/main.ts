import App from './App.vue'
import router from './router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { setupStore } from '@/store'
import i18n from '@/i18n/index'
import { getPlatformConfig } from './config'
import { MotionPlugin } from '@vueuse/motion'
import { createApp, type Directive } from 'vue'
import { injectResponsiveStorage } from '@/utils/responsive'
import * as echarts from 'echarts'
const app = createApp(App)

// viewer图片预览
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
app.use(Viewer)

// 引入重置样式
import './style/reset.scss'
// 导入公共样式
import './style/index.scss'
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import './style/tailwind.css'
// 导入字体图标
import './assets/iconfont/iconfont.js'
import './assets/iconfont/iconfont.css'

// api接口
import { ApiPlugin } from '@/api/index'
app.use(ApiPlugin)

// echarts
app.config.globalProperties.$echarts = echarts

// 自定义指令
import * as directives from '@/directives'
Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key])
})

// 全局注册@iconify/vue图标库
import { IconifyIconOffline, IconifyIconOnline, FontIcon } from './components/ReIcon'
app.component('IconifyIconOffline', IconifyIconOffline)
app.component('IconifyIconOnline', IconifyIconOnline)
app.component('FontIcon', FontIcon)

// 全局注册按钮级别权限组件
import { Auth } from '@/components/ReAuth'
import { Perms } from '@/components/RePerms'
app.component('Auth', Auth)
app.component('Perms', Perms)

// 全局注册vue-tippy
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import VueTippy from 'vue-tippy'
app.use(VueTippy)

// 全局变量--语言
app.config.globalProperties.$language = ref<string>(localStorage.getItem('language') || 'zh-CN')
app.use(i18n)

// table满屏，最佳高度
app.config.globalProperties.$tableHeight = document.documentElement.clientHeight - 220

// 判断是否为手机端
const flag = navigator.userAgent.match(
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
)
flag ? (app.config.globalProperties.$isMobile = true) : (app.config.globalProperties.$isMobile = false)

getPlatformConfig(app).then(async (config) => {
  setupStore(app)
  app.use(router)
  await router.isReady()
  injectResponsiveStorage(app, config)
  app.use(MotionPlugin)
  // .use(PureDescriptions)
  // .use(useEcharts);
  app.mount('#app')
})
