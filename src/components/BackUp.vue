<script setup lang="ts">
import { reactive } from 'vue'
import type { UserData } from '@/scripts/class/UserData'
import storage from '@/scripts/storage'
import type { Article } from '@/scripts/class/Article'
import type { Img } from '@/scripts/class/Img'
import JSZip from 'jszip'
import { info } from '@/scripts/commonUtils'

const state = reactive({
  onPrepare: false
})
const mainJsonFileName = 'smth_to_app.json'
const uriPrefix = 'https://'
const imgPostfix = '.jpeg'
const imgRegExp = new RegExp(`${imgPostfix}$`)
function saveBackup(blob: Blob) {
  const date = new Date()
  let a = document.createElement('a')
  a.href = window.URL.createObjectURL(blob)
  state.onPrepare = false
  a.download =
    'smth' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '.zip'
  a.click()
}
function exportBackup() {
  const backupData: Backup = { usersData: [], articles: [] }
  state.onPrepare = true
  const zip = new JSZip()
  storage
    .getAllUserData()
    .then((usersData: UserData[]) => {
      backupData.usersData = usersData
      return storage.getAllArticle()
    })
    .then((articles: Article[]) => {
      backupData.articles = articles
      zip.file(mainJsonFileName, JSON.stringify(backupData))
      return storage.getAllImg()
    })
    .then((imgs: Img[]) => {
      for (const img of imgs) {
        zip.file(img.imgUri.replace(uriPrefix, '') + imgPostfix, img.data, { binary: true })
      }
      return zip.generateAsync({ type: 'blob' })
    })
    .then((content: Blob) => {
      saveBackup(content)
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
      return storage.saveAllImg(backup.imgs ? backup.imgs : [])
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
          handleZipFile(reader.result as ArrayBuffer)
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }
}
async function handleZipFile(f: ArrayBuffer) {
  const zipfile = await JSZip.loadAsync(f)
  const files = zipfile.files
  const mainJsonFile = files[mainJsonFileName]
  if (!mainJsonFile) {
    info(2, '文件错误，导入失败')
    return
  }
  const mainJsonString = await mainJsonFile.async('string')
  const backup: Backup = JSON.parse(mainJsonString)
  backup.imgs = []
  for (const path in files) {
    if (Object.prototype.hasOwnProperty.call(files, path)) {
      console.log(path)
      const zipObject = files[path]
      if (path.endsWith(imgPostfix)) {
        console.log('aaaaaaaaaaaaa')
        const blob = await zipObject.async('blob')
        backup.imgs?.push({ imgUri: uriPrefix + path.replace(imgRegExp, ''), data: blob })
      }
    }
  }
  console.log(backup.imgs?.length)
  mergeBackupData(backup)
}
interface Backup {
  usersData: UserData[]
  articles: Article[]
  imgs?: Img[]
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
      accept="application/zip"
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
