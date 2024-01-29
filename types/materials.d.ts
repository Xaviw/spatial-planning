import { CSSProperties } from 'vue'
import type { PieSeriesOption } from 'echarts/charts'
import type { UseDraggableOptions } from 'vue-draggable-plus'

export type MaterialLike<T extends MaterialType = MaterialType> = Pick<
  MaterialItem<T>,
  'type' | 'props'
> & {
  id?: string
}

export type MaterialType =
  | 'BarChart'
  | 'Carousel'
  | 'Collapse'
  | 'DataCard'
  | 'Description'
  | 'FileList'
  | 'LineChart'
  | 'PieChart'
  | 'Progress'
  | 'SubTitle'
  | 'Table'
  | 'Timeline'
  | 'Title'

export interface MaterialItem<T extends MaterialType = MaterialType> {
  id: string
  siderId?: string
  overlayId?: string
  type: MaterialType
  props: MaterialProps[T]
  status: boolean
  createTime: string
  updateTime?: string
}

export interface MaterialProps {
  Title: TitleProps
  SubTitle: SubTitleProps
  DataCard: DataCardProps
  Collapse: CollapseProps
  Description: DescriptionProps
  Progress: ProgressProps
  Table: TableProps
  FileList: FileListProps
  Carousel: CarouselProps
  PieChart: PieChartProps
  BarChart: BarChartProps
  LineChart: LineChartProps
  Timeline: TimelineProps
}

export type SortableEvent = Parameters<
  NonNullable<Pick<UseDraggableOptions<any>, 'onAdd'>['onAdd']>
>[0]

export interface TitleProps {
  title: string
}

export interface SubTitleProps {
  /** 标题 */
  title: string
}

export interface DataCardProps {
  /** 标题 */
  title: string
  /** 内容 */
  content: string | number
  /** 图片链接 */
  img?: string
  /**
   * 图片宽度，最大48，最小20
   * @default 36px
   */
  imgWidth?: string
  /**
   * 图片高度，最大48，最小20
   * @default 36px
   */
  imgHeight?: string
  /**
   * 图片是否支持预览
   * @default true
   */
  imgPreview?: boolean
}

export interface CollapseProps {
  /** 标题 */
  title: string
  /** 富文本内容 */
  content: string
  /**
   * 默认展开
   * @default false
   */
  defaultOpen?: boolean
}

export interface DescriptionItemProps {
  /** 标题 */
  label: string
  /** 内容 */
  value: string
  /**
   * 所占列数
   * @default 1
   */
  span?: number
  /**
   * 名称样式
   */
  labelStyle?: CSSProperties
  /**
   * 内容样式
   */
  contentStyle?: CSSProperties
}

export interface DescriptionProps {
  /**
   * 是否显示分隔冒号
   * @default true
   */
  colon?: boolean
  /**
   * 一行的列数量，最小1
   * @default 3
   */
  column?: number
  /**
   * 布局方式，支持horizontal|vertical
   * @default horizontal
   */
  layout?: 'horizontal' | 'vertical'
  /**
   * 显示在顶部的标题
   */
  title?: string
  /**
   * 名称样式
   */
  labelStyle?: CSSProperties
  /**
   * 内容样式
   */
  contentStyle?: CSSProperties
  /**
   * 名称-内容键值对数组
   */
  data: DescriptionItemProps[]
}

export interface ProgressItem {
  name: string
  value: number
}
export interface ProgressProps {
  /**
   * 数据数组
   */
  data: ProgressItem[]
  /**
   * 数据显示模式，百分比模式（仅支持0-100的数据）、最大值占比模式（最大值为100%，其他值计算相对最大值的占比）
   * @default percent
   */
  mode?: 'percent' | 'max'
  /**
   * 内容模板
   * @default </>%
   */
  format?: string
  /**
   * 进度条、进度圈、仪表盘
   * @default line
   */
  type?: 'line' | 'circle' | 'dashboard'
  /**
   * 排列方式
   * @default vertical
   */
  layout?: 'vertical' | 'horizontal'
  /**
   * line时为进度条宽度，其他为整体大小，一般无需设置
   */
  size?: number
  /**
   * 进度条色彩
   * @default #1677ff - 蓝色
   */
  strokeColor?: string
  /**
   * 未完成分段色彩
   * @default #ffffff22 - 半透明白色
   */
  trailColor?: string
  /**
   * 进度条总分段数，仅type=line
   */
  steps?: number
  /**
   * 进度圈和仪表盘线条宽度，单位为进度圈整体尺寸的百分比，仅type=circle|dashboard
   * @default 6
   */
  strokeWidth?: number
  /**
   * 仪表盘进度条缺口角度，可取值0-295，仅type=dashboard
   * @default 75
   */
  gapDegree?: number
  /**
   * 仪表盘缺口位置，仅type=dashboard
   * @default bottom
   */
  gapPosition?: 'top' | 'bottom' | 'left' | 'right'
}

export interface TableProps {
  /**
   * 表格数据，二维数组
   * @example [['列1', '列2'], ['数据1', '数据2']]
   */
  data: string[][]
}

export interface FileListItem {
  /** 文件标题 */
  title: string
  /** 图片链接 */
  img?: string
  /**
   * 图片宽度，默认自适应
   */
  imgWidth?: string
  /**
   * 图片高度，默认自适应
   */
  imgHeight?: string
  /** 文件链接 */
  src?: string
}
export interface FileListProps {
  /**
   * 列数
   * @default 4
   */
  columns?: number
  /**
   * 间隔
   * @default 8px
   */
  gap?: string
  data: FileListItem[]
}
export type FileItemType = 'image' | 'audio' | 'video' | 'office' | 'other'

export interface CarouselProps {
  /**
   * 是否自动切换
   * @default true
   */
  autoplay?: boolean
  /**
   * 模板指示点位置
   * @default bottom
   */
  dotPosition?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * 是否显示面板指示点
   * @default true
   */
  dots?: boolean
  /**
   * 图片链接数组
   */
  data: string[]
  /**
   * 组件高度，图片大小差距过大时可定义，避免切换到短图片时底部留白
   */
  height?: string
}

export interface PieChartProps {
  /**
   * 容器高度
   * @default 240px
   */
  height?: string
  /**
   * 外半径，单位百分比
   * @default 95
   */
  outterRadius?: number
  /**
   * 内半径，单位百分比，未传递时为饼状图，传递时为环形图
   */
  innerRadius?: number
  /**
   * 中心点位置X轴位置，单位百分比
   * @default 45
   */
  centerX?: number
  /**
   * 中心点位置Y轴位置，单位百分比
   * @default 50
   */
  centerY?: number
  /**
   * 南丁格尔玫瑰图，默认不使用
   * @default false
   */
  enableRose?: boolean
  data: PieSeriesOption['data']
}

export interface BarChartItem {
  /** 提供name时会显示图例 */
  name?: string
  /** 数量应与columns一致 */
  data: number[]
  /**
   * 柱宽度
   */
  barWidth?: string
}
export interface BarChartProps {
  /**
   * 容器高度
   * @default 240px
   */
  height?: string
  /** X轴数据项，数量应该与data.value一致 */
  xAxis: string[]
  /** 多条折线数据 */
  series: BarChartItem[]
}

export interface LineChartItem {
  /** 提供name时会显示图例 */
  name?: string
  /** 数量应与columns一致 */
  data: number[]
  /**
   * 平滑折线图
   * @default false
   */
  smooth?: boolean
  /**
   * 堆叠面积图
   * @default false
   */
  stack?: boolean
}
export interface LineChartProps {
  /**
   * 容器高度
   * @default 240px
   */
  height?: string
  /** X轴数据项，数量应该与data.value一致 */
  xAxis: string[]
  /** 多条折线数据 */
  series: LineChartItem[]
}

export interface TimelineItem {
  /**
   * 圆圈颜色
   * @default blue
   */
  color?: string
  /**
   * 内容
   */
  content?: string
}
export interface TimelineProps {
  /**
   * 展示位置，左侧|交替|右侧
   * @default left
   */
  mode?: 'left' | 'alternate' | 'right'
  /**
   * 数据数组
   */
  data: TimelineItem[]
}
