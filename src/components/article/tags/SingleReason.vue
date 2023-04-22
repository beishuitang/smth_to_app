<script setup lang="ts">
import { reactive } from 'vue'
import storage from '@/scripts/storage'

const props = defineProps<{
  uri: string | number
}>()
// const href = props.uri.toString()
const contents = reactive([] as string[])
storage.getArticleByUri(props.uri as string).then((article) => {
  article &&
    article.content.forEach((c) => {
      contents.push(c)
    })
})
</script>

<template>
  <div>
    <!-- <a :href="href" target="_blank">{{ href }}</a> -->
    <p v-for="(content, index) of contents" v-bind:key="index" v-html="content"></p>
  </div>
</template>

<style scoped>
div {
  border: dashed;
}
</style>
