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

  constructor(id1: string, id2: string, private _state = false) {
    super()
    this.pair = Majia.createPairID(id1, id2)
  }

  readonly pair
  get state() {
    return this._state
  }

  getIDs(majia: DataOnly<Majia> = this): [string, string] {
    return Majia.getIDs(majia)
  }
  enable() {
    this._state = true
    this.save()
  }
  disable() {
    this._state = false
    this.save()
  }
}
