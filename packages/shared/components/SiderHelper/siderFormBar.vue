<template>
  <div class="flex flex-1 flex-col bg-white p-4">
    <slot name="header" />

    <div
      class="flex items-center border-0 border-b-1px border-gray-3 border-solid pb-4"
      v-if="!inModal"
    >
      <span>菜单筛选：</span>
      <ATreeSelect
        :fieldNames="{ label: 'name', value: 'id' }"
        :filterTreeNode="onMenuFilter"
        placeholder="选择或搜索菜单进行筛选"
        v-model:searchValue="menuSearchValue"
        :value="selectedMenu"
        @update:value="$emit('update: selectedMenu', $event)"
        treedefaultexpandall
        showsearch
        allowclear
        :treeData="menuData"
        @dropdownVisibleChange="onMenuDropdown"
        class="flex-1"
      />
    </div>
    <template v-if="selectedItem">
      <div class="mb-4 flex-1 overflow-auto">
        <SiderBaseForm
          :element="componentForm"
          :rules="componentEditFormRules[selectedItem.type]"
          :inModal="inModal"
          @register="register"
        />
      </div>

      <div class="flex items-center">
        <AButton @click="onConfirm" type="primary" class="mr-4 flex-1">
          确定
        </AButton>
        <AButton @click="onCancel" class="flex-1">取消</AButton>
      </div>
    </template>

    <AEmpty
      v-else
      description="请右击“左栏”、“右栏”中的组件选择“编辑”"
      class="flex flex-1 flex-col justify-center"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends SiderItem | DetailItem">
import { ref, watchEffect } from 'vue'
import { componentEditFormRules, componentEditForms } from '../../components'
import SiderBaseForm from './siderBaseForm'
import { useMenuTree } from './useMenuTree'
import { useSiderForm } from './useSiderForm'
import type { DetailItem, SiderItem } from '#/request'

const props = defineProps<{
  inModal: boolean
  selectedItem?: SiderItem | DetailItem
  selectedMenu?: string
}>()

const emits = defineEmits<{
  (e: 'update: selectedMenu', menuId: string): void
  (e: 'confirm', data: T): void
  (e: 'cancel'): void
}>()

const [register, { getFieldsValue, resetFields, validate }] = useSiderForm()

const { menuData, menuSearchValue, onMenuDropdown, onMenuFilter } =
  useMenuTree()

const componentForm = ref()

watchEffect(async () => {
  if (props.selectedItem) {
    componentForm.value = undefined
    await resetFields(props.selectedItem)
    componentForm.value = componentEditForms[props.selectedItem.type]
  }
})

async function onConfirm() {
  await validate()
  const params = await getFieldsValue()
  emits('confirm', params as T)
}

async function onCancel() {
  await resetFields()
  emits('cancel')
}
</script>

<style>
.editor-block {
  @apply max-w-100 flex items-center border border-[#d9d9d9] border-dashed p-2 pb-0;
}

.editor-btn {
  @apply flex items-center justify-center border border-[#d9d9d9] rounded border-solid p-2 cursor-pointer;
}

:fullscreen {
  background-color: #fff;
}
</style>
