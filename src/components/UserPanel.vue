<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore'
import cachedTagStore from '@/stores/cachedTagStore'
import userStateStore from '@/stores/stateStore'
import cachedMajiaStore from '@/stores/cachedMajiaStore'
import { computed, reactive } from 'vue'
import SingleUser from './SingleUser.vue'
import type { CachedTags } from '@/interface/CachedTags'
const filter = reactive({
  searchText: '',
  score: 1,
  source: 'local' as 'local' | 'smth.top'
})

const usersData = computed(() => {
  return Object.values(cachedTagStore.record)
    .filter((userData) => {
      return display(userData)
    })
    .sort((userData1, userData2) => {
      const state1 = userStateStore.get(userData1.id).showUser()
      const state2 = userStateStore.get(userData2.id).showUser()
      if (state1 !== state2) {
        return (state2 ? 1 : -1) * filter.score
      } else {
        return (userData2.score - userData1.score) * filter.score
      }
    })
})
const showState = useAppStateStore().appState.showState
function display(userData: CachedTags) {
  if (userData.id === '') return false
  if (userData.id === filter.searchText) return true
  const tagNames = Object.keys(userData.tags)
  if (tagNames.length === 0) return false
  let reg = new RegExp(filter.searchText, 'ig')
  if (userData.id.match(reg)) return true
  if (
    cachedMajiaStore.get(userData.id).relativeIDs.some((id) => {
      return id.match(reg)
    })
  )
    return true
  if (
    tagNames.some((tagName) => {
      return tagName.match(reg)
    })
  )
    return true
  return false
}
</script>
<template>
  <div
    style="height: 100%; min-width: 13rem"
    id="smth_mark_id_panel"
    :class="{ display: showState.state === 1 }"
  >
    <div v-show="filter.source === 'local'">
      <div v-for="userData of usersData" :key="userData.id">
        <SingleUser class="border" :user-id="userData.id" />
      </div>
    </div>
    <div v-show="filter.source === 'smth.top'">由于本青拖延症，该页面迟迟未开发。。。。。。</div>
    <div class="search">
      <input type="text" placeholder="搜索" v-model="filter.searchText" />
      <select v-model.number="filter.score" style="height: 2rem">
        <option disabled>排序</option>
        <option value="1">正序</option>
        <option value="-1">倒序</option>
      </select>
      <select v-model.number="filter.source" style="height: 2rem">
        <option disabled>来源</option>
        <option value="local">本地</option>
        <option value="smth.top">smth.top</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
#smth_mark_id_panel {
  position: fixed;
  bottom: 0;
  background-color: aliceblue;
  right: -100%;
  width: 100%;
  overflow-y: scroll;
  z-index: 3;
  -webkit-transition: right 0.5s;
  transition: right 0.5s;
}

.border {
  border: double;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
}

.search {
  position: fixed;
  bottom: 0;
}

slide-right-enter,
#smth_mark_id_panel.display {
  right: 0%;
}
</style>
