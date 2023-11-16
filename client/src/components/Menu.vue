<template>
  <AMenu
    forceSubMenuRender
    mode="horizontal"
    :items="menu"
    v-model:selectedKeys="menuIds"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { type MenuProps } from 'ant-design-vue'
import { useMenuStore } from '@/store/menu'

const route = useRoute()
const router = useRouter()

const menuStore = useMenuStore()
const { menu, menuIds } = storeToRefs(menuStore)
const { isIncluded, getFirstMenu, setMenuId } = menuStore

watchEffect(() => {
  const paramId = route.params.id as string

  if (menu.value.length && (!paramId || !isIncluded(paramId))) {
    const firstId = getFirstMenu()
    router.replace('/' + firstId)
  } else if (menu.value.length) {
    setMenuId(paramId)
  }
})

const handleClick: MenuProps['onClick'] = ({ key }) => {
  router.push(key as string)
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
