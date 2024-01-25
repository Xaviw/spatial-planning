<template>
  <div>
    <div class="mb-2 flex">
      <div class="flex-1">
        <AButton danger @click="undo" :disabled="!canUndo">撤销</AButton>
        <AButton
          type="primary"
          class="mx-2"
          ghost
          @click="redo"
          :disabled="!canRedo"
        >
          重做
        </AButton>
      </div>
      <AButton type="primary" :disabled="!canUndo" @click="onSubmit">
        提交
      </AButton>
    </div>

    <AAlert showIcon>
      <template #message>
        <div>右击覆盖物进行操作</div>
      </template>
    </AAlert>

    <div class="my-2 flex items-center">
      <span>选择菜单：</span>
      <ATreeSelect
        :fieldNames="{ label: 'name', value: 'id' }"
        :filterTreeNode="onMenuFilter"
        placeholder="选择或搜索菜单进行筛选"
        v-model:searchValue="menuSearchValue"
        v-model:value="selectedMenu"
        treeDefaultExpandAll
        showSearch
        :treeData="menuData"
        @dropdownVisibleChange="onMenuDropdown"
        @change="getList"
        class="flex-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiderStore } from '@sp/shared/helpers/sider'
import { useMenuTree } from '@sp/shared/hooks'

const siderStore = useSiderStore()
const { canRedo, canUndo } = storeToRefs(siderStore)
const { redo, undo, getList } = siderStore

const {
  onMenuDropdown,
  menuData,
  menuSearchValue,
  onMenuFilter,
  selectedMenu,
} = useMenuTree()

function onSubmit() {}
</script>
