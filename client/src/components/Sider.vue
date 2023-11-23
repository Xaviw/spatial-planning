<template>
  <div class="relative h-full overflow-auto" ref="siderRef">
    <component
      v-for="item of data"
      :key="item.id"
      :is="components[item.type]"
      v-bind="item.props"
      class="mb-2"
    />
  </div>
</template>

<script setup lang="ts">
import { getSider } from '@sp/shared/apis'
import { components } from '@sp/shared/components'
import { useLoading } from '@sp/shared/hooks'
import { useWatcher } from 'alova'
import { useMenuStore } from '@/store/menu'

const props = defineProps<{
  position: 'left' | 'right'
}>()

const siderRef = ref<HTMLDivElement | null>(null)
const { selectedKeys } = storeToRefs(useMenuStore())
const menuId = computed(() => selectedKeys.value[selectedKeys.value.length - 1])
const [openLoading, closeLoading] = useLoading({
  target: siderRef,
  props: {
    absolute: true,
  },
})

const { data, onSuccess, onComplete } = useWatcher(
  () => {
    openLoading()
    return getSider(props.position, menuId.value)
  },
  [menuId],
  { immediate: false, initialData: [], sendable: () => !!menuId.value },
)

onSuccess(() => {
  siderRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
})

onComplete(() => {
  closeLoading()
})
</script>

<style>
.ant-spin-container {
  height: 100%;
}

.ant-spin {
  max-height: none !important;
}
</style>
