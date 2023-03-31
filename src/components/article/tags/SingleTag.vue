<script setup lang="ts">
import { ref } from 'vue'
import type { UserTag } from '@/scripts/class/UserData'
import TagReasons from './TagReasons.vue'

defineProps<{
  tagName: string | number
  singleTag: UserTag
}>()
const showReasons = ref(false)
</script>
<template>
  <a>
    <span @click="showReasons = !showReasons">{{ tagName }}({{ singleTag.score }}) </span>
  </a>
  <TagReasons :tagUris="singleTag.tagUris" v-if="showReasons" />
</template>

<style scoped></style>
