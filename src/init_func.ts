import appContainer from './scripts/appContainer'
import UserPanelVue from './components/UserPanel.vue'
import cssUtils from './scripts/cssUtils'
import eventHandler from './scripts/eventHandler'
import smthScriptConfig from './scripts/smthScriptConfig'
import storage from '@/scripts/storage'
import { useUsersDataStore } from '@/stores/usersDataStore'
import { useAppStateStore } from '@/stores/appStateStore'
import dispatcher from './scripts/dispatcher'
import { keepAlive } from '@/scripts/commonUtils'

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
    this.addPanel()
    window.Android === undefined && keepAlive(20)
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
    // window.addEventListener('scroll', () => {
    // this.appStateStore.scrollY = { hash: location.hash, scrollY: window.scrollY }
    // })
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
    this.appStateStore.onBodyMut()
    this.bodyElement.style.display = 'none'
    cssUtils.pxToRem()
    dispatcher.dispatch(this.bodyElement)
    const notices = document.querySelectorAll('#notice')
    if (notices.length == 1) {
      notices[0].parentElement?.appendChild(notices[0].cloneNode(true))
    } else if (notices.length == 2) {
      notices[1].innerHTML = notices[0].innerHTML
    }
    const hashScrollY = this.appStateStore.scrollY
    if (hashScrollY.hash === location.hash) {
      window.scrollTo({ top: hashScrollY.scrollY, behavior: 'auto' })
      hashScrollY.hash = ''
    }
    this.bodyElement.style.display = 'block'
  }
}
