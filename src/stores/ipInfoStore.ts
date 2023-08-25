import storage from '@/storage/storage'
import { fileKeys } from '@/storage/tableInfo'
import { Searcher } from '@/common/Searcher'
import { Buffer } from 'buffer'
const ipCache = { '': '未知id' } as { [key: string]: string }

let buffer = null as Buffer | null
let searcher = null as Searcher | null
export default {
  init: async function () {
    const ab = await storage.getFile<ArrayBuffer>(fileKeys.ipDB)
    if (!ab) return
    buffer = Buffer.from(ab)
    searcher = new Searcher(buffer)
  },
  getIpInfo: function (ip: string) {
    ip = ip.replace('*', '1')
    if (!Object.prototype.hasOwnProperty.call(ipCache, ip) && searcher) {
      const info = searcher.search(ip).region
      if (info !== null) {
        const arr = info.split('|')
        if (arr[3] !== '0') {
          arr[2] = ''
          arr[3] = arr[3].replace(/市$/, '')
        }
        arr[4] = ''
        ipCache[ip] = arr.join('').replace(/中国|0/g, '')
      } else {
        ipCache[ip] = ''
      }
    }
    return ipCache[ip]
  }
}
