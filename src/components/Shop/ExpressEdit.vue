<template>
  <a-spin :spinning="spinning">
    <div class="shop-express-edit">
      <a-form :model="express" :rules="expressRules" ref="expressRef" hideRequiredMark :label-col="{span: 24}" :wrapper-col="{span: 24}">
        <a-form-item label="名字" name="name">
          <a-input v-model:value="express.name" placeholder="请输入快递公司名称" />
        </a-form-item>
        <a-form-item label="代号" name="code">
          <a-input v-model:value="express.code" placeholder="请输入快递公司代号" />
        </a-form-item>
        <a-form-item label="客户编号" name="CustomerName">
          <a-input v-model:value="express.CustomerName" placeholder="请输入快递公司客户编号" />
        </a-form-item>
        <a-form-item label="月结账号" name="MonthCode">
          <a-input v-model:value="express.MonthCode" placeholder="请输入快递公司月结账号" />
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="express.enabled">是否启用</a-checkbox>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="saveExpress">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'ShopExpressEdit',
  data () {
    return {
      spinning: false,
      express: {},
      expressRules: {
        name: [
          {
            required: true,
            message: '请输入快递公司名称',
            trigger: 'change'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入快递公司代号',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    async getExpressDetail (id) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_EXPRESS_DETAIL.method,
          url: this.$api.GET_EXPRESS_DETAIL.url,
          params: {
            id
          }
        })
        console.log(response)
        this.express = response.data.detail
        this.spinning = false
      } catch (err) {
        console.log('获取快递公司详情失败。[getExpressDetail]', err)
        this.spinning = false
      }
    },
    async saveExpress () {
      this.spinning = true
      try {
        await this.$refs.expressRef.validate()
        await this.$axios({
          method: this.$api.POST_EDIT_EXPRESS.method,
          url: this.$api.POST_EDIT_EXPRESS.url,
          data: {
            ...this.express
          }
        })
        this.spinning = false
        setTimeout(() => {
          this.$router.push('/express')
        }, 1000)
      } catch (err) {
        console.log('保存快递信息失败。[saveExpress]', err)
        this.spinning = false
      }
    }
  },
  mounted () {
    const { id } = this.$route.query
    if (id) {
      this.getExpressDetail(id)
    } else {
      this.express = {
        name: '',
        code: '',
        MonthCode: '',
        CustomerName: '',
        enabled: 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-express-edit {
  background: #fff;
  padding: 20px;
}
</style>
