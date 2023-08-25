<script setup lang="ts">
import type { ArticleTags } from '@/interface/ArticleTags'
import SingleArticle from './SingleArticle.vue'
import tagStore from '@/stores/tagStore'
const props = defineProps<{
  msg?: string
  userId: string
  tagNames: string[]
}>()
const record = await tagStore.getByID(props.userId)
function showArticle(articleTags: ArticleTags) {
  const keys = Object.keys(articleTags.tags)
  for (const tagName of props.tagNames) {
    if (keys.includes(tagName)) {
      return true
    }
  }
  return false
}
</script>
<template>
  <div v-for="articleTags in record" :key="articleTags.articleUri">
    <SingleArticle
      v-if="showArticle(articleTags)"
      :article-uri="articleTags.articleUri"
    ></SingleArticle>
  </div>
</template>
<style scoped></style>
