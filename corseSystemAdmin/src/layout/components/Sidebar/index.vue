<template>
  <div id="guide-sidebar">
    <!-- 头像区域 -->
    <div :class="open">
        <el-avatar :size="44" :src="`${baseURL}${staticURL}${avatarSrc}`" shape="square"/>
        <h1 class="logo-title" v-show="$store.getters.sidebarOpened">{{ $store.getters.userInfo.user }}</h1>
    </div>
    <SidebarMenu></SidebarMenu>
  </div>

</template>
<script setup>
import SidebarMenu from "./SidebarMenu.vue";
import {getAvatar} from "../../../hooks/getAvatar";
import {computed} from "vue";
import {useStore} from "vuex";
const {avatarSrc} = getAvatar()

const store =useStore()
const open=computed(()=>store.getters.sidebarOpened ? "logo-open" : "logo-hide")
</script>
<style lang="scss" scoped>
.logo-open {
  height: v-bind(logoHeight) + "px";
  padding: 10px 0 22px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 9999;
  background: $menuBg;
  width: $sideBarWidth;
  transition: width #{$sideBarDuration};
  .logo-title {
    margin-left: 10px;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 16px;
    white-space: nowrap;
  }

}
:deep(.logo-hide){
  position: fixed;
  background: $menuBg;
  width: $hideSideBarWidth;
  padding: 10px;
  z-index: 9999;
  transition: margin-left, $sideBarDuration !important;
}

</style>
