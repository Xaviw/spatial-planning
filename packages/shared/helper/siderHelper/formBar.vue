<template>
  <div class="min-w-100 flex flex-1 flex-col bg-white p-4">
    <div class="mb-2 flex">
      <div class="flex-1">
        <AButton
          danger
          :disabled="inversePatches.length - patchFlag <= 0"
          @click="$emit('revoke')"
        >
          撤销
        </AButton>
        <AButton
          type="primary"
          class="mx-2"
          ghost
          :disabled="patchFlag <= 0"
          @click="$emit('redo')"
        >
          重做
        </AButton>
      </div>
      <div>
        <AButton
          type="primary"
          @click="onSubmit"
          :disabled="patches.length - patchFlag <= 0"
        >
          提交
        </AButton>
      </div>
    </div>

    <template v-if="!inModal">
      <AAlert showIcon>
        <template #message>
          <div>拖拽“左栏”、“右栏”中的组件移动位置；</div>
          <div>右击“左栏”、“右栏”中的组件进行编辑或删除；</div>
          <div>拖拽“物料栏”中的组件到“左栏”、“右栏”中进行新增；</div>
        </template>
      </AAlert>

      <div
        class="flex items-center border-0 border-b-1px border-gray-3 border-solid py-2"
      >
        <span>选择菜单：</span>
        <ATreeSelect
          :fieldNames="{ label: 'name', value: 'id' }"
          :filterTreeNode="onMenuFilter"
          placeholder="选择或搜索菜单进行筛选"
          v-model:searchValue="menuSearchValue"
          :value="selectedMenu"
          @update:value="$emit('update:selectedMenu', $event)"
          treeDefaultExpandAll
          showSearch
          :treeData="menuData"
          @dropdownVisibleChange="onMenuDropdown"
          @change="$emit('menuChange', $event, selectedMenu)"
          class="flex-1"
        />
      </div>
    </template>

    <template v-if="selectedItem">
      <div class="flex-1 overflow-auto">
        <BaseForm ref="baseFormEl" :inModal="inModal" />

        <component
          :is="componentForms[(selectedItem as T).type]"
          :key="(selectedItem as T).id"
          ref="componentFormEl"
          :inModal="inModal"
        />
      </div>

      <div class="flex">
        <AButton class="mr-4 flex-1" type="primary" @click="onConfirm">
          确定
        </AButton>
        <AButton class="flex-1" danger @click="onCancel">取消</AButton>
      </div>
    </template>

    <AEmpty
      v-else
      description="请右击“左栏”、“右栏”中的组件，选择“编辑”"
      class="h-full flex flex-col items-center justify-center"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends SiderItem | MaterialItem">
import { useMenuTree } from '@sp/shared/hooks'
import { componentForms } from '@sp/shared/materials'
import { modal } from '@sp/shared/utils'
import { isEqual, cloneDeep } from 'lodash-es'
import BaseForm from './baseForm.vue'
import type { MaterialItem, SiderItem } from '#/request'
import type { Patches } from 'mutative'

const props = withDefaults(
  defineProps<{
    inModal?: boolean
    patches: Patches[]
    inversePatches: Patches[]
    patchFlag: number
    selectedMenu?: string
    selectedItem?: T
  }>(),
  {
    inModal: false,
  },
)

const emits = defineEmits<{
  (e: 'revoke'): void
  (e: 'redo'): void
  (e: 'submit'): void
  (e: 'confirm', data: T, equal: boolean): void
  (e: 'cancel'): void
  (e: 'update:selectedMenu', menu: string): void
  (e: 'menuChange', menuId: string, oldMenuId?: string): void
}>()

const baseFormEl = ref<InstanceType<typeof BaseForm> | null>(null)
const componentFormEl = ref<InstanceType<typeof BaseForm> | null>(null)

const { menuData, menuSearchValue, onMenuDropdown, onMenuFilter } =
  useMenuTree()

watchEffect(async () => {
  const item = props.selectedItem
  if (item) {
    await nextTick()
    const baseModel: Partial<T> = cloneDeep(item)
    delete baseModel.props
    baseFormEl.value!.formModel = baseModel
    componentFormEl.value!.formModel = cloneDeep(item.props)
  }
})

async function onConfirm() {
  await baseFormEl.value?.validate()
  await componentFormEl.value?.validate()

  const data = await getData()
  const equal = isEqual(data, props.selectedItem)
  emits('confirm', data, equal)
}

async function onCancel() {
  const data = await getData()
  if (!isEqual(data, props.selectedItem)) {
    await modal('confirm', {
      title: '警告！',
      content: '您当前的编辑还未保存，是否确定取消？',
    })
  }
  emits('cancel')
}

async function onSubmit() {
  if (props.selectedItem) {
    const data = await getData()
    if (!isEqual(data, props.selectedItem)) {
      await modal('confirm', {
        title: '警告！',
        content: '您当前的编辑还未保存，是否确定提交？',
      })
    }
  }
  emits('submit')
}

async function getData() {
  await nextTick()
  return {
    ...baseFormEl.value!.formModel,
    props: componentFormEl.value!.formModel,
  } as T
}

defineExpose({
  getData,
})
</script>
