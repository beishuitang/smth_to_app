import { reactive } from 'vue'
import { tableInfo } from '@/storage/tableInfo'
import storage from '@/storage/storage'
import type { obj2tableName, objectType, obj2indexName } from '@/storage/tableInfo'
import type { DataOnly } from '@/common/typeUtils'

export abstract class ObjectStore<T extends objectType> {
  readonly record: Record<string, T> = reactive({})
  abstract init(): void | Promise<void>
  abstract get(key: string): T | Promise<T>
  protected abstract updateRecord(obj: DataOnly<T>): void
  abstract exportAll(): T[] | Promise<T[]>
  async importAll(objs: DataOnly<T>[]) {
    await this.beforeImport()
    const cache: DataOnly<T>[] = []
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
  protected async afterImport(cache: DataOnly<T>[]) {
    console.log('完成导入' + this.tableName + '数据' + cache.length + '条')
  }
  protected async checkToImport(obj: DataOnly<T>) {
    const obj0 = await this.get(this.getRecordKey(obj))
    return obj.m > obj0.m
  }
  protected addRecord(recordKey: string, obj: T) {
    this.record[recordKey] = obj
  }
  protected wrap(data: DataOnly<T>) {
    const result = this.creatNew(this.getRecordKey(data))
    Object.assign(result, data)
    return result
  }
  protected creatNew(key: string) {
    return new tableInfo[this.tableName].class(key) as T
  }
  protected getRecordKey(data: T | DataOnly<T>) {
    const key = tableInfo[this.tableName].keyPath as keyof (T | DataOnly<T>)
    return data[key] as string
  }
  protected async fetchOne(key: string) {
    const item = await storage.get(this.tableName, key)
    const result = item ? this.wrap(item) : this.creatNew(key)
    return result
  }
  protected async fetchAll() {
    const arr = await storage.getAll(this.tableName)
    return arr.map((data) => this.wrap(data))
  }
  protected getByIndexKey = async (keyName: obj2indexName<T>, key: string) => {
    const arr = await storage.getByIndexKey(this.tableName, keyName, key)
    return arr.map((data) => this.wrap(data))
  }
  constructor(protected tableName: obj2tableName<T>) {}
}
export class LazyStore<T extends objectType> extends ObjectStore<T> {
  protected updateRecord(obj: DataOnly<T>): void {
    delete this.record[this.getRecordKey(obj)]
  }
  exportAll() {
    return this.fetchAll()
  }
  private pending = new Set<string>()
  init = () => {}
  async get(key: string) {
    if (this.pending.has(key)) {
      return new Promise<T>((resolve, reject) => {
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
export class EagerStore<T extends objectType> extends ObjectStore<T> {
  protected updateRecord(obj: DataOnly<T>): void {
    this.record[this.getRecordKey(obj)] = this.wrap(obj)
  }
  exportAll() {
    return Object.values(this.record)
  }
  init = async () => {
    const objArr = await this.fetchAll()
    objArr.forEach((data) => {
      this.addRecord(this.getRecordKey(data), data)
    })
  }
  get(key: string) {
    if (!Object.prototype.hasOwnProperty.call(this.record, key)) {
      this.addRecord(key, this.creatNew(key))
    }
    return this.record[key]
  }
}
