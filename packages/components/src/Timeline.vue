<template>
  <div class="px-4 py-2">
    <ATimeline v-bind="props">
      <ATimelineItem v-for="(item, index) of data" :key="index" v-bind="item">
        {{ item.content }}
      </ATimelineItem>
    </ATimeline>
  </div>
</template>

<script setup lang="ts">
import type {
  TimelineProps,
  TimelineItemProps,
} from 'ant-design-vue/es/timeline'

interface TimelineItem extends TimelineItemProps {
  /** 内容 */
  content: string
}

interface Timeline extends TimelineProps {
  /** 内容数组 */
  data: TimelineItem[]
}

const props = withDefaults(defineProps<Timeline>(), {
  data: () => [],
})
</script>

<style>
.ant-timeline-item:last-of-type {
  padding-bottom: 0;
}
</style>
