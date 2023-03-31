import { reactive } from 'vue'
import { defineStore } from 'pinia'
import smthScriptConfig from '@/scripts/smthScriptConfig'

export const useConfigStore = defineStore('config', () => {
  const config = reactive(smthScriptConfig)
  return { config }
})
