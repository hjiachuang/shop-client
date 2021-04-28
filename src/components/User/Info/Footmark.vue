<template>
  <a-spin :spinning="spinning">
    <div class="user-info-foot">
      <a-table :data-source="foot" :rowKey="value => value.id" :pagination="tablePagination">
        <a-table-column key="id" title="商品ID" data-index="id" />
        <a-table-column key="list_pic_url" title="图片" data-index="list_pic_url">
          <template #default="{ record }">
            <a-image :width="80" :height="80" :src="record.list_pic_url" fallback="/images/fallback.png" />
          </template>
        </a-table-column>
        <a-table-column key="name" title="商品名称" data-index="name" />
      </a-table>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'UserInfoFootmark',
  data () {
    return {
      spinning: false,
      id: '',
      tablePagination: {
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        total: 0,
        onChange: (page) => this.getUserFoot(this.id, page)
      },
      foot: [],
      count: 0
    }
  },
  methods: {
    async getUserFoot (id, page = 1) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_USER_FOOT.method,
          url: this.$api.GET_USER_FOOT.url,
          params: {
            id,
            page
          }
        })
        this.foot = response.data.foot
        this.count = response.data.count
        this.tablePagination.total = response.data.count
        this.spinning = false
      } catch (err) {
        this.spinning = false
      }
    }
  },
  mounted () {
    const { id } = this.$route.query
    if (id === undefined) {
      this.$router.push('/user')
    } else {
      this.id = id
      this.getUserFoot(id)
    }
  }
}
</script>
