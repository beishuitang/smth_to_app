<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore'
import { watch } from 'vue'
import SettingPanel from './SettingPanel.vue'
defineProps<{
  msg?: string
}>()
const showState = useAppStateStore().appState.showState
const menuEl = document.querySelector('#menu') as HTMLElement
const classList = menuEl.classList
const username = 'newsmth_script_username'
const password = 'newsmth_script_password'
const saveConfig = 'newsmth_script_config'
menuEl.addEventListener('click', (event) => {
  const el = event.target
  if (!(el instanceof HTMLElement)) return
  if (el.id === 'u_login_submit') {
    const hashScrollY = useAppStateStore().scrollY
    hashScrollY.hash = location.hash
    hashScrollY.scrollY = window.scrollY
    window.SESSION.trigger('logout')
  } else if (el.id === 'u_login_cookie') {
    savePassword((el as HTMLInputElement).checked)
  }
})
function savePassword(save: boolean) {
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
  const checkboxEl = document.querySelector<HTMLInputElement>("#u_login_cookie")
  const checkInfoEl = checkboxEl?.nextElementSibling
  if (usernameEl && passwordEl && checkboxEl && checkInfoEl) {
    const checked = localStorage.getItem(saveConfig) == '1'
    checkboxEl.checked = checked
    checkInfoEl.innerHTML="保存账号密码"
    if (checked) {
      const u = localStorage.getItem(username)
      const p = localStorage.getItem(password)
      usernameEl.value = u ? u : ''
      passwordEl.value = p ? p : ''
    }
  }
}

watch(
  () => showState.showMenu,
  (showMenu) => {
    if (showMenu) {
      classList?.add('display')
      fillPassword()
    } else {
      classList?.remove('display')
    }
  }
)
</script>

<template>
  <nav id="xlist-menu" class="corner">
    <ul>
      <li class="slist folder-close">
        <span class="x-leaf">
          <span class="toggler ico-pos-manage"></span><a v-on:click="showState.showSetting = true">设置面板</a>
        </span>
      </li>
    </ul>
  </nav>
  <SettingPanel v-if="showState.showSetting" />
</template>
<style>
html body #menu {
  float: unset;
  background-color: aliceblue;
  position: fixed;
  margin: 0.2rem 0 0 0.3rem;
  z-index: 100;
  bottom: 0rem;
  left: -100%;

  -webkit-transition: left 0.4s;
  transition: left 0.4s;
}

html body #menu.display {
  left: 0%;
}

html body #menu .ico-pos-manage {
  background-position: -25.5rem -2rem;
}

html #menu .x-folder a,
html #menu .x-leaf a {
  padding-top: 7px;
}

html body #xlist {
  padding: 1rem 0.8rem 0 0.8rem;
  border-bottom-width: 0;
  border-radius: 0.4rem 0.4rem 0 0;
}

#xlist-menu {
  padding: 0 0.8rem 1rem 0.8rem;
  border: solid #c3d9ff;
  border-radius: 0 0 0.4rem 0.4rem;
  border-width: 0 0.1rem 0.1rem 0.1rem;
}
</style>
//TODO
