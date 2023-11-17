<template>
  <div class="h-full overflow-auto" ref="siderRef">
    <component
      v-for="item of data"
      :key="item.id"
      :is="components[item.componentType]"
      v-bind="item.componentProps"
      class="mb-2"
    />
  </div>
</template>

<script setup lang="ts">
import { getSider } from '@sp/shared/apis'
import { components } from '@sp/shared/components'
import { useWatcher } from 'alova'
import { useMenuStore } from '@/store/menu'

const props = defineProps<{
  position: 'left' | 'right'
}>()

const siderRef = ref<HTMLDivElement | null>(null)
const { menuIds } = storeToRefs(useMenuStore())
const menuId = computed(() => menuIds.value?.[0])

const { data, onSuccess } = useWatcher(
  () => getSider(props.position, menuIds.value![0]),
  [menuId],
  { immediate: false, initialData: [] },
)

onSuccess(() => {
  siderRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>
