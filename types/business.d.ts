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
export type MaterialItem = Pick<SiderItem, 'id' | 'type' | 'props'>

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
  | 'LabelMarker'
  | 'Image'

export type MarkerProps = Pick<
  AMap.MarkerOptions,
  'title' | 'zIndex' | 'angle' | 'zooms' | 'position'
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
  | 'zIndex'
  | 'zooms'
> & {
  path?: AMap.Vector2[]
}

export type BezierCurveProps = Pick<
  AMap.BezierCurveOptions,
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
  | 'zIndex'
  | 'zooms'
> & {
  path?: AMap.Vector[]
}

export type PolygonProps = Pick<
  AMap.PolygonOptions,
  | 'strokeColor'
  | 'strokeOpacity'
  | 'strokeWeight'
  | 'strokeStyle'
  | 'strokeDasharray'
  | 'fillColor'
  | 'fillOpacity'
  | 'extrusionHeight'
  | 'wallColor'
  | 'roofColor'
  | 'zIndex'
  | 'zooms'
> & {
  path?: AMap.Vector2[]
  fillOpacity?: number
}

export type RectangleProps = Pick<
  AMap.RectangleOptions,
  | 'strokeColor'
  | 'strokeOpacity'
  | 'strokeWeight'
  | 'strokeStyle'
  | 'strokeDasharray'
  | 'fillColor'
  | 'fillOpacity'
  | 'zIndex'
  | 'extrusionHeight'
  | 'roofColor'
  | 'wallColor'
  | 'zooms'
> & {
  bounds?: AMap.Vector2[]
  fillOpacity?: number
}

export type CircleProps = Pick<
  AMap.CircleOptions,
  | 'center'
  | 'radius'
  | 'zIndex'
  | 'strokeColor'
  | 'strokeOpacity'
  | 'strokeDasharray'
  | 'strokeStyle'
  | 'strokeWeight'
  | 'fillColor'
  | 'fillOpacity'
  | 'extrusionHeight'
  | 'roofColor'
  | 'wallColor'
  | 'zooms'
> & {
  fillOpacity?: number
}

export type EllipseProps = Pick<
  AMap.EllipseOptions,
  | 'center'
  | 'radius'
  | 'zIndex'
  | 'strokeColor'
  | 'strokeOpacity'
  | 'strokeDasharray'
  | 'strokeStyle'
  | 'strokeWeight'
  | 'fillColor'
  | 'fillOpacity'
  | 'extrusionHeight'
  | 'roofColor'
  | 'wallColor'
  | 'zooms'
> & {
  fillOpacity?: number
}

export type TextProps = Pick<
  AMap.TextOptions,
  'position' | 'text' | 'title' | 'zIndex' | 'angle' | 'zooms' | 'style'
> & {
  position?: AMap.Vector2
  offset?: AMap.Vector2
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

export type LabelMarkerProps = Pick<
  AMap.LabelMarkerOptions,
  'name' | 'zooms' | 'opacity' | 'rank' | 'zIndex' | 'icon' | 'text'
>

export interface OverlayInstance {
  Marker: AMap.Marker
  Polyline: AMap.Polyline
  BezierCurve: AMap.BezierCurve
  Polygon: AMap.Polygon
  Rectangle: AMap.Rectangle
  Circle: AMap.Circle
  Ellipse: AMap.Ellipse
  Text: AMap.Text
  LabelMarker: AMap.LabelMarker
  Image: AMap.ImageLayer
}

export interface OverlayOptions {
  Marker: MarkerProps
  Polyline: PolylineProps
  BezierCurve: BezierCurveProps
  Polygon: PolygonProps
  Rectangle: RectangleProps
  Circle: CircleProps
  Ellipse: EllipseProps
  Text: TextProps
  LabelMarker: LabelMarkerProps
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
  | 'bezierCurve'
  | 'rectangle'
  | 'circle'
  | 'ellipse'
  | 'rule'
  | 'measureArea'
  | 'text'
  | 'labelMarker'
  | 'image'

export interface ToolItem {
  icon: string
  name: string
  key: ToolKeys
  style?: string
  handler: Fn
}

export interface MapMutativeState {
  layers: Omit<LayerItem<OverlayType>, 'overlays'>[]
  overlays: Omit<OverlayItem<OverlayType>, 'details'>[]
  details: MaterialItem[]
}
