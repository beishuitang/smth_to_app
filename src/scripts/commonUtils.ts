import appContainer from '@/scripts/appContainer'
import { useAppStateStore } from '@/stores/appStateStore'
const appStateStore = useAppStateStore(appContainer.pinia)

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
// export function splitTableAll(tableEl, tdIndexsToMoveUp, tdIndexToDelete) {
//     splitTable(tableEl.querySelector('thead'), tdIndexsToMoveUp, tdIndexToDelete);
//     splitTable(tableEl.querySelector('tbody'), tdIndexsToMoveUp, tdIndexToDelete);
// }
// function splitTable(trWrapper, tdIndexsToMoveUp, tdIndexToDelete) {
//     let trs = trWrapper.children;
//     for (let index = trs.length - 1; index > -1; index--) {
//         const tr = trs[index];
//         splitTr(tr, tdIndexsToMoveUp, tdIndexToDelete);
//     }
// }
// function splitTr(tr, tdIndexsToMoveUp, tdIndexToDelete) {
//     let trClone = tr.cloneNode(false);
//     tr.parentNode.insertBefore(trClone, tr);
//     let tds = tr.children;
//     let tdBuffer = [];
//     for (let index = tdIndexToDelete.length - 1; index >= 0; index--) {
//         const i = tdIndexToDelete[index];
//         // tds[i].remove();
//         tdBuffer.push(tds[i]);
//     }
//     tdIndexsToMoveUp.forEach(tdIndexAndColspan => {
//         let td = tds[tdIndexAndColspan[0]];
//         td.setAttribute('colspan', tdIndexAndColspan[1]);
//         trClone.appendChild(td);
//     });
//     tdBuffer.forEach(td => {
//         td.remove();
//     });
// }
export function removeAd() {
  const list: NodeListOf<HTMLElement>[] = []
  // list.push(document.querySelectorAll('.clearfix'))
  list.push(document.querySelectorAll('iframe'))
  // list.push(document.querySelectorAll('.mp_clear'))
  list.push(document.querySelectorAll('.ad'))
  list.push(document.querySelectorAll('#ban_ner'))
  list.push(document.querySelectorAll('#left_adv'))
  list.push(document.querySelectorAll('#sogou_banner'))
  list.forEach((elements) => {
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index]
      // element.remove();
      element.style.display = 'none'
    }
  })
}

export function addTransition(el: Element, name: string) {
  const transition = document.createElement('transition')
  transition.setAttribute('name', name)
  el.parentNode?.insertBefore(transition, el)
  transition.appendChild(el)
  return transition
}
export function rmPage1(pageHref: string) {
  let href = pageHref.replace(/\?p=1$/, '')
  href = href.replace(/\?p=1&/, '?')
  href = href.replace(/&p=1$/, '')
  href = href.replace(/&p=1&/, '&')
  return href
}
export function addVisitedLinkStyle(a_el: HTMLAnchorElement, pos: number) {
  const a_href = a_el.href
  appStateStore.getTopicByUri(a_href, (info) => {
    info = info ? info : { topicUri: '', pos: -1, p: 1, scrollY: 0 }
    if (pos <= info.pos) {
      a_el.style.opacity = '0.5'
    }
    const span_el = document.createElement('span')
    span_el.innerText = `(${info.pos + 1}/${pos + 1})`
    a_el.parentNode?.insertBefore(span_el, a_el.nextSibling)
  })
}
