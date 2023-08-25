import { Img } from '@/interface/Img'
import imgStore from './stores/imgStore'
import type { DataOnly } from './common/typeUtils'
export default {
  init: function () {
    window.addEventListener('message', receiveMessage, false)
    if (hostType === 'static') {
      win = window.opener
      win?.postMessage({ act: 'ready' }, 'https://www.newsmth.net')
    }
  },
  openUrl: async function (urls: string[]) {
    if (urls.length === 0) return
    for (let index = 0; index < urls.length; index++) {
      const url = urls[index]
      const uri = url.replace(/\/(large)|(middle)|(small)$/, '')
      const result = await imgStore.get(uri)
      if (!result.imgBlob) uris.push(uri)
    }
    if (!win?.window && uris.length > 0) {
      win = window.open(uris[0])
      window.focus()
    }
  }
}
const uris: string[] = []
const hostname = location.hostname
const hostType = hostname.split('.')[0] as 'www' | 'static'
let win: null | Window = null
async function fetchAndSendImgs(uris: string[]) {
  const imgs: DataOnly<Img>[] = []
  for (let index = 0; index < uris.length; index++) {
    const uri = uris[index]
    const blob = await (await fetch(location.pathname)).blob()
    imgs.push(new Img(uri, blob))
  }
  win?.postMessage({ act: 'imgs', imgs: imgs }, '*')
}

function saveImgs(imgs: DataOnly<Img>[]) {
  imgs.forEach((imgData) => {
    imgStore.get(imgData.imgUri).then((img) => {
      img.addImgData(imgData.imgBlob!)
    })
  })
  uris.length = 0
  win?.postMessage({ act: 'close' }, '*')
}
function receiveMessage(ev: MessageEvent<Partial<message>>) {
  const mes = {
    ...defaultMessage,
    ...ev.data
  }
  switch (mes.act) {
    case 'ready':
      hostType === 'www' && uris.length > 0 && win?.postMessage({ act: 'uris', uris: uris }, '*')
      break
    case 'uris':
      hostType === 'static' && fetchAndSendImgs(mes.uris)
      break
    case 'imgs':
      hostType === 'www' && saveImgs(mes.imgs)
      break
    case 'close':
      hostType === 'static' && window.close()
      break
    default:
      break
  }
  return
}
type message = {
  act: 'ready' | 'imgs' | 'uris' | 'close' | 'null'
  imgs: DataOnly<Img>[]
  uris: string[]
}
const defaultMessage = {
  act: 'null',
  imgs: [],
  uris: []
} as message
