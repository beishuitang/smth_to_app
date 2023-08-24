import { Persistence } from './Persistence'
import cachedMajiaStore from '@/stores/cachedMajiaStore'

export class CachedMajias extends Persistence {
  constructor(
    public readonly id: string,
    public readonly majias: string[] = [],
    public readonly relativeIDs: string[] = []
  ) {
    super()
  }

  //TODO
  async addMajia(majia: string) {
    if (this.majias.includes(majia)) return
    this.majias.push(majia)
    this.getMajiaUser(majia).addMajia(this.id)
    await this.updateRelative(this.id)
  }
  async delMajia(majia: string) {
    const index = this.majias.indexOf(majia)
    if (index === -1) return
    this.majias.splice(index, 1)
    this.getMajiaUser(majia).delMajia(this.id)
    await this.updateRelative(this.id, majia)
  }
  private async updateRelative(...ids: string[]) {
    let relatives: string[] = []
    for (const id of ids) {
      relatives.push(id)
      const arr = this.getMajiaUser(id).relativeIDs
      relatives = relatives.concat(arr)
    }
    for (const id of relatives) {
      await this.getMajiaUser(id).update()
    }
  }
  private update() {
    this.relativeIDs.length = 0
    this.relativeIDs.push(this.id)
    for (let index = 0; index < this.relativeIDs.length; index++) {
      const id = this.relativeIDs[index]
      const relativeMajias = cachedMajiaStore.get(id).majias
      for (let j = 0; j < relativeMajias.length; j++) {
        const relativeMajia = relativeMajias[j]
        !this.relativeIDs.includes(relativeMajia) && this.relativeIDs.push(relativeMajia)
      }
    }
    this.relativeIDs.shift()
    return this.save()
  }
  private getMajiaUser(id: string) {
    return cachedMajiaStore.get(id)
  }
}
