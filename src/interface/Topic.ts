import { Persistence } from './Persistence'

export class Topic extends Persistence {
  constructor(public readonly topicUri: string, public p = 1, public pos = -1, public scrollY = 0) {
    super()
  }

  update(part: Partial<Topic>) {
    Object.assign(this, part)
    this.save()
  }
}
