<script setup lang="ts">
import storage from '@/storage/storage'
import { fileKeys } from '@/storage/tableInfo'
import ipInfoStore from '@/stores/ipInfoStore'
import { ref } from 'vue'
import { info } from '@/scripts/commonUtils'
const loaded = ref(false)
const installing = ref(false)
const contentLength = ref(1)
const receivedLength = ref(0)

const ip = ipInfoStore.getIpInfo('127.0.0.1')
loaded.value = ip ? true : false
function downloadIpDb() {
  installing.value = true
  const url = 'https://cdn.jsdelivr.net/gh/lionsoul2014/ip2region/data/ip2region.xdb'
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
  loaded.value = true
}
</script>
<template>
  <div>
    <h3>ip地理位置</h3>
    <span v-if="loaded"> 数据库文件已安装 </span>
    <span v-if="!loaded">
      <span>数据库文件约11M</span>
      <button :disabled="installing" @click="downloadIpDb">下载安装</button>
      <div v-if="installing">
        正在下载:{{ Math.floor((100 * receivedLength) / contentLength) }}%
      </div>
    </span>
  </div>
</template>

<style scoped></style>
