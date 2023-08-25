<script setup lang="ts">
import ipInfoStore from '@/stores/ipInfoStore'
import userIPStore from '@/stores/userIPStore'
import type { ArticleInfo } from '@/stores/appStateStore'
import { watch } from 'vue'
const props = defineProps<{
  msg?: string
  articleInfo: ArticleInfo
}>()
watch(
  props.articleInfo,
  async () => {
    const ipLog = await userIPStore.get(props.articleInfo.userId)
    ipLog.addIp(props.articleInfo.ip)
  },
  { immediate: true }
)
</script>
<template>
  <span>{{ '@' + ipInfoStore.getIpInfo(articleInfo.ip) }}</span>
</template>
<style scoped></style>
