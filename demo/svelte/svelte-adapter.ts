import { mount } from 'svelte'

export const SvelteAdapter = {
  render(Component: any, { panel, props = {}, onClose }: any) {
    const instance = mount(Component, {
      target: panel,
      props: { ...props, onClose },
    })
    ;(panel as any).__svelte__ = instance
  },
  unmount(panel: HTMLElement) {
    const inst = (panel as any).__svelte__
    if (inst?.destroy) inst.destroy()
    delete (panel as any).__svelte__
  },
}
