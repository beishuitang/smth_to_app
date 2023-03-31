import { createPinia } from 'pinia'
import { createApp, type Component } from 'vue'
import ModifierSwitch from '@/components/article/tags/ModifierSwitch.vue'
import UserDataBundle from '@/components/article/tags/UserDataBundle.vue'
import UserScore from '@/components/article/tags/UserInfo.vue'
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
  appElArrs: [] as AppEls[],
  init: function () {
    for (let index = 0; index < 10; index++) {
      const props = { articleIndex: index }
      const el1 = document.createElement('a')
      const el2 = document.createElement('li')
      const el3 = document.createElement('div')
      this.getApp(UserScore, props).mount(el1)
      this.getApp(ModifierSwitch, props).mount(el2)
      this.getApp(UserDataBundle, props).mount(el3)
      this.appElArrs[index] = {
        modifierSwitchEl: el2,
        userDataBundleEl: el3,
        userScoreEl: el1
      }
    }
  }
}
interface AppEls {
  modifierSwitchEl: HTMLElement
  userDataBundleEl: HTMLElement
  userScoreEl: HTMLElement
}
