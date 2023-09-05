import '@/assets/smth/pack_rem_no_link_html_prefix_font_filter.css'
import '@/assets/smth/fix_html_prefix.css'
import '@/assets/smth/nForum.css'
import '@/assets/smth/pack_rem_link.css'
import smthScriptConfig from '@/scripts/smthScriptConfig'
import topicStore from '@/stores/topicStore'
import stateStore from '@/stores/stateStore'
export default {
  init: function () {
    if (!smthScriptConfig.onMobile) return
    document.body.classList.add('newsmth-plus')
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'viewport')
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0')
    document.head.appendChild(meta)
    this.initConfigCss()
  },
  styleSheet: {} as HTMLStyleElement,
  blacklistStyle: {} as HTMLStyleElement,
  initConfigCss() {
    this.styleSheet = document.createElement('style')
    this.blacklistStyle = document.createElement('style')
    const { mainpageConfig, cssConfig, frameConfig, simplifyConfig } = smthScriptConfig
    const els = mainpageConfig.section.concat(frameConfig.component).concat(simplifyConfig.func)
    let cssText = 'html' + '{font-size:' + cssConfig.fontSize + 'px}'
    els.forEach((el) => {
      if (!el.show) cssText += el.el + '{display:none}'
    })
    this.styleSheet.appendChild(document.createTextNode(cssText))
    document.head.appendChild(this.styleSheet)
    document.head.appendChild(this.blacklistStyle)
  },
  updateBlacklistStyle: function () {
    const list: string[] = stateStore.getBlacklist()
    let cssText = ''
    list.forEach((id) => {
      cssText += `#body table.article[${smthScriptConfig.PROJECT_NAME}-id="${id}"]{display:none}`
      cssText += `#body table.board-list tr[${smthScriptConfig.PROJECT_NAME}-id="${id}"]{display:none}`
    })
    this.blacklistStyle.innerText = cssText
  },
  pxToRem: function () {
    if (!smthScriptConfig.onMobile) return
    const style: HTMLStyleElement | null = document.querySelector('#body>style')
    if (style == null) {
      return
    }
    style.innerHTML = replace(style.innerHTML)
  },
  addVisitedLinkStyle: function (a_el: HTMLAnchorElement, pos: number) {
    const topicUri = topicStore.getTopicUri(a_el.href)
    if (!topicUri) return
    topicStore.get(topicUri).then((info) => {
      if (pos <= info.pos) {
        a_el.style.opacity = '0.5'
      }
      a_el.setAttribute('read', `(${info.pos + 1}/${pos + 1})`)
    })
  }
}
function replace(s: string) {
  const px = /([0-9]+)px/g
  return s.replace(px, (_: string, p: string) => {
    return (parseInt(p) / 10).toFixed(1) + 'rem'
  })
}
