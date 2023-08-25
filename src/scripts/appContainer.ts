import { createPinia } from 'pinia'
import { createApp, type Component } from 'vue'
import App from '@/App.vue'
export default {
  pinia: createPinia(),
  getApp: function (
    rootComponent: Component,
    rootProps?: { [x: string]: unknown } | null | undefined
  ) {
    const customApp = createApp(rootComponent, rootProps)
    customApp.use(this.pinia)
    return customApp
  },
  articleEls: new Array(10) as AppEls[],
  init: function () {
    for (let index = 0; index < 10; index++) {
      this.articleEls[index] = {
        modifierSwitchEl: document.createElement('li'),
        userDataBundleEl: document.createElement('div'),
        userInfoEl: document.createElement('a')
      }
    }
  },
  mount: function () {
    const appRoot = document.createElement('div')
    this.getApp(App).mount(appRoot)
    document.body.appendChild(appRoot)
  }
}
interface AppEls {
  userInfoEl: Element
  modifierSwitchEl: Element
  userDataBundleEl: Element
}
