<template>
  <div class="sidebar">
    <div class="materials-modal-header">
      <i class="i-ant-design:pic-left-outlined mr-2" />
      左栏
    </div>

    <div class="flex-1 overflow-auto">
      <DraggableList
        v-model="list.left"
        group="sider"
        id="left"
        enableContextMenu
        :disabled="!selectedMenu"
        @edit="onEdit"
        @remove="onRemove"
        :selectedId="selectedItem?.id"
        :filterMenu="selectedMenu"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DraggableList } from '@sp/shared/helpers/sider'
</script>
