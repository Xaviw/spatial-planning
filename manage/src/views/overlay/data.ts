export type ToolKeys = keyof Pick<
  AMap.MouseTool,
  | 'marker'
  | 'polygon'
  | 'polyline'
  | 'rectangle'
  | 'circle'
  | 'rule'
  | 'measureArea'
>

export interface ToolItem {
  icon: string
  name: string
  key: ToolKeys
}
