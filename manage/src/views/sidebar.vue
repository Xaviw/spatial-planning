<template>
  <p @click="num++">sidebar{{ num }}</p>
</template>

<script setup lang="ts">
const num = ref(0)
</script>
