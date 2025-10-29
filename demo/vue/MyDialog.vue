<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  onClose: (res: any) => void
}>()
const count = ref(0)
</script>

<template>
  <div>
    <p>计数：{{ count }}</p>
    <button @click="count++">+1</button>
    <button @click="onClose('ok')">ok</button>
  </div>
</template>
<style scoped>
div {
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  button {
    margin-right: 10px;
  }
}
</style>