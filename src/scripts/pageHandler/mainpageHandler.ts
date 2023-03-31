import smthScriptConfig from '../smthScriptConfig'
export default {
  sections: smthScriptConfig.mainpageConfig.section,
  handle(bodyElement: Element) {
    if (smthScriptConfig.onMobile !== true) return
    const links = bodyElement.querySelectorAll<HTMLAnchorElement>('#slider>.pic>a')
    links.forEach((link) => {
      const div = document.createElement('div')
      div.classList.add('single-line')
      div.innerText = link.title
      link.appendChild(div)
    })
  }
}
