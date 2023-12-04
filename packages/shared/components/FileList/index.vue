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
      <AImage
        v-if="item.img"
        :height="item.imgHeight"
        :width="item.imgWidth"
        :src="item.img"
      >
        <template #previewMask>
          <i class="i-ant-design:eye-outlined" />
        </template>
      </AImage>

      <i
        v-else
        :class="[item.icon, 'text-64px', 'cursor-pointer', 'text-gradient']"
        @click="onPreview(item)"
      />

      <span class="mt-1 break-all">{{ item.title }}</span>
    </div>

    <FilePreview
      v-model="previewData.visible"
      :src="previewData.src"
      :type="previewData.type"
      :extName="previewData.extName"
    />
  </div>
</template>

<script setup lang="ts">
import { MediaEnum } from '@sp/shared/utils'
import { computed, reactive } from 'vue'
import FilePreview from './FilePreview.vue'
import type { FileListProps, FileListItem } from '#/components'

interface ResolvedFileItem extends FileListItem {
  icon?: string
  type?: MediaEnum
  extName: string
}

const props = withDefaults(defineProps<FileListProps>(), {
  columns: 4,
  gap: '8px',
  data: () => [],
})

const dataWithPreset = computed<ResolvedFileItem[]>(() => {
  return props.data.map(item => {
    let icon = 'i-mdi:file'
    let type
    const extName =
      /^.*\.(\w+)(\?.*)?$/.exec(item.src || '')?.[1]?.toLocaleLowerCase() ?? ''
    if (extName === 'pdf') {
      icon = 'i-mdi:file-pdf'
      type = MediaEnum.PDF
    } else if (extName === 'docx' || extName === 'doc') {
      icon = 'i-mdi:file-word'
      type = MediaEnum.OFFICE
    } else if (extName === 'xlsx' || extName === 'xls') {
      icon = 'i-mdi:file-excel'
      type = MediaEnum.OFFICE
    } else if (extName === 'pptx' || extName === 'ppt') {
      icon = 'i-mdi:file-powerpoint'
      type = MediaEnum.OFFICE
    } else if (['mp4', 'webm', 'ogv', 'mov', 'avi', 'mkv'].includes(extName)) {
      icon = 'i-material-symbols:video-file'
      type = MediaEnum.VIDEO
    } else if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extName)) {
      icon = 'i-material-symbols:audio-file'
      type = MediaEnum.AUDIO
    }
    return { ...item, icon, type, extName }
  })
})

const previewData = reactive({
  visible: false,
  src: '',
  type: MediaEnum.AUDIO,
  extName: '',
})

function onPreview(item: ResolvedFileItem) {
  if (!item.src) return
  if (!item.type) {
    window.open(item.src)
  } else {
    previewData.src = item.src
    previewData.type = item.type
    previewData.extName = item.extName
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
