import type { objectType } from '@/storage/tableInfo'
import storage from '@/storage/storage'

export abstract class Persistence {
  m = 0
  u = 0
  protected save() {
    this.m = Date.now()
    return storage.save(this as unknown as objectType)
  }
}
