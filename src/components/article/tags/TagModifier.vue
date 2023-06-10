<script setup lang="ts">
import { UserData, type UserTags } from '@/scripts/class/UserData'
import storage from '@/scripts/storage'
import { ref, computed } from 'vue'
import { useUsersDataStore } from '@/stores/usersDataStore'
const props = defineProps<{
  msg?: string
  userId: string
  articleId: string
  articleUri: string
  content: string
  p: HTMLParagraphElement
}>()

const saveUserData = useUsersDataStore().saveUserData
const idData = useUsersDataStore().getUserById(props.userId)
const tags: UserTags = idData.tags
const tagName = ref('')
const currentScore = computed(() => {
  return tags[tagName.value]?.tagUris[props.articleUri]
})
const currentTags = computed(() => {
  return JSON.stringify(currentTagsObject.value).replace(/\{|\}/g, '')
})
type tagsObject = { [key: string]: number }
const currentTagsObject = computed(() => {
  const result: tagsObject = {}
  for (const tagName in tags) {
    if (Object.prototype.hasOwnProperty.call(tags, tagName)) {
      const tag = tags[tagName]
      if (Object.prototype.hasOwnProperty.call(tag.tagUris, props.articleUri)) {
        result[tagName] = tag.tagUris[props.articleUri]
      }
    }
  }
  return result
})
async function modify(step: number) {
  UserData.addModify(idData, tagName.value, step, props.articleUri)
  const article = await storage.getArticleByUri(props.articleUri)
  const contents = article ? article.content : []
  contents.includes(props.content) || contents.push(props.content)
  await storage.saveArticle({
    articleUri: props.articleUri,
    content: contents,
    id: props.userId,
    t: Date.now()
    // tags: currentTagsObject.value
  })
  saveUserData(idData)
  const imgEls = props.p.querySelectorAll('img')
  for (let index = 0; index < imgEls.length; index++) {
    const imgEl = imgEls[index]
    if (imgEl.src.startsWith('https://www.newsmth.net/nForum/')) {
      const imgUri = imgEl.src.replace(/\/large$/, '')
      const response = await fetch(imgUri)
      if (response.status !== 200) {
        return
      }
      const blob = await response.blob()
      await storage.saveImg({ imgUri: imgUri, data: blob })
    } else if (imgEl.src.startsWith('https://static.newsmth.net/nForum/')) {
      {
        //TODO
      }
    }
  }
}
</script>
<template>
  <div>
    <form @submit.prevent="modify(-1)">
      <input type="text" v-model.trim="tagName" :placeholder="currentTags" />
      <span>({{ currentScore }})</span>
      <button type="button" @click.prevent="modify(1)">赞</button>
      <button type="submit">踩</button>
      <!-- <button type="button" @click.prevent="del()" v-if="currentScore === 0">清除</button> -->
    </form>
  </div>
</template>
<style scoped></style>
