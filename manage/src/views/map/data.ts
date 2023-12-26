import type { LayerItem, MaterialItem, OverlayItem } from '#/request'

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
  layers: Omit<LayerItem, 'overlays'>[]
  overlays: Omit<OverlayItem, 'details'>[]
  details: MaterialItem[]
}
