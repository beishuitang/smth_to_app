import type { DataOnly } from '@/common/typeUtils'
import type { Img } from '@/interface/Img'
import storage from '@/storage/storage'
import { LazyStore } from '@/stores/ObjectStore'

class ImgStore extends LazyStore<'imgTable'> {
  private keys: IDBValidKey[] = []
  protected async beforeImport() {
    this.keys = await storage.getAllKeys(this.tableName)
  }
  protected async checkToImport(obj: DataOnly<Img>) {
    return !this.keys.includes(obj.imgUri)
  }
}
export default new ImgStore('imgTable')
