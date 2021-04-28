<template>
  <div class="user-index">
    <a-form layout="inline" :model="formState">
      <a-form-item label="用户昵称">
        <a-input
          v-model:value="formState.nickname"
          placeholder="请输入用户昵称"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          @click="() => getUser(1, 20, formState.nickname)"
          >查询</a-button
        >
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          @click="
            () => {
              formState.nickname = '';
              getUser();
            }
          "
          >重置</a-button
        >
      </a-form-item>
    </a-form>
    <a-table
      :data-source="tableData"
      :pagination="tablePagination"
      :rowKey="(row) => row.id"
      style="margin-top: 10px"
      :loading="tableLoading"
    >
      <a-table-column key="id" title="ID" data-index="id" :width="80" />
      <a-table-column key="avatar" title="头像" data-index="avatar" :width="60">
        <template #default="{ text: image }">
          <a-image
            :src="image"
            fallback="/images/fallback.png"
            :preview="false"
            alt="头像"
            :width="60"
            :height="60"
          ></a-image>
        </template>
      </a-table-column>
      <a-table-column key="nickname" title="昵称" data-index="nickname" />
      <a-table-column key="gender" title="性别" data-index="gender">
        <template #default="{ text: gender }">
          {{ gender === 2 ? "女" : "男" }}
        </template>
      </a-table-column>
      <a-table-column
        key="register_time"
        title="注册时间"
        data-index="register_time"
      />
      <a-table-column
        key="action"
        title="最近登录"
        data-index="last_login_time"
      />
      <a-table-column key="action" title="登录IP" data-index="last_login_ip" />
      <a-table-column key="action" title="操作">
        <template #default="{ record }">
          <a-button type="primary" @click="$router.push(`/user/info?id=${record.id}`)">查看</a-button>
        </template>
      </a-table-column>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'UserIndex',
  data () {
    return {
      spinning: false,
      tableLoading: false,
      formState: {
        nickname: ''
      },
      tablePagination: {
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        total: 0,
        onChange: (page) => this.getUser(page, 20, this.formState.nickname)
      },
      tableData: [],
      editableData: []
    }
  },
  methods: {
    async getUser (page = 1, size = 20, nickname = '') {
      this.tableLoading = true
      const response = await this.$axios({
        method: this.$api.GET_ALL_USER.method,
        url: this.$api.GET_ALL_USER.url,
        params: {
          page,
          size,
          nickname
        }
      })
      this.tableData = response.data.userlist
      this.tablePagination.total = response.data.total
      this.tableLoading = false
    }
  },
  mounted () {
    this.getUser()
  }
}
</script>

<style lang="scss" scoped>
.user-index {
  background: #fff;
  padding: 20px;
}
</style>
