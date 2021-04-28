<template>
  <a-spin :spinning="spinning">
    <div class="content-main">
      <a-row class="header" :gutter="[10,10]">
      <a-col :sm="24" :md="12" :lg="8">
        <a-card class="header-card card-red">
          <router-link class="router-link" to="/order">
            <a-statistic title="待发货订单" valueStyle="color: #fff" :value="info.orderToDelivery" />
          </router-link>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :lg="8">
        <a-card class="header-card card-green">
          <router-link class="router-link" to="/goods">
            <a-statistic title="上架中的商品" valueStyle="color: #fff" :value="info.goodsOnsale" />
          </router-link>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :lg="8">
        <a-card class="header-card card-yellow">
          <router-link class="router-link" to="/user">
            <a-statistic title="总用户数" valueStyle="color: #fff" :value="info.user" />
          </router-link>
        </a-card>
      </a-col>
      </a-row>
      <div class="main">
      <a-tabs class="main-tab" type="card" size="small" v-model:activeKey="activeKey" @change="tabClick">
        <a-tab-pane key="1" tab="今天"></a-tab-pane>
        <a-tab-pane key="2" tab="昨天" force-render></a-tab-pane>
        <a-tab-pane key="3" tab="最近7天"></a-tab-pane>
        <a-tab-pane key="4" tab="最近30天"></a-tab-pane>
      </a-tabs>
      <a-row class="main-list" :gutter="[10,10]">
        <a-col :sm="24" :md="12" :lg="8">
          <a-card class="main-card" title="顾客">
            <template #extra><a type="primary" @click.prevent="seeClick">查看</a></template>
            <div class="item">
              <span>新增</span>
              <h3 style="float: right; font-weight: 700;">{{main.newUser}}</h3>
            </div>
            <div class="item">
                <span>老顾客</span>
                <h3 style="float: right; font-weight: 700;">{{main.oldUser}}</h3>
            </div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8">
          <a-card class="main-card" title="下单">
            <div class="item">
              <span>加入购物车</span>
              <h3 style="float: right; font-weight: 700;">{{main.addCart}}</h3>
            </div>
            <div class="item">
                <span>提交订单数/金额</span>
                <h3 style="float: right; font-weight: 700;">{{main.addOrderNum}} / {{main.addOrderSum}}</h3>
            </div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8">
          <a-card class="main-card" title="支付">
            <div class="item">
              <span>成交订单数</span>
              <h3 style="float: right; font-weight: 700;">{{main.payOrderNum}}</h3>
            </div>
            <div class="item">
                <span>成交金额</span>
                <h3 style="float: right; font-weight: 700;">{{main.payOrderSum}}</h3>
            </div>
          </a-card>
        </a-col>
      </a-row>
      </div>
      <a-divider />
      <a-row class="footer" :gutter="[10,10]">
      <a-col :sm="24" :md="12" :lg="8">
        <a-card class="footer-card">
          <div class="item">
            <span>客单价</span>
            <h3 style="float: right; font-weight: 700;">{{main.payOrderSum / main.payOrderNum || 0}}</h3>
          </div>
          <p class="tips">成交金额/成交订单数</p>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :lg="8">
        <a-card class="footer-card">
          <div class="item">
            <span>下单转化率</span>
            <h3 style="float: right; font-weight: 700;">{{main.addOrderNum / (main.newUser + main.oldUser) || 0}}</h3>
          </div>
          <p class="tips">下单人数/访问人数</p>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :lg="8">
        <a-card class="footer-card">
          <div class="item">
            <span>下单-支付转化率</span>
            <h3 style="float: right; font-weight: 700;">{{main.payOrderNum / main.addOrderNum || 0}}</h3>
          </div>
          <p class="tips">支付人数/下单人数</p>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :lg="8">
        <a-card class="footer-card">
          <div class="item">
            <span>支付转化率</span>
            <h3 style="float: right; font-weight: 700;">{{main.payOrderNum / (main.newUser + main.oldUser) || 0}}</h3>
          </div>
          <p class="tips">支付人数/访问人数</p>
        </a-card>
      </a-col>
      </a-row>
      <a-modal
        v-model:visible="modalVisible"
        :closable="false"
        centered
        destroyOnClose
        :width="700"
        :footer="null"
        :bodyStyle="{ padding: '12px' }"
        >
        <a-tabs class="modal-tab" type="card" size="small" v-model:activeKey="modalActiveKey" @change="modalTabClick">
          <a-tab-pane key="1" tab="新增"></a-tab-pane>
          <a-tab-pane key="2" tab="老客户"></a-tab-pane>
        </a-tabs>
        <a-table
          :data-source="modalTableData"
          :pagination="false"
          :scroll="{ y: 640 }"
          :rowKey="row => row.id"
        >
          <a-table-column key="avatar" title="头像" data-index="avatar" :width="80">
            <template #default="{ text: image }">
              <a-image :src="image"></a-image>
            </template>
          </a-table-column>
          <a-table-column key="nickname" title="昵称" data-index="nickname" :width="140" />
          <a-table-column key="gender" title="性别" data-index="gender" :width="80">
            <template #default="{ text: gender }">
              {{gender === 2 ? '女' : '男'}}
            </template>
          </a-table-column>
          <a-table-column key="register_time" title="注册时间" data-index="register_time" :width="170" />
          <a-table-column key="action" title="最近登录" data-index="last_login_time" :width="170" />
        </a-table>
      </a-modal>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      spinning: false,
      activeKey: '1',
      modalActiveKey: '1',
      modalVisible: false,
      modalColumns: [
        {
          title: '头像',
          dataIndex: 'avatar'
        },
        {
          title: '昵称',
          dataIndex: 'nickname'
        },
        {
          title: '性别',
          dataIndex: 'gender'
        },
        {
          title: '注册时间',
          dataIndex: 'register_time'
        },
        {
          title: '最近登录',
          dataIndex: 'last_login_time'
        }
      ],
      info: {},
      main: {},
      modalTableData: [],
      timer: null
    }
  },
  methods: {
    async tabClick (activeKey) {
      clearInterval(this.timer)
      await this.getMain(activeKey)
      this.startTimer()
    },
    modalTabClick (activeKey) {
      if (activeKey === '1') {
        this.modalTableData = this.main.newData
      } else {
        this.modalTableData = this.main.oldData
      }
    },
    async getInfo () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_HOME_INFO.method,
          url: this.$api.GET_HOME_INFO.url
        })
        if (response) {
          this.info = response.data
        } else {
          this.info = {
            goodsOnsale: 0,
            orderToDelivery: 0,
            user: 0
          }
        }
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    async getMain (index) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_HOME_MAIN.method,
          url: this.$api.GET_HOME_MAIN.url,
          params: {
            index
          }
        })
        if (response) {
          this.main = response.data
          this.modalTableData = response.data.newData
          this.modalActiveKey = '1'
        } else {
          this.main = {
            newData: [],
            newUser: 0,
            oldData: [],
            oldUser: 0,
            addCart: 0,
            addOrderNum: 0,
            addOrderSum: 0,
            payOrderNum: 0,
            payOrderSum: 0
          }
        }
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    seeClick () {
      this.modalVisible = true
    },
    startTimer () {
      this.timer = setInterval(async () => {
        this.spinning = true
        await this.getInfo()
        await this.getMain(this.activeKey)
        this.spinning = false
      }, 5 * 60 * 1000)
    }
  },
  async mounted () {
    clearInterval(this.timer)
    await this.getInfo()
    await this.getMain(1)
    this.startTimer()
  },
  beforeUnmount () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.content-main {
  background: #ffffff;
  padding: 20px;
  .header-card {
    border: none;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    &.card-green {
      background: #11b95c;
    }
    &.card-red {
      background: #e64242;
    }
    &.card-yellow{
      background: #f8dd66;
    }
  }
  .main {
    margin-top: 36px;
  }
  .main-card {
    @extend .header-card;
  }
  .item {
    padding: 8px 0;
  }
  .footer-card {
    @extend .header-card;
    .tips {
      color: #8c939d;
      font-size: 13px;
    }
  }
}

</style>
