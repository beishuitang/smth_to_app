import { Persistence } from './Persistence'

export class Article extends Persistence {
  constructor(public readonly articleUri: string, public readonly content: string[] = []) {
    super()
  }

  addContent(content: string) {
    if (this.content.includes(content)) return
    this.content.push(content)
    this.save()
  }
}
