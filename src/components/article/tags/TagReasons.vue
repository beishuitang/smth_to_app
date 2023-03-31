<script setup lang="ts">
import SingleReason from './SingleReason.vue'
import type { TagUriAndScore } from '@/scripts/class/UserData'

defineProps<{
  tagUris: TagUriAndScore
}>()
</script>
<template>
  <div>
    <SingleReason v-for="(score, uri) in tagUris" :uri="uri" :key="uri"> </SingleReason>
  </div>
</template>

<style scoped></style>
