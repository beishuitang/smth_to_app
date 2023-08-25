<script setup lang="ts">
import { reactive } from 'vue'

defineProps<{
  uri: string | number
}>()
// const href = props.uri.toString()
const contents = reactive([] as string[])
// storage.get(props.uri as string, 'articleTable').then((article) => {
//   article?.content.forEach((c) => {
//     contents.push(c)
//   })
// })
</script>

<template>
  <div>
    <!-- <a :href="href" target="_blank">{{ href }}</a> -->
    <p
      class="tag-reason"
      v-for="(content, index) of contents"
      v-bind:key="index"
      v-html="content"
    ></p>
  </div>
</template>

<style>
.tag-reason img.resizeable {
  width: unset !important;
}
</style>

<style scoped>
div {
  border: dashed;
}
</style>
