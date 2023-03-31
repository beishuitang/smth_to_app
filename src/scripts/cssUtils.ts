import '@/assets/pack_rem_no_link_html_prefix_font_filter.css'
import '@/assets/fix_html_prefix.css'
import '@/assets/nForum.css'
import smthScriptConfig from '@/scripts/smthScriptConfig'
export default {
  init: function () {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'viewport')
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0')
    document.head.appendChild(meta)
    this.initConfigCss()
  },
  styleSheet: {} as HTMLStyleElement,
  initConfigCss() {
    this.styleSheet = document.createElement('style')
    const { mainpageConfig, cssConfig, frameConfig, simplifyConfig } = smthScriptConfig
    // this.setHtmlFontSize(cssConfig.fontSize)
    const els = mainpageConfig.section.concat(frameConfig.component).concat(simplifyConfig.func)
    let cssText = 'html' + '{font-size:' + cssConfig.fontSize + 'px}'
    els.forEach((el) => {
      if (!el.show) cssText += el.el + '{display:none}'
    })
    this.styleSheet.appendChild(document.createTextNode(cssText))
    document.head.appendChild(this.styleSheet)
  },
  pxToRem: function () {
    const style: HTMLStyleElement | null = document.querySelector('#body>style')
    if (style == null) {
      return
    }
    style.innerHTML = replace(style.innerHTML)
  }
}
function replace(s: string) {
  const px = /([0-9]+)px/g
  return s.replace(px, (_: string, p: string) => {
    return (parseInt(p) / 10).toFixed(1) + 'rem'
  })
}
