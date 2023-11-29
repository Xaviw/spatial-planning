import type { SiderItem, SiderComponents } from '#/client'
import type { Rule } from 'ant-design-vue/es/form'

export const componentTypes: { label: string; value: SiderComponents }[] = [
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

export const baseRules = (inModal: boolean): Record<string, Rule[]> => {
  let common: Record<string, Rule[]> = {
    type: [
      {
        required: true,
        message: '请选择组件类型！',
      },
    ],
    status: [
      {
        required: true,
        message: '请选择组件状态！',
      },
    ],
  }
  if (!inModal) {
    common = {
      ...common,
      position: [
        {
          required: true,
          message: '请选择组件显示位置！',
        },
      ],
      menuIds: [
        {
          required: true,
          message: '请选择组件关联菜单！',
        },
      ],
    }
  }
  return common
}

const materialsMap: { [K in SiderComponents]: SiderItem } = {
  Title: {
    id: '',
    position: 'left',
    type: 'Title',
    props: {
      title: '大标题',
    },
    status: true,
    menuIds: [],
  },
  SubTitle: {
    id: '',
    position: 'left',
    type: 'SubTitle',
    props: { title: '小标题' },
    status: true,
    menuIds: [],
  },
  DataCard: {
    id: '',
    position: 'left',
    type: 'DataCard',
    props: {
      title: '数据卡片',
      content: 999,
      img: 'http://dummyimage.com/300x300',
    },
    status: true,
    menuIds: [],
  },
  Collapse: {
    id: '',
    position: 'left',
    type: 'Collapse',
    props: {
      title: '折叠面板',
      content: '<p>自定义富文本</p>',
    },
    status: true,
    menuIds: [],
  },
  Description: {
    id: '',
    position: 'left',
    type: 'Description',
    props: {
      column: 1,
      data: [
        { label: 'A', value: '描述列表' },
        { label: 'B', value: '自定义内容' },
      ],
    },
    status: true,
    menuIds: [],
  },
  Progress: {
    id: '',
    position: 'left',
    type: 'Progress',
    props: {
      data: [
        { name: '进度条', value: 100 },
        { name: '自定义名称', value: 50 },
      ],
    },
    status: true,
    menuIds: [],
  },
  Table: {
    id: '',
    position: 'left',
    type: 'Table',
    props: {
      data: [
        ['表格', 'A', 'B', 'C'],
        [1, 2, 3, 4],
      ],
    },
    status: true,
    menuIds: [],
  },
  FileList: {
    id: '',
    position: 'left',
    type: 'FileList',
    props: {
      data: [
        {
          title: '文件列表',
          img: 'http://dummyimage.com/300x300',
        },
        {
          title: '图片',
          img: 'http://dummyimage.com/300x300',
        },
      ],
    },
    status: true,
    menuIds: [],
  },
  Carousel: {
    id: '',
    position: 'left',
    type: 'Carousel',
    props: {
      data: [
        'http://dummyimage.com/300x300?text=Carousel1',
        'http://dummyimage.com/300x300?text=Carousel2',
      ],
    },
    status: true,
    menuIds: [],
  },
  PieChart: {
    id: '',
    position: 'left',
    type: 'PieChart',
    props: {
      data: [
        { name: '饼图', value: 50 },
        { name: 'A', value: 25 },
        { name: 'B', value: 25 },
      ],
    },
    status: true,
    menuIds: [],
  },
  BarChart: {
    id: '',
    position: 'left',
    type: 'BarChart',
    props: {
      xAxis: ['柱状图', 'A', 'B'],
      series: [{ data: [9, 8, 7] }],
    },
    status: true,
    menuIds: [],
  },
  LineChart: {
    id: '',
    position: 'left',
    type: 'LineChart',
    props: {
      xAxis: ['折线图', 'A', 'B'],
      series: [{ data: [9, 8, 7] }],
    },
    status: true,
    menuIds: [],
  },
  Timeline: {
    id: '',
    position: 'left',
    type: 'Timeline',
    props: {
      data: [{ content: '时间轴' }, { content: '自定义内容' }],
    },
    status: true,
    menuIds: [],
  },
}

export const materials = Object.values(materialsMap)
