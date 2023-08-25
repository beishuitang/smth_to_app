import { LazyStore } from '@/stores/ObjectStore'
import type { UserIPs } from '@/interface/UserIPs'
import type { DataOnly } from '@/common/typeUtils'

class UserIPStore extends LazyStore<UserIPs> {
  protected async checkToImport(obj: DataOnly<UserIPs>) {
    const obj0 = await this.get(obj.id)
    const s = Object.values(obj.IPs).reduce((n0, n1) => {
      return n0 + n1
    })
    const s0 = Object.values(obj0.IPs).reduce((n0, n1) => {
      return n0 + n1
    })
    return s > s0
  }
}
export default new UserIPStore('ipTable')
