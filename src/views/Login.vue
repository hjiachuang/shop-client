<template>
  <div>
    <a-spin tip="Loading..." size="large" :spinning="loading">
    <a-form
    class="loginContainer"
    ref="loginRef"
    :model="loginForm"
    :rules="loginRules"
    :wrapper-col="{span: 24}"
  >
    <h3 class="loginTitle">系统登录</h3>
    <a-form-item name="username" has-feedback>
      <a-input size="large" v-model:value="loginForm.username" placeholder="Username">
        <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input>
    </a-form-item>
    <a-form-item name="password" has-feedback>
      <a-input-password size="large" v-model:value="loginForm.password" type="password" placeholder="Password">
        <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input-password>
    </a-form-item>
    <a-form-item name="code" has-feedback>
      <a-input size="large" v-model:value="loginForm.code" placeholder="点击图片更换验证码">
        <template #prefix><SafetyCertificateOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-image :src="codeUrl" :preview="false" @click.prevent="updateVerifyCode" style="cursor: pointer"></a-image>
    </a-form-item>
    <a-form-item>
      <a-button
        block
        size="large"
        type="primary"
        html-type="submit"
        @click="onSubmit"
      >
        登录
      </a-button>
    </a-form-item>
  </a-form>
  </a-spin>
  </div>
</template>

<script>
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import { reactive, ref, onMounted } from 'vue'
import axios from '../plugins/axios'
import API from '../utils/api'
import { svgToBase64 } from '../utils/svg'

export default {
  name: 'Login',
  components: {
    UserOutlined,
    LockOutlined,
    SafetyCertificateOutlined
  },
  setup () {
    const loading = ref(false)
    const loginRef = ref()
    const loginForm = reactive({
      username: '',
      password: '',
      code: ''
    })
    const loginRules = {
      username: [{
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
      }],
      password: [{
        required: true,
        message: '请输入密码',
        trigger: 'blur'
      }],
      code: [{
        required: true,
        message: '请输入验证码',
        trigger: 'blur'
      }, {
        min: 4,
        max: 4,
        message: '验证码错误',
        trigger: 'blur'
      }
      ]
    }
    const codeUrl = ref('')
    const updateVerifyCode = async () => {
      loading.value = true
      const verifyCode = await axios({
        method: API.GET_VERIFY_CODE.method,
        url: API.GET_VERIFY_CODE.url
      })
      codeUrl.value = svgToBase64(verifyCode.data)
      loading.value = false
    }
    onMounted(async () => {
      loading.value = true
      const verifyCode = await axios({
        method: API.GET_VERIFY_CODE.method,
        url: API.GET_VERIFY_CODE.url
      })
      codeUrl.value = svgToBase64(verifyCode.data)
      loading.value = false
    })
    return {
      loading,
      loginRef,
      loginForm,
      loginRules,
      codeUrl,
      updateVerifyCode
    }
  },
  methods: {
    async onSubmit () {
      this.loading = true
      try {
        const valid = await this.loginRef.validate()
        if (valid) {
          const resData = this.$encrypt.aesEncrypt(JSON.stringify({
            username: this.loginForm.username,
            password: this.$encrypt.passwordEncrypt(this.loginForm.password),
            code: this.loginForm.code
          }))
          const response = await this.$axios({
            method: this.$api.POST_LOGIN.method,
            url: this.$api.POST_LOGIN.url,
            data: {
              data: resData
            }
          })
          if (response) {
            // this.$store.commit('INIT_CURRENTHR', response.obj)
            this.$storage.setItem('userinfo', response.data.userInfo, 'user')
            const path = this.$route.query.redirect
            setTimeout(() => {
              this.loading = false
              this.$router.replace((path === undefined) ? '/' : path)
            }, 2000)
          } else {
            this.loading = false
            this.loginRef.resetFields()
            this.updateVerifyCode()
          }
        }
      } catch (err) {
        this.loading = false
        if (err.msg && err.msg === '验证码错误') {
          this.loginForm.code = ''
        } else {
          this.loginRef.resetFields()
        }
        this.updateVerifyCode()
      }
    }

  }
}
</script>

<style scoped lang="scss">
  .loginContainer {
    box-sizing: content-box;
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .loginTitle {
      margin: 15px auto 20px;
      text-align: center;
      color: #505458;
    }
  }
</style>
