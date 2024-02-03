<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore'
import ModifierSwitch from '@/components/article/tags/ModifierSwitch.vue'
import UserDataBundle from '@/components/article/UserDataBundle.vue'
import UserInfo from '@/components/article/UserInfo.vue'
const info_arr = useAppStateStore().appState.articleInfoArr
</script>

<template>
  <div style="display: none">
    <div v-for="(info, index) in info_arr" :key="index">
      <Teleport :to="info.userInfoEl">
        <UserInfo :article-info="info" />
      </Teleport>
      <Teleport :to="info.modifierSwitchEl">
        <ModifierSwitch :article-info="info" />
      </Teleport>
      <Teleport :to="info.userDataBundleEl">
        <UserDataBundle :article-info="info" />
      </Teleport>
    </div>
  </div>
</template>

<style scoped></style>
