<script lang="ts" setup>
import smthScriptConfig from '@/scripts/smthScriptConfig'
import { useAppStateStore } from '@/stores/appStateStore'
import { watch, reactive } from 'vue'
import BackUp from './BackUp.vue'
import IPDB from './IPDB.vue'
import CommonTags from './CommonTags.vue'
const showState = useAppStateStore().appState.showState
const config = reactive(smthScriptConfig)
const { mainpageConfig, cssConfig, frameConfig, simplifyConfig } = config
const originFontSize = cssConfig.fontSize
watch(() => cssConfig.fontSize, setBaseFontSize)
function apply() {
  config.saveConfig()
  window.location.reload()
}
function cancle() {
  showState.showSetting = !showState.showSetting
  if (originFontSize !== cssConfig.fontSize) {
    cssConfig.fontSize = originFontSize
    setBaseFontSize(originFontSize)
  }
}
function setBaseFontSize(fontSize: number) {
  document.querySelector('html')?.style.setProperty('font-size', fontSize + 'px')
}
</script>
<template>
  <div id="setting" v-if="showState.showSetting">
    <span id="smth_version">{{ config.version }}</span>
    <div v-if="config.onMobile">
      <div>
        <h3>显示</h3>
        <div>
          <label v-for="el in frameConfig.component" :key="el.name" :class="{ checked: el.show }">
            <input type="checkbox" :el-css-display="el.el" v-model="el.show" />{{ el.name }}
          </label>
          <!-- <br /> -->
        </div>
      </div>
      <hr />
      <div>
        <h3>
          字体大小:<span> {{ cssConfig.fontSize }} </span>
        </h3>
        <button @click="cssConfig.fontSize--">减小字体</button>
        <button @click="cssConfig.fontSize++">增大字体</button>
      </div>
      <hr />
      <div>
        <h3>首页</h3>
        <div>
          <label v-for="el in mainpageConfig.section" :key="el.name" :class="{ checked: el.show }">
            <input type="checkbox" :el-css-display="el.el" v-model="el.show" />{{ el.name }}
          </label>
        </div>
      </div>
      <hr />
      <div>
        <h3>精简模式</h3>
        <label :class="{ checked: simplifyConfig.simplify }">
          <input type="checkbox" v-model="simplifyConfig.simplify" />精简显示帖子内容
          <!-- <input type="checkbox" v-model="simplifyConfig.simplify" /> -->
        </label>
        <br />
        <div>
          <label v-for="el in simplifyConfig.func" :key="el.name" :class="{ checked: el.show }">
            <input type="checkbox" :el-css-display="el.el" v-model="el.show" />{{ el.name }}
          </label>
        </div>
      </div>
    </div>
    <hr />
    <CommonTags />
    <hr />
    <IPDB />
    <hr />
    <BackUp />
    <hr />
    <div>
      <span class="button" @click="cancle">取消</span>
      <span class="button" @click="apply">应用</span>
      <br />
    </div>
    <br />
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
  z-index: 101;
  height: 100%;
  overflow: scroll;
  /* width: 100%; */
}

#smth_version {
  float: right;
  color: gray;
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
  font-size: 1.2rem;
  float: right;
}
</style>
