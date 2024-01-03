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
  updateTime?: string
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
  updateTime?: string
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
export interface MapEvent {
  lnglat: AMap.LngLat
  originEvent: Event
  pixel: AMap.Pixel
  pos: AMap.Vector2
  target: ValueTypes<OverlayInstance> & { _map: AMap.Map }
  type: string
  vectorIndex: number
}

export type OverlayType =
  | 'Marker'
  | 'Polyline'
  | 'BezierCurve'
  | 'Polygon'
  | 'Rectangle'
  | 'Circle'
  | 'Ellipse'
  | 'Text'
  | 'Image'

export type MarkerProps = Pick<
  AMap.MarkerOptions,
  'content' | 'title' | 'zIndex' | 'angle' | 'zooms'
> & {
  position?: AMap.Vector2
  icon?: string | AMap.IconOpts
  content?: string
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
  size?: AMap.Vector2
  offset?: AMap.Vector2
  label?: {
    content: string
    direction: 'top' | 'right' | 'bottom' | 'left' | 'center'
    offset: AMap.Vector2
    _needUpdate?: boolean
  }
}

export type PolylineProps = Pick<
  AMap.PolylineOptions,
  | 'strokeColor'
  | 'strokeOpacity'
  | 'strokeWeight'
  | 'isOutline'
  | 'borderWeight'
  | 'outlineColor'
  | 'strokeStyle'
  | 'strokeDasharray'
  | 'lineJoin'
  | 'lineCap'
  | 'geodesic'
  | 'showDir'
> & {
  path?: AMap.Vector2[]
}

export interface OverlayInstance {
  Marker: AMap.Marker
  Polyline: AMap.Polyline
  BezierCurve: AMap.BezierCurve
  Polygon: AMap.Polygon
  Rectangle: AMap.Rectangle
  Circle: AMap.Circle
  Ellipse: AMap.Ellipse
  Text: AMap.Text
  Image: AMap.ImageLayer
}

export interface OverlayOptions {
  Marker: MarkerProps
  Polyline: PolylineProps
  BezierCurve: AMap.BezierCurveOptions
  Polygon: AMap.PolygonOptions
  Rectangle: AMap.RectangleOptions
  Circle: AMap.CircleOptions
  Ellipse: AMap.EllipseOptions
  Text: AMap.TextOptions
  Image: AMap.ImageLayerOptions
}

export interface OverlayItem<T extends OverlayType> {
  id: string
  layerId: string
  type: T
  name: string
  props: OverlayOptions[T]
  detailTitle?: string
  detailWidth?: string
  details: MaterialItem[]
  status: boolean
  createTime: string
  updateTime?: string
}

export type OverlayProps<T extends OverlayType> = OverlayItem<T> & {
  visible: boolean
}

export interface LayerItem<T extends OverlayType> {
  id: string
  name: string
  asLegend: boolean
  legendImg?: string
  overlays: OverlayItem<T>[]
  status: boolean
  createTime: string
  updateTime?: string
}

export type ToolKeys =
  | 'marker'
  | 'polygon'
  | 'polyline'
  | 'rectangle'
  | 'circle'
  | 'rule'
  | 'measureArea'
  | 'text'
  | 'image'

export interface MapMutativeState {
  layers: Omit<LayerItem<OverlayType>, 'overlays'>[]
  overlays: Omit<OverlayItem<OverlayType>, 'details'>[]
  details: MaterialItem[]
}
