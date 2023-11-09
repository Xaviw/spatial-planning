<template>
  <AMenu
    forceSubMenuRender
    mode="horizontal"
    :items="items"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MenuProps } from 'ant-design-vue'

const items = ref([
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
  background: linear-gradient(90deg, #007fd9, rgba(0, 134, 229, 0) 100%);
}

.ant-menu-overflow-item {
  background: linear-gradient(90deg, #007fd9, rgba(0, 134, 229, 0) 100%);
  margin-right: 8px !important;
  clip-path: polygon(18px 0%, 100% 0%, calc(100% - 18px) 100%, 0% 100%);
}

.ant-menu-overflow-item::before {
  content: '';
  display: block;
  width: 26px;
  height: 2.4em;
  position: absolute;
  /* top: 0.3em; */
  left: 0;
  background: linear-gradient(180deg, #016fbc 5%, #00e0ff 100%);
  clip-path: polygon(18px 0%, 100% 0%, calc(100% - 18px) 100%, 0% 100%);
}

.ant-menu-item,
.ant-menu-submenu {
  padding: 0 40px 0 30px !important;
}

.ant-menu-horizontal {
  line-height: 2.4em;
}

.ant-menu-item-selected::before,
.ant-menu-submenu-selected::before {
  background: linear-gradient(180deg, #b09302 0%, #ffe14d 100%);
}

.ant-menu-submenu-title {
  padding-inline: 0 34px !important;
}

.ant-menu-submenu-popup {
  padding: 0 !important;
}
</style>
