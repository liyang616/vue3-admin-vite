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
  getUserInfo(params?: any) {
    return http.request({
      url: '/userInfo',
      method: 'get',
      params
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
  },
  getRole(data?: any) {
    return http.request({
      url: '/role',
      method: 'post',
      data
    })
  },
  getUser(data?: any) {
    return http.request({
      url: '/user',
      method: 'post',
      data
    })
  },
  getAllRole(params?: any) {
    return http.request({
      url: '/all-role',
      method: 'get',
      params
    })
  },
  getAlioss(params?: any) {
    return http.request({
      url: '/alioss',
      method: 'get',
      params
    })
  }
}

export const ApiPlugin = {
  install: (app: App) => {
    app.config.globalProperties.$api = Api
  }
}

export { Api }
