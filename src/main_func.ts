import init_func from './init_func'
export default {
  run: function () {
    if (window.newsmth_script_loaded === true) {
      return
    }
    window.newsmth_script_loaded = true
    init_func.initDb()
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
    Android:
      | {
          saveBackup: (data: string) => void
          getIpInfo: (ip: string) => string
          reload: () => void
        }
      | undefined
    SESSION: { trigger: (params: string) => void; update: (force: boolean) => void }
    APP: { body: { open: (url: HTMLAnchorElement | string, target?: string) => void } }
  }
}
