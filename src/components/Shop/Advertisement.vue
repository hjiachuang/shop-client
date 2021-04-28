<template>
  <a-spin :spinning="spinning">
    <div class="content-box">
      <a-button type="primary" @click="$router.push('/advertisement/edit/')">添加广告</a-button>
      <a-table
      :data-source="advertisement"
      :pagination="tablePagination"
      :rowKey="(row) => row.id"
      style="margin-top: 10px"
    >
      <a-table-column key="id" title="ID" data-index="id" :width="80" />
      <a-table-column key="image" title="图片" data-index="image_url">
        <template #default="{ text: image }">
          <a-image
            :src="image"
            fallback="/images/fallback.png"
            :preview="false"
            alt="头像"
            :width="60"
            :height="60"
          ></a-image>
        </template>
      </a-table-column>
      <a-table-column key="goods_id" title="关联商品" data-index="goods_id" />
      <a-table-column key="end_time" title="结束时间" data-index="end_time" />
      <a-table-column key="sort_order" title="排序">
        <template #default="{ record }">
          <a-input-number v-model:value="record.sort_order" :min="1"></a-input-number>
        </template>
      </a-table-column>
      <a-table-column key="enabled" title="状态">
        <template #default="{ record }">
          {{record.enabled === true? '启用': '禁用'}}
        </template>
      </a-table-column>
      <a-table-column key="enabledSwitch" title="切换状态">
        <template #default="{ record }">
          <a-switch v-model:checked="record.enabled" @change="changeStatus(record)"></a-switch>
        </template>
      </a-table-column>
      <a-table-column key="action" title="操作">
        <template #default="{ record }">
          <a-button type="primary" @click="$router.push(`/advertisement/edit?id=${record.id}`)">编辑</a-button>
          <a-button type="danger" @click="deleteAd(record)" style="margin-left: 10px">删除</a-button>
        </template>
      </a-table-column>
    </a-table>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'Advertisement',
  data () {
    return {
      spinning: false,
      advertisement: [],
      tablePagination: {
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        total: 0,
        onChange: (page) => this.getAd(page)
      }
    }
  },
  methods: {
    async getAd (page) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_ADVERTISEMENT.method,
          url: this.$api.GET_ADVERTISEMENT.url,
          params: {
            page
          }
        })
        this.advertisement = response.data.advertisement
        this.tablePagination.total = response.data.total
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    async changeStatus (data) {
      this.spinning = true
      try {
        await this.$axios({
          method: this.$api.CHANGE_ADVERTISEMENT_STATE.method,
          url: this.$api.CHANGE_ADVERTISEMENT_STATE.url,
          data: {
            id: data.id,
            state: data.enabled
          }
        })
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    async deleteAd (data) {
      this.spinning = true
      try {
        await this.$axios({
          method: this.$api.DELETE_ADVERTISEMENT.method,
          url: this.$api.DELETE_ADVERTISEMENT.url,
          data: {
            id: data.id
          }
        })
        this.spinning = false
        this.getAd(1)
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    }
  },
  mounted () {
    this.getAd(1)
  }
}
</script>
