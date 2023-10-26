<template>
  <div>
    <ARow :wrap="true">
      <ACol
        v-for="(item, index) of dataWithPreset"
        :key="index"
        :span="span"
        v-bind="item"
        class="flex flex-col items-center"
        :style="{ padding: gutter + 'px' }"
      >
        <AImage
          v-if="item.img"
          :height="item.imgHeight ?? 64"
          :width="item.imgWidth ?? 64"
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
      </ACol>
    </ARow>

    <FilePreview
      v-model="previewData.visible"
      :src="previewData.src"
      :type="previewData.type"
      :extName="previewData.extName"
    />
  </div>
</template>

<script setup lang="ts">
import { MediaEnum } from '@sp/shared'
import { computed, reactive } from 'vue'
import FilePreview from './FilePreview.vue'
import type { ColProps } from 'ant-design-vue/es/col/index'

interface FileItem extends ColProps {
  /** 文件标题 */
  title: string
  /** 图片链接 */
  img?: string
  /**
   * 图片宽度
   * @default 64
   */
  imgWidth?: number
  /**
   * 图片高度
   * @default 64
   */
  imgHeight?: number
  /** 文件预览链接，支持PDF、WORD、EXCEL、PPT */
  src?: string
}

interface ResolvedFileItem extends FileItem {
  icon?: string
  type?: MediaEnum
  extName: string
}

const props = withDefaults(
  defineProps<{
    /**
     * 默认栅格占格数，24栅格
     * @default 8
     */
    span?: number
    /**
     * 栅格间隔，单位像素
     * @default 6
     */
    gutter?: number
    data: FileItem[]
  }>(),
  {
    span: 8,
    gutter: 6,
    data: () => [],
  },
)

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
