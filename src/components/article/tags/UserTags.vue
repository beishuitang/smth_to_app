<script setup lang="ts">
import type { UserTags } from '@/scripts/class/UserData'
import SingleTag from './SingleTag.vue'
defineProps<{
  tags: UserTags
}>()
</script>

<template>
  <div>
    <SingleTag v-for="(tag, tagName) in tags" :singleTag="tag" :tagName="tagName" :key="tagName" />
  </div>
</template>

<style scoped></style>
