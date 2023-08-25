import articleHandler from './pageHandler/articleHandler'
import mainpageHandler from './pageHandler/mainpageHandler'
import searchHandler from './pageHandler/searchHandler'
import boardHandler from './pageHandler/boardHandler'
import { useAppStateStore } from '@/stores/appStateStore'
import appContainer from './appContainer'
import { info } from './commonUtils'
export default {
  appStore: useAppStateStore(appContainer.pinia),
  dispatch: function (bodyElement: HTMLElement) {
    if (bodyElement.children.length == 0) {
      info(2, 'body element is empty')
      return
    }
    if (this.loginRequired(bodyElement)) {
      // this.appStore.changeShowstate('right')
    } else {
      this.handle(bodyElement)
    }
  },

  loginRequired: function (bodyElement: HTMLElement) {
    return (
      bodyElement.querySelector('.error>ul>li')?.lastChild?.textContent ===
      '您未登录,请登录后继续操作'
    )
  },
  handle: function (bodyElement: HTMLElement) {
    switch (this.appStore.appState.mainHash) {
      case 'article':
        articleHandler.handle(bodyElement)
        break
      case 'mainpage':
        mainpageHandler.handle(bodyElement)
        break
      case 's':
        searchHandler.handle(bodyElement)
        break
      case 'board':
        boardHandler.handle(bodyElement)
        break
      default:
        break
    }
  }
}
