import type {
  LayerItem,
  MaterialItem,
  OverlayItem,
  OverlayType,
} from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

export type ToolKeys =
  | keyof Pick<
      AMap.MouseTool,
      | 'marker'
      | 'polygon'
      | 'polyline'
      | 'rectangle'
      | 'circle'
      | 'rule'
      | 'measureArea'
    >
  | 'text'

export interface ToolItem {
  icon: string
  name: string
  key: ToolKeys
}

export interface MapMutativeState {
  layers: Omit<LayerItem<OverlayType>, 'overlays'>[]
  overlays: Omit<OverlayItem<OverlayType>, 'details'>[]
  details: MaterialItem[]
}
