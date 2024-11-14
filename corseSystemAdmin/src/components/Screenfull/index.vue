<template>
  <div>
    <svg-icon :icon="icon" @click="onToggle" id="guide-full"></svg-icon>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
// npm i screenfull
import screenfull from "screenfull";
// screenfull.isFullscreen = false

// 是否全屏
const isFullscreen = ref(false);

const icon = computed(
    //                          全屏状态图标         非全屏状态图标
    () => (isFullscreen.value ? "exit-fullscreen" : "fullscreen")
);

const onToggle = () => {
  screenfull.toggle();
};
const change = () => {
  isFullscreen.value = screenfull.isFullscreen;
};

onMounted(() => {
  screenfull.on("change", change);
});
onUnmounted(() => {
  screenfull.off("change", change);
});
</script>

<style lang="scss" scoped></style>
