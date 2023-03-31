<script setup lang="ts">
import { useUsersDataStore } from '@/stores/usersDataStore'
import { useAppStateStore } from '@/stores/appStateStore'
// import MaJia from "./MaJia.vue";
import UserTags from './UserTags.vue'
import TagModifier from './TagModifier.vue'
import { computed } from 'vue'
const props = defineProps<{
  msg?: string
  articleIndex: number
}>()
const articleInfo = useAppStateStore().appState.articleInfoArr[props.articleIndex]
const topicState = useAppStateStore().appState.topicState
const articleUri = computed(
  () => topicState.board + '/' + topicState.topicId + '/' + articleInfo.articleId
)
</script>

<template>
  <UserTags
    :tags="useUsersDataStore().getUserById(articleInfo.userId).tags"
    v-if="useUsersDataStore().getUserById(articleInfo.userId).state.showTags"
  />
  <TagModifier
    :userId="articleInfo.userId"
    :articleId="articleInfo.articleId"
    :articleUri="articleUri"
    :content="articleInfo.content"
    v-if="articleInfo.showModifier"
  />
  <!-- <MaJia :majias="idData.majias" /> -->
</template>
<style></style>
