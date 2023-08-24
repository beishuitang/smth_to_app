import { Article } from '@/interface/Article'
import { ArticleTags } from '@/interface/ArticleTags'
import { UserIPs } from '@/interface/UserIPs'
import { Topic } from '@/interface/Topic'
import { Img } from '@/interface/Img'
import { CachedMajias } from '@/interface/CachedMajias'
import { UserState } from '@/interface/UserState'
import { CachedTags } from '@/interface/CachedTags'
import { Majia } from '@/interface/Majia'
import type { DataOnly } from '@/common/typeUtils'

const tableInfo = <const>{
  stateTable: {
    class: UserState,
    keyPath: 'id',
    index: []
  },
  articleTable: {
    class: Article,
    keyPath: 'articleUri',
    index: []
  },
  tagTable: {
    class: ArticleTags,
    keyPath: 'articleUri',
    index: [
      {
        key: 'id',
        unique: false
      }
    ]
  },
  topicTable: {
    class: Topic,
    keyPath: 'topicUri',
    index: []
  },
  imgTable: {
    class: Img,
    keyPath: 'imgUri',
    index: []
  },
  ipTable: {
    class: UserIPs,
    keyPath: 'id',
    index: []
  },
  majiaTable: {
    class: Majia,
    keyPath: 'pair',
    index: []
  },
  cachedMajiaTable: {
    class: CachedMajias,
    keyPath: 'id',
    index: []
  },
  cachedTagTable: {
    class: CachedTags,
    keyPath: 'id',
    index: []
  }
}

const fileTableName = 'fileTable'
const fileKeys = <const>{
  ipDB: 'ip'
}

Object.freeze(tableInfo)
Object.freeze(fileKeys)

type tableInfo = typeof tableInfo
type tableName = keyof tableInfo
type objectType = InstanceType<tableInfo[tableName]['class']>
type dataType = DataOnly<objectType>
type fileKey = (typeof fileKeys)[keyof typeof fileKeys]

type obj2tableName<T extends objectType> = {
  [K in tableName]: InstanceType<tableInfo[K]['class']> extends T ? K : never
}[tableName]
type obj2indexName<T extends objectType> = {
  [K in tableName]: InstanceType<tableInfo[K]['class']> extends T ? tableInfo[K]['index'] : never
}[tableName][number]['key']

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
export { tableInfo, fileTableName, fileKeys, getTableName }
export type { objectType, dataType, tableName, obj2tableName, obj2indexName, fileKey }
