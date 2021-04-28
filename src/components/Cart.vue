<template>
  <a-spin :spinning="spinning">
    <div class="content-box cart">
      <a-form :modal="formData" layout="inline">
        <a-form-item label="商品名称">
          <a-input v-model:value="formData.name" placeHolder="请输入商品名称"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="getCartList(1, formData.name)">查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-button @click="getCartList(1, ''); formData.name = ''">清空</a-button>
        </a-form-item>
      </a-form>
      <a-table
        :data-source="cartList"
        :pagination="tablePagination"
        :rowKey="(row) => row.id"
        style="margin-top: 10px"
        bordered>
        <a-table-column key="id" title="ID" data-index="id" />
        <a-table-column key="user_id" title="用户ID" data-index="user_id" />
        <a-table-column key="nickname" title="用户昵称" data-index="nickname" />
        <a-table-column key="goods_id" title="商品ID" data-index="goods_id" />
        <a-table-column key="list_pic_url" title="商品图片" data-index="list_pic_url">
          <template #default="{ text: image }">
            <a-image
            :src="image"
            fallback="/images/fallback.png"
            :preview="false"
            alt="商品图片"
            :width="60"
            :height="60"
          ></a-image>
          </template>
        </a-table-column>
        <a-table-column key="goods_name" title="商品名称" data-index="goods_name" />
        <a-table-column key="goods_specifition_name_value" title="型号" data-index="goods_specifition_name_value" />
        <a-table-column key="number" title="数量" data-index="number" />
        <a-table-column key="retail_price" title="成交价" data-index="retail_price" />
        <a-table-column key="add_time" title="加入时间" data-index="add_time" />
        <a-table-column key="is_delete" title="是否删除" data-index="is_delete">
          <template #default="{ text }">
            <span>{{text === 1? '已删':''}}</span>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'Cart',
  data () {
    return {
      spinning: false,
      formData: {
        name: ''
      },
      tablePagination: {
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        total: 0,
        onChange: (page) => this.getCartList(page, this.formData.name)
      },
      cartList: []
    }
  },
  methods: {
    async getCartList (page, name) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_CART_LIST.method,
          url: this.$api.GET_CART_LIST.url,
          params: {
            page,
            name
          }
        })
        this.cartList = response.data.list
        this.tablePagination.total = response.data.count
        this.spinning = false
      } catch (err) {
        console.log('获取购物车列表失败。[getCartList]', err)
        this.spinning = false
      }
    }
  },
  mounted () {
    this.getCartList(1, '')
  }
}
</script>
