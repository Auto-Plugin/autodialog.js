import ReactDOM from 'react-dom/client'

interface ReactRenderOptions {
  panel: HTMLElement
  title?: string
  props?: Record<string, any>
  onClose?: () => void
}

export const ReactAdapter = {
  render(Component: any, { panel, title, props = {}, onClose }: ReactRenderOptions) {
    // 创建 React root（React 18）
    const root = ReactDOM.createRoot(panel)
    // 把 root 挂在 panel 上，用于卸载
    ;(panel as any)._reactRoot = root

    // 统一封装层
    root.render(
      <div className="autodialog-react-wrapper">
        {title && <div className="autodialog-header">{title}</div>}
        <Component {...props} onClose={onClose} />
      </div>
    )
  },

  unmount(panel: HTMLElement) {
    const root = (panel as any)._reactRoot as ReactDOM.Root
    if (root) {
      root.unmount()
      delete (panel as any)._reactRoot
    }
  },
}
