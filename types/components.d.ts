import { CSSProperties } from 'vue'
import type { DetailItem } from './client'

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
