export default {
  GET_VERIFY_CODE: {
    method: 'get',
    url: `/api/login/code?time=${new Date()}`
  },
  POST_LOGIN: {
    method: 'post',
    url: '/api/login'
  },
  GET_LOGOUT: {
    method: 'get',
    url: '/api/logout'
  },
  GET_HOME_INFO: {
    method: 'get',
    url: '/api/home/info'
  },
  GET_HOME_MAIN: {
    method: 'get',
    url: '/api/home/main',
    params: {
      index: 0
    }
  },
  GET_ALL_USER: {
    method: 'get',
    url: '/api/user',
    params: {
      page: 1,
      size: 20,
      nickname: ''
    }
  },
  GET_USER_DETAIL: {
    method: 'get',
    url: '/api/user/detail',
    params: {
      id: 1
    }
  },
  POST_UPDATE_USER_DETAIL: {
    method: 'post',
    url: '/api/user/update',
    data: 'userData'
  },
  GET_USER_ORDER: {
    method: 'get',
    url: '/api/user/order',
    params: {
      id: 1,
      page: 1
    }
  },
  GET_USER_ADDRESS: {
    method: 'get',
    url: '/api/user/address',
    params: {
      id: 1,
      page: 1
    }
  },
  GET_USER_CART: {
    method: 'get',
    url: '/api/user/cart',
    params: {
      id: 1,
      page: 1
    }
  },
  GET_USER_FOOT: {
    method: 'get',
    url: '/api/user/foot',
    params: {
      id: 1,
      page: 1
    }
  },
  GET_ORDER: {
    method: 'get',
    url: '/api/order',
    params: {
      logistic_code: '',
      page: 1,
      order_status: 1
    }
  },
  GET_AUTOMATIC_DELIVERY_STATUE: {
    method: 'get',
    url: '/api/express/getAutomaticDeliveryStatus'
  },
  GET_ALL_REGION: {
    method: 'get',
    url: '/api/region/all'
  },
  POST_GO_DELIVERY: {
    method: 'post',
    url: '/api/order/goDelivery',
    data: {
      order_id: ''
    }
  },
  POST_SAVE_SELLER_MEMO: {
    method: 'post',
    url: '/api/order/saveSellerMemo',
    data: {
      order_id: '',
      meno: ''
    }
  },
  GET_ORDER_DETAIL: {
    method: 'get',
    url: '/api/order/detail',
    params: {
      order_id: ''
    }
  },
  GET_REVISE_PRICE: {
    method: 'get',
    url: '/api/order/revisePrice',
    params: {
      order_id: '',
      actual_price: '',
      freight_price: '',
      goods_price: ''
    }
  },
  GET_CHECK_EXPRESS: {
    method: 'get',
    url: '/api/order/checkExpress',
    params: {
      order_id: ''
    }
  },
  GET_EXPRESS_TYPE: {
    method: 'get',
    url: '/api/express/type'
  },
  GET_REGENERATE_ORDER_SN: {
    method: 'get',
    url: '/api/order/regenerateOrderSn',
    params: {
      order_id: ''
    }
  },
  GET_EXPRESS_SETTINGS: {
    method: 'get',
    url: '/api/shop/expressSettings'
  },
  POST_SET_SETTINGS: {
    method: 'post',
    url: '/api/shop/setSettings',
    data: {}
  },
  GET_CHANGE_EXPRESS_STATUS: {
    method: 'get',
    url: '/api/express/changeStatus',
    params: {
      id: '',
      enabled: ''
    }
  },
  GET_EXPRESS_DETAIL: {
    method: 'get',
    url: '/api/express/detail',
    params: {
      id: ''
    }
  },
  POST_EDIT_EXPRESS: {
    method: 'post',
    url: '/api/express/edit',
    data: 'express'
  },
  GET_FREIGHT_TEMPLATE: {
    method: 'get',
    url: '/api/express/getFreightTemplate'
  },
  DELETE_FREIGHT_TEMPLATE: {
    method: 'delete',
    url: '/api/express/deleteFreightTemplate',
    params: {
      id: ''
    }
  },
  GET_FREIGHT_TEMPLATE_DETAIL: {
    method: 'get',
    url: '/api/express/getFreightTemplateDetail',
    params: {
      id: ''
    }
  },
  GET_CAN_USE_SHIPPER: {
    method: 'get',
    url: '/api/express/canUseShipper'
  },
  GET_ALL_AREA_DATA: {
    method: 'get',
    url: '/api/region/allArea'
  },
  POST_SAVE_FREIGHT_TEMPLATE: {
    method: 'post',
    url: '/api/express/saveFreightTemplate',
    data: {
      freightInfo: '',
      defaultFreight: '',
      specialFreight: ''
    }
  },
  GET_CART_LIST: {
    method: 'get',
    url: '/api/user/allShopCartList',
    params: {
      page: 1
    }
  },
  GET_GOODS_LIST: {
    method: 'get',
    url: '/api/goods/list',
    params: {
      sort: '',
      status: '',
      page: 1,
      name: ''
    }
  },
  DELETE_GOODS: {
    method: 'delete',
    url: '/api/goods/deleteGoods',
    params: {
      id: ''
    }
  },
  CHANGE_GOODS_STATUS: {
    method: 'post',
    url: '/api/goods/changeGoodsStatus',
    data: {
      id: '',
      sort_order: '',
      is_index: '',
      is_on_sale: ''
    }
  },
  GET_GOODS_DETAIL: {
    method: 'get',
    url: '/api/goods/detail',
    params: {
      id: ''
    }
  },
  GET_ALL_SPECIFICATION: {
    method: 'get',
    url: '/api/goods/specification'
  },
  GET_ALL_CATEGORY: {
    method: 'get',
    url: '/api/category'
  },
  POST_UPLOAD_IMAGE: {
    method: 'post',
    url: '/api/upload/image',
    data: 'file-formdata'
  },
  POST_SAVE_GOODS: {
    method: 'post',
    url: '/api/goods/save',
    data: {
      goods: {}
    }
  },
  CHANGE_CATEGORY_ICON_DISPLAY: {
    method: 'post',
    url: '/api/category/changeIconDisplay',
    data: {
      id: '',
      icon_display: ''
    }
  },
  CHANGE_CATEGORY_SHOW_INDEX: {
    method: 'post',
    url: '/api/category/changeShowIndex',
    data: {
      id: '',
      show_index: ''
    }
  },
  CHANGE_CATEGORY_SORT_ORDER: {
    method: 'post',
    url: '/api/category/changeSortOrder',
    data: {
      id: '',
      sort_order: ''
    }
  },
  DELETE_CATEGORY: {
    method: 'delete',
    url: '/api/category/delete',
    data: {
      id: ''
    }
  },
  CHANGE_SPECIFICATION_NAME: {
    method: 'post',
    url: '/api/goods/changeSpecificationName',
    data: {
      id: '',
      name: ''
    }
  },
  CHANGE_SPECIFICATION_SORT_ORDER: {
    method: 'post',
    url: '/api/goods/changeSpecificationSortOrder',
    data: {
      id: '',
      sort_order: ''
    }
  },
  DELETE_SPECIFICATION: {
    method: 'delete',
    url: '/api/goods/deleteSpecification',
    data: {
      id: ''
    }
  },
  GET_CATEGORY_INFO: {
    method: 'get',
    url: '/api/category/info',
    params: {
      id: ''
    }
  },
  POST_SAVE_CATEGORY: {
    method: 'post',
    url: '/api/category/save',
    data: {
      category: {}
    }
  },
  GET_SPECIFICATION_INFO: {
    method: 'get',
    url: '/api/goods/specification/info',
    params: {
      id: ''
    }
  },
  POST_SAVE_SPECIFICATION: {
    method: 'post',
    url: '/api/goods/saveSpecification',
    data: {
      specification: {}
    }
  },
  GET_ADVERTISEMENT: {
    method: 'get',
    url: '/api/shop/advertisement'
  },
  CHANGE_ADVERTISEMENT_STATE: {
    method: 'post',
    url: '/api/shop/advertisement/changeState',
    data: {
      id: '',
      state: ''
    }
  },
  DELETE_ADVERTISEMENT: {
    method: 'delete',
    url: '/api/shop/advertisement/delete',
    data: {
      id: ''
    }
  },
  GET_ADVERTISEMENT_DETAIL: {
    method: 'get',
    url: '/api/shop/advertisement/detail',
    params: {
      id: ''
    }
  },
  SAVE_ADVERTISEMENT: {
    method: 'post',
    url: '/api/shop/advertisement/save',
    data: {
      advertisement: ''
    }
  },
  GET_GOODS_SIMPLE_LIST: {
    method: 'get',
    url: '/api/goods/simpleList',
    params: {
      page: 1
    }
  },
  GET_SHOW_SETTING: {
    method: 'get',
    url: '/api/shop/showSet'
  },
  SAVE_SHOW_SETTING: {
    method: 'post',
    url: '/api/shop/saveShowSet',
    data: {
      setting: ''
    }
  },
  GET_NOTICE: {
    method: 'get',
    url: '/api/shop/getNotice',
    params: {
      page: ''
    }
  },
  DELETE_NOTICE: {
    method: 'delete',
    url: '/api/shop/deleteNotice',
    data: {
      id: ''
    }
  },
  SAVE_NOTICE: {
    method: 'post',
    url: '/api/shop/saveNotice',
    data: {
      notice: ''
    }
  },
  GET_ADMINISTRATORS: {
    method: 'get',
    url: '/api/administrators/getAdministrators'
  },
  ADD_ADMINISTRATORS: {
    method: 'post',
    url: '/api/administrators/add',
    data: {
      administrator: ''
    }
  },
  EDIT_ADMINISTRATORS: {
    method: 'post',
    url: '/api/administrators/edit',
    data: {
      administrator: ''
    }
  },
  CHANGE_PASSWORD: {
    method: 'post',
    url: '/api/administrators/changePassword',
    data: ''
  }
}
