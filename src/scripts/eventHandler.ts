import { useAppStateStore } from '@/stores/appStateStore'
import stackStore from '@/stores/stackStore'
import topicStore from '@/stores/topicStore'
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
  if (appStore.appState.showState.showSetting || appStore.appState.showState.state === 1) {
    return
  }
  if (appStore.appState.mainHash === 'mainpage') {
    return
  }
  const el = document.activeElement
  if (el instanceof HTMLTextAreaElement && el.value.trim() !== '') {
    return
  }
  if (long && direction === config.longSwipeDirection) {
    stackStore.stepOut()
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
    stackStore.stepOut()
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
    link.href.match(/[?&]p=\d*($|&)/m) ||
    link.href.endsWith('.json')
  )
    return
  const topicUri = topicStore.getTopicUri(link.href)
  if (!topicUri) return
  event.preventDefault()
  event.stopImmediatePropagation()
  topicStore.get(topicUri).then((topic) => {
    const postFix = `?p=${topic.p}`
    const hashScrollY = appStore.scrollY
    hashScrollY.scrollY = topic.scrollY
    link!.href = link!.href + postFix
    window.APP.body.open(link!)
    hashScrollY.hash = location.hash
  })
}

type direction = 'up' | 'down' | 'left' | 'right'
const PI = Math.PI
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
  if (event.button !== 2) return
  swipe('down', true)
}
function handleKeyboardEvent(event: KeyboardEvent) {
  switch (event.type) {
    case 'keyup':
      break
    case 'keydown':
      if (event.key === 'ArrowLeft') {
        swipe('left')
      } else if (event.key === 'ArrowRight') {
        swipe('right')
      } else if (event.key === 'ArrowDown') {
        swipe('up', event.ctrlKey)
      } else if (event.key === 'ArrowUp') {
        swipe('down', event.ctrlKey)
      } else if (event.key === 'PageDown') {
        swipe('up')
      } else if (event.key === 'PageUp') {
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
      if (Math.abs(atan2) < 0.5) {
        swipe('right', long)
      } else if (Math.abs(atan2 - PI / 2) < 0.5) {
        swipe('up', long)
      } else if (Math.abs(atan2 + PI / 2) < 0.5) {
        swipe('down', long)
      } else if (Math.abs(atan2) > PI - 0.5) {
        swipe('left', long)
      }
      break
    case 'touchmove':
      //阻止默认行为
      // if (isPreventDefault) event.preventDefault()
      break
  }
}
const cachedSwipe = {
  swipe: function (direction: 'up' | 'down', long = false) {
    if (long) {
      swipe(direction, long)
      return
    }
    if ((direction === 'down' && atTop()) || (direction === 'up' && atBottom())) {
      this.n++
      if (cachedSwipe.n > cachedSwipe.threshHold) {
        swipe(direction)
        cachedSwipe.n = 0
      }
    } else this.n = 0
  },
  threshHold: 1,
  n: 0
}
function handleWheelEvent(event: WheelEvent) {
  cachedSwipe.swipe(event.deltaY > 0 ? 'up' : 'down')
}
