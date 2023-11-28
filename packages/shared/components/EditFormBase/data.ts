import type { SiderComponents } from '#/client'
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

export const baseRules: Record<string, Rule[]> = {
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
