<template>
  <a-spin :spinning="spinning">
    <div class="content-box">
      <a-button type="primary" style="margin-bottom: 14px" @click="showAddModal = true">添加新管理员</a-button>
      <a-table
        :data-source="administrators"
        :pagination="pagination"
        :rowKey="(row) => row.id"
        bordered
        >
        <a-table-column key="id" title="ID" data-index="id" />
        <a-table-column key="name" title="昵称" data-index="name" />
        <a-table-column key="username" title="用户名" data-index="username" />
        <a-table-column key="email" title="邮箱地址" data-index="email" />
        <a-table-column key="last_login_time" title="最后一次登录时间" data-index="last_login_time" />
        <a-table-column key="last_login_ip" title="最后一次登录IP" data-index="last_login_ip" />
        <a-table-column>
          <template #default="{ record }" >
            <a-button type="primary" style="margin-right: 10px" @click="edit(record)">编辑</a-button>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </a-spin>
  <a-modal
    v-model:visible="showAddModal"
    title="添加管理员"
    :width="650"
    okText="保存"
    cancelText="取消"
    @ok="addAdministrators"
  >
    <a-form ref="addForm" :model="addData" :rules="addRules" :label-col="{span: 4}" :wrapper-col="{span: 14}">
      <a-form-item label="用户名" name="username" help="用户名一旦创建不可更改">
        <a-input v-model:value="addData.username" placeholder="请输入用户名"></a-input>
      </a-form-item>
      <a-form-item label="昵称" name="name">
        <a-input v-model:value="addData.name" placeholder="请输入昵称"></a-input>
      </a-form-item>
      <a-form-item label="邮箱地址" name="email" help="用于找回密码">
        <a-input v-model:value="addData.email" placeholder="请输入邮箱地址"></a-input>
      </a-form-item>
      <a-form-item label="密码" name="password" help="初始密码，需登录之后才能更改密码">
        <a-input value="123456" disabled></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:visible="showEditModal"
    title="编辑管理员"
    :width="650"
    okText="保存"
    cancelText="取消"
    @ok="editAdministrators"
  >
    <a-form ref="editForm" :model="editData" :rules="editRules" :label-col="{span: 4}" :wrapper-col="{span: 14}">
      <a-form-item label="用户名" name="username" help="用户名不可更改">
        <a-input v-model:value="editData.username" disabled></a-input>
      </a-form-item>
      <a-form-item label="昵称" name="name">
        <a-input v-model:value="editData.name" placeholder="请输入昵称"></a-input>
      </a-form-item>
      <a-form-item label="邮箱地址" name="email" help="用于找回密码">
        <a-input v-model:value="editData.email" placeholder="请输入邮箱地址"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'Administrators',
  data () {
    return {
      spinning: false,
      administrators: [],
      page: 1,
      pagination: {
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        total: 0,
        onChange: (page) => {
          this.getAdministrators(page)
          this.page = page
        }
      },
      showAddModal: false,
      showEditModal: false,
      addData: {
        id: '',
        username: '',
        name: '',
        email: ''
      },
      editData: {},
      addRules: {
        username: [
          {
            required: true, message: '请输入用户名', trigger: 'blur'
          },
          {
            min: 6, max: 16, message: '用户名长度应在 6~16 之间', trigger: 'blur'
          }
        ],
        name: [
          {
            required: true, message: '请输入昵称', trigger: 'blur'
          }
        ],
        email: [
          {
            required: true, message: '请输入邮箱地址', trigger: 'blur'
          },
          {
            type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'
          }
        ]
      },
      editRules: {
        name: [
          {
            required: true, message: '请输入昵称', trigger: 'blur'
          }
        ],
        email: [
          {
            required: true, message: '请输入邮箱地址', trigger: 'blur'
          },
          {
            type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getAdministrators (page) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_ADMINISTRATORS.method,
          url: this.$api.GET_ADMINISTRATORS.url,
          params: {
            page
          }
        })
        this.administrators = response.data.list
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    edit (data) {
      this.editData = Object.assign({}, data)
      this.showEditModal = true
    },
    async addAdministrators () {
      try {
        await this.$refs.addForm.validate()
        this.spinning = true
        try {
          await this.$axios({
            method: this.$api.ADD_ADMINISTRATORS.method,
            url: this.$api.ADD_ADMINISTRATORS.url,
            data: {
              administrator: this.addData
            }
          })
          this.spinning = false
          this.showAddModal = false
          this.getAdministrators(this.page)
        } catch (err) {
          console.log(err)
          this.spinning = false
          if (err.msg && err.msg === '用户名已存在') {
            this.addData.username = ''
          }
        }
      } catch (err) {
        console.log('表单验证失败', err)
      }
    },
    async editAdministrators () {
      try {
        await this.$refs.editForm.validate()
        this.spinning = true
        try {
          await this.$axios({
            method: this.$api.EDIT_ADMINISTRATORS.method,
            url: this.$api.EDIT_ADMINISTRATORS.url,
            data: {
              administrator: this.editData
            }
          })
          this.spinning = false
          this.showEditModal = false
          this.getAdministrators(this.page)
        } catch (err) {
          console.log(err)
          this.spinning = false
        }
      } catch (err) {
        console.log('表单验证失败', err)
      }
    }
  },
  mounted () {
    this.getAdministrators(1)
  }
}
</script>
