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
import EditableTable from './EditableTable/index.vue'

import '../../../unocss-icon'

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

const formModules: Record<string, any> = import.meta.glob('./**/form.vue', {
  eager: true,
  import: 'default',
})
const componentForms: Record<string, any> = {}
for (const path in formModules) {
  const name = /^.*\/(.*?)\/form.vue$/.exec(path)?.[1]
  if (name) {
    componentForms[name] = formModules[path]
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
  EditableTable,
  components,
  componentForms,
}
