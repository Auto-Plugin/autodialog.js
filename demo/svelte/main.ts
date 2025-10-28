import { Dialog } from '../../src'
import { mount } from 'svelte'
import App from './App.svelte'
import { SvelteAdapter } from './svelte-adapter'

// 注册适配器
Dialog.registerAdapter({
  name: 'svelte',
  adapter: SvelteAdapter,
})

// ✅ 使用 mount 而不是 new
mount(App, { target: document.getElementById('app')! })
