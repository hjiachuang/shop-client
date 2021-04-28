<template>
  <a-spin :spinning="spinning">
    <div class="content-box">
      <a-form :label-col="{span: 24}" :wrapper-col="{span: 24}" ref="form" :rules="rules" :model="specification">
        <a-form-item label="型号名称" name="name">
          <a-input v-model:value="specification.name" placeholder="请输入型号名称" />
        </a-form-item>
        <a-form-item label="排序" name="sort_order">
          <a-input-number v-model:value="specification.sort_order" :min="1" :max="100"></a-input-number>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" size="large" @click="submit">保存</a-button>
          <a-button style="margin-left: 10px" size="large" @click="$router.go(-1)">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'AddSpecification',
  data () {
    return {
      spinning: false,
      rules: {
        name: [
          {
            required: true, message: '请输入分类名称', trigger: 'blur'
          }
        ]
      },
      specification: {
        name: '',
        sort_order: 1
      }
    }
  },
  methods: {
    async submit () {
      this.spinning = true
      try {
        await this.$refs.form.validate()
        await this.$axios({
          method: this.$api.POST_SAVE_SPECIFICATION.method,
          url: this.$api.POST_SAVE_SPECIFICATION.url,
          data: {
            specification: this.specification
          }
        })
        this.spinning = false
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    }
  }
}
</script>
