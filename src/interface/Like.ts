import { Persistence } from './Persistence'

export class Like extends Persistence {
  constructor(public readonly uri: string, public id = '', public content = '') {
    super()
  }

  addcontent(content: string) {
    this.content = content
    this.save()
  }
}
