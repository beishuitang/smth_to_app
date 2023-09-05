import { Article } from '@/interface/Article'
import { ArticleTags } from '@/interface/ArticleTags'
import { UserIPs } from '@/interface/UserIPs'
import { Topic } from '@/interface/Topic'
import { Img } from '@/interface/Img'
import { CachedMajias } from '@/interface/CachedMajias'
import { UserState } from '@/interface/UserState'
import { CachedTags } from '@/interface/CachedTags'
import { Majia } from '@/interface/Majia'
import { Like } from '@/interface/Like'
import type { ObjectStore } from '@/stores/ObjectStore'
import articleStore from '@/stores/articleStore'
import cachedMajiaStore from '@/stores/cachedMajiaStore'
import cachedTagStore from '@/stores/cachedTagStore'
import imgStore from '@/stores/imgStore'
import likeStore from '@/stores/likeStore'
import majiaStore from '@/stores/majiaStore'
import stateStore from '@/stores/stateStore'
import tagStore from '@/stores/tagStore'
import topicStore from '@/stores/topicStore'
import userIPStore from '@/stores/userIPStore'

const tableInfo = <const>{
  stateTable: {
    comment: '名单',
    class: UserState,
    keyPath: 'id',
    index: []
  },
  articleTable: {
    comment: '文章',
    class: Article,
    keyPath: 'articleUri',
    index: [
      {
        key: 'id',
        unique: false
      }
    ]
  },
  tagTable: {
    comment: '标签',
    class: ArticleTags,
    keyPath: 'articleUri',
    index: [
      {
        key: 'id',
        unique: false
      }
    ]
  },
  likeTable: {
    comment: 'like',
    class: Like,
    keyPath: 'uri',
    index: [
      {
        key: 'id',
        unique: false
      }
    ]
  },
  topicTable: {
    comment: '浏览记录',
    class: Topic,
    keyPath: 'topicUri',
    index: []
  },
  imgTable: {
    comment: '图片',
    class: Img,
    keyPath: 'imgUri',
    index: []
  },
  ipTable: {
    comment: 'ip统计',
    class: UserIPs,
    keyPath: 'id',
    index: []
  },
  majiaTable: {
    comment: '马甲',
    class: Majia,
    keyPath: 'pair',
    index: []
  },
  cachedMajiaTable: {
    comment: '马甲缓存',
    class: CachedMajias,
    keyPath: 'id',
    index: []
  },
  cachedTagTable: {
    comment: '标签缓存',
    class: CachedTags,
    keyPath: 'id',
    index: []
  }
}

const storeInfo: {
  [key in tableName]: ObjectStore<key>
} = <const>{
  stateTable: stateStore,
  articleTable: articleStore,
  tagTable: tagStore,
  likeTable: likeStore,
  topicTable: topicStore,
  imgTable: imgStore,
  ipTable: userIPStore,
  majiaTable: majiaStore,
  cachedMajiaTable: cachedMajiaStore,
  cachedTagTable: cachedTagStore
}
const fileTableName = 'fileTable'
const fileKeys = <const>{
  ipDB: 'ip'
}

Object.freeze(tableInfo)
Object.freeze(storeInfo)
Object.freeze(fileKeys)

type tableInfo = typeof tableInfo
type tableName = keyof tableInfo
type objectType = InstanceType<tableInfo[tableName]['class']>
type fileKey = (typeof fileKeys)[keyof typeof fileKeys]

type tableName2obj<T extends tableName> = InstanceType<tableInfo[T]['class']>
type tableName2index<T extends tableName> = tableInfo[T]['index'][number]['key']

function getTableName(obj: objectType) {
  const entries = Object.entries(tableInfo)
  for (let i = 0; i < entries.length; i++) {
    const [tableName, info] = entries[i]
    if (obj instanceof info.class) {
      return tableName as tableName
    }
  }
  throw new Error('对象类型错误')
}
export { tableInfo, storeInfo, fileTableName, fileKeys, getTableName }
export type { objectType, tableName, tableName2obj, tableName2index, fileKey }
