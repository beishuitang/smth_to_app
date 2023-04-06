<script setup lang="ts">
import { useUsersDataStore } from '@/stores/usersDataStore'
import { watch, ref, computed } from 'vue'
import storage from '@/scripts/storage'
import UserTags from './article/tags/UserTags.vue'
const props = defineProps<{
  show?: {
    id: boolean
    majia: boolean
    majiaTags: boolean
  }
  msg?: string
  filter?: {
    searchText: string
    score: number
  }
  userId: string | number
}>()
const showState = props.show
  ? props.show
  : {
      id: true,
      majia: true,
      majiaTags: false
    }
const userDataStore = useUsersDataStore()
const userData = userDataStore.usersData[props.userId]
const majias = userData.majias
watch(majias, updateRelativeIds, { immediate: true })
function updateRelativeIds() {
  const result = [userData.id]
  for (let index = 0; index < result.length; index++) {
    const id = result[index]
    const relativeMajias = userDataStore.getUserById(id).majias
    for (let j = 0; j < relativeMajias.length; j++) {
      const relativeMajia = relativeMajias[j]
      addMajia(result, relativeMajia)
    }
  }
  result.shift()
  userData.relativeIDs = result
}
const tempID = ref('')
const showMajiaModifier = ref(false)
const showUser = computed(() => {
  if (!props.filter) {
    return true
  }
  if (props.filter.searchText === '') {
    return Object.keys(userData.tags).length !== 0
  }
  let reg = new RegExp(props.filter.searchText, 'ig')
  if (userData.score * props.filter.score < 0) {
    return false
  }
  if (userData.id.match(reg)) {
    return true
  }
  if (
    userData.relativeIDs.some((id) => {
      return id.match(reg)
    })
  ) {
    return true
  }
  let tags = userData.tags
  for (const tagName in tags) {
    if (Object.prototype.hasOwnProperty.call(tags, tagName)) {
      if (tagName.match(reg)) {
        return true
      }
    }
  }
  return false
})
watch(userData.majias, () => {
  userData.t_m = Date.now()
  storage.saveUserData(JSON.parse(JSON.stringify(userData)))
})
watch(
  () => {
    return {
      showUser: userData.state.showUser,
      showTags: userData.state.showTags,
      showContent: userData.state.showContent
    }
  },
  (state, oldState) => {
    userData.t_s = Date.now()
    storage.saveUserData(JSON.parse(JSON.stringify(userData)))
    if (state.showUser !== oldState.showUser) {
      switchUserElShowState(userData.id, state.showUser)
      for (let index = 0; index < userData.relativeIDs.length; index++) {
        const majiaID = userData.relativeIDs[index]
        const majiaState = userDataStore.getUserById(majiaID).state
        if (state.showUser !== majiaState.showUser) {
          majiaState.showUser = state.showUser
          switchUserElShowState(majiaID, state.showUser)
        }
      }
    }
  }
)
function switchUserElShowState(id: string, showUser: boolean) {
  document.querySelectorAll<HTMLElement>('table.article.' + userData.id).forEach((el) => {
    el.style.display = showUser ? 'table' : 'none'
  })
}
function majiaFunc(func: 'add' | 'del') {
  const id = tempID.value.trim()
  if (id === '') return
  const majias2 = userDataStore.getUserById(id).majias
  if (func === 'add') {
    addMajia(majias, id)
    addMajia(majias2, userData.id)
  } else {
    delMajia(majias, id)
    delMajia(majias2, userData.id)
  }
}
function addMajia(majias: string[], majia: string) {
  !majias.includes(majia) && majias.push(majia)
}
function delMajia(majias: string[], majia: string) {
  const index = majias.indexOf(majia)
  index !== -1 && majias.splice(index, 1)
}
</script>
<template>
  <div v-show="showUser">
    <h3>
      <span v-if="showState.id"> {{ userData.id }} ({{ userData.score }}) </span>
      <span v-if="showState.majia" @click="showMajiaModifier = !showMajiaModifier">
        [{{ userData.relativeIDs.join(' ') }}]
      </span>
      <input type="checkbox" v-model="userData.state.showUser" />
      <form v-if="showMajiaModifier" @submit.prevent="majiaFunc('add')">
        <button type="button" @click.prevent="majiaFunc('del')">删除</button>
        <input type="text" v-model="tempID" :placeholder="majias.join(' ')" />
        <button type="submit">添加</button>
      </form>
    </h3>
    <UserTags :tags="userData.tags"></UserTags>
    <div v-if="showState.majiaTags">
      <UserTags
        v-for="id in userData.relativeIDs"
        :tags="userDataStore.getUserById(id).tags"
        :key="id"
      ></UserTags>
    </div>
  </div>
</template>
