<template>
<div class="hamburger-container"  @click="changeSidebarOpened">
  <svg-icon :icon="icon"  id="guide-hamburger"></svg-icon>
</div>
</template>

<script setup>
import {useStore} from "vuex";
import {computed} from "vue";
const store=useStore()
const icon=computed(()=>{
  return store.getters.sidebarOpened?"hamburger-opened":"hamburger-closed"
})
const changeSidebarOpened = () => {
  store.commit("app/changeSidebarOpened");
};
</script>

<style lang="scss" scoped>
.hamburger-container {
  padding: 0 16px;
  .hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
}
</style>
