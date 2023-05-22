<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore'
import { useUsersDataStore } from '@/stores/usersDataStore'
import { computed, reactive } from 'vue'
import SingleUser from './SingleUser.vue'
const filter = reactive({
  searchText: '',
  score: 1,
  source: 'local' as 'local' | 'smth.top'
})
const usersData = computed(() => {
  const arr = Object.values(useUsersDataStore().usersData)
  arr.sort((userData1, userData2) => {
    if (userData1.state.showUser !== userData2.state.showUser) {
      return (userData2.state.showUser ? 1 : -1) * filter.score
    } else {
      return (userData2.score - userData1.score) * filter.score
    }
  })
  return arr
})
let showState = useAppStateStore().appState.showState
</script>
<template>
  <div
    style="height: 100%; min-width: 13rem"
    id="smth_mark_id_panel"
    :class="{ display: showState.showPanel }"
  >
    <div v-show="filter.source === 'local'">
      <SingleUser
        class="border"
        v-for="userData in usersData"
        :key="userData.id"
        :user-id="userData.id"
        :filter="filter"
      />
      <br />
    </div>
    <div v-show="filter.source === 'smth.top'">由于本青拖延症，该页面迟迟未开发。。。。。。</div>
    <div class="search">
      <input type="text" placeholder="搜索" v-model="filter.searchText" />
      <select v-model.number="filter.score" style="height: 2rem">
        <option disabled>排序</option>
        <option value="1">正分</option>
        <option value="-1">负分</option>
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
  padding: 0.5rem 1rem 0.5rem 1rem;
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
