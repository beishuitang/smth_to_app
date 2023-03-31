import articleHandler from './pageHandler/articleHandler'
import mainpageHandler from './pageHandler/mainpageHandler'
import searchHandler from './pageHandler/searchHandler'
import boardHandler from './pageHandler/boardHandler'
import { useAppStateStore } from '@/stores/appStateStore'
import appContainer from './appContainer'
export default {
  appState: useAppStateStore(appContainer.pinia).appState,
  dispatch: function (bodyElement: HTMLElement) {
    if (bodyElement.children.length == 0) {
      return
    }
    // setTimeout(() => {
    this.handle(bodyElement)
    // }, 500);
  },
  handle: function (bodyElement: HTMLElement) {
    switch (this.appState.mainHash) {
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
