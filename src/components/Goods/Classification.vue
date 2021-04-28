<template>
  <a-spin :spinning="spinning">
    <div class="content-box goods-classification">
      <a-tabs v-model:activeKey="activeKey" @change="tabChange">
        <a-tab-pane key="1" tab="分类设置" @click="getCategoryList" />
        <a-tab-pane key="2" tab="型号设置" @click="getSpecificationList"/>
      </a-tabs>
      <div v-if="activeKey === '1'">
        <router-link to="/classification/category">
          <a-button type="primary">添加分类</a-button>
        </router-link>
        <a-table
          :columns="categoryColumns"
          :data-source="category"
          :pagination="false"
          :rowKey="(row) => row.id"
          style="margin-top: 10px">
          <template #iconDisplay="{record}">
            <a-switch v-model:checked="record.icon_display" @change="changeIconDisplay(record)"></a-switch>
          </template>
          <template #showIndex="{record}">
            <a-switch v-model:checked="record.show_index" @change="changeShowIndex(record)"></a-switch>
          </template>
          <template #sort="{record}">
            <a-input-number v-model:value="record.sort_order" :min="1" @blur="changeSortOrder(record)"></a-input-number>
          </template>
          <template #operation="{record}">
            <a-button type="primary" style="margin-right: 10px" @click="edit('edit', record)">编辑</a-button>
            <a-button type="danger" @click="edit('delete',record)">删除</a-button>
          </template>
        </a-table>
      </div>
      <div v-else>
        <router-link to="/classification/specification">
          <a-button type="primary">添加型号</a-button>
        </router-link>
        <a-table
          :columns="specificationColumns"
          :data-source="specification"
          :pagination="false"
          :rowKey="(row) => row.id"
          style="margin-top: 10px">
          <template #name="{record}">
            <a-input v-model:value="record.name" @blur="changeSpecificationName(record)"></a-input>
          </template>
          <template #sort="{record}">
            <a-input-number v-model:value="record.sort_order" :min="1" @blur="changeSpecificationSortOrder(record)"></a-input-number>
          </template>
          <template #operation="{record}">
            <a-button type="danger" @click="deleteSpecification(record)">删除</a-button>
          </template>
        </a-table>
      </div>
    </div>
  </a-spin>
</template>

<script>
export default {
  name: 'GoodsClassification',
  data () {
    return {
      spinning: false,
      activeKey: '1',
      category: [],
      categoryColumns: [
        {
          title: '分类名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '图标显示',
          dataIndex: 'icon_display',
          key: 'icon_display',
          slots: {
            customRender: 'iconDisplay'
          }
        },
        {
          title: '首页显示',
          dataIndex: 'show_index',
          key: 'show_index',
          slots: {
            customRender: 'showIndex'
          }
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
          title: '操作',
          key: 'operation',
          slots: {
            customRender: 'operation'
          }
        }
      ],
      specification: [],
      specificationColumns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '型号名',
          dataIndex: 'name',
          key: 'name',
          slots: {
            customRender: 'name'
          }
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
          title: '操作',
          key: 'operation',
          slots: {
            customRender: 'operation'
          }
        }
      ]
    }
  },
  methods: {
    tabChange (key) {
      if (key === '1') {
        this.getCategoryList()
      } else if (key === '2') {
        this.getSpecificationList()
      }
    },
    async getCategoryList () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_ALL_CATEGORY.method,
          url: this.$api.GET_ALL_CATEGORY.url
        })
        this.category = response.data.category
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    async getSpecificationList () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_ALL_SPECIFICATION.method,
          url: this.$api.GET_ALL_SPECIFICATION.url
        })
        this.specification = response.data.specification
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    changeIconDisplay (data) {
      console.log('???')
      const request = {
        id: data.id,
        icon_display: data.icon_display
      }
      this.changeStatus('CHANGE_CATEGORY_ICON_DISPLAY', request)
    },
    changeShowIndex (data) {
      const request = {
        id: data.id,
        show_index: data.show_index
      }
      this.changeStatus('CHANGE_CATEGORY_SHOW_INDEX', request)
    },
    changeSortOrder (data) {
      const request = {
        id: data.id,
        sort_order: data.sort_order
      }
      this.changeStatus('CHANGE_CATEGORY_SORT_ORDER', request)
    },
    changeSpecificationName (data) {
      const request = {
        id: data.id,
        name: data.name
      }
      this.changeStatus('CHANGE_SPECIFICATION_NAME', request)
    },
    changeSpecificationSortOrder (data) {
      const request = {
        id: data.id,
        sort_order: data.sort_order
      }
      this.changeStatus('CHANGE_SPECIFICATION_SORT_ORDER', request)
    },
    edit (type, data) {
      if (type === 'edit') {
        this.$router.push(`/classification/category?id=${data.id}`)
      } else if (type === 'delete') {
        this.$modal.confirm({
          title: '提示',
          content: '确定要删除该分类?',
          cancelText: '取消',
          okText: '确定',
          onOk: () => {
            this.changeStatus('DELETE_CATEGORY', {
              id: data.id
            })
          }
        })
      }
    },
    deleteSpecification (data) {
      this.$modal.confirm({
        title: '提示',
        content: '确定要删除该类型?',
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          this.changeStatus('DELETE_SPECIFICATION', {
            id: data.id
          })
        }
      })
    },
    async changeStatus (type, data) {
      this.spinning = true
      try {
        await this.$axios({
          method: this.$api[type].method,
          url: this.$api[type].url,
          data
        })
        this.spinning = false
        if (this.activeKey === '1') {
          this.getCategoryList()
        } else if (this.activeKey === '2') {
          this.getSpecificationList()
        }
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    }
  },
  mounted () {
    this.getCategoryList()
  }
}
</script>
