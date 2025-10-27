import { createApp, h, type Component } from 'vue'

interface VueRenderOptions {
  panel: HTMLElement
  title?: string
  props?: Record<string, any>
  onClose?: () => void
}

export const VueAdapter = {
  render(Component: Component, { panel, title, props = {}, onClose }: VueRenderOptions) {
    // 创建一个 Vue 应用实例
    const app = createApp({
      render() {
        return h('div', { class: 'autodialog-vue-wrapper' }, [
          title ? h('div', { class: 'autodialog-header' }, title) : null,
          h(Component, { ...props, onClose }),
        ])
      },
    })

    // 挂载到 panel
    app.mount(panel)
    ;(panel as any)._vueApp = app
  },

  unmount(panel: HTMLElement) {
    const app = (panel as any)._vueApp
    if (app) {
      app.unmount()
      delete (panel as any)._vueApp
    }
  },
}
