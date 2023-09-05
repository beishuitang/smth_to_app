import { LazyStore } from '@/stores/ObjectStore'
import { Majia } from '@/interface/Majia'
import type { DataOnly } from '@/common/typeUtils'
import cachedMajiaStore from './cachedMajiaStore'

class MajiaStore extends LazyStore<'majiaTable'> {
  protected afterImport(cache: DataOnly<Majia>[]) {
    super.afterImport(cache)
    return cachedMajiaStore.importMajias(cache)
  }
  getByID(id1: string, id2: string) {
    return this.get(Majia.createPairID(id1, id2))
  }
  get(key: string): Promise<Majia> {
    throw new Error('不能使用get方法')
  }
}
export default new MajiaStore('majiaTable')
