<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <NotFound class="h-60vh" />
    <AButton type="primary" ghost size="large" @click="goHome">
      返回首页
    </AButton>
  </div>
</template>

<script setup lang="ts">
import { NotFound } from '@sp/shared/svgs'

const router = useRouter()

function goHome() {
  router.replace({ name: 'home' })
}
</script>
