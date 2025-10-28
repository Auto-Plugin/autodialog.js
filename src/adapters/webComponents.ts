import { Adapter } from "src/core"

export const WebComponentAdapter: Adapter = {
  render(TagName: string, { panel, props }) {
    const element = document.createElement(TagName)
    Object.assign(element, props)
    panel.appendChild(element)
  },
  unmount(panel: HTMLElement) {
    panel.innerHTML = ''
  }
}
