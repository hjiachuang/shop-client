<template>
  <a-spin :spinning="spinning">
    <div class="user-info-detail">
      <a-row :gutter="[15, 15]">
        <a-col :sm="12" :lg="6">
          <a-card class="statistic-item">
            <a-statistic title="提交订单数" :value="detail.orderSum" />
          </a-card>
        </a-col>
        <a-col :sm="12" :lg="6">
          <a-card class="statistic-item">
            <a-statistic title="成交订单数" :value="detail.orderDone" />
          </a-card>
        </a-col>
        <a-col :sm="12" :lg="6">
          <a-card class="statistic-item">
            <a-statistic title="消费金额数" :value="detail.orderMoney" />
          </a-card>
        </a-col>
        <a-col :sm="12" :lg="6">
          <a-card class="statistic-item">
            <a-statistic title="加入购物车" :value="detail.cartSum" />
          </a-card>
        </a-col>
      </a-row>
      <a-button type="primary" style="margin-top: 30px;" v-if="!edit" @click="edit = true">编辑</a-button>
      <a-button type="default" style="margin-top: 30px; background: #11b95c; color: #ffffff;" v-else @click="editClick" :loading="editLoading">保存</a-button>
      <a-form
        :model="formData"
        :labelCol="labelCol"
        labelAlign="left"
        style="margin-top: 20px"
      >
        <a-form-item label="ID">
          <span>{{formData.id}}</span>
        </a-form-item>
        <a-form-item label="头像">
          <a-image :src="formData.avatar" width="80" height="80" fallback="/images/fallback.png" />
        </a-form-item>
        <a-form-item label="昵称">
          <span v-if="!edit">{{formData.nickname}}</span>
          <a-input v-else v-model:value="formData.nickname" />
        </a-form-item>
        <a-form-item label="姓名">
          <span v-if="!edit">{{formData.name}}</span>
          <a-input v-else v-model:value="formData.name" />
        </a-form-item>
        <a-form-item label="性别">
          <span v-if="!edit">{{formData.gender === '1'? '男': '女'}}</span>
          <a-select
            v-else
            v-model:value="formData.gender"
            style="width: 120px"
          >
            <a-select-option value="1">男</a-select-option>
            <a-select-option value="2">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="手机号码">
          <span v-if="!edit">{{formData.mobile}}</span>
          <a-input v-else v-model:value="formData.mobile" />
        </a-form-item>
        <a-form-item label="注册时间">
          <span>{{formData.register_time}}</span>
        </a-form-item>
        <a-form-item label="最近登录">
          <span>{{formData.last_login_time}}</span>
        </a-form-item>
        <a-form-item label="登录IP">
          <span>{{formData.last_login_ip}}</span>
        </a-form-item>
      </a-form>
    </div>
  </a-spin>
</template>

<script>

export default {
  name: 'UserInfoDetail',
  data () {
    return {
      spinning: false,
      edit: false,
      editLoading: false,
      detail: {},
      labelCol: {
        sm: {
          span: 4
        },
        lg: {
          span: 3
        }
      },
      formData: {}
    }
  },
  methods: {
    async getUserDetail (id) {
      this.spinning = true
      const response = await this.$axios({
        method: this.$api.GET_USER_DETAIL.method,
        url: this.$api.GET_USER_DETAIL.url,
        params: {
          id
        }
      })
      this.detail = response.data
      this.formData = response.data.userInfo
      this.spinning = false
    },
    async editClick () {
      this.editLoading = true
      try {
        await this.$axios({
          method: this.$api.POST_UPDATE_USER_DETAIL.method,
          url: this.$api.POST_UPDATE_USER_DETAIL.url,
          data: this.formData
        })
        this.edit = false
        this.editLoading = false
      } catch (err) {
        console.log(err)
        this.editLoading = false
      }
    }
  },
  mounted () {
    const { id } = this.$route.query
    if (id === undefined) {
      this.$router.push('/user')
    } else {
      this.getUserDetail(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.statistic-item {
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
</style>
