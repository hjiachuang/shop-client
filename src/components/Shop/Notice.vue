<template>
  <a-spin :spinning="spinning">
    <div class="content-box">
      <a-button type="primary" style="margin-bottom: 14px" @click="edit">添加新公告</a-button>
      <a-table
        :data-source="notice"
        :pagination="pagination"
        :rowKey="(row) => row.id"
        bordered
        >
        <a-table-column key="id" title="ID" data-index="id" />
        <a-table-column key="title" title="标题" data-index="title" />
        <a-table-column key="content" title="内容" data-index="content" />
        <a-table-column key="start_time" title="开始时间" data-index="start_time" />
        <a-table-column key="end_time" title="结束时间" data-index="end_time" />
        <a-table-column title="状态">
          <template #default="{ record }">
            <span v-if="record.is_delete">已删除</span>
            <span v-else-if="record.is_expire">已过期</span>
            <span v-else>启用中</span>
          </template>
        </a-table-column>
        <a-table-column>
          <template #default="{ record }" >
            <a-button type="primary" style="margin-right: 10px" @click="edit('edit', record)" v-if="!record.is_delete">编辑</a-button>
            <a-button type="danger" v-if="!record.is_delete" @click="deleteNotice(record)">删除</a-button>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </a-spin>
  <a-modal
    v-model:visible="showModal"
    title="添加/编辑公告"
    :width="650"
    okText="保存"
    cancelText="取消"
    @ok="modalOk"
  >
    <a-form ref="form" :model="modalData" :rules="rules" :label-col="{span: 24}" :wrapper-col="{span: 24}">
      <a-form-item label="标题" name="title">
        <a-input v-model:value="modalData.title"></a-input>
      </a-form-item>
      <a-form-item label="内容" name="content">
        <a-textarea v-model:value="modalData.content" showCount/>
      </a-form-item>
      <a-form-item label="开始时间">
        <a-date-picker :defaultPickerValue="moment('2021-01-01 00:00:00')" v-model:value="modalData.start_time" valueFormat="YYYY-MM-DD HH:mm:ss" show-time placeholder="请选择日期时间" :locale="locale" />
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker v-model:value="modalData.end_time" valueFormat="YYYY-MM-DD HH:mm:ss" show-time placeholder="请选择日期时间" :locale="locale" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
export default {
  name: 'Notice',
  data () {
    return {
      spinning: false,
      moment,
      locale,
      notice: [],
      page: 1,
      pagination: {
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        total: 0,
        onChange: (page) => {
          this.getNotice(page)
          this.page = page
        }
      },
      showModal: false,
      modalData: {},
      rules: {
        title: [
          {
            required: true, message: '请输入公告标题', trigger: 'blur'
          }
        ],
        content: [
          {
            required: true, message: '请输入公告内容', trigger: 'blur'
          },
          {
            max: 100, message: '字数最多只能100个', trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    async getNotice (page) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_NOTICE.method,
          url: this.$api.GET_NOTICE.url,
          params: {
            page
          }
        })
        this.notice = response.data.notice
        this.pagination.total = response.data.total
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    edit (type, data) {
      if (type === 'edit') {
        this.modalData = Object.assign({}, data)
      } else {
        this.modalData = {
          id: '',
          title: '',
          content: '',
          start_time: moment().hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          end_time: moment().hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss'),
          is_delete: 0,
          is_expire: 0
        }
      }
      this.showModal = true
    },
    async deleteNotice (data) {
      this.spinning = true
      try {
        await this.$axios({
          method: this.$api.DELETE_NOTICE.method,
          url: this.$api.DELETE_NOTICE.url,
          data: {
            id: data.id
          }
        })
        this.spinning = false
        this.getNotice(this.page)
      } catch (err) {
        console.log(err)
        this.spinning = fasle
      }
    },
    async modalOk () {
      try {
        await this.$refs.form.validate()
        if (parseInt(moment(this.modalData.end_time).format('X')) <= parseInt(moment(this.modalData.start_time).format('X'))) {
          return this.$message.error('开始时间不能大于等于结束时间')
        } else {
          this.spinning = true
          try {
            await this.$axios({
              method: this.$api.SAVE_NOTICE.method,
              url: this.$api.SAVE_NOTICE.url,
              data: {
                notice: this.modalData
              }
            })
            this.spinning = false
            this.showModal = false
            this.getNotice(this.page)
          } catch (err) {
            console.log('发送ajax请求失败', err)
            this.spinning = false
          }
        }
      } catch (err) {
        console.log('表单校验失败', err)
      }
    }
  },
  mounted () {
    this.getNotice(1)
  }
}
</script>
