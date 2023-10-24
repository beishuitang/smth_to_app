import storage from '@/storage/storage'
import smthScriptConfig from './scripts/smthScriptConfig'
import appContainer from './scripts/appContainer'
import { useAppStateStore } from '@/stores/appStateStore'
import stackStore from '@/stores/stackStore'
import topicStore from '@/stores/topicStore'
import majiaStore from '@/stores/majiaStore'
import tagStore from '@/stores/tagStore'
import cachedTagStore from '@/stores/cachedTagStore'
import cachedMajiaStore from '@/stores/cachedMajiaStore'
import stateStore from '@/stores/stateStore'
import ipInfoStore from '@/stores/ipInfoStore'
import userIPStore from '@/stores/userIPStore'
import articleStore from './stores/articleStore'
import likeStore from './stores/likeStore'
import imgStore from '@/stores/imgStore'
import cssUtils from './scripts/cssUtils'
import eventHandler from './scripts/eventHandler'
import dispatcher from './scripts/dispatcher'
import nForum from './scripts/nForum.js'
// import { keepAlive } from '@/scripts/commonUtils'

export default {
  dbPrepared: false,
  appStateStore: useAppStateStore(appContainer.pinia),
  bodyElement: {} as HTMLElement,
  initDb: function () {
    Promise.all([
      storage.initDB(),
      smthScriptConfig.init(),
      this.appStateStore.init(),
      appContainer.init()
    ])
      .then(() => {
        return Promise.all([
          stateStore.init(),
          majiaStore.init(),
          cachedTagStore.init(),
          cachedMajiaStore.init(),
          topicStore.init(),
          tagStore.init(),
          ipInfoStore.init(),
          userIPStore.init(),
          articleStore.init(),
          likeStore.init(),
          imgStore.init()
        ])
      })
      .then(() => {
        this.dbPrepared = true
        appContainer.mount()
      })
  },
  initDom: function () {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual'
    }
    this.bodyElement = document.querySelector('#body') as HTMLElement
    this.bodyElement.childElementCount !== 0 && this.bodyMutCallback()
    cssUtils.init()
    eventHandler.handleInputEvent()
    this.listen()
    nForum.fix()
    // keepAlive(20)
  },
  listen: function () {
    window.addEventListener('hashchange', (e) => {
      this.appStateStore.onHashChange()
      topicStore.onHashChange(e)
      stackStore.onHashChange(e)
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
    stackStore.onBodyMut()
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
    }
  }
}
