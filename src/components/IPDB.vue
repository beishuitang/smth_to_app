<script setup lang="ts">
import storage from '@/scripts/storage'
import ipData from '@/scripts/ipData'
import { ref } from 'vue'
const loaded = ipData.searcher ? ref(true) : ref(false)
function saveIpDb() {
  const files = document.querySelector<HTMLInputElement>('input#newsmth_IpDB')?.files
  if (!files || !files[0]) {
    return
  }
  storage.saveIpDB(files[0])
}
</script>
<template>
  <div>
    <h3>ip数据库</h3>
    <span v-if="loaded" v-on:click="loaded = !loaded">已完成导入</span>
    <div v-if="!loaded" class="border-dotted">
      <input type="file" name="file" accept=".xdb" id="newsmth_IpDB" />
      <button @click="saveIpDb()">导入</button>
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
