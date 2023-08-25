// import appContainer from '@/scripts/appContainer'
// import { useAppStateStore } from '@/stores/appStateStore'
// const appStateStore = useAppStateStore(appContainer.pinia)

export function keepAlive(min: number) {
  // const httpRequest = new XMLHttpRequest();
  setInterval(() => {
    // httpRequest.open('GET', 'user/ajax_session.json', true);
    // httpRequest.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    // httpRequest.setRequestHeader('X-Requested-With', ' XMLHttpRequest');
    // httpRequest.send();
    window.SESSION.update(false)
  }, (min * 60 - 10) * 1000)
}
export function mut(
  targetNode: Node,
  callback: MutationCallback,
  options?: MutationObserverInit | undefined
) {
  const observer = new MutationObserver(callback)
  observer.observe(targetNode, options)
}
export function splitName(users: NodeListOf<Element>) {
  for (let index = 0; index < users.length; index++) {
    const user = users[index]
    user.innerHTML = user.innerHTML.replace(/\|\s/, '')
  }
}
export function relayTableAll(
  tableEl: HTMLTableElement,
  tdIndexsToMergeArr: number[][],
  tdIndexToDelete: number[]
) {
  const thead = tableEl.querySelector('thead')
  const tbody = tableEl.querySelector('tbody')
  if (thead == null || tbody == null) {
    return
  }
  relayTable(thead, tdIndexsToMergeArr, tdIndexToDelete)
  relayTable(tbody, tdIndexsToMergeArr, tdIndexToDelete)
}
function relayTable(
  trWrapper: HTMLTableSectionElement,
  tdIndexsToMergeArr: number[][],
  tdIndexToDelete: number[]
) {
  const trs = trWrapper.children
  for (let index = 0; index < trs.length; index++) {
    const tr = trs[index]
    relayTr(tr, tdIndexsToMergeArr, tdIndexToDelete)
  }
}
function relayTr(tr: Element, tdIndexsToMergeArr: number[][], tdIndexToDelete: number[]) {
  const tds = tr.children
  if (tds.length == 1) {
    return
  }
  tdIndexsToMergeArr.forEach((tdIndexsToMerge) => {
    if (tdIndexsToMerge.length > 1) {
      const target = tds[tdIndexsToMerge[0]]
      for (let index = 1; index < tdIndexsToMerge.length; index++) {
        const td_index = tdIndexsToMerge[index]
        target.innerHTML += '<br>' + tds[td_index].innerHTML
      }
    }
  })
  for (let index = tdIndexToDelete.length - 1; index >= 0; index--) {
    const i = tdIndexToDelete[index]
    ;(tds[i] as HTMLElement).style.display = 'none'
    // tds[i].remove();
  }
}
export function rmPage1(pageHref: string) {
  let href = pageHref.replace(/\?p=1$/, '')
  href = href.replace(/\?p=1&/, '?')
  href = href.replace(/&p=1$/, '')
  href = href.replace(/&p=1&/, '&')
  return href
}
let t: NodeJS.Timeout | undefined
const message = '加载中..'
let el: HTMLElement | null = null
export function info(time = 0, mes = message) {
  if (el === null) {
    el = document.querySelector<HTMLElement>('#nforum_tips')!
  }
  if (time > 0) {
    el.style.display = 'block'
    el.innerHTML = mes
  }
  clearTimeout(t)
  t = setTimeout(() => {
    el!.style.display = 'none'
    el!.innerHTML = message
  }, time * 1000)
}
