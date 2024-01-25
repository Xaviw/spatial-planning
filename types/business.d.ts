import type { AMap } from '@amap/amap-jsapi-types'
import type { ComponentOptions } from 'vue'

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

export interface SiderItem {
  id: string
  menuId: string
  sort: number
  material: MaterialItem
  status: boolean
  position: SiderPosition
  createTime: string
  updateTime?: string
}

export type SetSiderParams = OperationItem<
  Omit<SiderItem, 'material', 'createTime', 'updateTime'> & {
    material: Omit<MaterialItem, 'overlayId'>
  }
>[]

// -----------------标题组件、覆盖物详情-----------------
export type MaterialType =
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

export interface MaterialItem {
  id: string
  siderId?: string
  overlayId?: string
  sort: number
  type: MaterialType
  props: Recordable
  status: boolean
}

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
  | 'BezierCurve'
  | 'Polygon'
  | 'Rectangle'
  | 'Circle'
  | 'Ellipse'
  | 'Text'
  | 'LabelMarker'
  | 'ElasticMarker'
  | 'ImageLayer'

export type ToolType = OverlayType | 'Location'

export interface OverlayItem<T extends OverlayType = OverlayType> {
  id: string
  layerId: string
  type: T
  name: string
  props: OverlayOptions[T]
  modalTitle?: string
  modalWidth?: string
  materials: MaterialItem[]
  status?: boolean
  createTime: string
  updateTime?: string
}

export type OverlayProps<T extends OverlayType = OverlayType> =
  OverlayItem<T> & {
    visible: boolean
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
  LabelMarker: AMap.LabelMarker
  ElasticMarker: ElasticMarker
  ImageLayer: AMap.ImageLayer
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
  ElasticMarker: ElasticMarkerProps
  ImageLayer: AMap.ImageLayerOptions
}

export interface LayerItem<T extends OverlayType = OverlayType> {
  id: string
  menuId: string
  name: string
  asLegend: boolean
  legendImg?: string
  overlays: OverlayItem<T>[]
  status: boolean
  sort: number
  createTime: string
  updateTime?: string
}

export interface OverlayModule {
  type: ToolType
  sort: number
  defaultZIndex?: number
  toolItemStyle?: string
  overlay?: ComponentOptions
  form?: ComponentOptions
  name: string
  icon: string
  description?: string
  drawHelp?: string[]
  editHelp?: string[]
  handleDraw?: Fn<[any, boolean]>
  afterDraw?: Fn<[any, ValueTypes<OverlayInstance>]>
  handleEdit?: Fn<[any, boolean]>
  cancelEdit?: Fn<
    [any, LayerItem<OverlayType>, number, OverlayItem<OverlayType>]
  >
}

export interface SetMapParams {
  layers: OperationItem<
    Omit<LayerItem, 'overlays', 'createTime', 'updateTime'>
  >[]
  overlays: OperationItem<
    Omit<OverlayItem, 'materials', 'createTime', 'updateTime'>
  >[]
  materials: OperationItem<MaterialItem>[]
}

export interface MapEvent {
  lnglat: AMap.LngLat
  originEvent: Event
  pixel: AMap.Pixel
  pos: AMap.Vector2
  target: ValueTypes<OverlayInstance> & { _map: AMap.Map }
  type: string
  vectorIndex: number
}

export type Anchor =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type MarkerProps = Pick<
  AMap.MarkerOptions,
  'title' | 'zIndex' | 'angle' | 'zooms' | 'position'
> & {
  position?: AMap.Vector2
  icon?: {
    size?: AMap.Vector2
    imageOffset?: AMap.Vector2
    image: string
    imageSize?: AMap.Vector2
  }
  content?: string
  anchor?: Anchor
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
  anchor?: Anchor
}

export type LabelMarkerProps = Pick<
  AMap.LabelMarkerOptions,
  | 'name'
  | 'position'
  | 'zooms'
  | 'opacity'
  | 'rank'
  | 'zIndex'
  | 'icon'
  | 'text'
> & {
  position: AMap.Vector2
  icon?: {
    image: string
    size?: Vector2
    clipOrigin?: Vector2
    clipSize?: Vector2
    anchor?: Anchor
    offset?: Vector2
    retina?: boolean
  }
  text?: {
    content: string
    direction?: string
    offset?: Vector2
    zooms?: Vector2
    style?: {
      fontSize?: number
      fontFamily?: string
      fontWeight?: string
      fillColor?: string
      strokeColor?: string
      strokeWidth?: number
      padding?: number[]
      backgroundColor?: string
      borderColor?: string
      borderWidth?: number
      fold?: boolean
    }
  }
}

export interface ElasticMarkerIcon {
  img?: string
  size?: AMap.Vector2
  anchor?: Anchor
  imageOffset?: AMap.Vector2
  imageSize?: number
  fitZoom?: number
  scaleFactor?: number
  maxScale?: number
  minScale?: number
}

export interface ElasticMarkerLabel {
  content?: string
  position?: 'BL' | 'BM' | 'BR' | 'ML' | 'MR' | 'TL' | 'TM' | 'TR'
  offset?: AMap.Vector2
  minZoom?: number
}

export interface ElasticMarkerStyle {
  icon?: ElasticMarkerIcon
  label?: ElasticMarkerLabel
}

export interface ElasticMarkerProps {
  position: AMap.Vector2
  zIndex?: number
  anchor?: Anchor
  offset?: AMap.Vector2
  styles?: ElasticMarkerStyle[]
  zoomStyleMapping?: Recordable<number>
}

export interface ElasticMarker extends AMap.Eventable {
  setTitle: Fn<[string]>
  show: EmptyFn
  hide: EmptyFn
  setPosition: Fn<[AMap.Vector2]>
  setAnchor: Fn<[Anchor]>
  setOffset: Fn<[AMap.Vector]>
  setStyle: Fn<[ElasticMarkerStyle[]]>
  setzIndex: Fn<[number]>
  setDraggable: Fn<[boolean]>
  setCursor: Fn<[string]>
  setExtData: Fn<[any]>
  on: Fn<[string, Fn]>
  off: Fn<[string, Fn]>
  clearEvents: Fn<[string]>
  getPosition: Fn<any[], AMap.LngLat>
}
