<template>
  <AUpload
    v-bind="$attrs"
    :fileList="fileList"
    :listType="listType"
    :disabled="disabled"
    :maxCount="maxCount"
    :customRequest="customRequest"
    :beforeUpload="beforeUpload"
    :showUploadList="{
      showPreviewIcon: true,
      showRemoveIcon: !disabled,
    }"
    @preview="onPreview"
    @remove="onRemove"
    :class="maxCount === 1 && 'single-upload'"
  >
    <slot>
      <div
        v-if="
          listType === 'picture-card' &&
          !disabled &&
          (!maxCount || fileList.length < maxCount)
        "
        class="flex flex-col items-center justify-center text-gray-500"
      >
        <span class="mb-1 text-4xl">+</span>
        <div
          class="max-h-13 overflow-hidden break-all p-1 text-xs"
          v-show="showHelp"
        >
          {{ help || '上传' }}
        </div>
      </div>

      <AButton
        v-else-if="listType !== 'picture-card'"
        :disabled="disabled || (!!maxCount && fileList.length >= maxCount)"
      >
        <i class="i-ant-design:upload-outlined" />
        上传
      </AButton>
    </slot>
  </AUpload>

  <slot name="empty">
    <AEmpty
      class="w-full"
      :image="Empty.PRESENTED_IMAGE_SIMPLE"
      v-if="disabled && !fileList.length && listType === 'picture-card'"
    />
  </slot>

  <FilePreview
    v-model="previewData.visible"
    :src="previewData.src"
    :type="previewData.type"
  />
</template>

<script setup lang="ts">
import { upload, mergeUpload, checkHash } from '@sp/shared/apis'
import { FilePreview } from '@sp/shared/components'
import { calcFileHash, getFileIconAndType } from '@sp/shared/utils'
import { Empty, message } from 'ant-design-vue'
import { isString, uniqueId } from 'lodash-es'
import type { FileItemType } from '#/materials'
import type { FileType, UploadFile } from 'ant-design-vue/es/upload/interface'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'

const props = withDefaults(
  defineProps<{
    /**
     * 单文件最大体积，数字+单位(不区分大小写)：
     * b | k | m | g
     */
    maxSize?: string
    maxCount?: number
    disabled?: boolean
    /** @default 'picture-card' */
    listType?: 'text' | 'picture' | 'picture-card'
    height?: string
    width?: string
    showHelp?: boolean
    padding?: string
  }>(),
  {
    listType: 'picture-card',
    showHelp: true,
    padding: '6px',
    width: '100px',
    height: '100px',
  },
)

const attrs = useAttrs()

const model = defineModel<undefined | string | string[]>({ required: true })

const fileList = ref<UploadFile[]>([])

watchEffect(() => {
  if (!model.value) {
    fileList.value = []
    return
  }
  const list = Array.isArray(model.value) ? model.value : [model.value]
  fileList.value = list.map(url => ({
    uid: uniqueId(),
    name: url.split('/')?.pop() ?? url,
    status: 'done',
    url,
  }))
})

function updateModel(url: string) {
  if (props.maxCount === 1) {
    model.value = url
  } else {
    if (!Array.isArray(model.value)) {
      model.value = [url]
    } else {
      model.value.push(url)
    }
  }
}

const previewData = reactive<{
  visible: boolean
  src: string
  type: FileItemType
}>({
  visible: false,
  src: '',
  type: 'image',
})

async function customRequest(e: UploadRequestOption) {
  if (isString(e.file)) return

  // 校验文件是否已上传过
  const hash = await calcFileHash(e.file)
  const checkResult = await checkHash(hash).send()
  if (checkResult) {
    e.onSuccess?.(checkResult)
    updateModel(checkResult)
    return
  }

  // 5MB分片
  const chunkSize = 1024 * 1024 * 5

  // 小尺寸直接上传
  if (e.file.size < chunkSize) {
    const formData = new FormData()
    formData.set('file', e.file)
    formData.set('hash', hash)
    upload(formData)
      .send()
      .then(res => {
        e.onSuccess?.(res)
        updateModel(res)
      })
      .catch(err => {
        e.onError?.(err)
      })
    return
  }

  // 大文件分片上传
  const chunks: Blob[] = []
  const events: Promise<any>[] = []
  let pos = 0
  while (pos < e.file.size) {
    chunks.push(e.file.slice(pos, pos + chunkSize))
    pos += chunkSize
  }
  let [_, name, extName] = /^(.+)\.(.+)$/.exec(e.file.name) || []
  name = name.replace(/\s/g, '').replace(/\./g, '_')
  extName = extName.replace(/\s/g, '')
  const key = name + '_' + Date.now()
  chunks.map((chunk, index) => {
    const formData = new FormData()
    formData.set('name', key)
    formData.set('index', index + '')
    formData.set('file', chunk)
    events.push(upload(formData).send())
  })
  Promise.all(events)
    .then(() => {
      mergeUpload(key, name, extName, hash)
        .send()
        .then(res => {
          e.onSuccess?.(res)
          updateModel(res)
        })
        .catch(err => {
          e.onError?.(err)
        })
    })
    .catch(err => {
      e.onError?.(err)
    })
}

const help = computed(() => {
  const acceptStr = attrs.accept ? `支持${attrs.accept}格式；` : ''
  const sizeStr = props.maxSize ? `最大${props.maxSize}；` : ''
  const countStr = props.maxCount ? `最多上传${props.maxCount}个；` : ''
  return acceptStr + sizeStr + countStr
})

function beforeUpload(file: FileType) {
  if (!props.maxSize) return
  const proportionMap = { b: 1, k: 1024, m: 1024 ** 2, g: 1024 ** 3 }
  const [_, sizeStr, unit] =
    new RegExp('^(\\d+)(\\w).*$', 'i').exec(props.maxSize) || []
  const proportion = proportionMap[unit.toLowerCase()]
  const size = proportion ? proportion * +sizeStr : +sizeStr
  if (size > file.size) {
    message.error('')
    return false
  }
}

function onPreview(file: UploadFile) {
  if (!file.url) return
  const { type } = getFileIconAndType(file.url) || {}
  if (!type) {
    window.open(file.url)
  } else {
    previewData.src = file.url
    previewData.type = type
    previewData.visible = true
  }
}

function onRemove(file: UploadFile) {
  if (isString(model.value)) {
    model.value = undefined
    return
  }
  const index = fileList.value.findIndex(item => item.uid === file.uid)
  if (index > -1) {
    model.value!.splice(index, 1)
  }
}
</script>

<style scoped>
:deep(.ant-upload-list-item-container),
:deep(.ant-upload-select) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
}

.single-upload :deep(.ant-upload-list-item-container),
.single-upload :deep(.ant-upload-select) {
  margin: 0 !important;
}

:deep(.ant-upload-list-item) {
  padding: v-bind(padding) !important;
}

:deep(.ant-upload-list-item::before) {
  width: calc(100% - v-bind(padding) - v-bind(padding)) !important;
  height: calc(100% - v-bind(padding) - v-bind(padding)) !important;
}
</style>
