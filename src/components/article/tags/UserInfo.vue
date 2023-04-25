<script setup lang="ts">
import { useUsersDataStore } from '@/stores/usersDataStore'
import { useAppStateStore } from '@/stores/appStateStore'
import { computed } from 'vue'
// import { getIpData } from "@/scripts/ipHelper";
const props = defineProps<{
  msg?: string
  articleIndex?: number
  userId?: string
}>()
const articleInfo = useAppStateStore().appState.articleInfoArr[props.articleIndex ?? 0]
const score = computed(
  () => useUsersDataStore().getUserById(props.userId ?? articleInfo.userId).score
)
function switchUserTags() {
  const state = useUsersDataStore().getUserById(props.userId ?? articleInfo.userId).state
  state.showTags = !state.showTags
}
function updateIp() {
  // if (articleInfo.ip == undefined) return
  // getIpData(articleInfo.ip.replace("*","1"), (result) => {
  //   articleInfo.ipInfo = result.city
  // })
}
</script>

<template>
  <span @click="updateIp">{{ articleInfo.ipInfo ? '@' + articleInfo.ipInfo : '' }}</span>
  <span @click="switchUserTags">{{ score == 0 ? '' : '(' + score + ')' }}</span>
</template>

<style scoped></style>
