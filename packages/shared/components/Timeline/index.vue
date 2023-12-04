<template>
  <div class="px-4 py-2">
    <ATimeline v-bind="props" class="mb--8">
      <ATimelineItem v-for="(item, index) of data" :key="index" v-bind="item">
        {{ item.content }}
      </ATimelineItem>
    </ATimeline>
  </div>
</template>

<script setup lang="ts">
import type { TimelineProps } from '#/components'

const props = withDefaults(defineProps<TimelineProps>(), {
  data: () => [],
})
</script>

<style scoped>
:deep(.ant-timeline-item:last-of-type) {
  padding-bottom: 0;
}
:deep(.ant-timeline) {
  color: #fff;
}
:deep(.ant-timeline-item-tail) {
  background-color: #ffffff55;
}
</style>
