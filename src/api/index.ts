import { App } from 'vue'
import http from '@/utils/request'
import { httpUpload } from '@/utils/upload'

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
  },
  httpUpload(data?: any) {
    return http.request({
      url: '/upload',
      method: 'post',
      data
    })
  },
  getTable(data?: any) {
    return http.request({
      url: '/demo/table',
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
