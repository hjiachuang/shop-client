import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

import cookie from '../utils/cookie'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: 'home',
        name: 'Dashboard',
        component: () => import('../components/Dashboard')
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('../components/Order/Index')
      },
      {
        path: 'order/detail',
        name: 'OrderDetail',
        component: () => import('../components/Order/Detail')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../components/User/Index')
      },
      {
        path: 'user/info',
        name: 'UserInfo',
        component: () => import('../components/User/Info')
      },
      {
        path: 'express',
        name: 'ExpressSettings',
        component: () => import('../components/Shop/ExpressSettings')
      },
      {
        path: 'express/edit',
        name: 'ExpressEdit',
        component: () => import('../components/Shop/ExpressEdit')
      },
      {
        path: 'freight',
        name: 'FreightTemplate',
        component: () => import('../components/Shop/FreightTemplate')
      },
      {
        path: 'freight/edit',
        name: 'FreightTemplateEdit',
        component: () => import('../components/Shop/FreightTemplateEdit')
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('../components/Cart')
      },
      {
        path: 'goods',
        name: 'GoodsList',
        component: () => import('../components/Goods/List')
      },
      {
        path: 'goods/edit',
        name: 'GoodsEdit',
        component: () => import('../components/Goods/Edit')
      },
      {
        path: 'classification',
        name: 'Classification',
        component: () => import('../components/Goods/Classification')
      },
      {
        path: 'classification/category',
        name: 'AddCategory',
        component: () => import('../components/Goods/AddCategory')
      },
      {
        path: 'classification/specification',
        name: 'AddSpecification',
        component: () => import('../components/Goods/AddSpecification')
      },
      {
        path: 'show',
        name: 'ShowSetting',
        component: () => import('../components/Shop/Show')
      },
      {
        path: 'advertisement',
        name: 'Advertisement',
        component: () => import('../components/Shop/Advertisement')
      },
      {
        path: 'advertisement/edit',
        name: 'EditAdvertisement',
        component: () => import('../components/Shop/EditAdvertisement')
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('../components/Shop/Notice')
      },
      {
        path: 'administrators',
        name: 'Administrators',
        component: () => import('../components/System/Administrators')
      },
      {
        path: 'password',
        name: 'Password',
        component: () => import('../components/System/Password')
      }
      // {
      //   path: 'goods',
      //   name: 'Goods',
      //   component: () => import('../components/Goods/Index')
      // },
      // {
      //   path: 'goods/add',
      //   name: 'GoodsAdd',
      //   component: () => import('../components/Goods/Add')
      // },
      // {
      //   path: 'nature',
      //   name: 'Nature',
      //   component: () => import('../components/Nature/Index')
      // },
      // {
      //   path: 'specification',
      //   name: 'Specification',
      //   component: () => import('../components/Specification/Index')
      // },
      // {
      //   path: 'specification/detail',
      //   name: 'SpecificationDetail',
      //   component: () => import('../components/Specification/Detail')
      // },
      // {
      //   path: 'category',
      //   name: 'Category',
      //   component: () => import('../components/Category/Index')
      // },
      // {
      //   path: 'category/add',
      //   name: 'CategoryAdd',
      //   component: () => import('../components/Category/Add')
      // },
      // {
      //   path: 'shipper',
      //   name: 'Shipper',
      //   component: () => import('../components/Shipper/Index')
      // },
      // {
      //   path: 'shipper/list',
      //   name: 'ShipperList',
      //   component: () => import('../components/Shipper/List')
      // },
      // {
      //   path: 'shipper/add',
      //   name: 'ShipperAdd',
      //   component: () => import('../components/Shipper/Add')
      // },
      // {
      //   path: 'freight',
      //   name: 'Freight',
      //   component: () => import('../components/Freight/Index')
      // },
      // {
      //   path: 'freight/add',
      //   name: 'freight_add',
      //   component: require('@/components/Freight/FreightAddPage')
      // },
      // {
      //   path: 'notice',
      //   name: 'notice',
      //   component: require('@/components/Settings/NoticePage')
      // },
      // {
      //   path: 'ad',
      //   name: 'ad',
      //   component: require('@/components/Ad/AdPage')
      // },
      // {
      //   path: 'ad/add',
      //   name: 'ad_add',
      //   component: require('@/components/Ad/AdAddPage')
      // },
      // {
      //   path: 'keywords',
      //   name: 'keywords',
      //   component: require('@/components/Keywords/KeywordsPage')
      // },
      // {
      //   path: 'keywords/add',
      //   name: 'keywords_add',
      //   component: require('@/components/Keywords/KeywordsAddPage')
      // },
      // {
      //   path: 'goodsgalleryedit',
      //   name: 'goodsgalleryedit',
      //   component: require('@/components/GoodsGallery/GoodsGalleryEditPage')
      // },
      // {
      //   path: 'admin',
      //   name: 'admin',
      //   component: require('@/components/Admin/AdminPage')
      // },
      // {
      //   path: 'admin/add',
      //   name: 'admin_add',
      //   component: require('@/components/Admin/AdminAddPage')
      // },
      // {
      //   path: 'settings/showset',
      //   name: 'showset',
      //   component: require('@/components/Showset/ShowSetPage')
      // }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = cookie.getCookie('token')
  if (!token && to.name !== 'Login') {
    next({
      path: '/login',
      query: {
        redirect: from.fullPath
      }
    })
  } else {
    next()
  }
})

export default router
