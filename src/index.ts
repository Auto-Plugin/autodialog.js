import './style.css'
import { autodialog, Dialog } from './core'
import { WebComponentAdapter } from './adapters/webComponents'

export { Dialog } from './core'

Dialog.registerAdapter({
  name: 'html',
  detect: (content: any) => {
    return typeof content === 'string' || content instanceof HTMLElement
  },
  adapter: WebComponentAdapter,
})

export default autodialog