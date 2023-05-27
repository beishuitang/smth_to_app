import appContainer from './scripts/appContainer'
import UserPanelVue from './components/UserPanel.vue'
import MenuSettingVue from './components/MenuSetting.vue'
import cssUtils from './scripts/cssUtils'
import eventHandler from './scripts/eventHandler'
import smthScriptConfig from './scripts/smthScriptConfig'
import storage from '@/scripts/storage'
import { useUsersDataStore } from '@/stores/usersDataStore'
import { useAppStateStore } from '@/stores/appStateStore'
import dispatcher from './scripts/dispatcher'
import { keepAlive } from '@/scripts/commonUtils'
import ipData from '@/scripts/ipData'

export default {
  dbPrepared: false,
  appStateStore: useAppStateStore(appContainer.pinia),
  usersDataStore: useUsersDataStore(appContainer.pinia),
  bodyElement: {} as HTMLElement,
  initDb: function () {
    storage
      .initDB()
      .then(this.usersDataStore.initUsersData)
      .then(() => {
        this.dbPrepared = true
        ipData.init()
      })
    smthScriptConfig.init()
    appContainer.init()
  },
  initDom: function () {
    this.bodyElement = document.querySelector('#body') as HTMLElement
    this.appStateStore.onHashChange()
    this.bodyElement.childElementCount !== 0 && this.bodyMutCallback()
    cssUtils.init()
    eventHandler.handleInputEvent()
    this.listen()
    this.addMenu()
    this.addPanel()
    keepAlive(20)
  },
  addMenu: function () {
    const menuDiv = document.createElement('div')
    appContainer.getApp(MenuSettingVue).mount(menuDiv)
    document.querySelector('#menu')?.appendChild(menuDiv)
  },
  addPanel: function () {
    setTimeout(() => {
      if (this.dbPrepared) {
        const panelDiv = document.createElement('div')
        appContainer.getApp(UserPanelVue).mount(panelDiv)
        document.body.appendChild(panelDiv)
      } else {
        this.addPanel()
      }
    }, 10)
  },
  listen: function () {
    window.addEventListener('hashchange', () => {
      this.appStateStore.onHashChange()
    })
    const mutConfig = {
      attributes: false,
      childList: true,
      subtree: false
    }
    new MutationObserver(() => {
      this.bodyMutCallback()
    }).observe(this.bodyElement, mutConfig)
  },
  bodyMutCallback: function () {
    this.bodyElement.style.display = 'none'
    this.appStateStore.onBodyMut()
    cssUtils.pxToRem()
    dispatcher.dispatch(this.bodyElement)
    const notices = document.querySelectorAll('#notice')
    if (notices.length == 1) {
      notices[0].parentElement?.appendChild(notices[0].cloneNode(true))
    } else if (notices.length == 2) {
      notices[1].innerHTML = notices[0].innerHTML
    }
    this.bodyElement.style.display = 'block'
    const hashScrollY = this.appStateStore.scrollY
    if (hashScrollY.hash === location.hash) {
      window.scrollTo({ top: hashScrollY.scrollY, behavior: 'auto' })
      // hashScrollY.hash = ''
    }
  }
}
