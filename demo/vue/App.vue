<script setup lang="ts">
import autodialog from '../../src';
import MyDialog from './MyDialog.vue'

async function open() {
  const res = await autodialog.show(MyDialog)
  console.log('res::: ', res);
}
</script>

<template>
  <div style="padding:20px">
    <h2>Vue 测试页面</h2>
    <button @click="open">打开 Dialog</button>
  </div>
</template>
