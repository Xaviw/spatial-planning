<template>
  <ACarousel class="px-4">
    <div
      v-for="(item, index) of data"
      :key="index"
      class="items-center justify-center flex!"
    >
      <AImage
        :src="item"
        class="w-full"
        :style="{ maxHeight: height + 'px' }"
      />
    </div>
  </ACarousel>
</template>

<script setup lang="ts">
import type { CarouselProps } from 'ant-design-vue/es/carousel/index'

withDefaults(
  defineProps<
    CarouselProps & {
      /** 图片链接数组 */
      data: string[]
      /**
       * 是否自动切换
       * @default true
       */
      autoplay?: boolean
      /** 各图片高度差距过多时可以限制组件高度，避免短图片底部留白 */
      height?: number
    }
  >(),
  {
    data: () => [],
    autoplay: true,
  },
)
</script>
