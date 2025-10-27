<script setup lang="ts">
import autoDialog from '../../src';
import MyDialog from './MyDialog.vue'

function open() {
  autoDialog.show(MyDialog, { title: 'Vue 开发测试' })
}
</script>

<template>
  <div style="padding:20px">
    <h2>Vue 测试页面</h2>
    <button @click="open">打开 Dialog</button>
  </div>
</template>
