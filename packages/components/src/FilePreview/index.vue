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
    <i
      class="i-svg-spinners:12-dots-scale-rotate absolute left-50% top-50% translate--50% text-4xl"
    />

    <!-- 视频 -->
    <video v-if="type === MediaEnum.VIDEO" controls :src="src" />
    <!-- 音频 -->
    <audio v-if="type === MediaEnum.AUDIO" controls :src="src" />
    <!-- OFFICE -->
    <iframe
      v-if="type === MediaEnum.OFFICE"
      :src="`https://view.officeapps.live.com/op/embed.aspx?src=${src}`"
      class="relative h-80vh w-80vw"
      frameborder="0"
    />
  </AModal>
</template>

<script setup lang="ts">
import { MediaEnum } from './enum'

withDefaults(
  defineProps<{
    modelValue: boolean
    type: MediaEnum
    src: string
    extName: string
  }>(),
  {
    modelValue: false,
  },
)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
