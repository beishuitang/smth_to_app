import { LazyStore } from '@/stores/ObjectStore'
import { Majia } from '@/interface/Majia'
import type { DataOnly } from '@/common/typeUtils'
import cachedMajiaStore from './cachedMajiaStore'

class MajiaStore extends LazyStore<'majiaTable'> {
  protected afterImport(cache: DataOnly<Majia>[]) {
    super.afterImport(cache)
    return cachedMajiaStore.importMajias(cache)
  }
  get(key: string): Promise<Majia>
  get(id1: string, id2: string): Promise<Majia>
  get(str: string, id2?: string): Promise<Majia> {
    const pair = id2 ? Majia.createPairID(str, id2) : str
    return super.get(pair)
  }
}
export default new MajiaStore('majiaTable')
