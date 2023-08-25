<script setup lang="ts">
import { reactive, ref } from 'vue'
import JSZip from 'jszip'
import { info } from '@/scripts/commonUtils'
import articleStore from '@/stores/articleStore'
import tagStore from '@/stores/tagStore'
import cachedTagStore from '@/stores/cachedTagStore'
import imgStore from '@/stores/imgStore'
import topicStore from '@/stores/topicStore'
import userIPStore from '@/stores/userIPStore'
import cachedMajiaStore from '@/stores/cachedMajiaStore'
import majiaStore from '@/stores/majiaStore'
import stateStore from '@/stores/stateStore'
import type { Article } from '@/interface/Article'
import type { ArticleTags } from '@/interface/ArticleTags'
import type { CachedTags } from '@/interface/CachedTags'
import { Img } from '@/interface/Img'
import type { Topic } from '@/interface/Topic'
import type { UserIPs } from '@/interface/UserIPs'
import type { CachedMajias } from '@/interface/CachedMajias'
import type { Majia } from '@/interface/Majia'
import type { UserState } from '@/interface/UserState'
const state = reactive({
  onPrepare: false
})
const mainJsonFileName = 'TopSmth.json'
const uriPrefix = 'https://'
const imgRegExp = /\.\w{2,4}$/
const input = ref<HTMLInputElement | null>(null)

function getSuffix(blob: Blob) {
  return blob.type.replace('image/', '.')
}
function saveBackup(blob: Blob) {
  const date = new Date()
  let a = document.createElement('a')
  a.href = window.URL.createObjectURL(blob)
  state.onPrepare = false
  a.download =
    'TopSmth' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '.zip'
  a.click()
}
async function exportBackup() {
  const backupData = Object.assign({}, backupTemplate)
  state.onPrepare = true
  const zip = new JSZip()
  backupData.articles = await articleStore.exportAll()
  backupData.articlesTags = await tagStore.exportAll()
  backupData.topics = await topicStore.exportAll()
  backupData.usersIps = await userIPStore.exportAll()
  backupData.majias = await majiaStore.exportAll()
  backupData.usersState = stateStore.exportAll()
  // backupData.cachedMajias = cachedMajiaStore.exportAll()
  // backupData.cachedTags = cachedTagStore.exportAll()
  zip.file(mainJsonFileName, JSON.stringify(backupData))
  const imgs = await imgStore.exportAll()
  for (const img of imgs) {
    if (img.imgBlob)
      zip.file(img.imgUri.replace(uriPrefix, '') + getSuffix(img.imgBlob), img.imgBlob, {
        binary: true
      })
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  saveBackup(blob)
}
function openFileChooser() {
  input.value?.click()
}
async function importBackup() {
  const files = input.value?.files
  if (files) {
    for (let index = 0; index < files.length; index++) {
      await importFile(files[index])
    }
  }
}
function importFile(file: File) {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async function () {
      if (reader.result !== null) {
        await handleZipFile(reader.result as ArrayBuffer)
        resolve()
      } else {
        const msg = '读取文件' + file.name + '失败'
        info(2, msg)
        reject(msg)
      }
    }
    reader.readAsArrayBuffer(file)
  })
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
  const data: Partial<Backup> = JSON.parse(mainJsonString)
  const backup: Backup = Object.assign(JSON.parse(JSON.stringify(backupTemplate)), data)
  const imgType = ['.png', '.jpg', '.jpeg', '.gif', 'bmp', 'svg', '.tif', 'tiff', '.webp']
  for (const path in files) {
    if (Object.prototype.hasOwnProperty.call(files, path)) {
      console.log(path)
      const zipObject = files[path]
      const m = path.match(imgRegExp)
      if (m && imgType.includes(m[0])) {
        const blob = await zipObject.async('blob')
        const imgUri = uriPrefix + path.replace(m[0], '')
        const img = new Img(imgUri, new Blob([blob], { type: 'image/' + m[0].replace('.', '') }))
        backup.imgs.push(img)
      }
    }
  }
  await mergeBackupData(backup)
}
async function mergeBackupData(backup: Backup) {
  await articleStore.importAll(backup.articles)
  await tagStore.importAll(backup.articlesTags)
  await imgStore.importAll(backup.imgs)
  await topicStore.importAll(backup.topics)
  await userIPStore.importAll(backup.usersIps)
  await majiaStore.importAll(backup.majias)
  await stateStore.importAll(backup.usersState)
  await cachedMajiaStore.importAll(backup.cachedMajias)
  await cachedTagStore.importAll(backup.cachedTags)
}
const backupTemplate = {
  articles: [] as Article[],
  articlesTags: [] as ArticleTags[],
  cachedTags: [] as CachedTags[],
  imgs: [] as Img[],
  topics: [] as Topic[],
  usersIps: [] as UserIPs[],
  majias: [] as Majia[],
  cachedMajias: [] as CachedMajias[],
  usersState: [] as UserState[]
}
type Backup = typeof backupTemplate
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
      ref="input"
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
