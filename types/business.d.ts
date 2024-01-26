import type { MaterialType, MaterialProps } from './materials'
import type { AMap } from '@amap/amap-jsapi-types'

// -----------------系统配置-----------------
export type Config = Partial<AMap.MapOptions> & {
  mapType?: boolean
  mapTypePosition?: (number | null)[]
  defaultMapType?: 0 | 1
  showTraffic?: boolean
  showRoad?: boolean
  scalebar?: boolean
  scalebarPosition?: (number | null)[]
  toolbar?: boolean
  toolbarPosition?: (number | null)[]
  controlbar?: boolean
  controlbarPosition?: (number | null)[]
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
  updateTime?: string
}

export interface HandledMenu {
  label: string
  key: string
  index: number
  keys: string[]
  labels: string[]
  children?: HandledMenu[]
}

export interface MenuMoveParams {
  id: string
  currentParentId?: string
  currentIndex: number
}

// -----------------侧边栏-----------------
export type SiderPosition = 'left' | 'right'

export interface SiderItem<T extends MaterialType = MaterialType> {
  id: string
  // menuId: string
  // sort: number
  status: boolean
  // position: SiderPosition
  createTime: string
  updateTime?: string
  materialId: string
  type: MaterialType
  props: MaterialProps[T]
}

export interface GetSiderParams {
  menuId: string
  filter: boolean
  position: SiderPosition
}

export type SetSiderParams = OperationItem<Partial<SiderItem>>[]

// -----------------物料、覆盖物表单expose类型-----------------
export interface FormEl<T extends Recordable = Recordable> {
  formModel: T
  resetFields: EmptyFn
  validate: EmptyFn<Promise<any>>
  clearValidate: EmptyFn
  initialModel: T
}

// -----------------变动记录-----------------
export type OperationType = 'add' | 'remove' | 'replace'

export interface OperationItem<T extends Recordable> {
  op: OperationType
  id?: string
  value?: T
}
