import type { Article } from '@/interface/Article'
import { LazyStore } from '@/stores/ObjectStore'

export default new LazyStore<Article>('articleTable')
