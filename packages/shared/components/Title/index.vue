<template>
  <div
    class="relative flex items-center from-[#05294B] to-[#05294B] bg-gradient-to-r py-4"
  >
    <!-- 顶部装饰 -->
    <div
      class="absolute left-0 top-0 h-2px w-full from-[#0783FA] from-opacity-100 to-opacity-0 bg-gradient-to-r"
    />

    <!-- 左侧装饰 -->
    <div class="mr-2 h-4 w-2px bg-[#0783FA]" />

    <!-- 底部装饰 -->
    <div class="absolute bottom-0 left-0 h-1px w-8px bg-[#0783FA]" />
    <div
      class="absolute bottom-0 left-10px h-1px w-8px bg-[#0783FA] opacity-70"
    />
    <div
      class="absolute bottom-0 left-20px right-0 h-1px bg-[#0783FA] opacity-50"
    />
    <div class="absolute bottom-0 right-[30%] h-1px w-8 bg-[#FFD15C]" />
    <div class="absolute bottom-0 right-4px h-3px w-6 bg-[#FFD15C]" />

    <i class="i-material-symbols:auto-awesome mr-2 text-3xl text-[#0783FA]" />

    <span class="title flex-1 break-all text-xl font-bold">
      {{ title }}
    </span>

    <div
      class="btn mr-8 cursor-pointer border border-[#2e79b5] rounded-4px border-solid bg-[025493] p-3px"
      v-if="modalData?.length"
    >
      <i class="i-ph:list-bold text-xl text-[#19ECFF]" @click="onOpenDetail" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { components, ContentWrapper } from '@sp/shared/components'
import { useModal } from '@sp/shared/hooks'
import { cloneDeep, merge } from 'lodash-es'
import { h } from 'vue'
import type { SiderItem } from '#/client'

const props = withDefaults(
  defineProps<{
    title: string
    /**
     * 详情弹窗宽度
     * @default 25rem
     */
    modalWidth?: number | string
    /**
     * 弹窗标题，默认`${title}详情`
     */
    modalTitle?: string
    /** 弹窗内容，提供后组件右侧会显示详情按钮 */
    modalData?: SiderItem[]
  }>(),
  {
    modalWidth: '25rem',
  },
)

const { open, close } = useModal('TitleDetail')

function onOpenDetail() {
  open(
    h(
      ContentWrapper,
      {
        title: props.modalTitle || `${props.title}详情`,
        onClose: close,
        style: { width: props.modalWidth },
      },
      () =>
        h(
          'div',
          {
            style: {
              maxHeight: '80vh',
              overflow: 'auto',
              backgroundColor: '#001231',
              color: '#fff',
            },
          },
          props.modalData!.map(comp =>
            h(
              components[comp.type],
              merge(cloneDeep(comp.props), {
                style: { marginBottom: '0.5rem' },
              }),
            ),
          ),
        ),
    ),
  )
}
</script>

<style scoped>
.title {
  text-shadow: 0px 0px 6px rgba(0, 233, 215, 0.6);
}

.btn {
  box-shadow: inset 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
}
</style>
