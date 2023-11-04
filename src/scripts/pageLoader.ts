import { useAppStateStore } from '@/stores/appStateStore'
import appContainer from './appContainer'
import dispatcher from './dispatcher'

const pageReg = /[?&]p=(\d+)(&|$)/
const pending = new Set<string>()
const appStore = useAppStateStore(appContainer.pinia)
const listInfo = {
  currentTop: 1,
  first: 1,
  last: 1,
  approachTop: function () {
    return this.currentTop - this.first < 5
  },
  approachBottom: function () {
    return this.last - this.currentTop < 8
  }
}
export default {
  async onBodyMut() {
    listInfo.currentTop = 1
    listInfo.first = 1
    listInfo.last = 1
  },
  async onSwipe(direction: 'up' | 'down') {
    if (appStore.appState.mainHash !== 'article') return
    const aEls = document.querySelectorAll('#body>.b-content>a[name]')
    for (let index = 0; index < aEls.length; index++) {
      const aEl = aEls.item(index)
      if (aEl.getBoundingClientRect().top > 0) {
        listInfo.currentTop = getANum(aEl)
        listInfo.first = getANum(aEls[0])
        listInfo.last = getANum(aEls[aEls.length - 1])
        break
      }
    }
    historyReplace()
    if (direction === 'up' && listInfo.approachBottom()) {
      addPage(direction)
    } else if (direction === 'down' && listInfo.approachTop()) {
      // addPage(direction)
    }
  }
}
async function addPage(direction: 'up' | 'down') {
  const doc = await getDoc(getUrl(direction === 'up'))
  if (!doc) return
  const content = doc?.querySelector('.b-content')
  const t_pre = doc.querySelector('.t-pre')
  const t_pre_bottom = doc.querySelector('.t-pre-bottom')
  if (!content || !t_pre || !t_pre_bottom) return
  dispatcher.dispatch(doc?.body)
  document.querySelector('.b-content')?.append(...content.children)
  // document.querySelector('.t-pre')?.replaceChildren(...t_pre.children)
  document.querySelector('.t-pre-bottom')?.replaceChildren(...t_pre_bottom.children)
}
function getUrl(next: boolean) {
  const els = document.querySelectorAll<HTMLAnchorElement>('.page-main a')
  if (!els || els.length === 0) return ''
  return els[next ? els.length - 1 : 0].href
}
async function getDoc(url: string) {
  if (url === '' || pending.has(url)) return
  pending.add(url)
  const path = transPath(url)
  let htmlData = ''
  try {
    htmlData = await ajaxGet(path)
  } catch (e) {
    pending.delete(url)
  }
  // const htmlData = await $.get(path)
  const doc = new window.DOMParser().parseFromString(htmlData, 'text/html')
  if (url.replace(pageReg, '') !== location.href.replace(pageReg, '').replace('#!', '')) return
  pending.delete(url)
  return doc
}
function ajaxGet(url: string) {
  const controller = new AbortController()
  setTimeout(() => {
    controller.abort()
  }, 6000)
  return new Promise<string>((resolve, reject) => {
    fetch(url, {
      signal: controller.signal,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader()
        reader.onload = function () {
          const htmlData = reader.result as string
          resolve(htmlData)
        }
        reader.onerror = reject
        reader.readAsText(blob, 'GBK')
      })
      .catch(reject)
  })
}
function transPath(path: string) {
  let path_a
  if (path.match(/\?/)) {
    path_a = path.replace(/\?/, '?ajax&')
  } else if (path.match(/#/)) {
    path_a = path.replace(/#/, '?ajax#')
  } else {
    path_a = path + '?ajax'
  }
  return path_a
}
function getANum(aEl: Element) {
  const num = aEl.getAttribute('name')?.replace('a', '')
  return num ? parseInt(num) : 1
}
function historyReplace() {
  const p = Math.floor(listInfo.currentTop / 10) + 1
  const newHref = location.href.replace(pageReg, (m0, m1) => {
    return m0.replace(m1, p + '')
  })
  if (location.href !== newHref) history.replaceState({}, '', newHref)
}
