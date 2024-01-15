<template>
  <AUpload
    v-bind="$attrs"
    v-model:fileList="fileList"
    listType="picture-card"
    :customRequest="customRequest"
  >
    <div
      class="flex flex-col items-center justify-center text-gray-500"
      v-if="!$attrs.maxCount || fileList.length < ($attrs.maxCount as number)"
    >
      <span class="mb-1 text-4xl">+</span>
      <span>上传</span>
    </div>
  </AUpload>
</template>

<script setup lang="ts">
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'

const fileList = ref([])

function customRequest(e: UploadRequestOption) {
  console.log(e)
}
</script>
