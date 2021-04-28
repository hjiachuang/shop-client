import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 自定义
import axios from './plugins/axios'
import antd from './plugins/antd'
import 'ant-design-vue/dist/antd.css'
import encrypt from './utils/encrypt'
import cookie from './utils/cookie'
import storage from './utils/storage'
import api from './utils/api'

import './assets/css/common.scss'

const app = createApp(App)
app.use(router)

// 自定义
app.use(antd)
app.config.globalProperties.$axios = axios
app.config.globalProperties.$encrypt = encrypt
app.config.globalProperties.$cookie = cookie
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api

app.mount('#app')
