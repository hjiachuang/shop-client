<template>
  <a-spin :spinning="spinning">
    <div class="shop-express-settings">
      <a-form :model="settings" :rules="settingsRules" ref="settingsRef" hideRequiredMark :label-col="{span: 24}" :wrapper-col="{span: 24}">
        <a-form-item label="寄件人" name="Name">
          <a-input v-model:value="settings.Name" placeholder="请输入寄件人姓名" />
        </a-form-item>
        <a-form-item label="联系电话" name="Tel">
          <a-input v-model:value="settings.Tel" placeholder="请输入寄件人联系电话" />
        </a-form-item>
        <a-form-item label="省份">
          <a-cascader v-model:value="settings.regionOptions" :options="region" style="width: 100%" placeholder="请选择寄件人地址">
            <template #displayRender="{ labels, selectedOptions }">
              <span v-for="(label, index) in labels" :key="selectedOptions[index].value">
                <span v-if="index === labels.length - 1">
                  {{ label }}
                </span>
                <span v-else>{{ label }} /</span>
              </span>
            </template>
          </a-cascader>
        </a-form-item>
        <a-form-item label="详细地址" name="Address">
          <a-input v-model:value="settings.Address" placeholder="请输入具体地址" />
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="settings.autoDelivery">打印后自动发货</a-checkbox>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="saveSettings">保存</a-button>
        </a-form-item>
      </a-form>
      <a-divider />
      <a-table
        :data-source="express"
        :pagination="false"
        :rowKey="(row) => row.id"
        >
        <template #title>
          <h3>快递公司列表</h3>
          <a-button type="primary" @click="expressEdit('add')">添加</a-button>
        </template>
        <a-table-column key="id" title="ID" data-index="id" :width="80" />
        <a-table-column key="name" title="名称" data-index="name" />
        <a-table-column key="code" title="代号" data-index="code" />
        <a-table-column key="CustomerName" title="客户编号" data-index="CustomerName" />
        <a-table-column key="MonthCode" title="月结账号" data-index="MonthCode" />
        <a-table-column key="enabled" title="状态" data-index="enabled">
          <template #default="{ text: enabled }">
            <span v-if="enabled === 1" style="color: rgb(102, 177, 255)">使用中</span>
            <span v-else>未使用</span>
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作">
          <template #default="{ record }">
            <a-button type="primary" @click="expressEdit('edit', record)">编辑</a-button>
            <a-button type="danger" @click="changeStatus(record)" style="margin-left: 20px;">{{record.enabled === 1 ? '停用' : '启用' }}</a-button>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'ShopExpressSettings',
  data () {
    return {
      spinning: false,
      region: [],
      regionOptions: [],
      settingsRules: {
        Name: [
          {
            required: true,
            trigger: 'change',
            message: '请输入寄件人姓名'
          }
        ],
        Tel: [
          {
            required: true,
            trigger: 'change',
            message: '请输入寄件人联系电话'
          }
        ],
        Address: [
          {
            required: true,
            trigger: 'change',
            message: '请输入具体地址'
          }
        ]
      },
      settings: {},
      express: []
    }
  },
  methods: {
    // 获取快递设置页内容
    async getExpressSettings () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_EXPRESS_SETTINGS.method,
          url: this.$api.GET_EXPRESS_SETTINGS.url
        })
        this.settings = response.data.settings
        this.settings.autoDelivery === 1 ? this.settings.autoDelivery = true : this.settings.autoDelivery = false
        this.express = response.data.express
        this.settings.regionOptions = []
        this.settings.regionOptions.push(
          response.data.settings.province_id,
          response.data.settings.city_id,
          response.data.settings.district_id
        )
        this.spinning = false
      } catch (err) {
        console.log('获取快递设置页内容失败。[getExpressSettings]', err)
        this.spinning = false
      }
    },
    // 获取所有城市列表
    async getAllRegion () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_ALL_REGION.method,
          url: this.$api.GET_ALL_REGION.url
        })
        this.region = response.data.region
        this.spinning = false
      } catch (err) {
        console.log('获取所有城市列表失败。[getAllRegion]', err)
        this.spinning = false
      }
    },
    // 保存设置
    async saveSettings () {
      this.spinning = true
      try {
        await this.$refs.settingsRef.validate()
        await this.$axios({
          method: this.$api.POST_SET_SETTINGS.method,
          url: this.$api.POST_SET_SETTINGS.url,
          data: {
            name: this.settings.Name,
            tel: this.settings.Tel,
            address: this.settings.Address,
            province_id: this.settings.regionOptions[0],
            city_id: this.settings.regionOptions[1],
            district_id: this.settings.regionOptions[2],
            autoDelivery: this.settings.autoDelivery === true ? 1 : 0
          }
        })
        this.getExpressSettings()
        this.spinning = false
      } catch (err) {
        console.log('保存设置失败。[saveSettings]', err)
        this.spinning = false
      }
    },
    // 跳转编辑页面
    async expressEdit (type, data = null) {
      let id = ''
      if (type === 'edit') {
        id = data.id
      }
      this.$router.push('/express/edit?id=' + id)
    },
    // 启用 / 停用快递
    changeStatus (data) {
      const status = data.enabled === 1 ? '停用' : '启用'
      this.$modal.confirm({
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        maskClosable: true,
        content: `确定${status}  ${data.name} ?`,
        onOk: async () => {
          this.spinning = true
          try {
            await this.$axios({
              method: this.$api.GET_CHANGE_EXPRESS_STATUS.method,
              url: this.$api.GET_CHANGE_EXPRESS_STATUS.url,
              params: {
                id: data.id,
                enabled: !data.enabled
              }
            })
            this.getExpressSettings()
            this.spinning = false
          } catch (err) {
            console.log('改变快递公司使用状态失败。[changeStatus]', err)
            this.spinning = false
          }
        }
      })
    }
  },
  mounted () {
    this.getExpressSettings()
    this.getAllRegion()
  }
}
</script>

<style lang="scss" scoped>
.shop-express-settings {
  background: #fff;
  padding: 20px;
}
</style>
