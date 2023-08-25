<script setup lang="ts">
import type { ArticleInfo } from '@/stores/appStateStore'
import stateStore from '@/stores/stateStore'
import cacheStore from '@/stores/cachedTagStore'
import UserIPLog from './UserIPLog.vue'
const props = defineProps<{
  msg?: string
  articleInfo: ArticleInfo
}>()
function switchUserTags() {
  stateStore.get(props.articleInfo.userId).switchShowTag()
}
</script>
<template>
  <a>
    <UserIPLog :article-info="articleInfo" />
    <span @click="switchUserTags">({{ cacheStore.get(articleInfo.userId).score }})</span>
  </a>
</template>
<style scoped></style>
