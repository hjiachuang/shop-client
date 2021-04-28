<template>
  <a-spin :spinning="spinning">
    <div class="content-box">
      <a-form :label-col="{span: 24}" :wrapper-col="{span: 24}" ref="form" :model="setting">
        <a-form-item label="广告显示">
          <a-radio-group v-model:value="setting.banner">
            <a-radio :value="1">显示</a-radio>
            <a-radio :value="0">不显示</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="公告显示">
          <a-radio-group v-model:value="setting.notice">
            <a-radio :value="1">显示</a-radio>
            <a-radio :value="0">不显示</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submitShowSet">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'ShowSetting',
  data () {
    return {
      spinning: false,
      setting: {}
    }
  },
  methods: {
    async getShowSetting () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_SHOW_SETTING.method,
          url: this.$api.GET_SHOW_SETTING.url
        })
        this.setting = response.data.setting
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    async submitShowSet () {
      this.spinning = true
      try {
        await this.$axios({
          method: this.$api.SAVE_SHOW_SETTING.method,
          url: this.$api.SAVE_SHOW_SETTING.url,
          data: {
            setting: this.setting
          }
        })
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    }
  },
  mounted () {
    this.getShowSetting()
  }
}
</script>
