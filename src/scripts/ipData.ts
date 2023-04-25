import _ipExtra from './ipExtra.json'
import storage from '@/scripts/storage'
import { Searcher } from './Searcher'
import { Buffer } from 'buffer'
const ipExtra = _ipExtra as { [key: string]: string }
export default {
  buffer: null as Buffer | null,
  searcher: null as Searcher | null,
  init: async function () {
    const blob = await storage.getIpDB()
    if (!blob) return
    const ab = await this.blobToBuffer(blob)
    this.buffer = Buffer.from(ab)
    this.searcher = new Searcher(this.buffer)
  },
  getIpInfo: function (ip: string) {
    if (ip === '') return ''
    ip = ip.replace('*', '1')
    let result = ipExtra[ip]
    if (result === undefined && this.searcher) {
      const info = this.searcher.search(ip).region
      if (info !== null) {
        const arr = info.split('|')
        if (arr[3] !== '0') {
          arr[2] = ''
          arr[3] = arr[3].replace(/市$/, '')
        }
        arr[4] = ''
        result = arr.join('').replace(/中国|0/g, '')
      }
    }
    if (result === undefined) {
      result = ipExtra[ip.replace(/\.[0-9]{1,3}$/, '.1')]
    }
    // result = result ? result : ip
    ipExtra[ip] = result
    return result
  },
  blobToBuffer(blob: Blob) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = function () {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result)
        } else {
          reject()
        }
      }
      reader.readAsArrayBuffer(blob)
    })
  }
}
