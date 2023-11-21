<template>
  <div class="relative h-full flex">
    <Loading :loading="setLoading || getLoading" absolute />

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

        <AButton type="primary" @click="add()">新增根节点</AButton>
      </div>

      <div class="flex-1 overflow-auto">
        <ATree
          v-if="data.length"
          defaultExpandAll
          draggable
          :treeData="data"
          :fieldNames="{ title: 'name', key: 'id' }"
          :selectedKeys="selectedKeys"
          @click="onMenuClick"
          @drop="onDrop"
        >
          <template #title="item">
            <div class="tree-item flex items-center">
              <span class="flex-1 leading-32px">{{ item.name }}</span>
              <AButton type="link" class="ml-2" @click.stop="add(item.data)">
                新增
              </AButton>
              <AButton type="link" danger @click.stop="remove(item)">
                删除
              </AButton>
            </div>
          </template>
        </ATree>
      </div>
    </div>

    <div class="flex flex-1 justify-center overflow-auto bg-white pt-24">
      <div class="max-w-150 w-full">
        <AForm :disabled="!editFlag" :labelCol="{ style: { width: '100px' } }">
          <AFormItem
            label="父级菜单"
            v-bind="validateInfos.parentName"
            required
          >
            <AInput :value="form.parentName" disabled />
          </AFormItem>
          <AFormItem label="名称" v-bind="validateInfos.name">
            <AInput v-model:value="form.name" />
          </AFormItem>
          <AFormItem
            label="状态"
            v-bind="validateInfos.status"
            extra="禁用的菜单将不会在前台显示"
            required
          >
            <ASwitch
              v-model:checked="form.status"
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
import { getMenu, setMenu, addMenu, removeMenu } from '@sp/shared/apis'
import { Loading } from '@sp/shared/components'
import { modal } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { Form, message } from 'ant-design-vue'
import type { MenuItem } from '#/client'
import type { Method } from 'alova'
import type { Rule } from 'ant-design-vue/es/form'
import type {
  AntTreeNodeDropEvent,
  EventDataNode,
} from 'ant-design-vue/es/tree'

const {
  data,
  loading: getLoading,
  send: sendGet,
} = useRequest(getMenu as (...args: any[]) => Method, {
  initialData: [],
})

const {
  form,
  updateForm,
  reset,
  send: sendSet,
  loading: setLoading,
  onSuccess: onFormSuccess,
} = useForm(
  formData => {
    if (formData.id) {
      return setMenu(formData)
    } else {
      return addMenu(formData)
    }
  },
  {
    initialForm: {
      id: '',
      parentId: '',
      parentName: '',
      name: '',
      sort: 1,
      status: true,
    },
  },
)

const rules = reactive<Record<string, Rule[]>>({
  name: [{ required: true, message: '请填写菜单名称！' }],
})

const { validateInfos, validate, clearValidate } = Form.useForm(form, rules)

const selectedKeys = ref<string[]>([])
const editFlag = ref(false)

onFormSuccess(() => {
  message.success('成功！')
  sendGet()
})

function confirmSwitch() {
  if (editFlag.value) {
    return modal('confirm', {
      title: '警告',
      content: '您当前的编辑还未保存，是否确认切换？',
    })
  } else {
    editFlag.value = true
  }
}

async function onMenuClick(_: any, node: EventDataNode) {
  if (form.value.id === node.id) return
  await confirmSwitch()
  selectedKeys.value = [node.id]
  reset()
  updateForm({
    ...(node.dataRef as unknown as MenuItem),
    parentId: node.parent?.node?.id,
    parentName: node.parent?.node?.name || '根节点',
  })
}

function cancel() {
  reset()
  setTimeout(clearValidate)
  editFlag.value = false
  selectedKeys.value = []
}

async function onConfirm() {
  await validate()
  sendSet()
}

async function add(parent?: MenuItem) {
  await confirmSwitch()
  cancel()
  updateForm({
    parentId: parent?.id,
    parentName: parent?.name || '根节点',
  })
}

async function remove(item: any) {
  await modal('confirm', {
    content: '该节点及其子节点将被删除，且不可恢复，是否确认删除？',
  })
  getLoading.value = true
  removeMenu(item.id)
    .send()
    .then(() => {
      sendGet()
      message.success('删除成功！')
      if (editFlag.value && form.value.id === item.id) {
        cancel()
      }
    })
    .catch(() => {
      getLoading.value = false
    })
}

function onDrop(e: AntTreeNodeDropEvent) {
  console.log('e: ', e)
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
