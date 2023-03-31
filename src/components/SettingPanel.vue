<script lang="ts" setup>
import { useConfigStore } from '@/stores/configStore'
import { useAppStateStore } from '@/stores/appStateStore'
import { watch } from 'vue'
import BackUp from './BackUp.vue'
let showState = useAppStateStore().appState.showState
const config = useConfigStore().config
const { mainpageConfig, cssConfig, frameConfig, simplifyConfig } = config
watch(config, () => {
  config.saveConfig()
})
watch(
  () => cssConfig.fontSize,
  (fontSize) => {
    const style = document.querySelector('html')?.style
    style != undefined && style.setProperty('font-size', fontSize + 'px')
  }
)
</script>
<template>
  <div id="setting" v-if="showState.showSetting" style="width: fit-content; height: fit-content">
    <div>
      <div>
        <h3>显示</h3>
        <div>
          <label v-for="el in frameConfig.component" :key="el.name" :class="{ checked: el.show }">
            {{ el.name }}
            <input type="checkbox" :el-css-display="el.el" v-model="el.show" />
          </label>
        </div>
      </div>
      <br />
      <div>
        <h3>
          字体大小:<span> {{ cssConfig.fontSize }} </span>
        </h3>
        <button @click="cssConfig.fontSize--">减小字体</button>
        <button @click="cssConfig.fontSize++">增大字体</button>
      </div>
      <br />
      <div>
        <h3>首页</h3>
        <div>
          <label v-for="el in mainpageConfig.section" :key="el.name" :class="{ checked: el.show }">
            {{ el.name }}
            <input type="checkbox" :el-css-display="el.el" v-model="el.show" />
          </label>
        </div>
      </div>
      <br />
      <div>
        <h3>精简模式</h3>
        <label :class="{ checked: simplifyConfig.simplify }">
          开启精简模式
          <input type="checkbox" v-model="simplifyConfig.simplify" />
        </label>
        <div v-if="simplifyConfig.simplify">
          <label v-for="el in simplifyConfig.func" :key="el.name" :class="{ checked: el.show }">
            {{ el.name }}
            <input type="checkbox" :el-css-display="el.el" v-model="el.show" />
          </label>
        </div>
      </div>
      <br />
      <BackUp />
    </div>

    <span
      class="button"
      @click="showState.showSetting = !showState.showSetting"
      style="float: right"
      >取消</span
    >
    <span> </span>
    <span class="button" onclick="window.location.reload()" style="float: right">应用</span>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#setting {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  margin: auto;
  background-color: #f3f5fc;
  padding: 1rem;
  z-index: 1;
}

.button {
  background-color: #4caf50;
  /* Green */
  border: none;
  color: white;
  padding: 0.4rem 1.2rem;
  margin: 0.5rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.2rem;
}

label {
  margin-right: 1rem;
  display: inline-block;
  border: outset;
}

label.checked {
  border: inset;
}
</style>
