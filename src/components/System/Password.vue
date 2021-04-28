<template>
  <a-spin :spinning="spinning">
    <div class="content-box">
      <a-form ref="form" :model="formData" :rules="rules">
        <a-form-item label="旧密码" name="oldPassword">
          <a-input-password v-model:value="formData.oldPassword" placeholder="请输入旧密码" @keyup.enter="changePassword"></a-input-password>
        </a-form-item>
        <a-form-item label="新密码" name="newPassword">
          <a-input-password v-model:value="formData.newPassword" placeholder="请输入新密码" @keyup.enter="changePassword"></a-input-password>
        </a-form-item>
        <a-form-item label="确认密码" name="comfirmPassword">
          <a-input-password v-model:value="formData.comfirmPassword" placeholder="请再次输入新密码" @keyup.enter="changePassword"></a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" style="margin-right: 14px" @click="changePassword">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'Password',
  data () {
    return {
      spinning: false,
      formData: {
        oldPassword: '',
        newPassword: '',
        comfirmPassword: ''
      },
      rules: {
        oldPassword: [
          {
            required: true, message: '请输入旧密码', trigger: 'blur'
          },
          {
            min: 6, max: 16, message: '密码长度应在 6~16 之间', trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true, message: '请输入新密码', trigger: 'blur'
          },
          {
            min: 6, max: 16, message: '密码长度应在 6~16 之间', trigger: 'blur'
          }
        ],
        comfirmPassword: [
          {
            required: true, message: '请再次输入新密码', trigger: 'blur'
          },
          {
            min: 6, max: 16, message: '密码长度应在 6~16 之间', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async changePassword () {
      const userinfo = this.$storage.getItem('userinfo', 'user')
      if (userinfo) {
        try {
          await this.$refs.form.validate()
          if (this.formData.newPassword !== this.formData.comfirmPassword) {
            return this.$message.error('新密码和确认密码不一致')
          }
          if (this.formData.newPassword === this.formData.oldPassword) {
            return this.$message.error('旧密码和新密码不能一致')
          }
          this.spinning = true
          try {
            const resData = this.$encrypt.aesEncrypt(JSON.stringify({
              username: userinfo.username,
              oldPassword: this.$encrypt.passwordEncrypt(this.formData.oldPassword),
              newPassword: this.$encrypt.passwordEncrypt(this.formData.newPassword),
              comfirmPassword: this.$encrypt.passwordEncrypt(this.formData.comfirmPassword)
            }))
            await this.$axios({
              method: this.$api.CHANGE_PASSWORD.method,
              url: this.$api.CHANGE_PASSWORD.url,
              data: {
                data: resData
              }
            })
            this.spinning = false
          } catch (err) {
            console.log('发送ajax请求失败', err)
            this.spinning = false
            if (err.msg && err.msg === '旧密码错误') {
              this.formData.oldPassword = ''
            } else if (err.msg && err.msg === '新密码和确认密码不一致') {
              this.formData.newPassword = ''
              this.formData.comfirmPassword = ''
            }
          }
        } catch (err) {
          console.log('表单验证失败', err)
        }
      } else {
        this.$message.error('系统错误')
      }
    }
  }
}
</script>
