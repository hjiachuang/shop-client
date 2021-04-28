<template>
  <a-layout-sider v-model:collapsed="collapsed" collapsible breakpoint="lg" theme="light">
    <div class="logo">
      <img src="../assets/images/logo.png" />
    </div>
    <a-menu
      :openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      @openChange="onOpenChange"
      @click="onClick"
    >
      <a-menu-item key="/home">
        <home-outlined />
        <span>首页</span>
      </a-menu-item>
      <a-menu-item key="/order">
        <menu-outlined />
        <span>订单列表</span>
      </a-menu-item>
      <a-sub-menu key="sub1">
        <template #title>
          <span>
            <shopping-outlined />
            <span>商品管理</span>
          </span>
        </template>
        <a-menu-item key="/goods">
          <number-outlined />
          <span>商品列表</span>
        </a-menu-item>
        <a-menu-item key="/classification">
          <number-outlined />
          <span>商品设置</span>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="/cart">
        <shopping-cart-outlined />
        <span>购物车</span>
      </a-menu-item>
      <a-menu-item key="/user">
        <team-outlined />
        <span>用户列表</span>
      </a-menu-item>
      <a-sub-menu key="sub2">
        <template #title>
          <span>
            <shop-outlined />
            <span>店铺设置</span>
          </span>
        </template>
        <a-menu-item key="/show">
          <number-outlined />
          <span>显示设置</span>
        </a-menu-item>
        <a-menu-item key="/advertisement">
          <number-outlined />
          <span>广告管理</span>
        </a-menu-item>
        <a-menu-item key="/notice">
          <number-outlined />
          <span>公告管理</span>
        </a-menu-item>
        <a-menu-item key="/freight">
          <number-outlined />
          <span>运费模板</span>
        </a-menu-item>
        <a-menu-item key="/express">
          <number-outlined />
          <span>快递设置</span>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <template #title>
          <span>
            <tool-outlined />
            <span>系统设置</span>
          </span>
        </template>
        <a-menu-item key="/administrators">
          <number-outlined />
          <span>管理员设置</span>
        </a-menu-item>
        <a-menu-item key="/password">
          <number-outlined />
          <span>密码修改</span>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="13">
        <logout-outlined />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import {
  HomeOutlined,
  MenuOutlined,
  ShoppingOutlined,
  NumberOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ShopOutlined,
  ToolOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
export default {
  name: 'Silde',
  components: {
    HomeOutlined,
    MenuOutlined,
    ShoppingOutlined,
    NumberOutlined,
    ShoppingCartOutlined,
    TeamOutlined,
    ShopOutlined,
    ToolOutlined,
    LogoutOutlined
  },
  data () {
    return {
      collapsed: false,
      rootSubmenuKeys: ['sub1', 'sub2', 'sub3'],
      openKeys: [],
      selectedKeys: null
    }
  },
  watch: {
    '$route' (newValue) {
      this.selectedKeys = [`${newValue.path}`]
    }
  },
  mounted () {
    this.selectedKeys = [`${this.$route.path}`]
    switch (this.$route.path) {
      case '/express':
      case '/freight':
        this.openKeys = ['sub2']
        break
    }
  },
  methods: {
    onOpenChange (target) {
      const latestOpenKey = target.find(
        (key) => this.openKeys.indexOf(key) === -1
      )
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = target
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    onClick ({ key }) {
      if (key !== '13') {
        this.$router.push(key)
      } else {
        this.logout()
      }
    },
    logout () {
      this.$modal.confirm({
        cancelText: '取消',
        centered: true,
        content: '确定退出登录?',
        okText: '确定',
        onOk: async () => {
          try {
            await this.$axios({
              method: this.$api.GET_LOGOUT.method,
              url: this.$api.GET_LOGOUT.url
            })
            this.$router.replace('/login')
          } catch (err) {
            console.log(err)
          }
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  width: 100%;
  img {
    height: 60px;
  }
}
</style>
