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
export type OperationType = 'add' | 'remove' | 'replace'

export interface OperationItem<T extends Recordable> {
  op: OperationType
  id?: string
  value?: T
}

// -----------------地图-----------------
export type OverlayType =
  | 'Marker'
  | 'Polyline'
  | 'Polygon'
  | 'Rectangle'
  | 'Circle'
  | 'Text'
  | 'Image'

export interface OverlayItem<T = OverlayType> {
  id: string
  type: T
  name: string
  props: OverlayTypeOptions[T]
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

export interface OverlayTypeInstance {
  Marker: AMap.Marker
  Polyline: AMap.Polyline | AMap.BezierCurve
  Polygon: AMap.Polygon
  Rectangle: AMap.Rectangle
  Circle: AMap.Circle | AMap.Ellipse
  Text: AMap.Text
  Image: AMap.ImageLayer
}

export interface OverlayTypeOptions {
  Marker: AMap.MarkerOptions
  Polyline: AMap.PolylineOptions | AMap.BezierCurveOptions
  Polygon: AMap.PolygonOptions
  Rectangle: AMap.RectangleOptions
  Circle: AMap.CircleOptions | AMap.EllipseOptions
  Text: AMap.TextOptions
  Image: AMap.ImageLayerOptions
}

export interface ReactiveOverlayExtData<T extends OverlayType>
  extends OverlayItem {
  instance: OverlayTypeInstance[T]
  replaceInstance: (instance: OverlayTypeInstance[T]) => void
  replaceSource: (config: Partial<OverlayItem[T]>) => void
}
