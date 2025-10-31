interface ReactRenderOptions {
  panel: HTMLElement
  title?: string
  props?: Record<string, any>
  onClose?: () => void
}

export const ReactAdapter = {
  async render(Component: any, { panel, title, props = {}, onClose }: ReactRenderOptions) {
    try {
      // 动态导入 React 和 ReactDOM
      const [{ default: React }, { default: ReactDOM }] = await Promise.all([
        import('react'),
        import('react-dom/client')
      ])

      // 创建 React root（React 18）
      const root = ReactDOM.createRoot(panel)
      // 把 root 挂在 panel 上，用于卸载
      ;(panel as any)._reactRoot = root

      // 统一封装层
      root.render(
        React.createElement('div', { className: 'autodialog-react-wrapper' },
          title && React.createElement('div', { className: 'autodialog-header' }, title),
          React.createElement(Component, { ...props, onClose })
        )
      )
    } catch (error) {
      throw new Error('[autodialog] Failed to load React. Please ensure react and react-dom are installed.')
    }
  },

  async unmount(panel: HTMLElement) {
    const root = (panel as any)._reactRoot
    if (root) {
      root.unmount()
      delete (panel as any)._reactRoot
    }
  },
}