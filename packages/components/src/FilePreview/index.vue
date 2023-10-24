<template>
  <AModal
    :open="modelValue"
    @update:open="(e: boolean) => $emit('update:modelValue', e)"
    centered
    :closable="false"
    :footer="null"
    width="auto"
    :bodyStyle="{
      padding: 0,
      background: 'transparent',
    }"
  >
    <!-- 视频 -->
    <video v-if="type === MediaEnum.VIDEO" controls :src="src" />
    <!-- 音频 -->
    <audio v-if="type === MediaEnum.AUDIO" controls :src="src" />
  </AModal>
</template>

<script setup lang="ts">
import { MediaEnum } from './enum'

withDefaults(
  defineProps<{
    modelValue: boolean
    type: string
    src: string
  }>(),
  {
    modelValue: false,
  },
)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
