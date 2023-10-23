<template>
  <div class="h-full overflow-auto">
    <component
      v-for="item of list"
      :key="item.id"
      :is="components[item.componentType]"
      v-bind="item.componentProps"
      class="mb-2"
    />
  </div>
</template>

<script setup lang="ts">
import components from '@sp/components'
import type { Sider } from '#/client'

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
  {
    id: '3',
    componentType: 'DataCard',
    componentProps: {
      title: '数据展示',
      content: 123,
      // imgSrc:
      //   'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    relationMenu: [],
  },
  {
    id: '4',
    componentType: 'Description',
    componentProps: {
      data: [
        { label: 'A', value: 1 },
        { label: 'B', value: 2 },
        { label: 'C', value: 3, span: 2 },
      ],
    },
    relationMenu: [],
  },
]
</script>
