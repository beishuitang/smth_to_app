<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore'
import { fixSearchBoard } from '@/scripts/bugHandler'
import { ref, watch } from 'vue'
defineProps<{
  msg?: string
}>()
const showState = useAppStateStore().appState.showState
const menuEl = document.querySelector('#menu') as HTMLElement
const loginEl = menuEl.querySelector('#u_login') as HTMLElement
const xlistEl = menuEl.querySelector('#xlist') as HTMLElement
const username = 'newsmth_script_username'
const password = 'newsmth_script_password'
const saveConfig = 'newsmth_script_pass_config'
const list_menu = ref<HTMLElement | null>(null)

menuEl.addEventListener('click', (event) => {
  const el = event.target
  if (!(el instanceof HTMLElement)) return
  if (el.id === 'u_login_submit') {
    const hashScrollY = useAppStateStore().scrollY
    hashScrollY.hash = location.hash
    hashScrollY.scrollY = window.scrollY
    window.SESSION.trigger('logout')
    savePassword(menuEl.querySelector<HTMLInputElement>('#u_login_cookie')?.checked)
  }
})
function savePassword(save: boolean | undefined) {
  const usernameEl = menuEl.querySelector<HTMLInputElement>('#u_login_id')
  const passwordEl = menuEl.querySelector<HTMLInputElement>('#u_login_passwd')
  if (usernameEl === null || passwordEl === null) return
  if (save) {
    localStorage.setItem(saveConfig, '1')
    localStorage.setItem(username, usernameEl.value)
    localStorage.setItem(password, passwordEl.value)
  } else {
    localStorage.setItem(saveConfig, '0')
    localStorage.setItem(username, '')
    localStorage.setItem(password, '')
  }
}
function fillPassword() {
  const usernameEl = menuEl.querySelector<HTMLInputElement>('#u_login_id')
  const passwordEl = menuEl.querySelector<HTMLInputElement>('#u_login_passwd')
  const checkboxEl = menuEl.querySelector<HTMLInputElement>('#u_login_cookie')
  const checkInfoEl = checkboxEl?.nextElementSibling
  if (usernameEl && passwordEl && checkboxEl && checkInfoEl) {
    const checked = localStorage.getItem(saveConfig) == '1'
    checkboxEl.checked = checked
    checkInfoEl.innerHTML = '保存账号密码'
    if (checked) {
      const u = localStorage.getItem(username)
      const p = localStorage.getItem(password)
      usernameEl.value = u ? u : ''
      passwordEl.value = p ? p : ''
    }
  }
}

function computeMaxHeight() {
  const d = list_menu.value?.clientHeight
  const maxHeight = window.innerHeight - 10 - loginEl.clientHeight - (d ? d : 50)
  xlistEl.style.maxHeight = maxHeight + 'px'
}

watch(
  () => showState.state,
  (newState, oldState) => {
    if (oldState === 0 && newState === -1) {
      document.querySelector<HTMLElement>('#menu')?.classList.add('display')
    } else if (oldState === -1 && newState === 0) {
      document.querySelector<HTMLElement>('#menu')?.classList.remove('display')
      document.querySelector<HTMLInputElement>('#b_search')?.blur()
    }
  }
)

const mutConfig = {
  attributes: false,
  childList: true,
  subtree: false
}
new MutationObserver(() => {
  fillPassword()
  fixSearchBoard()
  computeMaxHeight()
}).observe(loginEl, mutConfig)
fillPassword()
fixSearchBoard()
computeMaxHeight()
</script>

<template>
  <nav ref="list_menu" id="xlist-menu" class="corner">
    <ul>
      <li class="slist folder-close">
        <span class="x-leaf">
          <span class="toggler ico-pos-manage"></span>
          <a v-on:click="showState.showSetting = true">设置面板</a>
        </span>
      </li>
    </ul>
  </nav>
</template>
<style>
body.newsmth-plus #menu {
  float: unset;
  background-color: aliceblue;
  position: fixed;
  margin: 0.2rem 0 0 0;
  z-index: 100;
  bottom: 0rem;
  left: 0;
  transform: translateX(-100%);
  max-height: 100%;
  -webkit-transition: transform 0.4s;
  transition: transform 0.4s;
}

.newsmth-plus #menu.display {
  transform: unset;
}

.newsmth-plus #menu .ico-pos-manage {
  background-position: -25.5rem -2rem;
}

#menu .ico-pos-manage {
  background-position: -255px -20px;
}

.newsmth-plus #menu .x-folder a,
.newsmth-plus #menu .x-leaf a {
  line-height: 2.8rem;
}

#menu .x-folder a,
#menu .x-leaf a {
  line-height: 2.8rem;
  padding-top: unset;
}

.newsmth-plus .x-child a {
  line-height: 1.2em;
}

#menu .toggler {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin-top: unset;
}

body.newsmth-plus #xlist {
  overflow-y: auto;
  padding: 1rem 0.8rem 0 0.8rem;
  border-bottom-width: 0;
  border-radius: 0.4rem 0.4rem 0 0;
}

.newsmth-plus #xlist-menu {
  padding: 0 0.8rem 0.1rem 0.8rem;
  border: solid #c3d9ff;
  border-radius: 0 0 0.4rem 0.4rem;
  border-width: 0.1rem 0.1rem 0.1rem 0.1rem;
}

.newsmth-plus #xlist-menu .x-leaf {
  border-bottom: unset;
}
</style>
