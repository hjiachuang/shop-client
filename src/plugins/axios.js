import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '../router/index'
import cookie from '../utils/cookie'

axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || ''
// axios.defaults.headers.common.Authorization = `Bearer ${token}` || ''
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${cookie.getCookie('token')}` || ''
    config.headers['x-csrf-token'] = cookie.getCookie('csrfToken')
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  (response) => {
    if (response.status && response.status === 200 && response.data.error !== 0) {
      message.error(response.data.msg)
      return Promise.reject(response.data)
    }
    if (response.data.data.msg) {
      message.success(response.data.data.msg)
    }
    return response.data
  },
  (error) => {
    if (error.response.status === 504 || error.response.status === 404) {
      message.error('服务器被吃了( ╯□╰ )')
    } else if (error.response.status === 403) {
      message.error('权限不足，请联系管理员')
    } else if (error.response.status === 401) {
      message.error(error.response.data.msg ? error.response.data.msg : '登录失效，请重新登录')
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.value.fullPath
        }
      })
    } else {
      if (error.response.data.msg) {
        message.error(error.response.data.msg)
      } else {
        message.error('未知错误!')
      }
    }
    return Promise.reject(error)
  }
)

export default _axios
