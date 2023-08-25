<script setup lang="ts">
import ipInfoStore from '@/stores/ipInfoStore'
// import userIPsStore from '@/stores/userIPsStore'
const props = defineProps<{
  msg?: string
  userId: string
  ip: string
}>()
// const ipArr = await userIPsStore.get(props.userId)
function updateIp() {}
</script>
<template>
  <span @click="updateIp">{{ '@' + ipInfoStore.getIpInfo(props.ip) }}</span>
</template>
<style scoped></style>
