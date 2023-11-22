import type { Key } from 'ant-design-vue/es/_util/type'
import type { DataNode } from 'ant-design-vue/es/tree'

export function loop(
  data: DataNode[],
  key: Key,
  callback: (
    item: DataNode,
    index: number,
    data: DataNode[],
    parent?: DataNode,
  ) => void,
  parent?: DataNode,
) {
  data.forEach((item, index) => {
    if (item.id === key) {
      return callback(item, index, data, parent)
    }
    if (item.children?.length) {
      return loop(item.children, key, callback, item)
    }
  })
}

export function remove(treeData: DataNode[], id: string) {
  loop(treeData, id, (_item, index, data) => {
    data.splice(index, 1)
  })
}

export function move(
  treeData: DataNode[],
  data: {
    oldIndex: number
    oldParent?: Key
    currentIndex: number
    currentParent?: Key
  },
) {
  const { oldIndex, oldParent, currentIndex, currentParent } = data
  let node: DataNode = { key: 1 }

  if (oldParent) {
    loop(treeData, oldParent, item => {
      node = item.children![data.oldIndex]
      item.children?.splice(oldIndex, 1)
    })
  } else {
    node = treeData[oldIndex]
    treeData.splice(oldIndex, 1)
  }

  if (currentParent) {
    loop(treeData, currentParent, item => {
      item.splice(currentIndex, 0, node)
    })
  } else {
    treeData.splice(currentIndex, 0, node)
  }
}

export function update(treeData: DataNode[], data: DataNode) {
  loop(treeData, data.id, (item, index, arr) => {
    arr[index] = { ...item, ...data }
  })
}

export function add(treeData: DataNode[], data: DataNode) {
  if (!data.parentId) {
    treeData.push(data)
  } else {
    loop(treeData, data.parentId, item => {
      item.children = item.children || []
      item.children.push(data)
    })
  }
}
