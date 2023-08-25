<script setup lang="ts">
import storage from '@/storage/storage'
import { fileKeys } from '@/storage/tableInfo'
import ipInfoStore from '@/stores/ipInfoStore'
import { ref, watch } from 'vue'
import { info } from '@/scripts/commonUtils'
const loaded = ref(false)
const showImport = ref(false)
const autoDownload = ref(false)
const installing = ref(false)
const contentLength = ref(1)
const receivedLength = ref(0)
watch(autoDownload, (value) => {
  if (value) {
    downloadIpDb()
  }
})
function downloadIpDb() {
  info(2000, '正在下载安装，请稍后')
  installing.value = true
  const url = 'https://www.newsmth.top/static/ip2region.xdb'
  fetch(url)
    .then((response) => {
      return getArrayBuffer(response)
    })
    .then((arrayBuffer) => {
      return saveIpDb(arrayBuffer)
    })
    .then(() => {
      ipInfoStore.init()
    })
    .then(() => {
      loaded.value = true
      info(2, '安装完成！')
    })
    .catch((e) => {
      info(3, e)
    })
    .finally(() => {
      installing.value = false
      autoDownload.value = false
    })
}
async function getArrayBuffer(response: Response) {
  const reader = response.body?.getReader()
  const s = response.headers.get('Content-Length')
  if (!reader || !s) {
    throw new Error('response.body or contentLength  is null')
  }
  contentLength.value = parseInt(s)
  let chunks = []
  let done = false
  while (!done) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    chunks.push(value)
    receivedLength.value += value.length
  }
  let chunksAll = new Uint8Array(receivedLength.value)
  let position = 0
  for (let chunk of chunks) {
    chunksAll.set(chunk, position)
    position += chunk.length
  }
  return chunksAll.buffer
}
async function saveIpDb(arrayBuffer: ArrayBuffer) {
  await storage.saveFile(arrayBuffer, fileKeys.ipDB)
  info(3, '导入完成,点击“应用”完成操作')
}
</script>
<template>
  <div>
    <h3>ip地理位置</h3>
    数据库文件:
    <span v-if="loaded"> 已安装 </span>
    <span v-if="!loaded">
      <label :class="{ checked: autoDownload }">
        下载更新
        <input type="checkbox" :disabled="installing" v-model="autoDownload" />
      </label>
      <label :class="{ checked: showImport }">
        手动导入
        <input type="checkbox" :disabled="installing" v-model="showImport" />
      </label>
      <div v-if="installing">
        正在下载:{{ Math.floor((100 * receivedLength) / contentLength) }}%
      </div>
    </span>
  </div>
</template>

<style scoped>
a {
  text-decoration: underline;
}

.border-dotted {
  border: dotted;
}

label {
  margin-right: 1rem;
  display: inline-block;
  border: outset;
}

label.checked {
  border: inset;
}
</style>
