import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'
import NProgress from './progress'

class HttpRequest {
  private readonly baseUrl: string
  constructor() {
    this.baseUrl = import.meta.env.VITE_BASE_URL
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl, // 所有的请求地址前缀部分(没有后端请求不用写)
      timeout: 80000 // 请求超时时间(毫秒)
      // withCredentials: true,// 跨域请求时发送cookies
      // headers: {
      // 设置后端需要的传参类型
      // 'Content-Type': 'application/json',
      // 'token': x-auth-token',//一开始就要token
      // 'X-Requested-With': 'XMLHttpRequest',
      // },
    }
    return config
  }

  // 请求拦截
  interceptors(instance: AxiosInstance, url: string | number | undefined) {
    instance.interceptors.request.use(
      (config) => {
        // 开启进度条动画
        NProgress.start()

        // 请求头携带token
        const token: string | undefined = Cookies.get('authorized-token')
        if (token) {
          config.headers['authorized-token'] = token
        }

        // 上传接口使用multipart/form-data
        if (config.url == '/upload') {
          config.headers['Content-Type'] = 'multipart/form-data'
        }

        return config
      },
      (error: any) => {
        return Promise.reject(error)
      }
    )
    //响应拦截
    instance.interceptors.response.use(
      (res) => {
        // 关闭进度条动画
        NProgress.done()

        //返回数据
        const { data } = res

        // 登录失效
        if (data.status == 2001) {
          ElMessageBox.confirm('登录失效，请重新登入', '提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              location.reload()
            })
            .catch(() => {})
          return
        }

        // 业务code
        if (data.code !== 200) {
          // 业务异常
          ElMessage({
            message: data.msg || 'Error',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        return data
      },
      (error: any) => {
        // 关闭进度条动画
        NProgress.done()

        if (error.statusCode == 401) {
          // 无权限，去401页面
          router.push('/401')
        } else if (error.statusCode == 404) {
          // 404页面
          router.push('/404')
        } else {
          // 其他异常，抛提示信息
          ElMessage({
            message: error.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
        return Promise.reject(error)
      }
    )
  }

  request(options: AxiosRequestConfig) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

const http = new HttpRequest()
export default http
