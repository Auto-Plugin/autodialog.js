<script lang="ts">
  import { autodialog } from '../../src/core'
  import SvelteDialog from './SvelteDialog.svelte'

  function openDialog() {
    autodialog.show(SvelteDialog, {
      props: { message: '来自 Svelte 的对话框 ✨' },
      animationDuration: 250,
      allowScroll: true,
    })
  }
</script>

<main>
  <h1>Autodialog Svelte Demo</h1>
  <button on:click={openDialog}>打开弹窗</button>
</main>

<style>
main {
  font-family: system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
}
button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #007aff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}
</style>
