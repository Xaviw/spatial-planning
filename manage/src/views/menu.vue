<template>
  <p @click="num++">menu{{ num }}</p>
</template>

<script setup lang="ts">
const num = ref(0)
</script>
