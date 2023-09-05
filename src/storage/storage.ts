import type { DataOnly } from '@/common/typeUtils'
import type { fileKey, tableName, tableName2obj, tableName2index } from './tableInfo'
import { tableInfo, fileTableName, getTableName } from './tableInfo'
import { toRaw } from 'vue'

let DB: IDBDatabase
let ready = false
function waitForDB() {
  if (ready) return
  else
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        await waitForDB()
        resolve()
      }, 10)
    })
}
function initDB() {
  ready = false
  return new Promise<IDBDatabase>((resolve, reject) => {
    const idbOpenRequest = indexedDB.open('newsmthScriptDatabase', 1)
    idbOpenRequest.onerror = () => {
      reject('failed to open indexedDB')
    }
    idbOpenRequest.onsuccess = () => {
      DB = idbOpenRequest.result
      ready = true
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

function save<T extends tableName>(obj: tableName2obj<T>): Promise<unknown>
function save<T extends tableName>(obj: DataOnly<tableName2obj<T>>, tableName: T): Promise<unknown>
function save<T extends tableName>(
  obj: tableName2obj<T> | DataOnly<tableName2obj<T>>,
  tableName?: T
) {
  const table = tableName ? tableName : getTableName(obj as tableName2obj<T>)
  return new Promise((resolve, reject) => {
    obj.u = Date.now()
    const idbRequest = DB.transaction([table], 'readwrite').objectStore(table).put(toRaw(obj))
    idbRequest.onerror = reject
    idbRequest.onsuccess = resolve
  })
}

function get<T extends tableName>(tableName: T, key: IDBValidKey) {
  return new Promise<DataOnly<tableName2obj<T>> | undefined>((resolve, reject) => {
    const idbRequest = DB.transaction([tableName]).objectStore(tableName).get(key)
    idbRequest.onerror = reject
    idbRequest.onsuccess = function () {
      resolve(idbRequest.result)
    }
  })
}

function getByIndexKey<T extends tableName>(
  tableName: T,
  index: tableName2index<T>,
  key: IDBValidKey
) {
  return new Promise<DataOnly<tableName2obj<T>>[]>((resolve, reject) => {
    const result: DataOnly<tableName2obj<T>>[] = []
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

function saveAll<T extends tableName>(objects: DataOnly<tableName2obj<T>>[], tableName: T) {
  return new Promise((resolve, reject) => {
    const idbTransaction = DB.transaction([tableName], 'readwrite')
    const idbObjectStore = idbTransaction.objectStore(tableName)
    objects.forEach((data) => {
      data.u = Date.now()
      idbObjectStore.put(toRaw(data))
    })
    idbTransaction.oncomplete = resolve
    idbTransaction.onerror = reject
  })
}

function getAll<T extends tableName>(tableName: T) {
  return new Promise<DataOnly<tableName2obj<T>>[]>((resolve, reject) => {
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
  waitForDB,
  saveFile,
  getFile,
  get,
  getAll,
  getAllKeys,
  getByIndexKey,
  save,
  saveAll
}
