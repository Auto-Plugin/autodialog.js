import './style.css'
import { autodialog, Dialog } from './core'
import { WebComponentAdapter } from './adapters/webComponents'

export * from './adapters/html'
export * from './adapters/vue'
export * from './adapters/react'
export * from './adapters/webComponents'
export { Dialog } from './core'

Dialog.registerAdapter({
  name: 'html',
  adapter: WebComponentAdapter,
})

export default autodialog