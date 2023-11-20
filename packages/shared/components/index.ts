import BarChart from './BarChart.vue'
import Carousel from './Carousel.vue'
import Collapse from './Collapse.vue'
import ContentWrapper from './ContentWrapper/index.vue'
import DataCard from './DataCard.vue'
import Description from './Description.vue'
import FileList from './FileList/index.vue'
import LineChart from './LineChart.vue'
import Loading from './Loading/index.vue'
import Modal from './Modal/index.vue'
import Progress from './Progress.vue'
import SubTitle from './SubTitle.vue'
import Table from './Table.vue'
import Timeline from './Timeline.vue'
import Title from './Title.vue'

import '../../../unocss-icon'

import type { Component } from 'vue'

const modules: Record<string, Component> = import.meta.glob(
  ['./*.vue', './**/index.vue'],
  {
    eager: true,
    import: 'default',
  },
)

const components: Record<string, Component> = {}

for (const path in modules) {
  let name
  if (path.endsWith('index.vue')) {
    name = /^.*\/(.*?)\/index.vue$/.exec(path)?.[1]
  } else {
    name = modules[path].name || /^\.\/(.*)\.vue$/.exec(path)?.[1]
  }
  if (!name) continue
  components[name] = modules[path]
}

export {
  components,
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
}
