import { App } from 'vue'
import http from '@/utils/request'

const Api = {
  getLogin(data?: any) {
    return http.request({
      url: '/login',
      method: 'post',
      data
    })
  },
  getAsyncRoutes(params?: any) {
    return http.request({
      url: '/get-async-routes',
      method: 'get',
      params
    })
  },
  getMenu(data?: any) {
    return http.request({
      url: '/menu',
      method: 'post',
      data
    })
  }
}

export const ApiPlugin = {
  install: (app: App) => {
    app.config.globalProperties.$api = Api
  }
}

export { Api }
