<script setup lang="ts">
import { useUsersDataStore } from '@/stores/usersDataStore'
import type { UserData } from '@/scripts/class/UserData'
import SingleMajia from './SingleMajia.vue'
// import { getIpData } from "@/scripts/ipHelper";
defineProps<{
  msg?: string
  userData: UserData
}>()
const userDataStore = useUsersDataStore()
</script>

<template>
  <SingleMajia
    v-for="majia in userData.relativeIDs"
    :key="majia"
    :user-data="userDataStore.getUserById(majia)"
  />
</template>

<style scoped></style>
