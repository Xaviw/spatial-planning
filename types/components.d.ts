import { CSSProperties } from 'vue'
import type { DetailItem } from './request'

export interface TitleProps {
  title: string
  /**
   * 详情弹窗宽度
   * @default 25rem
   */
  modalWidth?: number | string
  /**
   * 弹窗标题，默认`${title}详情`
   */
  modalTitle?: string
  /** 弹窗内容，提供后组件右侧会显示详情按钮 */
  modalData?: DetailItem[]
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
   * @default 36
   */
  imgWidth?: number
  /**
   * 图片高度，最大48，最小20
   * @default 36
   */
  imgHeight?: number
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
export interface Progress {
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
  data: (string | number)[][]
}
