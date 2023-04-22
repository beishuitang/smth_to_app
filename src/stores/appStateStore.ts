import { reactive } from 'vue'
import { defineStore } from 'pinia'
import storage from '@/scripts/storage'
import type { Topic } from '@/scripts/class/Topic'
export const useAppStateStore = defineStore('appStateStore', () => {
  const mainpage = '#!mainpage'
  const mainReg = /#!(\w+)(\/|$)/
  const pageReg = /(\?|&)p=[0-9]+$|\p=[0-9]+&|ajax=&/g
  const pageN = /(\?|&)p=([0-9]+)/
  // const articleReg = /(article\/[\w|.]+\/\d+)(\?p=(\d+))?/
  const articleReg = /#!article\/([\w.]+)\/(\d+)($|\?)/
  const topicReg = /(article\/[\w|.]+\/\d+)(\?p=(\d+))?$/
  const historyStack = [{ hash: mainpage, scrollY: 0 }] as hashScrollY[]
  const historyQueue = [
    { hash: mainpage, commited: true },
    { hash: location.hash, commited: false }
  ]
  const scrollY = { hash: '', scrollY: 0 }
  const topicCache: { [key: string]: Topic | undefined } = {}
  let fromStepOut = false
  let style: HTMLStyleElement | undefined = undefined
  const appState = reactive({
    mainHash: 'mainpage',
    showState: {
      showSetting: false,
      state: 0,
      showPanel: false,
      showMenu: false
    },
    topicState: {
      board: '',
      topicId: ''
    },
    articleInfoArr: [] as ArticleInfo[]
  })
  function changeShowstate(direction: 'left' | 'right') {
    if (direction == 'left') {
      switch (appState.showState.state) {
        case 1:
          appState.showState.state = 0
          appState.showState.showMenu = false
          break
        case 0:
          appState.showState.state = -1
          appState.showState.showPanel = true
          break
        default:
          break
      }
    } else {
      switch (appState.showState.state) {
        case -1:
          appState.showState.state = 0
          appState.showState.showPanel = false
          break
        case 0:
          appState.showState.state = 1
          appState.showState.showMenu = true
          break
        default:
          break
      }
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
    historyStackCheck()
  }
  function onBodyMut() {
    appState.showState.state = 0
    appState.showState.showMenu = false
    appState.showState.showPanel = false
    historyQueue[1].commited = true
    markStepOutLink(fromStepOut, historyQueue[0].hash.replace('#!', '').replace(pageReg, ''))
    fromStepOut = false
  }
  function historyStackCheck() {
    historyQueue.shift()
    historyQueue.push({ hash: location.hash, commited: false })
    const oldHash = historyQueue[0]
    if (fromStepOut || !oldHash.commited) {
      return
    }
    for (let index = historyStack.length - 1; index > 0; index--) {
      const historyHash = historyStack[index].hash
      if (location.hash === historyHash) {
        spliceArr(historyStack, index)
        break
      }
    }
    historyStack.push({ hash: oldHash.hash, scrollY: window.scrollY })
  }
  function spliceArr(arr: hashScrollY[], index: number) {
    while (arr.length > index) {
      arr.pop()
    }
  }
  function smallerPageN(hash1: string, hash2: string) {
    const m1 = hash1.match(pageN)
    const m2 = hash2.match(pageN)
    const n1 = m1 ? m1[2] : '1'
    const n2 = m2 ? m2[2] : '1'
    return parseInt(n1) < parseInt(n2)
  }
  function sameTopic(hash1: string, hash2: string) {
    return hash1.replace(pageReg, '') == hash2.replace(pageReg, '')
  }
  function getStackHash(hash: string, stepOut = false) {
    let hashScrollY = historyStack.pop()
    while (hashScrollY !== undefined && sameTopic(hashScrollY.hash, hash)) {
      if (!stepOut && smallerPageN(hashScrollY.hash, hash)) break
      hashScrollY = historyStack.pop()
    }
    return hashScrollY ? hashScrollY : { hash: '#!mainpage', scrollY: 0 }
  }
  function stepOut(hash: string) {
    saveTopicInfo()
    const hashScrollY = getStackHash(hash, true)
    Object.assign(scrollY, hashScrollY)
    fromStepOut = true
    location.hash = hashScrollY.hash
  }
  function markStepOutLink(enabled: boolean, href = '') {
    if (style === undefined) {
      style = document.createElement('style')
      document.head.appendChild(style)
    }
    style.textContent = enabled
      ? `a[href$="${href}"] {text-decoration:underline;font-style:italic}`
      : ''
  }
  function saveTopicInfo() {
    const m = location.hash.match(topicReg)
    // let href = pageHref;
    if (m == null) {
      // href = rmPage1(pageHref);
    } else {
      const a_names = document.querySelectorAll<HTMLAnchorElement>('#body>.b-content>a')
      if (a_names.length == 0) {
        return
      }
      // const artile_els = document.querySelectorAll('#body table.article')
      // const article_timestamp = parseInt(artile_els[artile_els.length - 1].getAttribute('article_timestamp'))
      const pos = parseInt(a_names[a_names.length - 1].name.substr(1))
      const topic: Topic = {
        topicUri: m[1],
        p: parseInt(m[3] ? m[3] : '1'),
        pos: pos,
        scrollY: window.scrollY
      }
      topicCache[location.href.replace(pageReg, '').replace('#!', '')] = topic
      storage.saveTopic(topic)
    }
  }
  function getTopicByUri(uri: string, callback: (topic: Topic | undefined) => void) {
    if (Object.prototype.hasOwnProperty.call(topicCache, uri)) {
      callback(topicCache[uri])
      return
    }
    const m = uri.match(topicReg)
    if (m === null || m[2] !== undefined) {
      topicCache[uri] = undefined
      callback(undefined)
      return
    }
    storage.getTopicleByUri(m[1]).then((topic) => {
      topicCache[uri] = topic
      callback(topic)
    })
  }
  for (let index = 0; index < 10; index++) {
    appState.articleInfoArr.push({
      userId: '',
      articleId: '',
      content: '',
      showModifier: false,
      ip: ''
    })
  }
  return {
    scrollY,
    appState,
    onHashChange,
    changeShowstate,
    onBodyMut,
    saveTopicInfo,
    getTopicByUri,
    stepOut
  }
})
interface ArticleInfo {
  userId: string
  articleId: string
  content: string
  showModifier: boolean
  ip?: string
  ipInfo?: string
}

interface hashScrollY {
  hash: string
  scrollY: number
}
