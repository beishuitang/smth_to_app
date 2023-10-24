<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import config from '@/scripts/smthScriptConfig'

const tags = reactive(config.customTags)

const tempTag = ref('')
function modify(score: 1 | 0 | -1) {
  const t = tempTag.value.trim()
  if (t === '') return
  if (score === 0) delete tags[tempTag.value]
  else tags[tempTag.value] = { score: score, use: true }
}

watch(tags, () => {
  config.saveConfig()
})
</script>

<template>
  <div>
    <h3>预定义标签</h3>
    <div>
      <label v-for="(info, name) in tags" :key="name" :class="{ checked: info.use }">
        <span :class="{ positive: info.score === 1, negative: info.score === -1 }">
          <input type="checkbox" :value="name" v-model="info.use" />
          {{ name }}
        </span>
      </label>
      <br />
    </div>
    <div>
      <form @submit.prevent="modify(-1)">
        <input type="text" placeholder="自定义标签" v-model="tempTag" />
        <!-- <span>()</span> -->
        <button class="positive" type="button" @click.prevent="modify(1)">赞</button>
        <button class="negative" type="submit">踩</button>
        <button type="button" :disabled="!tags[tempTag]" @click.prevent="modify(0)">删除</button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
