<script setup lang="ts">
import articleStore from '@/stores/articleStore'
const props = defineProps<{
  msg?: string
  articleUri: string
}>()
const article = await articleStore.get(props.articleUri)
const contents = article.content
</script>
<template>
  <p v-for="(content, index) in contents" :key="index" v-html="content"></p>
</template>
<style scoped>
p {
  background-image:repeating-radial-gradient(lightgray, transparent 5rem) 
}
</style>
