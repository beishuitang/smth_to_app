<script setup lang="ts">
import type { ArticleInfo } from '@/stores/appStateStore'
const props = defineProps<{
  msg?: string
  articleInfo: ArticleInfo
}>()
function modifierSwitch() {
  const info = props.articleInfo
  info.showModifier = !info.showModifier
}
</script>
<template>
  <li>
    <samp class="ico-pos-switch"></samp>
    <a @click="modifierSwitch()">标记</a>
  </li>
</template>
<style scoped>
.ico-pos-switch {
  background-position: -21.2rem -0.2rem;
}
</style>
