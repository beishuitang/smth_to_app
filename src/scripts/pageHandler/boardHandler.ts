import config from '@/scripts/smthScriptConfig'
import { splitName, relayTableAll } from '../commonUtils'
import { fixEmptyBoard } from '@/scripts/bugHandler'
import cssUtils from '@/scripts/cssUtils'
import smthScriptConfig from '@/scripts/smthScriptConfig'

export default {
  handle(bodyEl: HTMLElement) {
    const tableEl = bodyEl.querySelector('table')
    if (tableEl == null || tableEl.id == 'member_list') {
      return
    }
    const userEls = document.querySelectorAll('#body table .title_12')
    const topicTrs = document.querySelectorAll<HTMLElement>('.board-list>tbody>tr')
    if (topicTrs.length === 1 && topicTrs[0].firstElementChild?.innerHTML == '该版面没有任何主题') {
      fixEmptyBoard()
      return
    }
    splitName(userEls)
    config.onMobile && relayTableAll(tableEl, [[3, 2]], [0, 2, 4, 5, 6, 7, 8])
    const middle = document.querySelector<HTMLElement>('.board-list>thead>tr>.middle')
    if (middle != null) middle.innerText = '[评分/like数]主题(已读/全部)'
    // mainData.topicLinks.splice(0, mainData.topicLinks.length);
    for (let index = 0; index < topicTrs.length; index++) {
      const topic_el = topicTrs[index].querySelector<HTMLAnchorElement>('.title_9>a')
      if (topic_el == null) return
      const author = topicTrs[index].querySelector('.title_12>a')?.innerHTML ?? ''
      topicTrs[index].setAttribute(smthScriptConfig.PROJECT_NAME + '-id', author)
      const middle_els = topicTrs[index].querySelectorAll('.middle')
      const score = middle_els[0].innerHTML
      const like = middle_els[1].innerHTML
      const pos = middle_els[2].innerHTML
      const topic_p1 = document.createElement('a')
      topic_p1.href = topic_el.href
      topic_p1.innerHTML = `[${score}${score + like == '' ? ' ' : '/'}${like}]`
      topic_el.parentNode?.insertBefore(topic_p1, topic_el)
      cssUtils.addVisitedLinkStyle(topic_el, parseInt(pos))
    }
  }
}
