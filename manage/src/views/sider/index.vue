<template>
  <div class="relative h-full min-w-400 flex">
    <Loading absolute :loading="loading" />

    <Sidebar position="left" />

    <Sidebar position="right" />

    <MaterialBar :disabled="!selectedMenu" />

    <div class="flex flex-1 flex-col">
      <Header class="mb-2 bg-white p-4" />

      <FormBar class="mb-2 flex-1 overflow-hidden bg-white p-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@sp/shared/components'
import { useSiderStore } from '@sp/shared/helpers/sider'
import FormBar from './formBar.vue'
import Header from './header.vue'
import MaterialBar from './materialBar.vue'
import Sidebar from './sidebar.vue'

const siderStore = useSiderStore()
const { loading, selectedMenu } = storeToRefs(siderStore)
</script>
