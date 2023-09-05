import cssUtils from '@/scripts/cssUtils'
import { Persistence } from './Persistence'
export class UserState extends Persistence {
  static readonly hideUser = 0b1
  static readonly hideTag = 0b10
  constructor(public readonly id: string, private state = 0) {
    super()
  }

  showUser() {
    return (UserState.hideUser & this.state) === 0
  }
  showTag() {
    return (UserState.hideTag & this.state) === 0
  }
  switchShowUser() {
    this.state ^= UserState.hideUser
    cssUtils.updateBlacklistStyle()
    this.save()
  }
  switchShowTag() {
    this.state ^= UserState.hideTag
    this.save()
  }
}
