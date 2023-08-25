<script setup lang="ts">
import { ref } from 'vue'
// import TagReasons from './TagReasons.vue'

defineProps<{
  tagName: string | number
  score: number
}>()
const showReasons = ref(false)
</script>
<template>
  <a>
    <span @click="showReasons = !showReasons">{{ tagName }}({{ score }}) </span>
  </a>
  <!-- <TagReasons :tagUris="singleTag.tagUris" v-if="showReasons" /> -->
</template>

<style scoped></style>
