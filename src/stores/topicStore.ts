import { LazyStore } from '@/stores/ObjectStore'

class TopicStore extends LazyStore<'topicTable'> {
  readonly topicReg = /(article\/[\w|.]+\/\d+)(\?p=(\d+))?$/
  constructor() {
    super('topicTable')
  }
  getTopicUri(href: string) {
    const m = href.match(this.topicReg)
    return m ? m[1] : null
  }
  onHashChange(e: HashChangeEvent) {
    const m = e.oldURL.match(this.topicReg)
    if (!m) return
    const m1 = e.newURL.match(m[1])
    if (m1) return
    const a_names = document.querySelectorAll<HTMLAnchorElement>('#body>.b-content>a')
    if (a_names.length == 0) {
      return
    }
    const pos = parseInt(a_names[a_names.length - 1].name.substr(1))
    const p = parseInt(m[3] ? m[3] : '1')
    const preEl = document.querySelector<HTMLElement>(`a[name=a${(p - 1) * 10}]`)
    const offset = preEl ? preEl.offsetTop : 0
    const topicData = {
      p: p,
      pos: pos,
      scrollY: window.scrollY - offset
    }
    this.get(m[1]).then((topic) => {
      topic.update(topicData)
    })
  }
}
export default new TopicStore()
