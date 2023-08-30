<script setup lang="ts">
import cacheStore from '@/stores/cachedTagStore'
import ArticleTags from './ArticleTags.vue'
import { ref, watch } from 'vue'
const props = defineProps<{
  userId: string
}>()
const checkedNames = ref([] as string[])
watch(props, () => {
  checkedNames.value.splice(0)
})
</script>

<template>
  <div>
    <a
      v-for="(score, tagName) in cacheStore.get(props.userId).tags"
      :key="tagName"
      @click="
        checkedNames.includes(tagName as string)
          ? checkedNames.splice(checkedNames.indexOf(tagName as string), 1)
          : checkedNames.push(tagName as string)
      "
    >
      <span :class="[checkedNames.includes(tagName as string) ? 'checked' : 'unchecked']">
        {{ tagName }}({{ score }})
      </span>
    </a>
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

.checked {
  background-color: lightgray;
}

/* .unchecked { */
/* } */
</style>
