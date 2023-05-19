<script setup lang="ts">
import { reactive } from 'vue'
import type { UserData } from '@/scripts/class/UserData'
import storage from '@/scripts/storage'
import type { Article } from '@/scripts/class/Article'
import { info } from '@/scripts/commonUtils'

const state = reactive({
  onPrepare: false
})
const backupData: Backup = { usersData: [], articles: [] }

function saveBackup() {
  const date = new Date()
  let a = document.createElement('a')
  a.href = window.URL.createObjectURL(
    new Blob([JSON.stringify(backupData)], { type: 'application/json' })
  )
  state.onPrepare = false
  a.download =
    'smth' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '.json'
  a.click()
}
function exportBackup() {
  state.onPrepare = true
  storage
    .getAllUserData()
    .then((usersData: UserData[]) => {
      backupData.usersData = usersData
      return storage.getAllArticles()
    })
    .then((articles: Article[]) => {
      backupData.articles = articles
      saveBackup()
    })
}
function openFileChooser() {
  document.querySelector<HTMLInputElement>('#newsmth_backup')?.click()
}
function mergeBackupData(backup: Backup) {
  storage
    .saveAllArticle(backup.articles)
    .then(() => {
      return storage.saveAllUserData(backup.usersData)
    })
    .then(() => {
      info(2, '导入完成!点击“应用”或继续')
    })
    .catch((e) => {
      info(3, e)
    })
}
function importBackup(e: Event) {
  const el = e.target
  if (!(el instanceof HTMLInputElement)) {
    return
  }
  const files = el.files
  if (files !== null) {
    for (let index = 0; index < files.length; index++) {
      info(200, '正在导入......')
      const file = files[index]
      const reader = new FileReader()
      reader.onload = function () {
        if (reader.result !== null) {
          const backup: Backup = JSON.parse(reader.result as string)
          mergeBackupData(backup)
        }
      }
      reader.readAsText(file)
    }
  }
}
interface Backup {
  usersData: UserData[]
  articles: Article[]
}
</script>
<template>
  <div>
    <h3>备份</h3>
    <button @click="exportBackup" :disabled="state.onPrepare">导出备份</button>
    <button @click="openFileChooser">导入备份</button>
    <input
      style="display: none"
      type="file"
      name="file"
      multiple
      accept="application/json"
      id="newsmth_backup"
      v-on:input="importBackup"
    />
  </div>
</template>

<style scoped>
a {
  text-decoration: underline;
}

.border-dotted {
  border: dotted;
}
</style>
