import type { DataOnly } from '@/common/typeUtils'
import type { ArticleTags } from '@/interface/ArticleTags'
import type { CachedTags } from '@/interface/CachedTags'
import { EagerStore } from '@/stores/ObjectStore'
import tagStore from './tagStore'
import storage from '@/storage/storage'

class CachedTagStore extends EagerStore<CachedTags> {
  async importArticleTags(datas: DataOnly<ArticleTags>[]) {
    const cache: CachedTags[] = []
    const IDs: string[] = []
    for (let index = 0; index < datas.length; index++) {
      const id = datas[index].id
      if (!IDs.includes(id)) {
        IDs.push(id)
        const records = await tagStore.getByID(id)
        const tags = this.get(id).recompute(Object.values(records), false)
        cache.push(tags)
      }
    }
    await storage.saveAll(cache, this.tableName)
  }
}
export default new CachedTagStore('cachedTagTable')
