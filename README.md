简体中文 | [English](./README.en.md)

<div align="center">
 <img src="./public/autodialog.svg" alt="Autodialog Logo" width="256" />
 <h1>Autodialog</h1>
</div>

> **一个轻量、框架无关（framework-agnostic）的弹窗系统。**
> 支持 **Vue**、**React**、**原生 HTML**，并可通过自定义适配器扩展到任意框架。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![GitHub Repo stars](https://img.shields.io/github/stars/Auto-Plugin/autodialog.js)
[![npm version](https://img.shields.io/npm/v/autodialog.js.svg?color=3c78d8)](https://www.npmjs.com/package/autodialog.js)
[![typescript](https://img.shields.io/badge/用TypeScript编写-3178c6)](https://www.typescriptlang.org/)

---

## ✨ 特性

- ⚙️ **框架无关**：核心完全基于原生 DOM，无需依赖任何框架。

- 🧩 **内置适配器**：支持 Vue、React、HTML。

- 🪶 **可扩展适配器**：可轻松集成 Svelte、Solid、Lit、Qwik 等框架。

- 🎞️ **内置基础动画**：支持进入 / 离开过渡。

- 🎨 **最小化样式**：只包含布局和基础动画，用户可完全自定义样式。

- 🧠 **完整生命周期钩子**：支持 `onBeforeOpen`、`onOpened`、`onBeforeClose`、`onClosed`、`onMaskClick`。

---

## 🚀 安装

```bash
npm install autodialog
# 或者
pnpm add autodialog
# 或者
yarn add autodialog
```

### 可选的 peer 依赖

如果你需要使用内置的 Vue 或 React 适配器，请确保你的项目已经安装：

```json
"peerDependencies": {
  "vue": ">=3.0.0",
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

> Autodialog 不会自动安装这些框架，它只会与宿主项目中的版本共享使用。

---

## 🧱 使用示例

### 1️⃣ 原生 HTML

```ts
import autodialog from 'autodialog.js'

autodialog.show('<div>Hello World!</div>')
```

---

### 2️⃣ Vue 3

```ts
import autodialog from 'autodialog.js'
import MyDialog from './MyDialog.vue'

autodialog.show(MyDialog, {
  props: { title: '你好 Vue' },
  animationDuration: 250
})
```

---

### 3️⃣ React 18+

```tsx
import autodialog from 'autodialog.js'
import MyDialog from './MyDialog.tsx'

autodialog.show(MyDialog, {
  props: { message: '你好 React' }
})
```

---

### 4️⃣ 自定义适配器（例如 Svelte）

```ts
import { Dialog } from 'autodialog.js'
import { mount } from 'svelte'

export const SvelteAdapter = {
  render(Component: any, { panel, props = {}, onClose }: any) {
    const instance = mount(Component, {
      target: panel,
      props: { ...props, onClose }
    })
    ;(panel as any).__svelte__ = instance
  },
  unmount(panel: HTMLElement) {
    const inst = (panel as any).__svelte__
    inst?.destroy?.()
    delete (panel as any).__svelte__
  }
}

// ✅ 注册自定义适配器（detect 可省略）
Dialog.registerAdapter({
  name: 'svelte',
  adapter: SvelteAdapter
})
```

现在可以直接这样调用：

```ts
import MyDialog from './MyDialog.svelte'
autodialog.show(MyDialog, { props: { text: '来自 Svelte 的弹窗 ✨' } })
```

---

## 🎨 默认样式（极简）

Autodialog 仅注入极少量样式，用于布局与动画：

```css
.autodialog-container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.autodialog-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.25s ease;
}
.autodialog-mask-visible {
  opacity: 1;
}
.autodialog-panel {
  position: relative;
  z-index: 1;
  background: white;
  border-radius: 8px;
  padding: 1.5rem 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.25s, transform 0.25s;
}
.autodialog-visible {
  opacity: 1;
  transform: translateY(0);
}
.autodialog-anim-leave {
  opacity: 0;
  transform: translateY(10px);
}
```

这些样式优先级极低，用户可自由覆盖或替换。

---

## ⚙️ API

### `autodialog.show(content, options?)`

| 选项                | 类型                                 | 默认值      | 说明                 |
| ------------------- | ------------------------------------ | ----------- | -------------------- |
| `title`             | `string`                             | `undefined` | 可选标题             |
| `props`             | `object`                             | `{}`        | 传递给组件的参数     |
| `showMask`          | `boolean`                            | `true`      | 是否显示遮罩层       |
| `allowScroll`       | `boolean`                            | `false`     | 是否允许滚动页面     |
| `animation`         | `boolean`                            | `true`      | 是否启用动画         |
| `animationDuration` | `number`                             | `200`       | 动画持续时间（毫秒） |
| `animationClass`    | `{ enter?: string; leave?: string }` | -           | 自定义动画类名       |
| `onBeforeOpen`      | `() => void`                         | -           | 打开前               |
| `onOpened`          | `() => void`                         | -           | 打开后               |
| `onBeforeClose`     | `() => void`                         | -           | 关闭前               |
| `onClosed`          | `() => void`                         | -           | 关闭后               |
| `onMaskClick`       | `() => void`                         | -           | 点击遮罩层时触发     |

---

## 🧩 扩展机制

任何框架都可以通过注册适配器与 Autodialog 兼容。

```ts
Dialog.registerAdapter({
  name: 'solid',
  detect: (content) => content?.$$typeof === Symbol.for('solid.component'),
  adapter: SolidAdapter
})
```

适配器结构如下：

```ts
interface Adapter {
  render(content: any, options: { container: HTMLElement; panel: HTMLElement; [key: string]: any }): void
  unmount?(panel: HTMLElement): void
}
```

> detect 是可选的。如果未定义，则该适配器默认匹配所有内容。

---

## 🧠 设计理念

Autodialog 的设计遵循三个核心原则：

1. **框架独立**：核心逻辑不依赖 Vue、React 或其他框架。
2. **可扩展性**：任何渲染系统都可以通过 Adapter 接入。
3. **用户主导**：样式、动画与生命周期完全开放给用户控制。

> 💬 换句话说：
> Autodialog 负责 “何时显示、显示在哪”，而你负责 “显示什么、如何显示”。

---

## 💾 开源协议

[MIT](./LICENSE) © 2025 [Larry Zhu](https://github.com/Larryzhu-Dev)

---

## 🤝 贡献指南

欢迎提交 Issue 或 Pull Request！
如果你想添加新的框架适配器（如 Solid、Qwik、Alpine.js 等），
或改进动画与样式系统，请在 [GitHub](https://github.com/auto-plugin/autodialog.js) 上参与讨论。

---

## ⭐ 支持项目

如果你喜欢 Autodialog，请在 [GitHub](https://github.com/auto-plugin/autodialog.js) 上为它点亮一颗 ⭐️
这将帮助更多开发者发现它！

---

### ✅ TL;DR

> 🪶 **Autodialog = 一个对话框系统，支持任意框架。**

---
