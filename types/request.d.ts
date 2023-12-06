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
}
export type DetailItem = Pick<SiderItem, 'id' | 'type' | 'props' | 'status'>
export interface SiderChangeParams {
  name: 'add' | 'move' | 'remove'
  from?: string
  to?: string
  oldIndex?: number
  newIndex?: number
  data: SiderItem | DetailItem
}
