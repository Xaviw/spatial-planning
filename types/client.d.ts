export interface ComponentItem {
  id: string
  componentType: string
  componentProps: Recordable
}

export interface SiderItem extends ComponentItem {
  relationMenu: string[]
}

export interface Menu {
  key: string
  label: string
  children?: Menu[]
}
