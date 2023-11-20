<template>
  <AConfigProvider :locale="zhCN">
    <RouterView #default="{ Component, route }">
      <component
        :is="Component"
        :key="route.name"
        v-if="route.meta?.layout === 'custom'"
      />

      <BasicLayout v-else>
        <KeepAlive>
          <component
            :is="Component"
            :key="route.name"
            v-if="route.meta?.keepAlive"
          />
          <div v-else></div>
        </KeepAlive>

        <component
          :is="Component"
          :key="route.name"
          v-if="!route.meta?.keepAlive"
        />
      </BasicLayout>
    </RouterView>
  </AConfigProvider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import BasicLayout from './layouts/basic.vue'

dayjs.locale('zh-cn')
</script>

<style>
@import url('@sp/shared/styles/common.css');
</style>
