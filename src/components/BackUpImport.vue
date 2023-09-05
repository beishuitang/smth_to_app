<script setup lang="ts">
import { ref } from 'vue'
import JSZip from 'jszip'
import { info } from '@/scripts/commonUtils'
import { Img } from '@/interface/Img'
import { storeInfo } from '@/storage/tableInfo'
import type { tableName } from '@/storage/tableInfo'
import { getBackupTemplate, mainJsonFileName, imgUriPrefix } from '@/interface/Backup'
import type { Backup } from '@/interface/Backup'

const imgExtReg = /\.\w{2,4}$/
const input = ref<HTMLInputElement | null>(null)

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
  const backup: Backup = Object.assign(getBackupTemplate(), data)
  const imgType = ['.png', '.jpg', '.jpeg', '.gif', 'bmp', 'svg', '.tif', 'tiff', '.webp']
  for (const path in files) {
    if (Object.prototype.hasOwnProperty.call(files, path)) {
      console.log(path)
      const zipObject = files[path]
      const m = path.match(imgExtReg)
      if (m && imgType.includes(m[0])) {
        const blob = await zipObject.async('blob')
        const imgUri = imgUriPrefix + path.replace(m[0], '')
        const img = new Img(imgUri, new Blob([blob], { type: 'image/' + m[0].replace('.', '') }))
        backup.imgTable.push(img)
      }
    }
  }
  await mergeBackupData(backup)
}
async function mergeBackupData(backup: Backup) {
  const entries = Object.entries(storeInfo)
  for (let i = 0; i < entries.length; i++) {
    const [tableName, store] = entries[i]
    await store.importAll(backup[tableName as tableName] as any)
  }
}
</script>
<template>
  <div>
    <button @click="input?.click()">导入备份</button>
    <input
      style="display: none"
      type="file"
      multiple
      accept="application/zip"
      ref="input"
      v-on:input="importBackup"
    />
  </div>
</template>

<style scoped></style>
