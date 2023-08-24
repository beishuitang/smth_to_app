import { Persistence } from './Persistence'

export class Img extends Persistence {
  constructor(public readonly imgUri: string, public imgBlob?: Blob) {
    super()
    if (imgBlob) this.checkBlob(imgBlob)
  }

  addImgData(blob: Blob) {
    if (this.imgBlob) return
    this.checkBlob(blob)
    this.imgBlob = blob
    this.save()
  }
  private checkBlob(blob: Blob) {
    if (!blob.type.startsWith('image/')) throw new Error('data is not type of image')
  }
}
