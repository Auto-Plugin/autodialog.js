import { VueAdapter } from '../adapters/vue'
import { ReactAdapter } from '../adapters/react'
import { HtmlAdapter } from '../adapters/html'

export interface DialogAnimationClass {
  enter?: string
  leave?: string
}

export interface Adapter {
  render: (content: any, options: { container: HTMLElement; panel: HTMLElement; [key: string]: any }) => void
  unmount?: (panel: HTMLElement) => void
}

export interface DialogDomMoveConfig {
  /** 弹窗容器的ID */
  containerId: string
  /** 需要移动的DOM元素ID */
  sourceElementId: string
}

export interface DialogOptions {
  /** DOM移动配置，如果提供此参数则跳过适配器，直接使用DOM移动 */
  domMove?: DialogDomMoveConfig
  title?: string
  props?: Record<string, any>
  onClose?: () => void
  showMask?: boolean
  allowScroll?: boolean
  animation?: boolean
  animationClass?: DialogAnimationClass
  animationDuration?: number

  onBeforeOpen?: () => void
  onOpened?: () => void
  onBeforeClose?: () => void
  onClosed?: () => void
  onMaskClick?: () => void
}

export class Dialog {
  private container: HTMLElement | null = null         // 整个对话框层
  private maskEl: HTMLElement | null = null            // 遮罩元素
  private panelEl: HTMLElement | null = null           // 面板包裹元素（内容 mount 点）
  private isOpen = false
  private lastContent: any = null
  private currentOptions: DialogOptions = {}
  private static activeDialogs: Set<Dialog> = new Set()
  
  // DOM移动相关属性
  private originalParent: HTMLElement | null = null    // 保存原始父元素
  private movedElement: HTMLElement | null = null      // 被移动的元素
  private isDomMoveMode = false                         // 是否使用DOM移动模式

  /**
   * 移动DOM元素到弹窗容器中
   */
  private moveElementToDialog(sourceElementId: string, targetElement: HTMLElement): boolean {
    const sourceElement = document.getElementById(sourceElementId)
    
    if (sourceElement && targetElement) {
      // 保存原始父元素，用于关闭时恢复
      this.originalParent = sourceElement.parentElement
      this.movedElement = sourceElement
      
      // 使用appendChild直接移动元素（不复制）
      targetElement.appendChild(sourceElement)
      console.log('元素已移动到弹窗中:', sourceElementId)
      return true
    } else {
      console.error('找不到源元素或目标元素', { sourceElementId, targetElement })
      return false
    }
  }

  /**
   * 将元素移回原位置
   */
  private restoreElement(): void {
    if (this.movedElement && this.originalParent) {
      this.originalParent.appendChild(this.movedElement)
      console.log('元素已恢复到原位置')
    }
    this.originalParent = null
    this.movedElement = null
    this.isDomMoveMode = false
  }

  private detectAdapter(content: any): Adapter {
    if (typeof content === 'string' || content instanceof HTMLElement || content instanceof DocumentFragment)
      return HtmlAdapter

    if (content && (typeof content === 'object' || typeof content === 'function')) {
      const proto = (content as any).prototype
      const hasSetup = !!(content as any).setup
      const hasRender = !!(content as any).render
      const isClass = proto && proto.isReactComponent
      const isFunctionComponent = typeof content === 'function' && /^[A-Z]/.test(content.name)
      if (hasSetup || hasRender) return VueAdapter
      if (isClass || isFunctionComponent) return ReactAdapter
    }

    throw new Error('[autodialog] Unsupported component type.')
  }

  show(content: any, options: DialogOptions = {}) {
    // 如果当前实例已打开，则先关闭
    if (this.isOpen) this.close()

    // 检查是否使用DOM移动模式
    const isDomMoveMode = !!(options.domMove?.containerId && options.domMove?.sourceElementId)
    this.isDomMoveMode = isDomMoveMode

    const {
      onBeforeOpen,
      onOpened,
      showMask = true,
      allowScroll = false,
      animation = true,
      animationDuration = 200,
      domMove,
    } = options

    this.currentOptions = options
    this.lastContent = content
    this.isOpen = true
    Dialog.activeDialogs.add(this)

    onBeforeOpen?.()

    // === 构建 DOM ===
    // 外层容器负责定位和点击捕获
    const container = document.createElement('div')
    container.className = 'autodialog-container'
    container.style.zIndex = String(9999 + Dialog.activeDialogs.size)

    // 如果是DOM移动模式且提供了containerId，设置容器ID
    if (isDomMoveMode && domMove!.containerId) {
      container.id = domMove!.containerId
    }

    // 遮罩
    const maskEl = document.createElement('div')
    maskEl.className = 'autodialog-mask'
    if (!showMask) maskEl.style.display = 'none'

    // 面板（真正挂用户内容的地方）
    const panelEl = document.createElement('div')
    panelEl.className = 'autodialog-panel'

    // 组装
    container.appendChild(maskEl)
    container.appendChild(panelEl)
    document.getElementById('root')!.appendChild(container)
    // document.body.appendChild(container)

    this.container = container
    this.maskEl = maskEl
    this.panelEl = panelEl

    // 锁定滚动
    if (allowScroll === false) {
      document.body.style.overflow = 'hidden'
    }

    // 遮罩点击
    if (showMask) {
      container.addEventListener('click', e => {
        if (e.target === container || e.target === maskEl) {
          options.onMaskClick?.()
          if (options.onMaskClick === undefined) this.close()
        }
      })
    }

    // 根据模式选择渲染方式
    if (isDomMoveMode) {
      // DOM移动模式：直接移动指定元素到弹窗中
      const moveSuccess = this.moveElementToDialog(domMove!.sourceElementId, panelEl)
      if (!moveSuccess) {
        // 如果移动失败，清理并退出
        this.close()
        return
      }
    } else {
      // 适配器模式：使用原有的适配器系统
      const adapter = this.detectAdapter(content)
      adapter.render(content, {
        container,
        panel: panelEl,
        title: options.title,
        props: options.props,
        onClose: () => this.close(),
      })
    }

    // === 进入动画 ===
    if (animation) {
      const enterClass = options.animationClass?.enter || 'autodialog-anim-enter' // 面板进入起始态
      const visibleClass = 'autodialog-visible'                                   // 面板目标态
      const maskShowClass = 'autodialog-mask-visible'                              // 遮罩目标态

      // 初始：面板带 enterClass，遮罩透明
      panelEl.classList.add(enterClass)
      maskEl.classList.add('autodialog-mask-init')

      // 下一帧：过渡到可见
      requestAnimationFrame(() => {
        // 面板：进入最终可见状态
        panelEl.classList.add(visibleClass)
        panelEl.classList.remove(enterClass)

        // 遮罩：淡入
        maskEl.classList.add(maskShowClass)
      })

      setTimeout(() => {
        onOpened?.()
      }, animationDuration)
    } else {
      // 无动画，直接可见
      panelEl.classList.add('autodialog-visible')
      maskEl.classList.add('autodialog-mask-visible')
      onOpened?.()
    }
  }

  close() {
    if (!this.isOpen || !this.container || !this.panelEl || !this.maskEl) return
    
    const {
      allowScroll,
      animation = true,
      animationClass,
      animationDuration = 200,
      onBeforeClose,
      onClosed,
    } = this.currentOptions

    onBeforeClose?.()
    this.isOpen = false
    Dialog.activeDialogs.delete(this)

    if (allowScroll === false && Dialog.activeDialogs.size === 0) {
      document.body.style.overflow = ''
    }

    if (animation) {
      const leaveClass = animationClass?.leave || 'autodialog-anim-leave'
      // 面板开始离场
      this.panelEl.classList.add(leaveClass)
      this.panelEl.classList.remove('autodialog-visible')
      // 遮罩开始淡出
      this.maskEl.classList.add('autodialog-mask-leave')
      this.maskEl.classList.remove('autodialog-mask-visible')

      setTimeout(() => {
        // 根据模式选择清理方式
        if (this.isDomMoveMode) {
          // DOM移动模式：将元素移回原位置
          this.restoreElement()
        } else {
          // 适配器模式：使用适配器的卸载方法
          const adapter = this.detectAdapter(this.lastContent)
          adapter?.unmount?.(this.panelEl!)
        }
        
        this.container?.remove()
        this.container = null
        this.maskEl = null
        this.panelEl = null
        onClosed?.()
      }, animationDuration)
    } else {
      // 根据模式选择清理方式
      if (this.isDomMoveMode) {
        // DOM移动模式：将元素移回原位置
        this.restoreElement()
      } else {
        // 适配器模式：使用适配器的卸载方法
        const adapter = this.detectAdapter(this.lastContent)
        adapter?.unmount?.(this.panelEl!)
      }
      
      this.container.remove()
      this.container = null
      this.maskEl = null
      this.panelEl = null
      onClosed?.()
    }
  }
}

// 默认导出的全局实例
export const autodialog = new Dialog()
