<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore'
import SettingPanel from './SettingPanel.vue'
import { fixSearchBoard } from '@/scripts/bugHandler'
defineProps<{
  msg?: string
}>()
const showState = useAppStateStore().appState.showState
const menuEl = document.querySelector('#menu') as HTMLElement
const loginEl = menuEl.querySelector('#u_login') as HTMLElement
const username = 'newsmth_script_username'
const password = 'newsmth_script_password'
const saveConfig = 'newsmth_script_pass_config'
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
const mutConfig = {
  attributes: false,
  childList: true,
  subtree: false
}
new MutationObserver(() => {
  fillPassword()
  fixSearchBoard()
}).observe(loginEl, mutConfig)
fillPassword()
fixSearchBoard()
</script>

<template>
  <nav id="xlist-menu" class="corner">
    <ul>
      <li class="slist folder-close">
        <span class="x-leaf">
          <span class="toggler ico-pos-manage"></span>
          <a v-on:click="showState.showSetting = true">设置面板</a>
        </span>
      </li>
    </ul>
  </nav>
  <SettingPanel v-if="showState.showSetting" />
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
  line-height: 28px;
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
  padding: 1rem 0.8rem 0 0.8rem;
  border-bottom-width: 0;
  border-radius: 0.4rem 0.4rem 0 0;
}

.newsmth-plus #xlist-menu {
  padding: 0 0.8rem 1rem 0.8rem;
  border-radius: 0 0 0.4rem 0.4rem;
  border-width: 0 0.1rem 0.1rem 0.1rem;
}

#xlist-menu {
  padding: 0 8px 10px 8px;
  border: solid #c3d9ff;
  border-radius: 0 0 4px 4px;
  border-width: 0 1px 1px 1px;
}
</style>
