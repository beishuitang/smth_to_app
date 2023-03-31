import _ipExtra from './ipExtra.json'
const ipExtra = _ipExtra as { [key: string]: string }
export default {
  getIpInfo: function (ip: string) {
    if (ip === '') return ''
    ip = ip.replace('*', '1')
    let result = ipExtra[ip]
    if (result === undefined && window.Android) {
      const info = window.Android.getIpInfo(ip)
      if (info !== 'null') {
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
    result = result ? result : ip
    ipExtra[ip] = result
    return result
  }
}
