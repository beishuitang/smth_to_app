import { useAppStateStore } from './appStateStore'
import appContainer from '@/scripts/appContainer'

const appScroll = useAppStateStore(appContainer.pinia).scrollY
const record: { [hash: string]: number } = {}
const pageReg = /(\?|&)p=[0-9]+$|\p=[0-9]+&|ajax=&/g
const style = document.createElement('style')
document.head.appendChild(style)
function onBodyMut() {
  const y = record[location.hash]
  if (y && appScroll.hash !== location.hash) {
    appScroll.hash = location.hash
    appScroll.scrollY = y
  }
}
function onHashChange(e: HashChangeEvent) {
  const hash = e.oldURL.substring(e.oldURL.indexOf('#!'))
  if (e.oldURL.replace(pageReg, '') !== e.newURL.replace(pageReg, '')) record[hash] = window.scrollY
  markStepOutLink(e.oldURL.split('#!')[1].replace(pageReg, ''))
}
function markStepOutLink(href = '') {
  style.textContent = `a[href$="${href}"] {text-decoration:underline;font-style:italic}`
}

export default {
  onHashChange,
  onBodyMut
}
