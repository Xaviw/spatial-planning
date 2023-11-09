<template>
  <AMenu
    forceSubMenuRender
    mode="horizontal"
    :items="items"
    @click="handleClick"
    :openKeys="['sub1', 'sub1-2', '5']"
    :selectedKeys="['5']"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MenuProps } from 'ant-design-vue'

const items = ref([
  {
    key: '1',
    label: 'Navigation One',
    title: 'Navigation One',
  },
  {
    key: '2',
    label: 'Navigation Two',
    title: 'Navigation Two',
  },
  {
    key: 'sub1',
    label: 'Navigation Three',
    title: 'Navigation Three',
    children: [
      {
        key: '3',
        label: 'Option 3',
        title: 'Option 3',
      },
      {
        key: '4',
        label: 'Option 4',
        title: 'Option 4',
      },
      {
        key: 'sub1-2',
        label: 'Submenu',
        title: 'Submenu',
        children: [
          {
            key: '5',
            label: 'Option 5',
            title: 'Option 5',
          },
          {
            key: '6',
            label: 'Option 6',
            title: 'Option 6',
          },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Four',
    title: 'Navigation Four',
    children: [
      {
        key: '7',
        label: 'Option 7',
        title: 'Option 7',
      },
      {
        key: '8',
        label: 'Option 8',
        title: 'Option 8',
      },
      {
        key: '9',
        label: 'Option 9',
        title: 'Option 9',
      },
      {
        key: '10',
        label: 'Option 10',
        title: 'Option 10',
      },
    ],
  },
])
const handleClick: MenuProps['onClick'] = menuInfo => {
  console.log('click ', menuInfo)
}
</script>

<style>
.ant-menu-horizontal {
  border-bottom: 0;
}

.ant-menu-light.ant-menu-submenu > .ant-menu {
  background: transparent !important;
}

.ant-menu-overflow-item {
  background: linear-gradient(90deg, #007fd9, rgba(0, 134, 229, 0) 100%);
  margin-right: 8px !important;
}

.ant-menu-item,
.ant-menu-submenu {
  padding: 0 60px 0 16px !important;
}
</style>
