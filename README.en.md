English | [简体中文](./README.md)

<div align="center">
 <img src="./public/autodialog.svg" alt="Autodialog Logo" width="256" />
 <h1>Autodialog</h1>
</div>

> **A lightweight, framework-agnostic dialog system.**
> Works with **Vue**, **React**, **HTML**, and any framework via custom adapters.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![GitHub Repo stars](https://img.shields.io/github/stars/Auto-Plugin/autodialog.js)
[![npm version](https://img.shields.io/npm/v/autodialog.js.svg?color=3c78d8)](https://www.npmjs.com/package/autodialog.js)
[![typescript](https://img.shields.io/badge/用TypeScript编写-3178c6)](https://www.typescriptlang.org/)

***

## ✨ Features

* ⚙️ **Framework-agnostic core** — works in any JS environment.
* 🧩 **Built-in adapters** for **Vue**, **React**, and **HTML**.
* 🪶 **Custom adapters** — integrate Svelte, Solid, or any UI framework.
* 🎞️ **Basic animation** support (enter/leave transitions).
* 🎨 **User-controlled styling** — only minimal CSS included.
* 🧠 **Lifecycle hooks**: `onBeforeOpen`, `onOpened`, `onBeforeClose`, `onClosed`, `onMaskClick`.

***

## 🚀 Installation

```Shell
npm install autodialog
# or
pnpm add autodialog
# or
yarn add autodialog
```

### Optional peer dependencies

If you use built-in Vue or React adapters, make sure your project already has:

```JSON
"peerDependencies": {
  "vue": ">=3.0.0",
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

Otherwise, they will not be installed automatically.

***

## 🧱 Usage

### 1️⃣ Basic HTML usage

```TypeScript
import autodialog from 'autodialog.js'

autodialog.show('<div>Hello World!</div>')
```

***

### 2️⃣ Vue 3 example

```TypeScript
import autodialog from 'autodialog.js'
import MyDialog from './MyDialog.vue'

autodialog.show(MyDialog, {
  props: { title: 'Hello Vue' },
  animationDuration: 250,
})
```

***

### 3️⃣ React example

```TSX
import autodialog from 'autodialog.js'
import MyDialog from './MyDialog.tsx'

autodialog.show(MyDialog, {
  props: { message: 'Hello React' },
})
```

***

### 4️⃣ Registering a custom adapter (e.g. Svelte)

```TypeScript
import { Dialog } from 'autodialog.js'
import { mount } from 'svelte'

export const SvelteAdapter = {
  render(Component: any, { panel, props = {}, onClose }: any) {
    const instance = mount(Component, {
      target: panel,
      props: { ...props, onClose },
    })
    ;(panel as any).__svelte__ = instance
  },
  unmount(panel: HTMLElement) {
    const inst = (panel as any).__svelte__
    if (inst?.destroy) inst.destroy()
    delete (panel as any).__svelte__
  },
}


Dialog.registerAdapter({
  name: 'svelte',
  // detect is optional — if omitted, matches all content
  adapter: SvelteAdapter,
})
```

Now you can call:

```TypeScript
import MyDialog from './MyDialog.svelte'
autodialog.show(MyDialog, { props: { text: 'Hello Svelte' } })
```

***

## 🎨 Default Styles (minimal)

Autodialog injects only a few minimal styles for layout and transitions:

```CSS
.ad-container { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; }
.ad-mask { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.35); opacity: 0; transition: opacity 0.25s ease; }
.ad-mask-visible { opacity: 1; }
.ad-panel { position: relative; z-index: 1; background: white; border-radius: 8px; padding: 1.5rem 2rem; box-shadow: 0 8px 30px rgba(0,0,0,.2); opacity: 0; transform: translateY(20px); transition: opacity .25s, transform .25s; }
.ad-visible { opacity: 1; transform: translateY(0); }
.ad-anim-leave { opacity: 0; transform: translateY(10px); }
```

You can override them freely in your own CSS — they are low-specificity global rules.

***

## ⚙️ API

### `autodialog.show(content, options?)`

| Option                                                                 | Type                                 | Default     | Description                         |
| ---------------------------------------------------------------------- | ------------------------------------ | ----------- | ----------------------------------- |
| `title`                                                                | `string`                             | `undefined` | Optional title                      |
| `props`                                                                | `object`                             | `{}`        | Props passed to framework component |
| `showMask`                                                             | `boolean`                            | `true`      | Show mask background                |
| `allowScroll`                                                          | `boolean`                            | `false`     | Disable body scroll                 |
| `animation`                                                            | `boolean`                            | `true`      | Enable animation                    |
| `animationDuration`                                                    | `number`                             | `200`       | Duration in ms                      |
| `animationClass`                                                       | `{ enter?: string; leave?: string }` | -           | Custom transition classes           |
| `onBeforeOpen`, `onOpened`, `onBeforeClose`, `onClosed`, `onMaskClick` | `() => void`                         | -           | Lifecycle callbacks                 |

***

## 🧩 Extensibility

You can create adapters for any rendering system — Solid, Qwik, Lit, Vanilla DOM, etc.

```TypeScript
Dialog.registerAdapter({
  name: 'solid',
  detect: content => content?.$$typeof === Symbol.for('solid.component'),
  adapter: SolidAdapter,
})
```

Adapters are simple objects implementing:

```TypeScript
interface Adapter {
  render(content: any, options: { container: HTMLElement; panel: HTMLElement; [key: string]: any }): void
  unmount?(panel: HTMLElement): void
}
```

***

## 🧠 Philosophy

Autodialog’s design follows three key principles:

1. **Framework independence** — Core logic never imports Vue, React, or Svelte.
2. **Extensibility** — Any rendering framework can integrate via adapters.
3. **User control** — Styling, transitions, and lifecycle hooks remain open.

> 💬 In other words: Autodialog handles the “where and when” — you control the “what and how.”

***

## 💾 License

[MIT](./LICENSE) © 2025 [Larry Zhu](https://github.com/yourname)

***

***

## 🤝 Contributing

Contributions are welcome!
If you find bugs or want to add new adapters (e.g., Solid, Qwik, Alpine.js),
please open an issue or pull request on [GitHub](https://github.com/yourname/autodialog).

***

## ⭐ Support

If you like Autodialog, consider giving it a **⭐ star** on [GitHub](https://github.com/yourname/autodialog)
to help others discover it!

***

### ✅ TL;DR

> 🪶 **Autodialog = One dialog system, any framework.**

***

