<template>
  <a-spin :spinning="spinning">
    <div class="order-index">
      <a-tabs v-model:activeKey="activeKey" @change="tabChange">
        <a-tab-pane key="1" tab="全部订单" />
        <a-tab-pane key="2" tab="待付款" />
        <a-tab-pane key="3" tab="待发货" />
        <a-tab-pane key="4" tab="待收货" />
        <a-tab-pane key="5" tab="已收货" />
        <a-tab-pane key="6" tab="已关闭" />
      </a-tabs>
      <a-form layout="inline" :model="formState">
        <a-form-item label="订单号">
          <a-input
            v-model:value="formState.order_sn"
            placeholder="请输入订单号"
          />
        </a-form-item>
        <a-form-item label="收货人">
          <a-input
            v-model:value="formState.consignee"
            placeholder="请输入收货人"
          />
        </a-form-item>
        <a-form-item label="快递单号">
          <a-input
            v-model:value="formState.logistic_code"
            placeholder="请输入快递单号"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">查询</a-button>
        </a-form-item>
      </a-form>
      <div class="order-main" v-if="order && order.length !== 0" style="margin-top: 20px">
        <template v-for="(item, index) in order" :key="index">
          <!-- <a-divider orientation="left" style="color: #f0797f">{{item.order_status_text}}</a-divider> -->
          <a-descriptions
            layout="vertical"
            :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
            size="small"
            class="order-box"
          >
            <template #title>
              <span style="color: #f0797f"><span class="off-text" v-if="item.offline_pay">线下支付订单</span> {{ item.order_status_text }}</span>
              <a-button v-if="item.order_status == 101" style="float: right;margin-top: 10px;margin-right: 20px;" @click="showRevisePrice(item)">修改价格</a-button>
              <a-button v-if="item.print_status == 1 && item.order_status == 300" style="float: right;margin-top: 10px;margin-right: 20px;" @click="delivery(item.id)">发货</a-button>
              <a-button v-else-if="item.order_status == 300" style="float: right;margin-top: 10px;margin-right: 20px;" @click="printExpressBill(item)">打印快递单/发货</a-button>
              <a-button v-else-if="item.order_status == 301" style="float: right;margin-top: 10px;margin-right: 20px;" @click="viewLogistics(item)">查看物流</a-button>
            </template>
            <template #extra style="text-align: right;">
              <router-link :to="`/order/detail?id=${item.id}`" style="display: inline-block;width: 100%;text-align: right;margin-top: 10px">查看详情</router-link
              >
            </template>
            <a-descriptions-item
              label="订单内容"
              :span="{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }"
            >
              <a-list :data-source="item.goodsList">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      :description="`颜色: ${item.goods_specifition_name_value}、数量: ${item.number}`"
                    >
                      <template #title>
                        {{ item.goods_name }}
                      </template>
                      <template #avatar>
                        <a-image
                          :width="80"
                          :height="80"
                          :src="item.list_pic_url"
                          fallback="/images/fallback.png"
                        />
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
            </a-descriptions-item>
            <!-- <a-descriptions-item label="订单状态">
            <span style="color: #f0797f">{{item.order_status_text}}</span>
          </a-descriptions-item> -->
            <a-descriptions-item label="创建时间">{{
              item.add_time
            }}</a-descriptions-item>
            <a-descriptions-item label="付款时间" v-if="item.pay_time != 0">{{
              item.pay_time
            }}</a-descriptions-item>
            <a-descriptions-item label="订单号">{{
              item.order_sn
            }}</a-descriptions-item>
            <a-descriptions-item label="订单金额">
              ¥ {{ item.actual_price }} （含运费{{ item.freight_price }}元）
              <span v-if="item.change_price!= item.actual_price">改价前{{item.change_price}}元</span>
            </a-descriptions-item>
            <a-descriptions-item label="订单数量">{{
              item.goodsCount
            }}</a-descriptions-item>
            <a-descriptions-item label="收件人">{{
              item.consignee
            }}</a-descriptions-item>
            <a-descriptions-item label="收件号码">{{
              item.mobile
            }}</a-descriptions-item>
            <a-descriptions-item label="收件地址">{{
              item.full_region + item.address
            }}</a-descriptions-item>
            <a-descriptions-item label="快递单号" v-if="item.expressInfo != ''">
              <span class="express-box">{{ item.expressInfo }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="留言" v-if="item.postscript !== ''">
              <span class="postscript-box">{{item.postscript}}</span>
            </a-descriptions-item>
            <a-descriptions-item label="备注">
              <a-textarea v-model:value="item.admin_memo" showCount allow-clear :maxlength="100" @blur="changeMemo(item.id,item.admin_memo)" />
            </a-descriptions-item>
          </a-descriptions>
        </template>
        <a-pagination
          hideOnSinglePage
          show-quick-jumper
          v-model:current="page"
          :pageSize="20"
          :total="count"
          :show-total="(total) => `共 ${total} 条`"
          @change="getOrder(page, orderStatus[parseInt(activeKey) - 1], formState.logistic_code, formState.order_sn, formState.consignee)"
        />
      </div>
      <a-empty style="margin-top: 20px" v-else />
    </div>
    <!-- 修改价格 modal -->
    <a-modal
      v-model:visible="showRevisePriceModal"
      title="修改价格"
      :confirm-loading="revisePriceConfirmLoading"
      @ok="revisePrice"
      >
      <a-form :model="orderDetail" :label-col="{span: 6}" :wrapper-col="{span: 14}">
        <a-form-item label="改价前总价">
          <span>¥ {{orderDetail.change_price}}</span>
        </a-form-item>
        <a-form-item label="修改商品价格">
          <a-input-number v-model:value="orderDetail.goods_price" :min="0" :max="99999999" :step="0.01" @change="changeGoodsPrice" />
        </a-form-item>
        <a-form-item label="修改快递价格">
          <a-input-number v-model:value="orderDetail.freight_price" :min="0" :max="99999999" @change="changeFreightPrice" />
        </a-form-item>
        <a-form-item label="改价后总价">
          <span>¥ {{orderDetail.actual_price}}</span>
        </a-form-item>
        <a-form-item :label="orderDetail.change_price-orderDetail.actual_price>0? '优惠金额':'涨价金额'">
          {{(Math.abs(orderDetail.change_price-orderDetail.actual_price)).toFixed(2)}}
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 已有快递单号，询问新建还是用已有快递单号打印  -->
    <a-modal
      v-model:visible="showHadExpressBill"
      title="提醒!"
      >
      <template #footer>
        <a-button @click="showHadExpressBill = false">取消</a-button>
        <a-button style="background: rgb(102, 177, 255); color: #fff" @click="regenerateOrderSn">重新生成订单号打印</a-button>
        <a-button style="background: rgb(103, 194, 58); color: #fff" @click="directPrintExpress">直接用该单号打印</a-button>
      </template>
      <p>该订单已经生成过一个快递单号，是否用该单号打印？</p>
    </a-modal>
    <a-modal
      v-model:visible="showExpressBillForm"
      title="打印快递单"
      :width="650"
      >
        <a-list :data-source="orderDetail.goodsList">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                :description="`颜色: ${item.goods_specifition_name_value}、数量: ${item.number}`"
              >
                <template #title>
                  {{ item.goods_name }}
                </template>
                <template #avatar>
                  <a-image
                    :width="60"
                    :height="60"
                    :src="item.list_pic_url"
                    fallback="/images/fallback.png"
                  />
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
        <a-divider />
        <a-form
          layout="inline"
        >
          <p>寄件人</p>
          <a-form-item>
            <a-input v-model:value="sender.name" placeholder="寄件人姓名" />
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="sender.mobile" placeholder="寄件人手机"></a-input>
          </a-form-item>
          <a-form-item>
            <a-cascader v-model:value="senderOptions" :options="region" style="width: 100%" placeholder="请选择寄件人地址" @change="senderCascaderChange">
              <template #displayRender="{ labels, selectedOptions }">
                <span v-for="(label, index) in labels" :key="selectedOptions[index].value">
                  <span v-if="index === labels.length - 1">
                    {{ label }}
                  </span>
                  <span v-else>{{ label }} /</span>
                </span>
              </template>
            </a-cascader>
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="sender.address" placeholder="请输入详细地址"></a-input>
          </a-form-item>
        </a-form>
        <a-divider />
        <a-form
          layout="inline"
        >
          <p>收件人</p>
          <a-form-item>
            <a-input v-model:value="receiver.name" placeholder="收件人姓名" />
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="receiver.mobile" placeholder="收件人手机"></a-input>
          </a-form-item>
          <a-form-item>
            <a-cascader v-model:value="receiverOptions" :options="region" style="width: 100%" placeholder="请选择收件人地址" @change="receiverCascaderChange">
              <template #displayRender="{ labels, selectedOptions }">
                <span v-for="(label, index) in labels" :key="selectedOptions[index].value">
                  <span v-if="index === labels.length - 1">
                    {{ label }}
                  </span>
                  <span v-else>{{ label }} /</span>
                </span>
              </template>
            </a-cascader>
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="receiver.address" placeholder="请输入详细地址"></a-input>
          </a-form-item>
        </a-form>
        <a-divider />
        <div v-if="orderDetail.postscript && orderDetail.postscript !== ''" class="buyer-memo">买家留言：{{orderDetail.postscript}}</div>
        <div v-if="orderDetail.seller_memo && orderDetail.seller_memo !== ''" class="seller-memo">卖家备注：{{orderDetail.seller_memo}}</div>
        <a-divider />
        <a-form :label-col="{span: 24}" :wrapper-col="{span: 24}">
          <a-form-item label="发货类型">
            <a-radio-group v-model:value="deliveryType" @change="deliveryTypeChange">
              <a-radio value="1">快递</a-radio>
              <a-radio value="2">手动输入快递</a-radio>
              <a-radio value="3">自提件</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="运费模板" v-if="deliveryType == '1'">
            <a-radio-group v-model:value="orderDetail.freight_template" @change="radioChange">
              <a-radio v-for="item in freightTemplate" :key="item.id" :value="item.id">{{item.name}}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="保价金额" v-if="deliveryType == '1' && (orderDetail.shipper_id === 1 || orderDetail.shipper_id === 15)">
            <a-input-number :min=1 :max="9999" v-model:value="orderDetail.express_value" placeholder="请输入报价金额"></a-input-number>
          </a-form-item>
          <a-form-item label="提醒" v-if="deliveryType == '1'">
            <a-input v-model:value="orderDetail.remark" placeholder="快递单上的提醒" />
          </a-form-item>
          <a-form-item label="快递单上打印的发货内容" v-if="deliveryType == '1'">
            <a-textarea v-model:value="orderDetail.print_info" placeholder="请输入发货信息" allow-clear />
          </a-form-item>
          <a-form-item label="快递单号" v-if="deliveryType == '2'">
            <a-input v-model:value="expressInfo.logisticCode" placeholder="请输入快递单号"></a-input>
          </a-form-item>
          <a-form-item label="快递公司" v-if="deliveryType == '2'">
            <a-select v-model:value="expressInfo.deliveryId" placeholder="请选择快递公司">
              <a-select-option v-for="item in expressCompany" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-checkbox v-model:checked="autoGoDelivery">打印完成后自动发货</a-checkbox>
          </a-form-item>
        </a-form>
        <template #footer>
          <a-button @click="showExpressBillForm = false">取消</a-button>
          <a-button v-if="deliveryType !== '1'" @click="modalGoDelivery" type="primary">发货</a-button>
          <a-button v-if="autoGoDelivery" @click="modalPrintExpressAndDelivery" type="primary">打印快递单并发货</a-button>
          <a-button v-if="!autoGoDelivery"  @click="modalOnlyPrintExpress" type="primary">只打印快递单</a-button>
        </template>
    </a-modal>
  </a-spin>
</template>

<script>
export default {
  name: 'OrderIndex',
  data () {
    return {
      spinning: false, // loading状态
      activeKey: '1', // tab标签页key
      orderStatus: ['101,102,103,202,203,300,301,302,303,401,801,802', '101,801', '300', '301', '401', '102,103'], // tab标签页对应的订单状态
      formState: {
        order_sn: '',
        consignee: '',
        logistic_code: ''
      },
      order: [], // 订单列表
      count: 0, // 订单总数量
      page: 1, // 当前页数
      autoGoDelivery: false, // 打印订单后是否自动发货
      region: [], // 城市列表
      showRevisePriceModal: false, // 是否显示修改价格 modal
      revisePriceConfirmLoading: false, // 修改价格modal的确认按钮loading状态
      showExpressBillForm: false, // 是否显示打印快递单表单 modal
      showHadExpressBill: false, // 是否显示已有快递单选择 modal
      deliveryType: '1', // 发货类型 1快递，2手动输入快递，3自提件
      freightTemplate: [], // 运费模板
      orderDetail: {}, // 订单详情
      sender: {}, // 寄件人信息
      receiver: {}, // 收件人信息
      receiverOptions: [], // 收件人地址(方便form -> select组件使用)
      senderOptions: [], // 寄件人地址(方便form -> select组件使用)
      regenerateOrderSnStatus: 0, // 是否是重新生成订单号的
      express: {}, // 订单的快递信息
      expressInfo: { // 选择手动输入快递的信息
        logisticCode: '',
        deliveryId: null
      },
      expressCompany: [], // 所有快递公司类型
      sfHasValue: {} // 预览快递单的信息
    }
  },
  methods: {
    // 获取订单列表
    async getOrder (page, orderStatus, logisticCode, orderSn, consignee) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_ORDER.method,
          url: this.$api.GET_ORDER.url,
          params: {
            page,
            orderStatus,
            logisticCode,
            orderSn,
            consignee
          }
        })
        this.order = response.data.order
        this.count = response.data.count
        this.spinning = false
      } catch (err) {
        console.log('获取订单列表失败。[getOrder]', err)
        this.spinning = false
      }
    },
    // 获取自动发货状态
    async getAutomaticDeliveryStatus () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_AUTOMATIC_DELIVERY_STATUE.method,
          url: this.$api.GET_AUTOMATIC_DELIVERY_STATUE.url
        })
        if (response.data.status === 1) {
          this.autoGoDelivery = true
        } else {
          this.autoGoDelivery = false
        }
        this.spinning = false
      } catch (err) {
        console.log('获取自动发货状态失败。[getAutomaticDeliveryStatus]', err)
        this.spinning = false
      }
    },
    // 获取所有城市列表
    async getAllRegion () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_ALL_REGION.method,
          url: this.$api.GET_ALL_REGION.url
        })
        this.region = response.data.region
        this.spinning = false
      } catch (err) {
        console.log('获取所有城市列表失败。[getAllRegion]', err)
        this.spinning = false
      }
    },
    // 获取所有运费模板
    async getFreightTemplate () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_FREIGHT_TEMPLATE.method,
          url: this.$api.GET_FREIGHT_TEMPLATE.url
        })
        this.freightTemplate = response.data.template
        this.spinning = false
      } catch (err) {
        console.log('获取所有运费模板。[getFreightTemplate]', err)
        this.spinning = false
      }
    },
    // 切换tab页
    tabChange (key) {
      this.getOrder(this.page, this.orderStatus[parseInt(key) - 1], this.formState.logistic_code, this.formState.order_sn, this.formState.consignee)
    },
    deliveryTypeChange (value) {
      const target = value.target.value
      if (target === '2') {
        this.getExpressType()
      }
    },
    // 获取所有快递公司类型
    async getExpressType () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_EXPRESS_TYPE.method,
          url: this.$api.GET_EXPRESS_TYPE.url
        })
        this.expressCompany = response.data.type
        this.spinning = false
      } catch (err) {
        console.log('获取快递公司列表失败。[getExpressType]', err)
        this.spinning = false
      }
    },
    // 修改卖家留言
    async changeMemo (id, memo) {
      this.spinning = true
      try {
        await this.$axios({
          method: this.$api.POST_SAVE_SELLER_MEMO.method,
          url: this.$api.POST_SAVE_SELLER_MEMO.url,
          data: {
            order_id: id,
            memo
          }
        })
        this.spinning = false
        this.$message.success('保存成功!')
      } catch (err) {
        console.log('修改卖家留言失败。 [changeMemo]', err)
        this.spinning = false
      }
    },
    senderCascaderChange (value, options) {
      this.sender = {
        ...this.sender,
        province_id: options[0].value,
        city_id: options[1].value,
        district_id: options[2].value,
        province: options[0].label,
        city: options[1].label,
        district: options[2].label
      }
    },
    receiverCascaderChange (value, options) {
      this.receiver = {
        ...this.receiver,
        province_id: options[0].value,
        city_id: options[1].value,
        district_id: options[2].value,
        province: options[0].label,
        city: options[1].label,
        district: options[2].label
      }
    },
    // 运费模板修改时修改orderDetail的快递公司类型
    radioChange (value) {
      const id = value.target.value
      for (const item of this.freightTemplate) {
        if (item.id === id) {
          this.orderDetail.shipper_id = item.shipper_id
        }
      }
    },
    // 打开修改订单价格modal
    showRevisePrice (item) {
      this.getOrderDetail(item.id)
      this.showRevisePriceModal = true
    },
    // 获取指定订单的详情
    async getOrderDetail (orderId) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_ORDER_DETAIL.method,
          url: this.$api.GET_ORDER_DETAIL.url,
          params: {
            order_id: orderId
          }
        })
        this.orderDetail = response.data.detail
        this.receiver = response.data.receiver
        this.sender = response.data.sender
        this.receiverOptions = []
        this.receiverOptions.push(
          this.receiver.province_id,
          this.receiver.city_id,
          this.receiver.district_id
        )
        this.senderOptions = []
        this.senderOptions.push(
          this.sender.province_id,
          this.sender.city_id,
          this.sender.district_id
        )
        this.spinning = false
      } catch (err) {
        console.log('获取指定订单的详情失败。[getOrderDetail]', err)
        this.spinning = false
      }
    },
    // modal中修改商品价格input的handleChange
    changeGoodsPrice (value) {
      this.orderDetail.goods_price = value
      this.orderDetail.actual_price = Number(this.orderDetail.goods_price) + Number(this.orderDetail.freight_price)
    },
    // modal中修改商品运费input的handleChange
    changeFreightPrice (value) {
      this.orderDetail.freight_price = value
      this.orderDetail.actual_price = Number(this.orderDetail.goods_price) + Number(value)
    },
    // 提交修改订单价格请求
    async revisePrice () {
      if (this.orderDetail.actual_price === '' || this.orderDetail.actual_price === 0) {
        this.$message.error('总价不能为空!')
        return
      }
      this.spinning = true
      this.revisePriceConfirmLoading = true
      try {
        await this.$axios({
          method: this.$api.GET_REVISE_PRICE.method,
          url: this.$api.GET_REVISE_PRICE.url,
          params: {
            order_id: this.orderDetail.id,
            actual_price: this.orderDetail.actual_price,
            freight_price: this.orderDetail.freight_price,
            goods_price: this.orderDetail.goods_price
          }
        })
        this.getOrder(this.page, this.orderStatus[parseInt(this.activeKey) - 1], this.formState.logistic_code, this.formState.order_sn, this.formState.consignee)
        this.showRevisePriceModal = false
        this.spinning = false
        this.revisePriceConfirmLoading = false
      } catch (err) {
        console.log('修改订单价格失败。[revisePrice]', err)
        this.spinning = false
      }
    },
    // 点击《打印快递单/发货》按钮
    async printExpressBill (item) {
      await this.getOrderDetail(item.id)
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_CHECK_EXPRESS.method,
          url: this.$api.GET_CHECK_EXPRESS.url,
          params: {
            order_id: item.id
          }
        })
        if (response.data.count === 0) {
          // 还未有过快递单号
          this.showExpressBillForm = true
        } else {
          // 已有快递单号
          this.express = response.data.express
          this.showHadExpressBill = true
        }
        this.spinning = false
      } catch (err) {
        console.log('获取快递单信息失败。[printExpressBill]', err)
        this.spinning = false
      }
    },
    // 选择重新生成新订单号
    async regenerateOrderSn () {
      this.spinning = true
      this.regenerateOrderSnStatus = 1
      try {
        await this.$axios({
          method: this.$api.GET_REGENERATE_ORDER_SN.method,
          url: this.$api.GET_REGENERATE_ORDER_SN.url,
          params: {
            order_id: this.orderDetail.id
          }
        })
        this.spinning = false
        await this.getOrderDetail(this.orderDetail.id)
        this.showExpressBillForm = true
      } catch (err) {
        console.log('重新生成新订单号[regenerateOrderSn]', err)
        this.spinning = false
      }
    },
    // 选择使用已有的快递单打印 / 发货
    directPrintExpress () {
      this.spinning = true
      this.regenerateOrderSnStatus = 0
      this.sfHasValue = {
        LogisticCode: this.express.logistic_code,
        remark: this.orderDetail.remark,
        DestinatioCode: this.express.region_code,
        MarkDestination: this.express.region_code,
        send_time: this.express.send_time,
        MonthCode: this.express.MonthCode
      }
      this.showExpressBillForm = true
    },
    // 发货确认
    async delivery (id) {
      try {
        const response = await this.$axios({
          method: this.$api.POST_GO_DELIVERY.method,
          url: this.$api.POST_GO_DELIVERY.url,
          data: {
            order_id: id
          }
        })
        if (response.data.status === 200) {
          this.getOrder(this.page, this.orderStatus[parseInt(this.activeKey) - 1], this.formState.logistic_code, this.formState.order_sn, this.formState.consignee)
          this.$message.success('发货成功!')
        } else {
          this.$message.error('失败了!')
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 点击打印快递单中的 发货按钮
    modalGoDelivery () {
      console.log(this.orderDetail)
      console.log(this.sender)
      console.log(this.receiver)
    },
    modalPrintExpressAndDelivery () {
      console.log(this.orderDetail)
      console.log(this.sender)
      console.log(this.receiver)
    },
    modalOnlyPrintExpress () {
      console.log(this.orderDetail)
      console.log(this.sender)
      console.log(this.receiver)
    }
  },
  mounted () {
    this.getOrder(1, '101,102,103,202,203,300,301,302,303,401,801,802', '', '')
    this.getAutomaticDeliveryStatus()
    this.getAllRegion()
    this.getFreightTemplate()
  }
}
</script>

<style lang="scss" scoped>
.order-index {
  background: #fff;
  padding: 20px;
}
.order-main {
  .order-box {
    margin-bottom: 30px;
    border: 1px solid #f0f0f0;
    padding: 20px;
  }
  .off-text {
    color: #fff;
    border-radius: 4px;
    background: #594d72;
    height: 15px;
    line-height: 15px;
    padding: 4px 10px;
    font-size: 14px;
    margin-right: 10px;
  }
  .express-box {
    color: #f0797f;
    background-color: #f0f0f0;
    font-weight: 600;
    border-radius: 4px;
    padding: 10px;
  }
  .postscript-box {
    color: #f0797f;
    background-color: #fbf7c5;
    font-weight: 600;
    border-radius: 4px;
    padding: 10px;
  }
}
.buyer-memo {
  color: #333;
  font-size: 14px;
  line-height: 20px;
  margin-top: 4px;
  background-color: #fbf7c5;
  padding: 10px;
  margin: 10px 0;
}
.seller-memo {
  color: #333;
  font-size: 14px;
  line-height: 20px;
  margin-top: 4px;
  background-color: #fde7e7;
  padding: 10px;
  margin: 10px 0;
}
</style>
