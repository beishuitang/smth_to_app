import appcontainer from '../appContainer'
import { useAppStateStore, type ArticleInfo } from '@/stores/appStateStore'
import config from '@/scripts/smthScriptConfig'

const appState = useAppStateStore(appcontainer.pinia).appState
const aImgsReg = /<a target=.*?><img.*?><\/a>/g
export default {
  handle: function (bodyElement: HTMLElement) {
    const els = bodyElement.querySelectorAll('.article')
    els.forEach((el, index) => {
      fnArticle(el as HTMLTableElement, index)
    })
  }
}
function fnArticle(articleElement: HTMLTableElement, index: number) {
  const a_content = articleElement.querySelector('.a-content')
  const a_func = articleElement.querySelector('.a-func')
  const a_pos = articleElement.querySelector('.a-pos')
  const a_u_name = articleElement.querySelector('.a-u-name')
  const a_u_sex = articleElement.querySelector('.a-u-sex')
  const a_func_forward = articleElement.querySelector('.a-func-forward')

  if (a_u_name == null || a_u_sex == null || a_content == null || a_func == null || a_pos == null) {
    return
  }

  const user_a = a_u_name?.querySelector('a')
  const userId = user_a ? user_a.innerText : (<HTMLElement>a_u_name)?.innerText
  const classList = articleElement.classList
  articleElement.setAttribute('smth-id', userId)
  const classname = 'simple-article'
  articleElement.addEventListener(
    'dblclick',
    () => {
      classList.contains(classname) ? classList.remove(classname) : classList.add(classname)
    },
    true
  )
  classList.add('simple-article')
  // a_u_name.innerHTML += ElementStr.userScoreEl
  // a_func.innerHTML += ElementStr.modifierSwitchEl

  const p_el = articleElement.querySelector<HTMLParagraphElement>('.a-body .a-content>p')
  if (p_el == null) return
  let articleId = ''
  if (a_func_forward instanceof HTMLAnchorElement) {
    const href = a_func_forward.href
    articleId = href.substring(href.lastIndexOf('/') + 1, href.lastIndexOf('.'))
  }
  const topicState = useAppStateStore().appState.topicState
  const articleUri = topicState.board + '/' + topicState.topicId + '/' + articleId

  const content =
    config.onMobile && config.simplifyConfig.simplify ? pageArticleSimplify(p_el) : p_el.innerHTML
  const ip = getPageIp(articleElement)
  const articleInfo: ArticleInfo = {
    userId: userId,
    articleId: articleId,
    content: content,
    p: p_el,
    showModifier: false,
    ip: ip,
    articleUri: articleUri
  }
  Object.assign(appState.articleInfoArr[index], articleInfo)
  a_content.insertBefore(appcontainer.articleEls[index].userDataBundleEl, a_content.firstChild)
  a_func.appendChild(appcontainer.articleEls[index].modifierSwitchEl)

  if (config.onMobile) {
    const li = document.createElement('li')
    li.appendChild(a_u_sex)
    li.appendChild(a_u_name)
    a_func.insertBefore(li, a_func.firstChild)
    a_func.appendChild(a_pos)
    li.appendChild(appcontainer.articleEls[index].userInfoEl)
  } else {
    a_u_name.appendChild(appcontainer.articleEls[index].userInfoEl)
  }
}

function pageArticleSimplify(p: HTMLElement) {
  const p_simple = document.createElement('p')
  p.classList.add('origin')
  p_simple.classList.add('simple')
  const text = p.innerHTML
  const startStr = '<br>&nbsp;&nbsp;<br>'
  const endStr = '<br> --'
  const startStrIndex = text.indexOf(startStr) + 20
  const endStrIndex = text.lastIndexOf(endStr)
  const restHtml = text.substring(endStrIndex == -1 ? startStrIndex : endStrIndex, undefined)
  const imgs = restHtml.match(aImgsReg)
  let innerHTML = ''
  innerHTML =
    text.substring(startStrIndex, endStrIndex == -1 ? undefined : endStrIndex) + '<br><br>'
  imgs?.forEach((img) => {
    innerHTML += img
  })
  p_simple.innerHTML = innerHTML
  p.parentElement?.insertBefore(p_simple, p)
  return text
}

function getPageIp(articleElement: HTMLElement) {
  const fonts = articleElement.querySelectorAll<HTMLElement>('.a-body .a-content>p>font')
  if (fonts.length < 2) return ''
  // const fonts = p?.querySelectorAll("font");
  const ipText = fonts[fonts.length - 2].innerText
  const index = ipText.lastIndexOf('FROM: ')
  return index == -1 ? '' : ipText.substring(index + 6, ipText.length - 1)
}
