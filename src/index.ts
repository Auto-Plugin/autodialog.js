export { dialog, Dialog } from './core'
import { Dialog } from './core'
export * from './adapters/html'
export * from './adapters/vue'
export * from './adapters/react'
import './style.css'

const autoDialog = new Dialog()
export default autoDialog