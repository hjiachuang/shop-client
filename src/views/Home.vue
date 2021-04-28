<template>
  <div>
    <div id="components-back-top-demo-custom">
      <a-back-top>
        <div class="ant-back-top-inner">UP</div>
      </a-back-top>
    </div>
    <a-layout style="min-height: 100vh">
      <sider />
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0" />
        <a-layout-content style="margin: 0 16px">
          <a-breadcrumb :routes="routes" style="margin: 16px 0">
            <template #itemRender="{ route, routes, paths }">
              <span v-if="routes.indexOf(route) === routes.length - 1">
                {{ route.breadcrumbName }}
              </span>
              <router-link v-else :to="`/${paths.join('/')}`">
                {{ route.breadcrumbName }}
              </router-link>
            </template>
          </a-breadcrumb>
          <router-view />
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          Shop ©2021 Created by Aidioute
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Sider from '../components/Sider'
import '../assets/css/animation.css'
export default {
  name: 'Home',
  components: {
    Sider
  },
  computed: {
    routes () {
      const path = this.$route.path
      let lastPath = ''
      return path.split('/').slice(1).map(value => {
        const path = `${lastPath}/${value}`
        lastPath = path
        return {
          path,
          breadcrumbName: value.replace(/^[a-z]/g, (L) => L.toUpperCase())
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#components-back-top-demo-custom .ant-back-top {
  right: 50px;
  bottom: 50px;
  .ant-back-top-inner {
    height: 40px;
    width: 40px;
    line-height: 40px;
    border-radius: 4px;
    background-color: #1088e9;
    color: #fff;
    text-align: center;
    font-size: 20px;
  }
}
</style>
