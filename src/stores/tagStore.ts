import type { DataOnly } from '@/common/typeUtils'
import type { ArticleTags } from '@/interface/ArticleTags'
import { LazyStore } from '@/stores/ObjectStore'
import cachedTagStore from './cachedTagStore'

class TagStore extends LazyStore<ArticleTags> {
  protected userCache: Record<string, Record<string, ArticleTags>> = {}
  async getByIdAndUri(id: string, uri: string) {
    const articleTags = await this.get(uri)
    if (articleTags.id === '') articleTags.id = id
    else if (articleTags.id !== id) {
      throw new Error('文章id和uri不一致!!!')
    }
    this.addToUserCache(articleTags)
    return articleTags
  }
  getByID = async (id: string) => {
    if (!Object.prototype.hasOwnProperty.call(this.userCache, id)) this.userCache[id] = {}
    const arr = await this.getByIndexKey('id', id)
    arr.forEach((articleTags) => {
      this.addRecord(articleTags.articleUri, articleTags)
      this.addToUserCache(articleTags)
    })
    return this.userCache[id]
  }
  protected addToUserCache(articleTags: ArticleTags) {
    const [id, uri] = [articleTags.id, articleTags.articleUri]
    if (!Object.prototype.hasOwnProperty.call(this.userCache, id)) this.userCache[id] = {}
    if (!Object.prototype.hasOwnProperty.call(this.userCache[id], uri))
      this.userCache[id][uri] = articleTags
  }
  protected afterImport(cache: DataOnly<ArticleTags>[]) {
    return cachedTagStore.importArticleTags(cache)
  }
}
export default new TagStore('tagTable') as Omit<TagStore, 'get'>
