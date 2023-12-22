import { Method } from 'alova'
import { ResCode } from '../packages/shared/utils/enums'

export interface Res<T> {
  code: ResCode
  data: T
  message: string
}

export interface RequestMeta {
  isReturnNativeResponse?: boolean
  errorMessageMode?: 'message' | 'modal' | 'notify' | 'none'
}

declare module 'alova' {
  export interface Method {
    meta: RequestMeta
  }
}
// -----------------菜单-----------------
export interface MenuItem {
  id: string
  parentId: string | null
  name: string
  children?: MenuItem[]
  sort: number
  status: boolean
  createTime: string
  updateTime: string
}

// -----------------侧边栏-----------------
export type SiderComponents =
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

export type SiderPosition = 'left' | 'right'

export interface SiderItem {
  id: string
  type: SiderComponents
  props: Recordable
  status: boolean
  position: SiderPosition
  createTime: string
  updateTime: string
}

// -----------------标题组件、覆盖物详情-----------------
export type MaterialItem = Pick<SiderItem, 'id' | 'type' | 'props' | 'status'>

// -----------------变动记录-----------------
export type OperationType = 'add' | 'remove' | 'replace' | 'move'

export interface OperationItem<T> {
  op: OperationType
  id?: string
  prevId?: string
  value: Recordable<T>
}

export interface MutativeParams<T> {
  name: 'add' | 'move' | 'remove'
  from?: string
  to?: string
  oldIndex?: number
  newIndex?: number
  data: T
}

// -----------------地图-----------------
export type OverlayType =
  | 'marker'
  | 'polyline'
  | 'polygon'
  | 'rectangle'
  | 'circle'
  | 'ellipse'
  | 'text'
  | 'image'

export interface OverlayItem {
  id: string
  type: OverlayType
  name: string
  props: Recordable
  details: MaterialItem[]
  status: boolean
  createTime: string
  updateTime: string
}

export interface LayerItem {
  id: string
  name: string
  asLegend: boolean
  legendImg: string
  overlays: OverlayItem[]
  status: boolean
  createTime: string
  updateTime: string
}
