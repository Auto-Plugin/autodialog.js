<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <div>
    <p>计数：{{ count }}</p>
    <button @click="count++">+1</button>
  </div>
</template>
