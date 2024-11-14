<template>

  <div class="tags-view-container" id="guide-tagsView">
    <LeftRight>
      <router-link
          :to="item.path"
          v-for="(item, index) in tagsViewList"
          :key="item.path"
          class="tags-view-item"
          :class="{ active: isActive(item) }"
          @contextmenu.prevent="openContextMenu($event, index)"
      >
        {{ item.meta.title }}
        <el-icon
            class="el-icon-close"
            v-show="!isActive(item)"
            @click.stop.prevent="closeTag(index)"
        >
          <Close />
        </el-icon>
      </router-link>
    </LeftRight>
      <TextMenu
          v-show="visible"
          :index="selectIndex"
          :style="menuStyle"
      ></TextMenu>


  </div>
</template>
<script setup>
import TextMenu from "./components/contextMenu.vue";
import LeftRight from "./components/leftRightSwiperScroll/index.vue";
import {computed, ref, watch} from "vue";
import { useStore } from "vuex";
import { Close } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useStore();
const visible = ref(false);
const selectIndex = ref(0);
const menuStyle = ref({});
const tagsViewList = computed(() => store.getters.tagsViewList);

const isActive = (tag) => route.path === tag.path;

const fn = () => {
  store.dispatch("app/addTagsViewList");
};
const closeTag = (index) => {
  store.dispatch("app/removeTagsViewList", {
    type: "index",
    index,
  });
};

const openContextMenu = (event, index) => {
  // event 获取鼠标的位置 方便生成 menu的位置
  const { x, y } = event;
  menuStyle.value = {
    left: x + "px",
    top: y + "px",
  };
  selectIndex.value = index; // 点击哪个 router-link 就把index更新到menu组件中
  visible.value = true;
};
const closeMenu = () => {
  visible.value = false;
};
watch(visible, (newVisible) => {
  if (newVisible) {
    document.addEventListener("click", closeMenu);
  } else {
    document.removeEventListener("click", closeMenu);
  }
});
</script>
<style lang="scss" scoped>
.tags-view-container {
  overflow: hidden;
  height: 34px;
  width: 100%;
  min-width: 960px;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-item {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 26px;
    line-height: 26px;
    border: 1px solid #8967FC;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-left: 5px;
    margin-top: 4px;
    border-radius: 5px;
    &:first-of-type {
      margin-left: 30px;
    }
    &:last-of-type {
      margin-right: 15px;
    }
    &.active {
      color: #fff;
      background-color: $tagsView;
      border-color: $menuBg;
      &::before {
        content: "";
        background: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 4px;
      }
    }
    // close 按钮
    .el-icon-close {
      width: 16px;
      height: 16px;
      margin-left: 8px;
      line-height: 10px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      vertical-align: -1px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: red;
        color: #fff;
      }
    }
  }
}
</style>
