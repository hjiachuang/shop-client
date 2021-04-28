<template>
  <a-spin :spinning="spinning">
    <div class="content-box goods-list">
      <div class="btn-group">
        <a-button :type="sort === 'default'? 'primary':'default'" @click="changeSort('default')" style="margin-right: 10px">默认排序</a-button>
        <a-button :type="sort === 'sale'? 'primary':'default'" @click="changeSort('sale')" style="margin-right: 10px">按销量排序</a-button>
        <a-button :type="sort === 'price'? 'primary':'default'" @click="changeSort('price')" style="margin-right: 10px">按售价排序</a-button>
        <a-button :type="sort === 'stock'? 'primary':'default'" @click="changeSort('stock')">按库存排序</a-button>
        <a-button style="float: right" type="primary" @click="edit('add')">添加商品</a-button>
      </div>
      <a-tabs v-model:activeKey="status" @change="changeStatus" style="margin-top: 20px">
        <a-tab-pane key="1" tab="全部商品" />
        <a-tab-pane key="2" tab="出售中" />
        <a-tab-pane key="3" tab="已售完" />
        <a-tab-pane key="4" tab="已下架" />
      </a-tabs>
      <a-form :modal="formData" layout="inline">
        <a-form-item label="商品名称">
          <a-input v-model:value="formData.name" placeHolder="请输入商品名称"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="getGoodsList(sort, status, 1, formData.name)">查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-button @click="formData.name = ''; getGoodsList(sort, status, 1, formData.name);">清空</a-button>
        </a-form-item>
      </a-form>
      <a-table
        :columns="columns"
        :data-source="goodsList"
        :pagination="tablePagination"
        :rowKey="(row) => row.id"
        style="margin-top: 10px"
        >
        <template #pic="{text}">
          <a-image
            :src="text"
            fallback="/images/fallback.png"
            :preview="false"
            alt="商品图片"
            :width="60"
            :height="60"
          ></a-image>
        </template>
        <template #sort="{record}">
          <a-input-number v-model:value="record.sort_order" :min="1" @change="changeGoodsStatus('sort', record)"></a-input-number>
        </template>
        <template #isIndex="{record}">
          <a-switch v-model:checked="record.is_index" @change="changeGoodsStatus('index', record)"></a-switch>
        </template>
        <template #isOnSale="{record}">
          <a-switch v-model:checked="record.is_on_sale" @change="changeGoodsStatus('sale', record)"></a-switch>
        </template>
        <template #operation="{record}">
          <a-button type="primary" style="margin-right: 10px" @click="edit('edit', record)">编辑</a-button>
          <a-button type="danger" @click="edit('delete',record)">删除</a-button>
        </template>
        <template #expandedRowRender="{record}">
          <a-table :columns="innerColumns" :data-source="record.product" :pagination="false" size="small" />
        </template>
      </a-table>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'GoodsList',
  data () {
    return {
      spinning: false,
      sort: 'default', // sale销量 price售价 stock库存
      status: '2',
      formData: {
        name: ''
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '商品图片',
          dataIndex: 'list_pic_url',
          key: 'list_pic_url',
          slots: {
            customRender: 'pic'
          }
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '分类',
          dataIndex: 'category_name',
          key: 'category_name'
        },
        {
          title: '排序',
          dataIndex: 'sort_order',
          key: 'sort_order',
          slots: {
            customRender: 'sort'
          }
        },
        {
          title: '销量',
          dataIndex: 'sell_volume',
          key: 'sell_volume'
        },
        {
          title: '库存',
          dataIndex: 'goods_number',
          key: 'goods_number'
        },
        {
          title: '首页显示',
          dataIndex: 'is_index',
          key: 'is_index',
          slots: {
            customRender: 'isIndex'
          }
        },
        {
          title: '上架',
          dataIndex: 'is_on_sale',
          key: 'is_on_sale',
          slots: {
            customRender: 'isOnSale'
          }
        },
        {
          title: '操作',
          key: 'operation',
          slots: {
            customRender: 'operation'
          }
        }
      ],
      innerColumns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '商品SKU',
          dataIndex: 'goods_sn',
          key: 'goods_sn'
        },
        {
          title: '快递单上的简称',
          dataIndex: 'goods_name',
          key: 'goods_name'
        },
        {
          title: '型号/规格',
          dataIndex: 'value',
          key: 'value'
        },
        {
          title: '成本(元)',
          dataIndex: 'cost',
          key: 'cost'
        },
        {
          title: '零售(元)',
          dataIndex: 'retail_price',
          key: 'retail_price'
        },
        {
          title: '重量(KG)',
          dataIndex: 'goods_weight',
          key: 'goods_weight'
        },
        {
          title: '库存',
          dataIndex: 'goods_number',
          key: 'goods_number'
        }
      ],
      tablePagination: {
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        total: 0,
        onChange: (page) => {
          this.getGoodsList(this.sort, this.status, page, this.formData.name)
          this.page = page
        }
      },
      page: 1,
      goodsList: []
    }
  },
  methods: {
    async getGoodsList (sort, status, page, name) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_GOODS_LIST.method,
          url: this.$api.GET_GOODS_LIST.url,
          params: {
            sort,
            status,
            page,
            name
          }
        })
        this.goodsList = response.data.list
        this.tablePagination.total = response.data.count
        this.spinning = false
      } catch (err) {
        console.log('获取商品列表失败。[getGoodsList]', err)
        this.spinning = false
      }
    },
    async edit (type, data = null) {
      if (type === 'delete') {
        this.$modal.confirm({
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          maskClosable: true,
          content: '确定删除此商品?',
          onOk: async () => {
            this.spinning = true
            try {
              await this.$axios({
                method: this.$api.DELETE_GOODS.method,
                url: this.$api.DELETE_GOODS.url,
                params: {
                  id: data.id
                }
              })
              this.$message.success('删除成功')
              this.spinning = false
              this.getGoodsList(this.sort, this.status, 1, this.formData.name)
            } catch (err) {
              console.log('删除商品失败。[edit]', err)
              this.spinning = false
            }
          }
        })
      } else {
        let id = ''
        if (type === 'edit') {
          id = data.id
        }
        this.$router.push('/goods/edit?id=' + id)
      }
    },
    changeSort (sort) {
      this.sort = sort
      this.getGoodsList(this.sort, this.status, 1, this.formData.name)
    },
    changeStatus (key) {
      this.getGoodsList(this.sort, key, 1, this.formData.name)
    },
    async changeGoodsStatus (type, data) {
      let update = null
      if (type === 'sort') {
        update = {
          type,
          id: data.id,
          sort_order: data.sort_order
        }
      } else if (type === 'index') {
        update = {
          type,
          id: data.id,
          is_index: data.is_index
        }
      } else if (type === 'sale') {
        update = {
          type,
          id: data.id,
          is_on_sale: data.is_on_sale
        }
      }
      try {
        await this.$axios({
          method: this.$api.CHANGE_GOODS_STATUS.method,
          url: this.$api.CHANGE_GOODS_STATUS.url,
          data: update
        })
        this.getGoodsList(this.sort, this.status, this.page, this.formData.name)
      } catch (err) {
        console.log(err)
        this.spinning = false
        this.getGoodsList(this.sort, this.status, this.page, this.formData.name)
      }
    }
  },
  mounted () {
    this.getGoodsList(this.sort, this.status, 1, '')
  }
}
</script>
