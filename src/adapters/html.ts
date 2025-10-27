export const HtmlAdapter = {
  render(content: string | HTMLElement | DocumentFragment, { panel }: { panel: HTMLElement }) {
    if (typeof content === 'string') {
      panel.innerHTML = content
    } else {
      panel.appendChild(content)
    }
  },
  unmount() {}
}
