<template>
  <div
    class="grid"
    :style="{
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: gap,
      marginInline: gap,
    }"
  >
    <div
      v-for="(item, index) of dataWithPreset"
      :key="index"
      v-bind="item"
      class="flex flex-col items-center"
    >
      <div
        v-if="item.img || item.type === 'image'"
        @click="onPreview(item)"
        class="cursor-pointer"
      >
        <AImage
          :height="item.imgHeight"
          :width="item.imgWidth"
          :src="item.img || item.src"
          :fallback="getStaticFile('/failed.png')"
          :preview="false"
        />
      </div>

      <i
        v-else
        :class="[item.icon, 'text-64px', 'cursor-pointer', 'text-blue-3']"
        @click="onPreview(item)"
      />

      <span class="mt-1 break-all">{{ item.title }}</span>
    </div>

    <FilePreview
      v-model="previewData.visible"
      :src="previewData.src"
      :type="previewData.type"
    />
  </div>
</template>

<script setup lang="ts">
import { FilePreview } from '@sp/shared/components'
import { getStaticFile, getFileIconAndType } from '@sp/shared/utils'
import type { FileListProps, FileListItem, FileItemType } from '#/materials'

interface ResolvedFileItem extends FileListItem {
  icon?: string
  type?: FileItemType
}

const props = withDefaults(defineProps<FileListProps>(), {
  columns: 4,
  gap: '8px',
  data: () => [],
})

const dataWithPreset = computed<ResolvedFileItem[]>(() => {
  return props.data.map(item => {
    const { icon, type } = getFileIconAndType(item.src || '') || {}
    return { ...item, icon, type }
  })
})

const previewData = reactive<{
  visible: boolean
  src: string
  type: FileItemType
}>({
  visible: false,
  src: '',
  type: 'image',
})

function onPreview(item: ResolvedFileItem) {
  if (!item.src) return
  if (!item.type) {
    window.open(item.src)
  } else {
    previewData.src = item.src
    previewData.type = item.type
    previewData.visible = true
  }
}
</script>

<style>
.text-gradient {
  background-image: linear-gradient(to top, #0783fa3d, #0783fa);
  background-clip: text;
  color: transparent;
}
</style>
