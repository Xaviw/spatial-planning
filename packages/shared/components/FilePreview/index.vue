<template>
  <Modal v-model="model">
    <i
      class="i-svg-spinners:12-dots-scale-rotate absolute left-50% top-50% translate--50% text-4xl text-white"
    />

    <ATooltip title="下载源文件">
      <div
        class="fixed right-4 top-4 cursor-pointer border border-white rounded-50% border-solid bg-white bg-opacity-30 p-2 text-white"
        @click="download"
      >
        <i class="i-material-symbols:download text-3xl" />
      </div>
    </ATooltip>

    <!-- 图片 -->
    <img v-if="type === 'image'" :src="src" class="relative" />

    <!-- 视频 -->
    <video
      ref="videoRef"
      v-else-if="type === 'video'"
      controls
      :src="src"
      class="relative"
    />

    <!-- 音频 -->
    <audio ref="audioRef" v-else-if="type === 'audio'" controls :src="src" />

    <!-- OFFICE -->
    <iframe
      ref="iframeRef"
      v-else-if="type === 'office'"
      v-show="!loading"
      :src="`https://view.officeapps.live.com/op/embed.aspx?src=${src}`"
      class="relative h-80vh w-80vw"
      frameborder="0"
    />

    <!-- 其他 -->
    <div v-else class="relative rounded bg-white px-16 py-8 text-xl text-black">
      该文件不支持预览，
      <ATypographyLink :href="src" target="_black" class="text-xl">
        点击下载
      </ATypographyLink>
      ！
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Modal } from '@sp/shared/components'
import type { FileItemType } from '#/materials'

const props = defineProps<{
  type: FileItemType
  src: string
}>()

const model = defineModel<boolean>({ default: false })

const videoRef = ref<HTMLVideoElement | null>(null)
const audioRef = ref<HTMLAudioElement | null>(null)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const loading = ref(true)

// 当前打开的文档链接
const currentOfficeSrc = ref<string>()

watch(
  () => model,
  (val, oldVal) => {
    if (!val && oldVal) {
      // 关闭时暂停播放
      videoRef.value?.pause()
      audioRef.value?.pause()
    } else if (val && props.type === 'office' && props.src) {
      // 打开文档时，如果文档链接变化显示loading效果
      // 不处理的话会显示之前打开的文档
      loading.value = props.src !== currentOfficeSrc.value
    } else if (val && props.type !== 'office') {
      currentOfficeSrc.value = undefined
    }
  },
)

watch(iframeRef, () => {
  if (iframeRef.value) {
    iframeRef.value.onload = () => {
      currentOfficeSrc.value = props.src
      loading.value = false
    }
    iframeRef.value.onerror = () => {
      loading.value = false
    }
  }
})

function download() {
  window.open(props.src)
}
</script>
