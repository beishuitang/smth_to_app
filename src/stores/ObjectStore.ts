import { reactive } from 'vue'
import { tableInfo } from '@/storage/tableInfo'
import storage from '@/storage/storage'
import type { tableName2obj, tableName, tableName2index } from '@/storage/tableInfo'
import type { DataOnly } from '@/common/typeUtils'
import { info } from '@/scripts/commonUtils'

export abstract class ObjectStore<T extends tableName> {
  readonly record: Record<string, tableName2obj<T>> = reactive({})
  abstract init(): void | Promise<void>
  abstract get(key: string): tableName2obj<T> | Promise<tableName2obj<T>>
  protected abstract updateRecord(obj: DataOnly<tableName2obj<T>>): void
  abstract exportAll(): tableName2obj<T>[] | Promise<tableName2obj<T>[]>
  async importAll(objs: DataOnly<tableName2obj<T>>[]) {
    await this.beforeImport()
    const cache: DataOnly<tableName2obj<T>>[] = []
    for (let index = 0; index < objs.length; index++) {
      const obj = objs[index]
      if (await this.checkToImport(obj)) {
        this.updateRecord(obj)
        cache.push(obj)
      }
    }
    await storage.saveAll(cache, this.tableName)
    await this.afterImport(cache)
  }

  protected async beforeImport() {}
  protected async afterImport(cache: DataOnly<tableName2obj<T>>[]) {
    console.log('完成导入' + this.tableName + '数据' + cache.length + '条')
    info(2, '导入' + this.tableName + '数据' + cache.length + '条')
  }
  protected async checkToImport(obj: DataOnly<tableName2obj<T>>) {
    const obj0 = await this.get(this.getRecordKey(obj))
    return obj.m > obj0.m
  }
  protected addRecord(recordKey: string, obj: tableName2obj<T>) {
    this.record[recordKey] = obj
  }
  protected wrap(data: DataOnly<tableName2obj<T>>) {
    const result = this.creatNew(this.getRecordKey(data))
    Object.assign(result, data)
    return result
  }
  protected creatNew(key: string) {
    return new tableInfo[this.tableName].class(key) as tableName2obj<T>
  }
  protected getRecordKey(data: tableName2obj<T> | DataOnly<tableName2obj<T>>) {
    const key = tableInfo[this.tableName].keyPath as keyof (
      | tableName2obj<T>
      | DataOnly<tableName2obj<T>>
    )
    return data[key] as string
  }
  protected async fetchOne(key: string) {
    await storage.waitForDB()
    const item = await storage.get(this.tableName, key)
    const result = item ? this.wrap(item) : this.creatNew(key)
    return result
  }
  protected async fetchAll() {
    await storage.waitForDB()
    const arr = await storage.getAll(this.tableName)
    return arr.map((data) => this.wrap(data))
  }
  protected getByIndexKey = async (keyName: tableName2index<T>, key: string) => {
    await storage.waitForDB()
    const arr = await storage.getByIndexKey(this.tableName, keyName, key)
    return arr.map((data) => this.wrap(data))
  }
  constructor(protected readonly tableName: T) {}
}
export class LazyStore<T extends tableName> extends ObjectStore<T> {
  protected updateRecord(obj: DataOnly<tableName2obj<T>>): void {
    delete this.record[this.getRecordKey(obj)]
  }
  exportAll() {
    return this.fetchAll()
  }
  private pending = new Set<string>()
  init = () => {}
  async get(key: string) {
    if (this.pending.has(key)) {
      return new Promise<tableName2obj<T>>((resolve, reject) => {
        setTimeout(() => {
          this.get(key)
            .then((value) => {
              resolve(value)
            })
            .catch(reject)
        }, 10)
      })
    } else {
      if (!Object.prototype.hasOwnProperty.call(this.record, key)) {
        this.pending.add(key)
        const obj = await this.fetchOne(key)
        this.addRecord(key, obj)
        this.pending.delete(key)
      }
      return this.record[key]
    }
  }
}
export class EagerStore<T extends tableName> extends ObjectStore<T> {
  protected updateRecord(obj: DataOnly<tableName2obj<T>>): void {
    this.record[this.getRecordKey(obj)] = this.wrap(obj)
  }
  exportAll() {
    return Object.values(this.record)
  }
  async init() {
    const objArr = await this.fetchAll()
    for (const data of objArr) {
      this.addRecord(this.getRecordKey(data), data)
    }
  }
  get(key: string) {
    if (!Object.prototype.hasOwnProperty.call(this.record, key)) {
      this.addRecord(key, this.creatNew(key))
    }
    return this.record[key]
  }
}
