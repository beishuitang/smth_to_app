<script setup lang="ts">
import { useUsersDataStore } from '@/stores/usersDataStore'
import { watch } from 'vue'
import storage from '@/scripts/storage'
import UserTags from './article/tags/UserTags.vue'
const props = defineProps<{
  msg?: string
  userId: string | number
}>()
const userData = useUsersDataStore().usersData[props.userId]
watch(userData.state, (state) => {
  storage.saveUserData(JSON.parse(JSON.stringify(userData)))
  document.querySelectorAll<HTMLElement>('table.article.' + userData.id).forEach((el) => {
    el.style.display = state.showUser ? 'table' : 'none'
  })
})
</script>
<template>
  <div>
    <h3>
      {{ userData.id }} ({{ userData.score }})
      <input type="checkbox" v-model="userData.state.showUser" />
    </h3>
    <UserTags :tags="userData.tags"></UserTags>
  </div>
</template>
