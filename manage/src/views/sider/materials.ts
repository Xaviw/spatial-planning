import Mock from 'mockjs'
import type { SiderItem, SiderComponents } from '#/client'

const materials: { [K in SiderComponents]: SiderItem } = {
  Title: {
    id: '',
    position: 'left',
    type: 'Title',
    props: {
      title: '大标题',
      modalTitle: '大标题详情弹窗',
      modalData: [
        {
          id: '',
          type: 'SubTitle',
          props: { title: '同外部自定义组件' },
          status: true,
          menuIds: [],
        },
      ],
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

export default Object.values(materials)