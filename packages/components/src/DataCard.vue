<template>
  <div
    class="flex items-center from-[#043563] to-[#043563] from-opacity-10 to-opacity-100 bg-gradient-to-r p-4"
  >
    <div
      class="relative flex items-center justify-center border-24px border-[#0E4A85] border-l-[#053670] border-solid"
    >
      <div class="absolute" v-if="imgSrc">
        <AImage
          :width="imgWidth > 48 || imgWidth < 20 ? 36 : imgWidth"
          :height="imgHeight > 48 || imgHeight < 20 ? 36 : imgHeight"
          :preview="imgPreview"
          :src="imgSrc"
        >
          <template #previewMask>
            <i class="i-ant-design:eye-outlined" />
          </template>
        </AImage>
      </div>
      <i
        class="i-solar:database-bold-duotone absolute text-3xl text-blue-300"
        v-else
      />
    </div>

    <span class="mx-4 flex-1 break-all text-lg">
      {{ title }}
    </span>

    <span class="text-3xl font-bold text-[#FFD15C]">{{ content }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /**
     * 图片宽度，最大48，最小20
     * @default 36
     */
    imgWidth?: number
    /**
     * 图片高度，最大48，最小20
     * @default 36
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
    imgWidth: 36,
    imgHeight: 36,
    imgPreview: true,
  },
)
</script>
