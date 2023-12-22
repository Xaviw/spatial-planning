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
