import { HtmlAdapter } from '../adapters/html'

/* -------------------- 类型定义 -------------------- */

/**
 * Dialog 动画类名配置项
 */
export interface DialogAnimationClass {
  enter?: string
  leave?: string
}
(globalThis as any).__DEV__ = true

/**
 * 适配器接口
 * - render: 渲染内容到 panel 上
 * - unmount: 卸载 panel 上的内容（可选）
 */
export interface Adapter {
  render: (content: any, options: { container: HTMLElement; panel: HTMLElement;[key: string]: any; onClose: (result: any) => void }) => void
  unmount?: (panel: HTMLElement) => void
}
/**
 * 适配器注册项
 */
export interface AdapterEntry {
  name?: string
  /**
   * 可选的检测函数，当返回 true 时 adapter 才会生效，默认总是匹配
   * @param content 传入的内容
   * @returns
   */
  detect?: (content: any) => boolean
  /**
   * 适配器实例
   */
  adapter: Adapter
}
/**
 * Dialog 配置项
 */
export interface DialogOptions {
  title?: string
  props?: Record<string, any>
  onClose?: (result: any) => void
  showMask?: boolean
  allowScroll?: boolean
  animation?: boolean
  animationClass?: DialogAnimationClass
  animationDuration?: number

  // 生命周期钩子
  onBeforeOpen?: () => void
  onOpened?: () => void
  onBeforeClose?: () => void
  onClosed?: (res: any) => void
  onMaskClick?: () => void
}

/**
 * Dialog 主类
 */
export class Dialog {
  private container: HTMLElement | null = null
  private maskEl: HTMLElement | null = null
  private panelEl: HTMLElement | null = null
  private isOpen = false
  private lastContent: any = null
  private currentOptions: DialogOptions = {}

  private static activeDialogs: Set<Dialog> = new Set()
  private static customAdapters: AdapterEntry[] = []

  /**
   * 注册自定义适配器
   */
  static registerAdapter(entry: AdapterEntry) {
    if (!entry || !entry.adapter || typeof entry.adapter.render !== 'function')
      throw new Error('[autodialog] Invalid adapter registration')
    Dialog.customAdapters.push(entry)
  }
  /**
   * 自动检测逻辑（detect 不强制
   */
  private async detectAdapter(content: any): Promise<Adapter> {
    // 1️⃣ 优先使用用户注册的自定义适配器
    for (const { detect, adapter } of Dialog.customAdapters) {
      try {
        // detect 可省略：省略则直接匹配
        if (!detect || detect(content)) return adapter
      } catch { }
    }

    // 2️⃣ 内置适配器兜底
    if (typeof content === 'string' || content instanceof HTMLElement || content instanceof DocumentFragment)
      return HtmlAdapter

    if (content && (typeof content === 'object' || typeof content === 'function')) {
      const proto = (content as any).prototype
      const hasSetup = !!(content as any).setup
      const hasRender = !!(content as any).render
      const isClass = proto && proto.isReactComponent
      const isFunctionComponent = typeof content === 'function' && /^[A-Z]/.test(content.name)
      if (hasSetup || hasRender) {
        return (await import('../../src/adapters/vue')).VueAdapter as unknown as Adapter
      }

      if (isClass || isFunctionComponent) {
        return (await import('../../src/adapters/react')).ReactAdapter as unknown as Adapter
      }
    }

    throw new Error('[autodialog] Unsupported component type.')
  }

  /**
   * 显示 Dialog
   */
  async show<TContent, TResult>(content: TContent, options: DialogOptions = {}): Promise<TResult> {
    if (this.isOpen) this.close()

    const adapter = await this.detectAdapter(content)
    const {
      onBeforeOpen,
      onOpened,
      showMask = true,
      allowScroll = false,
      animation = true,
      animationDuration = 200,
    } = options

    this.currentOptions = options
    this.lastContent = content
    this.isOpen = true
    Dialog.activeDialogs.add(this)

    onBeforeOpen?.()

    const container = document.createElement('div')
    container.className = 'autodialog-container'
    container.style.zIndex = String(9999 + Dialog.activeDialogs.size)

    const maskEl = document.createElement('div')
    maskEl.className = 'autodialog-mask'
    if (!showMask) maskEl.style.display = 'none'

    const panelEl = document.createElement('div')
    panelEl.className = 'autodialog-panel'

    container.appendChild(maskEl)
    container.appendChild(panelEl)
    document.body.appendChild(container)

    this.container = container
    this.maskEl = maskEl
    this.panelEl = panelEl

    if (allowScroll === false) document.body.style.overflow = 'hidden'

    // 遮罩点击
    return new Promise<TResult>(resolve => {
      const onClose = (result: TResult) => {
        this.close(result)
        resolve(result as TResult)
      }

      if (showMask) {
        maskEl.addEventListener('click', e => {
          if (e.target === maskEl) {
            options.onMaskClick?.()
            if (options.onMaskClick === undefined) onClose(undefined as any)
          }
        })
      }

      // 渲染内容
      adapter.render(content, {
        container,
        panel: panelEl,
        title: options.title,
        props: options.props,
        onClose: onClose
      })

      // 动画进入
      if (animation) {
        const enter = options.animationClass?.enter || 'autodialog-anim-enter'
        panelEl.classList.add(enter)
        requestAnimationFrame(() => {
          panelEl.classList.add('autodialog-visible')
          panelEl.classList.remove(enter)
          maskEl.classList.add('autodialog-mask-visible')
        })
        setTimeout(() => onOpened?.(), animationDuration)
      } else {
        panelEl.classList.add('autodialog-visible')
        maskEl.classList.add('autodialog-mask-visible')
        onOpened?.()
      }
    })
  }
  /**
   * 关闭 Dialog
   */
  async close(result?: any) {
    if (!this.isOpen || !this.container || !this.panelEl || !this.maskEl) return
    const adapter = await this.detectAdapter(this.lastContent)
    const {
      allowScroll = false,
      animation = true,
      animationClass,
      animationDuration = 200,
      onBeforeClose,
      onClosed,
    } = this.currentOptions

    onBeforeClose?.()
    this.isOpen = false
    Dialog.activeDialogs.delete(this)

    if (allowScroll === false && Dialog.activeDialogs.size === 0)
      document.body.style.overflow = ''

    if (animation) {
      const leave = animationClass?.leave || 'autodialog-anim-leave'
      this.panelEl.classList.add(leave)
      this.panelEl.classList.remove('autodialog-visible')
      this.maskEl.classList.add('autodialog-mask-leave')
      this.maskEl.classList.remove('autodialog-mask-visible')

      setTimeout(() => {
        adapter?.unmount?.(this.panelEl!)
        this.container?.remove()
        this.container = this.panelEl = this.maskEl = null
        onClosed?.(result)
      }, animationDuration)
    } else {
      adapter?.unmount?.(this.panelEl!)
      this.container.remove()
      this.container = this.panelEl = this.maskEl = null
      onClosed?.(result)
    }
  }
}

/**
 * autodialog 可直接使用的单例 dialog
 */
export const autodialog = new Dialog()
