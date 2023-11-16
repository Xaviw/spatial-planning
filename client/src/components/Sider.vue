<template>
  <div class="h-full overflow-auto" ref="siderRef">
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
import { getSider } from '@sp/shared'
import type { SiderItem } from '#/client'
import { useMenuStore } from '@/store/menu'

const props = defineProps<{
  position: 'left' | 'right'
}>()

const siderRef = ref<HTMLDivElement | null>(null)

const list = ref<SiderItem[]>([])

const { menuIds } = storeToRefs(useMenuStore())

watchEffect(() => {
  const menuId = menuIds.value?.[0]

  if (menuId) {
    getSider(props.position, menuId[0]).then(res => {
      list.value = res
      siderRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }
})
</script>
