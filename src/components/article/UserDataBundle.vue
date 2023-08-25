<script setup lang="ts">
import type { ArticleInfo } from '@/stores/appStateStore'
import TagModifier from './tags/TagModifier.vue'
import UserMajias from './UserMajias.vue'
import UserTags from './tags/UserTags.vue'
import stateStore from '@/stores/stateStore'
const props = defineProps<{
  msg?: string
  articleInfo: ArticleInfo
}>()
const userState = stateStore.get(props.articleInfo.userId)
</script>

<template>
  <div>
    <UserMajias :user-id="articleInfo.userId" />
    <UserTags v-if="userState.showTag()" :user-id="articleInfo.userId" />
    <Suspense>
      <TagModifier v-if="articleInfo.showModifier" v-bind="articleInfo" />
    </Suspense>
  </div>
</template>
<style></style>
