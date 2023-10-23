<template>
  <div
    class="flex items-center from-blue-900 to-blue-300 from-opacity-70 to-opacity-10 bg-gradient-to-r px-4 py-2"
  >
    <AImage
      v-if="imgSrc"
      :width="imgWidth"
      :height="imgHeight"
      :preview="imgPreview"
      :src="imgSrc"
    />
    <i
      class="i-material-symbols:chart-data-outline-sharp text-3xl text-blue-300"
      v-else
    />

    <span class="mx-4 flex-1 overflow-hidden text-ellipsis text-2xl">
      {{ title }}
    </span>

    <span class="text-2xl text-yellow">{{ content }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /**
     * 图片宽度
     * @default 42
     */
    imgWidth?: number
    /**
     * 图片高度
     * @default 42
     */
    imgHeight?: number
    /**
     * 图片是否支持预览
     * @default true
     */
    imgPreview?: boolean
    /** 图片链接 */
    imgSrc?: string
    /** 标题 */
    title: string
    /** 内容 */
    content: string | number
  }>(),
  {
    imgWidth: 42,
    imgHeight: 42,
    imgPreview: true,
  },
)
</script>
