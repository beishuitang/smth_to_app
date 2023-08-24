import type { ArticleTags } from './ArticleTags'
import { Persistence } from './Persistence'

export class CachedTags extends Persistence {
  constructor(
    public readonly id: string,
    private _score = 0,
    private _tags: { [tagName: string]: number } = {}
  ) {
    super()
  }

  get score() {
    return this._score
  }
  get tags() {
    return this._tags
  }
  modify(tagName: string, step: number, save = true) {
    const tags = this._tags
    if (!Object.prototype.hasOwnProperty.call(tags, tagName)) {
      tags[tagName] = 0
    }
    tags[tagName] += step
    this._score += step
    if (save) this.save()
  }
  del(tagName: string, save = true) {
    if (this._tags[tagName] === 0) {
      delete this._tags[tagName]
      if (save) this.save()
    }
  }
  recompute(datas: ArticleTags[], save = true) {
    this._tags = {}
    datas.forEach((data) => {
      Object.entries(data.tags).forEach(([tagName, score]) => {
        this.modify(tagName, score)
      })
    })
    if (save) this.save()
    return this
  }
}
