<template>
  <a-spin :spinning="spinning">
    <div class="content-box">
      <a-form :label-col="{span: 24}" :wrapper-col="{span: 24}" ref="form" :model="advertisement">
        <a-form-item label="商品图片" name="list_pic_url">
          <div class="clearfix">
            <a-upload
              list-type="picture-card"
              v-model:file-list="list_pic_url"
              :before-upload="beforeUpload"
              :customRequest="uploadImage"
              :remove="() => {
                advertisement.image_url = ''
                return true
              }"
              @preview="handlePreview"
            >
              <div v-if="list_pic_url.length < 1">
                <plus-outlined />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </div>
          <small>图片尺寸要求： 宽度750，高度300</small>
        </a-form-item>
        <a-form-item label="商品类型" name="link_type">
          <a-radio-group v-model:value="advertisement.link_type">
            <a-radio :value="0">商品ID</a-radio>
            <a-radio :value="1">链接</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="商品ID" name="goods_id" v-if="advertisement.link_type === 0">
          <a-input v-model:value="advertisement.goods_id" placeholder="请输入商品ID"></a-input>
          <a-button type="primary" @click="() => {modalVisible = true; getGoodsSimpleList()}">选择关联商品</a-button>
        </a-form-item>
        <a-form-item label="广告链接" name="link" v-if="advertisement.link_type === 1">
          <a-input v-model:value="advertisement.link" placeholder="请输入广告链接"></a-input>
        </a-form-item>
        <a-form-item label="结束时间" name="end_time">
          <a-date-picker v-model:value="advertisement.end_time" valueFormat="YYYY-MM-DD HH:mm:ss" show-time placeholder="请选择日期时间" :locale="locale" />
        </a-form-item>
        <a-form-item label="排序" name="sort_order">
          <a-input-number v-model:value="advertisement.sort_order" :min="1" :max="100"></a-input-number>
        </a-form-item>
        <a-form-item label="启用广告" name="enabled">
          <a-switch v-model:checked="advertisement.enabled"></a-switch>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" style="margin-right: 10px" @click="submitAdvertisement">保存</a-button>
          <a-button @click="$router.go(-1)">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-spin>
  <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
    <img alt="预览图片" style="width: 100%" :src="previewImage" />
  </a-modal>
  <a-modal
        v-model:visible="modalVisible"
        :closable="false"
        centered
        destroyOnClose
        :width="700"
        :footer="null"
        :bodyStyle="{ padding: '12px' }"
        >
        <a-table
          :data-source="modalTableData"
          :pagination="tablePagination"
          :scroll="{ y: 640 }"
          :rowKey="row => row.id"
        >
          <a-table-column key="id" title="ID" data-index="id" />
          <a-table-column key="img_url" title="商品图片" data-index="img_url">
            <template #default="{ text: image }">
              <a-image :src="image" :width="80" :height="80"></a-image>
            </template>
          </a-table-column>
          <a-table-column key="name" title="商品名称" data-index="name" :width="240" />
          <a-table-column title="操作">
            <template #default="{record}">
              <a-button type="danger" @click="select(record)" :disabled="record.id === advertisement.goods_id">选择</a-button>
            </template>
          </a-table-column>
       </a-table>
      </a-modal>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
export default {
  name: 'EditAdvertisement',
  data () {
    return {
      spinning: false,
      advertisement: {},
      list_pic_url: [],
      previewVisible: false,
      previewImage: null,
      locale,
      modalVisible: false,
      modalTableData: [],
      tablePagination: {
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        total: 0,
        onChange: (page) => {
          this.getGoodsSimpleList(page)
          this.page = page
        }
      }
    }
  },
  methods: {
    async getDetail (id) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_ADVERTISEMENT_DETAIL.method,
          url: this.$api.GET_ADVERTISEMENT_DETAIL.url,
          params: {
            id
          }
        })
        this.advertisement = response.data.advertisement
        this.list_pic_url = [
          {
            uid: '1',
            name: 'list_pic',
            status: 'done',
            url: response.data.advertisement.image_url
          }
        ]
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    async getGoodsSimpleList (page) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_GOODS_SIMPLE_LIST.method,
          url: this.$api.GET_GOODS_SIMPLE_LIST.url,
          params: {
            page
          }
        })
        this.modalTableData = response.data.list
        this.tablePagination.total = response.data.total
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    async getBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只允许上传JPG和PNG格式的图片')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('只允许上传小于2M的图片')
      }
      return isJpgOrPng && isLt2M
    },
    async uploadImage (data) {
      const file = data.file
      const formData = new FormData()
      formData.append('file', file)
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.POST_UPLOAD_IMAGE.method,
          url: this.$api.POST_UPLOAD_IMAGE.url,
          data: formData,
          onUploadProgress: result => {
            const percent = ((result.loaded / result.total) * 100) | 0
            data.onProgress({ percent })
          }
        })
        data.onSuccess()
        this.spinning = false
        this.advertisement.image_url = response.data.url
      } catch (err) {
        console.log(err)
        data.onError()
        this.spinning = false
        return ''
      }
    },
    select (data) {
      this.advertisement.goods_id = data.id
      this.modalVisible = false
    },
    async submitAdvertisement () {
      this.spinning = true
      try {
        await this.$axios({
          method: this.$api.SAVE_ADVERTISEMENT.method,
          url: this.$api.SAVE_ADVERTISEMENT.url,
          data: {
            advertisement: this.advertisement
          }
        })
        this.spinning = false
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    }
  },
  mounted () {
    const id = this.$route.query.id
    if (id) {
      this.getDetail(id)
    } else {
      this.advertisement = {
        id: '',
        image_url: '',
        enabled: true,
        end_time: '',
        goods_id: '',
        sort_order: 1,
        link: '',
        link_type: 0
      }
    }
  }
}
</script>
