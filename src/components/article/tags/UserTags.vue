<script setup lang="ts">
import cacheStore from '@/stores/cachedTagStore'
import ArticleTags from './ArticleTags.vue'
import { ref, watch } from 'vue'
const props = defineProps<{
  userId: string
}>()
const checkedNames = ref([])
watch(props, () => {
  checkedNames.value.splice(0)
})
</script>

<template>
  <div>Checked names: {{ checkedNames }}</div>
  <div>
    <label v-for="(score, tagName) in cacheStore.get(props.userId).tags" :key="tagName">
      <input type="checkbox" :key="tagName" :value="tagName" v-model="checkedNames" />
      {{ tagName }}({{ score }})
    </label>
  </div>
  <Suspense>
    <div v-if="checkedNames.length > 0">
      <ArticleTags :user-id="props.userId" :tag-names="checkedNames" />
    </div>
  </Suspense>
</template>

<style scoped>
input[type='checkbox'] {
  display: none;
}
</style>
