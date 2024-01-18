import { loop } from '@sp/shared/utils'
import type { MenuItem } from '#/business'

export function remove(treeData: MenuItem[], id: string) {
  loop(
    treeData,
    'id',
    'children',
    (_item, index, data) => {
      data.splice(index, 1)
    },
    id,
  )
}

export function move(
  treeData: MenuItem[],
  data: {
    oldIndex: number
    oldParentId?: string
    currentIndex: number
    currentParentId?: string
  },
) {
  const { oldIndex, oldParentId, currentIndex, currentParentId } = data
  let node: MenuItem | undefined

  if (oldParentId) {
    loop(
      treeData,
      'id',
      'children',
      item => {
        node = item.children![oldIndex]
        item.children?.splice(oldIndex, 1)
      },
      oldParentId,
    )
  } else {
    node = treeData[oldIndex]
    treeData.splice(oldIndex, 1)
  }

  if (!node) {
    throw new Error('未获取到拖拽节点！')
  }

  if (currentParentId) {
    loop(
      treeData,
      'id',
      'children',
      item => {
        item.children = item.children || []
        item.children.splice(currentIndex, 0, node!)
      },
      currentParentId,
    )
  } else {
    treeData.splice(currentIndex, 0, node)
  }
}

export function update(treeData: MenuItem[], data: MenuItem) {
  loop(
    treeData,
    'id',
    'children',
    (item, index, arr) => {
      arr[index] = {
        ...item,
        ...data,
        updateTime: new Date().toLocaleString(),
      }
    },
    data.id,
  )
}

export function add(treeData: MenuItem[], data: MenuItem) {
  const createTime = new Date().toLocaleString(),
    updateTime = new Date().toLocaleString()
  if (!data.parentId) {
    treeData.push({
      ...data,
      createTime,
      updateTime,
    })
  } else {
    loop(
      treeData,
      'id',
      'children',
      item => {
        item.children = item.children || []
        item.children.push({
          ...data,
          createTime,
          updateTime,
        })
      },
      data.parentId,
    )
  }
}
