<template>
  <a-spin :spinning="spinning">
    <div class="user-info-address">
      <a-table :columns="columns" :data-source="address" :rowKey="value => value.id" :pagination="tablePagination">
        <template #name="{ text }">
          <a>{{ text }}</a>
        </template>
      </a-table>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'UserInfoAddress',
  data () {
    return {
      spinning: false,
      id: '',
      columns: [
        {
          title: '收件人',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '收件号码',
          dataIndex: 'mobile',
          key: 'mobile'
        },
        {
          title: '收件地址',
          dataIndex: 'full_region',
          key: 'full_region'
        },
        {
          title: '详细地址',
          dataIndex: 'address',
          key: 'address'
        }
      ],
      tablePagination: {
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        total: 0,
        onChange: (page) => this.getUserAddress(this.id, page)
      },
      address: [],
      count: 0,
      page: 1
    }
  },
  methods: {
    async getUserAddress (id, page = 1) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_USER_ADDRESS.method,
          url: this.$api.GET_USER_ADDRESS.url,
          params: {
            id,
            page
          }
        })
        this.address = response.data.address
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
      this.getUserAddress(id)
    }
  }
}
</script>
