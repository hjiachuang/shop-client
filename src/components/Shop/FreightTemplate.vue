<template>
  <a-spin :spinning="spinning">
    <div class="shop-freight-template">
      <a-table
        :data-source="template"
        :pagination="false"
        :rowKey="(row) => row.id"
        >
        <template #title>
          <h3>运费模板列表</h3>
          <a-button type="primary" @click="edit('add')">添加</a-button>
        </template>
        <a-table-column key="id" title="ID" data-index="id" :width="80" />
        <a-table-column key="name" title="名字" data-index="name" />
        <a-table-column key="shipper_name" title="快递公司" data-index="shipper.name" />
        <a-table-column key="package_price" title="包装费" data-index="package_price" />
        <a-table-column key="freight_type" title="按件/按重" data-index="freight_type">
          <template #default="{ text: freight_type }">
            {{freight_type === 0 ? '按件' : '按重'}}
          </template>
        </a-table-column>
        <a-table-column key="status" title="状态" data-index="status">
          <template #default="{ record }">
            <span v-if="record.shipper.enabled === 0">
              <span style="margin-right: 6px">不可用</span>
              <a-tooltip title="快递已停用，请先启用快递" color="#f50">
                <InfoCircleOutlined style="color: #f50" />
              </a-tooltip>
            </span>
            <span v-else>可用</span>
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作">
          <template #default="{ record }">
            <a-button v-if="record.shipper.enabled === 1" type="primary" @click="edit('edit', record)" style="margin-right: 20px;">编辑</a-button>
            <a-button type="danger" @click="edit('delete', record)">删除</a-button>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </a-spin>
</template>

<script>
import {
  InfoCircleOutlined
} from '@ant-design/icons-vue'
export default {
  name: 'ShopFreightTemplate',
  components: { InfoCircleOutlined },
  data () {
    return {
      spinning: false,
      template: []
    }
  },
  methods: {
    async getFreightTemplate () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_FREIGHT_TEMPLATE.method,
          url: this.$api.GET_FREIGHT_TEMPLATE.url
        })
        this.template = response.data.template
        this.spinning = false
      } catch (err) {
        console.log('获取运费模板失败。[getFreightTemplate]', err)
        this.spinning = false
      }
    },
    async edit (type, data = null) {
      if (type === 'delete') {
        this.$modal.confirm({
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          maskClosable: true,
          content: '确定删除运费模板?',
          onOk: async () => {
            this.spinning = true
            try {
              await this.$axios({
                method: this.$api.DELETE_FREIGHT_TEMPLATE.method,
                url: this.$api.DELETE_FREIGHT_TEMPLATE.url,
                params: {
                  id: data.id
                }
              })
              this.getFreightTemplate()
              this.spinning = false
            } catch (err) {
              console.log('删除运费模板失败。[edit->delete]', err)
              this.spinning = false
            }
          }
        })
      } else {
        let id = ''
        if (type === 'edit') {
          id = data.id
        }
        this.$router.push('/freight/edit?id=' + id)
      }
    }
  },
  mounted () {
    this.getFreightTemplate()
  }
}
</script>

<style lang="scss" scoped>
.shop-freight-template {
  padding: 20px;
  background: #fff;
}
</style>
