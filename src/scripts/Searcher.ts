/*
 * Created by Wu Jian Ping on - 2022/07/22.
 */
/*
 * Created by Wu Jian Ping on - 2022/07/22.
 */
import type { Buffer } from 'buffer'

const VectorIndexSize = 8
const VectorIndexCols = 256
const VectorIndexLength = 256 * 256 * (4 + 4)
const SegmentIndexSize = 14
const IP_REGEX = /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/

export class Searcher {
  _buffer: Buffer
  _vectorIndex: Buffer
  constructor(buffer: Buffer) {
    this._buffer = buffer
    this._vectorIndex = this._buffer.subarray(256, 256 + VectorIndexLength)
  }

  getStartEndPtr(idx: number) {
    const sPtr = this._vectorIndex.readUInt32LE(idx)
    const ePtr = this._vectorIndex.readUInt32LE(idx + 4)
    return { sPtr, ePtr }
  }

  getBuffer(offset: number, length: number) {
    return this._buffer.subarray(offset, offset + length)
  }

  search(ip: string) {
    if (!isValidIp(ip)) {
      return { region: null }
      // throw new Error(`IP: ${ip} is invalid`)
    }

    const ps = ip.split('.')
    const i0 = parseInt(ps[0])
    const i1 = parseInt(ps[1])
    const i2 = parseInt(ps[2])
    const i3 = parseInt(ps[3])

    const ipInt = i0 * 256 * 256 * 256 + i1 * 256 * 256 + i2 * 256 + i3
    const idx = i0 * VectorIndexCols * VectorIndexSize + i1 * VectorIndexSize
    const { sPtr, ePtr } = this.getStartEndPtr(idx)
    let l = 0
    let h = (ePtr - sPtr) / SegmentIndexSize
    let result = null
    while (l <= h) {
      const m = (l + h) >> 1
      const p = sPtr + m * SegmentIndexSize
      const buff = this.getBuffer(p, SegmentIndexSize)
      const sip = buff.readUInt32LE(0)
      if (ipInt < sip) {
        h = m - 1
      } else {
        const eip = buff.readUInt32LE(4)
        if (ipInt > eip) {
          l = m + 1
        } else {
          const dataLen = buff.readUInt16LE(8)
          const dataPtr = buff.readUInt32LE(10)
          const data = this.getBuffer(dataPtr, dataLen)
          result = data.toString('utf-8')
          break
        }
      }
    }
    return { region: result }
  }
}

const isValidIp = (ip: string) => {
  return IP_REGEX.test(ip)
}
