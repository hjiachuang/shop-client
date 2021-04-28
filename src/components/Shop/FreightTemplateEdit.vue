<template>
  <a-spin :spinning="spinning">
    <div class="content-box shop-freight-template-edit">
      <a-form :model="freightInfo" :rules="freightRules" ref="freightRef" hideRequiredMark :label-col="{span: 24}" :wrapper-col="{span: 24}">
        <a-form-item label="模板名称" name="name">
          <a-input v-model:value="freightInfo.name" placeholder="请输入运费模板名称" />
        </a-form-item>
        <a-form-item label="快递公司" name="shipper_id">
          <a-select v-model:value="freightInfo.shipper_id" placeholder="请选择快递公司">
            <a-select-option :value="0">无</a-select-option>
            <a-select-option v-for="item in shipper" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="包装费用" name="package_price">
          <a-input-number v-model:value="freightInfo.package_price" :min="0" :max="9999" placeholder="请输入包装费用" />
        </a-form-item>
        <a-form-item label="快递收费方式" name="freight_type">
          <a-radio-group v-model:value="freightInfo.freight_type" name="freight_type" :options="radioOptions" :defaultValue="0" />
        </a-form-item>
      </a-form>
      <a-form hideRequiredMark :label-col="{span: 24}" :wrapper-col="{span: 24}">
        <a-form-item label="默认运费">
          <a-table
            :data-source="defaultFreight"
            :pagination="false"
            :rowKey="(row) => row.id"
            bordered
            >
            <a-table-column key="start" :title="freightInfo.freight_type === 0? '首件(个)':'首重(KG)'" data-index="start">
              <template #default>
                <a-input-number :min="1" :max="9999" v-model:value="defaultFreight[0].start"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column key="start_fee" title="运费(元)" data-index="start_fee">
              <template #default>
                <a-input-number :min="1" :max="9999" v-model:value="defaultFreight[0].start_fee"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column key="add" :title="freightInfo.freight_type === 0? '续件(个)':'续重(KG)'" data-index="add">
              <template #default>
                <a-input-number :min="0" :max="9999" v-model:value="defaultFreight[0].add"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column key="add_fee" title="运费(元)" data-index="add_fee">
              <template #default>
                <a-input-number :min="0" :max="9999" v-model:value="defaultFreight[0].add_fee"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column key="free_by_number" title="按件包邮" data-index="free_by_number">
              <template #default>
                <a-switch
                v-if="defaultFreight[0].free_by_number === 0"
                v-model:checked="defaultFreight[0].freeByNumber"
                @click="defaultFreight[0].free_by_number = 1"
                ></a-switch>
                <a-input-number
                v-if="defaultFreight[0].free_by_number > 0"
                :min="0"
                :max="9999"
                v-model:value="defaultFreight[0].free_by_number"
                @change="value => {
                  if (value === 0) {
                    defaultFreight[0].freeByNumber = false
                  }
                }"
                ></a-input-number>
              </template>
            </a-table-column>
            <a-table-column key="free_by_money" title="按金额包邮" data-index="free_by_money">
              <template #default>
                <a-switch
                v-if="defaultFreight[0].free_by_money === 0"
                v-model:checked="defaultFreight[0].freeByMoney"
                @click="defaultFreight[0].free_by_money = 1"
                ></a-switch>
                <a-input-number
                v-if="defaultFreight[0].free_by_money > 0"
                :min="0"
                :max="9999"
                v-model:value="defaultFreight[0].free_by_money"
                @change="value => {
                  if (value === 0) {
                    defaultFreight[0].freeByMoney = false
                  }
                }"
                ></a-input-number>
              </template>
            </a-table-column>
          </a-table>
        </a-form-item>
        <a-form-item label="指定地区运费">
          <a-table
            :data-source="specialFreight"
            :pagination="false"
            :rowKey="(row) => row.id"
            bordered
            >
            <a-table-column key="area" title="运送到" data-index="area">
              <template #default="{ record }">
                {{record.areaName}}
              </template>
            </a-table-column>
            <a-table-column :width="90" key="start" :title="freightInfo.freight_type === 0? '首件(个)':'首重(KG)'" data-index="start">
              <template #default="{record: rowData}">
                <a-input-number :min="1" :max="9999" v-model:value="rowData.start"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column :width="90" key="start_fee" title="运费(元)" data-index="start_fee">
              <template #default="{record: rowData}">
                <a-input-number :min="0" :max="9999" v-model:value="rowData.start_fee"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column :width="90" key="add" :title="freightInfo.freight_type === 0? '续件(个)':'续重(KG)'" data-index="add">
              <template #default="{record: rowData}">
                <a-input-number :min="0" :max="9999" v-model:value="rowData.add"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column :width="90" key="add_fee" title="运费(元)" data-index="add_fee">
              <template #default="{record: rowData}">
                <a-input-number :min="0" :max="9999" v-model:value="rowData.add_fee"></a-input-number>
              </template>
            </a-table-column>
            <a-table-column :width="120" key="free_by_number" title="按件包邮" data-index="free_by_number">
              <template #default="{record: rowData}">
                <a-switch
                v-if="rowData.free_by_number === 0"
                v-model:checked="rowData.freeByNumber"
                @click="rowData.free_by_number = 1"
                ></a-switch>
                <a-input-number
                v-if="rowData.free_by_number > 0"
                :min="0"
                :max="9999"
                v-model:value="rowData.free_by_number"
                @change="value => {
                  if (value === 0) {
                    rowData.freeByNumber = false
                  }
                }"
                ></a-input-number>
              </template>
            </a-table-column>
            <a-table-column :width="120" key="free_by_money" title="按金额包邮" data-index="free_by_money">
              <template #default="{record: rowData}">
                <a-switch
                v-if="rowData.free_by_money === 0"
                v-model:checked="rowData.freeByMoney"
                @click="rowData.free_by_money = 1"
                ></a-switch>
                <a-input-number
                v-if="rowData.free_by_money > 0"
                :min="0"
                :max="9999"
                v-model:value="rowData.free_by_money"
                @change="value => {
                  if (value === 0) {
                    rowData.freeByMoney = false
                  }
                }"
                ></a-input-number>
              </template>
            </a-table-column>
            <a-table-column :width="160" title="操作">
              <template #default="{index, record}">
                <a-button type="primary" @click="editArea(record)">编辑地区</a-button>
                <a href="#" style="margin-left: 10px" @click.prevent="removeRow(index)">移除</a>
              </template>
            </a-table-column>
          </a-table>
          <a href="#" @click.prevent="addArea">+添加指定地区运费</a>
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="saveFreightTemplate">保存模板</a-button>
    </div>
  </a-spin>
  <a-modal v-model:visible = "editAreaModal" title="编辑地区" @ok="saveArea">
    <a-transfer
      :data-source="allArea"
      :titles="['可选', '已选']"
      :target-keys="targetKey"
      :selected-keys="selectedKey"
      :render="item => item.title"
      @change="transferChange"
      @selectChange="transferSelectChange"
    />
  </a-modal>
</template>

<script>
export default {
  name: 'ShopFreightTemplateEdit',
  data () {
    return {
      spinning: false,
      editAreaModal: false,
      freightInfo: {},
      defaultFreight: [],
      specialFreight: [],
      shipper: [],
      freightRules: {
        name: [
          {
            required: true,
            message: '请输入运费模板名称',
            trigger: 'change'
          }
        ],
        shipper_id: [
          {
            required: true,
            validator: (rule, value) => {
              return new Promise((resolve, reject) => {
                if (value === 0) {
                  reject(new Error('请选择快递公司'))
                } else {
                  resolve()
                }
              })
            }
          }
        ],
        package_price: [
          {
            required: true,
            message: '请输入包装费用',
            type: 'number'
          }
        ]
      },
      radioOptions: [
        {
          label: '按件',
          value: 0
        },
        {
          label: '按重',
          value: 1
        }
      ],
      allArea: [],
      selectedKey: [],
      targetKey: [],
      targetData: {}
    }
  },
  methods: {
    async getFreightTemplateDetail (id) {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_FREIGHT_TEMPLATE_DETAIL.method,
          url: this.$api.GET_FREIGHT_TEMPLATE_DETAIL.url,
          params: {
            id
          }
        })
        // this.detail = response.data.detail
        this.freightInfo = response.data.freight
        this.defaultFreight = response.data.detail.filter(value => value.area === '0')
        this.specialFreight = response.data.detail.filter(value => value.area !== '0')
        this.spinning = false
      } catch (err) {
        console.log('获取运费模板详情失败。[getFreightTemplateDetail]', err)
        this.spinning = false
      }
    },
    async getCanUseShipper () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_CAN_USE_SHIPPER.method,
          url: this.$api.GET_CAN_USE_SHIPPER.url
        })
        this.shipper = response.data.shipper
        this.spinning = false
      } catch (err) {
        console.log('获取所有快递公司失败。[getCanUseShipper]', err)
        this.spinning = false
      }
    },
    async getAllAreaData () {
      this.spinning = true
      try {
        const response = await this.$axios({
          method: this.$api.GET_ALL_AREA_DATA.method,
          url: this.$api.GET_ALL_AREA_DATA.url
        })
        this.allArea = response.data.area.map(value => {
          return {
            key: value.id.toString(),
            id: value.id,
            title: value.name
          }
        })
        this.spinning = false
      } catch (err) {
        this.spinning = fasle
      }
    },
    removeRow (index) {
      this.specialFreight.splice(index, 1)
    },
    addArea () {
      this.specialFreight.push({
        start: 0,
        start_fee: 0,
        add: 0,
        add_fee: 0,
        area: '',
        areaName: '',
        freeByMoney: false,
        freeByNumber: false,
        free_by_money: 0,
        free_by_number: 0,
        is_default: 0,
        is_delete: 0
      })
    },
    editArea (data) {
      this.editAreaModal = true
      this.targetData = data
      this.targetKey = data.area.split(',')
    },
    saveArea () {
      this.targetData.area = this.targetKey.sort((a, b) => a - b).join(',')
      this.targetData.areaName = this.targetKey.sort((a, b) => a - b).map(value => {
        for (const item of this.allArea) {
          if (parseInt(value) === item.id) {
            return item.title
          }
        }
      }).join('，')
      this.targetData = {}
      this.targetKey = []
      this.editAreaModal = false
    },
    async saveFreightTemplate () {
      this.spinning = true
      try {
        await this.$refs.freightRef.validate()
        for (const ele of this.defaultFreight) {
          if (ele.start === 0 || ele.start === null || ele.add === null || ele.start_fee < 0 || ele.start_fee === null || ele.add_fee < 0 || ele.add_fee === null) {
            this.$message.error('默认运费值不能为空')
            this.spinning = false
            return false
          }
        }
        for (const ele of this.specialFreight) {
          if (ele.start === 0 || ele.start === null || ele.add === 0 || ele.add === null || ele.start_fee < 0 || ele.start_fee === null || ele.add_fee < 0 || ele.add_fee === null) {
            this.$message.error('运费值不能为空')
            this.spinning = false
            return false
          }
          if (ele.area === '') {
            this.$message.error('地区不能为空')
            this.spinning = false
            return false
          }
        }
        const response = await this.$axios({
          method: this.$api.POST_SAVE_FREIGHT_TEMPLATE.method,
          url: this.$api.POST_SAVE_FREIGHT_TEMPLATE.url,
          data: {
            freightInfo: this.freightInfo,
            defaultFreight: this.defaultFreight,
            specialFreight: this.specialFreight
          }
        })
        this.$message.success(response.data.msg)
        this.spinning = false
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      } catch (err) {
        console.log('保存模板失败。[saveFreightTemplate]', err)
        this.spinning = false
      }
    },
    transferChange (nextTargetKeys) {
      this.targetKey = nextTargetKeys
    },
    transferSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKey = [...sourceSelectedKeys, ...targetSelectedKeys]
    }
  },
  mounted () {
    const { id } = this.$route.query
    if (id) {
      this.getFreightTemplateDetail(id)
    } else {
      this.freightInfo = {
        name: '',
        freight_type: 0,
        package_price: 0,
        shipper_id: 0
      }
      this.defaultFreight = [{
        start: 1,
        start_fee: 1,
        add: 0,
        add_fee: 0,
        area: '',
        areaName: '',
        freeByMoney: false,
        freeByNumber: false,
        free_by_money: 0,
        free_by_number: 0,
        is_default: 0,
        is_delete: 0
      }]
    }
    this.getCanUseShipper()
    this.getAllAreaData()
  }
}
</script>
