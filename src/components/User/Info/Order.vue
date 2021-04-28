<template>
  <a-spin :spinning="spinning">
    <div class="user-info-order" v-if="order && order.length !== 0">
      <template v-for="(item, index) in order" :key="index">
          <!-- <a-divider orientation="left" style="color: #f0797f">{{item.order_status_text}}</a-divider> -->
        <a-descriptions
          layout="vertical"
          :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
          size="small"
          style="margin-bottom: 30px; border: 1px solid #f0f0f0; padding: 20px"
        >
          <template #title>
            <span style="color: #f0797f">{{item.order_status_text}}</span>
          </template>
          <template #extra>
            <router-link :to="`/order/detail?order_sn=${item.order_sn}`">查看详情</router-link>
          </template>
          <a-descriptions-item label="订单内容" :span="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
            <a-list :data-source="item.goodsList">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta :description="`颜色: ${item.goods_specifition_name_value}、数量: ${item.number}`">
                    <template #title>
                      {{item.goods_name}}
                    </template>
                    <template #avatar>
                      <a-image :width="80" :height="80" :src="item.list_pic_url" fallback="/images/fallback.png" />
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-descriptions-item>
          <!-- <a-descriptions-item label="订单状态">
            <span style="color: #f0797f">{{item.order_status_text}}</span>
          </a-descriptions-item> -->
          <a-descriptions-item label="创建时间">{{item.add_time}}</a-descriptions-item>
          <a-descriptions-item label="订单号">{{item.order_sn}}</a-descriptions-item>
          <a-descriptions-item label="订单金额">¥ {{item.order_price}} （含运费{{item.freight_price}}元）</a-descriptions-item>
          <a-descriptions-item label="订单数量">{{item.goodsCount}}</a-descriptions-item>
          <a-descriptions-item label="收件人">{{item.consignee}}</a-descriptions-item>
          <a-descriptions-item label="收件号码">{{item.mobile}}</a-descriptions-item>
          <a-descriptions-item label="收件地址">{{item.full_region + item.address}}</a-descriptions-item>
        </a-descriptions>
      </template>
      <a-pagination hideOnSinglePage show-quick-jumper v-model:current="page" :pageSize="20" :total="count" :show-total="total => `共 ${total} 条`" @change="getUserOrder(id,page)" />
    </div>
    <a-empty v-else />
  </a-spin>
</template>

<script>
export default {
  data () {
    return {
      spinning: false,
      id: '',
      order: [],
      count: 0,
      page: 1
    }
  },
  methods: {
    async getUserOrder (id, page = 1) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_USER_ORDER.method,
          url: this.$api.GET_USER_ORDER.url,
          params: {
            id,
            page
          }
        })
        this.order = response.data.order
        this.count = response.data.count
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
      this.getUserOrder(id)
    }
  }
}
</script>
