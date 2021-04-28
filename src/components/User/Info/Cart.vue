<template>
  <a-spin :spinning="spinning">
    <div class="user-info-cart">
      <a-table :data-source="cart" :rowKey="value => value.id" :pagination="tablePagination">
        <a-table-column key="goods_sn" title="商品ID" data-index="goods_sn" />
        <a-table-column key="list_pic_url" title="图片" data-index="list_pic_url">
          <template #default="{ record }">
            <a-image :width="80" :height="80" :src="record.list_pic_url" fallback="/images/fallback.png" />
          </template>
        </a-table-column>
        <a-table-column key="goods_name" title="商品名称" data-index="goods_name" />
        <a-table-column key="goods_specifition_name_value" title="型号" data-index="goods_specifition_name_value" />
        <a-table-column key="number" title="数量" data-index="number" />
        <a-table-column key="add_price" title="加购价" data-index="retail_price" />
        <a-table-column key="retail_price" title="成交价" data-index="retail_price" />
        <a-table-column key="add_time" title="加入时间" data-index="add_time" />
        <a-table-column key="is_on_sale" title="是否在售" data-index="is_on_sale">
          <template #default="{ record }">
            <span>{{record.is_on_sale === 1? '在售':'下架'}}</span>
          </template>
        </a-table-column>
        <a-table-column key="is_delete" title="是否删除" data-index="is_delete">
          <template #default="{ record }">
            <span>{{record.is_delete === 1? '已删':''}}</span>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'UserInfoCart',
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
        onChange: (page) => this.getUserCart(this.id, page)
      },
      cart: [],
      count: 0
    }
  },
  methods: {
    async getUserCart (id, page = 1) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_USER_CART.method,
          url: this.$api.GET_USER_CART.url,
          params: {
            id,
            page
          }
        })
        this.cart = response.data.cart
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
      this.getUserCart(id)
    }
  }
}
</script>
