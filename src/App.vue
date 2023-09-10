<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore'
import appContainer from '@/scripts/appContainer'
import MenuSetting from '@/components/MenuSetting.vue'
import UserPanel from '@/components/UserPanel.vue'
import ModifierSwitch from '@/components/article/tags/ModifierSwitch.vue'
import UserDataBundle from '@/components/article/UserDataBundle.vue'
import UserInfo from '@/components/article/UserInfo.vue'
import SettingPanel from '@/components/SettingPanel.vue'

const info_arr = useAppStateStore().appState.articleInfoArr
</script>

<template>
  <div>
    <Teleport to="#menu">
      <MenuSetting />
    </Teleport>
    <UserPanel />
    <SettingPanel />
    <div id="articles" style="display: none;">
      <div class="smth-article" v-for="(info, index) in info_arr" :key="index">
        <Teleport :to="appContainer.articleEls[index].userInfoEl">
          <UserInfo :article-info="info" />
        </Teleport>
        <Teleport :to="appContainer.articleEls[index].modifierSwitchEl">
          <ModifierSwitch :article-info="info" />
        </Teleport>
        <Teleport :to="appContainer.articleEls[index].userDataBundleEl">
          <UserDataBundle :article-info="info" />
        </Teleport>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
