<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore'
const props = defineProps<{
  msg?: string
  articleIndex: number
}>()
function modifierSwitch() {
  const info = useAppStateStore().appState.articleInfoArr[props.articleIndex]
  info.showModifier = !info.showModifier
}
</script>
<template>
  <samp class="ico-pos-switch"></samp>
  <a @click="modifierSwitch()">标记</a>
</template>
<style scoped>
.ico-pos-switch {
  background-position: -21.2rem -0.2rem;
}
</style>
