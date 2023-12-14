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
  parentId?: string
  name: string
  sort?: number
  status: boolean
  children?: MenuItem[]
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
  menuIds: string[]
  position: SiderPosition
}
export type DetailItem = Pick<SiderItem, 'id' | 'type' | 'props' | 'status'>
export interface SiderChangeParams<T extends SiderItem | DetailItem> {
  name: 'add' | 'move' | 'remove'
  from?: string
  to?: string
  oldIndex?: number
  newIndex?: number
  data: T
}

// -----------------图例-----------------
export interface LegendTypeItem {
  id: string
  name: string
}

export interface LegendItem {
  id: string
  name: string
  img: string
  type: LegendTypeItem
}

export type LegendEditTypeItem = { value: string; label: string }

export type LegendEditItem = Omit<LegendItem, 'type'> & {
  type: LegendEditTypeItem
}

export type LegendRequestItem = Omit<LegendItem, 'type'> & { type: string }
