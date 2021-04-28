<template>
  <a-spin :spinning="spinning">
    <div class="content-box">
      <a-form :label-col="{span: 24}" :wrapper-col="{span: 24}" ref="form" :rules="rules" :model="category">
        <a-form-item label="分类名称" name="name">
          <a-input v-model:value="category.name" placeholder="请输入分类名称" />
        </a-form-item>
        <a-form-item label="分类关键字" name="keywords">
          <a-input v-model:value="category.keywords" placeholder="请输入分类关键字" />
        </a-form-item>
        <a-form-item label="分类图片" name="list_pic_url" extra="图标尺寸: 宽度250 高度250，只能上传jpg/png文件">
          <div class="clearfix">
            <a-upload
              list-type="picture-card"
              v-model:file-list="list_pic_url"
              :before-upload="beforeUpload"
              :customRequest="uploadImage"
              :remove="remove"
              @preview="handlePreview"
            >
              <div v-if="list_pic_url.length < 1">
                <plus-outlined />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </div>
        </a-form-item>
        <a-form-item label="排序" name="sort_order">
          <a-input-number v-model:value="category.sort_order" :min="1" :max="100"></a-input-number>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" size="large" @click="submit">保存</a-button>
          <a-button style="margin-left: 10px" size="large" @click="$router.go(-1)">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-spin>
  <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
    <img alt="预览图片" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue'

export default {
  name: 'AddCategory',
  components: {
    PlusOutlined
  },
  data () {
    return {
      spinning: false,
      rules: {
        name: [
          {
            required: true, message: '请输入分类名称', trigger: 'blur'
          }
        ]
      },
      category: {},
      list_pic_url: [],
      previewVisible: false
    }
  },
  methods: {
    async getCategory (id) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_CATEGORY_INFO.method,
          url: this.$api.GET_CATEGORY_INFO.url,
          params: {
            id
          }
        })
        this.category = response.data.info
        this.list_pic_url = [
          {
            uid: '1',
            name: 'list_pic',
            status: 'done',
            url: response.data.info.icon_url
          }
        ]
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    // 将图片转换成base64供预览
    async getBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    // 点击图片预览的方法
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    // 图片上传前的回调
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
    // 上传图片的方法
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
        this.category.icon_url = response.data.url
      } catch (err) {
        console.log(err)
        data.onError()
        this.spinning = false
        return ''
      }
    },
    remove () {
      this.category.icon_url = ''
      return true
    },
    async submit () {
      this.spinning = true
      try {
        await this.$refs.form.validate()
        if (this.id === '') {
          this.category.type = 'add'
        } else {
          this.category.type = 'update'
        }
        if (this.category.icon_url === '' || this.category.icon_url === null) {
          return this.$message.error('分类图片不能为空')
        }
        await this.$axios({
          method: this.$api.POST_SAVE_CATEGORY.method,
          url: this.$api.POST_SAVE_CATEGORY.url,
          data: {
            category: this.category
          }
        })
        this.spinning = false
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    }
  },
  mounted () {
    const { id } = this.$route.query
    if (id) {
      this.getCategory(id)
    } else {
      this.category = {
        id: '',
        icon_url: '',
        icon_display: true,
        is_show: true,
        keywords: '',
        name: '',
        show_index: true,
        sort_order: 1
      }
    }
  }
}
</script>
