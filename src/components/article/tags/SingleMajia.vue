<script setup lang="ts">
import type { UserData } from '@/scripts/class/UserData'
import UserTags from './UserTags.vue'
import { ref } from 'vue'
defineProps<{
  msg?: string
  userData: UserData
}>()
const show = ref(false)
</script>

<template>
  <span @click="show = !show"
    >{{ userData.id }}({{ userData.score == 0 ? '' : userData.score }})
  </span>
  <UserTags v-if="show" :tags="userData.tags" />
</template>

<style scoped></style>
