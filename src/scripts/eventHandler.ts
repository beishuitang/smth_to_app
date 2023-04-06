import { useAppStateStore } from '@/stores/appStateStore'
import appContainer from './appContainer'
import config from './smthScriptConfig'

const appStore = useAppStateStore(appContainer.pinia)
export default {
  handleInputEvent: function () {
    preventDblclickDefault()
    listenEvent(window)
  }
}
function swipe(direction: direction, long = false) {
  direction === 'up' || direction === 'down'
    ? verticalSwipe(direction, long)
    : horizontalSwipe(direction)
}
function verticalSwipe(direction: 'up' | 'down', long = false) {
  if (appStore.appState.showState.showSetting || appStore.appState.showState.showPanel) {
    return
  }
  if (appStore.appState.mainHash === 'mainpage') {
    return
  }
  const el = document.activeElement
  if (el instanceof HTMLTextAreaElement && el.value.trim() !== '') {
    return
  }
  if (long) {
    appStore.stepOut(location.hash)
    return
  }
  if ((direction === 'down' && !atTop()) || (direction === 'up' && !atBottom())) {
    return
  }
  const currentPageEl = document.querySelector('.page-select')
  const pageEl =
    direction === 'up' ? currentPageEl?.nextElementSibling : currentPageEl?.previousElementSibling
  if (pageEl instanceof Element) {
    const link = pageEl.querySelector('a')
    if (link === null) return
    const hashScrollY = appStore.scrollY
    window.APP.body.open(link)
    hashScrollY.hash = location.hash
    hashScrollY.scrollY = direction === 'up' ? 0 : 10000
  } else {
    appStore.stepOut(location.hash)
  }
}
function horizontalSwipe(direction: 'left' | 'right') {
  appStore.changeShowstate(direction)
}
function preventDblclickDefault() {
  document.querySelector('#body')?.addEventListener(
    'mousedown',
    function (event) {
      if ((event as MouseEvent).detail > 1) {
        event.preventDefault()
      }
    },
    false
  )
}
let startX: number
let startY: number

function handleEvent(event: Event) {
  if (event instanceof KeyboardEvent && !focusOnInput()) {
    handleKeyboardEvent(event)
  } else if (event instanceof WheelEvent) {
    handleWheelEvent(event)
  } else if (event instanceof MouseEvent) {
    handleMouseEvent(event)
  } else if (event instanceof TouchEvent) {
    handleTouchEvent(event)
  }
}
/**
 * 监听
 * @param target            要绑定监听的目标元素
 */
function listenEvent(target: HTMLElement | Window | Document) {
  target.addEventListener('touchstart', handleEvent, false)
  target.addEventListener('touchend', handleEvent, false)
  target.addEventListener('touchmove', handleEvent, false)
  target.addEventListener('keyup', handleEvent, false)
  target.addEventListener('keydown', handleEvent, false)
  target.addEventListener('wheel', handleEvent, false)
  target.addEventListener('mouseup', handleEvent, false)
  target.addEventListener('click', handleClickEvent, true)
}

function handleClickEvent(event: Event) {
  const el = event.target
  if (!(el instanceof HTMLElement)) return
  let link: HTMLAnchorElement | undefined
  const path = event.composedPath()
  const length = Math.min(path.length, 3)
  for (let index = 0; index < length; index++) {
    const element = path[index]
    if (element instanceof HTMLAnchorElement) {
      link = element
      break
    }
  }
  if (
    link === undefined ||
    link.target === '_blank' ||
    link.host !== config.host ||
    // link.href.endsWith('.json') ||
    !link.href.match(/nForum\/article\/([\w.]+)\/(\d+)$/)
  )
    return

  event.preventDefault()
  event.stopImmediatePropagation()
  appStore.getTopicByUri(link.href, (topic) => {
    const postFix = topic === undefined ? '' : `?p=${topic.p}`
    const hashScrollY = appStore.scrollY
    hashScrollY.scrollY = topic === undefined ? 0 : topic.scrollY
    link instanceof HTMLAnchorElement &&
      (link.href = link.href + postFix) &&
      window.APP.body.open(link)
    hashScrollY.hash = location.hash
  })
}

type direction = 'up' | 'down' | 'left' | 'right'
const angle = Math.PI / 4
function atBottom() {
  return window.scrollY + window.innerHeight + 2 > document.body.clientHeight
}
function atTop() {
  return window.scrollY < 1
}
function focusOnInput() {
  return ['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(
    document.activeElement?.nodeName as string
  )
}
function handleMouseEvent(event: MouseEvent) {
  if (event.button === 1) {
    swipe('down', true)
  }
}
function handleKeyboardEvent(event: KeyboardEvent) {
  switch (event.type) {
    case 'keydown':
      break
    case 'keyup':
      if (event.key === 'ArrowLeft') {
        swipe('left')
      } else if (event.key === 'ArrowRight') {
        swipe('right')
      } else if (event.key === 'ArrowDown') {
        swipe('up')
      } else if (event.key === 'ArrowUp') {
        swipe('down')
      }
      break
  }
}
function handleTouchEvent(event: TouchEvent) {
  let spanX, spanY, atan2, long, distance
  switch (event.type) {
    case 'touchstart':
      startX = event.touches[0].clientX
      startY = event.touches[0].clientY
      break
    case 'touchend':
      spanX = event.changedTouches[0].clientX - startX
      spanY = startY - event.changedTouches[0].clientY
      atan2 = Math.atan2(spanY, spanX)
      distance = Math.abs(spanX) + Math.abs(spanY)
      if (distance < 30) return
      long = distance > config.longSwipeDistance
      if (angle >= atan2 && atan2 > -angle) {
        swipe('right', long)
      } else if (angle * 3 >= atan2 && atan2 > angle) {
        swipe('up', long)
      } else if (-angle >= atan2 && atan2 > -angle * 3) {
        swipe('down', long)
      } else {
        swipe('left', long)
      }
      break
    case 'touchmove':
      //阻止默认行为
      // if (isPreventDefault) event.preventDefault()
      break
  }
}
function handleWheelEvent(event: WheelEvent) {
  const y = event.deltaY
  if (y > 0) {
    swipe('up')
  } else if (y < 0) {
    swipe('down')
  }
}
