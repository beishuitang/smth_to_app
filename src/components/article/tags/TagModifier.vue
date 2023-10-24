<script setup lang="ts">
import tagStore from '@/stores/tagStore'
import articleStore from '@/stores/articleStore'
import imgStore from '@/stores/imgStore'
import { ref, computed } from 'vue'
import staticApp from '@/staticApp'
import cachedTagStore from '@/stores/cachedTagStore'
import smthScriptConfig from '@/scripts/smthScriptConfig'
const props = defineProps<{
  msg?: string
  userId: string
  articleId: string
  articleUri: string
  content: string
  p: HTMLParagraphElement
}>()

const commonTags = smthScriptConfig.customTags
const articleTags = await tagStore.get(props.articleUri, props.userId)
const cache = cachedTagStore.get(props.userId)
const tagName = ref('')
const currentTags = computed(() => {
  return JSON.stringify(articleTags.tags).replace(/\{|\}/g, '')
})

async function del() {
  articleTags.del(tagName.value)
  const articles = await tagStore.getByID(props.userId)
  cache.recompute(Object.values(articles))
}
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
  <div class="modifier">
    <div class="commonTags">
      <span v-for="(info, name) in commonTags" :key="name">
        <label
          v-if="info.use"
          :class="{ positive: info.score === 1, negative: info.score === -1 }"
          @click="
          () => {
            tagName=name as string
            modify(info.score)
          }
        "
        >
          {{ name }}
        </label>
      </span>
    </div>
    <form @submit.prevent="modify(-1)">
      <input type="text" v-model.trim="tagName" :placeholder="currentTags" />
      <span>({{ articleTags.tags[tagName] }})</span>
      <button type="button" @click.prevent="modify(1)" class="positive">赞</button>
      <button type="submit" class="negative">踩</button>
      <button
        type="button"
        @click.prevent="del()"
        :disabled="articleTags.tags[tagName] === undefined"
      >
        清除
      </button>
    </form>
  </div>
</template>
<style scoped>
.modifier {
  margin: 1rem 0.5rem;
}
.commonTags::before {
  content: '常用标签:';
}
</style>
