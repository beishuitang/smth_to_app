import { Persistence } from './Persistence'

export class ArticleTags extends Persistence {
  constructor(
    public readonly articleUri: string,
    public id: string = '',
    public tags: { [tagName: string]: number } = {}
  ) {
    super()
  }

  del(tagName: string) {
    delete this.tags[tagName]
    this.save()
  }
  modify(tagName: string, step: number) {
    if (!Object.prototype.hasOwnProperty.call(this.tags, tagName)) this.tags[tagName] = 0
    this.tags[tagName] += step
    this.save()
  }
}
