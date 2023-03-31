import { splitName, relayTableAll } from '../commonUtils'
import config from '@/scripts/smthScriptConfig'
export default {
  sReg: /^#!s\/(\w+)\?/,
  handle(bodeElement: Element) {
    const m = location.hash.match(this.sReg)
    if (m == null || m[1] != 'article') {
      return
    }
    const tableEl = bodeElement.querySelector('table')
    const userEls = bodeElement.querySelectorAll('#body table .title_12')
    if (tableEl == null || userEls.length == 0) {
      return
    }
    splitName(userEls)
    config.onMobile && relayTableAll(tableEl, [[4, 3]], [0, 1, 3, 5, 6, 7])
  }
}
