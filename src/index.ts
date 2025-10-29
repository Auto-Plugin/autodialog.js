import './style.css'
import { autodialog, Dialog } from './core'
import { WebComponentAdapter } from './adapters/webComponents'

export { Dialog } from './core'

Dialog.registerAdapter({
  name: 'html',
  detect: (content: any) => {
    // 判断是否为字符串或 HTMLElement，且不是完整的 HTML 片段
    return (typeof content === 'string' || content instanceof HTMLElement) && !(/<\/?[a-z][\s\S]*>/i.test(content as string))
  },
  adapter: WebComponentAdapter,
})

export default autodialog