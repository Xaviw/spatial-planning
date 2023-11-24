<template>
  <Draggable :list="componentList" itemKey="id">
    <template #item="{ element }">
      <component
        :is="components[element.type]"
        v-bind="element.props"
        class="mb-2"
      />
    </template>
  </Draggable>
</template>

<script setup lang="ts">
import { components } from '@sp/shared/components'
import Draggable from 'vuedraggable'

withDefaults(
  defineProps<{
    componentList?: any[]
    relationMenuIds?: string[]
  }>(),
  {
    componentList: () => [],
    relationMenuIds: () => [],
  },
)
</script>
