<template>
  <a-spin :spinning="spinning">
    <div class="content-box goods-edit">
      <a-form :label-col="{span: 24}" :wrapper-col="{span: 24}" ref="form" :rules="rules" :model="detail">
        <a-form-item label="商品分类" name="category">
          <a-select v-model:value="detail.category_id" placeholder="请选择商品分类" @change="categoryChange">
            <a-select-option v-for="item in category" :key="item.id" :value="item.id" :title="item.name">{{item.name}}</a-select-option>
          </a-select>
          <!-- <a-cascader v-model:value="categoryValue" :options="category" change-on-select style="width: 100%" placeholder="请选择商品分类" @change="categoryChange"></a-cascader> -->
        </a-form-item>
        <a-form-item label="商品图片" name="list_pic_url">
          <div class="clearfix">
            <a-upload
              list-type="picture-card"
              v-model:file-list="list_pic_url"
              :before-upload="beforeUpload"
              :customRequest="uploadImage1"
              :remove="remove1"
              @preview="handlePreview"
            >
              <div v-if="list_pic_url.length < 1">
                <plus-outlined />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </div>
        </a-form-item>
        <a-form-item label="商品轮播图" name="galleryData">
          <div class="clearfix">
            <a-upload
              list-type="picture-card"
              v-model:file-list="gallery_list"
              :before-upload="beforeUpload"
              :customRequest="uploadImage2"
              :remove="remove2"
              @preview="handlePreview"
            >
              <div v-if="gallery_list.length < 5">
                <plus-outlined />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>

          </div>
        </a-form-item>
        <a-form-item label="商品名称" name="name">
          <a-input v-model:value="detail.name" placeholder="请输入商品名称" />
        </a-form-item>
        <a-form-item label="商品简介" name="goods_brief">
          <a-textarea v-model:value="detail.goods_brief" placeholder="请输入商品简介" allow-clear />
        </a-form-item>
        <a-form-item label="商品单位" name="goods_unit" extra="例如：件、包、袋">
          <a-input v-model:value="detail.goods_unit" placeholder="请输入商品单位" />
        </a-form-item>
        <a-form-item label="商品销量" name="sell_volume">
          <a-input-number v-model:value="detail.sell_volume" />
        </a-form-item>
        <a-form-item label="商品详情" name="goods_desc">
          <div class="edit_container">
            <v-wangeditor :content="detail.goods_desc" :options="editorOptions" @blur="({html})=> detail.goods_desc = html"></v-wangeditor>
          </div>
        </a-form-item>
        <a-form-item label="商品型号" >
          <a-select v-model:value="detail.specValue" placeholder="选择商品型号">
            <a-select-option v-for="item in specification" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="SKU 内容">
          <a-button type="primary" @click="addSKU">新增型号</a-button>
          <a-table
            :data-source="detail.product"
            :pagination="false"
            :rowKey="(row) => row.id"
            size="small"
            >
            <a-table-column key="goods_sn" title="商品SKU" data-index="goods_sn">
              <template #default="{ record }">
                <span>{{record.goods_sn}}</span>
              </template>
            </a-table-column>
            <a-table-column key="goods_aka" title="快递单上的简称" data-index="goods_aka">
              <template #default="{ record }">
                <a-input v-model:value="record.goods_name" placeholder="简称"></a-input>
              </template>
            </a-table-column>
            <a-table-column key="value" title="型号/规格" data-index="value">
              <template #default="{ record }">
                <a-input v-model:value="record.value" placeholder="如1斤/条"></a-input>
              </template>
            </a-table-column>
            <a-table-column key="cost" title="成本(元)" data-index="cost">
              <template #default="{ record }">
                <a-input-number v-model:value="record.cost" placeholder="成本" :precision="1" :step="0.1"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column key="retail_price" title="零售(元)" data-index="retail_price">
              <template #default="{ record }">
                <a-input-number v-model:value="record.retail_price" placeholder="零售" :precision="1" :step="0.1"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column key="goods_weight" title="重量(KG)" data-index="goods_weight">
              <template #default="{ record }">
                <a-input-number v-model:value="record.goods_weight" placeholder="重量" :precision="1" :step="0.1"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column key="goods_number" title="库存" data-index="goods_number">
              <template #default="{ record }">
                <a-input-number v-model:value="record.goods_number" placeholder="库存" :precision="0"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column key="action" title="操作">
              <template #default="{ index }">
                <a-button type="danger" shape="circle" @click="deleteSKU(index)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-form-item>
        <a-form-item label="快递模板" name="freight_template">
          <a-select v-model:value="detail.freight_template_id" placeholder="选择型号分类">
            <a-select-option v-for="item in freightTemplate" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排序" name="sort_order">
          <a-input-number v-model:value="detail.sort_order" :min="1" :max="100"></a-input-number>
        </a-form-item>
        <a-form-item label="是否上架">
          <a-switch checkedChildren="上架" unCheckedChildren="下架" v-model:checked="detail.is_on_sale"></a-switch>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" size="large" @click="submitGoods">保存</a-button>
          <a-button style="margin-left: 10px" size="large" @click="$router.go(-1)">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img alt="预览图片" style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-spin>
</template>

<script>
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { vWangeditor } from 'vue3-wangeditor'

export default {
  name: 'GoodsEdit',
  components: {
    PlusOutlined,
    DeleteOutlined,
    vWangeditor
  },
  data () {
    return {
      spinning: false,
      id: '',
      rules: {
        name: [
          {
            required: true, message: '请输入名称', trigger: 'blur'
          }
        ],
        goods_brief: [
          {
            required: true, message: '请输入简介', trigger: 'blur'
          }
        ],
        list_pic_url: [
          {
            required: true, message: '请选择商品图片', trigger: 'blur'
          }
        ],
        goods_unit: [
          {
            required: true, message: '请输入商品单位', trigger: 'blur'
          }
        ],
        goods_desc: [
          {
            required: true, message: '请输入商品详情', trigger: 'blur'
          }
        ]
      },
      detail: {},
      category: [],
      specification: [],
      list_pic_url: [],
      previewImage: '',
      previewVisible: false,
      gallery_list: [],
      freightTemplate: [],
      editorOptions: {
        height: 600,
        zIndex: 1009,
        customUploadImg: this.uploadImageByDesc
      }
    }
  },
  methods: {
    // 获取商品详细内容
    async getGoodsDetail (id) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_GOODS_DETAIL.method,
          url: this.$api.GET_GOODS_DETAIL.url,
          params: {
            id
          }
        })
        this.detail = response.data.detail
        this.list_pic_url = [
          {
            uid: '1',
            name: 'list_pic',
            status: 'done',
            url: response.data.detail.list_pic_url
          }
        ]
        this.gallery_list = response.data.detail.galleryData
        this.spinning = false
      } catch (err) {
        console.log(err)
        this.spinning = false
      }
    },
    // 获取商品所有的SKU属性
    async getSpecOptions () {
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
    // 获取所有的商品分类
    async getAllCategory () {
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
    // 获取所有的快递运费模板
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
        return response.data
      } catch (err) {
        console.log(err)
        data.onError()
        this.spinning = false
        return ''
      }
    },
    // 商品图片上传的入口
    async uploadImage1 (data) {
      const result = await this.uploadImage(data)
      this.detail.list_pic_url = result.url
      this.detail.https_pic_url = result.url
    },
    // 商品轮播图上传的入口
    async uploadImage2 (data) {
      const result = await this.uploadImage(data)
      this.detail.galleryData.push({
        url: result.url,
        name: result.name,
        status: 'done',
        uid: result.name.split('.')[0]
      })
      this.gallery_list = this.detail.galleryData
    },
    // 商品详情自定义上传图片的方法
    async uploadImageByDesc (resultFiles, insertImgFn) {
      const formData = new FormData()
      formData.append('file', resultFiles[0])
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.POST_UPLOAD_IMAGE.method,
          url: this.$api.POST_UPLOAD_IMAGE.url,
          data: formData
        })
        this.spinning = false
        insertImgFn(response.data.url)
      } catch (err) {
        console.log(err)
        this.spinning = false
        return ''
      }
    },
    // 商品图片移除的方法
    remove1 () {
      this.detail.list_pic_url = ''
      this.detail.https_pic_url = ''
      return true
    },
    // 商品轮播图移除的方法
    remove2 (file) {
      this.detail.galleryData.forEach((value, index, self) => {
        if (value.name === file.name) {
          self.splice(index, 1)
        }
      })
      return true
    },
    // 商品分类改变时的回调
    categoryChange (value, option) {
      this.detail.category_id = value
      this.detail.category_name = option.title
    },
    // 添加临时的新的型号
    addSKU () {
      this.detail.product.push({
        id: new Date().getTime(),
        value: '',
        cost: '',
        retail_price: '',
        goods_weight: '',
        goods_number: '',
        goods_name: '',
        is_delete: 0,
        is_on_sale: true
      })
    },
    // 删除商品SKU的方法
    deleteSKU (index) {
      this.detail.product.splice(index, 1)
    },
    // 保存
    async submitGoods () {
      this.spinning = true
      try {
        await this.$refs.form.validate()
        if (this.id === '') {
          this.detail.type = 'add'
        } else {
          this.detail.type = 'update'
        }
        if (this.detail.list_pic_url === '' || this.detail.list_pic_url === null) {
          return this.$message.error('商品图片不能为空')
        }
        if (this.detail.product.length === 0) {
          return this.$message.error('商品SKU不能为空')
        }
        for (const ele of this.detail.product) {
          if (ele.cost === '' || ele.goods_weight === '' || ele.retail_price === '' || ele.value === '') {
            return this.$message.error('商品SKU的值不能为空')
          }
        }
        await this.$axios({
          method: this.$api.POST_SAVE_GOODS.method,
          url: this.$api.POST_SAVE_GOODS.url,
          data: {
            goods: this.detail
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
      this.id = id
      this.getGoodsDetail(id)
    } else {
      this.detail = {
        id: '',
        name: '',
        category_id: '',
        category_name: '',
        sub_category_id: '',
        cost_price: '',
        freight_template_id: '',
        freight_type: 0,
        galleryData: [],
        goods_brief: '',
        goods_desc: '',
        goods_number: 0,
        goods_unit: '',
        https_pic_url: '',
        is_index: false,
        is_new: 0,
        is_on_sale: false,
        keywords: '',
        list_pic_url: '',
        min_cost_price: 0,
        min_retail_price: 0,
        product: [],
        retail_price: 0,
        sell_volume: 0,
        sort_order: 1,
        specValue: 1
      }
    }
    this.getSpecOptions()
    this.getAllCategory()
    this.getFreightTemplate()
  }
}
</script>
