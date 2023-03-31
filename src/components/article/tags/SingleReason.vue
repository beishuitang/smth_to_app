<script setup lang="ts">
import { ref } from 'vue'
import storage from '@/scripts/storage'

const props = defineProps<{
  uri: string | number
}>()
// const href = props.uri.toString()
let content = ref('')
storage.getArticleByUri(props.uri as string).then((article) => {
  content.value = article?.content as string
})
</script>

<template>
  <div>
    <!-- <a :href="href" target="_blank">{{ href }}</a> -->
    <p v-html="content"></p>
  </div>
</template>

<style scoped>
div {
  border: double;
}
</style>
