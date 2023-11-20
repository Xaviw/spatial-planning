<template>
  <p @click="num++">legend{{ num }}</p>
</template>

<script setup lang="ts">
const num = ref(0)
</script>
