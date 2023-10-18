<script setup lang="ts">
import type { Test } from '@sp/types'

const a = ref<Test>({ a: 1 })
</script>

<template>
  <SFCButton />
  <JSXButton />
  <button class="rounded border-none bg-green-500 px-4 py-2 text-white shadow">
    {{ a.a }}
  </button>
</template>
