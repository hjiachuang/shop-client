// import Vue from 'vue'
import {
  Avatar,
  BackTop,
  Breadcrumb,
  Button,
  Card,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Image,
  Layout,
  List,
  Menu,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Spin,
  Statistic,
  Switch,
  Table,
  Tabs,
  Transfer,
  Tooltip,
  Upload,
  message
} from 'ant-design-vue'

Plugin.install = (Vue) => {
  Vue.use(Avatar)
  Vue.use(BackTop)
  Vue.use(Breadcrumb)
  Vue.use(Button)
  Vue.use(Card)
  Vue.use(Cascader)
  Vue.use(Checkbox)
  Vue.use(Col)
  Vue.use(DatePicker)
  Vue.use(Descriptions)
  Vue.use(Divider)
  Vue.use(Empty)
  Vue.use(Form)
  Vue.use(Input)
  Vue.use(InputNumber)
  Vue.use(Image)
  Vue.use(Layout)
  Vue.use(List)
  Vue.use(Menu)
  Vue.use(Modal)
  Vue.use(Pagination)
  Vue.use(Radio)
  Vue.use(Row)
  Vue.use(Select)
  Vue.use(Spin)
  Vue.use(Statistic)
  Vue.use(Switch)
  Vue.use(Table)
  Vue.use(Tabs)
  Vue.use(Transfer)
  Vue.use(Tooltip)
  Vue.use(Upload)
  Vue.config.globalProperties.$modal = Modal
  Vue.config.globalProperties.$message = message
}

export default Plugin
