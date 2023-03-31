import config from '@/scripts/smthScriptConfig'
import { splitName, relayTableAll, addVisitedLinkStyle } from '../commonUtils'
import appContainer from '../appContainer'
import { useUsersDataStore } from '@/stores/usersDataStore'

const usersDataStore = useUsersDataStore(appContainer.pinia)

// import browserUtil from '../browseUtil'
export default {
  handle(bodyEl: HTMLElement) {
    const tableEl = bodyEl.querySelector('table')
    if (tableEl == null) {
      return
    }
    const userEls = document.querySelectorAll('#body table .title_12')
    const topicTrs = document.querySelectorAll<HTMLElement>('.board-list>tbody>tr')
    splitName(userEls)
    config.onMobile && relayTableAll(tableEl, [[3, 2]], [0, 2, 4, 5, 6, 7, 8])
    const middle = document.querySelector<HTMLElement>('.board-list>thead>tr>.middle')
    if (middle != null) middle.innerText = '[评分/like数]主题(已读/全部)'
    // mainData.topicLinks.splice(0, mainData.topicLinks.length);
    for (let index = 0; index < topicTrs.length; index++) {
      const topic_el = topicTrs[index].querySelector<HTMLAnchorElement>('.title_9>a')
      if (topic_el == null) return
      const author = topicTrs[index].querySelector('.title_12>a')?.innerHTML ?? ''
      if (!usersDataStore.getUserById(author).state.showUser) {
        topicTrs[index].style.display = 'none'
      }
      const middle_els = topicTrs[index].querySelectorAll('.middle')
      const score = middle_els[0].innerHTML
      const like = middle_els[1].innerHTML
      const pos = middle_els[2].innerHTML
      const topic_p1 = document.createElement('a')
      topic_p1.href = topic_el.href
      topic_p1.innerHTML = `[${score}${score + like == '' ? ' ' : '/'}${like}]`
      topic_el.parentNode?.insertBefore(topic_p1, topic_el)
      addVisitedLinkStyle(topic_el, parseInt(pos))
    }
  }
}
