<script lang="ts" setup>
import smthScriptConfig from '@/scripts/smthScriptConfig'
import { useAppStateStore } from '@/stores/appStateStore'
import { watch, reactive } from 'vue'
import BackUp from './BackUp.vue'
const showState = useAppStateStore().appState.showState
const config = reactive(smthScriptConfig)
const onMobile = window.Android ? true : false
const { mainpageConfig, cssConfig, frameConfig, simplifyConfig } = config
const originFontSize = cssConfig.fontSize
watch(() => cssConfig.fontSize, setBaseFontSize)
function apply() {
  config.saveConfig()
  window.Android ? window.Android.reload() : window.location.reload()
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
  <div id="setting">
    <div>
      <h3>手机模式<input type="checkbox" v-model="config.onMobile" :disabled="onMobile" /></h3>
    </div>
    <br />
    <div v-if="config.onMobile">
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
        <h3>定义长滑动:</h3>
        <span>滑动距离大于<input v-model="config.longSwipeDistance" type="number" />px</span>
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
          精简显示帖子内容
          <input type="checkbox" v-model="simplifyConfig.simplify" />
          <!-- <input type="checkbox" v-model="simplifyConfig.simplify" /> -->
        </label>
        <div>
          <label v-for="el in simplifyConfig.func" :key="el.name" :class="{ checked: el.show }">
            {{ el.name }}
            <input type="checkbox" :el-css-display="el.el" v-model="el.show" />
          </label>
        </div>
      </div>
      <br />
    </div>
    <BackUp />
    <span class="button" @click="cancle" style="float: right">取消</span>
    <span> </span>
    <span class="button" @click="apply" style="float: right">应用</span>
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
  z-index: 10;
  height: 100%;
  /* width: 100%; */
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
