export interface UsersData {
  [id: string]: UserData
}
const MAX_SCORE = 10
export class UserData {
  id: string
  score = 0
  state = {
    t: 0,
    showUser: true,
    showContent: true,
    showTags: true
  }
  tags: UserTags = {}
  majias: string[] = []
  IPs: string[] = []
  constructor(id: string) {
    this.id = id
  }
  static mergeUserDatas(target: UsersData, newUserDatas: UsersData) {
    for (const id in newUserDatas) {
      if (Object.prototype.hasOwnProperty.call(newUserDatas, id)) {
        const userData = newUserDatas[id]
        if (Object.prototype.hasOwnProperty.call(target, id)) {
          this.mergeUserData(target[id], userData)
        } else {
          target[id] = userData
        }
      }
    }
  }
  static mergeUserData(target: UserData, newUserData: UserData) {
    if (target.id !== newUserData.id) {
      console.error('can not merge UserData with diffent IDs')
    }
    // UserData.mergeTags(target, newUserData.tags)
    UserData.mergeUserState(target, newUserData)
  }
  static mergeUserState(target: UserData, newUserData: UserData) {
    if (target.state.t < newUserData.state.t) {
      Object.assign(target.state, newUserData.state)
    }
  }
  static mergeTags(target: UserData, tags: UserTags) {
    for (const tagName in tags) {
      if (Object.prototype.hasOwnProperty.call(tags, tagName)) {
        const tag = tags[tagName]
        UserData.addSingleTag(target, tagName, tag)
      }
    }
  }
  static addSingleTag(target: UserData, tagName: string, tag: UserTag) {
    for (const articleUri in tag.tagUris) {
      if (Object.prototype.hasOwnProperty.call(tag.tagUris, articleUri)) {
        const step = tag.tagUris[articleUri]
        UserData.addModify(target, tagName, step, articleUri)
      }
    }
  }
  static addModify(target: UserData, tagName: string, step: number, articleUri: string) {
    if (!Object.prototype.hasOwnProperty.call(target.tags, tagName)) {
      target.tags[tagName] = { score: 0, tagUris: {} }
    }
    if (!Object.prototype.hasOwnProperty.call(target.tags[tagName].tagUris, articleUri)) {
      target.tags[tagName].tagUris[articleUri] = 0
    }
    const tagUris = target.tags[tagName].tagUris
    const tempScore = tagUris[articleUri] + step
    let diff = step
    if (tempScore > MAX_SCORE) {
      diff = MAX_SCORE - tagUris[articleUri]
      tagUris[articleUri] = MAX_SCORE
    } else if (tempScore < -MAX_SCORE) {
      diff = -tagUris[articleUri] - MAX_SCORE
      tagUris[articleUri] = -MAX_SCORE
    } else if (tempScore === 0) {
      this.del(target, tagName, articleUri)
    } else {
      tagUris[articleUri] = tempScore
    }
    target.tags[tagName].score += diff
    target.score += diff
    return target
  }
  static del(target: UserData, tagName: string, articleUri: string) {
    const tagUris = target.tags[tagName].tagUris
    delete tagUris[articleUri]
    if (Reflect.ownKeys(tagUris).length === 0) {
      delete target.tags[tagName]
    }
  }
}
export interface UserTags {
  [tagName: string]: UserTag
}
export interface UserTag {
  score: number
  tagUris: TagUriAndScore
}
export interface TagUriAndScore {
  [tagUri: string]: number
}
