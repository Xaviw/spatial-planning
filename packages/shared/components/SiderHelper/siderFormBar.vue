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

    <div class="mb-4 flex-1 overflow-auto">
      <SiderBaseForm
        v-if="selectedItem"
        :element="componentEditForms[selectedItem.type]"
        :rules="componentEditFormRules[selectedItem.type]"
        :inModal="inModal"
        @register="register"
      />

      <AEmpty
        v-if="!selectedItem"
        description="请右击“左栏”、“右栏”中的组件选择“编辑”"
        class="h-full flex flex-col justify-center"
      />
    </div>

    <div class="flex items-center">
      <AButton @click="onSubmit" type="primary" class="mr-4 flex-1">
        确定
      </AButton>
      <AButton @click="onCancel" class="flex-1">取消</AButton>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends SiderItem | DetailItem">
import { watchEffect } from 'vue'
import { componentEditFormRules, componentEditForms } from '../../components'
import SiderBaseForm from './siderBaseForm'
import { useMenuTree } from './useMenuTree'
import { useSiderForm } from './useSiderForm'
import type { DetailItem, SiderItem } from '#/client'

const props = defineProps<{
  inModal: boolean
  selectedItem?: SiderItem | DetailItem
  selectedMenu?: string
}>()

const emits = defineEmits<{
  (e: 'update: selectedMenu', menuId: string): void
  (e: 'submit', data: T): void
  (e: 'cancel'): void
}>()

const [register, { getFieldsValue, resetFields, validate }] = useSiderForm()

const { menuData, menuSearchValue, onMenuDropdown, onMenuFilter } =
  useMenuTree()

watchEffect(() => {
  if (props.selectedItem) {
    resetFields(props.selectedItem)
  }
})

async function onSubmit() {
  await validate()
  const params = await getFieldsValue()
  emits('submit', params as T)
}

async function onCancel() {
  await resetFields()
  emits('cancel')
}
</script>
