<script setup lang="ts">
import tagStore from '@/stores/tagStore'
import articleStore from '@/stores/articleStore'
import imgStore from '@/stores/imgStore'
import { ref, computed } from 'vue'
import staticApp from '@/staticApp'
import cachedTagStore from '@/stores/cachedTagStore'
const props = defineProps<{
  msg?: string
  userId: string
  articleId: string
  articleUri: string
  content: string
  p: HTMLParagraphElement
}>()

const articleTags = await tagStore.get(props.articleUri, props.userId)
const cache = cachedTagStore.get(props.userId)
const tagName = ref('')
const currentTags = computed(() => {
  return JSON.stringify(articleTags.tags).replace(/\{|\}/g, '')
})

function modify(step: number) {
  cache.modify(tagName.value, step)
  articleTags.modify(tagName.value, step)
  saveArticle()
  saveImg()
}
function saveArticle() {
  articleStore.get(props.articleUri, props.userId).then((article) => {
    article.addContent(props.content)
  })
}
function saveImg() {
  const imgEls = props.p.querySelectorAll('img')
  const srcs = []
  for (let index = 0; index < imgEls.length; index++) {
    const imgEl = imgEls[index]
    if (imgEl.src.startsWith('https://www.newsmth.net/nForum/')) {
      const imgUri = imgEl.src.replace(/\/large$/, '')
      imgStore.get(imgUri).then(async (img) => {
        if (!img.imgBlob) {
          const response = await fetch(imgUri)
          //TODO 缓存？重定向?
          if (response.status !== 200) {
            return
          }
          const data = await response.blob()
          img.addImgData(data)
        }
      })
    } else if (
      imgEl.src.startsWith('https://static.newsmth.net/nForum/') ||
      imgEl.src.startsWith('https://static.mysmth.net/nForum/')
    ) {
      srcs.push(imgEl.src)
    }
  }
  staticApp.openUrl(srcs)
}
</script>
<template>
  <div>
    <form @submit.prevent="modify(-1)">
      <input type="text" v-model.trim="tagName" :placeholder="currentTags" />
      <span>({{ articleTags.tags[tagName] }})</span>
      <button type="button" @click.prevent="modify(1)">赞</button>
      <button type="submit">踩</button>
      <!-- <button type="button" @click.prevent="del()" v-if="articleTags.tags[tagName] === 0">
        清除
      </button> -->
    </form>
  </div>
</template>
<style scoped></style>
