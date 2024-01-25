<template>
  <div
    :class="[
      'relative',
      'w-100',
      'transition-all',
      'z-1',
      !open && (position === 'left' ? 'ml--100' : 'mr--100'),
    ]"
  >
    <Loading absolute :loading="loading" />

    <div class="h-full overflow-auto" ref="siderRef">
      <component
        v-for="item of data"
        :key="item.id"
        :is="materials[item.material.type]"
        v-bind="item.material.props"
        class="mb-2"
      />
    </div>

    <div
      :class="[
        'client-trigger-btn',
        'client-arrow',
        position === 'left' ? 'right-0' : 'left-0',
        position === 'left' ? 'translate-x-[100%]' : 'translate-x-[-100%]',
        position === 'left' ? 'rounded-r' : 'rounded-l',
      ]"
      @click="open = !open"
    >
      <i
        :class="[
          'i-material-symbols:arrow-forward-ios',
          'transition-all',
          position === 'left' && open && 'rotate-180',
          position === 'right' && !open && 'rotate-180',
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@sp/shared/components'
import { materials } from '@sp/shared/materials'
import { useMainStore } from '../stores/main'
import type { SiderPosition } from '#/business'

const props = defineProps<{
  position: SiderPosition
}>()

const { leftData, leftLoading, rightData, rightLoading } = storeToRefs(
  useMainStore(),
)

const data = computed(() => {
  return props.position === 'left' ? leftData.value : rightData.value
})

const loading = computed(() => {
  return props.position === 'left' ? leftLoading.value : rightLoading.value
})

const open = ref(true)

const siderRef = ref<HTMLDivElement | null>(null)

watch(data, () => {
  siderRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>
