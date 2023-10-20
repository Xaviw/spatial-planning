<template>
  <div class="h-full overflow-auto">
    <component
      v-for="item of list"
      :key="item.id"
      :is="components[item.componentType]"
      v-bind="item.componentProps"
    />
  </div>
</template>

<script setup lang="ts">
import components from '@sp/components'
import type { Sider } from '#/global'

const list: Sider[] = [
  {
    id: '1',
    componentType: 'Title',
    componentProps: { title: '大标题' },
    relationMenu: [],
  },
  {
    id: '2',
    componentType: 'SubTitle',
    componentProps: { title: '副标题' },
    relationMenu: [],
  },
]
</script>
