<template>
  <div class="relative h-full flex">
    <Loading :loading="getting || setting || moving || removing" absolute />

    <div
      class="mr-2 max-w-150 min-w-84 flex flex-basis-30% flex-col bg-white p-4"
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
          autoExpandParent
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

    <div class="flex flex-1 justify-center overflow-auto bg-white px-4 pt-24">
      <div class="max-w-150 w-full">
        <AForm
          :disabled="!selectedKeys[0]"
          :labelCol="{ style: { width: '82px' } }"
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
import { useForm } from '@alova/scene-vue'
import {
  getMenu,
  setMenu,
  addMenu,
  removeMenu,
  moveMenu,
} from '@sp/shared/apis'
import { Loading } from '@sp/shared/components'
import { modal } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { Form, message } from 'ant-design-vue'
import { loop, add, move, remove, update } from './helper'
import type { MenuItem } from '#/client'
import type {
  EventDataNode,
  AntTreeNodeDropEvent,
} from 'ant-design-vue/es/tree'

// 新增时值为['-1', parentKey || '-1'(根目录时)]
const selectedKeys = ref<string[]>([])

const { data: treeData, loading: getting } = useRequest(
  getMenu(false, 'message'),
  {
    initialData: [],
  },
)

const {
  send: sendRemove,
  onSuccess: onRemoveSuccess,
  loading: removing,
} = useRequest(id => removeMenu(id), {
  immediate: false,
})

const {
  send: sendMove,
  onSuccess: onMoveSuccess,
  loading: moving,
} = useRequest(data => moveMenu(data), {
  immediate: false,
})

const {
  form: formData,
  onSuccess: onSetSuccess,
  updateForm,
  reset: resetForm,
  send: sendSet,
  loading: setting,
} = useForm<MenuItem & { parentName: string }>(
  formData => {
    if (selectedKeys.value[0] !== '-1') {
      return setMenu(formData)
    } else {
      return addMenu(formData)
    }
  },
  {
    initialForm: { status: true } as any,
  },
)

const { validateInfos, validate, clearValidate } = Form.useForm(
  formData,
  reactive({
    name: [{ required: true, message: '请填写菜单名称！' }],
  }),
)

async function onConfirm() {
  await validate()
  if (selectedKeys.value[0] !== '-1' && !hasModify()) {
    message.warn('未修改任何数据！')
    return
  }
  sendSet()
}

onSetSuccess(({ data }) => {
  message.success('成功！')
  if (selectedKeys.value[0] === '-1') {
    add(treeData.value, { ...formData.value, id: data })
  } else {
    update(treeData.value, formData.value)
  }
  cancel()
})
onRemoveSuccess(({ sendArgs: [id] }) => {
  message.success('删除成功！')
  remove(treeData.value, id)
  if (selectedKeys.value[0] === id) {
    cancel()
  }
})
onMoveSuccess(({ sendArgs: [param] }) => {
  message.success('移动成功！')
  move(treeData.value, param)
})

async function onMenuClick(_: MouseEvent, node: EventDataNode) {
  await confirmSwitch(node.id)
  resetForm()
  updateForm({
    ...(node.dataRef as unknown as MenuItem),
    parentId: node.parent?.node?.id,
    parentName: node.parent?.node?.name || '根节点',
  })
}

async function onAdd(id: string = '-1') {
  await confirmSwitch(id)
  cancel()
  let parentId,
    parentName = '根节点'
  loop(treeData.value, id, item => {
    parentId = item.id
    parentName = item.name
  })
  selectedKeys.value = ['-1', id]
  resetForm()
  updateForm({ parentId, parentName })
}

async function onRemove(id: string) {
  await modal('confirm', {
    content: '该节点及其子节点将被删除，且不可恢复，是否确认删除？',
  })
  sendRemove(id).then(() => {
    if (selectedKeys.value[0] === id) {
      cancel()
    }
  })
}

function onDrop(e: AntTreeNodeDropEvent) {
  let oldIndex: number,
    oldParent: string | undefined,
    currentIndex: number,
    currentParent: string | undefined

  loop(
    treeData.value,
    e.dragNode.key as string,
    (_item, index, _data, parent) => {
      oldIndex = index
      oldParent = parent?.id
    },
  )

  if (e.dropToGap) {
    currentIndex = e.dropPosition
    loop(
      treeData.value,
      e.node.key as string,
      (_item, _index, _data, parent) => {
        currentParent = parent?.id
      },
    )
  } else {
    currentIndex = 0
    currentParent = e.node.key as string
  }

  const param = {
    oldIndex: oldIndex!,
    oldParent,
    currentIndex: currentIndex!,
    currentParent,
    id: e.dragNode.key,
  }

  sendMove(param)
}

function hasModify() {
  const id = selectedKeys.value[0]
  let flag = false
  if (!id || id === '-1') return flag
  loop(treeData.value, id, item => {
    flag =
      item.name !== formData.value.name || item.status !== formData.value.status
  })
  return flag
}

function cancel() {
  resetForm()
  setTimeout(clearValidate)
  selectedKeys.value = []
}

function confirmSwitch(id: string) {
  if (selectedKeys.value[0] === id) return
  if (selectedKeys.value[0] && id !== '-1' && hasModify()) {
    return modal('confirm', {
      title: '警告',
      content: '您当前的编辑还未保存，是否确认切换？',
    }).then(() => {
      selectedKeys.value = [id]
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
