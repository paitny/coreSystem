<template>
<div>
  <el-tooltip
      class="box-item"
      effect="dark"
      content="功能引导"
      placement="bottom"
  >
    <div>
      <svg-icon icon="guide"
                @click.stop="startGuide"
                id="guide-start"
      ></svg-icon>
    </div>

  </el-tooltip>
</div>
</template>

<script setup>
import {onMounted} from "vue";
import Driver from "driver.js"
import steps from "./steps.ts"
import 'driver.js/dist/driver.min.css'
let driver=null
onMounted(()=>{
  driver=new Driver({
    // 禁止点击蒙版关闭
    allowClose: false,
    closeBtnText: "关闭",
    nextBtnText: "下一个",
    prevBtnText: "上一个",
    animate: false,
    onHighlighted(element) {
      const node = element.node;
      const divHighlight = document.querySelector(
          "#driver-highlighted-element-stage"
      );
      if (node.id === "guide-sidebar") {
        divHighlight.classList.add("change");
      } else {
        divHighlight.classList.remove("change");
      }
    },
  })
})

const startGuide=()=>{
  //初始化步骤
  driver.defineSteps(steps)
  driver.start()
}
</script>

<style lang="scss" scoped>
:global(#driver-highlighted-element-stage.change) {
  height: auto !important;
  top: 0 !important;
  bottom: 0 !important;
}
</style>
