<!-- layout的根组件  -->
<template>


  <div class="app-wrapper" :class="open">
    <!-- 左侧menu -->
    <Sidebar class="sidebar-container"></Sidebar>
    <div class="main-container">
      <div class="fixed-header">
        <Navbar></Navbar>
        <TagsView></TagsView>
      </div>
      <!-- 主要内容区  -->

      <Appmain>

      </Appmain>
    </div>
    <Music></Music>
  </div>
</template>
<script setup>
import Music from "../components/Music/index.vue";
import Sidebar from "./components/Sidebar/index.vue";
import Appmain from "./components/Appmain.vue";
import Navbar from "./components/Navbar.vue";
import TagsView from "../components/TagsView/index.vue";
import { useStore } from "vuex";
import { computed } from "vue";
import { checkAdmin } from "../api/login";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const open = computed(() =>
    store.getters.sidebarOpened ? "openSidebar" : "hideSidebar"
);

// 检查本地存储中的标记
const welcomeMessageShown = localStorage.getItem("welcomeMessageShown");

// 如果标记为null，表示用户首次进入系统，显示欢迎消息
if (welcomeMessageShown === null) {
  checkAdmin().then(async ({ data }) => {
    if (data.code) {
      ElMessage({
        showClose: true,
        message: "您是非管理员账号，无法对芯系小助手管理系统进行操作",
        type: "error",
        grouping: true,
      });
    } else {
      ElMessage({
        showClose: true,
        message: "欢迎回来亲爱的工程师",
        type: "success",
        grouping: true,
      });

      // 设置本地存储标记，表示欢迎消息已经显示过
      localStorage.setItem("welcomeMessageShown", "true");
    }
  });
}
</script>


<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  .main-container {
    height: 100%;
    transition: margin-left 0.28s;
    margin-left: $sideBarWidth;
    position: relative;
    background-color: #f0f2f5;

    transition: margin-left, $sideBarDuration !important;
    overflow-y: auto;

    .fixed-header {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9;
      // 减去 侧边导航栏的宽度
      width: calc(100% - #{$sideBarWidth});
      transition: width #{$sideBarDuration};
    }
  }

  .sidebar-container {
    overflow: hidden;
    position: fixed;
    width: $sideBarWidth;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: $menuBg;
    transition: width #{$sideBarDuration};
    overflow-y: auto;

    &::-webkit-scrollbar { // 隐藏滚动条
      display: none;
    }
  }
}

.openSidebar {
  // 展开时
  .sidebar-container {
    // 210px
    width: $sideBarWidth !important;
  }

  :deep(.el-menu--vertical) {
    margin-top: 82px !important;
  }
}

.hideSidebar {
  // 折叠时
  .sidebar-container {
    width: $hideSideBarWidth !important;
    // 54px
  }

  .main-container {
    margin-left: $hideSideBarWidth !important;
  }

  .fixed-header {
    width: calc(100% - $hideSideBarWidth) !important;
  }

  :deep(.el-menu--vertical) {
    margin-top: 82px !important;
  }
}
</style>
