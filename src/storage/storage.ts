import type { DataOnly } from '@/common/typeUtils'
import type { fileKey, objectType, obj2tableName, obj2indexName, tableName } from './tableInfo'
import { tableInfo, fileTableName, getTableName } from './tableInfo'

let DB: IDBDatabase
function initDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const idbOpenRequest = indexedDB.open('newsmthScriptDatabase', 1)
    idbOpenRequest.onerror = () => {
      reject('failed to open indexedDB')
    }
    idbOpenRequest.onsuccess = () => {
      DB = idbOpenRequest.result
      resolve(DB)
    }
    idbOpenRequest.onupgradeneeded = (event) => {
      DB = (event.target as IDBOpenDBRequest).result
      if (!DB.objectStoreNames.contains(fileTableName)) {
        DB.createObjectStore(fileTableName)
      }
      Object.entries(tableInfo).forEach(([tableName, info]) => {
        if (!DB.objectStoreNames.contains(tableName)) {
          const store = DB.createObjectStore(tableName, { keyPath: info.keyPath })
          store.createIndex('update_time', 'u')
          info.index.forEach((indexInfo) => {
            store.createIndex(indexInfo.key, indexInfo.key, { unique: indexInfo.unique })
          })
        }
      })
    }
  })
}

function saveFile(data: Blob | ArrayBuffer, key: fileKey) {
  return new Promise((resolve, reject) => {
    const idbRequest = DB.transaction([fileTableName], 'readwrite')
      .objectStore(fileTableName)
      .put(data, key)
    idbRequest.onerror = reject
    idbRequest.onsuccess = resolve
  })
}
function getFile<T>(key: fileKey) {
  return new Promise<T>((resolve, reject) => {
    const idbRequest = DB.transaction([fileTableName]).objectStore(fileTableName).get(key)
    idbRequest.onerror = reject
    idbRequest.onsuccess = function () {
      resolve(idbRequest.result)
    }
  })
}

function save(obj: objectType): Promise<unknown>
function save<T extends objectType>(obj: DataOnly<T>, tableName: obj2tableName<T>): Promise<unknown>
function save<T extends objectType>(obj: objectType | DataOnly<T>, tableName?: obj2tableName<T>) {
  const table = tableName ? tableName : getTableName(obj as objectType)
  return new Promise((resolve, reject) => {
    obj.u = Date.now()
    const idbRequest = DB.transaction([table], 'readwrite').objectStore(table).put(obj)
    idbRequest.onerror = reject
    idbRequest.onsuccess = resolve
  })
}

function get<T extends objectType>(tableName: obj2tableName<T>, key: IDBValidKey) {
  return new Promise<DataOnly<T> | undefined>((resolve, reject) => {
    const idbRequest = DB.transaction([tableName]).objectStore(tableName).get(key)
    idbRequest.onerror = reject
    idbRequest.onsuccess = function () {
      resolve(idbRequest.result)
    }
  })
}

function getByIndexKey<T extends objectType>(
  tableName: obj2tableName<T>,
  index: obj2indexName<T>,
  key: IDBValidKey
) {
  return new Promise<DataOnly<T>[]>((resolve, reject) => {
    const result: DataOnly<T>[] = []
    const transaction = DB.transaction([tableName])
    const idbRequest = transaction
      .objectStore(tableName)
      .index(index)
      .openCursor(IDBKeyRange.only(key))
    idbRequest.onsuccess = function () {
      const cursor = idbRequest.result
      if (cursor) {
        result.push(cursor.value)
        cursor.continue()
      }
    }
    transaction.oncomplete = function () {
      resolve(result)
    }
    transaction.onerror = reject
  })
}

function saveAll<T extends objectType>(objects: DataOnly<T>[], tableName: obj2tableName<T>) {
  return new Promise((resolve, reject) => {
    const idbTransaction = DB.transaction([tableName], 'readwrite')
    const idbObjectStore = idbTransaction.objectStore(tableName)
    objects.forEach((data) => {
      data.u = Date.now()
      idbObjectStore.put(data)
    })
    idbTransaction.oncomplete = resolve
    idbTransaction.onerror = reject
  })
}

function getAll<T extends objectType>(tableName: obj2tableName<T>) {
  return new Promise<DataOnly<T>[]>((resolve, reject) => {
    const idbRequest = DB.transaction([tableName]).objectStore(tableName).getAll()
    idbRequest.onsuccess = function () {
      resolve(idbRequest.result)
    }
    idbRequest.onerror = reject
  })
}

function getAllKeys(tableName: tableName) {
  return new Promise<IDBValidKey[]>((resolve, reject) => {
    const idbRequest = DB.transaction([tableName]).objectStore(tableName).getAllKeys()
    idbRequest.onsuccess = function () {
      resolve(idbRequest.result)
    }
    idbRequest.onerror = reject
  })
}
export default {
  initDB,
  saveFile,
  getFile,
  get,
  getAll,
  getAllKeys,
  getByIndexKey,
  save,
  saveAll
}
