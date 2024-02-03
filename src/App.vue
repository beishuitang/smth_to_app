<script setup lang="ts">
import MenuSetting from '@/components/MenuSetting.vue'
import UserPanel from '@/components/UserPanel.vue'
import SettingPanel from '@/components/SettingPanel.vue'
import ArticleInfo from '@/components/ArticleInfo.vue'
</script>

<template>
  <div>
    <Teleport to="#menu">
      <MenuSetting />
    </Teleport>
    <UserPanel />
    <SettingPanel />
    <ArticleInfo />
  </div>
</template>

<style scoped></style>
