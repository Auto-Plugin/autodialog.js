<script lang="ts">
  export let message: string
  export let onClose: () => void
</script>

<div class="dialog">
  <h2>{message}</h2>
  <button on:click={onClose}>关闭</button>
</div>

<style>
.dialog {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
}
button {
  margin-top: 1rem;
  background: #333;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
