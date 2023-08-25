<script setup lang="ts">
import cacheStore from '@/stores/cachedTagStore'
import UserTags from './tags/UserTags.vue'
import { ref } from 'vue'
const props = defineProps<{
  msg?: string
  userId: string
}>()
const show = ref(false)
const cache = cacheStore.get(props.userId)
</script>

<template>
  <span @click="show = !show">{{ userId }}({{ cache.score == 0 ? '' : cache.score }}) </span>
  <UserTags v-if="show" :user-id="props.userId" />
</template>

<style scoped></style>
