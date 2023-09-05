import { useAppStateStore } from './appStateStore'
import appContainer from '@/scripts/appContainer'

const appStateStore = useAppStateStore(appContainer.pinia)
const pageReg = /(\?|&)p=[0-9]+$|\p=[0-9]+&|ajax=&/g
const postReg = /#!article\/[.\w]+\/post\/[0-9]+/g
const mainpageHash = '#!mainpage'
const historyStack = [{ hash: mainpageHash, scrollY: 0 }]
let bodyLoaded = true
const style = document.createElement('style')
document.head.appendChild(style)
function onBodyMut() {
  bodyLoaded = true
  if (location.hash.match(postReg)) return
  historyStack.push({ hash: location.hash, scrollY: 0 })
}
function onHashChange(e: HashChangeEvent) {
  bodyLoaded = false
  const last = historyStack[historyStack.length - 1]
  if (last && e.oldURL.includes(last.hash)) {
    last.scrollY = window.scrollY
  }
}
function markStepOutLink(href = '') {
  style.textContent = `a[href$="${href}"] {text-decoration:underline;font-style:italic}`
}
function isTheSameTopic(hash1: string, hash2: string) {
  return hash1.replace(pageReg, '') == hash2.replace(pageReg, '')
}
function getStackHash() {
  historyStack.pop()
  let hashScrollY = historyStack.pop()
  while (hashScrollY && isTheSameTopic(hashScrollY.hash, location.hash)) {
    hashScrollY = historyStack.pop()
  }
  return hashScrollY ? hashScrollY : { hash: '#!mainpage', scrollY: 0 }
}
function stepOut() {
  if (!bodyLoaded) return
  const hashScrollY = getStackHash()
  Object.assign(appStateStore.scrollY, hashScrollY)
  markStepOutLink(location.hash.replace('#!', '').replace(pageReg, ''))
  window.APP.body.open(location.href.replace(/#!.*$/, hashScrollY.hash))
}

export default {
  onHashChange,
  onBodyMut,
  stepOut
}
