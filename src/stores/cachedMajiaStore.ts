import { EagerStore } from '@/stores/ObjectStore'
import { Majia } from '@/interface/Majia'
import type { DataOnly } from '@/common/typeUtils'
import { info } from '@/scripts/commonUtils'

class CachedMajiaStore extends EagerStore<'cachedMajiaTable'> {
  async importMajias(datas: DataOnly<Majia>[]) {
    for (let index = 0; index < datas.length; index++) {
      const majia = datas[index]
      const [id1, id2] = Majia.getIDs(majia)
      const cachedMajias = this.get(id1)
      info(1, `导入${id1}马甲`)
      majia.state ? await cachedMajias.addMajia(id2) : await cachedMajias.delMajia(id2)
    }
  }
}
export default new CachedMajiaStore('cachedMajiaTable')
