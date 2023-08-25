import type { DataOnly } from '@/common/typeUtils'
import { Persistence } from './Persistence'

export class Majia extends Persistence {
  private static separator = '|'
  static createPairID(id1: string, id2: string) {
    return id1 < id2 ? id1 + this.separator + id2 : id2 + this.separator + id1
  }
  static getIDs(majia: DataOnly<Majia>): [string, string] {
    const arr = majia.pair.split(Majia.separator)
    if (arr.length == 2) return arr as [string, string]
    else throw new Error('id格式错误')
  }

  constructor(pair: string)
  constructor(id1: string, id2: string)
  constructor(key: string, id2?: string) {
    super()
    this.pair = id2 ? Majia.createPairID(key, id2) : key
  }

  readonly pair
  public state = false

  getIDs(majia: DataOnly<Majia> = this): [string, string] {
    return Majia.getIDs(majia)
  }
  enable() {
    this.state = true
    this.save()
  }
  disable() {
    this.state = false
    this.save()
  }
}
