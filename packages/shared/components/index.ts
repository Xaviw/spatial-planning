/* eslint-disable import/order */
import BarChart from './BarChart/index.vue'
import Carousel from './Carousel/index.vue'
import Collapse from './Collapse/index.vue'
import ContentWrapper from './ContentWrapper/index.vue'
import DataCard from './DataCard/index.vue'
import Description from './Description/index.vue'
import FileList from './FileList/index.vue'
import LineChart from './LineChart/index.vue'
import Progress from './Progress/index.vue'
import SubTitle from './SubTitle/index.vue'
import Table from './Table/index.vue'
import Timeline from './Timeline/index.vue'
import Title from './Title/index.vue'

import Loading from './Loading/index.vue'
import Modal from './Modal/index.vue'

import DraggableList from './SiderHelper/draggableList.vue'
import MaterialBar from './SiderHelper/materialBar.vue'
import SiderBaseForm, {
  type ComponentFormProps,
  type ComponentFormRuleProps,
} from './SiderHelper/siderBaseForm'
import SiderFormBar from './SiderHelper/siderFormBar.vue'
import SiderModalEditor from './SiderHelper/siderModalEditor.vue'
import { useSiderForm } from './SiderHelper/useSiderForm'
import { useMenuTree } from './SiderHelper/useMenuTree'

import '../../../unocss-icon'

import type { Rule } from 'ant-design-vue/es/form/interface'
import { VNode } from 'vue'

const componentModules: Record<string, any> = import.meta.glob(
  './**/index.vue',
  {
    eager: true,
    import: 'default',
  },
)
const components: Record<string, any> = {}
for (const path in componentModules) {
  const name = /^.*\/(.*?)\/index.vue$/.exec(path)?.[1]
  if (name) {
    components[name] = componentModules[path]
  }
}

const editFormModules: Record<string, any> = import.meta.glob(
  './**/editForm.tsx',
  {
    eager: true,
  },
)
const componentEditForms: Record<
  string,
  (options: ComponentFormProps) => JSX.Element | VNode
> = {}
const componentEditFormRules: Record<
  string,
  (option: ComponentFormRuleProps) => Record<string, Rule[]>
> = {}
for (const path in editFormModules) {
  const name = /^.*\/(.*?)\/editForm.tsx$/.exec(path)?.[1]
  if (name) {
    componentEditForms[name] = editFormModules[path].form
    componentEditFormRules[name] = editFormModules[path].rules
  }
}

export {
  Title,
  Timeline,
  Table,
  SubTitle,
  Progress,
  LineChart,
  Description,
  DataCard,
  Collapse,
  Carousel,
  BarChart,
  FileList,
  Modal,
  Loading,
  ContentWrapper,
  DraggableList,
  SiderModalEditor,
  useMenuTree,
  useSiderForm,
  SiderFormBar,
  SiderBaseForm,
  MaterialBar,
  components,
  componentEditForms,
  componentEditFormRules,
}
