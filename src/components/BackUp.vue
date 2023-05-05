<script setup lang="ts">
import { reactive } from 'vue'
import type { UserData } from '@/scripts/class/UserData'
import storage from '@/scripts/storage'
import type { Article } from '@/scripts/class/Article'

const state = reactive({
  showImport: false,
  showExport: false,
  showDonload: false,
  prepared: false
})
const backupData: Backup = { usersData: [], articles: [] }

function saveBackup() {
  const date = new Date()
  let a = document.createElement('a')
  a.href = window.URL.createObjectURL(
    new Blob([JSON.stringify(backupData)], { type: 'application/json' })
  )
  a.download =
    'smth' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '.json'
  a.click()
}
function prepareData() {
  state.showExport = !state.showExport
  if (!state.showExport) {
    return
  }
  storage
    .getAllUserData()
    .then((usersData: UserData[]) => {
      backupData.usersData = usersData
      return storage.getAllArticles()
    })
    .then((articles: Article[]) => {
      backupData.articles = articles
      state.prepared = true
    })
}
function importBackup(backup: Backup) {
  storage
    .saveAllArticle(backup.articles)
    .then(() => {
      return storage.saveAllUserData(backup.usersData)
    })
    .then(() => {
      alert('导入完成')
      window.location.reload()
    })
    .catch(() => {
      alert('导入失败')
      window.location.reload()
    })
}
function mergeBackupData() {
  const el = document.querySelector<HTMLInputElement>('input#newsmth_backup')
  if (el == null) {
    return
  }
  const files = el.files
  if (files !== null) {
    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      const reader = new FileReader()
      reader.onload = function () {
        if (reader.result !== null) {
          const backup: Backup = JSON.parse(reader.result as string)
          importBackup(backup)
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
    <button @click="state.showImport = !state.showImport">导入备份</button>
    <button @click="prepareData()" :disabled="state.showExport && !state.prepared">导出备份</button>
    <br />
    <div v-if="state.showImport" class="border-dotted">
      <input type="file" name="file" multiple accept="application/json" id="newsmth_backup" />
      <button @click="mergeBackupData()">导入数据</button>
    </div>
    <div v-if="state.showExport" class="border-dotted">
      <span v-show="!state.prepared">准备数据中......</span>
      <a v-show="state.prepared" @click="saveBackup()">获取数据完成,点击下载</a>
    </div>
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
