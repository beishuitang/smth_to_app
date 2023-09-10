<script setup lang="ts">
import { reactive, ref } from 'vue'
import JSZip from 'jszip'
import type { tableName } from '@/storage/tableInfo'
import { tableInfo, storeInfo } from '@/storage/tableInfo'
import {
  getBackupFileName,
  getBackupTemplate,
  mainJsonFileName,
  imgUriPrefix,
  type Backup
} from '@/interface/Backup'
const state = reactive({
  onPrepare: false
})

const checkedTables = ref([
  'articleTable',
  'imgTable',
  'ipTable',
  'likeTable',
  'majiaTable',
  'stateTable',
  'tagTable'
] as tableName[])
const dialog = ref<HTMLDialogElement | null>(null)

function getExtensionName(blob: Blob) {
  return blob.type.replace('image/', '.')
}

async function exportBackup(exp = false) {
  dialog.value?.close()
  if (!exp) return
  state.onPrepare = true
  const backupData = await getBackupData()
  const blob = await generateBlob(backupData)
  saveBackup(blob)
}
async function generateBlob(backupData: Backup) {
  const zip = new JSZip()
  for (const img of backupData.imgTable) {
    if (img.imgBlob)
      zip.file(img.imgUri.replace(imgUriPrefix, '') + getExtensionName(img.imgBlob), img.imgBlob, {
        binary: true
      })
  }
  backupData.imgTable = []
  zip.file(mainJsonFileName, JSON.stringify(backupData))
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9
    }
  })
  return blob
}
async function getBackupData() {
  const backupData = Object.assign({}, getBackupTemplate())
  for (let i = 0; i < checkedTables.value.length; i++) {
    const tableName = checkedTables.value[i]
    backupData[tableName] = (await storeInfo[tableName].exportAll()) as any
  }
  return backupData
}
function saveBackup(blob: Blob) {
  let a = document.createElement('a')
  a.href = window.URL.createObjectURL(blob)
  state.onPrepare = false
  a.download = getBackupFileName()
  a.click()
}
</script>
<template>
  <button @click="dialog?.showModal()" :disabled="state.onPrepare">导出备份</button>
  <dialog ref="dialog">
    <span v-for="(info, tableName) in tableInfo" :key="tableName">
      <label v-if="!tableName.startsWith('cached')">
        <input type="checkbox" :value="tableName" v-model="checkedTables" />{{ info.comment }}
      </label>
    </span>
    <br />
    <br />
    <div>
      <button @click="exportBackup(false)">取消</button>
      <button @click="exportBackup(true)">确认导出</button>
    </div>
  </dialog>
</template>

<style scoped>
dialog button {
  float: right;
}
</style>
