<template>
  <p @click="num++">map{{ num }}</p>
</template>

<script setup lang="ts">
const num = ref(0)
</script>
