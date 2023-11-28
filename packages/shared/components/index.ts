import BarChart from './BarChart/index.vue'
import Carousel from './Carousel/index.vue'
import Collapse from './Collapse/index.vue'
import ContentWrapper from './ContentWrapper/index.vue'
import DataCard from './DataCard/index.vue'
import Description from './Description/index.vue'
import EditFormBase from './EditFormBase/index.tsx'
import { useEditFormBase } from './EditFormBase/useEditFormBase.ts'
import FileList from './FileList/index.vue'
import LineChart from './LineChart/index.vue'
import Loading from './Loading/index.vue'
import Modal from './Modal/index.vue'
import Progress from './Progress/index.vue'
import SubTitle from './SubTitle/index.vue'
import Table from './Table/index.vue'
import Timeline from './Timeline/index.vue'
import Title from './Title/index.vue'

import '../../../unocss-icon'

import type { Rule } from 'ant-design-vue/es/form/interface'

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
const componentEditForms: Record<string, any> = {}
const componentEditFormRules: Record<string, Record<string, Rule[]>> = {}
for (const path in editFormModules) {
  const name = /^.*\/(.*?)\/editForm.tsx$/.exec(path)?.[1]
  if (name) {
    componentEditForms[name] = editFormModules[path].form
    componentEditFormRules[name] = editFormModules[path].rules
  }
}

export {
  components,
  componentEditForms,
  componentEditFormRules,
  Title,
  Timeline,
  Table,
  SubTitle,
  Progress,
  LineChart,
  Loading,
  Description,
  DataCard,
  Collapse,
  Carousel,
  BarChart,
  Modal,
  FileList,
  ContentWrapper,
  EditFormBase,
  useEditFormBase,
}
