import init_func from './init_func'
import { fixImg } from './scripts/bugHandler'
import staticApp from '@/staticApp'
export default {
  run: function () {
    if (window.newsmth_script_loaded === true) {
      return
    }
    window.newsmth_script_loaded = true
    staticApp.init()
    if (location.hostname !== 'www.newsmth.net') {
      return
    }
    init_func.initDb()
    fixImg()
    if (document.readyState === 'loading') {
      // 此时加载尚未完成
      document.addEventListener('DOMContentLoaded', () => {
        init_func.initDom()
      })
    } else {
      // 此时`DOMContentLoaded` 已经被触发
      init_func.initDom()
    }
  }
}

declare global {
  interface Window {
    newsmth_script_loaded: boolean
    SESSION: { trigger: (params: string) => void; update: (force: boolean) => void }
    APP: {
      body: {
        open: (url: HTMLAnchorElement | string, target?: string) => void
        refresh: (noCache?: boolean) => void
      }
    }
  }
}
