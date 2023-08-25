<script setup lang="ts">
import cachedMajiaStore from '@/stores/cachedMajiaStore'
import SingleMajia from './SingleMajia.vue'
const props = defineProps<{
  msg?: string
  userId: string
}>()
</script>

<template>
  <SingleMajia
    v-for="majia in cachedMajiaStore.get(props.userId).relativeIDs"
    :key="majia"
    :user-id="majia"
  />
</template>

<style scoped></style>
