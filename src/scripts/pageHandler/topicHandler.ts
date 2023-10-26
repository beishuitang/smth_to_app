import config from '@/scripts/smthScriptConfig'
import { relayTableAll } from '../commonUtils'
import { fixEmptyBoard } from '@/scripts/bugHandler'

export default {
  handle(bodyEl: HTMLElement) {
    const tableEl = bodyEl.querySelector('table')
    if (tableEl == null || tableEl.id == 'member_list') {
      return
    }
    const topicTrs = document.querySelectorAll<HTMLElement>('.topic-list tbody>tr')
    if (topicTrs.length === 1 && topicTrs[0].firstElementChild?.innerHTML == '该版面没有任何主题') {
      fixEmptyBoard()
      return
    }
    config.onMobile && relayTableAll(tableEl, [], [2, 3, 4, 6, 7])
  }
}
