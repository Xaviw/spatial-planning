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
import { getSider } from '@sp/shared'
import type { SiderItem } from '#/client'

const props = defineProps<{
  position: 'left' | 'right'
}>()

const list = ref<SiderItem[]>([])
const route = useRoute()

watchEffect(() => {
  const menuId = route.params.id as string
  if (menuId) {
    getSider(props.position, menuId).then(res => {
      list.value = res
    })
  }
})
</script>