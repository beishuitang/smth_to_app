import { EagerStore } from '@/stores/ObjectStore'
import type { CachedMajias } from '@/interface/CachedMajias'
import { Majia } from '@/interface/Majia'
import type { DataOnly } from '@/common/typeUtils'

class CachedMajiaStore extends EagerStore<CachedMajias> {
  async importMajias(datas: DataOnly<Majia>[]) {
    for (let index = 0; index < datas.length; index++) {
      const majia = datas[index]
      const [id1, id2] = Majia.getIDs(majia)
      const cachedMajias = this.get(id1)
      if (cachedMajias.m < majia.m) {
        majia.state ? await cachedMajias.addMajia(id2) : await cachedMajias.delMajia(id2)
      }
    }
  }
}
export default new CachedMajiaStore('cachedMajiaTable')
