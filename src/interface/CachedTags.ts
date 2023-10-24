import type { ArticleTags } from './ArticleTags'
import { Persistence } from './Persistence'

export class CachedTags extends Persistence {
  constructor(
    public readonly id: string,
    public score = 0,
    public tags: { [tagName: string]: number } = {}
  ) {
    super()
  }

  modify(tagName: string, step: number, save = true) {
    const tags = this.tags
    if (!Object.prototype.hasOwnProperty.call(tags, tagName)) {
      tags[tagName] = 0
    }
    tags[tagName] += step
    this.score += step
    if (save) this.save()
  }
  del(tagName: string, save = true) {
    if (this.tags[tagName] === 0) {
      delete this.tags[tagName]
      if (save) this.save()
    }
  }
  recompute(datas: ArticleTags[], save = true) {
    this.tags = {}
    datas.forEach((data) => {
      Object.entries(data.tags).forEach(([tagName, score]) => {
        this.modify(tagName, score)
      })
    })
    this.score = Object.values(this.tags).reduce(function (prev, curr) {
      return prev + curr
    }, 0)
    if (save) this.save()
    return this
  }
}
