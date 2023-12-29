import type { AMap } from '@amap/amap-jsapi-types'

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

export type MarkerProps = Pick<
  AMap.MarkerOptions,
  | 'content'
  | 'title'
  | 'zIndex'
  | 'offset'
  | 'angle'
  | 'size'
  | 'zooms'
  | 'label'
  | 'extData'
  | 'visible'
> & {
  position?: AMap.Vector2
  icon?: string | AMap.IconOpts
  anchor?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'middle-left'
    | 'center'
    | 'middle-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
}

export interface OverlayInstance {
  Marker: AMap.Marker
  Polyline: AMap.Polyline | AMap.BezierCurve
  Polygon: AMap.Polygon
  Rectangle: AMap.Rectangle
  Circle: AMap.Circle | AMap.Ellipse
  Text: AMap.Text
  Image: AMap.ImageLayer
}

export interface OverlayOptions {
  Marker: MarkerProps
  Polyline: AMap.PolylineOptions | AMap.BezierCurveOptions
  Polygon: AMap.PolygonOptions
  Rectangle: AMap.RectangleOptions
  Circle: AMap.CircleOptions | AMap.EllipseOptions
  Text: AMap.TextOptions
  Image: AMap.ImageLayerOptions
}

export interface OverlayItem<T extends OverlayType> {
  id: string
  type: T
  name: string
  props: OverlayOptions[T]
  details: MaterialItem[]
  status: boolean
  createTime: string
  updateTime: string
}

export interface LayerItem<T extends OverlayType> {
  id: string
  name: string
  asLegend: boolean
  legendImg?: string
  overlays: OverlayItem<T>[]
  status: boolean
  createTime: string
  updateTime: string
}

export interface ReactiveOverlayProps<T> {
  layerId: string
  id: string
  details: MaterialItem[]
  props: T
  visible: boolean
}

export interface ReactiveOverlayExtData<T extends OverlayType>
  extends OverlayItem<T> {
  instance: OverlayInstance[T]
  replaceInstance: (instance: OverlayInstance[T]) => void
  replaceSource: (config: Partial<OverlayItem<T>>) => void
}
