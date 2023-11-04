import { reactive } from 'vue'
import { defineStore } from 'pinia'
export const useAppStateStore = defineStore('appStateStore', () => {
  const mainReg = /#!(\w+)(\/|$)/
  const articleReg = /#!article\/([\w.]+)\/(\d+)($|\?)/
  const scrollY = { hash: '', scrollY: 0 }
  const appState = reactive({
    mainHash: 'mainpage',
    showState: {
      showSetting: false,
      state: 0 as -1 | 0 | 1
    },
    topicState: {
      board: '',
      topicId: ''
    },
    articleInfoArr: [] as ArticleInfo[]
  })
  function changeShowstate(direction: 'left' | 'right') {
    if (direction === 'left' && appState.showState.state !== 1) {
      appState.showState.state++
    } else if (direction === 'right' && appState.showState.state !== -1) {
      appState.showState.state--
    }
  }
  function onHashChange() {
    const hash = location.hash
    const m = hash.match(mainReg)
    if (m == null) return
    appState.mainHash = m[1]
    if (appState.mainHash === 'article') {
      const n = hash.match(articleReg)
      if (n == null) return
      appState.topicState.board = n[1]
      appState.topicState.topicId = n[2]
      if (n[3] !== '?') {
        // getTopicInfo("article/" + n[1] + "/" + n[2])
      }
    }
  }
  function onBodyMut() {
    appState.showState.state = 0
    appState.articleInfoArr.length = 0
  }
  function init() {
    onHashChange()
  }
  return {
    scrollY,
    appState,
    init,
    onHashChange,
    changeShowstate,
    onBodyMut
  }
})
export interface ArticleInfo {
  userId: string
  articleId: string
  content: string
  p: HTMLParagraphElement
  showModifier: boolean
  ip: string
  articleUri: string
  modifierSwitchEl: HTMLElement
  userDataBundleEl: HTMLElement
  userInfoEl: HTMLElement
}
