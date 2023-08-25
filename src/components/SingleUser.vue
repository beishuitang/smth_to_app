<script setup lang="ts">
import cachedTagStore from '@/stores/cachedTagStore'
import stateStore from '@/stores/stateStore'
import cachedMajiaStore from '@/stores/cachedMajiaStore'
import UserTags from './article/tags/UserTags.vue'
import { ref } from 'vue'
import majiaStore from '@/stores/majiaStore'
const props = defineProps<{
  msg?: string
  userId: string
}>()

const userData = cachedTagStore.record[props.userId]
const userstate = stateStore.get(props.userId)
const userMajias = cachedMajiaStore.get(props.userId)

const tempID = ref('')
const showMajiaModifier = ref(false)
async function majiaFunc(func: 'add' | 'del') {
  const id = tempID.value.trim()
  if (id === '') return
  const pair = await majiaStore.getByID(props.userId, tempID.value)
  if (func === 'add') {
    if (!pair.state) pair.enable()
    userMajias.addMajia(tempID.value)
  } else {
    if (pair.state) pair.disable()
    userMajias.delMajia(tempID.value)
  }
}
</script>
<template>
  <div>
    <h3>
      <span> {{ userData.id }} ({{ userData.score }}) </span>
      <span @click="showMajiaModifier = !showMajiaModifier">
        [{{ userMajias.relativeIDs.join(' ') }}]
      </span>
      <input type="checkbox" :checked="userstate.showUser()" @click="userstate.switchShowUser" />
      <form v-if="showMajiaModifier" @submit.prevent="majiaFunc('add')">
        <button type="button" @click.prevent="majiaFunc('del')">删除</button>
        <input
          type="text"
          v-model="tempID"
          :placeholder="userMajias.majias.length == 0 ? '马甲' : userMajias.majias.join(' ')"
        />
        <button type="submit">添加</button>
      </form>
    </h3>
    <UserTags :user-id="props.userId"></UserTags>
    <!-- <div v-if="showState.majiaTags">
      <UserTags
        v-for="id in userData.relativeIDs"
        :tags="userDataStore.getUserById(id).tags"
        :key="id"
      ></UserTags>
    </div> -->
  </div>
</template>
