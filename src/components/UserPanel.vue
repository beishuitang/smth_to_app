<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore'
import { useUsersDataStore } from '@/stores/usersDataStore'
import { reactive } from 'vue'
import SingleUser from './SingleUser.vue'
const filter = reactive({
  searchText: '',
  score: 0
})
const usersData = useUsersDataStore().usersData
let showState = useAppStateStore().appState.showState
</script>
<template>
  <div
    style="height: 100%; min-width: 13rem"
    id="smth_mark_id_panel"
    :class="{ display: showState.showPanel }"
  >
    <div>
      <SingleUser
        class="border"
        v-for="(userData, id) in usersData"
        :key="id"
        :user-id="id"
        :filter="filter"
      />
      <br />
    </div>
    <div class="search">
      <input type="text" placeholder="搜索" v-model="filter.searchText" />
      <select v-model.number="filter.score" style="height: 2rem">
        <option disabled>id评分</option>
        <option value="1">正分</option>
        <option value="0">全部</option>
        <option value="-1">负分</option>
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
  overflow-y: scroll;
  z-index: 1;

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
