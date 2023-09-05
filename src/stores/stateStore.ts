import cssUtils from '@/scripts/cssUtils'
import { EagerStore } from '@/stores/ObjectStore'

class StateStore extends EagerStore<'stateTable'> {
  getBlacklist() {
    const list: string[] = []
    Object.values(this.record).forEach((state) => {
      if (!state.showUser()) {
        list.push(state.id)
      }
    })
    return list
  }
  async init() {
    await super.init()
    cssUtils.updateBlacklistStyle()
  }
}

export default new StateStore('stateTable')
