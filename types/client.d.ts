export interface ComponentItem {
  id: string
  componentType: string
  componentProps: Recordable
}

export interface SiderItem extends ComponentItem {
  relationMenu: string[]
}

export interface MenuItem {
  id: string
  parentId?: string
  name: string
  sort?: number
  status: boolean
  children?: MenuItem[]
}
