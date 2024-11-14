<!-- 导航条区域  -->
<template>
  <div class="navbar">
    <!-- 汉堡包区域 -->
    <Hamburger class="hamburger-container"></Hamburger>
    <!-- 面包屑区域 -->
    <Breadcrumb></Breadcrumb>
<div class="right-menu">
  <div style="position: relative;" v-if="$store.getters.userInfo.user">
    <!-- 主要内容 -->
    <router-link to="/feedback">
    <div style="margin-right: 20px;cursor: pointer">
      <svg-icon icon="userFeedback"></svg-icon>
    </div>
    </router-link>
    <!-- 计数小圆标 -->
    <div  v-if="unreadCount > 0" style="position: absolute; top: -8px; right: 10px; background-color: red; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 12px;">
      {{ unreadCount }} <!-- 这里是计数，你可以动态设置 -->
    </div>
  </div>

<!--  <div style="margin-right: 20px"><svg-icon icon="userFeedback"></svg-icon> </div>-->
  <div style="margin-right: 20px"><a href="https://github.com/paitny/myblogAdmin" target="_blank"><svg-icon icon="github" id="guide-github"></svg-icon></a></div>
  <HeaderSearch class="right-menu-item hover-effect"></HeaderSearch>
  <Guide class="right-menu-item hover-effect"></Guide>
  <Screenfull class="right-menu-item hover-effect"></Screenfull>
  <Avatar></Avatar>
</div>

  </div>
</template>
<script setup>
import Hamburger from "../../components/Hamburger/index.vue";
import Breadcrumb from "../../components/Breadcrumb/index.vue";
import Screenfull from '../../components/Screenfull/index.vue'
import HeaderSearch from '../../components/HeaderSearch/index.vue'
import Guide from "../../components/Guide/index.vue";
import Avatar from '../../components/Avatar/index.vue'

import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';

const unreadCount = ref(0);

onMounted(() => {
  const socketURL = process.env.NODE_ENV === "development" ? 'http://localhost:5200' : 'https://wypty.cn'
  const socket = io(socketURL);

  socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('getUnreadCount');
  });

  socket.on('unreadCount', (count) => {
    unreadCount.value = count;
  });
});

</script>
<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // 汉堡包压缩
  .hamburger-container {
    margin-left: 10px !important;
    float: left;
    line-height: 46px;
    height: 100%;
    cursor: pointer;
    // hover 动画
    transition: background 0.5s;

    &:hover {
      color: rgba(7,128,216);
    }
  }
  // 面包屑
  .breadcrumb-container {
    margin-right: 10px;
    float: left;
  }
  // 右侧菜单
  .right-menu {
    display: flex;
    align-items: center;
    float: right;
    padding-right: 16px;
    height: 60px;
    .right-menu-item {
      display: inline-block;
      padding: 0 18px 0 0;
      font-size: 24px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
      }
    }
  }
}
</style>
