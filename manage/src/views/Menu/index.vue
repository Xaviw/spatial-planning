<template>
  <div class="relative h-full flex">
    <Loading :loading="getting" absolute />

    <div
      class="mr-2 max-w-150 min-w-50 flex flex-basis-30% flex-col bg-white p-4"
    >
      <div class="flex items-center justify-between">
        <AAlert showIcon class="mr-4 flex-1">
          <template #message>
            <div>点击菜单项进入编辑</div>
            <div>支持拖拽排序</div>
          </template>
        </AAlert>

        <AButton type="primary" @click="onAdd()">新增根节点</AButton>
      </div>

      <div class="flex-1 overflow-auto">
        <ATree
          v-if="treeData.length"
          defaultExpandAll
          draggable
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'id' }"
          :selectedKeys="selectedKeys"
          @click="onMenuClick"
          @drop="onDrop"
        >
          <template #title="item">
            <div class="tree-item flex items-center">
              <span class="flex-1 leading-32px">{{ item.name }}</span>
              <AButton type="link" class="ml-2" @click.stop="onAdd(item.id)">
                新增
              </AButton>
              <AButton type="link" danger @click.stop="onRemove(item.id)">
                删除
              </AButton>
            </div>
          </template>
        </ATree>
      </div>
    </div>

    <div class="flex flex-1 justify-center overflow-auto bg-white pt-24">
      <div class="max-w-150 w-full">
        <AForm
          :disabled="!selectedKeys[0]"
          :labelCol="{ style: { width: '100px' } }"
        >
          <AFormItem
            label="父级菜单"
            v-bind="validateInfos.parentName"
            required
          >
            <AInput :value="formData.parentName" disabled />
          </AFormItem>
          <AFormItem label="名称" v-bind="validateInfos.name">
            <AInput v-model:value="formData.name" />
          </AFormItem>
          <AFormItem
            label="状态"
            v-bind="validateInfos.status"
            extra="禁用的菜单将不会在前台显示"
            required
          >
            <ASwitch
              v-model:checked="formData.status"
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </AFormItem>
          <div class="ml-100px mt-8 flex justify-center">
            <AButton class="mr-8" @click="cancel">取消</AButton>
            <AButton type="primary" @click="onConfirm">确认</AButton>
          </div>
        </AForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { filterSilentMethods, useSQRequest } from '@alova/scene-vue'
import {
  getMenu,
  setMenu,
  addMenu,
  removeMenu,
  moveMenu,
} from '@sp/shared/apis'
import { Loading } from '@sp/shared/components'
import { modal } from '@sp/shared/utils'
import { Form } from 'ant-design-vue'
import { add, move, remove, update, loop } from './helper'
import type { Key } from 'ant-design-vue/es/_util/type'
import type {
  EventDataNode,
  DataNode,
  AntTreeNodeDropEvent,
} from 'ant-design-vue/es/tree'

const getDefaultFormData = () => ({
  id: '',
  parentId: '',
  parentName: '',
  name: '',
  status: true,
})
const formData = ref<any>(getDefaultFormData())

const {
  data: treeData,
  loading: getting,
  onSuccess: onGetSuccess,
} = useSQRequest(() => getMenu<DataNode[]>(false), {
  behavior: 'silent',
  initialData: [],
})

onGetSuccess(() => {
  const methods = filterSilentMethods()
  methods.forEach(method => {
    if (!method.reviewData) return
    const { operate, data } = method.reviewData
    if (operate === 'remove') {
      remove(treeData.value, data.id)
    } else if (operate === 'update') {
      update(treeData.value, data)
    } else if (operate === 'add') {
      add(treeData.value, data)
    } else if (operate === 'move') {
      move(treeData.value, data)
    }
  })
})

const { send: sendRemove, onSuccess: onRemoveSuccess } = useSQRequest(
  id => removeMenu(id),
  {
    behavior: 'silent',
    immediate: false,
  },
)

onRemoveSuccess(({ sendArgs: [id], silentMethod }) => {
  remove(treeData.value, id)
  if (selectedKeys.value[0] === id) {
    cancel()
  }
  if (silentMethod) {
    silentMethod.reviewData = {
      operate: 'remove',
      data: { id },
    }
    silentMethod.save()
  }
})

const { send: sendUpdate, onSuccess: onUpdateSuccess } = useSQRequest(
  data => setMenu(data),
  {
    behavior: 'silent',
    immediate: false,
  },
)

onUpdateSuccess(({ sendArgs: [data], silentMethod }) => {
  update(treeData.value, data)
  cancel()
  if (silentMethod) {
    silentMethod.reviewData = {
      operate: 'update',
      data,
    }
    silentMethod.save()
  }
})

const { send: sendAdd, onSuccess: onAddSuccess } = useSQRequest(
  data => addMenu(data),
  {
    behavior: 'silent',
    immediate: false,
  },
)

onAddSuccess(({ sendArgs: [data], silentMethod }) => {
  add(treeData.value, data)
  cancel()
  if (silentMethod) {
    silentMethod.reviewData = {
      operate: 'add',
      data,
    }
    silentMethod.save()
  }
})

const { send: sendMove, onSuccess: onMoveSuccess } = useSQRequest(
  data => moveMenu(data),
  {
    behavior: 'silent',
    immediate: false,
  },
)

onMoveSuccess(({ sendArgs: [data], silentMethod }) => {
  move(treeData.value, data)
  if (silentMethod) {
    silentMethod.reviewData = {
      operate: 'move',
      data,
    }
    silentMethod.save()
  }
})

const { validateInfos, validate, clearValidate } = Form.useForm(formData, {
  name: [{ required: true, message: '请填写菜单名称！' }],
})

// 新增时值为[-1, parentKey || -1(根目录时)]
const selectedKeys = ref<Key[]>([])

async function onMenuClick(_: MouseEvent, node: EventDataNode) {
  await confirmSwitch(node.id)
  formData.value = {
    ...node.dataRef,
    parentId: node.parent?.node?.id,
    parentName: node.parent?.node?.name || '根节点',
  }
}

async function onAdd(id: Key = -1) {
  await confirmSwitch(id)
  cancel()
  let parentId,
    parentName = '根节点'
  loop(treeData.value, id, item => {
    parentId = item.id
    parentName = item.name
  })
  selectedKeys.value = [-1, id]
  formData.value = { ...getDefaultFormData(), parentId, parentName }
}

async function onRemove(id: Key) {
  await modal('confirm', {
    content: '该节点及其子节点将被删除，且不可恢复，是否确认删除？',
  })
  sendRemove(id)
}

async function onConfirm() {
  await validate()
  if (formData.value.id) {
    sendUpdate(formData.value)
  } else {
    sendAdd(formData.value)
  }
}

function onDrop(e: AntTreeNodeDropEvent) {
  let oldIndex: number,
    oldParent: Key | undefined,
    currentIndex: number,
    currentParent: Key | undefined

  loop(treeData.value, e.dragNode.key, (_item, index, _data, parent) => {
    oldIndex = index
    oldParent = parent?.id
  })

  if (e.dropToGap) {
    currentIndex = e.dropPosition
    loop(treeData.value, e.node.key, (_item, _index, _data, parent) => {
      currentParent = parent?.id
    })
  } else {
    currentIndex = 0
    currentParent = e.node.key!
  }

  sendMove({
    oldIndex: oldIndex!,
    oldParent,
    currentIndex: currentIndex!,
    currentParent,
  })
}

function cancel() {
  formData.value = getDefaultFormData()
  setTimeout(clearValidate)
  selectedKeys.value = []
}

function confirmSwitch(id: Key) {
  if (selectedKeys.value[0] === id) return
  if (selectedKeys.value[0] && id !== -1) {
    return modal('confirm', {
      title: '警告',
      content: '您当前的编辑还未保存，是否确认切换？',
    })
  } else {
    selectedKeys.value = [id]
  }
}
</script>

<style scoped>
:deep(.ant-tree-list-holder-inner) {
  align-items: stretch;
}
:deep(.ant-tree-treenode) {
  width: 100%;
}
:deep(.ant-tree-switcher) {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.ant-tree-node-content-wrapper) {
  flex: 1;
}
.tree-item > button {
  display: none;
}
.tree-item:hover > button {
  display: block;
}
</style>
