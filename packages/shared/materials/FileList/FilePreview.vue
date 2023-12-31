<template>
  <Modal :modelValue="model" @update:modelValue="e => (model = e)">
    <i
      class="i-svg-spinners:12-dots-scale-rotate absolute left-50% top-50% translate--50% text-4xl"
    />

    <!-- 视频 -->
    <video
      ref="videoRef"
      v-if="type === MediaEnum.VIDEO"
      controls
      :src="src"
      class="relative"
    />
    <!-- 音频 -->
    <audio ref="audioRef" v-if="type === MediaEnum.AUDIO" controls :src="src" />
    <!-- OFFICE -->
    <iframe
      ref="iframeRef"
      v-if="type === MediaEnum.OFFICE"
      v-show="!loading"
      :src="`https://view.officeapps.live.com/op/embed.aspx?src=${src}`"
      class="relative h-80vh w-80vw"
      frameborder="0"
    />
    <!-- TODO: PDF -->
  </Modal>
</template>

<script setup lang="ts">
import { Modal } from '@sp/shared/components'
import { MediaEnum } from '@sp/shared/utils'

const props = defineProps<{
  type: MediaEnum
  src: string
  extName: string
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
    } else if (val && props.type === MediaEnum.OFFICE && props.src) {
      // 打开文档时，如果文档链接变化显示loading效果
      // 不处理的话会显示之前打开的文档
      loading.value = props.src !== currentOfficeSrc.value
    } else if (val && props.type !== MediaEnum.OFFICE) {
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
</script>
