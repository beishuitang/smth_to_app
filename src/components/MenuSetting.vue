<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore'
import { watch } from 'vue'
import menuUtils from '@/scripts/menuUtils'
defineProps<{
  msg?: string
}>()
let showState = useAppStateStore().appState.showState
menuUtils.init()
watch(
  () => showState.showMenu,
  (showMenu) => {
    menuUtils.switchMenu(showMenu ? 'show' : 'hide')
  }
)
</script>

<style>
html body #menu {
  float: unset;
  background-color: aliceblue;
  position: fixed;
  margin: 0.2rem 0 0 0.3rem;
  z-index: 100;
  bottom: 0rem;
  left: -100%;

  -webkit-transition: left 0.4s;
  transition: left 0.4s;
}

html body #menu.display {
  left: 0%;
}
</style>
