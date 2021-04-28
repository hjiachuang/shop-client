<template>
  <div class="user-edit">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="0" tab="详情"></a-tab-pane>
      <a-tab-pane key="1" tab="订单"></a-tab-pane>
      <a-tab-pane key="2" tab="收货地址"></a-tab-pane>
      <a-tab-pane key="3" tab="购物车"></a-tab-pane>
      <a-tab-pane key="4" tab="足迹"></a-tab-pane>
      <template #tabBarExtraContent>
        <a-button type="primary" @click="$router.push('/user')">返回列表</a-button>
      </template>
    </a-tabs>
    <component :is="component"></component>
  </div>
</template>

<script>
import Detail from './Info/Detail'
import Order from './Info/Order'
import Address from './Info/Address'
import Cart from './Info/Cart'
import Footmark from './Info/Footmark'

const components = [Detail, Order, Address, Cart, Footmark]

export default {
  name: 'UserInfo',
  data () {
    return {
      activeKey: '0'
    }
  },
  computed: {
    component () {
      return components[this.activeKey]
    }
  }
}
</script>

<style lang="scss" scoped>
.user-edit {
  padding: 20px;
  background: #ffffff;
}
</style>
