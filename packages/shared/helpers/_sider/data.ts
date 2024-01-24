import type { SiderItem, MaterialType } from '#/business'

export const componentTypes: { label: string; value: MaterialType }[] = [
  { label: '大标题', value: 'Title' },
  { label: '小标题', value: 'SubTitle' },
  { label: '数据卡片', value: 'DataCard' },
  { label: '折叠面板', value: 'Collapse' },
  { label: '描述列表', value: 'Description' },
  { label: '进度条', value: 'Progress' },
  { label: '表格', value: 'Table' },
  { label: '文件列表', value: 'FileList' },
  { label: '轮播图', value: 'Carousel' },
  { label: '饼图', value: 'PieChart' },
  { label: '柱状图', value: 'BarChart' },
  { label: '折线图', value: 'LineChart' },
  { label: '时间轴', value: 'Timeline' },
]

const materialsMap: {
  [K in MaterialType]: Omit<SiderItem, 'position' | 'createTime' | 'updateTime'>
} = {
  Title: {
    id: '',
    type: 'Title',
    props: {
      title: '大标题',
    },
    status: true,
  },
  SubTitle: {
    id: '',
    type: 'SubTitle',
    props: { title: '小标题' },
    status: true,
  },
  DataCard: {
    id: '',
    type: 'DataCard',
    props: {
      title: '数据卡片',
      content: 999,
      img: 'http://dummyimage.com/300x300',
    },
    status: true,
  },
  Collapse: {
    id: '',
    type: 'Collapse',
    props: {
      title: '折叠面板',
      content: '<p>自定义富文本</p>',
    },
    status: true,
  },
  Description: {
    id: '',
    type: 'Description',
    props: {
      column: 1,
      data: [
        { label: 'A', value: '描述列表' },
        { label: 'B', value: '自定义内容' },
      ],
    },
    status: true,
  },
  Progress: {
    id: '',
    type: 'Progress',
    props: {
      data: [
        { name: '进度条', value: 100 },
        { name: '自定义名称', value: 50 },
      ],
    },
    status: true,
  },
  Table: {
    id: '',
    type: 'Table',
    props: {
      data: [
        ['表格', 'A', 'B', 'C'],
        [1, 2, 3, 4],
      ],
    },
    status: true,
  },
  FileList: {
    id: '',
    type: 'FileList',
    props: {
      data: [
        {
          title: '文件列表',
          img: 'http://dummyimage.com/300x300',
          src: 'http://dummyimage.com/300x300',
        },
      ],
    },
    status: true,
  },
  Carousel: {
    id: '',
    type: 'Carousel',
    props: {
      data: [
        'http://dummyimage.com/300x300?text=Carousel1',
        'http://dummyimage.com/300x300?text=Carousel2',
      ],
    },
    status: true,
  },
  PieChart: {
    id: '',
    type: 'PieChart',
    props: {
      data: [
        { name: '饼图', value: 50 },
        { name: 'A', value: 25 },
        { name: 'B', value: 25 },
      ],
    },
    status: true,
  },
  BarChart: {
    id: '',
    type: 'BarChart',
    props: {
      xAxis: ['柱状图', 'A', 'B'],
      series: [{ data: [9, 8, 7] }],
    },
    status: true,
  },
  LineChart: {
    id: '',
    type: 'LineChart',
    props: {
      xAxis: ['折线图', 'A', 'B'],
      series: [{ data: [9, 8, 7] }],
    },
    status: true,
  },
  Timeline: {
    id: '',
    type: 'Timeline',
    props: {
      data: [{ content: '时间轴' }, { content: '自定义内容' }],
    },
    status: true,
  },
}

export const materials = Object.values(materialsMap)
